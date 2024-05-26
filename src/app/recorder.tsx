'use client';
import { useEffect } from 'react';
import { AiTwotoneAudio } from 'react-icons/ai';
import { LiaGripLinesVerticalSolid } from 'react-icons/lia';

interface IRecorder {
  transcript: string;
  setTranscript: Function;
  isRecording: boolean;
  setIsRecording: Function;
}

const Recorder = (props: IRecorder) => {
  const { transcript, setTranscript, isRecording, setIsRecording } = props;

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support the Web Speech API');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition() as SpeechRecognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    if (isRecording) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();
    };
  }, [isRecording]);

  return (
    <div className="w-full h-32 xl:h-36 flex flex-col items-center xl:gap-y-4 py-4">
      <button
        onClick={() => setIsRecording(!isRecording)}
        className="bg-red-600 rounded-lg p-3 text-white">
        {isRecording ? <LiaGripLinesVerticalSolid size={25} /> : <AiTwotoneAudio size={25} />}
      </button>
      <p className="text-sm xl:text-base my-3 xl:my-5">{transcript}</p>
    </div>
  );
};

export default Recorder;
