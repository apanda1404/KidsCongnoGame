import { useState, useEffect } from "react";
import { useAITutor } from "../../lib/stores/useAITutor";
import { GameType } from "../../lib/stores/useGameProgress";

interface CelebrationMessageProps {
  gameType: GameType;
  performance: {
    correct: number;
    total: number;
  };
  show: boolean;
  onComplete?: () => void;
}

export default function CelebrationMessage({ gameType, performance, show, onComplete }: CelebrationMessageProps) {
  const { getCelebrationMessage } = useAITutor();
  const [message, setMessage] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show && performance.total > 0) {
      const celebrationMsg = getCelebrationMessage(gameType, performance);
      setMessage(celebrationMsg);
      setIsVisible(true);

      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, gameType, performance, getCelebrationMessage, onComplete]);

  if (!isVisible || !message) return null;

  const accuracy = performance.correct / performance.total;
  const bgColor = accuracy === 1 ? '#FFD700' : accuracy >= 0.8 ? '#96CEB4' : '#87CEEB';

  return (
    <div style={{
      position: 'fixed',
      top: '20%',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: bgColor,
      borderRadius: '20px',
      padding: '20px 30px',
      textAlign: 'center',
      boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      border: '3px solid #fff',
      animation: 'celebrationBounce 0.6s ease-out'
    }}>
      <div style={{
        color: '#333',
        fontSize: '1.4rem',
        fontWeight: 'bold',
        lineHeight: '1.3'
      }}>
        {message}
      </div>

      <div style={{
        marginTop: '10px',
        fontSize: '1rem',
        color: '#555'
      }}>
        Score: {performance.correct}/{performance.total}
      </div>

      <style>{`
        @keyframes celebrationBounce {
          0% { transform: translateX(-50%) scale(0.5); opacity: 0; }
          50% { transform: translateX(-50%) scale(1.1); }
          100% { transform: translateX(-50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}