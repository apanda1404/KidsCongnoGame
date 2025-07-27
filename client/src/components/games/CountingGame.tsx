import { useState, useEffect } from "react";
import { useGameProgress } from "../../lib/stores/useGameProgress";
import { useAudio } from "../../lib/stores/useAudio";
import GameContainer from "../ui/GameContainer";
import GameButton from "../ui/GameButton";
import StarReward from "../ui/StarReward";
import { animals } from "../../lib/gameAssets";

interface CountingQuestion {
  items: string[];
  correctAnswer: number;
  options: number[];
}

export default function CountingGame() {
  const { progress, updateProgress } = useGameProgress();
  const { playHit, playSuccess } = useAudio();
  const [question, setQuestion] = useState<CountingQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions] = useState(5);

  const currentLevel = progress.counting || 1;
  const maxCount = Math.min(2 + currentLevel, 5);

  useEffect(() => {
    generateQuestion();
  }, [currentLevel]);

  const generateQuestion = () => {
    const count = Math.floor(Math.random() * maxCount) + 1;
    const animalEmoji = animals[Math.floor(Math.random() * animals.length)].emoji;
    
    const items = Array(count).fill(animalEmoji);
    
    // Generate wrong options
    const wrongOptions = [];
    for (let i = 1; i <= 5; i++) {
      if (i !== count && wrongOptions.length < 2) {
        wrongOptions.push(i);
      }
    }
    
    const options = [count, ...wrongOptions.slice(0, 2)].sort(() => Math.random() - 0.5);
    
    setQuestion({
      items,
      correctAnswer: count,
      options
    });
    setSelectedAnswer(null);
  };

  const handleAnswerSelect = (answer: number) => {
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
            updateProgress('counting', nextLevel);
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
            🐱 Count the Animals! 🐶
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
          How many animals do you see? Count and tap the right number! 🔢
        </p>

        {/* Items to Count */}
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
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {question.items.map((item, index) => (
              <div
                key={index}
                style={{
                  fontSize: '4rem',
                  animation: `bounce ${0.5 + index * 0.1}s ease-in-out infinite alternate`,
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Answer Options */}
        <div style={{
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {question.options.map((option) => {
            let buttonColor = '#4ECDC4';
            if (selectedAnswer === option) {
              buttonColor = option === question.correctAnswer ? '#96CEB4' : '#FF6B6B';
            }

            return (
              <GameButton
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
                style={{
                  backgroundColor: buttonColor,
                  width: '100px',
                  height: '100px',
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
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
              `🎉 Great job! That's ${question.correctAnswer}!` : 
              `🤔 Try again! Count carefully!`
            }
          </div>
        )}

        {/* Reward Display */}
        {showReward && <StarReward />}

        {/* Bounce Animation */}
        <style>{`
          @keyframes bounce {
            from { transform: translateY(0px); }
            to { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    </GameContainer>
  );
}
