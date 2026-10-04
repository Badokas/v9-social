// V9 Social: public Terms of Service (no login required, see proxy.ts).
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  LegalPage,
  V9_LEGAL,
} from '@gitroom/frontend/components/v9/legal.page';

export const metadata: Metadata = {
  title: 'Terms of Service | V9 Social',
  description:
    'Terms of Service for V9 Social, a social media scheduling and publishing tool.',
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your access to and use
        of {V9_LEGAL.service}, the social media management service available at{' '}
        <a href={V9_LEGAL.url}>{V9_LEGAL.url}</a> (the &quot;Service&quot;),
        operated by <strong>{V9_LEGAL.operator}</strong> (&quot;we&quot;,
        &quot;us&quot;, or &quot;our&quot;). By accessing or using the Service,
        you agree to these Terms. If you do not agree, do not use the Service.
      </p>

      <h2>1. The Service</h2>
      <p>
        {V9_LEGAL.service} lets creators and businesses connect their own social
        media accounts (including TikTok, Instagram, Facebook, Threads and X)
        and schedule, publish and manage content across them from a single
        dashboard. Accounts are available to creators and businesses who request
        access and are approved by us.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old, or the age of majority in your
        jurisdiction, and able to enter into a binding agreement. By using the
        Service you confirm that you meet these requirements.
      </p>

      <h2>3. Connecting third-party accounts</h2>
      <p>
        To publish content, you authorize the Service to access your social
        media accounts through each platform&apos;s official authorization
        (OAuth) flow.
      </p>
      <ul>
        <li>
          The Service only receives the permissions you approve during
          authorization, and uses them only to schedule, publish and manage
          content on your behalf.
        </li>
        <li>
          Your use of each connected platform remains subject to that
          platform&apos;s own terms and policies. Your use of TikTok through the
          Service is subject to the{' '}
          <a
            href="https://www.tiktok.com/legal/terms-of-service"
            target="_blank"
            rel="noopener"
          >
            TikTok Terms of Service
          </a>
          , the{' '}
          <a
            href="https://www.tiktok.com/community-guidelines"
            target="_blank"
            rel="noopener"
          >
            TikTok Community Guidelines
          </a>{' '}
          and, where applicable, TikTok&apos;s{' '}
          <a
            href="https://www.tiktok.com/legal/page/global/music-usage-confirmation/en"
            target="_blank"
            rel="noopener"
          >
            Music Usage Confirmation
          </a>{' '}
          and{' '}
          <a
            href="https://www.tiktok.com/legal/page/global/bc-policy/en"
            target="_blank"
            rel="noopener"
          >
            Branded Content Policy
          </a>
          .
        </li>
        <li>
          You can revoke the Service&apos;s access to any connected account at
          any time, in the Service or in the platform&apos;s own settings.
          Revoking access stops scheduled content for that account from being
          published.
        </li>
      </ul>

      <h2>4. Your content and responsibilities</h2>
      <p>
        You keep ownership of the content you create, upload, schedule or
        publish through the Service (&quot;Your Content&quot;). You are
        responsible for Your Content and for how you use the Service. You agree
        not to use the Service to:
      </p>
      <ul>
        <li>
          publish content that is unlawful, infringing, defamatory, deceptive or
          that violates others&apos; rights;
        </li>
        <li>
          violate the terms, policies or community guidelines of any connected
          platform, including TikTok;
        </li>
        <li>
          distribute spam or malware, or engage in platform manipulation or
          inauthentic behavior;
        </li>
        <li>
          impersonate any person or entity, or misrepresent your affiliation
          with them; or
        </li>
        <li>
          disrupt, reverse engineer or gain unauthorized access to the Service
          or its infrastructure.
        </li>
      </ul>
      <p>
        You grant us a limited license to store, process and transmit Your
        Content only to operate the Service and publish it to the platforms you
        connected, at your direction.
      </p>

      <h2>5. Publishing</h2>
      <p>
        The Service publishes content on your instructions. You choose the
        audience, interaction settings and commercial content disclosures for
        each post before it is published. We do not review or endorse Your
        Content. A connected platform may delay, restrict or reject a post under
        its own rules, API limits or review processes, which are outside our
        control.
      </p>

      <h2>6. Privacy</h2>
      <p>
        How we handle personal data, including data received from connected
        platforms, is described in our{' '}
        <Link href="/privacy">Privacy Policy</Link>, which forms part of these
        Terms.
      </p>

      <h2>7. Availability and changes</h2>
      <p>
        The Service is provided on an &quot;as available&quot; basis. We may
        modify, suspend or discontinue all or part of it at any time. We may
        update these Terms; the date above shows when the latest version took
        effect. Continuing to use the Service after a change means you accept
        the updated Terms.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;,
        WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT.
        We do not warrant that the Service will be uninterrupted, error-free or
        secure, or that content will be published successfully to any platform.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE ARE NOT LIABLE FOR ANY
        INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY
        LOSS OF PROFITS, DATA OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
        Nothing in these Terms limits liability that cannot be limited under
        applicable law.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        You agree to indemnify us against claims, damages and expenses arising
        from Your Content, your use of the Service, or your violation of these
        Terms or of any connected platform&apos;s terms.
      </p>

      <h2>11. Termination</h2>
      <p>
        We may suspend or close your account if you violate these Terms or if we
        discontinue the Service. You may stop using the Service at any time and
        ask us to delete your account as described in the Privacy Policy.
      </p>

      <h2>12. Open source</h2>
      <p>
        {V9_LEGAL.service} is based on the open-source project Postiz and is
        licensed under the GNU AGPL-3.0. The source code is available at{' '}
        <a
          href="https://github.com/Badokas/v9-social"
          target="_blank"
          rel="noopener"
        >
          github.com/Badokas/v9-social
        </a>
        .
      </p>

      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws of the Republic of Lithuania.
        Disputes are subject to the courts of Lithuania, without prejudice to
        any mandatory consumer protection rights you have where you live.
      </p>

      <h2>14. Contact</h2>
      <p>
        Questions about these Terms:{' '}
        <a href={`mailto:${V9_LEGAL.contact}`}>{V9_LEGAL.contact}</a>.
      </p>
    </LegalPage>
  );
}
