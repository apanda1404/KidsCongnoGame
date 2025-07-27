import { useEffect, useState } from "react";

export default function StarReward() {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      delay: i * 0.1
    }));
    setStars(newStars);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
      {/* Celebration Message */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#FFD700',
        padding: '30px',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
        animation: 'celebrationPop 0.5s ease-out'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '10px'
        }}>
          🌟 ⭐ 🌟
        </div>
        <div style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#333',
          marginBottom: '10px'
        }}>
          Awesome Job!
        </div>
        <div style={{
          fontSize: '1.2rem',
          color: '#666'
        }}>
          You completed the level! 🎉
        </div>
      </div>

      {/* Floating Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: star.x,
            top: star.y,
            fontSize: '2rem',
            animation: `floatUp 2s ease-out ${star.delay}s both`,
            pointerEvents: 'none'
          }}
        >
          ⭐
        </div>
      ))}

      {/* CSS Animations */}
      <style>{`
        @keyframes celebrationPop {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
