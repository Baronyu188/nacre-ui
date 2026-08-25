import {useId, type ReactNode} from 'react';
import {motion} from 'motion/react';
import {
  Breadcrumb,
  Breadcrumbs,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  type Key,
} from 'react-aria-components';
import {Button} from './Button';
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
  return (
    <nav className="nacre-desktop-navigation" aria-label={ariaLabel}>
      <header className="nacre-desktop-navigation__head">
        <strong>{title}</strong>
      </header>
      <div className="nacre-desktop-navigation__items">
        {items.map((item) => (
          <button key={item.id} type="button" className="nacre-desktop-navigation__item" data-selected={selectedKey === item.id || undefined} aria-current={selectedKey === item.id ? 'page' : undefined} onClick={() => onSelectionChange?.(item.id)}>
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
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
        {items.map((item) => {
          const isSelected = selectedKey === item.id;
          return (
            <button key={item.id} type="button" className="nacre-mobile-navigation__item" data-selected={isSelected || undefined} aria-current={isSelected ? 'page' : undefined} onClick={() => onSelectionChange?.(item.id)}>
              {isSelected && (
                <motion.span layoutId={layoutId} className="nacre-mobile-navigation__lens" transition={{type: 'spring', stiffness: 310, damping: 21, mass: .72}}>
                  <span className="nacre-mobile-navigation__jelly" />
                </motion.span>
              )}
              <span className="nacre-mobile-navigation__icon" aria-hidden="true">{item.icon}</span>
              <small>{item.label}</small>
            </button>
          );
        })}
      </div>
      {action && <button type="button" className="nacre-mobile-navigation__action" aria-label={action.label} onClick={action.onPress}>{action.icon}</button>}
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
}

export interface ActionMenuProps {
  label: ReactNode;
  items: ActionItem[];
  onAction?: (key: Key) => void;
}

export function ActionMenu({label, items, onAction}: ActionMenuProps) {
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  const trackId = useId();
  return (
    <MenuTrigger>
      <Button variant="glass">
        {label}
        <svg aria-hidden="true" viewBox="0 0 16 16" width="15" height="15">
          <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
      <Popover ref={morph.ref} className="nacre-popover nacre-menu-popover" placement="bottom end" data-liquid offset={8} style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
        <LiquidGlassFilter id={liquid.id} />
        <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
        <Menu className="nacre-menu" items={items} onAction={onAction}>
          {(item) => (
            <MenuItem id={item.id} textValue={item.label} className="nacre-menu__item" data-tone={item.tone}>
              {({isFocused}) => <>
                {isFocused && <motion.span layoutId={trackId} className="nacre-menu__track" transition={{type: 'spring', stiffness: 320, damping: 30, mass: .7}} />}
                <span className="nacre-menu__icon">{item.icon ?? <span className="nacre-menu__dot" />}</span>
                <span className="nacre-menu__copy">{item.label}</span>
                {item.shortcut && <kbd>{item.shortcut}</kbd>}
              </>}
            </MenuItem>
          )}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
