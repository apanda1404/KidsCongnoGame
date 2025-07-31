import { useState, useEffect } from "react";
import { useGameProgress } from "../../lib/stores/useGameProgress";
import { useAudio } from "../../lib/stores/useAudio";
import GameContainer from "../ui/GameContainer";
import GameButton from "../ui/GameButton";
import StarReward from "../ui/StarReward";
import { matchingPairs } from "../../lib/gameAssets";

interface MatchingItem {
  id: string;
  emoji: string;
  name: string;
  category: string;
  matched: boolean;
}

export default function MatchingGame() {
  const { progress, updateProgress } = useGameProgress();
  const { playHit, playSuccess } = useAudio();
  const [leftItems, setLeftItems] = useState<MatchingItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchingItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [matches, setMatches] = useState(0);

  const currentLevel = progress.matching || 1;
  const numberOfPairs = Math.min(3 + currentLevel, 5);
  const totalMatches = numberOfPairs;

  useEffect(() => {
    initializeGame();
  }, [currentLevel]);

  const initializeGame = () => {
    const selectedPairs = matchingPairs.slice(0, numberOfPairs);
    
    const leftGameItems: MatchingItem[] = [];
    const rightGameItems: MatchingItem[] = [];

    selectedPairs.forEach((pair, index) => {
      leftGameItems.push({
        id: `left-${index}`,
        emoji: pair.items[0].emoji,
        name: pair.items[0].name,
        category: pair.category,
        matched: false
      });
      
      rightGameItems.push({
        id: `right-${index}`,
        emoji: pair.items[1].emoji,
        name: pair.items[1].name,
        category: pair.category,
        matched: false
      });
    });

    // Shuffle the right items to make it challenging
    const shuffledRightItems = rightGameItems.sort(() => Math.random() - 0.5);

    setLeftItems(leftGameItems);
    setRightItems(shuffledRightItems);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatches(0);
    setShowReward(false);
  };

  const handleLeftItemClick = (itemId: string) => {
    const item = leftItems.find(i => i.id === itemId);
    if (!item || item.matched) return;

    playHit();
    setSelectedLeft(itemId);
    
    // If right item is already selected, try to match
    if (selectedRight) {
      checkMatch(itemId, selectedRight);
    }
  };

  const handleRightItemClick = (itemId: string) => {
    const item = rightItems.find(i => i.id === itemId);
    if (!item || item.matched) return;

    playHit();
    setSelectedRight(itemId);
    
    // If left item is already selected, try to match
    if (selectedLeft) {
      checkMatch(selectedLeft, itemId);
    }
  };

  const checkMatch = (leftId: string, rightId: string) => {
    const leftItem = leftItems.find(i => i.id === leftId);
    const rightItem = rightItems.find(i => i.id === rightId);

    if (leftItem && rightItem && leftItem.category === rightItem.category) {
      // Match found!
      playSuccess();
      
      setTimeout(() => {
        setLeftItems(prev => prev.map(i => 
          i.id === leftId ? { ...i, matched: true } : i
        ));
        setRightItems(prev => prev.map(i => 
          i.id === rightId ? { ...i, matched: true } : i
        ));
        
        const newMatches = matches + 1;
        setMatches(newMatches);
        
        if (newMatches === totalMatches) {
          setShowReward(true);
          setTimeout(() => {
            const nextLevel = currentLevel + 1;
            updateProgress('matching', nextLevel);
            initializeGame();
          }, 2000);
        }
        
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 1000);
    } else {
      // No match - clear selections after a delay
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 1500);
    }
  };

  return (
    <GameContainer>
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            fontSize: '2rem',
            color: '#fff',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            marginBottom: '10px'
          }}>
            🤝 Match Pairs! 🧩
          </h2>
          <div style={{
            fontSize: '1.2rem',
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
          }}>
            Level {currentLevel} • Matches: {matches}/{totalMatches}
          </div>
        </div>

        {/* Instructions */}
        <p style={{
          fontSize: '1.1rem',
          color: '#fff',
          textAlign: 'center',
          marginBottom: '30px',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}>
          Find things that go together! Tap one from each side! 🔗
        </p>

        {/* Matching Items */}
        <div style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center',
          maxWidth: '800px',
          width: '100%'
        }}>
          {/* Left Column */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            alignItems: 'center'
          }}>
            <h3 style={{
              color: '#fff',
              fontSize: '1.5rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              marginBottom: '10px'
            }}>
              Pick One! 👈
            </h3>
            {leftItems.map((item) => (
              <GameButton
                key={item.id}
                onClick={() => handleLeftItemClick(item.id)}
                disabled={item.matched}
                style={{
                  backgroundColor: item.matched ? '#96CEB4' : 
                    selectedLeft === item.id ? '#FFD700' : '#FF8C42',
                  width: '120px',
                  height: '100px',
                  fontSize: '2.5rem',
                  opacity: item.matched ? 0.6 : 1,
                  border: selectedLeft === item.id ? '4px solid #FF6B6B' : 'none',
                  transform: selectedLeft === item.id ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  flexDirection: 'column',
                  gap: '5px'
                }}
              >
                <div>{item.emoji}</div>
                <div style={{ fontSize: '0.8rem' }}>{item.name}</div>
              </GameButton>
            ))}
          </div>

          {/* Center Connection Indicator */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{
              fontSize: '3rem',
              color: '#FFD700',
              animation: selectedLeft && selectedRight ? 'connectionPulse 0.5s ease-in-out infinite' : 'none'
            }}>
              ↔️
            </div>
          </div>

          {/* Right Column */}
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            alignItems: 'center'
          }}>
            <h3 style={{
              color: '#fff',
              fontSize: '1.5rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
              marginBottom: '10px'
            }}>
              Pick One! 👉
            </h3>
            {rightItems.map((item) => (
              <GameButton
                key={item.id}
                onClick={() => handleRightItemClick(item.id)}
                disabled={item.matched}
                style={{
                  backgroundColor: item.matched ? '#96CEB4' : 
                    selectedRight === item.id ? '#FFD700' : '#FF8C42',
                  width: '120px',
                  height: '100px',
                  fontSize: '2.5rem',
                  opacity: item.matched ? 0.6 : 1,
                  border: selectedRight === item.id ? '4px solid #FF6B6B' : 'none',
                  transform: selectedRight === item.id ? 'scale(1.1)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  flexDirection: 'column',
                  gap: '5px'
                }}
              >
                <div>{item.emoji}</div>
                <div style={{ fontSize: '0.8rem' }}>{item.name}</div>
              </GameButton>
            ))}
          </div>
        </div>

        {/* Selection Feedback */}
        {selectedLeft && selectedRight && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4ECDC4',
            padding: '15px 30px',
            borderRadius: '15px',
            fontSize: '1.3rem',
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            🤔 Checking if they go together...
          </div>
        )}

        {/* Reward Display */}
        {showReward && <StarReward />}

        {/* Animations */}
        <style>{`
          @keyframes connectionPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}</style>
      </div>
    </GameContainer>
  );
}