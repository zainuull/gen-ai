'use client';
import { getWeather } from '@/services/api/services';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useEffect, useState } from 'react';

interface ISearch {
  gtts: Function;
  runVoice: Function;
  setVoices: Function;
  transcript: string;
  isRecording: boolean;
  setTranscript: Function;
  audioPlaying: boolean;
}

const Search = (props: ISearch) => {
  const { gtts, runVoice, setVoices, transcript, isRecording, setTranscript, audioPlaying } = props;
  const genAI = new GoogleGenerativeAI('AIzaSyC-3Q3ZoBlAtDE471lReBHVnA372qa_lyE');
  const [res, setResponse] = useState('');
  const [loading, setIsLoading] = useState(false);

  const aiRun = async () => {
    setResponse('');

    const lowerCaseTranscript = transcript.toLowerCase();
    console.log(lowerCaseTranscript);

    switch (true) {
      case lowerCaseTranscript.includes('mindy'):
        // gtts('Hello Sir, how are you today ?');
        runVoice('Hello Sir, how are you today ?');
        setResponse('Hello sir, how are you today ?');
        setTranscript('');
        break;
      case lowerCaseTranscript.includes('help me'):
        // gtts('Yes sir, i could help you please');
        runVoice('Yes sir, i could help you please');
        setResponse('Yes sir, i could help you please');
        setTranscript('');
        break;
      case lowerCaseTranscript.includes('youtube'):
        window.open('https://www.youtube.com', '_blank');
        // gtts('Yes sir, here you are');
        runVoice('Yes sir, here you are');
        setResponse('Yes sir, here you are');
        setTranscript('');
        break;
      case lowerCaseTranscript.includes('instagram'):
        window.open('https://www.instagram.com', '_blank');
        // gtts('Yes sir, here you are');
        runVoice('Yes sir, here you are');
        setResponse('Yes sir, here you are');
        setTranscript('');
        break;
      case lowerCaseTranscript.includes('linkedin'):
        window.open('https://www.linkedin.com', '_blank');
        // gtts('Yes sir, here you are');
        runVoice('Yes sir, here you are');
        setResponse('Yes sir, here you are');
        setTranscript('');
        break;
      case lowerCaseTranscript.includes('whatsapp'):
        window.open('https://web.whatsapp.com/', '_blank');
        // gtts('Yes sir, here you are');
        runVoice('Yes sir, here you are');
        setResponse('Yes sir, here you are');
        setTranscript('');
        break;
      case lowerCaseTranscript.includes('weather'):
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
    <span className="flex flex-col">
      {loading === true && res === '' ? (
        <p>loading....</p>
      ) : (
        <>
          {!isRecording && audioPlaying && (
            <>
              {res.length ? (
                <>
                  <h1 className="w-full flex items-center justify-center">Result : </h1>
                  <p className="text-sm xl:text-base text-justify">{removeSymbols(res)}</p>
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

export default Search;
