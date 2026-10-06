// V9 Social: header + footer for the public pages
// (/, /channels/*, /ai-agents, /pricing, /terms, /privacy).
import Link from 'next/link';
import { ReactNode } from 'react';
import { LogoTextComponent } from '@gitroom/frontend/components/ui/logo-text.component';
import { ChannelsMenu } from '@gitroom/frontend/components/v9/site/channels.menu';
import {
  CHANNELS,
  V9_SITE,
  questionsHref,
  requestAccessHref,
} from '@gitroom/frontend/components/v9/site/site.data';

const navLink =
  'px-[8px] sm:px-[10px] py-[8px] rounded-[8px] hover:bg-white/10';

export const SiteShell = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen w-full bg-[#0E0E0E] text-white flex flex-col">
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:m-[8px] focus:p-[8px] focus:bg-white focus:text-black"
    >
      Skip to content
    </a>
    <header className="w-full border-b border-white/10">
      <div className="mx-auto w-full max-w-[1120px] px-[20px] py-[14px] flex items-center justify-between gap-[16px] flex-wrap">
        <Link
          href="/"
          aria-label="V9 Social home"
          className="flex items-center gap-[8px] sm:gap-[10px]"
        >
          <img
            src="/v9social/v9social-sq.svg"
            alt=""
            width={36}
            height={36}
            className="w-[26px] h-[26px] sm:w-[36px] sm:h-[36px]"
          />
          <LogoTextComponent className="w-[132px] h-auto sm:w-[205px]" />
        </Link>
        <nav
          aria-label="Main"
          className="flex items-center gap-[4px] text-[14px] sm:text-[15px] flex-wrap"
        >
          <ChannelsMenu
            channels={CHANNELS.map(({ slug, name, icon }) => ({
              slug,
              name,
              icon,
            }))}
          />
          <Link className={navLink} href="/ai-agents">
            AI Agents
          </Link>
          <Link className={navLink} href="/pricing">
            Pricing
          </Link>
          <Link
            href="/auth/login"
            className="ms-[4px] sm:ms-[8px] px-[14px] sm:px-[16px] py-[8px] rounded-[8px] bg-brand text-white font-[600] hover:opacity-90"
          >
            Sign in
          </Link>
        </nav>
      </div>
    </header>
    <main id="main" className="flex-1 w-full">
      {children}
    </main>
    <footer className="w-full border-t border-white/10 mt-[64px]">
      <div className="mx-auto w-full max-w-[1120px] px-[20px] py-[32px] grid gap-[24px] sm:grid-cols-3 text-[14px] text-[#a3a3a3]">
        <div className="flex flex-col gap-[8px]">
          <span className="text-white font-[600]">{V9_SITE.name}</span>
          <span>Social media scheduling for creators.</span>
        </div>
        <nav aria-label="Product" className="flex flex-col gap-[8px]">
          <span className="text-white font-[600]">Product</span>
          {CHANNELS.map((c) => (
            <Link
              key={c.slug}
              className="hover:underline"
              href={`/channels/${c.slug}`}
            >
              {c.name}
            </Link>
          ))}
          <Link className="hover:underline" href="/ai-agents">
            AI Agents
          </Link>
          <Link className="hover:underline" href="/pricing">
            Pricing
          </Link>
        </nav>
        <nav aria-label="Legal" className="flex flex-col gap-[8px]">
          <span className="text-white font-[600]">Company</span>
          <Link className="hover:underline" href="/terms">
            Terms of Service
          </Link>
          <Link className="hover:underline" href="/privacy">
            Privacy Policy
          </Link>
          <a className="hover:underline" href={requestAccessHref}>
            Request access
          </a>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-[1120px] px-[20px] pb-[32px] text-[12px] text-[#8a8a8a]">
        © {new Date().getFullYear()} {V9_SITE.operator} 
        {' '}
        (
        <a
          className="underline"
          href={V9_SITE.source}
          target="_blank"
          rel="noopener noreferrer"
        >
          AGPL-3.0
        </a>
        )
      </div>
    </footer>
  </div>
);

// Shared building blocks for the public pages.
export const Section = ({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: ReactNode;
}) => (
  <section className="mx-auto w-full max-w-[1120px] px-[20px] mt-[64px]">
    <h2 className="text-[28px] font-[600] leading-[1.25]">{title}</h2>
    {intro && (
      <p className="mt-[8px] text-[16px] text-[#bdbdbd] max-w-[720px]">
        {intro}
      </p>
    )}
    <div className="mt-[24px]">{children}</div>
  </section>
);

export const Card = ({ title, text }: { title: string; text: string }) => (
  <div className="rounded-[12px] bg-[#1A1919] border border-white/5 p-[20px]">
    <h3 className="text-[17px] font-[600]">{title}</h3>
    <p className="mt-[8px] text-[15px] leading-[1.6] text-[#bdbdbd]">{text}</p>
  </div>
);

export const FaqList = ({ items }: { items: { q: string; a: string }[] }) => (
  <div className="flex flex-col gap-[10px]">
    {items.map((f) => (
      <details
        key={f.q}
        className="group rounded-[12px] bg-[#1A1919] border border-white/5 p-[18px]"
      >
        <summary className="cursor-pointer text-[16px] font-[600] list-none flex justify-between gap-[12px]">
          {f.q}
          <span
            aria-hidden="true"
            className="group-open:rotate-45 transition-transform"
          >
            +
          </span>
        </summary>
        <p className="mt-[10px] text-[15px] leading-[1.6] text-[#bdbdbd]">
          {f.a}
        </p>
      </details>
    ))}
  </div>
);

// The FAQ section: heading, a short line and a contact link on the left, the
// accordion filling the column on the right. One column below `md`.
export const FaqSection = ({
  items,
  intro = 'Not finding what you need? Email us and a person will answer.',
  children,
}: {
  items: { q: string; a: string }[];
  intro?: string;
  children?: ReactNode;
}) => (
  <section className="mx-auto w-full max-w-[1120px] px-[20px] mt-[64px]">
    <div className="grid gap-[24px] md:grid-cols-[300px_1fr] md:gap-[48px] md:items-start">
      <div className="md:sticky md:top-[32px]">
        <h2 className="text-[28px] font-[600] leading-[1.25]">Questions</h2>
        <p className="mt-[8px] text-[16px] leading-[1.6] text-[#bdbdbd]">
          {intro}
        </p>
        <a
          href={questionsHref}
          className="inline-block mt-[16px] px-[18px] py-[10px] rounded-[10px] border border-white/20 text-[15px] font-[600] hover:bg-white/10"
        >
          Ask a question
        </a>
        {children}
      </div>
      <FaqList items={items} />
    </div>
  </section>
);

// `onBrand`: white primary button, for use on the orange CtaBand.
export const CtaButtons = ({ onBrand }: { onBrand?: boolean }) => (
  <div
    className={`flex gap-[12px] flex-wrap ${onBrand ? 'justify-center' : ''}`}
  >
    <Link
      href="/auth/login"
      className={`px-[20px] py-[12px] rounded-[10px] font-[600] hover:opacity-90 ${
        onBrand ? 'bg-white text-black' : 'bg-brand text-white'
      }`}
    >
      Sign in
    </Link>
    <a
      href={requestAccessHref}
      className="px-[20px] py-[12px] rounded-[10px] border border-white/20 font-[600] hover:bg-white/10"
    >
      Request access
    </a>
  </div>
);
