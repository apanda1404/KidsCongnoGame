import { useGame } from "../lib/stores/useGame";
import { useGameProgress } from "../lib/stores/useGameProgress";
import { useAudio } from "../lib/stores/useAudio";
import GameButton from "./ui/GameButton";
import GameContainer from "./ui/GameContainer";

export default function MainMenu() {
  const { start } = useGame();
  const { setCurrentGame, progress } = useGameProgress();
  const { toggleMute, isMuted } = useAudio();

  const handleGameSelect = (gameType: 'shapes' | 'counting' | 'colors') => {
    setCurrentGame(gameType);
    start();
  };

  const games = [
    {
      id: 'shapes' as const,
      title: 'Shape Sorting',
      description: 'Match shapes with their homes!',
      icon: '🔵',
      color: '#FF6B6B'
    },
    {
      id: 'counting' as const,
      title: 'Count & Fun',
      description: 'Count the cute animals!',
      icon: '🐱',
      color: '#4ECDC4'
    },
    {
      id: 'colors' as const,
      title: 'Color Match',
      description: 'Find matching colors!',
      icon: '🌈',
      color: '#45B7D1'
    }
  ];

  return (
    <GameContainer>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '20px',
        textAlign: 'center'
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: '3rem',
          color: '#fff',
          marginBottom: '20px',
          textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 'bold'
        }}>
          🎮 Fun Learning Games! 🎮
        </h1>

        {/* Game Selection */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          maxWidth: '800px',
          width: '100%',
          marginBottom: '30px'
        }}>
          {games.map((game) => (
            <GameButton
              key={game.id}
              onClick={() => handleGameSelect(game.id)}
              style={{
                backgroundColor: game.color,
                minHeight: '150px',
                fontSize: '1.2rem',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '10px' }}>
                {game.icon}
              </div>
              <div style={{ fontWeight: 'bold' }}>
                {game.title}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                {game.description}
              </div>
              {progress[game.id] > 0 && (
                <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                  ⭐ Level {progress[game.id]}
                </div>
              )}
            </GameButton>
          ))}
        </div>

        {/* Sound Toggle */}
        <GameButton
          onClick={toggleMute}
          style={{
            backgroundColor: isMuted ? '#FF6B6B' : '#96CEB4',
            width: '150px',
            height: '60px',
            fontSize: '1.5rem'
          }}
        >
          {isMuted ? '🔇 Sound Off' : '🔊 Sound On'}
        </GameButton>

        {/* Instructions */}
        <p style={{
          color: '#fff',
          fontSize: '1.1rem',
          marginTop: '20px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          maxWidth: '600px'
        }}>
          Tap any game to start learning and having fun! 🌟
        </p>
      </div>
    </GameContainer>
  );
}
