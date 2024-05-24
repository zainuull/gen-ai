'use client';
import { useState } from 'react';
import axios from 'axios';
import Recorder from './recorder';
import Result from './result';

export default function Home() {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');

  const gtts = async (text: string) => {
    const temp = await axios.post('/api/tts', { text });
    const newAudio = new Audio(temp.data.url);

    newAudio.onplay = () => setAudioPlaying(true);
    newAudio.onended = () => {
      setAudioPlaying(false);
      deleteAudioFile();
      setAudio(null); // Reset the audio state
    };
    newAudio.play();
    setAudio(newAudio);
  };

  // Function to stop audio playback
  const stopAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudioPlaying(false);
      deleteAudioFile();
    }
  };

  const deleteAudioFile = async () => {
    try {
      await axios.delete('/api/delete-audio');
    } catch (error) {
      console.error('Error deleting audio file:', error);
    }
  };

  const getWeather = async (city: string) => {
    const apiKey = 'c082de93c124ba63ae5eea82cc4402b7';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await axios.get(apiUrl);
      const { main, weather } = response.data;
      const temperature = main.temp;
      const description = weather[0].description;

      return { temperature, description };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-black text-white">
      <Recorder
        transcript={transcript}
        setTranscript={setTranscript}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      />
      <Result
        audioPlaying={audioPlaying}
        gtts={gtts}
        transcript={transcript}
        setTranscript={setTranscript}
        isRecording={isRecording}
        stopAudio={stopAudio}
        getWeather={getWeather}
      />
    </main>
  );
}
