import {useMemo, useState, type ReactNode} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  Dialog,
  DialogTrigger,
  Heading,
  Input,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  Popover,
  SearchField,
  Tooltip,
  TooltipTrigger,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastList as AriaToastList,
  UNSTABLE_ToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  type Key,
} from 'react-aria-components';
import {Button, CloseIcon, IconButton} from './Button';
import {LiquidGlassFilter, useLiquidGlassFilter, useLiquidPopoverMorph} from './LiquidGlass';
import {GlassAutoRim} from './Glass';

export function InfoPopover({trigger, children}: {trigger: ReactNode; children: ReactNode}) {
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  return (
    <DialogTrigger>
      <Button variant="glass">{trigger}</Button>
      <Popover ref={morph.ref} className="nacre-popover nacre-menu-popover" placement="bottom" data-liquid offset={8} style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
        <GlassAutoRim />
        <LiquidGlassFilter id={liquid.id} />
        <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
        <Dialog className="nacre-popover__dialog">{children}</Dialog>
      </Popover>
    </DialogTrigger>
  );
}

export interface NotificationFlyoutItem {
  id: string;
  title: string;
  description?: string;
  time?: string;
  unread?: boolean;
}

interface NotificationCenterProps {
  trigger?: ReactNode;
  title?: string;
  items: NotificationFlyoutItem[];
  onAction?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export function NotificationCenter({trigger = '查看通知', title = '通知中心', items, onAction, onDismiss}: NotificationCenterProps) {
  const unreadCount = items.filter((item) => item.unread).length;

  return (
    <DialogTrigger>
      <Button className="nacre-notification-flyout__trigger" variant="glass" magnetic={false} aria-label={title}>{trigger}</Button>
      <ModalOverlay isDismissable className="nacre-overlay nacre-notification-center__overlay">
        <Modal className="nacre-modal nacre-modal--drawer nacre-notification-center">
          <Dialog className="nacre-dialog">
            {({close}) => (
              <>
                <header className="nacre-notification-center__head">
                  <div>
                    <Heading slot="title">{title}</Heading>
                    {unreadCount > 0 && <small>{unreadCount} 条未读通知</small>}
                  </div>
                  <Button variant="quiet" aria-label="关闭通知中心" onPress={close}><CloseIcon /></Button>
                </header>
                <div className="nacre-notification-center__list">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                    <motion.article
                      key={item.id}
                      layout
                      className="nacre-notification-center__item"
                      initial={{height: 0, opacity: 0, y: -6, scale: .97, filter: 'blur(5px)'}}
                      animate={{height: 72, opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)'}}
                      exit={{height: 0, opacity: 0, x: -18, y: -4, scale: .94, filter: 'blur(7px)'}}
                      transition={{duration: .28, ease: [.2, .8, .2, 1], layout: {type: 'spring', stiffness: 300, damping: 28}}}
                    >
                      <GlassAutoRim />
                      <Button className="nacre-notification-center__dismiss" variant="glass" aria-label={`关闭通知：${item.title}`} onPress={() => onDismiss?.(item.id)}>
                        <CloseIcon />
                      </Button>
                      <Button className="nacre-notification-center__body" variant="quiet" magnetic={false} onPress={() => onAction?.(item.id)}>
                        <span className="nacre-notification-center__icon" aria-hidden="true">
                          <svg viewBox="0 0 20 20"><path d="M5.2 13.8h9.6l-1.2-1.6V8.3a3.6 3.6 0 0 0-7.2 0v3.9l-1.2 1.6Zm3.3 2a1.7 1.7 0 0 0 3 0" /></svg>
                        </span>
                        <span className="nacre-notification-center__copy">
                          <strong>{item.title}</strong>
                          {item.description && <span>{item.description}</span>}
                        </span>
                        {item.time && <time>{item.time}</time>}
                      </Button>
                    </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

export const NotificationFlyout = NotificationCenter;

export function Hint({trigger, children}: {trigger: ReactNode; children: ReactNode}) {
  return (
    <TooltipTrigger delay={250} closeDelay={80}>
      <Button variant="quiet" aria-label={typeof children === 'string' ? children : undefined}>{trigger}</Button>
      <Tooltip className="nacre-tooltip" placement="top"><GlassAutoRim />{children}</Tooltip>
    </TooltipTrigger>
  );
}

export interface ToastMessage {
  title: string;
  description?: string;
  tone?: 'info' | 'success' | 'warning' | 'danger';
  actionLabel?: string;
  onAction?: () => void;
}

export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export const toastQueue = new UNSTABLE_ToastQueue<ToastMessage>({
  maxVisibleToasts: 3,
  wrapUpdate: (update, action) => {
    const viewTransition = typeof document === 'undefined' ? undefined : document.startViewTransition;
    if (action !== 'add' && viewTransition) {
      viewTransition.call(document, update);
      return;
    }
    update();
  },
});

export interface ToastProps {
  queue?: UNSTABLE_ToastQueue<ToastMessage>;
  label?: string;
  position?: ToastPosition;
}

export function Toast({queue = toastQueue, label = '系统通知', position = 'bottom-right'}: ToastProps) {
  return (
    <AriaToastRegion queue={queue} aria-label={label} className="nacre-toast-region" data-position={position}>
      <AriaToastList className="nacre-toast-list">
        {({toast}) => {
          const content = toast.content as ToastMessage;
          return <AriaToast toast={toast} className="nacre-toast" data-tone={content.tone ?? 'info'}>
            <GlassAutoRim />
            <AriaToastContent className="nacre-toast__content">
              <strong>{content.title}</strong>
              {content.description && <span>{content.description}</span>}
            </AriaToastContent>
            {content.actionLabel && (
              <Button className="nacre-toast__action" variant="quiet" onPress={() => {content.onAction?.(); queue.close(toast.key);}}>
                {content.actionLabel}
              </Button>
            )}
            <IconButton className="nacre-toast__close" slot="close" icon={<CloseIcon />} label={`关闭通知：${content.title}`} size="small" variant="quiet" />
          </AriaToast>;
        }}
      </AriaToastList>
    </AriaToastRegion>
  );
}

export interface AlertDialogProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
  onConfirm?: () => void;
}

export function AlertDialog({trigger, title, children, confirmLabel, cancelLabel = '取消', tone = 'default', onConfirm}: AlertDialogProps) {
  return (
    <DialogTrigger>
      <Button variant="glass">{trigger}</Button>
      <ModalOverlay isDismissable className="nacre-overlay">
        <Modal className="nacre-modal nacre-alert-dialog">
          <Dialog role="alertdialog" className="nacre-dialog">
            {({close}) => (
              <>
                <div className="nacre-dialog__head"><Heading slot="title">{title}</Heading></div>
                <div className="nacre-dialog__body">{children}</div>
                <footer className="nacre-alert-dialog__actions">
                  <Button variant="quiet" onPress={close}>{cancelLabel}</Button>
                  <Button className="nacre-alert-dialog__confirm" data-tone={tone} variant="prominent" onPress={() => {onConfirm?.(); close();}}>{confirmLabel}</Button>
                </footer>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  shortcut?: string;
  keywords?: string[];
  icon?: ReactNode;
  isDisabled?: boolean;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  commands: CommandItem[];
  onAction?: (key: Key) => void;
  title?: string;
  placeholder?: string;
  emptyText?: string;
}

export function CommandPalette({isOpen, onOpenChange, commands, onAction, title = '命令面板', placeholder = '搜索命令…', emptyText = '没有匹配的命令'}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const visibleCommands = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized) return commands;
    return commands.filter((command) => [command.label, command.description, ...(command.keywords ?? [])].filter(Boolean).some((value) => value!.toLocaleLowerCase().includes(normalized)));
  }, [commands, query]);
  const setOpen = (open: boolean) => {if (!open) setQuery(''); onOpenChange(open);};

  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={setOpen} isDismissable className="nacre-overlay nacre-command-palette__overlay">
      <Modal className="nacre-modal nacre-command-palette">
        <Dialog className="nacre-dialog nacre-command-palette__dialog">
          <Heading slot="title" className="nacre-command-palette__title">{title}</Heading>
          <SearchField value={query} onChange={setQuery} aria-label={placeholder} className="nacre-command-palette__search">
            <svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5" /><path d="m12.2 12.2 4 4" /></svg>
            <Input autoFocus placeholder={placeholder} />
            <kbd>⌘ K</kbd>
          </SearchField>
          <ListBox aria-label={title} items={visibleCommands} className="nacre-command-palette__list" renderEmptyState={() => <div className="nacre-command-palette__empty">{emptyText}</div>}>
            {(command) => (
              <ListBoxItem id={command.id} textValue={command.label} isDisabled={command.isDisabled} className="nacre-command-palette__item" onAction={() => {onAction?.(command.id); setOpen(false);}}>
                <span className="nacre-command-palette__icon" aria-hidden="true">{command.icon ?? '◇'}</span>
                <span className="nacre-command-palette__copy"><strong>{command.label}</strong>{command.description && <small>{command.description}</small>}</span>
                {command.shortcut && <kbd>{command.shortcut}</kbd>}
              </ListBoxItem>
            )}
          </ListBox>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

export interface PresentationProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  kind?: 'dialog' | 'drawer';
  placement?: 'right' | 'left' | 'top' | 'bottom';
}

export function Presentation({trigger, title, children, kind = 'dialog', placement = 'right'}: PresentationProps) {
  return (
    <DialogTrigger>
      <Button variant={kind === 'dialog' ? 'prominent' : 'glass'}>{trigger}</Button>
      <ModalOverlay isDismissable className="nacre-overlay">
        <Modal className={`nacre-modal nacre-modal--${kind}`} data-placement={kind === 'drawer' ? placement : undefined}>
          <Dialog className="nacre-dialog">
            {({close}) => (
              <>
                <div className="nacre-dialog__head">
                  <Heading slot="title">{title}</Heading>
                  <Button variant="quiet" aria-label="关闭" onPress={close}><CloseIcon /></Button>
                </div>
                <div className="nacre-dialog__body">{children}</div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}

export interface AdaptiveSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
  placement?: 'right' | 'left' | 'top' | 'bottom';
  mobilePlacement?: 'right' | 'left' | 'top' | 'bottom';
}

export function AdaptiveSheet({isOpen, onOpenChange, title, children, footer, closeLabel = '关闭面板', placement = 'right', mobilePlacement = 'bottom'}: AdaptiveSheetProps) {
  return (
    <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange} isDismissable className="nacre-overlay nacre-adaptive-sheet__overlay">
      <Modal className="nacre-modal nacre-modal--drawer nacre-adaptive-sheet" data-placement={placement} data-mobile-placement={mobilePlacement}>
        <Dialog className="nacre-dialog nacre-adaptive-sheet__dialog">
          {({close}) => (
            <>
              <header className="nacre-dialog__head">
                <Heading slot="title">{title}</Heading>
                <IconButton icon={<CloseIcon />} label={closeLabel} size="small" variant="quiet" onPress={close} />
              </header>
              <div className="nacre-adaptive-sheet__body">{children}</div>
              {footer && <footer className="nacre-adaptive-sheet__footer">{footer}</footer>}
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
