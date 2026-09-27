import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Volume2, Sparkles, X, MessageSquare, Mic, HelpCircle, Lightbulb, ArrowRight, Smile, Share2, Check, Copy } from 'lucide-react';
import { CardRounded } from '../ui/CardRounded';
import { Button3D } from '../ui/Button3D';
import { speechFx } from '../../utils/speech';
import { soundFx } from '../../utils/audioSynth';
import { solveMathQuestion } from '../../services/aiMathSolver';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../context/LanguageContext';

export const FloatingPiBot = ({ onNavigate }) => {
  const { markAskedPiBot } = useGame();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('full'); // 'full' vs 'hint'
  const [messages, setMessages] = useState([
    {
      sender: 'pibot',
      text: t('pibot_greeting') || 'Hello! I am Pi-Bot, your AI Math tutor. Ask me any ICSE or CBSE math question!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [shareToast, setShareToast] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const quickPrompts = [
    { text: t('pibot_quick_algebra') || 'How to solve simultaneous equations?' },
    { text: t('pibot_quick_geometry') || 'State Mid-Point Theorem' },
    { text: t('pibot_quick_fractions') || 'How to add unlike fractions?' },
    { text: "HCF of 12 and 18" },
    { text: "Explain Pythagoras Theorem" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Deep-linking: auto-open and solve question if URL has ?q=... parameter
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get('q');
      if (q) {
        setIsOpen(true);
        setTimeout(() => {
          handleSend(q);
        }, 600);
      }
    } catch (e) {
      console.warn("Share link parameter parsing standby:", e);
    }
  }, []);

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
    soundFx.playClick();
  };

  const handleSend = (textOverride) => {
    const textToSend = textOverride || input;
    if (!textToSend || !textToSend.trim()) return;

    if (markAskedPiBot) markAskedPiBot();

    const newMsgs = [...messages, { sender: 'user', text: textToSend }];
    setMessages(newMsgs);
    setInput('');
    soundFx.playClick();

    setTimeout(() => {
      const aiReply = solveMathQuestion(textToSend, mode);
      setMessages(prev => [...prev, { sender: 'pibot', text: aiReply }]);
    }, 300);
  };

  const handleShareMessage = (textToShare, idx) => {
    soundFx.playClick();
    // Clean query text for URL
    const queryText = textToShare.split('\n')[0].replace(/[*_#`[\]()]/g, '').trim();
    const shareUrl = `${window.location.origin}${window.location.pathname}?q=${encodeURIComponent(queryText)}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedIdx(idx);
        setShareToast(true);
        setTimeout(() => setCopiedIdx(null), 2500);
        setTimeout(() => setShareToast(false), 3000);
      }).catch(() => {
        prompt("Copy this shareable link:", shareUrl);
      });
    } else {
      prompt("Copy this shareable link:", shareUrl);
    }
  };

  const handleToggleVoiceInput = () => {
    soundFx.playClick();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error("Speech recognition start failed:", e);
      setIsListening(false);
    }
  };

  return (
    <>
      {/* Global Floating Action Button */}
      {!isOpen && (
        <div
          onClick={toggleOpen}
          className="pibot-floating-btn animate-float hover-lift"
          title={t('pibot_title') || 'Ask Pi-Bot'}
          aria-label="Open AI Math Assistant"
        >
          <Bot size={22} />
          <span style={{
            position: 'absolute', top: -2, right: -2, width: '10px', height: '10px',
            backgroundColor: 'var(--primary)', borderRadius: '50%', border: '2px solid #fff'
          }} />
        </div>
      )}

      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div className="pibot-modal-window animate-pop" style={{ position: 'relative' }}>
          {/* Toast Notification Banner for Share Link */}
          {shareToast && (
            <div style={{
              position: 'absolute',
              top: '60px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#10b981',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: '700',
              zIndex: 100,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Check size={14} /> Shareable link copied to clipboard!
            </div>
          )}

          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1cb0f6, #00f0ff)',
            color: '#fff',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                backgroundColor: 'rgba(255,255,255,0.25)', display: 'flex',
                alignItems: 'center', justifyContent: 'center'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ fontFamily: 'var(--font-rounded)', fontSize: '1rem', fontWeight: '800' }}>
                  {t('pibot_title') || 'Pi-Bot'}
                </h3>
                <span style={{ fontSize: '0.7rem', opacity: 0.9, fontWeight: '700' }}>
                  24/7 AI Math Companion
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Mode Selector Toggle: Hint Mode vs Full Explanation */}
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-main)',
            padding: '5px',
            gap: '6px',
            borderBottom: '1px solid var(--border-light)'
          }}>
            <button
              onClick={() => setMode('full')}
              style={{
                flex: 1, padding: '5px', borderRadius: 'var(--radius-full)', border: 'none',
                backgroundColor: mode === 'full' ? 'var(--primary)' : 'transparent',
                color: mode === 'full' ? '#fff' : 'var(--text-muted)',
                fontWeight: '700', fontFamily: 'var(--font-rounded)', fontSize: '0.76rem', cursor: 'pointer'
              }}
            >
              📖 {t('solution') || 'Full Solution'}
            </button>
            <button
              onClick={() => setMode('hint')}
              style={{
                flex: 1, padding: '5px', borderRadius: 'var(--radius-full)', border: 'none',
                backgroundColor: mode === 'hint' ? 'var(--purple)' : 'transparent',
                color: mode === 'hint' ? '#fff' : 'var(--text-muted)',
                fontWeight: '700', fontFamily: 'var(--font-rounded)', fontSize: '0.76rem', cursor: 'pointer'
              }}
            >
              💡 {t('hints') || 'Step Clues'}
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%' }}>
                <div
                  style={{
                    backgroundColor: m.sender === 'user' ? 'var(--secondary)' : 'var(--bg-main)',
                    color: m.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                    padding: '10px 14px',
                    borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    fontSize: '0.88rem',
                    lineHeight: '1.45',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {m.text}
                </div>

                {/* Share Link Action for Bot Answers */}
                {m.sender === 'pibot' && idx > 0 && (
                  <button
                    onClick={() => handleShareMessage(m.text, idx)}
                    title="Share link to this question and answer"
                    style={{
                      alignSelf: 'flex-start',
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      marginTop: '4px',
                      padding: '2px 4px'
                    }}
                  >
                    {copiedIdx === idx ? <Check size={13} color="#10b981" /> : <Share2 size={13} />}
                    {copiedIdx === idx ? 'Link Copied!' : 'Share Link'}
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', padding: '6px 10px', backgroundColor: 'var(--bg-main)', borderTop: '1px solid var(--border-light)' }}>
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp.text)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-light)',
                  backgroundColor: 'var(--bg-card-solid)',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  color: 'var(--secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                ⚡ {qp.text}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{ padding: '8px 10px', display: 'flex', gap: '6px', backgroundColor: 'var(--bg-card-solid)', borderTop: '1px solid var(--border-light)', alignItems: 'center' }}>
            <input
              type="text"
              placeholder={isListening ? "Listening to your voice..." : (t('pibot_placeholder') || "Ask any math problem...")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--border-light)',
                fontSize: '0.85rem',
                outline: 'none',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontFamily: 'var(--font-sans)',
                minWidth: 0
              }}
            />

            {/* Mic Voice Input Button */}
            <button
              onClick={handleToggleVoiceInput}
              title="Voice Input"
              aria-label="Voice Input"
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: isListening ? 'var(--accent)' : 'var(--bg-main)',
                color: isListening ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              <Mic size={16} />
            </button>

            {/* Direct Send / Ask Button */}
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              title="Send question"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: input.trim() ? 'var(--secondary)' : 'var(--border-light)',
                color: '#ffffff',
                border: 'none',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-rounded)',
                flexShrink: 0,
                transition: 'background-color 0.2s'
              }}
            >
              <Send size={15} />
              {t('pibot_send') || 'Send'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
