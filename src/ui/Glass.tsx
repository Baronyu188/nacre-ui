import {useId, useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type PointerEvent, type Ref} from 'react';

type GlassVariant = 'regular' | 'clear' | 'prominent';

export interface GlassSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'header' | 'nav' | 'section';
  variant?: GlassVariant;
  interactive?: boolean;
  autoRim?: boolean;
}

export function GlassSurface({
  as: Element = 'div',
  variant = 'regular',
  interactive = false,
  autoRim = true,
  className = '',
  children,
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
    >
      {autoRim && <GlassAutoRim />}
      {children}
    </Element>
  );
}

export function GlassGroup({className = '', ...props}: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`nacre-glass-group ${className}`.trim()} />;
}

export interface GlassPathMaterial {
  angle: number;
  edgeOpacity: number;
  edgeAlgorithm: 'current' | 'github';
  outlineGradient: 'solid' | 'directional';
  outlineWidth: number;
  outlineDepth: number;
  brightWidth: number;
  brightStrength: number;
  darkWidth: number;
  darkStrength: number;
  glowDistance: number;
  glowStrength: number;
  glowSoftness: number;
  centerGlowRange: number;
  centerGlowSize: number;
  centerGlowSoftness: number;
  centerGlowStrength: number;
}

export interface GlassPathRimProps extends Partial<GlassPathMaterial> {
  path: string;
  viewBox?: string;
  fill?: string;
  className?: string;
  svgRef?: Ref<SVGSVGElement>;
}

const pathDefaults: GlassPathMaterial = {angle: 135, edgeOpacity: 70, edgeAlgorithm: 'github', outlineGradient: 'solid', outlineWidth: .5, outlineDepth: 15, brightWidth: 1.5, brightStrength: 45, darkWidth: 1.3, darkStrength: 30, glowDistance: 2, glowStrength: 80, glowSoftness: 3.5, centerGlowRange: 63, centerGlowSize: 90, centerGlowSoftness: 100, centerGlowStrength: 10};
const darkPathDefaults: GlassPathMaterial = {angle: 135, edgeOpacity: 70, edgeAlgorithm: 'github', outlineGradient: 'solid', outlineWidth: .75, outlineDepth: 50, brightWidth: 1.7, brightStrength: 35, darkWidth: 1.2, darkStrength: 30, glowDistance: 2, glowStrength: 43, glowSoftness: 2.5, centerGlowRange: 100, centerGlowSize: 95, centerGlowSoftness: 100, centerGlowStrength: 10};

export function glassPathMask(path: string, viewBox = '0 0 100 56') {
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${escape(viewBox)}" preserveAspectRatio="none"><path d="${escape(path)}" fill="black"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function GlassPathRim({path, viewBox = '0 0 100 56', fill = 'var(--nacre-glass-fill)', className = '', svgRef, ...values}: GlassPathRimProps) {
  const settings = {...pathDefaults, ...values};
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const radians = settings.angle * Math.PI / 180;
  const dx = Math.sin(radians) * 50;
  const dy = -Math.cos(radians) * 50;
  const vector = {x1: `${50 - dx}%`, y1: `${50 - dy}%`, x2: `${50 + dx}%`, y2: `${50 + dy}%`};
  const edgeOpacity = Math.min(100, Math.max(0, settings.edgeOpacity)) / 100;
  const bright = settings.brightStrength / 100 * edgeOpacity;
  const dark = settings.darkStrength / 100 * edgeOpacity;
  const glow = settings.glowStrength / 100 * edgeOpacity;
  const shoulder = .3;
  const transition = .52;
  const outlineBase = Math.max(settings.outlineDepth / 100, .02);
  const outline = outlineBase * edgeOpacity;
  const centerGlow = Math.min(100, Math.max(0, settings.centerGlowStrength)) / 100;
  const centerGlowRange = Math.min(100, Math.max(0, settings.centerGlowRange));
  const [viewX = 0, viewY = 0, viewWidth = 100, viewHeight = 56] = viewBox.split(/\s+/).map(Number);
  const centerCoreScale = Math.min(100, Math.max(0, settings.centerGlowSize)) / 100;
  const centerInsetX = viewWidth * (1 - centerCoreScale) / 2;
  const centerInsetY = viewHeight * (1 - centerCoreScale) / 2;
  const centerFadeX = viewWidth * centerGlowRange / 200;
  const centerFadeY = viewHeight * centerGlowRange / 200;
  const centerFalloff = 3 - 2.3 * Math.min(100, Math.max(0, settings.centerGlowSoftness)) / 100;
  const centerShift = Math.min(viewWidth, viewHeight) * .04;
  const centerShiftX = -Math.sin(radians) * centerShift;
  const centerShiftY = Math.cos(radians) * centerShift;
  const edgeCenterY = viewY + viewHeight / 2;
  const edgeCapTransform = (x: number) => `translate(${x} ${edgeCenterY}) scale(${viewWidth * .18} ${viewHeight * .76})`;
  const outlineStops = settings.outlineGradient === 'directional'
    ? [{offset: 0, color: '#9297a0', opacity: Math.max(outlineBase * .3, .02) * edgeOpacity}, {offset: shoulder, color: '#555a63', opacity: Math.max(outlineBase * .62, .02) * edgeOpacity}, {offset: transition, color: '#000', opacity: outline}, {offset: 1, color: '#6f747d', opacity: Math.max(outlineBase * .42, .02) * edgeOpacity}]
    : [{offset: 0, color: '#000', opacity: outline}, {offset: 1, color: '#000', opacity: outline}];
  const common = {d: path, vectorEffect: 'non-scaling-stroke' as const, strokeLinejoin: 'round' as const};

  return (
    <svg ref={svgRef} className={`nacre-glass-path-rim ${className}`.trim()} style={{position: 'absolute', width: '100%', height: '100%', inset: 0}} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`} clipPathUnits="userSpaceOnUse"><path d={path} /></clipPath>
        <linearGradient id={`${id}-glow`} {...vector}><stop offset="0" stopColor="#fff" stopOpacity={glow} /><stop offset={shoulder} stopColor="#fff" stopOpacity={glow * .54} /><stop offset={transition} stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity={glow * .7} /></linearGradient>
        <linearGradient id={`${id}-bright`} {...vector}><stop offset="0" stopColor="#fff" stopOpacity={bright} /><stop offset={shoulder} stopColor="#fff" stopOpacity={bright * .53} /><stop offset={transition} stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#fff" stopOpacity={bright * .7} /></linearGradient>
        <linearGradient id={`${id}-dark`} {...vector}>{settings.edgeAlgorithm === 'github' ? <><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset={shoulder} stopColor="#000" stopOpacity="0" /><stop offset={transition} stopColor="#000" stopOpacity={dark} /><stop offset="1" stopColor="#000" stopOpacity="0" /></> : <><stop offset="0" stopColor="#000" stopOpacity={dark * .12} /><stop offset={shoulder} stopColor="#000" stopOpacity={dark * .25} /><stop offset={transition} stopColor="#000" stopOpacity={dark} /><stop offset="1" stopColor="#000" stopOpacity={dark * .44} /></>}</linearGradient>
        <radialGradient id={`${id}-github-left`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform={edgeCapTransform(viewX)}><stop offset="0" stopColor="#000" stopOpacity={dark} /><stop offset=".76" stopColor="#000" stopOpacity="0" /></radialGradient>
        <radialGradient id={`${id}-github-right`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform={edgeCapTransform(viewX + viewWidth)}><stop offset="0" stopColor="#000" stopOpacity={dark * .87} /><stop offset=".76" stopColor="#000" stopOpacity="0" /></radialGradient>
        <linearGradient id={`${id}-outline`} {...vector}>{outlineStops.map((stop) => <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} stopOpacity={stop.opacity} />)}</linearGradient>
        <filter id={`${id}-center-glow`} x={viewX} y={viewY} width={viewWidth} height={viewHeight} filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feMorphology in="SourceAlpha" operator="erode" radius={`${centerInsetX} ${centerInsetY}`} result="center-shape" />
          <feOffset in="center-shape" dx={centerShiftX} dy={centerShiftY} result="center-offset" />
          <feGaussianBlur in="center-offset" stdDeviation={`${centerFadeX / 3} ${centerFadeY / 3}`} result="center-soft" />
          <feComponentTransfer in="center-soft" result="center-mask"><feFuncA type="gamma" amplitude="1" exponent={centerFalloff} offset="0" /></feComponentTransfer>
          <feFlood floodColor="#fff" floodOpacity={centerGlow} result="center-color" />
          <feComposite in="center-color" in2="center-mask" operator="in" result="center-lit" />
          <feComposite in="center-lit" in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
      <path d={path} fill={fill} />
      <g clipPath={`url(#${id}-clip)`}>
        {centerCoreScale > 0 && settings.centerGlowStrength > 0 && <path d={path} fill="#fff" filter={`url(#${id}-center-glow)`} />}
        {settings.glowDistance > 0 && settings.glowStrength > 0 && <path {...common} fill="none" stroke={`url(#${id}-glow)`} strokeWidth={settings.glowDistance * 2} style={{filter: `blur(${settings.glowSoftness}px)`}} />}
        <path {...common} fill="none" stroke={`url(#${id}-bright)`} strokeWidth={settings.brightWidth * 2} />
        <path {...common} fill="none" stroke={`url(#${id}-dark)`} strokeWidth={settings.darkWidth * 2} />
        {settings.edgeAlgorithm === 'github' && <><path {...common} fill="none" stroke={`url(#${id}-github-left)`} strokeWidth={settings.darkWidth * 2} /><path {...common} fill="none" stroke={`url(#${id}-github-right)`} strokeWidth={settings.darkWidth * 2} /></>}
        <path {...common} fill="none" stroke={`url(#${id}-outline)`} strokeWidth={settings.outlineWidth * 2} />
      </g>
    </svg>
  );
}

interface CornerRadius {x: number; y: number}

function parseRadius(value: string, width: number, height: number): CornerRadius {
  const [x = '0', y = x] = value.split(' ');
  const resolve = (part: string, size: number) => part.endsWith('%') ? Number.parseFloat(part) * size / 100 : Number.parseFloat(part);
  return {x: resolve(x, width) || 0, y: resolve(y, height) || 0};
}

function roundedRectPath(width: number, height: number, radii: [CornerRadius, CornerRadius, CornerRadius, CornerRadius]) {
  const [tl, tr, br, bl] = radii;
  const scale = Math.min(1,
    width / Math.max(1, tl.x + tr.x), width / Math.max(1, bl.x + br.x),
    height / Math.max(1, tl.y + bl.y), height / Math.max(1, tr.y + br.y));
  const r = radii.map(({x, y}) => ({x: x * scale, y: y * scale})) as typeof radii;
  return `M${r[0].x} 0H${width - r[1].x}A${r[1].x} ${r[1].y} 0 0 1 ${width} ${r[1].y}V${height - r[2].y}A${r[2].x} ${r[2].y} 0 0 1 ${width - r[2].x} ${height}H${r[3].x}A${r[3].x} ${r[3].y} 0 0 1 0 ${height - r[3].y}V${r[0].y}A${r[0].x} ${r[0].y} 0 0 1 ${r[0].x} 0Z`;
}

export function GlassAutoRim({className = '', fill = 'transparent'}: {className?: string; fill?: string}) {
  const ref = useRef<SVGSVGElement>(null);
  const fallbackRadius = {x: 23, y: 23};
  const [geometry, setGeometry] = useState({path: roundedRectPath(100, 46, [fallbackRadius, fallbackRadius, fallbackRadius, fallbackRadius]), viewBox: '0 0 100 46'});

  useLayoutEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const update = () => {
      const {offsetWidth: width, offsetHeight: height} = host;
      if (!width || !height) return;
      const styles = getComputedStyle(host);
      const fixedRadius = styles.getPropertyValue('--nacre-rim-radius').trim();
      const radiusValues = fixedRadius ? [fixedRadius, fixedRadius, fixedRadius, fixedRadius] : [styles.borderTopLeftRadius, styles.borderTopRightRadius, styles.borderBottomRightRadius, styles.borderBottomLeftRadius];
      const radii = radiusValues.map((value) => parseRadius(value, width, height)) as [CornerRadius, CornerRadius, CornerRadius, CornerRadius];
      const next = {path: roundedRectPath(width, height, radii), viewBox: `0 0 ${width} ${height}`};
      setGeometry((current) => current.path === next.path && current.viewBox === next.viewBox ? current : next);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return <>
    <GlassPathRim {...pathDefaults} {...geometry} fill={fill} className={`nacre-glass-auto-rim nacre-glass-auto-rim--light ${className}`.trim()} svgRef={ref} />
    <GlassPathRim {...darkPathDefaults} {...geometry} fill={fill} className={`nacre-glass-auto-rim nacre-glass-auto-rim--dark ${className}`.trim()} />
  </>;
}

export interface GlassPathSurfaceProps extends GlassSurfaceProps, GlassPathRimProps {}

export function GlassPathSurface({path, viewBox, fill, angle, edgeOpacity, edgeAlgorithm, outlineGradient, outlineWidth, outlineDepth, brightWidth, brightStrength, darkWidth, darkStrength, glowDistance, glowStrength, glowSoftness, centerGlowRange, centerGlowSize, centerGlowSoftness, centerGlowStrength, className = '', style, children, ...props}: GlassPathSurfaceProps) {
  const mask = glassPathMask(path, viewBox);
  const maskStyle = {maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat'} as CSSProperties;
  return (
    <GlassSurface {...props} autoRim={false} className={`nacre-glass-path-surface ${className}`.trim()} style={{...style, ...maskStyle}}>
      <GlassPathRim {...{path, viewBox, fill, angle, edgeOpacity, edgeAlgorithm, outlineGradient, outlineWidth, outlineDepth, brightWidth, brightStrength, darkWidth, darkStrength, glowDistance, glowStrength, glowSoftness, centerGlowRange, centerGlowSize, centerGlowSoftness, centerGlowStrength}} />
      <span className="nacre-glass-path-surface__content">{children}</span>
    </GlassSurface>
  );
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
