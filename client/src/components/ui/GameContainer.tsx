import { ReactNode } from "react";

interface GameContainerProps {
  children: ReactNode;
}

export default function GameContainer({ children }: GameContainerProps) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #87CEEB 0%, #98FB98 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {children}
    </div>
  );
}
