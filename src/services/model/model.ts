export interface INewsDataModel {
  id?: string;
  name?: string;
  description?: string;
  url?: string;
  category?: string;
  language?: string;
  country?: string;
  //article
  author?: string;
  content?: string;
  publishedAt?: string;
  source?: ISource;
  title?: string;
  urlToImage?: string;
}

interface ISource {
  id?: string;
  name?: string;
}
