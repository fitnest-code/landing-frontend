import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
  WHATSAPP_CONTACT_HREF,
  WHATSAPP_CONTACT_PHONE,
} from "@/lib/constants/app-links";

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
      <path
        fill="#000"
        d="M16.7 12.6c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.7-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.5 1.1 8.6.7 1 1.6 2.2 2.7 2.1 1.1 0 1.5-.7 2.8-.7 1.3 0 1.6.7 2.8.7 1.2 0 1.9-1 2.6-2 .8-1.2 1.1-2.3 1.1-2.4-.1 0-2.1-.8-2.1-3.3zm-2-6.2c.6-.7 1-1.7.9-2.7-1 .1-2.1.6-2.7 1.4-.6.7-1.1 1.7-.9 2.7 1 .1 2-.5 2.7-1.4z"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
      <path fill="#EA4335" d="M3.5 2.6 13.2 12 3.5 21.4c-.4-.2-.7-.7-.7-1.3V3.9c0-.6.3-1.1.7-1.3z" />
      <path fill="#FBBC04" d="m13.2 12 2.8-2.8 4.6 2.6c.6.4.6 1.2 0 1.6l-4.6 2.6L13.2 12z" />
      <path fill="#4285F4" d="M13.2 12 3.5 2.6c.3-.2.7-.2 1.1 0l11.4 6.6L13.2 12z" />
      <path fill="#34A853" d="M13.2 12 15.9 14.8 4.6 21.4c-.4.2-.8.2-1.1 0L13.2 12z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-7" aria-hidden>
      <path
        fill="#25D366"
        d="M12 2.1C6.6 2.1 2.2 6.5 2.2 11.9c0 1.7.5 3.4 1.3 4.8L2 22l5.4-1.4c1.4.8 3 1.2 4.6 1.2 5.4 0 9.8-4.4 9.8-9.8S17.4 2.1 12 2.1zm0 17.8c-1.4 0-2.8-.4-4-1.1l-.3-.2-3.2.8.9-3.1-.2-.3c-.8-1.2-1.2-2.6-1.2-4.1 0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.3-.4.1-.1.1-.2.2-.4 0-.1 0-.3-.1-.4-.1-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.4 3.8 3.4.5.2.9.4 1.3.5.5.2 1 .1 1.3.1.4-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1-.1-.1-.3-.2-.5-.3z"
      />
    </svg>
  );
}

const links = [
  {
    href: APP_STORE_URL,
    label: "App Store",
    Icon: AppleIcon,
  },
  {
    href: GOOGLE_PLAY_URL,
    label: "Google Play",
    Icon: PlayIcon,
  },
  {
    href: WHATSAPP_CONTACT_HREF,
    label: "Əlaqə",
    subtitle: WHATSAPP_CONTACT_PHONE,
    Icon: WhatsAppIcon,
  },
] as const;

export default function ElaqeLinksPage() {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#061525] px-5 py-12 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,219,219,0.18),_transparent_55%),radial-gradient(ellipse_at_bottom,_rgba(255,106,66,0.12),_transparent_50%)]"
      />

      <div className="relative z-10 flex w-full max-w-[420px] flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <img
            src="/icons/home/logo-white.svg"
            alt="FitNest"
            width={120}
            height={40}
            className="h-10 w-auto"
          />
          <h1 className="text-2xl font-semibold tracking-tight">Əlaqə</h1>
          <p className="max-w-[280px] text-sm leading-5 text-white/65">
            Tətbiqi endirin və ya WhatsApp üzərindən bizimlə əlaqə saxlayın.
          </p>
        </div>

        <nav aria-label="Əlaqə linkləri" className="flex w-full flex-col gap-3">
          {links.map(({ href, label, Icon, ...rest }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5 backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#00dbdb]/40 hover:bg-white/[0.1] active:translate-y-0 active:scale-[0.99]"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-white">
                <Icon />
              </span>
              <span className="flex min-w-0 flex-1 flex-col text-left">
                <span className="text-base font-semibold leading-5">{label}</span>
                {"subtitle" in rest && rest.subtitle ? (
                  <span className="text-sm leading-5 text-white/55">{rest.subtitle}</span>
                ) : null}
              </span>
              <span
                aria-hidden
                className="text-lg text-white/35 transition group-hover:text-[#00dbdb]"
              >
                ›
              </span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
