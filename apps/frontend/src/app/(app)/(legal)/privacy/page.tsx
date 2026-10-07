// V9 Social: public Privacy Policy (no login required, see proxy.ts).
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  LegalPage,
  V9_LEGAL,
} from '@gitroom/frontend/components/v9/legal.page';

export const metadata: Metadata = {
  title: 'Privacy Policy | V9 Social',
  description:
    'How V9 Social collects, uses, stores and deletes personal data, including data from TikTok.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This Privacy Policy explains how <strong>{V9_LEGAL.operator}</strong>{' '}
        (&quot;we&quot;, &quot;us&quot;) collects, uses, shares, stores and
        deletes personal data when you use {V9_LEGAL.service} at{' '}
        <a href={V9_LEGAL.url}>{V9_LEGAL.url}</a> (the &quot;Service&quot;). We
        are the data controller. We process personal data in line with the EU
        General Data Protection Regulation (GDPR).
      </p>

      <h2>1. Data we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> your name, email address, a hashed
          password, your workspace and team settings, and your language and
          timezone preferences.
        </li>
        <li>
          <strong>Connected account data:</strong> when you connect a social
          media account, we receive the access and refresh tokens issued by that
          platform, plus your account ID, display name, username and profile
          picture.
        </li>
        <li>
          <strong>Content:</strong> the text, images and videos you upload,
          schedule or publish, and the settings you choose for each post.
        </li>
        <li>
          <strong>Publishing data:</strong> post IDs, publish status, links to
          published posts and error messages returned by the platform.
        </li>
        <li>
          <strong>Technical data:</strong> IP address, browser type, log entries
          and essential cookies (sign-in session and language). We do not use
          advertising or third-party tracking cookies.
        </li>
      </ul>

      <h2>2. Data from TikTok</h2>
      <p>
        When you connect a TikTok account, we request only these permissions:
      </p>
      <ul>
        <li>
          <strong>user.info.basic</strong>: your TikTok open ID, display name
          and avatar, used to identify the connected account in the Service.
        </li>
        <li>
          <strong>user.info.profile</strong>: your TikTok username, used to show
          which account you are posting to and to link to your published posts.
        </li>
        <li>
          <strong>user.info.stats</strong>: your follower, following, likes and
          video counts, shown on the Analytics page of the Service.
        </li>
        <li>
          <strong>video.list</strong>: your recent TikTok videos and their view,
          like, comment and share counts, shown on the Analytics page and as the
          statistics of posts you published through the Service, and used to
          link a published post to its TikTok video.
        </li>
        <li>
          <strong>video.publish</strong>: lets the Service publish the videos
          and photos you choose to your TikTok account, with the privacy,
          interaction and disclosure settings you select.
        </li>
      </ul>
      <p>
        Before each post, the Service asks TikTok for your current posting
        options (for example which audiences are allowed and whether comments,
        Duet or Stitch are enabled) and shows them to you. We store the access
        and refresh tokens TikTok issues, your open ID, display name, username
        and avatar, and the publish ID, status and TikTok post ID of posts you
        publish. Account and video statistics are loaded from TikTok when you
        open Analytics and kept in a temporary cache for up to one hour. We use
        TikTok data only to provide the Service to you. We do not sell it, use
        it for advertising, or share it with anyone except TikTok itself.
      </p>

      <h2>3. How we use data</h2>
      <ul>
        <li>to create and run your account (contract);</li>
        <li>
          to publish and schedule content to the platforms you connected, at
          your direction (contract);
        </li>
        <li>to show publishing status and errors (contract);</li>
        <li>
          to show statistics for your connected accounts and published posts
          (contract);
        </li>
        <li>
          to keep the Service secure and prevent abuse (legitimate interest);
        </li>
        <li>
          to send service emails such as account activation and password reset
          (contract); and
        </li>
        <li>to meet legal obligations (legal obligation).</li>
      </ul>

      <h2>4. Who we share data with</h2>
      <ul>
        <li>
          <strong>The platforms you connect</strong> (such as TikTok, Instagram,
          Facebook, Threads and X), which receive the content and settings you
          choose to publish.
        </li>
        <li>
          <strong>Infrastructure providers</strong> that host the Service,
          deliver it through a content network (Cloudflare) and send service
          emails, acting as our processors under data processing terms.
        </li>
        <li>
          <strong>Authorities</strong>, when required by law.
        </li>
      </ul>
      <p>We do not sell personal data.</p>

      <h2>5. Retention and deletion</h2>
      <ul>
        <li>
          <strong>Disconnecting an account:</strong> when you disconnect a
          social account in the Service, we stop using its access and refresh
          tokens; they are deleted together with your account. To cut off access
          right away, revoke the Service in the platform&apos;s own settings (for
          TikTok: Settings and privacy &rarr; Security &rarr; Apps and
          services), which makes the stored tokens unusable. You can also email
          us to have a disconnected account&apos;s data deleted sooner.
        </li>
        <li>
          <strong>Deleting your account:</strong> email{' '}
          <a href={`mailto:${V9_LEGAL.contact}`}>{V9_LEGAL.contact}</a> from
          your account email address. We delete your account, connected account
          data, tokens and uploaded media within 30 days. Content you already
          published stays on the platform until you delete it there.
        </li>
        <li>
          <strong>Otherwise:</strong> we keep account data while your account is
          active, and server logs for up to 90 days.
        </li>
      </ul>

      <h2>6. Security</h2>
      <p>
        Data is sent over HTTPS, passwords are stored hashed, and access to
        production systems is restricted to authorized staff. No system is
        completely secure, but we work to protect your data.
      </p>

      <h2>7. International transfers</h2>
      <p>
        Data may be processed outside the European Economic Area by our
        providers or by the platforms you connect. Where that happens, we rely
        on appropriate safeguards such as the European Commission&apos;s
        Standard Contractual Clauses.
      </p>

      <h2>8. Your rights</h2>
      <p>
        You can ask to access, correct, delete or export your data, and to
        restrict or object to its processing. To do so, email{' '}
        <a href={`mailto:${V9_LEGAL.contact}`}>{V9_LEGAL.contact}</a>. You also
        have the right to complain to a supervisory authority; in Lithuania this
        is the State Data Protection Inspectorate (
        <a href="https://vdai.lrv.lt" target="_blank" rel="noopener">
          vdai.lrv.lt
        </a>
        ).
      </p>

      <h2>9. Children</h2>
      <p>
        The Service is not intended for anyone under 18, and we do not knowingly
        collect their data.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update this policy. The date above shows when the latest version
        took effect, and we will notify account holders by email of material
        changes. See also our <Link href="/terms">Terms of Service</Link>.
      </p>

      <h2>11. Contact</h2>
      <p>
        {V9_LEGAL.operator}, data controller for {V9_LEGAL.service}:{' '}
        <a href={`mailto:${V9_LEGAL.contact}`}>{V9_LEGAL.contact}</a>.
      </p>
    </LegalPage>
  );
}
