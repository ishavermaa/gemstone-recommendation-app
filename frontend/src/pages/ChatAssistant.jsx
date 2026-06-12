import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function ChatAssistant() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! I\'m your Gemstone Assistant. I can help you find the perfect gemstones for your needs.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = [
    'Which gemstone is best for wealth?',
    'Which gemstone helps with confidence?',
    'How should I wear Emerald?',
    'Which gemstone suits my zodiac sign?',
    'What are the benefits of Ruby?',
  ];

  const handleSendMessage = async (text = input) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // TODO: Replace with actual AI backend call
      // For now, simulating AI responses
      const responses = {
        wealth: 'Pyrite, Citrine, and Green Tourmaline are excellent gemstones for attracting wealth and prosperity.',
        confidence: 'Ruby, Carnelian, and Tiger\'s Eye are known to boost confidence and personal power.',
        emerald: 'Emerald should be worn as a ring on the little finger or pinky, preferably in gold or silver.',
        zodiac: 'To find your perfect gemstone, please tell me your zodiac sign!',
        ruby: 'Ruby is known for its powerful energy in promoting vitality, courage, and passion.',
      };

      let response = 'I\'m here to help! Can you be more specific about your question?';
      const lowerText = text.toLowerCase();

      if (lowerText.includes('wealth') || lowerText.includes('money') || lowerText.includes('prosperity')) {
        response = responses.wealth;
      } else if (
        lowerText.includes('confidence') ||
        lowerText.includes('confidence') ||
        lowerText.includes('strength')
      ) {
        response = responses.confidence;
      } else if (lowerText.includes('emerald') || lowerText.includes('wear')) {
        response = responses.emerald;
      } else if (lowerText.includes('zodiac') || lowerText.includes('sign')) {
        response = responses.zodiac;
      } else if (lowerText.includes('ruby')) {
        response = responses.ruby;
      }

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: 'bot',
            text: response,
          },
        ]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f5f5f5' }}>
      {/* Header */}
      <div style={{ background: '#8B7355', color: 'white', padding: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ margin: 0 }}>Gemstone Assistant</h1>
        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>Ask me anything about gemstones</p>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '1rem',
                borderRadius: '10px',
                background: message.type === 'user' ? '#8B7355' : '#e0e0e0',
                color: message.type === 'user' ? 'white' : 'black',
              }}
            >
              {message.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ padding: '1rem', borderRadius: '10px', background: '#e0e0e0' }}>
              <span>Assistant is typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid #ddd' }}>
          <p style={{ fontSize: '0.9rem', margin: '0 0 0.5rem 0', color: '#666' }}>Suggested questions:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#f0f0f0',
                  border: '1px solid #ddd',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '1rem', background: 'white', borderTop: '1px solid #ddd' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{ display: 'flex', gap: '0.5rem' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me about gemstones..."
            style={{
              flex: 1,
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '20px',
            }}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#8B7355',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
