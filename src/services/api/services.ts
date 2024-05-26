import axios from 'axios';

export const deleteAudioFile = async () => {
  try {
    await axios.delete('/api/delete-audio');
  } catch (error) {
    console.error('Error deleting audio file:', error);
  }
};

export const getWeather = async (city: string) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric`;

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

export const getNews = async (url: string) => {
  const newsKey = process.env.NEXT_PUBLIC_NEWS_KEY;
  // const urls = [
  //   `https://newsapi.org/v2/top-headlines?`,
  //   `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${newsKey}`,
  //   `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${newsKey}`,
  //   `https://newsapi.org/v2/top-headlines?q=${country}&apiKey=${newsKey}`,
  // ];

  const endpoint = `https://newsapi.org/v2/top-headlines?${url}&apiKey=${newsKey}`;

  try {
    const response = await axios.get(endpoint);
    const { articles } = response.data;
    if (articles && articles.length > 0) {
      return articles;
    }
  } catch (error) {
    console.log(`Error fetching news from ${url}`, error);
  }

  console.log('All requests failed.');
  return null;
};
