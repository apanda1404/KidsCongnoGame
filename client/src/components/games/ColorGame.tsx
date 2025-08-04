import { useState, useEffect } from "react";
import { useGameProgress } from "../../lib/stores/useGameProgress";
import { useAudio } from "../../lib/stores/useAudio";
import { useSpeechRecognition } from "../../lib/stores/useSpeechRecognition";
import GameContainer from "../ui/GameContainer";
import GameButton from "../ui/GameButton";
import StarReward from "../ui/StarReward";
import SpeechButton from "../ui/SpeechButton";
import { colors } from "../../lib/gameAssets";

interface ColorQuestion {
  targetColor: { name: string; hex: string; emoji: string };
  options: { name: string; hex: string; emoji: string }[];
}

export default function ColorGame() {
  const { progress, updateProgress } = useGameProgress();
  const { playHit, playSuccess } = useAudio();
  const [question, setQuestion] = useState<ColorQuestion | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions] = useState(5);

  const currentLevel = progress.colors || 1;
  const optionsCount = Math.min(2 + currentLevel, 4);
  const { initializeSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    generateQuestion();
    initializeSpeechRecognition();
  }, [currentLevel]);

  const generateQuestion = () => {
    const targetColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Get wrong options
    const wrongColors = colors.filter(c => c.name !== targetColor.name);
    const shuffledWrong = wrongColors.sort(() => Math.random() - 0.5);
    const wrongOptions = shuffledWrong.slice(0, optionsCount - 1);
    
    const options = [targetColor, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setQuestion({
      targetColor,
      options
    });
    setSelectedColor(null);
  };

  const handleColorSelect = (colorName: string) => {
    setSelectedColor(colorName);
    
    if (colorName === question?.targetColor.name) {
      playSuccess();
      const newScore = score + 1;
      setScore(newScore);
      
      setTimeout(() => {
        if (newScore >= totalQuestions) {
          setShowReward(true);
          setTimeout(() => {
            const nextLevel = currentLevel + 1;
            updateProgress('colors', nextLevel);
            setScore(0);
            generateQuestion();
          }, 2000);
        } else {
          generateQuestion();
        }
      }, 1500);
    } else {
      playHit();
      setTimeout(() => {
        setSelectedColor(null);
      }, 1000);
    }
  };

  const handleSpeechResult = (transcript: string, confidence: number) => {
    console.log(`Speech: "${transcript}" (${confidence})`);
    
    const spokenColor = parseColorFromSpeech(transcript);
    if (spokenColor && question?.options.some(option => option.name === spokenColor)) {
      handleColorSelect(spokenColor);
    }
  };

  const parseColorFromSpeech = (transcript: string): string | null => {
    const lowerTranscript = transcript.toLowerCase();
    
    // Check for color names in the transcript
    const availableColors = question?.options.map(option => option.name) || [];
    
    for (const colorName of availableColors) {
      if (lowerTranscript.includes(colorName.toLowerCase())) {
        return colorName;
      }
    }
    
    return null;
  };

  if (!question) return null;

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
            🌈 Color Matching Fun! 🎨
          </h2>
          <div style={{
            fontSize: '1.2rem',
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            Level {currentLevel} • Score: {score}/{totalQuestions}
          </div>
        </div>

        {/* Instructions */}
        <p style={{
          fontSize: '1.1rem',
          color: '#fff',
          textAlign: 'center',
          marginBottom: '15px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          Find the matching color by tapping or saying its name! 👇
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
            disabled={selectedColor !== null}
          />
        </div>

        {/* Target Color */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            color: '#fff',
            marginBottom: '15px',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            Find this color:
          </div>
          
          <div style={{
            backgroundColor: question.targetColor.hex,
            width: '120px',
            height: '120px',
            borderRadius: '20px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            border: '4px solid #fff'
          }}>
            {question.targetColor.emoji}
          </div>
          
          <div style={{
            fontSize: '1.8rem',
            color: '#fff',
            marginTop: '15px',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            textTransform: 'capitalize'
          }}>
            {question.targetColor.name}
          </div>
        </div>

        {/* Color Options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '20px',
          maxWidth: '600px',
          width: '100%'
        }}>
          {question.options.map((color) => {
            let buttonStyle = {
              backgroundColor: color.hex,
              width: '120px',
              height: '120px',
              border: '4px solid #fff',
              transform: 'scale(1)' as string,
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)' as string
            };

            if (selectedColor === color.name) {
              if (color.name === question.targetColor.name) {
                buttonStyle.border = '6px solid #96CEB4';
                buttonStyle.transform = 'scale(1.1)';
                buttonStyle.boxShadow = '0 6px 12px rgba(0,0,0,0.4)';
              } else {
                buttonStyle.border = '6px solid #FF6B6B';
                buttonStyle.transform = 'scale(0.95)';
              }
            }

            return (
              <GameButton
                key={color.name}
                onClick={() => handleColorSelect(color.name)}
                disabled={selectedColor !== null}
                style={{
                  ...buttonStyle,
                  fontSize: '2rem',
                  transition: 'all 0.3s ease',
                  borderRadius: '20px'
                }}
              >
                {color.emoji}
              </GameButton>
            );
          })}
        </div>

        {/* Feedback */}
        {selectedColor !== null && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: selectedColor === question.targetColor.name ? '#96CEB4' : '#FF6B6B',
            padding: '15px 30px',
            borderRadius: '15px',
            fontSize: '1.5rem',
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            {selectedColor === question.targetColor.name ? 
              `🎉 Perfect! That's ${question.targetColor.name}!` : 
              `🤔 Try again! Look for ${question.targetColor.name}!`
            }
          </div>
        )}

        {/* Reward Display */}
        {showReward && <StarReward />}
      </div>
    </GameContainer>
  );
}
