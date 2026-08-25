import {type ReactNode} from 'react';
import {Separator as AriaSeparator, type SeparatorProps} from 'react-aria-components';

export function Avatar({name, src, initials, size = 42, status}: {name: string; src?: string; initials: string; size?: number; status?: 'online' | 'busy' | 'away'}) {
  return (
    <span className="nacre-avatar" style={{width: size, height: size}} role="img" aria-label={status ? `${name}, ${status}` : name}>
      {src ? <img src={src} alt="" /> : <span>{initials}</span>}
      {status && <span className="nacre-avatar__status" data-tone={status} aria-hidden="true" />}
    </span>
  );
}

export function StatusDot({tone = 'neutral', label}: {tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger'; label: string}) {
  return <span className="nacre-status-dot" data-tone={tone}><span aria-hidden="true" />{label}</span>;
}

export function Kbd({children}: {children: ReactNode}) {
  return <kbd className="nacre-kbd">{children}</kbd>;
}

export function Separator(props: SeparatorProps) {
  return <AriaSeparator {...props} className="nacre-separator" />;
}

export function EmptyState({icon = '◇', title, children, action}: {icon?: ReactNode; title: string; children?: ReactNode; action?: ReactNode}) {
  return (
    <div className="nacre-empty-state">
      <span className="nacre-empty-state__icon" aria-hidden="true">{icon}</span>
      <strong>{title}</strong>
      {children && <span>{children}</span>}
      {action}
    </div>
  );
}
