import {useCallback, useId, useRef, type CSSProperties, type HTMLAttributes, type PointerEvent, type ReactNode} from 'react';
import {Button as AriaButton, type ButtonProps as AriaButtonProps} from 'react-aria-components';

export function LiquidGlassFilter({id}: {id: string}) {
  return (
    <svg className="nacre-liquid-filter" aria-hidden="true" width="0" height="0">
      <defs>
        <filter id={id} x="-18%" y="-30%" width="136%" height="160%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.034" numOctaves="1" seed="8" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="1.2" result="softNoise" />
          <feDisplacementMap in="SourceGraphic" in2="softNoise" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  );
}

function filterId(useIdValue: string) {
  return `nacre-refraction-${useIdValue.replace(/[^a-zA-Z0-9_-]/g, '')}`;
}

export function useLiquidGlassFilter() {
  const id = filterId(useId());
  return {id, style: {'--nacre-liquid-filter': `url(#${id})`} as CSSProperties};
}

export function useLiquidPopoverMorph({maxX = 7, maxY = 5, strength = .026} = {}) {
  const pointerFrame = useRef<number | null>(null);
  const pointerSample = useRef<{node: HTMLDivElement; x: number; y: number} | null>(null);
  const ref = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    if (!width || !height) return;
    node.style.setProperty('--nacre-liquid-start-x', String(Math.min(1, 40 / width)));
    node.style.setProperty('--nacre-liquid-start-y', String(Math.min(1, 40 / height)));
  }, []);

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    pointerSample.current = {node: event.currentTarget, x: event.clientX, y: event.clientY};
    if (pointerFrame.current !== null) return;
    pointerFrame.current = requestAnimationFrame(() => {
      pointerFrame.current = null;
      const sample = pointerSample.current;
      if (!sample) return;
      const rect = sample.node.getBoundingClientRect();
      const x = Math.max(-maxX, Math.min(maxX, (sample.x - rect.left - rect.width / 2) * strength));
      const y = Math.max(-maxY, Math.min(maxY, (sample.y - rect.top - rect.height / 2) * strength));
      sample.node.style.setProperty('--nacre-popover-shift-x', `${x}px`);
      sample.node.style.setProperty('--nacre-popover-shift-y', `${y}px`);
    });
  }

  function onPointerLeave(event: PointerEvent<HTMLDivElement>) {
    if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = null;
    pointerSample.current = null;
    event.currentTarget.style.setProperty('--nacre-popover-shift-x', '0px');
    event.currentTarget.style.setProperty('--nacre-popover-shift-y', '0px');
  }

  return {ref, onPointerMove, onPointerLeave};
}

function pointerLight(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--nacre-liquid-x', `${event.clientX - rect.left}px`);
  event.currentTarget.style.setProperty('--nacre-liquid-y', `${event.clientY - rect.top}px`);
}

export interface LiquidGlassSurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'header' | 'nav' | 'section';
  children?: ReactNode;
  interactive?: boolean;
}

export function LiquidGlassSurface({as: Element = 'div', children, interactive = false, className = '', style, ...props}: LiquidGlassSurfaceProps) {
  const filter = useLiquidGlassFilter();
  const liquidStyle = {...style, ...filter.style} as CSSProperties;
  return (
    <Element
      {...props}
      className={`nacre-liquid-glass ${className}`.trim()}
      data-interactive={interactive || undefined}
      style={liquidStyle}
    >
      <LiquidGlassFilter id={filter.id} />
      <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
      <span className="nacre-liquid-glass__light" aria-hidden="true" />
      {children}
    </Element>
  );
}

export interface LiquidGlassButtonProps extends Omit<AriaButtonProps, 'children' | 'className' | 'style'> {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function LiquidGlassButton({children, className = '', style, onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onPointerLeave, onLostPointerCapture, ...props}: LiquidGlassButtonProps) {
  const filter = useLiquidGlassFilter();
  const origin = useRef<{x: number; y: number; pullX: number; pullY: number} | null>(null);
  const liquidStyle = {...style, ...filter.style} as CSSProperties;

  function reset(event: PointerEvent<HTMLButtonElement>) {
    origin.current = null;
    event.currentTarget.removeAttribute('data-dragging');
    event.currentTarget.style.setProperty('--nacre-drag-x', '0px');
    event.currentTarget.style.setProperty('--nacre-drag-y', '0px');
    event.currentTarget.style.setProperty('--nacre-jelly-x', '1');
    event.currentTarget.style.setProperty('--nacre-jelly-y', '1');
    event.currentTarget.style.removeProperty('--nacre-liquid-x');
    event.currentTarget.style.removeProperty('--nacre-liquid-y');
  }

  return (
    <AriaButton
      {...props}
      className={`nacre-liquid-button ${className}`.trim()}
      style={liquidStyle}
      onPointerDown={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const pullX = Math.max(-3, Math.min(3, (event.clientX - rect.left - rect.width / 2) * .07));
        const pullY = Math.max(-2, Math.min(2, (event.clientY - rect.top - rect.height / 2) * .07));
        origin.current = {x: event.clientX, y: event.clientY, pullX, pullY};
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.setAttribute('data-dragging', '');
        event.currentTarget.style.setProperty('--nacre-drag-x', `${pullX}px`);
        event.currentTarget.style.setProperty('--nacre-drag-y', `${pullY}px`);
        event.currentTarget.style.setProperty('--nacre-jelly-x', '1.026');
        event.currentTarget.style.setProperty('--nacre-jelly-y', '.988');
        pointerLight(event);
        onPointerDown?.(event);
      }}
      onPointerMove={(event) => {
        if (origin.current) {
          const dx = event.clientX - origin.current.x;
          const dy = event.clientY - origin.current.y;
          const distance = Math.min(Math.hypot(dx, dy), 60);
          event.currentTarget.style.setProperty('--nacre-drag-x', `${Math.max(-6, Math.min(6, origin.current.pullX + dx * .07))}px`);
          event.currentTarget.style.setProperty('--nacre-drag-y', `${Math.max(-4, Math.min(4, origin.current.pullY + dy * .055))}px`);
          event.currentTarget.style.setProperty('--nacre-jelly-x', `${1.026 + distance * .00022}`);
          event.currentTarget.style.setProperty('--nacre-jelly-y', `${.988 - distance * .0001}`);
        }
        onPointerMove?.(event);
      }}
      onPointerUp={(event) => {reset(event); onPointerUp?.(event);}}
      onPointerCancel={(event) => {reset(event); onPointerCancel?.(event);}}
      onPointerLeave={(event) => {reset(event); onPointerLeave?.(event);}}
      onLostPointerCapture={(event) => {reset(event); onLostPointerCapture?.(event);}}
    >
      <LiquidGlassFilter id={filter.id} />
      <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
      <span className="nacre-liquid-glass__light" aria-hidden="true" />
      <span className="nacre-liquid-button__label">{children}</span>
    </AriaButton>
  );
}
