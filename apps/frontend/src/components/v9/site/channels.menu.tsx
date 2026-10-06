'use client';
// V9 Social: "Channels" dropdown in the public site header.
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export type ChannelLink = { slug: string; name: string; icon: string };

export const ChannelsMenu = ({ channels }: { channels: ChannelLink[] }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="v9-channels-menu"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-[6px] px-[10px] py-[8px] rounded-[8px] hover:bg-white/10"
      >
        Channels
        <svg
          aria-hidden="true"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          className={open ? 'rotate-180' : ''}
        >
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            fill="none"
            strokeWidth="1.5"
          />
        </svg>
      </button>
      {open && (
        <ul
          id="v9-channels-menu"
          className="absolute start-0 top-full mt-[6px] z-10 min-w-[200px] rounded-[10px] border border-white/10 bg-[#1A1919] p-[6px] shadow-xl"
        >
          {channels.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/channels/${c.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-[10px] rounded-[8px] px-[10px] py-[8px] hover:bg-white/10"
              >
                <img
                  src={c.icon}
                  alt=""
                  width={24}
                  height={24}
                  className="rounded-[6px]"
                />
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
