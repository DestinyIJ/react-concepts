import React, { useState, useRef, MutableRefObject } from 'react';
declare const window: any;


const AudioToText = () => {
  const [transcript, setTranscript] = useState('');
  const audioRef: MutableRefObject<HTMLAudioElement> = useRef(new Audio());

  const handleListen = () => {
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.onresult = (event:any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    }
    recognition.start();
    audioRef.current.play();
  }

  return (
    <div>
      <button onClick={handleListen}>Listen</button>
      <p>{transcript}</p>
      <audio ref={audioRef} src="audio.mp3" />
    </div>
  );
};

export default AudioToText;
