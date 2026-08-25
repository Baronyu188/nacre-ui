import {type CSSProperties, type PointerEvent, type ReactNode} from 'react';
import {Button as AriaButton, type ButtonProps as AriaButtonProps} from 'react-aria-components';

export interface ButtonProps extends Omit<AriaButtonProps, 'className' | 'style' | 'children'> {
  children: ReactNode;
  className?: string;
  variant?: 'glass' | 'prominent' | 'quiet';
  magnetic?: boolean;
  style?: CSSProperties;
}

export function CloseIcon() {
  return <svg className="nacre-close-icon" aria-hidden="true" viewBox="0 0 16 16"><path d="m4 4 8 8m0-8-8 8" /></svg>;
}

export function Button({
  children,
  className = '',
  variant = 'glass',
  magnetic = false,
  style,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  ...props
}: ButtonProps) {
  function handleMove(event: PointerEvent<HTMLButtonElement>) {
    if (event.currentTarget.hasAttribute('data-pressed')) locatePress(event);
    if (magnetic && event.pointerType === 'mouse') {
      const rect = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty('--nacre-magnet-x', `${(event.clientX - rect.left - rect.width / 2) * 0.09}px`);
      event.currentTarget.style.setProperty('--nacre-magnet-y', `${(event.clientY - rect.top - rect.height / 2) * 0.12}px`);
      event.currentTarget.style.setProperty('--nacre-x', `${event.clientX - rect.left}px`);
      event.currentTarget.style.setProperty('--nacre-y', `${event.clientY - rect.top}px`);
    }
    onPointerMove?.(event);
  }

  function handleLeave(event: PointerEvent<HTMLButtonElement>) {
    event.currentTarget.style.setProperty('--nacre-magnet-x', '0px');
    event.currentTarget.style.setProperty('--nacre-magnet-y', '0px');
    onPointerLeave?.(event);
  }

  function locatePress(event: PointerEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const nx = Math.max(-1, Math.min(1, (x - rect.width / 2) / (rect.width / 2)));
    const ny = Math.max(-1, Math.min(1, (y - rect.height / 2) / (rect.height / 2)));
    event.currentTarget.style.setProperty('--nacre-x', `${x}px`);
    event.currentTarget.style.setProperty('--nacre-y', `${y}px`);
    event.currentTarget.style.setProperty('--nacre-press-x', `${nx * 1.8}px`);
    event.currentTarget.style.setProperty('--nacre-press-y', `${ny * 1.4}px`);
    event.currentTarget.style.setProperty('--nacre-press-scale-x', String(1.026 + Math.abs(nx) * .009 - Math.abs(ny) * .003));
    event.currentTarget.style.setProperty('--nacre-press-scale-y', String(1.026 + Math.abs(ny) * .009 - Math.abs(nx) * .003));
  }

  return (
    <AriaButton
      {...props}
      data-variant={variant}
      className={`nacre-button ${className}`.trim()}
      style={style}
      onPointerDown={(event) => {locatePress(event); onPointerDown?.(event);}}
      onPointerMove={handleMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={handleLeave}
    >
      <span className="nacre-button__label">{children}</span>
    </AriaButton>
  );
}
