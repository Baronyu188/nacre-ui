import {type HTMLAttributes, type PointerEvent} from 'react';

type GlassVariant = 'regular' | 'clear' | 'prominent';

export interface GlassSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'header' | 'nav' | 'section';
  variant?: GlassVariant;
  interactive?: boolean;
}

export function GlassSurface({
  as: Element = 'div',
  variant = 'regular',
  interactive = false,
  className = '',
  onPointerMove,
  onPointerLeave,
  ...props
}: GlassSurfaceProps) {
  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--nacre-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--nacre-y', `${event.clientY - rect.top}px`);
    onPointerMove?.(event);
  }

  function handleLeave(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.removeProperty('--nacre-x');
    event.currentTarget.style.removeProperty('--nacre-y');
    onPointerLeave?.(event);
  }

  return (
    <Element
      {...props}
      data-variant={variant}
      data-interactive={interactive || undefined}
      className={`nacre-glass ${className}`.trim()}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    />
  );
}

export function GlassGroup({className = '', ...props}: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`nacre-glass-group ${className}`.trim()} />;
}

export function PerspectiveCard({className = '', style, ...props}: HTMLAttributes<HTMLDivElement>) {
  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--nacre-rotate-x', `${((event.clientY - rect.top) / rect.height - 0.5) * -7}deg`);
    event.currentTarget.style.setProperty('--nacre-rotate-y', `${((event.clientX - rect.left) / rect.width - 0.5) * 8}deg`);
  }

  function reset(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.style.setProperty('--nacre-rotate-x', '0deg');
    event.currentTarget.style.setProperty('--nacre-rotate-y', '0deg');
  }

  return (
    <div
      {...props}
      className={`nacre-perspective-card ${className}`.trim()}
      style={style}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    />
  );
}
