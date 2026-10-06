// V9 Social: public pricing page. Accounts are opened on request; no self-serve billing.
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  FaqSection,
  Section,
  SiteShell,
} from '@gitroom/frontend/components/v9/site/site.shell';
import {
  CHANNELS,
  V9_SITE,
  salesHref,
} from '@gitroom/frontend/components/v9/site/site.data';

export const metadata: Metadata = {
  title: 'Pricing | V9 Social',
  description:
    'V9 Social accounts are set up on request. Contact sales for pricing for creators, teams and businesses.',
};

const included = [
  ...CHANNELS.map((c) => `${c.name} publishing and scheduling`),
  'Visual calendar, drafts and previews',
  'Media library',
  'Team workspace',
  'AI agent access over MCP',
];

const faq = [
  {
    q: 'Is there a free trial?',
    a: 'Tell us how you plan to use V9 Social and we will set up an account so you can try it with your own channels.',
  },
  {
    q: 'Can I sign up online?',
    a: 'Not yet. New accounts are opened by our team after a short conversation.',
  },
  {
    q: 'What should I include in my email?',
    a: 'The channels you want to connect, how many accounts and team members you have, and roughly how many posts you publish per week.',
  },
];

export default function PricingPage() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-[1120px] px-[20px] pt-[72px]">
        <span className="text-[14px] font-[600] tracking-[0.12em] uppercase text-[#bdbdbd]">
          Pricing
        </span>
        <h1 className="mt-[16px] text-[38px] md:text-[48px] font-[600] leading-[1.1] max-w-[820px]">
          Plans set up for you
        </h1>
        <p className="mt-[20px] text-[18px] leading-[1.6] text-[#bdbdbd] max-w-[760px]">
          {V9_SITE.name} is not open for self-serve sign-up yet. We set up each
          account with you and agree on a plan that fits your channels and team.
          Get in touch for pricing.
        </p>
      </section>

      <Section title="Talk to sales">
        <div className="grid gap-[16px] md:grid-cols-2">
          <div className="rounded-[12px] bg-[#1A1919] border border-white/5 p-[24px] flex flex-col gap-[16px]">
            <h3 className="text-[20px] font-[600]">Creators and businesses</h3>
            <p className="text-[15px] leading-[1.6] text-[#bdbdbd]">
              Pricing depends on the number of channels and team members. Email
              us and we will reply with a quote.
            </p>
            <a
              href={salesHref}
              className="self-start px-[20px] py-[12px] rounded-[10px] bg-brand text-white font-[600] hover:opacity-90"
            >
              Email {V9_SITE.contact}
            </a>
          </div>
          <div className="rounded-[12px] bg-[#1A1919] border border-white/5 p-[24px]">
            <h3 className="text-[20px] font-[600] mb-[12px]">
              Every plan includes
            </h3>
            <ul className="list-disc ps-[22px] flex flex-col gap-[8px] text-[15px] leading-[1.6] text-[#d4d4d4]">
              {included.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <FaqSection items={faq}>
        <p className="mt-[20px] text-[15px] text-[#bdbdbd]">
          Already have an account?{' '}
          <Link href="/auth/login" className="underline text-white">
            Sign in
          </Link>
          .
        </p>
      </FaqSection>
    </SiteShell>
  );
}
