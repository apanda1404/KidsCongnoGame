import { useGame } from "../lib/stores/useGame";
import { useGameProgress } from "../lib/stores/useGameProgress";
import { useAudio } from "../lib/stores/useAudio";
import GameButton from "./ui/GameButton";
import GameContainer from "./ui/GameContainer";

export default function MainMenu() {
  const { start } = useGame();
  const { setCurrentGame, progress } = useGameProgress();
  const { toggleMute, isMuted, startBackgroundMusic, isPlaying } = useAudio();

  const handleGameSelect = (gameType: 'shapes' | 'counting' | 'colors' | 'patterns' | 'memory' | 'matching') => {
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

  const handleFullScreen = async () => {
    try {
      if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
        // Exit fullscreen if already in fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      } else {
        // Enter fullscreen
        const element = document.documentElement;
        if (element.requestFullscreen) {
          await element.requestFullscreen();
        } else if ((element as any).webkitRequestFullscreen) {
          // Safari support
          (element as any).webkitRequestFullscreen();
        } else if ((element as any).mozRequestFullScreen) {
          // Firefox support
          (element as any).mozRequestFullScreen();
        } else if ((element as any).msRequestFullscreen) {
          // IE/Edge support
          (element as any).msRequestFullscreen();
        } else {
          throw new Error('Fullscreen not supported');
        }
      }
    } catch (error) {
      console.log('Fullscreen error:', error);
      // Use a more user-friendly message
      setTimeout(() => {
        alert('🖥️ Fullscreen not available! Try pressing F11 on your keyboard for fullscreen mode.');
      }, 100);
    }
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
    },
    {
      id: 'patterns' as const,
      title: 'Pattern Fun',
      description: 'Complete the patterns!',
      icon: '🔄',
      color: '#FFD700'
    },
    {
      id: 'memory' as const,
      title: 'Memory Game',
      description: 'Remember what you see!',
      icon: '🧠',
      color: '#9B59B6'
    },
    {
      id: 'matching' as const,
      title: 'Match Pairs',
      description: 'Find things that go together!',
      icon: '🤝',
      color: '#FF8C42'
    }
  ];

  return (
    <GameContainer>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '100%',
        padding: '20px',
        textAlign: 'center',
        overflow: 'hidden'
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
          gridTemplateColumns: window.innerWidth <= 768 ? 
            'repeat(2, minmax(160px, 1fr))' : 
            'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '15px',
          maxWidth: '1000px',
          width: '100%',
          marginBottom: '20px',
          maxHeight: '75vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '10px',
          scrollBehavior: 'smooth',
          borderRadius: '15px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          WebkitOverflowScrolling: 'touch'
        }}>
          {games.map((game) => (
            <GameButton
              key={game.id}
              onClick={() => handleGameSelect(game.id)}
              style={{
                backgroundColor: game.color,
                minHeight: '170px',
                fontSize: '1.1rem',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
                {game.icon}
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                {game.title}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                {game.description}
              </div>
              {progress[game.id] > 0 && (
                <div style={{ fontSize: '0.7rem', marginTop: '3px' }}>
                  ⭐ Level {progress[game.id]}
                </div>
              )}
            </GameButton>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div style={{
          fontSize: '1rem',
          color: '#fff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          marginBottom: '20px',
          animation: 'scrollHint 2s ease-in-out infinite'
        }}>
          ↕️ Scroll to see all games! ↕️
        </div>

        {/* Control Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
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

          {/* Full Screen Button */}
          <GameButton
            onClick={handleFullScreen}
            style={{
              backgroundColor: '#9B59B6',
              width: '150px',
              height: '70px',
              fontSize: '1.3rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⛶</span>
              <span>Full Screen</span>
            </div>
          </GameButton>
        </div>

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
              margin: '0 0 10px 0'
            }}>
              Tap the music button to hear fun sounds! 🔊
            </p>
          )}
          <p style={{
            color: '#E6E6FA',
            fontSize: '0.9rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
            margin: '0'
          }}>
            For the best experience, try full screen mode or press F11 on your keyboard!
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes musicPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes scrollHint {
          0% { opacity: 0.7; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-5px); }
          100% { opacity: 0.7; transform: translateY(0); }
        }
      `}</style>
    </GameContainer>
  );
}
