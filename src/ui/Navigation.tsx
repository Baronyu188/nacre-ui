import {useEffect, useId, useRef, useState, type Dispatch, type KeyboardEvent, type MouseEvent, type PointerEvent as ReactPointerEvent, type ReactNode, type SetStateAction} from 'react';
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
  Toolbar as AriaToolbar,
  type Key,
} from 'react-aria-components';
import {Button, type ButtonProps} from './Button';
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

export interface DesktopNavigationProps extends NavigationProps {
  title?: ReactNode;
  headerAction?: ReactNode;
  contextMenuItems?: ActionItem[] | ((item: NavigationItem) => ActionItem[]);
  onContextAction?: (itemId: string, key: Key) => void;
  hideLabel?: string;
  onHide?: () => void;
  isResizable?: boolean;
  width?: number;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  onWidthChange?: (width: number) => void;
}

export function DesktopNavigation({items, selectedKey, onSelectionChange, ariaLabel, title = '导航', headerAction, contextMenuItems, onContextAction, hideLabel = '隐藏导航栏', onHide, isResizable = true, width, defaultWidth, minWidth = 180, maxWidth = 380, onWidthChange}: DesktopNavigationProps) {
  const layoutId = useId();
  const navRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{x: number; width: number} | null>(null);
  const [internalWidth, setInternalWidth] = useState(defaultWidth);
  const currentWidth = width ?? internalWidth;
  const updateWidth = (nextWidth: number) => {
    const next = Math.min(maxWidth, Math.max(minWidth, nextWidth));
    if (width === undefined) setInternalWidth(next);
    onWidthChange?.(next);
  };
  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    dragRef.current = {x: event.clientX, width: navRef.current?.getBoundingClientRect().width ?? currentWidth ?? minWidth};
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const resize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (dragRef.current) updateWidth(dragRef.current.width + event.clientX - dragRef.current.x);
  };
  const finishResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const resizeWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>) => {
    const current = navRef.current?.getBoundingClientRect().width ?? currentWidth ?? minWidth;
    if (event.key === 'ArrowLeft') updateWidth(current - 8);
    else if (event.key === 'ArrowRight') updateWidth(current + 8);
    else if (event.key === 'Home') updateWidth(minWidth);
    else if (event.key === 'End') updateWidth(maxWidth);
    else return;
    event.preventDefault();
  };
  return (
    <nav ref={navRef} className="nacre-desktop-navigation" aria-label={ariaLabel} data-resizable={isResizable || undefined} style={currentWidth ? {width: currentWidth} : undefined}>
      <GlassAutoRim />
      <header className="nacre-desktop-navigation__head">
        <strong>{title}</strong>
        {(headerAction || onHide) && <span className="nacre-desktop-navigation__actions">
          {headerAction}
          {onHide && (
            <button type="button" className="nacre-desktop-navigation__hide" aria-label={hideLabel} title={hideLabel} onClick={onHide}>
              <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m12.5 4.5-5.5 5.5 5.5 5.5" /></svg>
            </button>
          )}
        </span>}
      </header>
      <div className="nacre-desktop-navigation__items">
        {items.map((item) => {
          const isSelected = selectedKey === item.id;
          const button = (
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
          const menuItems = typeof contextMenuItems === 'function' ? contextMenuItems(item) : contextMenuItems;
          return menuItems?.length ? <ContextMenu key={item.id} ariaLabel={`${typeof item.label === 'string' ? item.label : item.id} 操作`} items={menuItems} isFocusable={false} onAction={(key) => onContextAction?.(item.id, key)}>{button}</ContextMenu> : button;
        })}
      </div>
      {isResizable && <button type="button" className="nacre-desktop-navigation__resizer" aria-label="调整导航栏宽度" onPointerDown={startResize} onPointerMove={resize} onPointerUp={finishResize} onPointerCancel={finishResize} onKeyDown={resizeWithKeyboard} />}
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
  ariaLabel?: string;
  buttonClassName?: string;
  buttonVariant?: ButtonProps['variant'];
  showChevron?: boolean;
}

export function ActionMenu({label, items, onAction, ariaLabel, buttonClassName, buttonVariant = 'glass', showChevron = true}: ActionMenuProps) {
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  return (
    <MenuTrigger>
      <Button variant={buttonVariant} className={buttonClassName} aria-label={ariaLabel}>
        {label}
        {showChevron && <svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15">
          <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>}
      </Button>
      <Popover ref={morph.ref} className="nacre-popover nacre-menu-popover" placement="bottom end" data-liquid offset={8} style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
        <GlassAutoRim />
        <LiquidGlassFilter id={liquid.id} />
        <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
        <Menu aria-label={ariaLabel ?? (typeof label === 'string' ? label : '操作菜单')} className="nacre-menu" onAction={onAction}><MenuItems items={items} onAction={onAction} /></Menu>
      </Popover>
    </MenuTrigger>
  );
}

export interface MenuButtonProps extends ActionMenuProps {}

export function MenuButton({label, items, onAction, ariaLabel, buttonClassName, buttonVariant = 'glass', showChevron = true}: MenuButtonProps) {
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  return (
    <MenuTrigger>
      <Button variant={buttonVariant} className={buttonClassName} aria-label={ariaLabel}>{label}{showChevron && <svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}</Button>
      <Popover ref={morph.ref} className="nacre-popover nacre-menu-popover" placement="bottom start" data-liquid offset={8} style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
        <GlassAutoRim />
        <LiquidGlassFilter id={liquid.id} />
        <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
        <Menu aria-label={ariaLabel ?? (typeof label === 'string' ? label : '操作菜单')} className="nacre-menu" onAction={onAction}><MenuItems items={items} onAction={onAction} /></Menu>
      </Popover>
    </MenuTrigger>
  );
}

export interface MenuBarSection {
  id: string;
  label: string;
  items: ActionItem[];
}

export interface MenuBarProps {
  menus: MenuBarSection[];
  ariaLabel?: string;
  onAction?: (menuId: string, key: Key) => void;
}

function MenuBarSectionTrigger({menu, onAction, openMenuId, setOpenMenuId}: {menu: MenuBarSection; onAction?: MenuBarProps['onAction']; openMenuId: string | null; setOpenMenuId: Dispatch<SetStateAction<string | null>>}) {
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  const handleAction = (key: Key) => {onAction?.(menu.id, key); setOpenMenuId(null);};
  return (
    <MenuTrigger isOpen={openMenuId === menu.id} onOpenChange={(isOpen) => setOpenMenuId((current) => isOpen ? menu.id : current === menu.id ? null : current)}>
      <AriaButton className="nacre-menubar__trigger" onPointerEnter={() => openMenuId !== null && setOpenMenuId(menu.id)}>{menu.label}</AriaButton>
      <Popover ref={morph.ref} className="nacre-popover nacre-menu-popover" placement="bottom start" data-liquid isNonModal offset={6} style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
        <GlassAutoRim />
        <LiquidGlassFilter id={liquid.id} />
        <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
        <Menu aria-label={menu.label} className="nacre-menu" onAction={handleAction}><MenuItems items={menu.items} onAction={handleAction} /></Menu>
      </Popover>
    </MenuTrigger>
  );
}

export function MenuBar({menus, ariaLabel = '编辑器菜单', onAction}: MenuBarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenuId) return;
    const closeOutside = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node) || barRef.current?.contains(target) || (target instanceof Element && target.closest('.nacre-menu-popover'))) return;
      setOpenMenuId(null);
    };
    document.addEventListener('pointerdown', closeOutside, true);
    return () => document.removeEventListener('pointerdown', closeOutside, true);
  }, [openMenuId]);

  return (
    <AriaToolbar ref={barRef} className="nacre-menubar" aria-label={ariaLabel}>
      <GlassAutoRim />
      {menus.map((menu) => <MenuBarSectionTrigger key={menu.id} menu={menu} onAction={onAction} openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} />)}
    </AriaToolbar>
  );
}

export interface ContextMenuProps {
  children: ReactNode;
  ariaLabel: string;
  items: ActionItem[];
  isFocusable?: boolean;
  onAction?: (key: Key) => void;
}

export function ContextMenu({children, ariaLabel, items, isFocusable = true, onAction}: ContextMenuProps) {
  const [isOpen, setOpen] = useState(false);
  const [point, setPoint] = useState({x: 0, y: 0});
  const targetRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  const openAt = (x: number, y: number) => {
    const rect = targetRef.current?.getBoundingClientRect();
    setPoint({x: rect ? x - rect.left : 0, y: rect ? y - rect.top : 0});
    setOpen(true);
  };
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

  return (
    <div ref={targetRef} className="nacre-context-menu__target" tabIndex={isFocusable ? 0 : undefined} aria-label={ariaLabel} onContextMenu={handleContextMenu} onKeyDown={handleKeyDown}>
      {children}
      <MenuTrigger isOpen={isOpen} onOpenChange={setOpen}>
        <AriaButton ref={anchorRef} className="nacre-context-menu__anchor" style={{left: point.x, top: point.y}} aria-hidden="true" excludeFromTabOrder />
        <Popover key={`${point.x}:${point.y}`} ref={morph.ref} className="nacre-popover nacre-menu-popover" placement="bottom start" data-liquid offset={4} style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
          <GlassAutoRim />
          <LiquidGlassFilter id={liquid.id} />
          <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
          <Menu aria-label={ariaLabel} className="nacre-menu" onAction={handleAction}><MenuItems items={items} onAction={handleAction} /></Menu>
        </Popover>
      </MenuTrigger>
    </div>
  );
}
