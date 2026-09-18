"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "@/lib/constants/app-links";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/lock-body-scroll";

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadAppModal = ({ isOpen, onClose }: DownloadAppModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    lockBodyScroll();
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      unlockBodyScroll();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-xl border border-[#EAEAEA] bg-[#F4F8FA] p-6 shadow-2xl sm:max-w-[760px] sm:p-7 md:p-8 dark:border-[#22262F] dark:bg-[#081D2E]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Bağla"
          className="absolute right-4 top-4 z-10 inline-flex size-9 items-center justify-center rounded-lg text-[#011729] transition-colors hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
        >
          <X className="size-5" />
        </button>

        <div className="flex flex-col items-center justify-center gap-6 pt-2 sm:flex-row sm:gap-10 sm:pt-2">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left">
            <div className="relative size-[168px] shrink-0 overflow-hidden rounded-md bg-white p-2 dark:bg-[#011729] sm:size-[72px] sm:p-1">
              <img
                src="/icons/home/app-qr.svg"
                alt=""
                width={168}
                height={168}
                className="size-full object-contain dark:hidden"
              />
              <img
                src="/icons/home/app-qr-dark.svg"
                alt=""
                width={168}
                height={168}
                className="hidden size-full object-contain dark:block"
              />
            </div>

            <div className="flex max-w-[220px] flex-col justify-start gap-0.5 sm:w-[169px]">
              <span
                id="download-modal-title"
                className="text-base font-bold leading-6 text-[#011729] sm:text-sm sm:leading-5 dark:text-white"
              >
                QR-kodu oxut
              </span>
              <span className="text-sm font-medium leading-5 text-[#557C9F] dark:text-[#8FB1C6]">
                Kamerayla skan et, tətbiqə keç
              </span>
            </div>
          </div>

          <div className="hidden h-[34px] w-0.5 bg-[#F0F0F1] sm:block dark:bg-[#22262F]" />

          <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center">
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Google Play"
              className="inline-flex w-full max-w-[220px] justify-center transition-transform hover:scale-105 active:scale-95 sm:w-auto"
            >
              <img
                src="/icons/home/google-play.svg"
                alt="Get it on Google Play"
                width={180}
                height={53}
                className="h-12 w-[180px] rounded-[5px] border border-[#A6A6A6] bg-black object-contain sm:h-10 sm:w-[135px]"
              />
            </a>

            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="App Store"
              className="inline-flex w-full max-w-[220px] justify-center transition-transform hover:scale-105 active:scale-95 sm:w-auto"
            >
              <img
                src="/icons/home/app-store.svg"
                alt="Download on the App Store"
                width={180}
                height={53}
                className="h-12 w-[180px] rounded-[7px] border border-[#A6A6A6] bg-[#0C0D10] object-contain sm:h-10 sm:w-[120px]"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppModal;
