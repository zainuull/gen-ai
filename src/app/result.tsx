'use client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useEffect, useState } from 'react';

interface IResult {
  gtts: Function;
  audioPlaying: boolean;
  transcript: string;
  isRecording: boolean;
  setTranscript: Function;
  stopAudio: Function;
  getWeather: Function;
}

const Result = (props: IResult) => {
  const { gtts, audioPlaying, transcript, setTranscript, isRecording, stopAudio, getWeather } =
    props;
  const genAI = new GoogleGenerativeAI('AIzaSyC-3Q3ZoBlAtDE471lReBHVnA372qa_lyE');
  const [res, setResponse] = useState('');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const aiRun = async () => {
    setResponse('');

    switch (transcript) {
      case 'hello Mindy':
        gtts('Hello Sir, how are you today ?');
        break;
      case 'can you help me':
        gtts('Yes sir, i could help you please');
        break;
      case 'open the YouTube':
        window.open('https://www.youtube.com', '_blank');
        gtts('Yes sir, here you are');
        break;
      case 'open the Instagram':
        window.open('https://www.instagram.com', '_blank');
        gtts('Yes sir, here you are');
        break;
      case 'open the Linkedin':
        window.open('https://www.linkedin.com', '_blank');
        gtts('Yes sir, here you are');
        break;
      case 'open the WhatsApp':
        window.open('https://web.whatsapp.com/', '_blank');
        gtts('Yes sir, here you are');
        break;
      case 'what weather today' || ' what weather today':
        const city = 'Cikarang';
        getWeather(city).then((weatherData: any) => {
          if (weatherData) {
            const { temperature, description } = weatherData;
            gtts(`Today's weather in ${city}: ${temperature}°C, ${description}`);
          } else {
            console.log('Failed to fetch weather data.');
          }
        });
        break;
      default:
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(transcript);
        const response = await result.response;
        const text = response.text();
        setResponse(text);
        const cleanedText = removeSymbols(text);
        gtts(cleanedText);
        setTranscript('');
        break;
    }
  };

  // const runVoice = (text: string) => {
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   const femaleVoice = voices?.find(
  //     (voice) =>
  //       (voice.name.includes('female') || voice.name.includes('Female')) &&
  //       voice.lang.includes('en-US')
  //   );

  //   if (femaleVoice) {
  //     utterance.voice = femaleVoice;
  //   } else if (voices.length > 0) {
  //     utterance.voice = voices[0];
  //   }

  //   window.speechSynthesis.speak(utterance);
  // };

  const removeSymbols = (text: string) => {
    return text.replace(/[^\w\s]/gi, '');
  };

  useEffect(() => {
    if (!isRecording && transcript) {
      aiRun();
      // const handleVoicesChanged = () => {
      //   const availableVoices = window.speechSynthesis.getVoices();
      //   setVoices(availableVoices);
      // };

      // window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      // handleVoicesChanged();
    }
  }, [isRecording]);

  return (
    <span className="flex flex-col items-center">
      {res && !isRecording && audioPlaying && (
        <>
          <h1 className="w-full flex items-center justify-center">Result : </h1>
          <p className="text-xl text-justify">{removeSymbols(res)}</p>
          <button onClick={() => stopAudio()} className="my-4 bg-red-600 px-4 py-1 rounded-lg">
            Stop
          </button>
        </>
      )}
    </span>
  );
};

export default Result;
