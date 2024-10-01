export const storage = {
  set: (key: string, value: any) => {
    if (key && value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  },
  get: (key: string) => {
    if (key) {
      const result = localStorage.getItem(key);
      if (!result) return null;
      return JSON.parse(result);
    }
  },
  delete: (key: string) => {
    if (key) {
      localStorage.removeItem(key);
    }
  },
  clear: () => {
    localStorage.clear();
  },
};
