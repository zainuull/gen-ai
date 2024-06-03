'use client';
import { featuresSpeakingPractice, questions } from '@/services/api/mock.data';
import { useEffect, useRef, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import { PiArrowLeftLight } from 'react-icons/pi';

const SpeakingPractice = (props: any) => {
  const { gtts, runVoice, setVoices, transcript, isRecording, setTranscript, audioPlaying } = props;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isNotif, setIsNotif] = useState({
    finish: false,
    correct: false,
    wrong: false,
  });
  const [isStart, setIsStart] = useState(false);
  const isQuestionProcessedRef = useRef(false);

  const aiRun = () => {
    const lowerCaseTranscript = transcript.toLowerCase();
    const currentQuestion = questions[currentQuestionIndex];
    if (!isRecording) {
      if (currentQuestion && lowerCaseTranscript.includes(currentQuestion.title.toLowerCase())) {
        gtts('Congratulation, Your answer is correct');
        setTranscript('');
        setIsNotif({ finish: false, correct: true, wrong: false });
        isQuestionProcessedRef.current = true;
        setTimeout(() => {
          setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
          setIsNotif({ finish: false, correct: false, wrong: false });
          isQuestionProcessedRef.current = false;
        }, 1000);
      } else if (currentQuestion) {
        console.log('Sorry, Your answer is wrong');
        setTranscript('');
        setIsNotif({ finish: false, correct: false, wrong: true });
      }
    }
  };

  useEffect(() => {
    if (!isRecording && transcript) {
      aiRun();
    }

    if (currentQuestionIndex >= questions.length) {
      setIsNotif({ finish: true, correct: false, wrong: false });
      runVoice('Congratulations! You have completed all the questions.');
    }

    const handleVoicesChanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged();
  }, [isRecording, transcript, currentQuestionIndex]);

  const handleBack = () => {
    setCurrentQuestionIndex(0);
    setIsNotif({ finish: false, correct: false, wrong: false });
    setIsStart(false);
  };

  const handleStart = () => {
    setIsStart(true);
  };

  return (
    <main className="w-full">
      {isStart ? (
        <div className="w-full h-full flex flex-col items-center justify-center my-4">
          {isNotif.finish ? (
            <div
              onClick={handleBack}
              className="w-full h-full flex items-center justify-center gap-x-2 cursor-pointer mt-10">
              <PiArrowLeftLight size={20} />
              <h1 className="text-2xl font-semibold">
                Congratulations! You have completed all the questions.
              </h1>
            </div>
          ) : (
            <div className="w-full xl:w-3/4 flex flex-col items-center justify-center flex-wrap my-4 gap-5">
              {isNotif?.wrong && <p className="text-red-600 font-semibold">Your answer is wrong</p>}
              {questions
                ?.slice(currentQuestionIndex, currentQuestionIndex + 1)
                ?.map((data: { title: string }, idx: number) => (
                  <div
                    key={idx}
                    className="w-[450px] min-h-20 text-sm flex items-center justify-center gap-x-2 shadow-lg border-t-2 border-black rounded-lg p-4 hover:scale-105 transition-all duration-100 cursor-pointer">
                    <p className="text-xl font-semibold">{data.title}</p>
                    {isNotif.wrong && <FaCircleXmark size={25} className="text-red-600" />}
                    {isNotif.correct && <FaCheckCircle size={25} className="text-green-600" />}
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center my-4">
          <button onClick={handleStart} className="px-6 py-2 rounded-lg text-white bg-[#2fb0b9]">
            Start to practice
          </button>
          <div className="w-full xl:w-3/4 flex justify-center flex-wrap my-4 gap-10">
            {featuresSpeakingPractice.map(
              (data: { title: string; description: string }, idx: number) => (
                <div
                  key={idx}
                  className="w-[550px] min-h-60 text-sm flex flex-col gap-y-2 shadow-lg  border-t-2 border-black rounded-lg p-4 hover:scale-105 transition-all duration-100 cursor-pointer">
                  <p className="text-xs font-semibold">{data.title}</p>
                  <p className="text-xs leading-relaxed font-thin text-justify">
                    {data.description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default SpeakingPractice;

{
}
