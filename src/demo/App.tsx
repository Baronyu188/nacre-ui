import {useEffect, useState} from 'react';
import {motion} from 'motion/react';
import {
  Accordion,
  Avatar,
  Badge,
  BreadcrumbTrail,
  Button,
  Card,
  CardSkeleton,
  Checkbox,
  ColorPicker,
  ComboBox,
  DataTable,
  DesktopNavigation,
  EmptyState,
  Field,
  FileDrop,
  GlassGroup,
  GlassSurface,
  Hint,
  InfoPopover,
  Kbd,
  MeterBar,
  MobileNavigation,
  Notice,
  NativeDateInput,
  NotificationCenter,
  NumberInput,
  Pagination,
  PasswordField,
  Presentation,
  Progress,
  RadioCards,
  Range,
  Select,
  SearchInput,
  SegmentedControl,
  Separator,
  SettingsCard,
  Switch,
  StatusDot,
  Skeleton,
  Tags,
  Tabs,
  Toolbar,
  TextAreaField,
} from '../ui';

function SparkleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18">
      <path d="M10 1.8c.5 4.2 2.4 6.2 6.7 6.7-4.3.5-6.2 2.4-6.7 6.7-.5-4.3-2.4-6.2-6.7-6.7C7.6 8 9.5 6 10 1.8Z" fill="currentColor" />
      <path d="M16.1 13.4c.2 1.5.9 2.2 2.4 2.4-1.5.2-2.2.9-2.4 2.4-.2-1.5-.9-2.2-2.4-2.4 1.5-.2 2.2-.9 2.4-2.4Z" fill="currentColor" opacity=".55" />
    </svg>
  );
}

function MoonIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18"><path d="M16.7 12.4A6.7 6.7 0 0 1 7.6 3.3a7 7 0 1 0 9.1 9.1Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>;
}

function BellIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18"><path d="M4.8 13.8h10.4l-1.3-1.7V8a3.9 3.9 0 0 0-7.8 0v4.1l-1.3 1.7Zm3.6 2a1.8 1.8 0 0 0 3.2 0" fill="none" stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function DeviceIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="10" rx="1.5" /><path d="M1.8 15.5h16.4" /></svg>;
}

function UpdateIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M15.5 7A6.2 6.2 0 1 0 16 12.1M15.5 3.8V7h-3.2" /><circle cx="10" cy="10" r="2.1" /></svg>;
}

function StorageIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m4.2 5.2-2 4.1v5.1A1.6 1.6 0 0 0 3.8 16h12.4a1.6 1.6 0 0 0 1.6-1.6V9.3l-2-4.1H4.2Z" /><path d="M2.4 9.3h15.2M13.7 12.7h1.5" /></svg>;
}

function HomeIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m2.5 9 7.5-6 7.5 6" /><path d="M4.5 8.2V17h11V8.2M8 17v-5h4v5" /></svg>;
}

function GridIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><rect x="3" y="3" width="5" height="5" rx="1" /><rect x="12" y="3" width="5" height="5" rx="1" /><rect x="3" y="12" width="5" height="5" rx="1" /><rect x="12" y="12" width="5" height="5" rx="1" /></svg>;
}

function LibraryIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><rect x="4" y="3" width="12" height="14" rx="2" /><path d="M7 6h6M7 9h6M7 12h3" /></svg>;
}

function NetworkIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" /><path d="M3 10h14M10 3c2.2 2 3.2 4.3 3.2 7S12.2 15 10 17M10 3C7.8 5 6.8 7.3 6.8 10S7.8 15 10 17" /></svg>;
}

function SearchIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.2" /><path d="m12.4 12.4 4.1 4.1" /></svg>;
}

const densityOptions = [
  {id: 'airy', label: '宽松', description: '更舒展的空间与触摸目标'},
  {id: 'balanced', label: '均衡', description: '桌面与触摸的平衡'},
  {id: 'compact', label: '紧凑', description: '适合数据密集型界面'},
];

const componentOptions = [
  {id: 'button', label: '按钮', description: '具有磁性反馈的玻璃操作', meta: '动作'},
  {id: 'motion', label: '动效', description: '弹性与形态变化', meta: '系统'},
  {id: 'overlay', label: '浮层', description: '气泡浮层、对话框与抽屉', meta: '层级'},
  {id: 'field', label: '输入框', description: '文本与可搜索输入', meta: '表单'},
];

const workspaceRows = [
  {id: 'button', component: 'Button', family: '动作', status: '稳定', coverage: '键盘 · 触摸'},
  {id: 'combobox', component: 'ComboBox', family: '表单', status: '稳定', coverage: '搜索 · 选择'},
  {id: 'drawer', component: 'Presentation', family: '浮层', status: '待检查', coverage: '对话框 · 抽屉'},
  {id: 'table', component: 'DataTable', family: '数据', status: '新增', coverage: '排序 · 选择'},
];

const workspaceColumns = [
  {id: 'component', label: '组件', isRowHeader: true, render: (row: typeof workspaceRows[number]) => <strong>{row.component}</strong>},
  {id: 'family', label: '类别', render: (row: typeof workspaceRows[number]) => row.family},
  {id: 'status', label: '状态', render: (row: typeof workspaceRows[number]) => <Badge tone={row.status === '稳定' ? 'success' : row.status === '待检查' ? 'warning' : 'accent'}>{row.status}</Badge>},
  {id: 'coverage', label: '支持', render: (row: typeof workspaceRows[number]) => row.coverage},
];

const galleryNotifications = [
  {id: 'preview', title: '材质预览已更新', description: '新的折叠动效已经就绪。', time: '刚刚', unread: true},
  {id: 'review', title: '组件审查完成', description: '按钮与菜单共用同一圈玻璃高光。', time: '8 分钟'},
];

export function App() {
  const [dark, setDark] = useState(false);
  const [liveGlow, setLiveGlow] = useState(true);
  const [lastAction, setLastAction] = useState('尚无操作');
  const [noticeVisible, setNoticeVisible] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<string | number | null>('motion');
  const [density, setDensity] = useState('balanced');
  const [page, setPage] = useState(3);
  const [tags, setTags] = useState([{id: 'glass', label: '液态玻璃'}, {id: 'motion', label: '动效'}, {id: 'access', label: '无障碍'}, {id: 'spatial', label: '空间'}]);
  const [fileStatus, setFileStatus] = useState('未选择文件');
  const [accent, setAccent] = useState('#0a84ff');
  const [notifications, setNotifications] = useState(galleryNotifications);
  const [desktopSection, setDesktopSection] = useState('connections');
  const [mobileSection, setMobileSection] = useState('home');
  const accentNumber = Number.parseInt(accent.slice(1), 16);
  const accentRgb = `${accentNumber >> 16}, ${(accentNumber >> 8) & 255}, ${accentNumber & 255}`;
  const dismissNotification = (id: string) => setNotifications((current) => current.filter((item) => item.id !== id));

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--nacre-accent', accent);
    root.style.setProperty('--nacre-accent-rgb', accentRgb);
    return () => {
      root.style.removeProperty('--nacre-accent');
      root.style.removeProperty('--nacre-accent-rgb');
    };
  }, [accent, accentRgb]);

  return (
    <div className="demo-app" data-theme={dark ? 'dark' : 'light'}>
      <div className="demo-atmosphere" aria-hidden="true">
        <motion.div className="demo-orb demo-orb--violet" animate={{x: [0, 42, -12, 0], y: [0, -26, 18, 0]}} transition={{duration: 18, repeat: Infinity, ease: 'easeInOut'}} />
        <motion.div className="demo-orb demo-orb--aqua" animate={{x: [0, -34, 18, 0], y: [0, 30, -15, 0]}} transition={{duration: 22, repeat: Infinity, ease: 'easeInOut'}} />
        <div className="demo-grain" />
      </div>

      <GlassSurface as="header" className="demo-nav" interactive>
        <a className="demo-brand" href="#top" aria-label="Nacre UI 首页">
          <span className="demo-brand__mark"><img src="/nacre-icon.png" alt="" /></span>
          <span>Nacre</span>
        </a>
        <span className="demo-gallery-label">组件展廊</span>
        <GlassGroup>
          <ColorPicker label="主题色" value={accent} onChange={setAccent} />
          <NotificationCenter trigger={<BellIcon />} items={notifications} onDismiss={dismissNotification} />
          <Hint trigger={<MoonIcon />}>切换明暗主题</Hint>
          <Switch aria-label="深色模式" isSelected={dark} onChange={setDark} />
        </GlassGroup>
      </GlassSurface>

      <main id="top">
        <section className="demo-components" id="components" aria-label="组件展廊">
          <div className="demo-gallery-heading"><strong>组件展廊</strong><span>交互空间</span></div>
          <div className="demo-component-grid">
            <article className="demo-component-card demo-component-card--wide">
              <div className="demo-card-head"><div><span>动作</span><h3>弹性按钮</h3></div><code>Button</code></div>
              <div className="demo-stage demo-stage--color">
                <GlassGroup>
                  <Button variant="prominent"><SparkleIcon /> 创建</Button>
                  <Button>预览</Button>
                  <Button variant="quiet">取消</Button>
                </GlassGroup>
              </div>
              <p>指针靠近时轻微吸附，按下后像有弹性的胶体回弹；重点色只留给主动作。</p>
            </article>

            <article className="demo-component-card">
              <div className="demo-card-head"><div><span>选择</span><h3>流动标签页</h3></div><code>Tabs</code></div>
              <div className="demo-stage demo-tabs-stage">
                <Tabs items={[
                  {id: 'design', label: '设计', panel: <div className="demo-tab-copy"><b>12</b><span>精选表面</span></div>},
                  {id: 'motion', label: '动效', panel: <div className="demo-tab-copy"><b>8</b><span>弹性动效</span></div>},
                  {id: 'access', label: '无障碍', panel: <div className="demo-tab-copy"><b>AA</b><span>键盘就绪</span></div>},
                ]} />
              </div>
              <p>选中态不是新画一块背景，而是一团透镜在选项之间平滑游走。</p>
            </article>

            <article className="demo-component-card">
              <div className="demo-card-head"><div><span>表单</span><h3>输入框与选择</h3></div><code>Field · Select</code></div>
              <div className="demo-stage demo-form-stack">
                <Field label="项目名称" placeholder="极光工作区" description="聚焦时有一束微光经过，但不会干扰输入。" />
                <Select label="界面密度" defaultSelectedKey="balanced" options={densityOptions} />
              </div>
              <p>输入区使用稳定的内容材质；下拉菜单才从触发器上方“变厚”并展开。</p>
            </article>

            <article className="demo-component-card demo-component-card--wide">
              <div className="demo-card-head"><div><span>导航</span><h3>路径导航</h3></div><code>BreadcrumbTrail</code></div>
              <div className="demo-stage demo-navigation-stage">
                <BreadcrumbTrail items={[
                  {id: 'home', label: '工作区', href: '#components'},
                  {id: 'library', label: '组件库', href: '#components'},
                  {id: 'current', label: '动态表面'},
                ]} />
              </div>
              <p>路径保持安静，只在当前位置上增强可读性。</p>
            </article>

            <article className="demo-component-card demo-component-card--wide">
              <div className="demo-card-head"><div><span>导航</span><h3>电脑端与移动端导航</h3></div><code>DesktopNavigation · MobileNavigation</code></div>
              <div className="demo-stage demo-navigation-standards">
                <section className="demo-desktop-navigation-space" aria-label="电脑端导航示例">
                  <DesktopNavigation title="工作空间" ariaLabel="电脑端主导航" selectedKey={desktopSection} onSelectionChange={setDesktopSection} items={[
                    {id: 'connections', label: '所有连接', icon: <DeviceIcon />},
                    {id: 'network', label: '网络', icon: <NetworkIcon />},
                    {id: 'library', label: '资源库', icon: <LibraryIcon />},
                  ]} />
                  <div className="demo-desktop-navigation-content"><small>当前空间</small><strong>{desktopSection === 'connections' ? '所有连接' : desktopSection === 'network' ? '网络' : '资源库'}</strong><span /></div>
                </section>
                <section className="demo-mobile-navigation-space" aria-label="移动端导航示例">
                  <MobileNavigation ariaLabel="移动端主导航" selectedKey={mobileSection} onSelectionChange={setMobileSection} action={{label: '搜索', icon: <SearchIcon />, onPress: () => setLastAction('搜索')}} items={[
                    {id: 'home', label: '首页', icon: <HomeIcon />},
                    {id: 'new', label: '新建', icon: <GridIcon />},
                    {id: 'library', label: '资料库', icon: <LibraryIcon />},
                  ]} />
                </section>
              </div>
            </article>

            <article className="demo-component-card">
              <div className="demo-card-head"><div><span>查找</span><h3>可搜索选择</h3></div><code>ComboBox</code></div>
              <div className="demo-stage demo-form-stack">
                <ComboBox label="跳转到组件" placeholder="搜索组件…" value={selectedComponent} onChange={(key) => setSelectedComponent(key)} options={componentOptions} description="输入、方向键和触摸都使用同一选择模型。" />
                <small className="demo-action-result">已选项目 · {String(selectedComponent)}</small>
              </div>
              <p>输入框留在内容层；只有筛选后的结果面板浮起成为玻璃。</p>
            </article>

            <article className="demo-component-card">
              <div className="demo-card-head"><div><span>结构</span><h3>流动折叠</h3></div><code>Accordion</code></div>
              <div className="demo-stage">
                <Accordion defaultExpandedKeys={['material']} allowsMultipleExpanded={false} items={[
                  {id: 'material', eyebrow: '层级 01', title: '材质表现', content: '常规玻璃会适应周围内容，稳定表面则保持平静易读。'},
                  {id: 'motion', eyebrow: '层级 02', title: '动效语言', content: '展开时保留源形状，并用弹性时序维持空间连续性。'},
                  {id: 'access', eyebrow: '层级 03', title: '无障碍', content: '键盘焦点、语义状态和减少动效都是组件规范的一部分。'},
                ]} />
              </div>
              <p>折叠内容属于实体信息区，打开与关闭只用轻量空间变化，不额外铺玻璃。</p>
            </article>

            <article className="demo-component-card">
              <div className="demo-card-head"><div><span>控件</span><h3>弹性控件</h3></div><code>Switch · Range</code></div>
              <div className="demo-stage demo-form-stack">
                <Switch isSelected={liveGlow} onChange={setLiveGlow}>实时光效</Switch>
                <Checkbox defaultSelected>减少视觉噪音</Checkbox>
                <Range label="材质清晰度" defaultValue={68} minValue={0} maxValue={100} />
              </div>
              <p>玻璃拇指只在互动中增强；拖动滑杆时会沿运动方向拉伸。</p>
            </article>

            <article className="demo-component-card demo-component-card--wide">
              <div className="demo-card-head"><div><span>浮层</span><h3>空间展示</h3></div><code>Popover · Dialog · Drawer</code></div>
              <div className={`demo-stage demo-stage--scene ${liveGlow ? 'is-live' : ''}`}>
                <div className="demo-stage-orb" />
                <GlassGroup>
                  <InfoPopover trigger="快速查看"><strong>同一个触发点自然膨胀。</strong><br />浮层越大，材质更厚，阴影与散射也更明显。</InfoPopover>
                  <Presentation trigger="打开对话框" title="更厚的玻璃面">
                    <p>对话框从轻量按钮展开成更厚的材质，并保持空间来源清晰。点击背景或关闭按钮即可返回。</p>
                    <Button variant="prominent">继续</Button>
                  </Presentation>
                  <Presentation kind="drawer" trigger="显示抽屉" title="悬浮检查器">
                    <p>抽屉与窗口边缘留出呼吸空间，既有浮动感，又不会遮断对主内容的感知。</p>
                    <div className="demo-drawer-options">
                      <Switch defaultSelected>光效跟随指针</Switch>
                      <Checkbox defaultSelected>同心圆角</Checkbox>
                      <Range label="折射强度" defaultValue={54} minValue={0} maxValue={100} />
                    </div>
                  </Presentation>
                </GlassGroup>
              </div>
              <p>气泡浮层、对话框和抽屉都保留触发来源，尺寸越大材质越稳、越厚。</p>
            </article>

            <article className="demo-component-card demo-component-card--wide">
              <div className="demo-card-head"><div><span>反馈</span><h3>轻量系统反馈</h3></div><code>Progress · MeterBar · Notice · NotificationCenter · Skeleton</code></div>
              <div className="demo-stage demo-feedback-grid">
                <div className="demo-feedback-stack">
                  <div className="demo-badge-row"><Badge>草稿</Badge><Badge tone="accent">实时</Badge><Badge tone="success">正常</Badge><Badge tone="warning">待检查</Badge></div>
                  <Progress label="正在渲染材质" value={72} />
                  <MeterBar label="对比度状态" value={86} tone="success" />
                  {noticeVisible ? (
                    <Notice title="预览已更新" tone="success" onDismiss={() => setNoticeVisible(false)}>所有交互状态已就绪。</Notice>
                  ) : (
                    <Button onPress={() => setNoticeVisible(true)}>恢复通知</Button>
                  )}
                  <div><NotificationCenter items={notifications} onDismiss={dismissNotification} /></div>
                </div>
                <div className="demo-skeleton-card">
                  <Skeleton width={46} height={46} radius={15} />
                  <div><Skeleton width="64%" height={13} /><Skeleton width="88%" height={10} /><Skeleton width="72%" height={10} /></div>
                </div>
              </div>
              <p>反馈组件减少无意义装饰：颜色表达状态，运动只负责说明“正在变化”。</p>
            </article>

            <article className="demo-component-card demo-component-card--wide">
              <div className="demo-card-head"><div><span>数据</span><h3>结构化内容</h3></div><code>DataTable</code></div>
              <div className="demo-stage demo-table-stage">
                <DataTable aria-label="组件就绪情况" selectionMode="single" columns={workspaceColumns} rows={workspaceRows} />
              </div>
              <p>数据留在稳定表面；悬停、选择和键盘焦点才短暂产生光层，移动端保留横向阅读。</p>
            </article>

            <article className="demo-component-card demo-component-card--wide">
              <div className="demo-card-head"><div><span>卡片</span><h3>卡片预设与加载骨架</h3></div><code>Card · CardSkeleton</code></div>
              <div className="demo-stage demo-card-presets">
                <div className="demo-card-preset-pair"><Card preset="content" eyebrow="内容卡" title="流动表面系统" description="适合文字摘要与一个轻量操作。" footer={<Button variant="quiet" magnetic={false}>查看详情</Button>} /><CardSkeleton preset="content" /></div>
                <div className="demo-card-preset-pair"><Card preset="metric" eyebrow="数据卡" value="84%" title="组件就绪度" description="轻量指标与辅助说明。" /><CardSkeleton preset="metric" /></div>
                <div className="demo-card-preset-pair"><Card preset="media" eyebrow="媒体卡" title="雾中山湖" description="图片与信息保持清晰分层。" media={<span className="demo-card-media" />} /><CardSkeleton preset="media" /></div>
              </div>
            </article>

            <article className="demo-component-card demo-component-card--wide">
              <div className="demo-card-head"><div><span>设置</span><h3>分组设置卡片</h3></div><code>SettingsCard</code></div>
              <div className="demo-stage demo-settings-grid">
                <SettingsCard ariaLabel="设备设置" items={[
                  {id: 'about', label: '关于本机', icon: <DeviceIcon />, onPress: () => setLastAction('关于本机')},
                  {id: 'update', label: '软件更新', icon: <UpdateIcon />, onPress: () => setLastAction('软件更新')},
                  {id: 'storage', label: '储存空间', icon: <StorageIcon />, onPress: () => setLastAction('储存空间')},
                ]} />
                <div className="demo-settings-stack">
                  <SettingsCard ariaLabel="时间设置" items={[
                    {id: 'automatic-time', label: '自动设定时间与日期', control: <Switch aria-label="自动设定时间与日期" defaultSelected />},
                    {id: 'source', label: '来源', value: 'Apple (time.apple.com.)', control: <Button variant="quiet" magnetic={false}>设定…</Button>},
                  ]} />
                  <SettingsCard ariaLabel="日期格式" items={[
                    {id: 'date', label: '日期和时间', value: '2026年8月25日 21:32'},
                    {id: 'clock', label: '24小时制', control: <Switch aria-label="24小时制" defaultSelected />},
                  ]} />
                </div>
              </div>
            </article>

            <article className="demo-component-card demo-component-card--wide">
              <div className="demo-card-head"><div><span>高级表单</span><h3>选择与精度</h3></div><code>RadioCards · NumberInput</code></div>
              <div className="demo-stage demo-advanced-form-grid">
                <RadioCards label="界面密度" value={density} onChange={setDensity} options={[
                  {value: 'airy', label: '宽松', description: '优先照顾触摸的间距'},
                  {value: 'balanced', label: '均衡', description: '平静的默认值'},
                  {value: 'compact', label: '紧凑', description: '密集信息'},
                ]} />
                <NumberInput label="圆角半径" defaultValue={24} minValue={8} maxValue={48} step={2} description="使用原生的本地化数值编辑。" />
              </div>
              <p>卡片式单选强化空间选择，数值控件仍使用可读的实体输入面，只把步进反馈做得灵动。</p>
            </article>

            <article className="demo-component-card demo-component-card--wide">
              <div className="demo-card-head"><div><span>应用界面</span><h3>工具与元数据</h3></div><code>Toolbar · Tags</code></div>
              <div className="demo-stage demo-application-grid">
                <Toolbar aria-label="画布工具">
                  <Button variant="quiet" magnetic={false} onPress={() => setLastAction('选择')}>选择</Button>
                  <Button variant="quiet" magnetic={false} onPress={() => setLastAction('移动')}>移动</Button>
                  <Button variant="prominent" magnetic={false} onPress={() => setLastAction('呈现')}>呈现</Button>
                </Toolbar>
                <Tags label="表面特性" items={tags} onRemove={(keys) => setTags((items) => items.filter((item) => !keys.has(item.id)))} />
                <small className="demo-action-result">工具 · {lastAction}</small>
              </div>
              <p>工具栏作为轻量功能层悬浮；标签属于内容元数据，保持安静，只有移除动作会发亮。</p>
            </article>

            <article className="demo-component-card">
              <div className="demo-card-head"><div><span>导航</span><h3>紧凑分页</h3></div><code>Pagination</code></div>
              <div className="demo-stage demo-centered-stage">
                <Pagination page={page} totalPages={12} onChange={setPage} label="组件库分页" />
              </div>
              <p>上一页、当前页与下一页已覆盖核心任务；大量页码交给页面本身显示，控件不制造噪音。</p>
            </article>

            <article className="demo-component-card">
              <div className="demo-card-head"><div><span>文件</span><h3>拖放与选择</h3></div><code>FileDrop</code></div>
              <div className="demo-stage demo-file-stage">
                <FileDrop aria-label="导入设计素材" label="拖放设计素材" description="SVG、PNG 或 JSON · 上限取决于应用" acceptedFileTypes={['image/svg+xml', 'image/png', 'application/json']} allowsMultiple onSelect={(files) => setFileStatus(files?.length ? `已准备 ${files.length} 个文件` : '未选择文件')} />
                <small className="demo-action-result">{fileStatus}</small>
              </div>
              <p>文件区域保持清晰，只有拖入与聚焦时才形成一圈更厚的玻璃边缘。</p>
            </article>

            <article className="demo-component-card demo-component-card--wide">
              <div className="demo-card-head"><div><span>输入组件</span><h3>精致输入控件</h3></div><code>Date · Search · Password · TextArea</code></div>
              <div className="demo-stage demo-input-suite">
                <NativeDateInput label="检查日期" type="date" defaultValue="2026-08-28" description="支持键盘、触摸与本地化日期输入。" />
                <PasswordField label="访问密钥" defaultValue="nacre-demo" description="切换可见性时不替换输入框。" />
                <SearchInput label="筛选令牌" defaultValue="玻璃" description="按 Escape 可重置查询。" />
                <TextAreaField label="设计备注" defaultValue="玻璃属于控件与临时浮层。" description="尺寸调整交给浏览器。" />
              </div>
              <p>日期弹层、搜索、密码和长文本保持同一输入层级，并保留完整键盘操作。</p>
            </article>

            <article className="demo-component-card">
              <div className="demo-card-head"><div><span>视图选项</span><h3>分段模式</h3></div><code>SegmentedControl</code></div>
              <div className="demo-stage demo-content-sample">
                <SegmentedControl ariaLabel="组件库视图" selectionMode="single" defaultSelectedKeys={['grid']} options={[
                  {id: 'list', label: '列表'},
                  {id: 'grid', label: '网格'},
                  {id: 'space', label: '空间'},
                ]} />
                <Separator />
                <div className="demo-presence-row">
                  <Avatar name="Mira Chen" initials="MC" status="online" />
                  <div><strong>Mira Chen</strong><StatusDot tone="success" label="正在编辑" /></div>
                  <Kbd>⌘ K</Kbd>
                </div>
              </div>
              <p>分段控件适合少量互斥视图；成员状态与快捷键保持轻量，不把元数据做成大按钮。</p>
            </article>

            <article className="demo-component-card">
              <div className="demo-card-head"><div><span>空状态</span><h3>清晰的下一步</h3></div><code>EmptyState</code></div>
              <div className="demo-stage demo-empty-stage">
                <EmptyState title="没有固定的表面" action={<Button variant="prominent">固定表面</Button>}>将常用控件放在手边，不占满整个工作区。</EmptyState>
              </div>
              <p>空状态只解释发生了什么并给出一个下一步，图形是空间锚点，不是装饰插画。</p>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
