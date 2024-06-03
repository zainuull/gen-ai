'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import Recorder from './recorder';
import Search from './search/page';
import { deleteAudioFile } from '@/services/api/services';
import LatestNews from './news/page';
import SpeakingPractice from './speaking-practice/page';

export default function Home() {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [value, setValue] = useState('1');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const gtts = async (text: string) => {
    const temp = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/tts`, { text });
    const newAudio = new Audio(temp.data.url);

    newAudio.onplay = () => setAudioPlaying(true);
    newAudio.onended = () => {
      setAudioPlaying(false);
      deleteAudioFile();
      setAudio(null); // Reset the audio state
    };
    newAudio.play();
    setAudio(newAudio);

    console.log(newAudio);
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
    };
    window.speechSynthesis.speak(utterance);
  };

  // Function to stop audio playback
  const stopAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudioPlaying(false);
      deleteAudioFile();
      window.speechSynthesis.cancel();
    }
  };

  return (
    <main className="w-full flex flex-col">
      <Recorder
        transcript={transcript}
        setTranscript={setTranscript}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
      />
      <div className="w-full flex justify-center items-center mt-2 xl:mt-10">
        <Box
          sx={{
            width: '100%',
            typography: 'body1',
          }}>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              className="bg-gray-200"
              sx={{
                color: '#2fb0b9 !important', // Your custom text color
                '& .Mui-selected': {
                  color: '#2fb0b9 !important', // Your custom text color for selected tab
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#2fb0b9 !important', // Your custom indicator color
                },
              }}>
              <Tab
                label="Search"
                value="1"
                className="xl:w-full flex items-center justify-center"
              />
              <Tab label="News" value="2" className="xl:w-full flex items-center justify-center" />
              <Tab
                label="Speaking Practice"
                value="3"
                className="xl:w-full flex items-center justify-center"
              />
            </TabList>
            <Box sx={{ flexGrow: 2, overflowY: 'auto', margin: 0, padding: 0 }}>
              <TabPanel value="1" sx={{ height: '100%', padding: 0 }}>
                <Search
                  runVoice={runVoice}
                  setVoices={setVoices}
                  gtts={gtts}
                  transcript={transcript}
                  setTranscript={setTranscript}
                  isRecording={isRecording}
                  audioPlaying={audioPlaying}
                />
              </TabPanel>
              <TabPanel value="2" sx={{ height: '100%', padding: 0, width: '100%' }}>
                <LatestNews
                  runVoice={runVoice}
                  setVoices={setVoices}
                  gtts={gtts}
                  transcript={transcript}
                  setTranscript={setTranscript}
                  isRecording={isRecording}
                  audioPlaying={audioPlaying}
                  stopAudio={stopAudio}
                />
              </TabPanel>
              <TabPanel value="3" sx={{ height: '100%', padding: 0, width: '100%' }}>
                <SpeakingPractice
                  runVoice={runVoice}
                  setVoices={setVoices}
                  gtts={gtts}
                  transcript={transcript}
                  setTranscript={setTranscript}
                  isRecording={isRecording}
                  audioPlaying={audioPlaying}
                />
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      </div>
    </main>
  );
}
