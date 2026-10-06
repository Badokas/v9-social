// V9 Social: public "AI Agents" page. The in-app /agents route is taken, hence /ai-agents.
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
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
  MediaFrame,
} from '@gitroom/frontend/components/v9/site/site.graphics';

export const metadata: Metadata = {
  title: 'AI Agents | V9 Social',
  description:
    'Connect Claude, ChatGPT or another MCP client to V9 Social to draft and schedule posts from a conversation, with every post in your calendar.',
};

const clients = [
  {
    title: 'Claude and ChatGPT',
    text: 'Add V9 Social as a connector and sign in with your V9 Social account. No API key to copy.',
  },
  {
    title: 'Coding agents',
    text: 'Claude Code, Cursor and other MCP clients connect with the configuration shown in your V9 Social settings.',
  },
  {
    title: 'Your own tools',
    text: 'Use an API key from settings to connect any MCP-compatible client or automation.',
  },
];

const abilities = [
  {
    title: 'See your channels',
    text: 'The agent lists the accounts connected to your workspace and the settings each one needs.',
  },
  {
    title: 'Write and attach media',
    text: 'It drafts the text for each channel and attaches images or videos you provide by link.',
  },
  {
    title: 'Save drafts or schedule',
    text: 'It saves posts as drafts for you to review, or schedules them for the time you ask for.',
  },
  {
    title: 'Check what is planned',
    text: 'Ask what is scheduled for a day or a week and get the list from your calendar.',
  },
];

const control = [
  {
    title: 'Same rules as the composer',
    text: 'Posts from an agent go through the same checks as posts you write by hand, including each channel\u2019s required settings such as TikTok privacy and disclosure.',
  },
  {
    title: 'Everything lands in your calendar',
    text: 'Each post appears in the calendar with a preview link, where you can edit, move or delete it.',
  },
  {
    title: 'Your account, your permissions',
    text: 'An agent acts only inside the workspace you sign in to and only on channels you have connected.',
  },
  {
    title: 'Disconnect any time',
    text: 'Remove the connector in your AI app or rotate your API key in settings to revoke access.',
  },
];

const faq = [
  {
    q: 'What is MCP?',
    a: 'The Model Context Protocol is an open standard that lets AI apps use tools from other services. V9 Social provides an MCP server so your AI app can work with your calendar.',
  },
  {
    q: 'Can I keep agents to drafts only?',
    a: 'Yes. Ask the agent to save posts as drafts, then review and schedule them yourself in the calendar.',
  },
  {
    q: 'Does the agent get my social media passwords?',
    a: 'No. Channels are connected with each platform\u2019s official login inside V9 Social. The agent only uses V9 Social\u2019s tools.',
  },
];

export default function AiAgentsPage() {
  return (
    <SiteShell>
      <section className="mx-auto w-full max-w-[1120px] px-[20px] pt-[72px]">
        <span className="text-[14px] font-[600] tracking-[0.12em] uppercase text-[#bdbdbd]">
          AI Agents
        </span>
        <h1 className="mt-[16px] text-[38px] md:text-[48px] font-[600] leading-[1.1] max-w-[820px]">
          Plan posts with your AI assistant
        </h1>
        <p className="mt-[20px] text-[18px] leading-[1.6] text-[#bdbdbd] max-w-[760px]">
          Connect Claude, ChatGPT or another MCP client to V9 Social. Describe
          what you want to post and the agent prepares it in your calendar,
          where you review it before it goes out.
        </p>
        <div className="mt-[32px]">
          <CtaButtons />
        </div>
      </section>

      <MediaFrame
        media={{
          kind: 'video',
          name: 'v9-ai-agent',
          alt: 'An AI assistant is asked to plan three autumn launch posts. It calls the V9 Social tools to list channels and schedule three posts, which appear in the V9 Social week calendar as Scheduled.',
        }}
      />

      <Section title="Power your content with AI">
        <AiClientCards />
      </Section>

      <Section title="Ways to connect">
        <div className="grid gap-[16px] md:grid-cols-3">
          {clients.map((f) => (
            <Card key={f.title} {...f} />
          ))}
        </div>
      </Section>

      <Section title="What an agent can do">
        <div className="grid gap-[16px] sm:grid-cols-2">
          {abilities.map((f) => (
            <Card key={f.title} {...f} />
          ))}
        </div>
      </Section>

      <Section title="You stay in control">
        <div className="grid gap-[16px] sm:grid-cols-2">
          {control.map((f) => (
            <Card key={f.title} {...f} />
          ))}
        </div>
      </Section>

      <FaqSection items={faq} />

      <CtaBand
        title="Let your assistant do the planning"
        text="Connect your AI app to V9 Social and keep every post in one calendar you control."
      >
        <CtaButtons onBrand />
      </CtaBand>
    </SiteShell>
  );
}
