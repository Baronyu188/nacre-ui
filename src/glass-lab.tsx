import {StrictMode, useState, type CSSProperties, type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import {Button, GlassGroup, GlassPathRim, GlassPathSurface, Switch, glassPathMask, type GlassPathMaterial} from './ui';
import './ui/theme.css';
import './demo/glass-lab.css';

function SidebarIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M9 4v16M5.5 8h1M5.5 12h1M5.5 16h1" /></svg>;
}

function ChevronIcon({direction = 'down'}: {direction?: 'down' | 'left' | 'right'}) {
  const path = direction === 'left' ? 'm15 4-8 8 8 8' : direction === 'right' ? 'm9 4 8 8-8 8' : 'm5 9 7 7 7-7';
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d={path} /></svg>;
}

interface GlassSettings extends GlassPathMaterial {
  fill: number;
  grayDepth: number;
  blur: number;
  transparency: number;
}

const lightDefaults: GlassSettings = {angle: 135, edgeOpacity: 70, edgeAlgorithm: 'github', outlineGradient: 'solid', fill: 10, grayDepth: 50, blur: 20, transparency: 50, outlineWidth: .5, outlineDepth: 15, brightWidth: 1.5, brightStrength: 45, darkWidth: 1.3, darkStrength: 30, glowDistance: 2, glowStrength: 80, glowSoftness: 3.5, centerGlowRange: 63, centerGlowSize: 90, centerGlowSoftness: 100, centerGlowStrength: 10};
const darkDefaults: GlassSettings = {angle: 135, edgeOpacity: 70, edgeAlgorithm: 'github', outlineGradient: 'solid', fill: 20, grayDepth: 50, blur: 18, transparency: 60, outlineWidth: .75, outlineDepth: 50, brightWidth: 1.7, brightStrength: 35, darkWidth: 1.2, darkStrength: 30, glowDistance: 2, glowStrength: 43, glowSoftness: 2.5, centerGlowRange: 100, centerGlowSize: 95, centerGlowSoftness: 100, centerGlowStrength: 10};
const capsule = {path: 'M28 0H72C87.464 0 100 12.536 100 28S87.464 56 72 56H28C12.536 56 0 43.464 0 28S12.536 0 28 0Z', viewBox: '0 0 100 56'};
const circle = {path: 'M28 0A28 28 0 1 1 28 56A28 28 0 1 1 28 0Z', viewBox: '0 0 56 56'};
const squircle = {path: 'M20 0H80C94 0 100 6 100 20V36C100 50 94 56 80 56H20C6 56 0 50 0 36V20C0 6 6 0 20 0Z', viewBox: '0 0 100 56'};
const pebble = {path: 'M8 11C18 0 34 2 50 2S82 0 92 11C101 21 97 43 88 51C78 60 62 54 50 54S22 60 12 51C3 43-1 21 8 11Z', viewBox: '0 0 100 56'};

function ExperimentalButton({settings, shape = capsule, className = '', label, style, variant = 'glass', children}: {settings: GlassSettings; shape?: typeof capsule; className?: string; label?: string; style?: CSSProperties; variant?: 'glass' | 'prominent'; children: ReactNode}) {
  const {fill: _fill, grayDepth: _grayDepth, blur: _blur, transparency: _transparency, ...material} = settings;
  const mask = glassPathMask(shape.path, shape.viewBox);
  const maskStyle = {maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat'} as CSSProperties;
  return <Button className={`glass-lab-button ${className}`.trim()} style={{...maskStyle, ...style}} variant={variant} magnetic={false} autoRim={false} aria-label={label}><GlassPathRim {...material} className="glass-lab-rim" path={shape.path} viewBox={shape.viewBox} fill="transparent" />{children}</Button>;
}

function Sample({settings}: {settings?: GlassSettings}) {
  if (!settings) {
    return (
      <div className="glass-lab-sample-row">
        <Button magnetic={false}><SidebarIcon /><ChevronIcon /></Button>
        <GlassGroup>
          <Button magnetic={false} aria-label="后退"><ChevronIcon direction="left" /></Button>
          <span className="glass-lab-divider" />
          <Button magnetic={false} aria-label="前进"><ChevronIcon direction="right" /></Button>
        </GlassGroup>
      </div>
    );
  }
  return (
    <div className="glass-lab-sample-row">
      <ExperimentalButton settings={settings}><SidebarIcon /><ChevronIcon /></ExperimentalButton>
      <ExperimentalButton settings={settings}>
        <ChevronIcon direction="left" />
        <span className="glass-lab-divider" />
        <ChevronIcon direction="right" />
      </ExperimentalButton>
    </div>
  );
}

function PathSamples({settings}: {settings: GlassSettings}) {
  const {fill: _fill, grayDepth: _grayDepth, blur: _blur, transparency: _transparency, ...material} = settings;
  return (
    <div className="glass-lab-path-samples">
      <small>真实 SVG Path</small>
      <div>
        <ExperimentalButton settings={settings} shape={circle} className="is-circle" label="圆形路径"><ChevronIcon direction="right" /></ExperimentalButton>
        <ExperimentalButton settings={settings} shape={squircle} className="is-squircle" label="Squircle 路径"><SidebarIcon /></ExperimentalButton>
        <ExperimentalButton settings={settings} shape={pebble} className="is-pebble" label="鹅卵石路径"><ChevronIcon /></ExperimentalButton>
        <GlassPathSurface {...material} className="glass-lab-path-surface-demo" path={pebble.path} viewBox={pebble.viewBox} fill="rgba(var(--lab-gray-rgb),var(--lab-fill))">异形空间</GlassPathSurface>
      </div>
    </div>
  );
}

function ThemeSamples({settings}: {settings: GlassSettings}) {
  const themes = [
    ['Nacre 蓝', '#0a84ff'],
    ['晴空蓝', '#2679d9'],
    ['珊瑚红', '#e65f5c'],
    ['琥珀金', '#c98216'],
  ] as const;
  return (
    <div className="glass-lab-theme-samples">
      <small>主题色按钮 · 同一 SVG 边缘</small>
      <div>{themes.map(([label, color]) => <ExperimentalButton key={color} settings={settings} variant="prominent" className="glass-lab-theme-button" style={{backgroundColor: color}}>{label}</ExperimentalButton>)}</div>
    </div>
  );
}

function Control({label, hint, value, min, max, step, suffix = '', formatValue, onChange}: {label: string; hint?: string; value: number; min: number; max: number; step: number; suffix?: string; formatValue?: (value: number) => ReactNode; onChange: (value: number) => void}) {
  return (
    <label className="glass-lab-control">
      <span>{label}<output>{formatValue ? formatValue(value) : <>{value}{suffix}</>}</output></span>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.currentTarget.value))} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

function GlassLab() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [lightSettings, setLightSettings] = useState(lightDefaults);
  const [darkSettings, setDarkSettings] = useState(darkDefaults);
  const settings = mode === 'light' ? lightSettings : darkSettings;
  const setSettings = mode === 'light' ? setLightSettings : setDarkSettings;
  const softenedSettings = {...settings, brightStrength: settings.brightStrength * .85, darkStrength: settings.darkStrength * .85};
  const glassChannel = Math.round(255 * (1 - settings.grayDepth / 100));
  const style = {
    '--lab-fill': settings.fill / 100 * (1 - settings.transparency / 100),
    '--lab-blur': `${settings.blur}px`,
    '--lab-gray-rgb': `${glassChannel},${glassChannel},${glassChannel}`,
  } as CSSProperties;
  type ControlConfig = {setting: Exclude<keyof GlassSettings, 'edgeAlgorithm' | 'outlineGradient'>; label: string; hint?: string; min: number; max: number; step: number; suffix: string; formatValue?: (value: number) => ReactNode};
  const controls: ControlConfig[] = [
    {setting: 'angle', label: '边缘光方向', min: 0, max: 360, step: 1, suffix: '°'},
    {setting: 'edgeOpacity', label: '边缘光不透明度', min: 0, max: 100, step: 1, suffix: '%'},
    {setting: 'outlineWidth', label: '最外框厚度', min: .25, max: 2, step: .25, suffix: 'px'},
    {setting: 'outlineDepth', label: '最外框深度', min: 0, max: 100, step: 1, suffix: '%'},
    {setting: 'brightWidth', label: '亮边厚度', min: .5, max: 4, step: .1, suffix: 'px'},
    {setting: 'brightStrength', label: '亮边强度', min: 0, max: 100, step: 1, suffix: '%'},
    {setting: 'darkWidth', label: '暗边厚度', min: .5, max: 4, step: .1, suffix: 'px'},
    {setting: 'darkStrength', label: '暗边深度', min: 0, max: 100, step: 1, suffix: '%'},
    {setting: 'glowDistance', label: '内泛光距离', min: 0, max: 20, step: 1, suffix: 'px'},
    {setting: 'glowStrength', label: '内泛光强度', min: 0, max: 100, step: 1, suffix: '%'},
    {setting: 'glowSoftness', label: '泛光柔化', min: 0, max: 8, step: .5, suffix: 'px'},
    {setting: 'fill', label: '玻璃底色', min: 5, max: 60, step: 1, suffix: '%'},
    {setting: 'grayDepth', label: '玻璃灰度', min: 0, max: 100, step: 1, suffix: '%'},
    {setting: 'blur', label: '背景模糊度', min: 0, max: 40, step: 1, suffix: 'px'},
    {setting: 'transparency', label: '玻璃透明度', min: 0, max: 100, step: 1, suffix: '%'},
  ];
  const centerControls: ControlConfig[] = [
    {setting: 'centerGlowStrength', label: '中心亮度', hint: '0% 关闭中心光', min: 0, max: 100, step: 1, suffix: '%', formatValue: (value) => value === 0 ? '关闭' : `${value}%`},
    {setting: 'centerGlowSize', label: '光核大小', hint: '控制柔化前的光源范围', min: 4, max: 100, step: 1, suffix: '%', formatValue: (value) => `${value}% 光核`},
    {setting: 'centerGlowRange', label: '向外扩散', hint: '独立于光核大小，限制在形状内部', min: 0, max: 100, step: 1, suffix: '%', formatValue: (value) => `${value}% 外扩`},
    {setting: 'centerGlowSoftness', label: '边缘柔和', hint: '改变羽化衰减，不改变扩散宽度', min: 0, max: 100, step: 1, suffix: '%', formatValue: (value) => `${value}% · ${value < 34 ? '清晰' : value < 68 ? '柔和' : '朦胧'}`},
  ];

  return (
    <main className="glass-lab" data-theme={mode} data-lab-mode={mode} style={style}>
      <header className="glass-lab-header">
        <div><small>Nacre UI Experimental</small><h1>玻璃边缘高光实验</h1><p>主入射亮边、弱对侧反射与独立阴影衰减的非对称玻璃材质。</p></div>
        <div className="glass-lab-header__actions"><Switch isSelected={mode === 'dark'} onChange={(selected) => setMode(selected ? 'dark' : 'light')}>深色模式</Switch><a href="/">返回组件展廊</a></div>
      </header>

      <section className="glass-lab-controls" aria-label="材质参数">
        {controls.map(({setting, ...control}) => <Control key={setting} {...control} value={settings[setting]} onChange={(value) => setSettings((current) => ({...current, [setting]: value}))} />)}
        <fieldset className="glass-lab-center-controls">
          <legend>中心高光与泛光</legend>
          <p>先定亮度和光核大小，再调整向外扩散与过渡柔和。</p>
          <div>{centerControls.map(({setting, ...control}) => <Control key={setting} {...control} value={settings[setting]} onChange={(value) => setSettings((current) => ({...current, [setting]: value}))} />)}</div>
        </fieldset>
        <div className="glass-lab-outline-options" role="group" aria-label="边缘明暗算法">
          <span>边缘明暗算法<small>只改变亮暗分区，保留当前主体与真实 Path</small></span>
          <div>{([['current', '当前 SVG 分区'], ['github', 'GitHub 旧版四段']] as const).map(([value, label]) => <button key={value} type="button" data-selected={settings.edgeAlgorithm === value || undefined} aria-pressed={settings.edgeAlgorithm === value} onClick={() => {setLightSettings((current) => ({...current, edgeAlgorithm: value})); setDarkSettings((current) => ({...current, edgeAlgorithm: value}));}}>{label}</button>)}</div>
        </div>
        <div className="glass-lab-outline-options" role="group" aria-label="最外框渐变">
          <span>最外框渐变<small>所有节点始终保留淡色</small></span>
          <div>{([['solid', '均匀黑框'], ['directional', '方向灰黑']] as const).map(([value, label]) => <button key={value} type="button" data-selected={settings.outlineGradient === value || undefined} aria-pressed={settings.outlineGradient === value} onClick={() => setSettings((current) => ({...current, outlineGradient: value}))}>{label}</button>)}</div>
        </div>
      </section>

      <section className={`glass-lab-stage is-${mode}`}>
        <header><h2>{mode === 'dark' ? '深色模式' : '浅色模式'}</h2><span>两套参数独立保存</span></header>
        <div className="glass-lab-comparison">
          <article><small>当前 Nacre</small><Sample /></article>
          <article><small>SVG 同轨边缘</small><Sample settings={settings} /></article>
          <article><small>微调候选 · 明暗 -15%</small><Sample settings={softenedSettings} /></article>
        </div>
        <PathSamples settings={settings} />
        <ThemeSamples settings={softenedSettings} />
      </section>
    </main>
  );
}

const container = document.getElementById('root') as HTMLElement & {__nacreRoot?: ReturnType<typeof createRoot>};
const root = container.__nacreRoot ?? createRoot(container);
container.__nacreRoot = root;
root.render(<StrictMode><GlassLab /></StrictMode>);
