// V9 Social: public channel pages (/channels/tiktok, /channels/instagram).
// Content lives in components/v9/site/site.data.ts.
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Card,
  CtaButtons,
  FaqSection,
  Section,
  SiteShell,
} from '@gitroom/frontend/components/v9/site/site.shell';
import {
  CtaBand,
  MediaFrame,
} from '@gitroom/frontend/components/v9/site/site.graphics';
import { findChannel } from '@gitroom/frontend/components/v9/site/site.data';

type Props = { params: Promise<{ channel: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const channel = findChannel((await params).channel);
  if (!channel) return { title: 'Not found | V9 Social' };
  return { title: channel.metaTitle, description: channel.metaDescription };
}

const List = ({ items, ordered }: { items: string[]; ordered?: boolean }) => {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag
      className={`${
        ordered ? 'list-decimal' : 'list-disc'
      } ps-[22px] flex flex-col gap-[8px] text-[15px] leading-[1.6] text-[#d4d4d4]`}
    >
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </Tag>
  );
};

export default async function ChannelPage({ params }: Props) {
  const channel = findChannel((await params).channel);
  if (!channel) notFound();

  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-[1120px] px-[20px] pt-[56px]">
        <nav aria-label="Breadcrumb" className="text-[14px] text-[#a3a3a3]">
          <Link href="/" className="hover:underline">
            Home
          </Link>{' '}
          / Channels / <span aria-current="page">{channel.name}</span>
        </nav>
        <div className="mt-[24px] flex items-center gap-[16px]">
          <img
            src={channel.icon}
            alt=""
            width={56}
            height={56}
            className="rounded-[12px]"
          />
          <span className="text-[14px] font-[600] tracking-[0.12em] uppercase text-[#bdbdbd]">
            {channel.name}
          </span>
        </div>
        <h1 className="mt-[16px] text-[38px] md:text-[48px] font-[600] leading-[1.1] max-w-[820px]">
          {channel.headline}
        </h1>
        <p className="mt-[20px] text-[18px] leading-[1.6] text-[#bdbdbd] max-w-[760px]">
          {channel.intro}
        </p>
        <div className="mt-[32px]">
          <CtaButtons />
        </div>
      </section>

      <MediaFrame media={channel.media} />

      <Section title={`What you can post to ${channel.name}`}>
        <div className="grid gap-[16px] md:grid-cols-3">
          {channel.postTypes.map((f) => (
            <Card key={f.title} {...f} />
          ))}
        </div>
      </Section>

      <Section title="Settings for every post">
        <div className="grid gap-[16px] sm:grid-cols-2 lg:grid-cols-3">
          {channel.controls.map((f) => (
            <Card key={f.title} {...f} />
          ))}
        </div>
      </Section>

      <Section title={`Connecting ${channel.name}`}>
        <div className="grid gap-[24px] md:grid-cols-2">
          <div className="rounded-[12px] bg-[#1A1919] border border-white/5 p-[20px]">
            <h3 className="text-[17px] font-[600] mb-[12px]">You need</h3>
            <List items={channel.requirements} />
          </div>
          <div className="rounded-[12px] bg-[#1A1919] border border-white/5 p-[20px]">
            <h3 className="text-[17px] font-[600] mb-[12px]">Steps</h3>
            <List items={channel.connectSteps} ordered />
          </div>
        </div>
      </Section>

      <Section
        title="Data we store"
        intro={`Only what is needed to publish to ${channel.name} for you.`}
      >
        <List items={channel.data} />
        <p className="mt-[16px] text-[15px] text-[#bdbdbd]">
          Retention, deletion and your rights are described in the{' '}
          <Link href="/privacy" className="underline text-white">
            Privacy Policy
          </Link>
          .
        </p>
      </Section>

      <FaqSection
        items={channel.faq}
        intro={`Anything else you want to know about ${channel.name} in V9 Social? Email us and a person will answer.`}
      />

      <CtaBand
        title={`Take the hassle out of ${channel.name}`}
        text={`Plan your ${channel.name} posts ahead and let them go out on time, while you get on with making content.`}
      >
        <CtaButtons onBrand />
      </CtaBand>
      <p className="mx-auto w-full max-w-[1120px] px-[20px] mt-[24px] text-[13px] text-[#8a8a8a]">
        {channel.disclaimer}
      </p>
    </SiteShell>
  );
}
