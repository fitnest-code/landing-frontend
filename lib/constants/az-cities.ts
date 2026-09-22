export const AZ_CITIES = [
  "Bakı",
  "Abşeron",
  "Ağcabədi",
  "Ağdam",
  "Ağdaş",
  "Ağstafa",
  "Ağsu",
  "Astara",
  "Babək",
  "Balakən",
  "Beyləqan",
  "Bərdə",
  "Biləsuvar",
  "Cəbrayıl",
  "Cəlilabad",
  "Culfa",
  "Daşkəsən",
  "Füzuli",
  "Gədəbəy",
  "Gəncə",
  "Goranboy",
  "Göyçay",
  "Göygöl",
  "Hacıqabul",
  "Xaçmaz",
  "Xankəndi",
  "Xızı",
  "Xocalı",
  "Xocavənd",
  "İmişli",
  "İsmayıllı",
  "Kəlbəcər",
  "Kəngərli",
  "Kürdəmir",
  "Laçın",
  "Lerik",
  "Lənkəran",
  "Masallı",
  "Mingəçevir",
  "Naftalan",
  "Naxçıvan",
  "Neftçala",
  "Oğuz",
  "Ordubad",
  "Qax",
  "Qazax",
  "Qəbələ",
  "Qobustan",
  "Quba",
  "Qubadlı",
  "Qusar",
  "Saatlı",
  "Sabirabad",
  "Salyan",
  "Samux",
  "Sədərək",
  "Siyəzən",
  "Sumqayıt",
  "Şabran",
  "Şahbuz",
  "Şamaxı",
  "Şəki",
  "Şəmkir",
  "Şərur",
  "Şirvan",
  "Şuşa",
  "Tərtər",
  "Tovuz",
  "Ucar",
  "Yardımlı",
  "Yevlax",
  "Zaqatala",
  "Zəngilan",
  "Zərdab",
] as const;

export const BAKI_RAYONS = [
  "Binəqədi",
  "Xətai",
  "Xəzər",
  "Qaradağ",
  "Nərimanov",
  "Nəsimi",
  "Nizami",
  "Pirallahı",
  "Sabunçu",
  "Səbail",
  "Suraxanı",
  "Yasamal",
] as const;

export const isBakiCity = (city: string | null | undefined) => {
  if (!city) return false;
  const n = city
    .trim()
    .toLocaleLowerCase("az")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ə/g, "e")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c");
  return n === "baki" || n === "baku" || n.startsWith("baki ") || n.startsWith("baku ");
};

const FOLD_MAP: Record<string, string> = {
  ə: "e",
  ı: "i",
  ö: "o",
  ü: "u",
  ğ: "g",
  ş: "s",
  ç: "c",
};

const fold = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase("az")
    .replace(/[əıöüğşç]/g, (char) => FOLD_MAP[char] ?? char)
    .normalize("NFKD")
    .replace(/\p{M}+/gu, "")
    .replace(/[^a-z0-9]+/g, "");

const ALIASES: Record<string, string> = {
  baku: "Bakı",
  baki: "Bakı",
  ganja: "Gəncə",
  gence: "Gəncə",
  sumgait: "Sumqayıt",
  sumqayit: "Sumqayıt",
  sheki: "Şəki",
  lankaran: "Lənkəran",
};

export function cityMatches(storedCity: string | null | undefined, selectedCity: string) {
  if (!selectedCity) return true;
  if (!storedCity?.trim()) return false;
  const selected = fold(selectedCity);
  const stored = fold(storedCity);
  if (stored === selected) return true;
  const alias = ALIASES[selected];
  if (alias && fold(alias) === stored) return true;
  return stored.startsWith(selected) || stored.includes(selected);
}
