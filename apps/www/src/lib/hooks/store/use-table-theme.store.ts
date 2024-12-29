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
  modern: {
    name: "modern",
    label: { fr: "Moderne", en: "Modern" },
    background: "bg-gradient-to-br from-slate-900 to-slate-800",
    description: {
      fr: "Un design moderne et élégant avec des tons sombres",
      en: "A modern and elegant design with dark tones"
    }
  },
  luxury: {
    name: "luxury",
    label: { fr: "Luxe", en: "Luxury" },
    background: "bg-gradient-to-br from-amber-900 to-amber-800",
    description: {
      fr: "Une ambiance luxueuse avec des tons dorés",
      en: "A luxurious atmosphere with golden tones"
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
  exotic: {
    name: "exotic",
    label: { fr: "Exotique", en: "Exotic" },
    background: "bg-gradient-to-br from-orange-900 to-green-800",
    description: {
      fr: "Un thème exotique avec des couleurs vives",
      en: "An exotic theme with bright colors"
    }
  },
  pastel: {
    name: "pastel",
    label: { fr: "Pastel", en: "Pastel" },
    background: "bg-gradient-to-br from-fuchsia-900 to-sky-800",
    description: {
      fr: "Un design pastel avec des tons doux et apaisants",
      en: "A pastel design with soft and soothing tones"
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