import {useId, type ReactNode} from 'react';
import {motion} from 'motion/react';
import {
  Tab,
  TabList,
  TabPanel,
  Tabs as AriaTabs,
  type TabsProps as AriaTabsProps,
} from 'react-aria-components';
import {GlassAutoRim} from './Glass';

export interface TabItem {
  id: string;
  label: string;
  panel: ReactNode;
}

export interface TabsProps extends Omit<AriaTabsProps, 'children' | 'className'> {
  items: TabItem[];
}

export function Tabs({items, ...props}: TabsProps) {
  const layoutId = useId();
  return (
    <AriaTabs {...props} className="nacre-tabs">
      <div className="nacre-tablist-shell">
        <GlassAutoRim />
        <TabList className="nacre-tablist" items={items}>
          {(item) => (
            <Tab id={item.id} className="nacre-tab">
              {({isSelected}) => (
                <>
                  {isSelected && (
                    <motion.span layoutId={layoutId} className="nacre-tab__lens" transition={{type: 'spring', stiffness: 310, damping: 21, mass: .72}}>
                      <span className="nacre-tab__jelly" />
                    </motion.span>
                  )}
                  <span className="nacre-tab__label">{item.label}</span>
                </>
              )}
            </Tab>
          )}
        </TabList>
      </div>
      {items.map((item) => <TabPanel key={item.id} id={item.id} className="nacre-tabpanel">{item.panel}</TabPanel>)}
    </AriaTabs>
  );
}
