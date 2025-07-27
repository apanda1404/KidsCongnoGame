import { useGameProgress } from "../lib/stores/useGameProgress";
import { useGame } from "../lib/stores/useGame";
import ShapeSortingGame from "./games/ShapeSortingGame";
import CountingGame from "./games/CountingGame";
import ColorGame from "./games/ColorGame";
import GameButton from "./ui/GameButton";

export default function GameScene() {
  const { currentGame } = useGameProgress();
  const { restart } = useGame();

  const handleBackToMenu = () => {
    restart();
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative'
    }}>
      {/* Back Button */}
      <GameButton
        onClick={handleBackToMenu}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 100,
          backgroundColor: '#FF6B6B',
          width: '100px',
          height: '60px',
          fontSize: '1.2rem'
        }}
      >
        🏠 Home
      </GameButton>

      {/* Game Content */}
      {currentGame === 'shapes' && <ShapeSortingGame />}
      {currentGame === 'counting' && <CountingGame />}
      {currentGame === 'colors' && <ColorGame />}
    </div>
  );
}
