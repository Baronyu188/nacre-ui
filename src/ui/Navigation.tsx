import {useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode} from 'react';
import {motion} from 'motion/react';
import {
  Breadcrumb,
  Breadcrumbs,
  Button as AriaButton,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  SubmenuTrigger,
  type Key,
} from 'react-aria-components';
import {Button} from './Button';
import {GlassAutoRim} from './Glass';
import {LiquidGlassFilter, useLiquidGlassFilter, useLiquidPopoverMorph} from './LiquidGlass';

export interface CrumbItem {
  id: string;
  label: string;
  href?: string;
}

export function BreadcrumbTrail({items, label = '面包屑导航'}: {items: CrumbItem[]; label?: string}) {
  return (
    <Breadcrumbs aria-label={label} className="nacre-breadcrumbs" items={items}>
      {(item) => (
        <Breadcrumb className="nacre-breadcrumb">
          <Link href={item.href}>{item.label}</Link>
          <svg aria-hidden="true" viewBox="0 0 12 12" width="12" height="12">
            <path d="m4.5 2.5 3 3.5-3 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Breadcrumb>
      )}
    </Breadcrumbs>
  );
}

export interface NavigationItem {
  id: string;
  label: ReactNode;
  icon: ReactNode;
}

interface NavigationProps {
  items: NavigationItem[];
  selectedKey: string;
  onSelectionChange?: (key: string) => void;
  ariaLabel: string;
}

interface DesktopNavigationProps extends NavigationProps {
  title?: ReactNode;
}

export function DesktopNavigation({items, selectedKey, onSelectionChange, ariaLabel, title = '导航'}: DesktopNavigationProps) {
  const layoutId = useId();
  return (
    <nav className="nacre-desktop-navigation" aria-label={ariaLabel}>
      <GlassAutoRim />
      <header className="nacre-desktop-navigation__head">
        <strong>{title}</strong>
      </header>
      <div className="nacre-desktop-navigation__items">
        {items.map((item) => {
          const isSelected = selectedKey === item.id;
          return (
            <button key={item.id} type="button" className="nacre-desktop-navigation__item" data-selected={isSelected || undefined} aria-current={isSelected ? 'page' : undefined} onClick={() => onSelectionChange?.(item.id)}>
              {isSelected && (
                <motion.span layoutId={layoutId} className="nacre-desktop-navigation__lens" transition={{type: 'spring', stiffness: 310, damping: 21, mass: .72}}>
                  <span className="nacre-desktop-navigation__jelly"><GlassAutoRim /></span>
                </motion.span>
              )}
              <span className="nacre-desktop-navigation__icon" aria-hidden="true">{item.icon}</span>
              <span className="nacre-desktop-navigation__label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

interface MobileNavigationProps extends NavigationProps {
  action?: {label: string; icon: ReactNode; onPress?: () => void};
}

export function MobileNavigation({items, selectedKey, onSelectionChange, ariaLabel, action}: MobileNavigationProps) {
  const layoutId = useId();
  const morph = useLiquidPopoverMorph({maxX: 3, maxY: 2, strength: .018});
  return (
    <nav className="nacre-mobile-navigation" aria-label={ariaLabel}>
      <div ref={morph.ref} className="nacre-mobile-navigation__items" onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
        <GlassAutoRim />
        {items.map((item) => {
          const isSelected = selectedKey === item.id;
          return (
            <button key={item.id} type="button" className="nacre-mobile-navigation__item" data-selected={isSelected || undefined} aria-current={isSelected ? 'page' : undefined} onClick={() => onSelectionChange?.(item.id)}>
              {isSelected && (
                <motion.span layoutId={layoutId} className="nacre-mobile-navigation__lens" transition={{type: 'spring', stiffness: 310, damping: 21, mass: .72}}>
                  <span className="nacre-mobile-navigation__jelly"><GlassAutoRim /></span>
                </motion.span>
              )}
              <span className="nacre-mobile-navigation__icon" aria-hidden="true">{item.icon}</span>
              <small>{item.label}</small>
            </button>
          );
        })}
      </div>
      {action && <button type="button" className="nacre-mobile-navigation__action" aria-label={action.label} onClick={action.onPress}><GlassAutoRim />{action.icon}</button>}
    </nav>
  );
}

export interface ActionItem {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  tone?: 'default' | 'danger';
  icon?: ReactNode;
  isDisabled?: boolean;
  children?: ActionItem[];
}

function MenuItemBody({item}: {item: ActionItem}) {
  return <>
    <span className="nacre-menu__icon">{item.icon ?? <span className="nacre-menu__dot" />}</span>
    <span className="nacre-menu__copy">{item.label}</span>
    {item.children?.length
      ? <svg className="nacre-menu__chevron" aria-hidden="true" viewBox="0 0 16 16"><path d="m6 4 4 4-4 4" /></svg>
      : item.shortcut && <kbd>{item.shortcut}</kbd>}
  </>;
}

function MenuItems({items, onAction}: {items: ActionItem[]; onAction?: (key: Key) => void}) {
  const trackId = useId();
  return <>{items.map((item) => item.children?.length ? (
    <SubmenuTrigger key={item.id} delay={140}>
      <MenuItem id={item.id} textValue={item.label} className="nacre-menu__item" data-tone={item.tone} isDisabled={item.isDisabled}>
        {({isFocused}) => <>{isFocused && <motion.span layoutId={trackId} className="nacre-menu__track" transition={{type: 'spring', stiffness: 320, damping: 30, mass: .7}} />}<MenuItemBody item={item} /></>}
      </MenuItem>
      <Popover className="nacre-popover nacre-menu-popover nacre-submenu-popover" placement="right top" offset={-5} data-liquid>
        <GlassAutoRim />
        <Menu aria-label={item.label} className="nacre-menu" onAction={onAction}><MenuItems items={item.children} onAction={onAction} /></Menu>
      </Popover>
    </SubmenuTrigger>
  ) : (
    <MenuItem key={item.id} id={item.id} textValue={item.label} className="nacre-menu__item" data-tone={item.tone} isDisabled={item.isDisabled}>
      {({isFocused}) => <>{isFocused && <motion.span layoutId={trackId} className="nacre-menu__track" transition={{type: 'spring', stiffness: 320, damping: 30, mass: .7}} />}<MenuItemBody item={item} /></>}
    </MenuItem>
  ))}</>;
}

export interface ActionMenuProps {
  label: ReactNode;
  items: ActionItem[];
  onAction?: (key: Key) => void;
}

export function ActionMenu({label, items, onAction}: ActionMenuProps) {
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  return (
    <MenuTrigger>
      <Button variant="glass">
        {label}
        <svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15">
          <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
      <Popover ref={morph.ref} className="nacre-popover nacre-menu-popover" placement="bottom end" data-liquid offset={8} style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
        <GlassAutoRim />
        <LiquidGlassFilter id={liquid.id} />
        <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
        <Menu aria-label={typeof label === 'string' ? label : '操作菜单'} className="nacre-menu" onAction={onAction}><MenuItems items={items} onAction={onAction} /></Menu>
      </Popover>
    </MenuTrigger>
  );
}

export interface MenuButtonProps extends ActionMenuProps {}

export function MenuButton({label, items, onAction}: MenuButtonProps) {
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  return (
    <MenuTrigger>
      <Button variant="glass">{label}<svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></Button>
      <Popover ref={morph.ref} className="nacre-popover nacre-menu-popover" placement="bottom start" data-liquid offset={8} style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
        <GlassAutoRim />
        <LiquidGlassFilter id={liquid.id} />
        <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
        <Menu aria-label={typeof label === 'string' ? label : '操作菜单'} className="nacre-menu" onAction={onAction}><MenuItems items={items} onAction={onAction} /></Menu>
      </Popover>
    </MenuTrigger>
  );
}

export interface ContextMenuProps {
  children: ReactNode;
  ariaLabel: string;
  items: ActionItem[];
  onAction?: (key: Key) => void;
}

export function ContextMenu({children, ariaLabel, items, onAction}: ContextMenuProps) {
  const [isOpen, setOpen] = useState(false);
  const [point, setPoint] = useState({x: 0, y: 0});
  const targetRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  const openAt = (x: number, y: number) => {setPoint({x, y}); setOpen(true);};
  const handleContextMenu = (event: MouseEvent<HTMLDivElement>) => {event.preventDefault(); openAt(event.clientX, event.clientY);};
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu') {
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      openAt(rect.left + 12, rect.bottom - 8);
    }
  };
  const handleAction = (key: Key) => {onAction?.(key); setOpen(false);};

  useEffect(() => {
    if (!isOpen) return;
    const reposition = (event: globalThis.MouseEvent) => {
      const rect = targetRef.current?.getBoundingClientRect();
      if (!rect || event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) return;
      event.preventDefault();
      event.stopPropagation();
      openAt(event.clientX, event.clientY);
    };
    document.addEventListener('contextmenu', reposition, true);
    return () => document.removeEventListener('contextmenu', reposition, true);
  }, [isOpen]);

  return <>
    <div ref={targetRef} className="nacre-context-menu__target" tabIndex={0} aria-label={ariaLabel} onContextMenu={handleContextMenu} onKeyDown={handleKeyDown}>{children}</div>
    <MenuTrigger isOpen={isOpen} onOpenChange={setOpen}>
      <AriaButton ref={anchorRef} className="nacre-context-menu__anchor" style={{left: point.x, top: point.y}} aria-hidden="true" excludeFromTabOrder />
      <Popover key={`${point.x}:${point.y}`} ref={morph.ref} className="nacre-popover nacre-menu-popover" placement="bottom start" data-liquid offset={4} style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
        <GlassAutoRim />
        <LiquidGlassFilter id={liquid.id} />
        <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
        <Menu aria-label={ariaLabel} className="nacre-menu" onAction={handleAction}><MenuItems items={items} onAction={handleAction} /></Menu>
      </Popover>
    </MenuTrigger>
  </>;
}
