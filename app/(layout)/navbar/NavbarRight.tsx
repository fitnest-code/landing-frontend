"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n/provider";
import { useMemo } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import AzerbaijanFlag from "@/public/images/AzerbaijanFlag.svg";
import EnglishFlag from "@/public/images/EnglishFlag.svg";
import RussianFlag from "@/public/images/RussianFlag.svg";
import ThemeToggle from "./ThemeToggle";
import DownloadAppButton from "./DownloadAppButton";
import { cn } from "@/lib/utils";

const LOCALE_ORDER = ["az", "en", "ru"] as const;

const NavbarRight = () => {
  const { locale, setLocale } = useI18n();

  const locales = useMemo(
    () => ({
      az: { label: "Azərbaycan", flag: AzerbaijanFlag },
      en: { label: "English", flag: EnglishFlag },
      ru: { label: "Русский", flag: RussianFlag },
    }),
    [],
  );

  const currentLocale = locales[locale as "az" | "en" | "ru"] ?? locales.az;

  return (
    <div className="flex items-center gap-3 md:gap-5">
      <div className="flex items-center">
        <div className="flex items-center pr-2">
          <ThemeToggle />
        </div>
        <Select
          value={locale}
          onValueChange={(value) => setLocale(value as "az" | "en" | "ru")}
        >
          <SelectTrigger
            aria-label={`Select language. Current language: ${currentLocale.label}`}
            className="h-12 w-auto cursor-pointer rounded-none border-y-0 border-x border-border-muted bg-transparent px-2 shadow-none [&>svg]:hidden"
          >
            <div className="flex items-center gap-1">
              <span className="relative size-7 overflow-hidden rounded-full outline outline-1 outline-[#E5E6F2] outline-offset-[-1px]">
                <Image
                  src={currentLocale.flag}
                  alt={currentLocale.label}
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </span>
              <span className="hidden text-base font-medium text-ink md:inline">
                {locale.toUpperCase()}
              </span>
              <ChevronDown className="size-4 text-ink" />
            </div>
          </SelectTrigger>
          <SelectContent
            align="end"
            side="bottom"
            sideOffset={6}
            className="z-[60] w-[168px] min-w-[168px] overflow-hidden rounded-t-[2px] rounded-b-xl border border-border-muted bg-surface p-1.5 text-ink shadow-lg [&_[data-slot=select-item]]:w-full"
          >
            <SelectGroup className="flex w-full flex-col">
              {LOCALE_ORDER.map((lang, index) => {
                const meta = locales[lang];
                const isActive = lang === locale;
                const isLast = index === LOCALE_ORDER.length - 1;

                return (
                  <SelectItem
                    key={lang}
                    value={lang}
                    className={cn(
                      "w-full cursor-pointer rounded-none border-0 p-0 text-ink",
                      "focus:bg-transparent focus:text-ink data-[highlighted]:bg-transparent data-[highlighted]:text-ink",
                      "[&>span.absolute]:hidden [&>span:last-child]:block [&>span:last-child]:w-full",
                    )}
                  >
                    <div
                      className={cn(
                        "flex w-full items-center gap-2.5 px-3 py-2.5",
                        isActive
                          ? "border-b border-cyan"
                          : !isLast && "border-b border-[#EAEAEA]",
                      )}
                    >
                      <span className="relative size-6 shrink-0 overflow-hidden rounded-full bg-white outline outline-1 outline-[#E5E6F2] outline-offset-[-1px]">
                        <Image
                          src={meta.flag}
                          alt={meta.label}
                          fill
                          sizes="24px"
                          className="object-cover"
                        />
                      </span>
                      <span className="flex-1 text-left text-sm font-normal leading-5 text-ink">
                        {meta.label}
                      </span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <DownloadAppButton />
    </div>
  );
};

export default NavbarRight;
