// V9 Social: public home page at "/" for signed-out visitors (see proxy.ts).
// Signed-in users are still redirected to the app by proxy.ts.
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Card,
  CtaButtons,
  FaqSection,
  Section,
  SiteShell,
} from '@gitroom/frontend/components/v9/site/site.shell';
import {
  AiClientCards,
  CtaBand,
  FeatureRows,
  MediaFrame,
} from '@gitroom/frontend/components/v9/site/site.graphics';
import {
  CHANNELS,
  V9_SITE,
} from '@gitroom/frontend/components/v9/site/site.data';

export const metadata: Metadata = {
  title: 'V9 Social: social media scheduling for creators and businesses',
  description:
    'V9 Social is a web app to plan, schedule and publish posts to TikTok and Instagram from one calendar, by hand or with your AI assistant.',
};

const audiences = [
  {
    title: 'Creators',
    text: 'Plan a week of TikTok videos and Instagram posts in one sitting and let them go out on schedule.',
  },
  {
    title: 'Businesses',
    text: 'Keep every brand account in one calendar, with drafts, previews and a shared media library.',
  },
  {
    title: 'AI-first teams',
    text: 'Ask Claude or ChatGPT to draft and schedule posts. Everything lands in your calendar for review.',
  },
];

const features = [
  {
    eyebrow: 'Planning',
    title: 'Schedule everywhere at once',
    text: 'Write a post once and send it to every channel you pick, on the schedule you set. See the whole month in a visual calendar before anything goes out.',
    image: 'feat-calendar',
    alt: 'Month calendar for October 2026 with TikTok, Instagram and draft posts on most days.',
  },
  {
    eyebrow: 'Composer',
    title: 'One post, the right format for each channel',
    text: 'Edit the text per channel, attach photos or videos and preview how the post will look on TikTok and Instagram.',
    image: 'feat-composer',
    alt: 'Post composer with Global, TikTok and Instagram tabs, a caption, three images and phone previews.',
    link: { href: '/channels/tiktok', label: 'TikTok post settings' },
  },
  {
    eyebrow: 'Media',
    title: 'A media library for every post',
    text: 'Upload images and videos once and reuse them across posts and channels.',
    image: 'feat-media',
    alt: 'Media library grid with images and videos, one selected for insertion.',
  },
  {
    eyebrow: 'Teams',
    title: 'Built for teams',
    text: 'Invite colleagues to your workspace, plan together and share preview links before a post is published.',
    image: 'feat-team',
    alt: 'Team list with an admin and two members, and a copied post preview link.',
  },
];

const faq = [
  {
    q: 'Who is V9 Social for?',
    a: 'Creators and businesses who publish to their own social media accounts and want to plan posts ahead in one place.',
  },
  {
    q: 'How do I get an account?',
    a: 'Accounts are opened on request. Use Request access and tell us which channels you want to connect.',
  },
  {
    q: 'Does V9 Social post anything on its own?',
    a: 'No. Content is only published when you click Post Now or when a post you or your AI assistant scheduled reaches its time.',
  },
  {
    q: 'Which AI assistants work with V9 Social?',
    a: 'Any app that supports MCP, including Claude, ChatGPT, Claude Code and Cursor. See the AI Agents page.',
  },
  {
    q: 'What happens to my data?',
    a: 'We store what is needed to publish for you: your connected account profile, access tokens and the content you upload. Disconnecting a channel deletes its tokens. Details are in the Privacy Policy.',
  },
  {
    q: 'Is V9 Social open source?',
    a: 'Yes. It is built on the open-source Postiz project and our modified source code is public under AGPL-3.0.',
  },
];

export default function HomePage() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-[1120px] px-[20px] pt-[72px] text-center flex flex-col items-center">
        <h1 className="text-[40px] md:text-[56px] font-[600] leading-[1.08] max-w-[860px]">
          Plan and publish your social media from one calendar
        </h1>
        <p className="mt-[20px] text-[18px] leading-[1.6] text-[#bdbdbd] max-w-[700px]">
          {V9_SITE.name} is a web app for creators and businesses. Write a post
          once, choose your channels, preview it and publish it now or at the
          time you pick. Or let your AI assistant do the planning.
        </p>
        <div className="mt-[32px] flex justify-center">
          <CtaButtons />
        </div>
      </section>

      <MediaFrame
        media={{
          kind: 'video',
          name: 'v9-in-action',
          alt: 'A post is created in V9 Social: two channels are selected, the caption is typed, an image is added, and the post is added to Thursday 18:00 in the week calendar, where it changes from Scheduled to Published.',
        }}
      />

      <Section title="Who is V9 Social for?">
        <div className="grid gap-[16px] md:grid-cols-3">
          {audiences.map((s) => (
            <Card key={s.title} {...s} />
          ))}
        </div>
      </Section>

      <Section
        title="Power your content with AI"
        intro="Connect your AI assistant to V9 Social through MCP. It drafts and schedules posts, and you review everything in the calendar."
      >
        <AiClientCards />
        <Link
          href="/ai-agents"
          className="inline-block mt-[18px] text-[15px] underline"
        >
          How AI agents work with V9 Social
        </Link>
      </Section>

      <Section title="All the tools you need in one place">
        <FeatureRows rows={features} />
      </Section>

      <Section
        title="Supported channels"
        intro="Connect the accounts you own. Each channel page explains what you can post and which permissions are used."
      >
        <ul className="grid gap-[16px] sm:grid-cols-2">
          {CHANNELS.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/channels/${c.slug}`}
                className="flex items-start gap-[16px] rounded-[12px] bg-[#1A1919] border border-white/5 p-[20px] hover:border-white/20"
              >
                <img
                  src={c.icon}
                  alt=""
                  width={48}
                  height={48}
                  className="rounded-[10px]"
                />
                <span className="flex flex-col gap-[6px]">
                  <span className="text-[18px] font-[600]">{c.name}</span>
                  <span className="text-[15px] leading-[1.6] text-[#bdbdbd]">
                    {c.headline}
                  </span>
                  <span className="text-[14px] underline">
                    Learn more about {c.name}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <FaqSection items={faq} />

      <CtaBand
        title="Ready to get started?"
        text={`Already have an account? Sign in. New to ${V9_SITE.name}? Request access and we will set you up.`}
      >
        <CtaButtons onBrand />
      </CtaBand>
    </SiteShell>
  );
}
