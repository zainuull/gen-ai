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
      setTranscript('');
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
        className="bg-[#2fb0b9] rounded-lg p-3 text-white">
        {isRecording ? (
          <LiaGripLinesVerticalSolid
            size={25}
            className="w-[17px] h-[17px] xl:w-[25px] xl:h-[25px]"
          />
        ) : (
          <AiTwotoneAudio size={25} className="w-[17px] h-[17px] xl:w-[25px] xl:h-[25px]" />
        )}
      </button>
      <input
        defaultValue={transcript}
        className={`bg-gray-100 w-11/12 xl:w-1/2  rounded-lg flex items-center justify-center text-sm xl:text-base my-3 xl:my-5 px-3 py-2 outline-none ${
          transcript && 'border-2 border-blue-300 transition-all duration-100'
        }`}
        placeholder="Speak what you want"
        disabled
      />
    </div>
  );
};

export default Recorder;
