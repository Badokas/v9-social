'use client';

import React from 'react';
import { useT } from '@gitroom/react/translation/get.transation.service.client';

// AGPL-3.0 section 13: tell users where the (modified) source code is.
export const PoweredByComponent = () => {
  const t = useT();
  const year = new Date().getFullYear();
  return (
    <div className="text-[12px] opacity-60">
      {t('v9_powered_by', `V9 Social © ${year}`)}{' '}
      {' - '}
      <a
        href="https://github.com/Badokas/v9-social"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:opacity-80"
      >
        {t('v9_source_code', '(AGPL-3.0)')}
      </a>
    </div>
  );
};
