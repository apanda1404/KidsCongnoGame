import { useState } from "react";
import { useAITutor } from "../../lib/stores/useAITutor";
import GameButton from "./GameButton";

export default function ProgressReport() {
  const { generateProgressReport, knowledgeGaps } = useAITutor();
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleGenerateReport = () => {
    const newReport = generateProgressReport();
    setReport(newReport);
    setShowReport(true);
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    return `${minutes} min`;
  };

  const formatAccuracy = (accuracy: number) => {
    return `${Math.round(accuracy * 100)}%`;
  };

  if (!showReport || !report) {
    return (
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}>
        <GameButton
          onClick={handleGenerateReport}
          style={{
            backgroundColor: '#9B59B6',
            width: '120px',
            height: '50px',
            fontSize: '0.9rem'
          }}
        >
          📊 Progress Report
        </GameButton>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '30px',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '25px',
          borderBottom: '2px solid #eee',
          paddingBottom: '15px'
        }}>
          <h2 style={{
            color: '#333',
            fontSize: '1.8rem',
            marginBottom: '10px'
          }}>
            📊 Learning Progress Report
          </h2>
          <p style={{
            color: '#666',
            fontSize: '1rem'
          }}>
            Last 7 days of learning activity
          </p>
        </div>

        {/* Overall Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '25px'
        }}>
          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🎮</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              {report.totalSessions}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Sessions</div>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>⏱️</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              {formatTime(report.totalTimeSpent)}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Play Time</div>
          </div>

          <div style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🎯</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              {formatAccuracy(report.averageAccuracy)}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Accuracy</div>
          </div>
        </div>

        {/* Game Breakdown */}
        <div style={{ marginBottom: '25px' }}>
          <h3 style={{
            color: '#333',
            fontSize: '1.3rem',
            marginBottom: '15px',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px'
          }}>
            🎲 Game Performance
          </h3>
          
          {Object.entries(report.gameBreakdown).map(([game, data]: [string, any]) => (
            <div key={game} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {game === 'shapes' ? '🔵' : 
                   game === 'counting' ? '🐱' :
                   game === 'colors' ? '🌈' :
                   game === 'patterns' ? '🔄' :
                   game === 'memory' ? '🧠' : '🤝'}
                </span>
                <span style={{ 
                  color: '#333', 
                  fontWeight: 'bold',
                  textTransform: 'capitalize'
                }}>
                  {game}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '15px',
                alignItems: 'center'
              }}>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                  {data.sessions} sessions
                </span>
                <span style={{ 
                  color: data.accuracy >= 0.8 ? '#28a745' : 
                        data.accuracy >= 0.6 ? '#ffc107' : '#dc3545',
                  fontWeight: 'bold'
                }}>
                  {formatAccuracy(data.accuracy)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Strengths & Improvements */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '25px'
        }}>
          <div>
            <h4 style={{
              color: '#28a745',
              fontSize: '1.1rem',
              marginBottom: '10px'
            }}>
              💪 Strengths
            </h4>
            {report.strengths.length > 0 ? (
              report.strengths.map((strength: string) => (
                <div key={strength} style={{
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  marginBottom: '5px',
                  fontSize: '0.9rem',
                  textTransform: 'capitalize'
                }}>
                  ✅ {strength}
                </div>
              ))
            ) : (
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Keep playing to build strengths!
              </p>
            )}
          </div>

          <div>
            <h4 style={{
              color: '#dc3545',
              fontSize: '1.1rem',
              marginBottom: '10px'
            }}>
              🎯 Focus Areas
            </h4>
            {report.improvements.length > 0 ? (
              report.improvements.map((improvement: string) => (
                <div key={improvement} style={{
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  marginBottom: '5px',
                  fontSize: '0.9rem',
                  textTransform: 'capitalize'
                }}>
                  📈 {improvement}
                </div>
              ))
            ) : (
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Great job! No focus areas needed.
              </p>
            )}
          </div>
        </div>

        {/* Knowledge Gaps */}
        {knowledgeGaps.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{
              color: '#333',
              fontSize: '1.1rem',
              marginBottom: '10px'
            }}>
              🧠 AI Insights
            </h4>
            {knowledgeGaps.map((gap, index) => (
              <div key={index} style={{
                backgroundColor: gap.difficulty === 'high' ? '#fff3cd' : '#d1ecf1',
                color: gap.difficulty === 'high' ? '#856404' : '#0c5460',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '8px',
                fontSize: '0.9rem'
              }}>
                <strong>
                  {gap.difficulty === 'high' ? '⚠️' : 'ℹ️'} {gap.description}
                </strong>
              </div>
            ))}
          </div>
        )}

        {/* Close Button */}
        <div style={{ textAlign: 'center' }}>
          <GameButton
            onClick={() => setShowReport(false)}
            style={{
              backgroundColor: '#6c757d',
              width: '120px',
              height: '50px',
              fontSize: '1rem'
            }}
          >
            Close
          </GameButton>
        </div>
      </div>
    </div>
  );
}