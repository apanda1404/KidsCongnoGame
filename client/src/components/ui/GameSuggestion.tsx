import { useEffect, useState } from "react";
import { useAITutor } from "../../lib/stores/useAITutor";
import { useGameProgress, GameType } from "../../lib/stores/useGameProgress";
import { useGame } from "../../lib/stores/useGame";
import GameButton from "./GameButton";

export default function GameSuggestion() {
  const { getNextGameSuggestion, knowledgeGaps } = useAITutor();
  const { setCurrentGame } = useGameProgress();
  const { start } = useGame();
  const [suggestion, setSuggestion] = useState<GameType | null>(null);
  const [showSuggestion, setShowSuggestion] = useState(false);

  useEffect(() => {
    const suggestedGame = getNextGameSuggestion();
    if (suggestedGame && knowledgeGaps.length > 0) {
      setSuggestion(suggestedGame);
      setShowSuggestion(true);
    }
  }, [getNextGameSuggestion, knowledgeGaps]);

  const handleAcceptSuggestion = () => {
    if (suggestion) {
      setCurrentGame(suggestion);
      start();
      setShowSuggestion(false);
    }
  };

  const handleDismiss = () => {
    setShowSuggestion(false);
  };

  if (!showSuggestion || !suggestion) return null;

  const gameNames = {
    shapes: 'Shape Sorting',
    counting: 'Count & Fun',
    colors: 'Color Match',
    patterns: 'Pattern Fun',
    memory: 'Memory Game',
    matching: 'Match Pairs'
  };

  const gameEmojis = {
    shapes: '🔵',
    counting: '🐱',
    colors: '🌈',
    patterns: '🔄',
    memory: '🧠',
    matching: '🤝'
  };

  const gap = knowledgeGaps.find(g => g.gameType === suggestion);
  const reason = gap ? 
    gap.difficulty === 'high' ? "You could use some practice with this!" :
    "This will help you improve!" :
    "This looks fun to try!";

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '15px',
      padding: '20px',
      maxWidth: '300px',
      boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      border: '2px solid #4ECDC4'
    }}>
      {/* AI Icon */}
      <div style={{
        textAlign: 'center',
        fontSize: '2rem',
        marginBottom: '10px'
      }}>
        🤖💡
      </div>

      {/* Suggestion Title */}
      <h4 style={{
        color: '#333',
        fontSize: '1.1rem',
        marginBottom: '10px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        AI Suggestion
      </h4>

      {/* Game Suggestion */}
      <div style={{
        textAlign: 'center',
        marginBottom: '15px'
      }}>
        <div style={{
          fontSize: '2rem',
          marginBottom: '5px'
        }}>
          {gameEmojis[suggestion]}
        </div>
        <div style={{
          color: '#333',
          fontSize: '1rem',
          fontWeight: 'bold',
          marginBottom: '5px'
        }}>
          Try {gameNames[suggestion]}!
        </div>
        <div style={{
          color: '#666',
          fontSize: '0.9rem'
        }}>
          {reason}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center'
      }}>
        <GameButton
          onClick={handleAcceptSuggestion}
          style={{
            backgroundColor: '#4ECDC4',
            width: '80px',
            height: '40px',
            fontSize: '0.9rem'
          }}
        >
          Let's Go! 🚀
        </GameButton>
        
        <GameButton
          onClick={handleDismiss}
          style={{
            backgroundColor: '#FF6B6B',
            width: '60px',
            height: '40px',
            fontSize: '0.9rem'
          }}
        >
          Later
        </GameButton>
      </div>
    </div>
  );
}