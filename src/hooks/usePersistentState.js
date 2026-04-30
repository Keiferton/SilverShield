import { useEffect, useState } from 'react';

function readStoredValue(key, fallbackValue) {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export function usePersistentState(key, fallbackValue) {
  const [value, setValue] = useState(() => readStoredValue(key, fallbackValue));

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Progress saving is helpful, but the app should still work if storage is unavailable.
    }
  }, [key, value]);

  return [value, setValue];
}
