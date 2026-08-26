import React from 'react';

/**
 * One stamp slot's mark. Custom artwork keeps its own colours, so it sits on a
 * white plate when filled; a line icon inherits the card's colours instead.
 */
export default function StampMark({ art, filled = false }) {
  if (art.type === 'image') {
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
