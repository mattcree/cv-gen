export const set = (key: string, value: string): void => {
  console.log({ key, value });
  localStorage.setItem(key, value);
};

export const get = (key: string): string | null => {
  return localStorage.getItem(key);
};
