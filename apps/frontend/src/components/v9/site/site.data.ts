// V9 Social: content for the public site (/, /channels/*).
// Plain English on purpose: fork-only pages, no i18n JSON edits (see UPSTREAM.md).

export const V9_SITE = {
  name: 'V9 Social',
  operator: 'VOID9',
  // Public contact for access and sales. The legal contact stays on /terms and /privacy.
  contact: 'hey@void9.com',
  source: 'https://github.com/Badokas/v9-social',
  upstream: 'https://github.com/gitroomhq/postiz-app',
};

const mailto = (subject: string) =>
  `mailto:${V9_SITE.contact}?subject=${encodeURIComponent(subject)}`;

export const requestAccessHref = mailto('V9 Social access request');
export const salesHref = mailto('V9 Social pricing');
export const questionsHref = mailto('V9 Social question');

export type Feature = { title: string; text: string };
export type Faq = { q: string; a: string };

import type { SiteMedia } from '@gitroom/frontend/components/v9/site/site.graphics';

export type Channel = {
  slug: string;
  media: SiteMedia;
  name: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  intro: string;
  requirements: string[];
  connectSteps: string[];
  postTypes: Feature[];
  controls: Feature[];
  data: string[];
  faq: Faq[];
  disclaimer: string;
};

export const CHANNELS: Channel[] = [
  {
    slug: 'tiktok',
    media: {
      kind: 'video',
      name: 'v9-tiktok-settings',
      alt: 'TikTok settings in the V9 Social composer: the connected account and maximum video length are shown, privacy is chosen from an empty selector, comments are allowed, commercial disclosure is turned on with Your brand, and the post is published with a processing notice.',
    },
    name: 'TikTok',
    icon: '/icons/platforms/tiktok.png',
    metaTitle: 'TikTok scheduling | V9 Social',
    metaDescription:
      'Schedule and publish TikTok videos and photo posts from V9 Social, with privacy, interaction and disclosure settings for every post.',
    headline: 'Schedule and publish TikTok videos and photos',
    intro:
      'Write your caption, attach a video or photos, choose who can see the post and publish it to your own TikTok account, right away or at a time you pick. V9 Social uses TikTok Login Kit and the Content Posting API.',
    requirements: ['A TikTok account you own.', 'A V9 Social account.'],
    connectSteps: [
      'In V9 Social, open Add Channel and choose TikTok.',
      'Sign in on TikTok and review the permissions: basic profile info, username, account stats, your video list and posting videos.',
      'Click Authorize. Your avatar and display name appear in your channel list.',
    ],
    postTypes: [
      {
        title: 'Videos',
        text: 'Upload a video, write the caption and publish it directly to your profile. V9 Social shows the maximum video length TikTok allows for your account.',
      },
      {
        title: 'Photo posts',
        text: 'Post one or more photos with a caption. Photos are sent to TikTok from our own domain.',
      },
      {
        title: 'Scheduling',
        text: 'Pick a date and time and the post goes out on schedule. Every post is listed in the calendar with its status.',
      },
    ],
    controls: [
      {
        title: 'Your account, shown before you post',
        text: 'The composer shows the TikTok nickname and username the post will go to. If TikTok says the account cannot post right now, publishing is stopped and you are told why.',
      },
      {
        title: 'Privacy, chosen by you',
        text: 'Visibility options come from your TikTok account settings. Nothing is preselected: you pick who can see each post before it can be published.',
      },
      {
        title: 'Comments, Duet and Stitch',
        text: 'All three are off until you turn them on. If you disabled one in TikTok, it is greyed out in V9 Social. Photo posts only offer comments.',
      },
      {
        title: 'Commercial content disclosure',
        text: 'Mark a post as promoting your own brand ("Promotional content") or a third party ("Paid partnership"). Branded content cannot be posted as private.',
      },
      {
        title: 'TikTok policies',
        text: "Every post shows TikTok's Music Usage Confirmation, and the Branded Content Policy when it applies, right before you publish.",
      },
      {
        title: 'Status after publishing',
        text: 'TikTok can take a few minutes to process a post. V9 Social checks the status and links to the post when it is live.',
      },
    ],
    data: [
      'Your TikTok open ID, display name, avatar and username.',
      'Access and refresh tokens issued by TikTok, to post on your behalf.',
      'The videos, photos and captions you choose to publish, and the post IDs TikTok returns.',
      'Follower, following, likes and video counts, and the views, likes, comments and shares of your recent videos, shown in analytics (cached for up to an hour).',
    ],
    faq: [
      {
        q: 'Does V9 Social post anything without me?',
        a: 'No. A post is only sent to TikTok when you click Post Now or when a post you scheduled reaches its time.',
      },
      {
        q: 'Can I edit the caption?',
        a: 'Yes. All text is yours and fully editable. V9 Social does not add hashtags or watermarks.',
      },
      {
        q: 'How do I disconnect TikTok?',
        a: 'Remove the channel in V9 Social, or revoke access in TikTok under Settings and privacy, Security, Manage app permissions. Tokens are deleted when you disconnect.',
      },
    ],
    disclaimer:
      'TikTok is a trademark of ByteDance Ltd. V9 Social is not affiliated with or endorsed by TikTok.',
  },
  {
    slug: 'instagram',
    media: {
      kind: 'video',
      name: 'v9-instagram-settings',
      alt: 'Instagram settings in the V9 Social composer: the connected professional account is shown, the post type is chosen from a selector, a collaborator is added, Trial Reel is turned on with a graduation strategy, and the post is published.',
    },
    name: 'Instagram',
    icon: '/icons/platforms/instagram-standalone.png',
    metaTitle: 'Instagram scheduling | V9 Social',
    metaDescription:
      'Schedule Instagram posts, carousels, Reels and Stories from V9 Social with Instagram login. No Facebook Page needed.',
    headline: 'Schedule Instagram posts, Reels and Stories',
    intro:
      'Plan your Instagram feed in the same calendar as your other channels. V9 Social connects with Instagram login and publishes through the official Instagram API.',
    requirements: [
      'An Instagram Professional account (Business or Creator). You can switch for free in the Instagram app.',
      'A V9 Social account. No Facebook Page is needed.',
    ],
    connectSteps: [
      'In V9 Social, open Add Channel and choose Instagram.',
      'Sign in with Instagram and review the permissions: profile info, publishing content, comments and insights.',
      'Click Allow. Your profile picture and username appear in your channel list.',
    ],
    postTypes: [
      {
        title: 'Feed posts and carousels',
        text: 'Post a single photo or video, or several images and videos as one carousel.',
      },
      {
        title: 'Reels',
        text: 'Videos are published as Reels. You can share a Reel as a trial, shown to non-followers first.',
      },
      {
        title: 'Stories',
        text: 'Switch the post type to Story to publish a photo or video to your Story.',
      },
    ],
    controls: [
      {
        title: 'Collaborators',
        text: 'Invite other accounts as collaborators so the post can appear on their profiles too.',
      },
      {
        title: 'First comment',
        text: 'Add follow-up comments that V9 Social posts right after the main post, for example to keep hashtags out of the caption.',
      },
      {
        title: 'Preview and schedule',
        text: 'See how the post will look, then publish now or pick a time. The calendar shows every scheduled and published post.',
      },
      {
        title: 'Insights',
        text: 'See reach and engagement for your account and posts in the analytics view.',
      },
    ],
    data: [
      'Your Instagram account ID, username, name and profile picture.',
      'Access tokens issued by Instagram, to post on your behalf.',
      'The media and captions you choose to publish, post IDs, and the insights shown in analytics.',
    ],
    faq: [
      {
        q: 'Why do I need a Professional account?',
        a: 'Instagram only allows publishing through its API for Business and Creator accounts. Switching is free and can be undone.',
      },
      {
        q: 'Can I add music to a Reel?',
        a: 'Not through Instagram login. Add the sound in your video before uploading.',
      },
      {
        q: 'How do I disconnect Instagram?',
        a: 'Remove the channel in V9 Social, or remove V9 Social in Instagram under Settings, Website permissions, Apps and websites. Tokens are deleted when you disconnect.',
      },
    ],
    disclaimer:
      'Instagram is a trademark of Meta Platforms, Inc. V9 Social is not affiliated with or endorsed by Meta.',
  },
];

export const findChannel = (slug: string) =>
  CHANNELS.find((c) => c.slug === slug);
