'use client';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useEffect, useState } from 'react';

interface IResult {
  gtts: Function;
  audioPlaying: boolean;
  setAudioPlaying: Function;
  transcript: string;
  isRecording: boolean;
  setTranscript: Function;
  stopAudio: Function;
  setAudio: Function;
  getWeather: Function;
}

const Result = (props: IResult) => {
  const {
    gtts,
    audioPlaying,
    setAudioPlaying,
    transcript,
    setTranscript,
    isRecording,
    stopAudio,
    setAudio,
    getWeather,
  } = props;
  const genAI = new GoogleGenerativeAI('AIzaSyC-3Q3ZoBlAtDE471lReBHVnA372qa_lyE');
  const [res, setResponse] = useState('');
  const [loading, setIsLoading] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const aiRun = async () => {
    setResponse('');

    switch (transcript) {
      case 'hello Mindy':
        // gtts('Hello Sir, how are you today ?');
        runVoice('Hello Sir, how are you today ?');
        setTranscript('');
        break;
      case 'can you help me' || ' can you help me':
        // gtts('Yes sir, i could help you please');
        runVoice('Yes sir, i could help you please');
        setTranscript('');
        break;
      case 'open the YouTube' || ' open the YouTube':
        window.open('https://www.youtube.com', '_blank');
        // gtts('Yes sir, here you are');
        runVoice('Yes sir, here you are');
        setTranscript('');
        break;
      case 'open the Instagram' || ' open the Instagram':
        window.open('https://www.instagram.com', '_blank');
        // gtts('Yes sir, here you are');
        runVoice('Yes sir, here you are');
        setTranscript('');
        break;
      case 'open the Linkedin' || ' open the Linkedin':
        window.open('https://www.linkedin.com', '_blank');
        // gtts('Yes sir, here you are');
        runVoice('Yes sir, here you are');
        setTranscript('');
        break;
      case 'open the WhatsApp' || ' open the WhatsApp':
        window.open('https://web.whatsapp.com/', '_blank');
        // gtts('Yes sir, here you are');
        runVoice('Yes sir, here you are');
        setTranscript('');
        break;
      case 'what weather today' || ' what weather today':
        const city = 'Cikarang';
        getWeather(city).then((weatherData: any) => {
          if (weatherData) {
            const { temperature, description } = weatherData;
            // gtts(`Today's weather in ${city}: ${temperature}°C, ${description}`);
            runVoice(`Today's weather in ${city}: ${temperature}°C, ${description}`);
          } else {
            console.log('Failed to fetch weather data.');
          }
        });
        setTranscript('');
        break;
      default:
        setIsLoading(true);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(transcript);
        const response = await result.response;
        const text = response.text();
        setIsLoading(false);
        setResponse(text);
        const cleanedText = removeSymbols(text);
        // gtts(cleanedText);
        runVoice(cleanedText);
        setTranscript('');
        break;
    }
  };

  const runVoice = (text?: string) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const femaleVoice = voices?.find(
      (voice) =>
        voice.name.includes('female') ||
        voice.name.includes('Female') ||
        voice.name.includes('Google UK English Female')
    );

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else if (voices.length > 0) {
      utterance.voice = voices[0];
    }
    utterance.onstart = () => setAudioPlaying(true);
    utterance.onend = () => {
      setAudioPlaying(false);
      setAudio(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const removeSymbols = (text: string) => {
    return text.replace(/[^\w\s]/gi, '');
  };

  useEffect(() => {
    if (!isRecording && transcript) {
      aiRun();
      const handleVoicesChanged = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      handleVoicesChanged();
    }
  }, [isRecording]);

  return (
    <span className="flex flex-col items-center">
      {loading === true && res === '' ? (
        <p>loading....</p>
      ) : (
        <>
          {!isRecording && audioPlaying && (
            <>
              {res.length ? (
                <>
                  <h1 className="w-full flex items-center justify-center">Result : </h1>
                  <p className="text-xl text-justify">{removeSymbols(res)}</p>
                </>
              ) : (
                <></>
              )}
              <button onClick={() => runVoice()} className="my-4 bg-red-600 px-4 py-1 rounded-lg">
                Stop
              </button>
            </>
          )}
        </>
      )}
    </span>
  );
};

export default Result;
