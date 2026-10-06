// V9 Social: graphic blocks for the public site. Artwork is original, generated
// from assets/site-media (see UPSTREAM.md "Public site").
import Link from 'next/link';
import { ReactNode } from 'react';
import { LoopVideo } from '@gitroom/frontend/components/v9/site/loop.video';

const MEDIA = '/v9social/site';

export type SiteMedia =
  | { kind: 'video'; name: string; alt: string }
  | { kind: 'image'; name: string; alt: string };

// Browser-style frame with a soft brand glow around a video or image.
export const MediaFrame = ({ media }: { media: SiteMedia }) => (
  <figure className="relative mx-auto w-full max-w-[1120px] px-[20px] mt-[48px]">
    <div
      aria-hidden="true"
      className="absolute inset-x-[10%] -top-[20px] h-[60%] rounded-full bg-brand/30 blur-[90px]"
    />
    <div className="relative rounded-[16px] border border-white/10 bg-[#141313] p-[8px] shadow-2xl">
      <div className="overflow-hidden rounded-[10px]">
        {media.kind === 'video' ? (
          <LoopVideo
            src={`${MEDIA}/${media.name}.mp4`}
            poster={`${MEDIA}/${media.name}.webp`}
            label={media.alt}
          />
        ) : (
          <img
            src={`${MEDIA}/${media.name}.webp`}
            alt={media.alt}
            className="block w-full h-auto"
          />
        )}
      </div>
    </div>
    {media.kind === 'video' && (
      <figcaption className="sr-only">{media.alt}</figcaption>
    )}
  </figure>
);

const aiClients = [
  {
    title: 'Via ChatGPT',
    text: 'Write and refine posts in ChatGPT with simple prompts, then schedule them in V9 Social.',
    image: 'ai-chatgpt',
    alt: 'A chat asks to write two posts about an autumn sale. The V9 Social tool replies that an Instagram post on Wednesday and a TikTok post on Friday are scheduled.',
    bg: 'from-[#9a3412] via-[#7c2d12] to-[#2a0f05]',
  },
  {
    title: 'Via Claude',
    text: 'Connect Claude to V9 Social over MCP to plan, write and schedule a week of posts.',
    image: 'ai-claude',
    alt: 'A chat asks to plan three launch posts. The V9 Social tool lists three scheduled posts for TikTok and Instagram.',
    bg: 'from-[#b45309] via-[#92400e] to-[#2b1404]',
  },
  {
    title: 'Via Claude Code and Cursor',
    text: 'Schedule posts from your terminal or editor while you work, with the same V9 Social tools.',
    image: 'ai-code',
    alt: 'A terminal where a coding agent uploads a video and schedules an Instagram reel and a TikTok teaser in V9 Social, then prints preview links.',
    bg: 'from-[#be123c] via-[#881337] to-[#2a0610]',
  },
];

// Gradient cards with an AI client window, like "Power your content with AI".
export const AiClientCards = () => (
  <div className="grid gap-[16px] lg:grid-cols-3">
    {aiClients.map((c) => (
      <div
        key={c.title}
        className={`rounded-[18px] bg-gradient-to-br ${c.bg} p-[22px] flex flex-col gap-[12px] overflow-hidden`}
      >
        <h3 className="text-[22px] font-[600]">{c.title}</h3>
        <p className="text-[15px] leading-[1.6] text-white/85">{c.text}</p>
        <img
          src={`${MEDIA}/${c.image}.webp`}
          alt={c.alt}
          loading="lazy"
          className="mt-auto w-full h-auto rounded-[12px]"
        />
      </div>
    ))}
  </div>
);

export type FeatureRow = {
  eyebrow: string;
  title: string;
  text: string;
  image: string;
  alt: string;
  link?: { href: string; label: string };
};

// Alternating text / graphic rows ("All the tools you need").
export const FeatureRows = ({ rows }: { rows: FeatureRow[] }) => (
  <div className="flex flex-col gap-[56px]">
    {rows.map((r, i) => (
      <div
        key={r.title}
        className="grid gap-[28px] md:grid-cols-2 md:items-center"
      >
        <div className={i % 2 ? 'md:order-2' : ''}>
          <span className="text-[13px] font-[600] tracking-[0.14em] uppercase text-[#fdba74]">
            {r.eyebrow}
          </span>
          <h3 className="mt-[10px] text-[26px] font-[600] leading-[1.25]">
            {r.title}
          </h3>
          <p className="mt-[12px] text-[16px] leading-[1.65] text-[#bdbdbd] max-w-[480px]">
            {r.text}
          </p>
          {r.link && (
            <Link
              href={r.link.href}
              className="inline-block mt-[14px] text-[15px] underline"
            >
              {r.link.label}
            </Link>
          )}
        </div>
        <img
          src={`${MEDIA}/${r.image}.webp`}
          alt={r.alt}
          loading="lazy"
          className="w-full h-auto rounded-[18px]"
        />
      </div>
    ))}
  </div>
);

// Full-width gradient call-to-action band.
export const CtaBand = ({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: ReactNode;
}) => (
  <section className="mx-auto w-full max-w-[1120px] px-[20px] mt-[72px]">
    <div className="rounded-[20px] bg-gradient-to-br from-[#c2410c] via-[#9a3412] to-[#431407] px-[28px] py-[44px] md:px-[56px] text-center flex flex-col items-center gap-[14px]">
      <h2 className="text-[30px] md:text-[36px] font-[600] leading-[1.2]">
        {title}
      </h2>
      <p className="text-[17px] text-white/85 max-w-[620px]">{text}</p>
      <div className="mt-[10px]">{children}</div>
    </div>
  </section>
);
