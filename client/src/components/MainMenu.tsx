import { useGame } from "../lib/stores/useGame";
import { useGameProgress } from "../lib/stores/useGameProgress";
import { useAudio } from "../lib/stores/useAudio";
import GameButton from "./ui/GameButton";
import GameContainer from "./ui/GameContainer";

export default function MainMenu() {
  const { start } = useGame();
  const { setCurrentGame, progress } = useGameProgress();
  const { toggleMute, isMuted, startBackgroundMusic, isPlaying } = useAudio();

  const handleGameSelect = (gameType: 'shapes' | 'counting' | 'colors') => {
    // Start background music on first interaction
    startBackgroundMusic();
    setCurrentGame(gameType);
    start();
  };

  const handleSoundToggle = () => {
    // Start background music on first interaction if unmuting
    if (isMuted) {
      startBackgroundMusic();
    }
    toggleMute();
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
          onClick={handleSoundToggle}
          style={{
            backgroundColor: isMuted ? '#FF6B6B' : '#96CEB4',
            width: '180px',
            height: '70px',
            fontSize: '1.3rem',
            animation: isPlaying && !isMuted ? 'musicPulse 1s ease-in-out infinite' : 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isMuted ? '🔇' : '🎵'}
            <span>{isMuted ? 'Music Off' : 'Music On'}</span>
            {isPlaying && !isMuted && <span>♪</span>}
          </div>
        </GameButton>

        {/* Instructions */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{
            color: '#fff',
            fontSize: '1.1rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            maxWidth: '600px',
            margin: '0 auto 10px'
          }}>
            Tap any game to start learning and having fun! 🌟
          </p>
          {!isMuted && isPlaying && (
            <p style={{
              color: '#FFD700',
              fontSize: '1rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              margin: '0'
            }}>
              🎵 Enjoy the happy music while you play! 🎵
            </p>
          )}
          {isMuted && (
            <p style={{
              color: '#FFB6C1',
              fontSize: '1rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              margin: '0'
            }}>
              Tap the music button to hear fun sounds! 🔊
            </p>
          )}
        </div>
      </div>

      {/* CSS Animation for music pulse */}
      <style>{`
        @keyframes musicPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>
    </GameContainer>
  );
}
