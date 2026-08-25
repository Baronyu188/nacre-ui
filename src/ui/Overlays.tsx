import {type ReactNode} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {
  Dialog,
  DialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
  Popover,
  Tooltip,
  TooltipTrigger,
} from 'react-aria-components';
import {Button, CloseIcon} from './Button';
import {LiquidGlassFilter, useLiquidGlassFilter, useLiquidPopoverMorph} from './LiquidGlass';

export function InfoPopover({trigger, children}: {trigger: ReactNode; children: ReactNode}) {
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  return (
    <DialogTrigger>
      <Button variant="glass">{trigger}</Button>
      <Popover ref={morph.ref} className="nacre-popover nacre-menu-popover" placement="bottom" data-liquid offset={8} style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
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
                      className="nacre-button nacre-notification-center__item"
                      data-variant="glass"
                      initial={{height: 0, opacity: 0, y: -6, scale: .97, filter: 'blur(5px)'}}
                      animate={{height: 72, opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)'}}
                      exit={{height: 0, opacity: 0, x: -18, y: -4, scale: .94, filter: 'blur(7px)'}}
                      transition={{duration: .28, ease: [.2, .8, .2, 1], layout: {type: 'spring', stiffness: 300, damping: 28}}}
                    >
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
      <Tooltip className="nacre-tooltip" placement="top">{children}</Tooltip>
    </TooltipTrigger>
  );
}

interface PresentationProps {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  kind?: 'dialog' | 'drawer';
}

export function Presentation({trigger, title, children, kind = 'dialog'}: PresentationProps) {
  return (
    <DialogTrigger>
      <Button variant={kind === 'dialog' ? 'prominent' : 'glass'}>{trigger}</Button>
      <ModalOverlay isDismissable className="nacre-overlay">
        <Modal className={`nacre-modal nacre-modal--${kind}`}>
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
