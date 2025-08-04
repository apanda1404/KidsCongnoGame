import { useState, useEffect } from "react";
import { useAITutor } from "../../lib/stores/useAITutor";
import { GameType } from "../../lib/stores/useGameProgress";
import GameButton from "./GameButton";

interface AIHintSystemProps {
  gameType: GameType;
  showHint?: boolean;
  onHintDismiss?: () => void;
  context?: any;
}

export default function AIHintSystem({ gameType, showHint, onHintDismiss, context }: AIHintSystemProps) {
  const { getPersonalizedHint } = useAITutor();
  const [currentHint, setCurrentHint] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showHint) {
      const hint = getPersonalizedHint(gameType, context);
      setCurrentHint(hint);
      setIsVisible(true);
    }
  }, [showHint, gameType, context, getPersonalizedHint]);

  const handleDismiss = () => {
    setIsVisible(false);
    onHintDismiss?.();
  };

  if (!isVisible || !currentHint) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '25px',
      maxWidth: '400px',
      textAlign: 'center',
      boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
      zIndex: 1000,
      border: '3px solid #FFD700'
    }}>
      {/* AI Assistant Icon */}
      <div style={{
        fontSize: '3rem',
        marginBottom: '15px'
      }}>
        🤖✨
      </div>

      {/* Hint Title */}
      <h3 style={{
        color: '#333',
        fontSize: '1.3rem',
        marginBottom: '15px',
        fontWeight: 'bold'
      }}>
        💡 Helpful Hint!
      </h3>

      {/* Hint Message */}
      <p style={{
        color: '#555',
        fontSize: '1.1rem',
        lineHeight: '1.4',
        marginBottom: '20px'
      }}>
        {currentHint}
      </p>

      {/* Dismiss Button */}
      <GameButton
        onClick={handleDismiss}
        style={{
          backgroundColor: '#4ECDC4',
          width: '120px',
          height: '50px',
          fontSize: '1rem'
        }}
      >
        Got it! 👍
      </GameButton>
    </div>
  );
}