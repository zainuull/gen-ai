'use client';
import {
  categoriesData,
  countriesData,
  keywordsData,
  sourcesData,
} from '@/services/api/counties.data';
import { getNews } from '@/services/api/services';
import { INewsDataModel } from '@/services/model/model';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type ILatestNews = {
  gtts: Function;
  runVoice: Function;
  setVoices: Function;
  transcript: string;
  isRecording: boolean;
  setTranscript: Function;
};

const LatestNews = (props: ILatestNews) => {
  const { gtts, runVoice, setVoices, transcript, isRecording, setTranscript } = props;
  const [news, setNews] = useState<INewsDataModel[]>([]);
  const [loading, setIsLoading] = useState(false);

  const aiRun = async () => {
    setNews([]);
    setIsLoading(true);
    const lowerCaseTranscript = transcript.toLowerCase();

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
      getNews(`country=${matchedCountry}&category=${matchedCategory}`).then(
        (data: INewsDataModel[]) => {
          if (data) {
            setNews(data);
            runVoice('Yes sir, here you are');
          }
        }
      );
      setTranscript('');
    } else if (matchedCategory) {
      getNews(`category=${matchedCategory}`).then((data: INewsDataModel[]) => {
        if (data) {
          setNews(data);
          runVoice('Yes sir, here you are');
        }
      });
      setTranscript('');
    } else if (matchedCountry) {
      getNews(`country=${matchedCountry}`).then((data: INewsDataModel[]) => {
        if (data) {
          setNews(data);
          runVoice('Yes sir, here you are');
        }
      });
      setTranscript('');
    } else if (matchedSource) {
      getNews(`sources=${matchedSource}`).then((data: INewsDataModel[]) => {
        if (data) {
          setNews(data);
          runVoice('Yes sir, here you are');
        }
      });
      setTranscript('');
    } else if (matchedKeyword) {
      getNews(`q=${matchedKeyword}`).then((data: INewsDataModel[]) => {
        if (data) {
          setNews(data);
          runVoice('Yes sir, here you are');
          console.log(data);
        }
      });
      setTranscript('');
    } else {
      runVoice(`Sorry, I can't get the news`);
      setTranscript('');
    }

    setIsLoading(false);
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
      <h1 className="w-full text-center my-5 text-sm xl:text-base font-semibold">News</h1>
      {loading === true && news.length === 0 ? (
        <p>loading....</p>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          {news.length > 1 ? (
            news?.map((data: INewsDataModel) => {
              return (
                <div
                  key={data.id}
                  className="col-span-12 xl:col-span-4 h-96 rounded-lg overflow-hidden shadow-lg border border-black/10 relative">
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
                  <h1 className="text-[10px] xl:text-xs font-thin my-1 px-2">{data.author}</h1>
                  <h1 className="text-xs xl:text-sm font-semibold px-2">{data.title}</h1>
                  <p className="text-[10px] font-thin px-2">{data.description?.slice(0, 100)}...</p>
                  <Link
                    href={data?.url || ''}
                    target="_blank"
                    className="text-[10px] font-thin absolute right-2 bottom-2 hover:bg-gray-100 px-6 py-2 rounded-lg transition-all">
                    Read More
                  </Link>
                </div>
              );
            })
          ) : (
            <p className="w-full h-full text-2xl font-semibold text-center col-span-12">
              don&apos;t have the news
            </p>
          )}
        </div>
      )}
    </main>
  );
};

export default LatestNews;
