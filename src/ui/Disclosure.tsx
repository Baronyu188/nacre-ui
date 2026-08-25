import {type ReactNode} from 'react';
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
  type DisclosureGroupProps,
} from 'react-aria-components';

export interface AccordionItem {
  id: string;
  title: string;
  eyebrow?: string;
  content: ReactNode;
}

export interface AccordionProps extends Omit<DisclosureGroupProps, 'children' | 'className'> {
  items: AccordionItem[];
}

export function Accordion({items, ...props}: AccordionProps) {
  return (
    <DisclosureGroup {...props} className="nacre-accordion">
      {items.map((item) => (
        <Disclosure key={item.id} id={item.id} className="nacre-disclosure">
          <Heading>
            <AriaButton slot="trigger" className="nacre-disclosure__trigger">
              <span>
                {item.eyebrow && <small>{item.eyebrow}</small>}
                <strong>{item.title}</strong>
              </span>
              <svg aria-hidden="true" viewBox="0 0 18 18" width="18" height="18">
                <path d="M9 4v10M4 9h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </AriaButton>
          </Heading>
          <DisclosurePanel className="nacre-disclosure__panel">{item.content}</DisclosurePanel>
        </Disclosure>
      ))}
    </DisclosureGroup>
  );
}
