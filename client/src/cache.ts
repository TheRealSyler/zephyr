import { Article } from './shared/api.interfaces';

interface CacheItem<T> {
  insertionDate: number;
  data: T;
}

interface CacheData {
  article: { [key: string]: CacheItem<Article> };
  home: {
    [key: string]: CacheItem<any>;
    data: CacheItem<Article[]>;
    page: CacheItem<number>;
    loadedAllPages: CacheItem<boolean>;
  };
}

type CacheSet = <F extends keyof CacheData, K extends keyof CacheData[F]>(
  field: F,
  key: K,
  data: CacheData[F][K]['data']
) => void;

type CacheGet = <F extends keyof CacheData, K extends keyof CacheData[F]>(
  field: F,
  key: K
) => CacheData[F][K]['data'];

type CacheFetch = <F extends keyof CacheData, K extends keyof CacheData[F]>(
  field: F,
  key: K,
  fetch: () => Promise<CacheData[F][K]['data']>,
  force?: boolean
) => Promise<CacheData[F][K]['data']>;

type CacheUpdate = <F extends keyof CacheData, K extends keyof CacheData[F]>(
  field: F,
  key: K,
  fetch: (data: CacheData[F][K]['data']) => Promise<CacheData[F][K]['data']>
) => Promise<CacheData[F][K]['data'] | null>;

class ApiCache {
  /**Defaults to 15 min. */
  cacheInvalidationTime = 1000 * 60 * 15;
  private data: CacheData = {
    article: {},
    home: {
      loadedAllPages: { data: false, insertionDate: 0 },
    } as any,
  };
  set: CacheSet = (field, key, data) => {
    if (this.data[field][key]) {
      // TODO get rid of as any
      this.data[field][key] = { data, insertionDate: Date.now() } as any;
    }
  };

  get: CacheGet = (field, key) => {
    return this.data[field][key]?.data;
  };

  /**gets the data from the cache or fetches the data using the fetch parameter. */
  fetch: CacheFetch = async (field, key, fetch, force = false) => {
    if (
      this.data[field][key] &&
      !(this.data[field][key].insertionDate < Date.now() - this.cacheInvalidationTime) &&
      !force
    ) {
      return this.data[field][key].data;
    }
    // TODO get rid of as any
    this.data[field][key] = { data: await fetch(), insertionDate: Date.now() } as any;
    return this.data[field][key].data;
  };

  update: CacheUpdate = async (field, key, fetch) => {
    if (!this.data[field][key]) return null;
    // TODO get rid of as any
    this.data[field][key] = {
      data: await fetch(this.data[field][key].data),
      insertionDate: Date.now(),
    } as any;

    return this.data[field][key].data;
  };
}

export const apiCache = new ApiCache();
