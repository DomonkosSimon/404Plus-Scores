import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings, Language, WinDirection } from '../../domain/types';

interface SettingsState extends AppSettings {
  setWinDirection: (direction: WinDirection) => void;
  setLanguage: (language: Language) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      winDirection: 'highest',
      language: 'sk',
      setWinDirection: (direction) => set({ winDirection: direction }),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'weq-settings-v1' },
  ),
);
