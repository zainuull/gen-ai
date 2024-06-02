'use client';
import {
  featuresNews,
  categoriesData,
  countriesData,
  keywordsData,
  sourcesData,
} from '@/services/api/mock.data';
import { getNews } from '@/services/api/services';
import { INewsDataModel } from '@/services/model/model';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PiArrowLeftLight } from 'react-icons/pi';

// interface ILatestNews {
//   gtts: Function;
//   runVoice: Function;
//   setVoices: Function;
//   transcript: string;
//   isRecording: boolean;
//   setTranscript: Function;
//   audioPlaying: boolean;
//   stopAudio: Function;
// }

const LatestNews = (props: any) => {
  const {
    gtts,
    runVoice,
    setVoices,
    transcript,
    isRecording,
    setTranscript,
    audioPlaying,
    stopAudio,
  } = props;
  const [news, setNews] = useState<INewsDataModel[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [showStop, setShowStop] = useState(false);
  const [currentReadIndex, setCurrentReadIndex] = useState<number | null>(null);

  const aiRun = async () => {
    const lowerCaseTranscript = transcript.toLowerCase();

    const fetchNews = async (query: string) => {
      const data = await getNews(query);
      if (data && data.length > 0) {
        const sortedData = data.sort(
          (a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        setNews(sortedData);
        runVoice('Yes sir, here you are');
      } else {
        runVoice(`Sorry, I can't get the news`);
      }
      setTranscript('');
    };

    const getDelayForTitle = (title: string) => {
      // Adjust the base delay and delay per character as needed
      const baseDelay = 1000; // Base delay in milliseconds
      const delayPerCharacter = 65; // Delay per character in milliseconds

      // Calculate the delay based on the title length
      const titleLength = title.length;
      return baseDelay + titleLength * delayPerCharacter;
    };

    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    const readAllArticles = async () => {
      setShowStop(true);
      if (news.length) {
        for (let index = 0; index < news.length; index++) {
          const article = news[index];
          setCurrentReadIndex(index);
          runVoice(`${article.title}`);
          await delay(getDelayForTitle(article.title ?? 'Untitled'));
        }
      } else {
        runVoice('All news articles have been read.');
      }
      setShowStop(false);
    };

    const readArticleByIndex = (index: number) => {
      if (news.length > 0) {
        if (index >= 0 && index < news.length) {
          setShowStop(true);
          const article = news[index];
          setCurrentReadIndex(index);
          runVoice(`${article.title}`);
          setShowStop(false);
        } else {
          runVoice('Sorry, I cannot find that news article.');
        }
      } else {
        runVoice('Sorry, there is no news to read.');
      }
    };

    const openArticleByIndex = (index: number) => {
      if (news.length > 0) {
        if (index >= 0 && index < news.length) {
          const article = news[index];
          window.open(`${article.url}`, '_blank');
          runVoice(`${article.title}.${article.description}`);
        } else {
          runVoice('Sorry, I cannot find that news article.');
        }
      } else {
        runVoice('Sorry, there is no news to read.');
      }
    };

    const extractIndexFromTranscript = (transcript: string): number => {
      const numberWords = [
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
      ];

      for (let i = 0; i < numberWords.length; i++) {
        if (
          transcript.includes(`number ${numberWords[i]}`) ||
          transcript.includes(`number ${i + 1}`)
        ) {
          return i;
        }
      }
      return -1;
    };

    if (lowerCaseTranscript.includes('read the news in number')) {
      const index = extractIndexFromTranscript(lowerCaseTranscript);
      readArticleByIndex(index);
    } else if (lowerCaseTranscript.includes('read all the news')) {
      readAllArticles();
    } else if (lowerCaseTranscript.includes('open the news in number')) {
      const index = extractIndexFromTranscript(lowerCaseTranscript);
      openArticleByIndex(index);
    } else {
      setIsLoading(true);
      let matchedCountry: string = '';
      let matchedCategory: string = '';
      let matchedSource: string = '';
      let matchedKeyword: string = '';

      for (const country of countriesData) {
        if (lowerCaseTranscript.includes(country.name.toLowerCase())) {
          matchedCountry = country.id; // Set matched country ID
          break;
        }
      }

      for (const category of categoriesData) {
        if (lowerCaseTranscript.includes(category.name.toLowerCase())) {
          matchedCategory = category.id; // Set matched country ID
          break;
        }
      }

      for (const source of sourcesData) {
        if (lowerCaseTranscript.includes(source.name.toLowerCase())) {
          matchedSource = source.id; // Set matched country ID
          break;
        }
      }

      for (const keyword of keywordsData) {
        if (lowerCaseTranscript.includes(keyword.name.toLowerCase())) {
          matchedKeyword = keyword.id; // Set matched country ID
          break;
        }
      }

      if (matchedCountry && matchedCategory) {
        fetchNews(`country=${matchedCountry}&category=${matchedCategory}`);
      } else if (matchedCategory) {
        fetchNews(`category=${matchedCategory}`);
      } else if (matchedCountry) {
        fetchNews(`country=${matchedCountry}`);
      } else if (matchedSource) {
        fetchNews(`sources=${matchedSource}`);
      } else if (matchedKeyword) {
        fetchNews(`q=${matchedKeyword}`);
      } else {
        runVoice(`Sorry, I can't get the news`);
        setTranscript('');
      }
      setNews([]);
      setIsLoading(false);
    }
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
  }, [isRecording, audioPlaying]);

  const handleBack = () => {
    setNews([]);
  };

  return (
    <main className="w-full flex flex-col gap-y-2 px-2">
      {/* <h1 className="w-full text-center my-5 text-sm xl:text-base font-semibold">News</h1> */}
      {loading === true && news.length === 0 ? (
        <p>loading....</p>
      ) : (
        <>
          {showStop && (
            <button
              onClick={() => stopAudio()}
              className="my-4 bg-red-600 px-4 py-1 rounded-lg w-[200px] text-white text-sm xl:text-base">
              Stop
            </button>
          )}
          <div className="w-full">
            {news.length > 1 ? (
              <div className="w-full p-2 xl:p-6">
                <div
                  onClick={handleBack}
                  className="flex items-center gap-x-2 cursor-pointer hover:font-semibold transition-all">
                  <PiArrowLeftLight size={20} />
                  <p>Back</p>
                </div>
                <div className="grid grid-cols-12 gap-4 my-4">
                  {news?.map((data: INewsDataModel, index: number) => {
                    return (
                      <div
                        key={data.id}
                        className={`col-span-12 xl:col-span-4 h-96 rounded-lg overflow-hidden shadow-lg border border-black/10 relative  ${
                          currentReadIndex === index && audioPlaying && 'border-4 border-blue-500'
                        }`}>
                        {data.urlToImage ? (
                          <img
                            src={data?.urlToImage || ''}
                            alt={data?.title || ''}
                            // width={100}
                            // height={100}
                            className="w-full h-64 object-cover"
                          />
                        ) : (
                          <div className="w-full min-h-64 object-cover bg-gray-200 flex items-center justify-center font-thin">
                            Not found image
                          </div>
                        )}
                        <h1 className="text-[10px] xl:text-xs font-thin my-1 px-2">
                          {data.author}
                        </h1>
                        <h1 className="text-xs xl:text-sm font-semibold px-2">{data.title}</h1>
                        <p className="text-[10px] font-thin px-2">
                          {data.description?.slice(0, 100)}...
                        </p>
                        <Link
                          href={data?.url || ''}
                          target="_blank"
                          className="text-[10px] font-thin absolute right-2 bottom-2 hover:bg-gray-100 px-6 py-2 rounded-lg transition-all">
                          Read More
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center my-4">
                <h1 className="text-sm xl:text-base font-semibold">The Features</h1>
                <div className="w-full xl:w-3/4 flex justify-center flex-wrap my-4 gap-10">
                  {featuresNews.map((data: { title: string; description: string }, idx: number) => (
                    <div
                      key={idx}
                      className="xl:w-[250px] min-h-60 text-sm flex flex-col gap-y-2 shadow-lg  border-t-2 border-black rounded-lg p-4 hover:scale-105 transition-all duration-100 cursor-pointer">
                      <p className="text-xs font-semibold">{data.title}</p>
                      <p className="text-xs leading-relaxed font-thin text-justify">
                        {data.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default LatestNews;
