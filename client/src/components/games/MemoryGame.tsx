import { useState, useEffect } from "react";
import { useGameProgress } from "../../lib/stores/useGameProgress";
import { useAudio } from "../../lib/stores/useAudio";
import GameContainer from "../ui/GameContainer";
import GameButton from "../ui/GameButton";
import StarReward from "../ui/StarReward";
import { memoryItems } from "../../lib/gameAssets";

interface MemoryCard {
  id: string;
  emoji: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const { progress, updateProgress } = useGameProgress();
  const { playHit, playSuccess } = useAudio();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [showReward, setShowReward] = useState(false);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const currentLevel = progress.memory || 1;
  const cardPairs = Math.min(3 + currentLevel, 6);
  const totalMatches = cardPairs;

  useEffect(() => {
    initializeGame();
  }, [currentLevel]);

  const initializeGame = () => {
    const selectedItems = memoryItems.slice(0, cardPairs);
    const gameCards: MemoryCard[] = [];
    
    // Create pairs of cards
    selectedItems.forEach((item, index) => {
      gameCards.push({
        id: `${item.id}-1`,
        emoji: item.emoji,
        name: item.name,
        isFlipped: false,
        isMatched: false
      });
      gameCards.push({
        id: `${item.id}-2`,
        emoji: item.emoji,
        name: item.name,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle the cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setShowReward(false);
    setGameStarted(false);

    // Show all cards for 3 seconds at the start
    setTimeout(() => {
      setCards(prev => prev.map(card => ({ ...card, isFlipped: true })));
      setTimeout(() => {
        setCards(prev => prev.map(card => ({ ...card, isFlipped: false })));
        setGameStarted(true);
      }, 2000);
    }, 500);
  };

  const handleCardClick = (cardId: string) => {
    if (!gameStarted || flippedCards.length >= 2) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    playHit();

    // Flip the card
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found!
        playSuccess();
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true } 
              : c
          ));
          
          const newMatches = matches + 1;
          setMatches(newMatches);
          
          if (newMatches === totalMatches) {
            setShowReward(true);
            setTimeout(() => {
              const nextLevel = currentLevel + 1;
              updateProgress('memory', nextLevel);
              initializeGame();
            }, 2000);
          }
          
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
        }, 1500);
      }
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
            🧠 Memory Game! 💭
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
          {!gameStarted ? "Remember where the items are! 👀" : "Find matching pairs! 🔍"}
        </p>

        {/* Memory Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(4, Math.ceil(Math.sqrt(cardPairs * 2)))}, 1fr)`,
          gap: '15px',
          maxWidth: '600px',
          width: '100%'
        }}>
          {cards.map((card) => (
            <GameButton
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={!gameStarted || card.isMatched}
              style={{
                backgroundColor: card.isFlipped || card.isMatched ? '#FFD700' : '#9B59B6',
                width: '80px',
                height: '80px',
                fontSize: card.isFlipped || card.isMatched ? '2.5rem' : '1.5rem',
                opacity: card.isMatched ? 0.6 : 1,
                transform: flippedCards.includes(card.id) ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease',
                cursor: gameStarted && !card.isMatched ? 'pointer' : 'default'
              }}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </GameButton>
          ))}
        </div>

        {/* Game Status */}
        {!gameStarted && (
          <div style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#4ECDC4',
            padding: '15px 30px',
            borderRadius: '15px',
            fontSize: '1.5rem',
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            📚 Study time! Remember the positions!
          </div>
        )}

        {/* Reward Display */}
        {showReward && <StarReward />}
      </div>
    </GameContainer>
  );
}