import React, { useState } from 'react';
declare const window: any;

const SpeechToText = () => {
  const [transcript, setTranscript] = useState('');

  const handleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    }
    recognition.start();
  }

  return (
    <div>
      <button onClick={handleListen}>Listen</button>
      <p>{transcript}</p>
    </div>
  );
};

export default SpeechToText;
