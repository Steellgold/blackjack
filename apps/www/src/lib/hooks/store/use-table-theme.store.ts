import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TableTheme = {
  name: string;
  label: { fr: string; en: string };
  background: string;
  className?: string;
  description?: { fr: string; en: string };
};

export const TABLE_THEMES: Record<string, TableTheme> = {
  classic: {
    name: "classic",
    label: { fr: "Classique", en: "Classic" },
    background: "bg-green-900",
    description: {
      fr: "Le thème classique de casino avec son tapis vert traditionnel",
      en: "The classic casino theme with its traditional green felt"
    }
  },
  sky: {
    name: "sky",
    label: { fr: "Ciel", en: "Sky" },
    background: "bg-[conic-gradient(at_right,_var(--tw-gradient-stops))] from-sky-900 to-sky-800",
    description: {
      fr: "Un thème bleu et aérien pour une ambiance de jeu relaxante",
      en: "A blue and airy theme for a relaxing gaming atmosphere"
    }
  },
  modern: {
    name: "modern",
    label: { fr: "Moderne", en: "Modern" },
    background: "bg-gradient-to-br from-slate-900 to-slate-800",
    description: {
      fr: "Un design moderne et élégant avec des tons sombres",
      en: "A modern and elegant design with dark tones"
    }
  },
  neon: {
    name: "neon",
    label: { fr: "Néon", en: "Neon" },
    background: "bg-gradient-to-br from-purple-900 to-indigo-900",
    className: "neon-theme",
    description: {
      fr: "Un style cyberpunk avec des effets néon",
      en: "A cyberpunk style with neon effects"
    }
  },
  darkness: {
    name: "darkness",
    label: { fr: "Obscurité", en: "Darkness" },
    background: "bg-gradient-to-bl from-zinc-900 from-0% via-slate-900 via-100% to-blue-900 to-100%",
    description: {
      fr: "Le thème sombre ultime pour les joueurs de l'ombre",
      en: "The ultimate dark theme for shadow players"
    }
  }
};

type TableThemeStore = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const useTableTheme = create<TableThemeStore>()(
  persist(
    (set) => ({
      theme: "classic",
      setTheme: (theme: string) => set({ theme })
    }),
    { name: "table-theme-storage", getStorage: () => localStorage }
  )
);