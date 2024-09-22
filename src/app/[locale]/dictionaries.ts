import "server-only";

const dictionaries: {
  [key: string]: () => Promise<{ [key: string]: string }>;
} = {
  en: () =>
    import("../../../public/locales/en/common.json").then(
      (module) => module.default
    ),
  tr: () =>
    import("../../../public/locales/tr/common.json").then(
      (module) => module.default
    ),
};

export const getDictionary = async (locale: string) => dictionaries[locale]();
