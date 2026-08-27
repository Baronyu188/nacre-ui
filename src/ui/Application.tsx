import {type ReactNode} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  DropZone as AriaDropZone,
  FileTrigger,
  Toolbar as AriaToolbar,
  type DropZoneProps,
  type FileTriggerProps,
  type ToolbarProps,
} from 'react-aria-components';
import {Button, IconButton} from './Button';
import {GlassAutoRim} from './Glass';
import type {IconButtonProps} from './Button';

export interface ToolbarContainerProps extends Omit<ToolbarProps, 'children' | 'className'> {
  children: ReactNode;
}

export function Toolbar({children, ...props}: ToolbarContainerProps) {
  return <AriaToolbar {...props} className="nacre-toolbar">{children}</AriaToolbar>;
}

export type ToolbarButtonProps = Omit<IconButtonProps, 'size' | 'shape' | 'variant' | 'magnetic'>;

export function ToolbarButton({icon, label, className = '', ...props}: ToolbarButtonProps) {
  return <IconButton {...props} className={`nacre-toolbar-button ${className}`.trim()} icon={icon} label={label} size="medium" shape="circle" variant="glass" magnetic={false} />;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  label?: string;
}

export function Pagination({page, totalPages, onChange, label = '分页'}: PaginationProps) {
  const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  return (
    <nav className="nacre-pagination" aria-label={label}>
      <GlassAutoRim />
      <Button className="nacre-pagination__previous" magnetic={false} aria-label="上一页" isDisabled={safePage <= 1} onPress={() => onChange(safePage - 1)}>
        <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m12.5 4.5-5.5 5.5 5.5 5.5" /></svg>
      </Button>
      <span className="nacre-pagination__readout" aria-live="polite" aria-atomic="true">
        <span className="nacre-pagination__number" aria-hidden="true">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.strong
              key={safePage}
              initial={{opacity: 0, y: '68%', filter: 'blur(6px)'}}
              animate={{opacity: 1, y: 0, filter: 'blur(0px)'}}
              exit={{opacity: 0, y: '-68%', filter: 'blur(6px)'}}
              transition={{duration: .28, ease: [.2, .8, .2, 1]}}
            >
              {safePage}
            </motion.strong>
          </AnimatePresence>
        </span>
        <small aria-hidden="true"> / {Math.max(totalPages, 1)}</small>
        <span className="nacre-sr-only">{safePage} / {Math.max(totalPages, 1)}</span>
      </span>
      <Button className="nacre-pagination__next" magnetic={false} aria-label="下一页" isDisabled={safePage >= totalPages} onPress={() => onChange(safePage + 1)}>
        <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" /></svg>
      </Button>
    </nav>
  );
}

export interface FileDropProps extends Omit<DropZoneProps, 'children' | 'className'>, Pick<FileTriggerProps, 'acceptedFileTypes' | 'allowsMultiple' | 'onSelect'> {
  label: string;
  description?: string;
  actionLabel?: string;
}

export function FileDrop({label, description, actionLabel = '选择文件', acceptedFileTypes, allowsMultiple, onSelect, ...props}: FileDropProps) {
  return (
    <AriaDropZone {...props} className="nacre-drop-zone">
      <span className="nacre-drop-zone__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 15V5m0 0L8.5 8.5M12 5l3.5 3.5M6 14.5v2.25A2.25 2.25 0 0 0 8.25 19h7.5A2.25 2.25 0 0 0 18 16.75V14.5" /></svg>
      </span>
      <div><strong>{label}</strong>{description && <small>{description}</small>}</div>
      <FileTrigger acceptedFileTypes={acceptedFileTypes} allowsMultiple={allowsMultiple} onSelect={onSelect}>
        <Button variant="prominent" magnetic={false}>{actionLabel}</Button>
      </FileTrigger>
    </AriaDropZone>
  );
}
