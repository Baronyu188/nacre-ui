import {type ReactNode} from 'react';
import {Skeleton} from './Feedback';

export type CardPreset = 'content' | 'media' | 'metric';

export interface CardProps {
  preset?: CardPreset;
  eyebrow?: string;
  title: string;
  description?: string;
  media?: ReactNode;
  value?: ReactNode;
  footer?: ReactNode;
}

export interface SettingsCardItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  value?: ReactNode;
  control?: ReactNode;
  onPress?: () => void;
}

export interface SettingsCardProps {
  ariaLabel: string;
  items: SettingsCardItem[];
}

function SettingsChevron() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" /></svg>;
}

export function SettingsCard({ariaLabel, items}: SettingsCardProps) {
  return (
    <section className="nacre-settings-card" aria-label={ariaLabel}>
      {items.map((item) => {
        const content = (
          <>
            {item.icon && <span className="nacre-settings-row__icon" aria-hidden="true">{item.icon}</span>}
            <span className="nacre-settings-row__label">{item.label}</span>
            <span className="nacre-settings-row__trailing">
              {item.value && <span className="nacre-settings-row__value">{item.value}</span>}
              {item.control && <span className="nacre-settings-row__control">{item.control}</span>}
              {item.onPress && <span className="nacre-settings-row__chevron"><SettingsChevron /></span>}
            </span>
          </>
        );

        return item.onPress ? (
          <button key={item.id} type="button" className="nacre-settings-row" data-has-icon={item.icon ? '' : undefined} onClick={item.onPress}>{content}</button>
        ) : (
          <div key={item.id} className="nacre-settings-row" data-has-icon={item.icon ? '' : undefined}>{content}</div>
        );
      })}
    </section>
  );
}

export function Card({preset = 'content', eyebrow, title, description, media, value, footer}: CardProps) {
  return (
    <article className="nacre-card" data-preset={preset}>
      {media && <div className="nacre-card__media">{media}</div>}
      <div className="nacre-card__body">
        {eyebrow && <small>{eyebrow}</small>}
        {value && <strong className="nacre-card__value">{value}</strong>}
        <h4>{title}</h4>
        {description && <p>{description}</p>}
      </div>
      {footer && <footer>{footer}</footer>}
    </article>
  );
}

export function CardSkeleton({preset = 'content'}: {preset?: CardPreset}) {
  return (
    <div className="nacre-card nacre-card--skeleton" data-preset={preset} aria-label="正在加载">
      {preset === 'media' && <div className="nacre-card__media"><Skeleton height="100%" radius={0} /></div>}
      <div className="nacre-card__body">
        <Skeleton width="30%" height={9} />
        {preset === 'metric' && <Skeleton width="48%" height={30} radius={10} />}
        <Skeleton width="72%" height={15} />
        <Skeleton width="92%" height={10} />
        <Skeleton width="64%" height={10} />
      </div>
    </div>
  );
}
