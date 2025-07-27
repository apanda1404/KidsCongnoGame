import { ReactNode, CSSProperties } from "react";

interface GameButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}

export default function GameButton({ 
  children, 
  onClick, 
  disabled = false, 
  style = {} 
}: GameButtonProps) {
  const baseStyle: CSSProperties = {
    backgroundColor: '#4ECDC4',
    border: 'none',
    borderRadius: '15px',
    color: '#fff',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily: 'Inter, sans-serif',
    padding: '15px 25px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    minWidth: '60px',
    minHeight: '60px',
    opacity: disabled ? 0.6 : 1,
    transform: 'translateY(0)',
    ...style
  };

  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(2px)';
      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (!disabled) {
      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(2px)';
      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLButtonElement>) => {
    if (!disabled) {
      (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    }
  };

  return (
    <button
      style={baseStyle}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
