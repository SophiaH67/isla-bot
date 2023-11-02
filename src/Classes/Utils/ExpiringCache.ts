export default class ExpiringCache<T> {
  private readonly cache: Map<string, T> = new Map();
  private readonly cacheExpiry: Map<string, number> = new Map();

  constructor(private readonly expiry: number) {}

  public get(key: string): T | undefined {
    const expiry = this.cacheExpiry.get(key);
    if (expiry && expiry < Date.now()) {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return undefined;
    }
    return this.cache.get(key);
  }

  public set(key: string, value: T): void {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.expiry);
  }

  public delete(key: string): void {
    this.cache.delete(key);
    this.cacheExpiry.delete(key);
  }
}
