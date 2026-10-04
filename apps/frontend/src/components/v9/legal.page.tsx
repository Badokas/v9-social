// V9 Social: shared shell for the public legal pages (/terms, /privacy).
import Link from 'next/link';
import { ReactNode } from 'react';
import { LogoTextComponent } from '@gitroom/frontend/components/ui/logo-text.component';

export const V9_LEGAL = {
  operator: 'Void9',
  service: 'V9 Social',
  // Resolved per deployment (http://localhost:4200 locally, https://post.v9.lt in prod)
  get url() {
    return (process.env.FRONTEND_URL || 'https://post.v9.lt').replace(/\/$/, '');
  },
  contact: 'legal@void9.com',
  updated: '4 October 2026',
};

export const LegalPage = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <div className="min-h-screen w-full bg-[#0E0E0E] text-white p-[12px]">
    <div className="mx-auto w-full max-w-[860px] rounded-[12px] bg-[#1A1919] px-[24px] py-[40px] lg:px-[48px]">
      <header className="flex items-center justify-between gap-[16px] mb-[40px] flex-wrap">
        <Link href="/auth/login" aria-label="V9 Social home">
          <LogoTextComponent />
        </Link>
        <nav className="flex gap-[20px] text-[14px]">
          <Link className="underline hover:font-bold" href="/terms">
            Terms of Service
          </Link>
          <Link className="underline hover:font-bold" href="/privacy">
            Privacy Policy
          </Link>
        </nav>
      </header>
      <main className="v9-legal flex flex-col gap-[16px] text-[15px] leading-[1.7] text-[#d4d4d4] [&_h1]:text-[36px] [&_h1]:font-[500] [&_h1]:text-white [&_h1]:leading-[1.2] [&_h2]:text-[20px] [&_h2]:font-[600] [&_h2]:text-white [&_h2]:mt-[24px] [&_ul]:list-disc [&_ul]:ps-[24px] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-[6px] [&_a]:underline [&_a]:text-white [&_strong]:text-white">
        <h1>{title}</h1>
        <p>
          <strong>Last updated:</strong> {V9_LEGAL.updated}
        </p>
        {children}
      </main>
      <footer className="mt-[48px] pt-[24px] border-t border-[#2a2a2a] text-[13px] text-[#a3a3a3]">
        {V9_LEGAL.service} is operated by {V9_LEGAL.operator}. Contact:{' '}
        <a className="underline" href={`mailto:${V9_LEGAL.contact}`}>
          {V9_LEGAL.contact}
        </a>
      </footer>
    </div>
  </div>
);
