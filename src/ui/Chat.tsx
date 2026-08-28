import {useEffect, useRef, useState, type KeyboardEvent, type ReactNode} from 'react';
import {Dialog, Heading, Modal, ModalOverlay} from 'react-aria-components';
import {Button, CloseIcon} from './Button';
import {ActionMenu, DesktopNavigation, MenuButton, type ActionItem} from './Navigation';

export interface ConversationItem {
  id: string;
  title: string;
  preview?: string;
  time?: string;
  unread?: number;
  avatar?: ReactNode;
}

export interface ConversationListProps {
  items: ConversationItem[];
  selectedKey?: string;
  title?: ReactNode;
  headerAction?: ReactNode;
  contextMenuItems?: ActionItem[];
  ariaLabel?: string;
  defaultWidth?: number;
  onSelectionChange?: (key: string) => void;
  onContextAction?: (conversationId: string, actionId: string) => void;
}

export function ConversationList({items, selectedKey, title = '对话', headerAction, contextMenuItems, ariaLabel = '会话列表', defaultWidth = 210, onSelectionChange, onContextAction}: ConversationListProps) {
  return (
    <div className="nacre-conversation-list">
      <DesktopNavigation
        title={title}
        headerAction={headerAction}
        ariaLabel={ariaLabel}
        defaultWidth={defaultWidth}
        selectedKey={selectedKey ?? items[0]?.id ?? ''}
        onSelectionChange={onSelectionChange}
        contextMenuItems={contextMenuItems}
        onContextAction={(itemId, key) => onContextAction?.(itemId, String(key))}
        items={items.map((item) => ({
          id: item.id,
          icon: <span className="nacre-conversation-list__avatar">{item.avatar ?? item.title.slice(0, 1)}</span>,
          label: <span className="nacre-conversation-list__row">
            <span className="nacre-conversation-list__copy"><strong>{item.title}</strong>{item.preview && <span>{item.preview}</span>}</span>
            <span className="nacre-conversation-list__meta">{item.time && <time>{item.time}</time>}{!!item.unread && <b aria-label={`${item.unread} 条未读`}>{item.unread}</b>}</span>
          </span>,
        }))}
      />
    </div>
  );
}

export interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  author?: string;
  avatar?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

export function ChatMessage({role, author, avatar, meta, actions, children}: ChatMessageProps) {
  return (
    <article className="nacre-chat-message" data-role={role}>
      {avatar && <span className="nacre-chat-message__avatar" aria-hidden="true">{avatar}</span>}
      <div className="nacre-chat-message__content">
        {(author || meta) && <header>{author && <strong>{author}</strong>}{meta && <span>{meta}</span>}</header>}
        <div className="nacre-chat-message__bubble">{children}</div>
        {actions && <footer>{actions}</footer>}
      </div>
    </article>
  );
}

export type ThinkingVariant = 'dots' | 'wave' | 'orbit';

export function AgentThinking({label = '正在思考', variant = 'dots'}: {label?: string; variant?: ThinkingVariant}) {
  return (
    <div className="nacre-agent-thinking" data-variant={variant} role="status" aria-live="polite">
      <span className="nacre-agent-thinking__animation" aria-hidden="true"><i /><i /><i /></span>
      <span className="nacre-agent-thinking__label">{label}</span>
    </div>
  );
}

export interface AgentProgressStep {
  id: string;
  label: string;
  description?: string;
  status: 'complete' | 'active' | 'pending' | 'error';
}

export function AgentProgressSidebar({title = '任务进度', steps}: {title?: string; steps: AgentProgressStep[]}) {
  const complete = steps.filter((step) => step.status === 'complete').length;
  const percentage = steps.length ? Math.round((complete / steps.length) * 100) : 0;
  return (
    <aside className="nacre-agent-progress" aria-label={title}>
      <header><strong>{title}</strong><span>{percentage}%</span></header>
      <div className="nacre-agent-progress__track" aria-hidden="true"><span style={{width: `${percentage}%`}} /></div>
      <ol>
        {steps.map((step) => (
          <li key={step.id} data-status={step.status}>
            <span className="nacre-agent-progress__marker" aria-hidden="true" />
            <div><strong>{step.label}</strong>{step.description && <span>{step.description}</span>}</div>
          </li>
        ))}
      </ol>
    </aside>
  );
}

export interface ChatComposerValue {
  text: string;
  html: string;
}

export interface ChatComposerProps {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  richText?: boolean;
  variant?: 'default' | 'agent';
  leadingControls?: ReactNode;
  trailingControls?: ReactNode;
  sendLabel?: string;
  isDisabled?: boolean;
  onSend?: (value: ChatComposerValue) => void;
}

export function ChatComposer({label = '发送消息', placeholder = '输入消息…', defaultValue, richText = true, variant = 'default', leadingControls, trailingControls, sendLabel = '发送', isDisabled, onSend}: ChatComposerProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const expandedEditorRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!isExpanded) return;
    const frame = requestAnimationFrame(() => {
      if (!expandedEditorRef.current) return;
      expandedEditorRef.current.innerHTML = editorRef.current?.innerHTML ?? '';
      expandedEditorRef.current.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [isExpanded]);
  const send = () => {
    const editor = editorRef.current;
    if (!editor || isDisabled) return;
    const text = editor.innerText.trim();
    if (!text) return;
    onSend?.({text, html: editor.innerHTML.trim()});
    editor.replaceChildren();
    editor.focus();
  };
  const applyExpandedDraft = () => {
    if (editorRef.current && expandedEditorRef.current) editorRef.current.innerHTML = expandedEditorRef.current.innerHTML;
    setExpanded(false);
    requestAnimationFrame(() => editorRef.current?.focus());
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      send();
    }
  };

  return <>
    <div className="nacre-chat-composer" data-variant={variant} data-disabled={isDisabled || undefined}>
      <Button variant="quiet" className="nacre-chat-composer__expand" aria-label="放大编辑消息" isDisabled={isDisabled} onPress={() => setExpanded(true)}><ExpandIcon /></Button>
      <div ref={editorRef} className="nacre-chat-composer__editor" role="textbox" aria-label={label} aria-multiline="true" aria-disabled={isDisabled || undefined} contentEditable={!isDisabled} suppressContentEditableWarning data-rich-text={richText || undefined} data-placeholder={placeholder} onKeyDown={handleKeyDown}>{defaultValue}</div>
      <div className="nacre-chat-composer__controls">
        <div>{leadingControls}</div>
        <div>{trailingControls}<Button variant="prominent" className="nacre-chat-composer__send" aria-label={sendLabel} isDisabled={isDisabled} onPress={send}><SendIcon /></Button></div>
      </div>
    </div>
    <ModalOverlay isOpen={isExpanded} onOpenChange={setExpanded} isDismissable className="nacre-overlay">
      <Modal className="nacre-modal nacre-chat-composer-modal">
        <Dialog className="nacre-dialog">
          <div className="nacre-dialog__head">
            <Heading slot="title">编辑消息</Heading>
            <Button variant="quiet" aria-label="关闭放大编辑" onPress={() => setExpanded(false)}><CloseIcon /></Button>
          </div>
          <div className="nacre-dialog__body">
            <div ref={expandedEditorRef} className="nacre-chat-composer__expanded-editor" role="textbox" aria-label={`${label}（放大）`} aria-multiline="true" contentEditable suppressContentEditableWarning data-rich-text={richText || undefined} data-placeholder={placeholder} />
          </div>
          <footer className="nacre-chat-composer-modal__actions">
            <Button variant="quiet" onPress={() => setExpanded(false)}>取消</Button>
            <Button variant="prominent" onPress={applyExpandedDraft}>完成</Button>
          </footer>
        </Dialog>
      </Modal>
    </ModalOverlay>
  </>;
}

const defaultAttachmentItems: ActionItem[] = [
  {id: 'file', label: '上传文件', icon: <FileIcon />},
  {id: 'image', label: '添加图片', icon: <ImageIcon />},
  {id: 'camera', label: '拍摄照片', icon: <CameraIcon />},
];

const defaultToolItems: ActionItem[] = [
  {id: 'search', label: '搜索资料', icon: <SearchIcon />},
  {id: 'code', label: '运行代码', icon: <CodeIcon />},
  {id: 'web', label: '浏览网页', icon: <GlobeIcon />},
];

export interface AgentComposerProps extends Omit<ChatComposerProps, 'variant' | 'leadingControls' | 'trailingControls'> {
  modes?: string[];
  defaultMode?: string;
  attachmentItems?: ActionItem[];
  toolItems?: ActionItem[];
  extraControls?: ReactNode;
  onAttach?: () => void;
  onAttachmentAction?: (key: string) => void;
  onToolAction?: (key: string) => void;
  onModeChange?: (mode: string) => void;
  onVoice?: () => void;
}

export function AgentComposer({modes = ['高', '标准', '快速'], defaultMode = '高', attachmentItems = defaultAttachmentItems, toolItems = defaultToolItems, extraControls, onAttach, onAttachmentAction, onToolAction, onModeChange, onVoice, ...props}: AgentComposerProps) {
  const [mode, setMode] = useState(defaultMode);
  const changeMode = (key: string) => {setMode(key); onModeChange?.(key);};
  return (
    <ChatComposer
      {...props}
      variant="agent"
      leadingControls={<>
        <MenuButton label={<PlusIcon />} ariaLabel="添加附件" buttonClassName="nacre-chat-composer__menu-trigger" buttonVariant="quiet" showChevron={false} items={attachmentItems} onAction={(key) => {onAttach?.(); onAttachmentAction?.(String(key));}} />
        <MenuButton label={<ToolIcon />} ariaLabel="添加工具" buttonClassName="nacre-chat-composer__menu-trigger" buttonVariant="quiet" showChevron={false} items={toolItems} onAction={(key) => onToolAction?.(String(key))} />
        {extraControls}
      </>}
      trailingControls={<>
        <ActionMenu label={mode} ariaLabel="Agent 思考强度" buttonClassName="nacre-chat-composer__mode" buttonVariant="quiet" items={modes.map((value) => ({id: value, label: value}))} onAction={(key) => changeMode(String(key))} />
        <button type="button" className="nacre-chat-composer__utility" aria-label="语音输入" onClick={onVoice}><MicIcon /></button>
      </>}
    />
  );
}

function PlusIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M10 3v14M3 10h14" /></svg>; }
function ToolIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.2" /><path d="m12.4 12.4 4.1 4.1" /></svg>; }
function MicIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20"><rect x="7" y="2.5" width="6" height="10" rx="3" /><path d="M4.8 9.5a5.2 5.2 0 0 0 10.4 0M10 14.7v2.8M7.5 17.5h5" /></svg>; }
function SendIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M10 16V4m0 0L5.5 8.5M10 4l4.5 4.5" /></svg>; }
function ExpandIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M8 4H4v4m8-4h4v4M8 16H4v-4m8 4h4v-4" /></svg>; }
function FileIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M5 2.5h6l4 4v11H5zM11 2.5v4h4" /></svg>; }
function ImageIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="12" rx="2" /><circle cx="7" cy="8" r="1.2" /><path d="m5 14 3.2-3 2.2 2 1.8-1.6L15 14" /></svg>; }
function CameraIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M3 7h3l1.2-2h5.6L14 7h3v9H3z" /><circle cx="10" cy="11.5" r="3" /></svg>; }
function SearchIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.2" /><path d="m12.4 12.4 4.1 4.1" /></svg>; }
function CodeIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m7 5-4 5 4 5m6-10 4 5-4 5m-3.5 1 2-12" /></svg>; }
function GlobeIcon() { return <svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" /><path d="M3 10h14M10 3c2 2 3 4.3 3 7s-1 5-3 7c-2-2-3-4.3-3-7s1-5 3-7" /></svg>; }
