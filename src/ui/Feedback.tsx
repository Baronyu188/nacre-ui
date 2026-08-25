import {type ReactNode} from 'react';
import {
  Label,
  Meter as AriaMeter,
  ProgressBar as AriaProgress,
  type MeterProps,
  type ProgressBarProps,
} from 'react-aria-components';
import {Button, CloseIcon} from './Button';

export interface ProgressProps extends Omit<ProgressBarProps, 'children' | 'className'> {
  label: string;
}

export function Progress({label, ...props}: ProgressProps) {
  return (
    <AriaProgress {...props} className="nacre-progress">
      {({percentage, valueText, isIndeterminate}) => (
        <>
          <div className="nacre-progress__head"><Label>{label}</Label><span>{isIndeterminate ? '进行中' : valueText}</span></div>
          <div className="nacre-progress__track"><span style={isIndeterminate ? undefined : {width: `${percentage}%`}} /></div>
        </>
      )}
    </AriaProgress>
  );
}

export interface MeterBarProps extends Omit<MeterProps, 'children' | 'className'> {
  label: string;
  tone?: 'accent' | 'success' | 'warning';
}

export function MeterBar({label, tone = 'accent', ...props}: MeterBarProps) {
  return (
    <AriaMeter {...props} className="nacre-meter" data-tone={tone}>
      {({percentage, valueText}) => (
        <>
          <div className="nacre-progress__head"><Label>{label}</Label><span>{valueText}</span></div>
          <div className="nacre-progress__track"><span style={{width: `${percentage}%`}} /></div>
        </>
      )}
    </AriaMeter>
  );
}

export function Badge({children, tone = 'neutral'}: {children: ReactNode; tone?: 'neutral' | 'accent' | 'success' | 'warning'}) {
  return <span className="nacre-badge" data-tone={tone}>{children}</span>;
}

export interface NoticeProps {
  title: string;
  children?: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'danger';
  onDismiss?: () => void;
}

export function Notice({title, children, tone = 'info', onDismiss}: NoticeProps) {
  return (
    <div className="nacre-notice" data-tone={tone} role={tone === 'danger' ? 'alert' : 'status'}>
      <span className="nacre-notice__mark" aria-hidden="true" />
      <div><strong>{title}</strong>{children && <span>{children}</span>}</div>
      {onDismiss && <Button variant="quiet" aria-label="关闭通知" onPress={onDismiss}><CloseIcon /></Button>}
    </div>
  );
}

export function Skeleton({width = '100%', height = 16, radius = 8}: {width?: string | number; height?: string | number; radius?: string | number}) {
  return <span className="nacre-skeleton" style={{width, height, borderRadius: radius}} aria-hidden="true" />;
}
