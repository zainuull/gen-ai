'use client';
import { featuresSearch } from '@/services/api/mock.data';
import { getWeather } from '@/services/api/services';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useEffect, useState } from 'react';

// interface ISearch {
//   gtts: Function;
//   runVoice: Function;
//   setVoices: Function;
//   transcript: string;
//   isRecording: boolean;
//   setTranscript: Function;
//   audioPlaying: boolean;
// }

const Search = (props: any) => {
  const { gtts, runVoice, setVoices, transcript, isRecording, setTranscript, audioPlaying } = props;
  const genAI = new GoogleGenerativeAI('AIzaSyC-3Q3ZoBlAtDE471lReBHVnA372qa_lyE');
  const [res, setResponse] = useState('');
  const [loading, setIsLoading] = useState(false);

  const aiRun = async () => {
    setResponse('');

    const lowerCaseTranscript = transcript.toLowerCase();

    switch (true) {
      case lowerCaseTranscript.includes('mindy'):
        // gtts('Hello Sir, how are you today ?');
        runVoice('Hello Sir, how are you today ?');
        setResponse('Hello sir, how are you today ?');
        setTranscript('');
        break;
      case lowerCaseTranscript.includes('your name'):
        // gtts('My name is Mindy, I am an AI created by group 1');
        runVoice('My name is Mindy, I am an AI created by group 1');
        setResponse('My name is Mindy, I am an AI created by group 1');
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
    setTranscript('');
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
    <main className="w-full flex flex-col gap-y-2 px-2">
      {loading === true && res === '' ? (
        <p>loading....</p>
      ) : (
        <>
          {!isRecording && audioPlaying ? (
            <>
              {res.length && (
                <div className="w-full my-4">
                  <div className="w-full xl:w-1/2 bg-gray-100 rounded-lg min-h-56 flex flex-col p-4">
                    <h1 className="text-sm xl:text-base font-semibold">Result : </h1>
                    <p className="text-sm xl:text-base text-justify">{removeSymbols(res)}</p>
                  </div>
                  <button
                    onClick={() => runVoice()}
                    className="my-4 bg-red-600 px-4 py-1 rounded-lg w-[300px] text-white text-sm xl:text-base ">
                    Stop
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center my-4">
              <h1 className="text-sm xl:text-base font-semibold">The Features</h1>
              <div className="w-full xl:w-3/4 flex justify-center flex-wrap my-4 gap-10">
                {featuresSearch.map((data: { title: string; description: string }, idx: number) => (
                  <div
                    key={idx}
                    className="w-[450px] min-h-60 text-sm flex flex-col gap-y-2 shadow-lg  border-t-2 border-black rounded-lg p-4 hover:scale-105 transition-all duration-100 cursor-pointer">
                    <p className="text-xs font-semibold">{data.title}</p>
                    <p className="text-xs leading-relaxed font-thin text-justify">
                      {data.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default Search;
