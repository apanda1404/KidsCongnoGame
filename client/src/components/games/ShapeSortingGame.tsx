import { useState, useEffect } from "react";
import { useGameProgress } from "../../lib/stores/useGameProgress";
import { useAudio } from "../../lib/stores/useAudio";
import { useSpeechRecognition } from "../../lib/stores/useSpeechRecognition";
import { useAITutor } from "../../lib/stores/useAITutor";
import GameContainer from "../ui/GameContainer";
import GameButton from "../ui/GameButton";
import StarReward from "../ui/StarReward";
import SpeechButton from "../ui/SpeechButton";
import AIHintSystem from "../ui/AIHintSystem";
import CelebrationMessage from "../ui/CelebrationMessage";
import { shapes, animals } from "../../lib/gameAssets";

interface GameShape {
  id: string;
  type: string;
  color: string;
  emoji: string;
  matched: boolean;
}

interface GameSlot {
  id: string;
  type: string;
  filled: boolean;
}

export default function ShapeSortingGame() {
  const { progress, updateProgress } = useGameProgress();
  const { playHit, playSuccess } = useAudio();
  const [gameShapes, setGameShapes] = useState<GameShape[]>([]);
  const [gameSlots, setGameSlots] = useState<GameSlot[]>([]);
  const [draggedShape, setDraggedShape] = useState<GameShape | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  const currentLevel = progress.shapes || 1;
  const maxShapes = Math.min(3 + currentLevel, 6);
  const { initializeSpeechRecognition } = useSpeechRecognition();
  const { startSession, recordAttempt, endSession } = useAITutor();

  useEffect(() => {
    initializeGame();
    initializeSpeechRecognition();
    startSession('shapes');
    
    return () => {
      endSession();
    };
  }, [level, currentLevel]);

  const initializeGame = () => {
    const availableShapes = shapes.slice(0, maxShapes);
    const shuffledShapes = [...availableShapes].sort(() => Math.random() - 0.5);
    
    const newShapes: GameShape[] = shuffledShapes.map((shape, index) => ({
      id: `shape-${index}`,
      type: shape.type,
      color: shape.color,
      emoji: shape.emoji,
      matched: false
    }));

    const newSlots: GameSlot[] = availableShapes.map((shape, index) => ({
      id: `slot-${index}`,
      type: shape.type,
      filled: false
    }));

    setGameShapes(newShapes);
    setGameSlots(newSlots);
    setShowReward(false);
  };

  const handleShapePress = (shape: GameShape) => {
    if (shape.matched) return;
    setDraggedShape(shape);
    playHit();
  };

  const handleSlotPress = (slot: GameSlot) => {
    if (!draggedShape || slot.filled) return;

    if (draggedShape.type === slot.type) {
      // Correct match
      recordAttempt(true);
      setGameShapes(prev => 
        prev.map(s => s.id === draggedShape.id ? { ...s, matched: true } : s)
      );
      setGameSlots(prev =>
        prev.map(s => s.id === slot.id ? { ...s, filled: true } : s)
      );
      
      const newScore = score + 1;
      setScore(newScore);
      setWrongAttempts(0); // Reset wrong attempts on success
      playSuccess();

      // Check if all shapes are matched
      if (newScore === maxShapes) {
        setShowCelebration(true);
        setShowReward(true);
        setTimeout(() => {
          const nextLevel = currentLevel + 1;
          updateProgress('shapes', nextLevel);
          setLevel(nextLevel);
          setScore(0);
          initializeGame();
        }, 3000);
      }
    } else {
      // Wrong match
      recordAttempt(false, 'wrong_shape_match');
      const newWrongAttempts = wrongAttempts + 1;
      setWrongAttempts(newWrongAttempts);
      playHit();
      
      // Show hint after 2 wrong attempts
      if (newWrongAttempts >= 2) {
        setShowHint(true);
        setWrongAttempts(0);
      }
    }

    setDraggedShape(null);
  };

  const handleSpeechResult = (transcript: string, confidence: number) => {
    console.log(`Speech: "${transcript}" (${confidence})`);
    
    // Convert speech to shape selection
    const spokenShape = parseShapeFromSpeech(transcript);
    if (spokenShape) {
      const shape = gameShapes.find(s => s.type === spokenShape && !s.matched);
      if (shape) {
        handleShapePress(shape);
      }
    }
  };

  const parseShapeFromSpeech = (transcript: string): string | null => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Shape keywords mapping
    const shapeKeywords = {
      'circle': ['circle', 'round', 'ball', 'red'],
      'square': ['square', 'box', 'blue'],
      'triangle': ['triangle', 'three', 'point'],
      'star': ['star', 'yellow'],
      'heart': ['heart', 'love', 'pink'],
      'diamond': ['diamond', 'gem', 'purple']
    };

    for (const [shapeType, keywords] of Object.entries(shapeKeywords)) {
      if (keywords.some(keyword => lowerTranscript.includes(keyword))) {
        return shapeType;
      }
    }
    
    return null;
  };

  return (
    <GameContainer>
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            marginBottom: '10px'
          }}>
            🔵 Shape Sorting Fun! 🔺
          </h2>
          <div style={{
            fontSize: '1.2rem',
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            Level {currentLevel} • Score: {score}/{maxShapes}
          </div>
        </div>

        {/* Instructions */}
        <p style={{
          fontSize: '1.1rem',
          color: '#fff',
          textAlign: 'center',
          marginBottom: '20px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          Tap a shape or say its name! Then tap its matching home! 🏠
        </p>

        {/* Speech Button */}
        <div style={{ marginBottom: '20px' }}>
          <SpeechButton 
            onSpeechResult={handleSpeechResult}
            style={{
              width: '200px',
              height: '50px',
              fontSize: '1rem'
            }}
          />
        </div>

        {/* Game Area */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          alignItems: 'center',
          width: '100%',
          maxWidth: '800px'
        }}>
          {/* Shapes to sort */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '20px',
            minHeight: '120px'
          }}>
            {gameShapes.filter(shape => !shape.matched).map((shape) => (
              <GameButton
                key={shape.id}
                onClick={() => handleShapePress(shape)}
                style={{
                  backgroundColor: draggedShape?.id === shape.id ? '#FFD700' : shape.color,
                  width: '80px',
                  height: '80px',
                  fontSize: '2.5rem',
                  border: draggedShape?.id === shape.id ? '4px solid #FF6B6B' : 'none',
                  transform: draggedShape?.id === shape.id ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                {shape.emoji}
              </GameButton>
            ))}
          </div>

          {/* Slots for shapes */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: '20px',
            minHeight: '120px'
          }}>
            {gameSlots.map((slot) => {
              const shapeInfo = shapes.find(s => s.type === slot.type);
              return (
                <GameButton
                  key={slot.id}
                  onClick={() => handleSlotPress(slot)}
                  style={{
                    backgroundColor: slot.filled ? '#96CEB4' : '#f0f0f0',
                    width: '80px',
                    height: '80px',
                    fontSize: '2.5rem',
                    border: '3px dashed #999',
                    opacity: slot.filled ? 1 : 0.7
                  }}
                >
                  {slot.filled ? shapeInfo?.emoji : '?'}
                </GameButton>
              );
            })}
          </div>
        </div>

        {/* Selected Shape Indicator */}
        {draggedShape && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#FFD700',
            padding: '15px',
            borderRadius: '15px',
            fontSize: '1.2rem',
            color: '#333',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            Selected: {draggedShape.emoji} • Tap its home or say "circle", "square", etc.!
          </div>
        )}

        {/* AI Components */}
        <AIHintSystem 
          gameType="shapes"
          showHint={showHint}
          onHintDismiss={() => setShowHint(false)}
          context={{ currentShapes: gameShapes, selectedShape: draggedShape }}
        />
        
        <CelebrationMessage 
          gameType="shapes"
          performance={{ correct: score, total: maxShapes }}
          show={showCelebration}
          onComplete={() => setShowCelebration(false)}
        />

        {/* Reward Display */}
        {showReward && <StarReward />}
      </div>
    </GameContainer>
  );
}
