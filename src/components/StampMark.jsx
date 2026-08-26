import React, { useState, useEffect } from 'react';

/**
 * Resolves a reward's stamp artwork, falling back to its line icon when the PNG
 * isn't there. One probe per reward — the browser caches it, and the <img> only
 * renders once we know it loads, so a missing file never flashes as broken.
 */
export function useStampArt(art) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    if (!art.src) return;

    let alive = true;
    const probe = new Image();
    probe.onload  = () => { if (alive) setLoaded(true); };
    probe.onerror = () => { if (alive) setLoaded(false); };
    probe.src = art.src;

    return () => { alive = false; };
  }, [art.src]);

  return loaded;
}

/**
 * One stamp slot's mark. Artwork keeps its own colours, so it sits on a white
 * plate when filled; a line icon inherits the card's colours instead.
 */
export default function StampMark({ art, useImage, filled = false }) {
  if (useImage) {
    return (
      <img
        src={art.src}
        alt=""
        aria-hidden="true"
        className={`sp-stamp-img${filled ? '' : ' ghost'}`}
      />
    );
  }

  const { Icon } = art;
  return filled
    ? <Icon size={18} strokeWidth={2.5} />
    : <Icon size={17} strokeWidth={1.75} className="sp-stamp-ghost" />;
}
