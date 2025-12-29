'use client';

import { useState, useCallback } from 'react';
import { getGoogleFaviconUrl, getFallbackFaviconUrl } from '@/lib/favicon';

interface FaviconImageProps {
  url: string;
  className?: string;
  size?: number;
}

export default function FaviconImage({ url, className, size = 64 }: FaviconImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    if (!useFallback) {
      setUseFallback(true);
    } else {
      setFailed(true);
    }
  }, [useFallback]);

  if (failed) {
    return null;
  }

  const src = useFallback ? getFallbackFaviconUrl(url) : getGoogleFaviconUrl(url, size);

  if (!src) {
    return null;
  }

  return (
    <img
      src={src}
      alt=""
      className={className}
      onError={handleError}
    />
  );
}
