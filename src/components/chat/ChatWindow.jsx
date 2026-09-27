import React, { useState } from 'react';
import { Bot, Send, Sparkles, Volume2, HelpCircle } from 'lucide-react';
import { CardRounded } from '../ui/CardRounded';
import { Button3D } from '../ui/Button3D';
import { speechFx } from '../../utils/speech';
import { solveMathQuestion } from '../../services/aiMathSolver';

export const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { sender: 'pibot', text: "Hello! I'm Pi-Bot, your AI Math Tutor grounded strictly in the ICSE & CBSE/NCERT Mathematics Knowledge Base! Ask me any curriculum questions, textbook PDF links, formulas, or calculations!" }
  ]);
  const [input, setInput] = useState('');

  const samplePrompts = [
    "Explain Place Value simply",
    "How to multiply 3-digit numbers?",
    "Class 10 Probability textbook pdf",
    "What are applications of trigonometry?"
  ];

  const handleSend = (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMsgs);
    setInput('');

    setTimeout(() => {
      const aiReply = solveMathQuestion(textToSend);
      setMessages(prev => [...prev, { sender: 'pibot', text: aiReply }]);
    }, 400);
  };

  return (
    <CardRounded style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{
          padding: '10px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #1cb0f6, #00f0ff)',
          color: '#fff'
        }}>
          <Bot size={24} />
        </div>
        <div>
          <h3 style={{ fontFamily: 'var(--font-rounded)', fontSize: '1.2rem', fontWeight: '700' }}>
            Pi-Bot AI Math Tutor
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700' }}>Online • Ready to help</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: m.sender === 'user' ? 'var(--secondary)' : 'var(--bg-main)',
              color: m.sender === 'user' ? '#fff' : 'var(--text-main)',
              padding: '12px 16px',
              borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              maxWidth: '80%',
              fontSize: '0.95rem',
              lineHeight: '1.4',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
            }}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Sample Prompts */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px' }}>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-card-solid)',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              color: 'var(--secondary)'
            }}
          >
            💡 {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Ask Pi-Bot any math question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-light)',
            fontSize: '0.95rem',
            outline: 'none',
            fontFamily: 'var(--font-sans)',
            backgroundColor: 'var(--bg-card-solid)',
            color: 'var(--text-main)'
          }}
        />
        <Button3D variant="secondary" onClick={() => handleSend()} icon={Send}>
          Ask
        </Button3D>
      </div>
    </CardRounded>
  );
};
