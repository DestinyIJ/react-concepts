import React, { useState } from 'react';

const TextToSpeech = () => {
  const [inputText, setInputText] = useState<string>('');

  const onSpeak = () => {
    // Use the native text-to-speech API to speak the text
    const utterance = new SpeechSynthesisUtterance(inputText);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center">
      <input
        className="border p-2 rounded"
        type="text"
        value={inputText}
        onChange={e => setInputText(e.target.value)}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={onSpeak}
      >
        Speak
      </button>
    </div>
  );
}

export default TextToSpeech