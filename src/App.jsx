import React, { useState } from 'react';
import './App.css';
import ai from './assets/ai.png'; // Your AI image/gif
import axios from 'axios';
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;



function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('Listening...');
  const [language, setLanguage] = useState('en-IN');

  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = language;
    window.speechSynthesis.speak(utter);
  };

  const handleGemini = async (prompt) => {
    try {
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
        }
      );
      const output = res.data.candidates[0].content.parts[0].text;
      setAnswer(output);
      speak(output);
    } catch (err) {
      setAnswer("❌ Error fetching response");
      speak("Sorry, there was an error");
    }
  };

  const startListening = () => {
    const recog = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recog.lang = language;
    recog.start();

    recog.onresult = (e) => {
      const voiceInput = e.results[0][0].transcript;
      setQuestion(voiceInput);
      handleGemini(voiceInput);
    };
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en-IN' ? 'hi-IN' : 'en-IN'));
    speak(`Language changed to ${language === 'en-IN' ? 'Hindi' : 'English'}`);
  };

  return (
    
    <div className="maindiv">
       <h1>🎙️  AI Assistant</h1>
      <img src={ai} alt="AI Bot" className="robot-img" />

     
      <button onClick={startListening}>🎤 Speak</button>
      <button onClick={toggleLanguage}>🌐 {language === 'en-IN' ? 'Switch to Hindi' : 'Switch to English'}</button>
      <p><strong>You:</strong> {question}</p>
      <p><strong>AI:</strong> {answer}</p>
    </div>
  );
}

export default App;
