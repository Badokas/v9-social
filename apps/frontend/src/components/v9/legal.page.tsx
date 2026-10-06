// V9 Social: shared shell for the public legal pages (/terms, /privacy).
import { ReactNode } from 'react';
import { SiteShell } from '@gitroom/frontend/components/v9/site/site.shell';

export const V9_LEGAL = {
  operator: 'Void9',
  service: 'V9 Social',
  // Resolved per deployment (http://localhost:4200 locally, https://post.v9.lt in prod)
  get url() {
    return (process.env.FRONTEND_URL || 'https://post.v9.lt').replace(
      /\/$/,
      ''
    );
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
  <SiteShell>
    <div className="mx-auto w-full max-w-[860px] mt-[32px] px-[12px]">
      <article className="v9-legal rounded-[12px] bg-[#1A1919] px-[24px] py-[40px] lg:px-[48px] flex flex-col gap-[16px] text-[15px] leading-[1.7] text-[#d4d4d4] [&_h1]:text-[36px] [&_h1]:font-[500] [&_h1]:text-white [&_h1]:leading-[1.2] [&_h2]:text-[20px] [&_h2]:font-[600] [&_h2]:text-white [&_h2]:mt-[24px] [&_ul]:list-disc [&_ul]:ps-[24px] [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-[6px] [&_a]:underline [&_a]:text-white [&_strong]:text-white">
        <h1>{title}</h1>
        <p>
          <strong>Last updated:</strong> {V9_LEGAL.updated}
        </p>
        {children}
      </article>
    </div>
  </SiteShell>
);
