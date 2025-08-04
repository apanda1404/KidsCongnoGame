import { useSpeechRecognition } from "../../lib/stores/useSpeechRecognition";
import GameButton from "./GameButton";

interface SpeechButtonProps {
  onSpeechResult?: (transcript: string, confidence: number) => void;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export default function SpeechButton({ onSpeechResult, style, disabled }: SpeechButtonProps) {
  const { 
    isListening, 
    isSupported, 
    startListening, 
    stopListening, 
    onSpeechResult: setSpeechCallback 
  } = useSpeechRecognition();

  const handleClick = () => {
    if (disabled) return;
    
    if (isListening) {
      stopListening();
    } else {
      // Set the callback if provided
      if (onSpeechResult) {
        setSpeechCallback(onSpeechResult);
      }
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <GameButton
        onClick={() => {}}
        style={{
          backgroundColor: '#999',
          opacity: 0.5,
          cursor: 'not-allowed',
          ...style
        }}
        disabled
      >
        🎤❌ Not Supported
      </GameButton>
    );
  }

  return (
    <GameButton
      onClick={handleClick}
      disabled={disabled}
      style={{
        backgroundColor: isListening ? '#FF6B6B' : '#4ECDC4',
        animation: isListening ? 'pulse 1s infinite' : 'none',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{isListening ? '🎤' : '🗣️'}</span>
        <span>{isListening ? 'Listening...' : 'Speak'}</span>
      </div>
      
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </GameButton>
  );
}