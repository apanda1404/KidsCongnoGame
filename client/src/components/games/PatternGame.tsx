import { useState, useEffect } from "react";
import { useGameProgress } from "../../lib/stores/useGameProgress";
import { useAudio } from "../../lib/stores/useAudio";
import GameContainer from "../ui/GameContainer";
import GameButton from "../ui/GameButton";
import StarReward from "../ui/StarReward";
import { patterns } from "../../lib/gameAssets";

interface PatternQuestion {
  pattern: string[];
  options: string[];
  correctAnswer: string;
  sequence: string[];
}

export default function PatternGame() {
  const { progress, updateProgress } = useGameProgress();
  const { playHit, playSuccess } = useAudio();
  const [question, setQuestion] = useState<PatternQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions] = useState(5);

  const currentLevel = progress.patterns || 1;
  const patternLength = Math.min(3 + currentLevel, 6);

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  const generateQuestion = () => {
    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const patternElements = selectedPattern.pattern;
    
    // Create a repeating pattern
    const sequence = [];
    for (let i = 0; i < patternLength - 1; i++) {
      sequence.push(patternElements[i % patternElements.length]);
    }
    
    // The correct answer is the next element in the pattern
    const correctAnswer = patternElements[(patternLength - 1) % patternElements.length];
    
    // Create wrong options from other patterns
    const wrongOptions: string[] = [];
    const otherPatterns = patterns.filter(p => p.id !== selectedPattern.id);
    
    while (wrongOptions.length < 2 && wrongOptions.length < otherPatterns.length) {
      const randomPattern = otherPatterns[Math.floor(Math.random() * otherPatterns.length)];
      const randomElement = randomPattern.pattern[Math.floor(Math.random() * randomPattern.pattern.length)];
      
      if (!wrongOptions.includes(randomElement) && randomElement !== correctAnswer) {
        wrongOptions.push(randomElement);
      }
    }
    
    const options = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    setQuestion({
      pattern: patternElements,
      options,
      correctAnswer,
      sequence
    });
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    
    if (answer === question?.correctAnswer) {
      playSuccess();
      const newScore = score + 1;
      setScore(newScore);
      
      setTimeout(() => {
        if (newScore >= totalQuestions) {
          setShowReward(true);
          setTimeout(() => {
            const nextLevel = currentLevel + 1;
            updateProgress('patterns', nextLevel);
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
        setSelectedAnswer(null);
      }, 1000);
    }
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
            🔄 Pattern Fun! ✨
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
          marginBottom: '30px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          Look at the pattern! What comes next? 🤔
        </p>

        {/* Pattern Display */}
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
          minHeight: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            fontSize: '4rem'
          }}>
            {question.sequence.map((item, index) => (
              <div
                key={index}
                style={{
                  animation: `patternBounce ${0.5 + index * 0.1}s ease-in-out infinite alternate`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {item}
              </div>
            ))}
            
            {/* Question mark for missing element */}
            <div style={{
              fontSize: '4rem',
              color: '#FFD700',
              animation: 'patternPulse 1s ease-in-out infinite'
            }}>
              ❓
            </div>
          </div>
        </div>

        {/* Answer Options */}
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {question.options.map((option, index) => {
            let buttonColor = '#FFD700';
            if (selectedAnswer === option) {
              buttonColor = option === question.correctAnswer ? '#96CEB4' : '#FF6B6B';
            }

            return (
              <GameButton
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                style={{
                  backgroundColor: buttonColor,
                  width: '100px',
                  height: '100px',
                  fontSize: '3rem',
                  transform: selectedAnswer === option ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.3s ease'
                }}
              >
                {option}
              </GameButton>
            );
          })}
        </div>

        {/* Feedback */}
        {selectedAnswer !== null && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: selectedAnswer === question.correctAnswer ? '#96CEB4' : '#FF6B6B',
            padding: '15px 30px',
            borderRadius: '15px',
            fontSize: '1.5rem',
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            {selectedAnswer === question.correctAnswer ? 
              `🎉 Perfect! You found the pattern!` : 
              `🤔 Try again! Look at the pattern carefully!`
            }
          </div>
        )}

        {/* Reward Display */}
        {showReward && <StarReward />}

        {/* Animations */}
        <style>{`
          @keyframes patternBounce {
            from { transform: translateY(0px); }
            to { transform: translateY(-10px); }
          }
          
          @keyframes patternPulse {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
          }
        `}</style>
      </div>
    </GameContainer>
  );
}