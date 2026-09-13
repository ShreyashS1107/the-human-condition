import React, { forwardRef } from 'react';

export const ChoiceButton = forwardRef(function ChoiceButton(
  {
    children,
    onClick,
    onFocus,
    type = 'yes',
    scale = 1,
    opacity = 1,
    blur = 0,
    translateY = 0,
    disabled = false,
    ariaLabel,
    className = '',
  },
  ref
) {
  const isYes = type === 'yes';

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      onFocus={onFocus}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      className={`opening-choice-btn ${isYes ? 'choice-yes' : 'choice-idk'} ${className}`}
      style={{
        transform: `translateY(${translateY}px) scale(${scale})`,
        opacity: opacity,
        filter: blur > 0 ? `blur(${blur}px)` : 'none',
        pointerEvents: disabled || opacity <= 0.05 ? 'none' : 'auto',
      }}
    >
      {children}
    </button>
  );
});
