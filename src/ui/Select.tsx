import {
  Button as AriaButton,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
  Text,
  type SelectProps as AriaSelectProps,
} from 'react-aria-components';
import {motion} from 'motion/react';
import {useId} from 'react';
import {LiquidGlassFilter, useLiquidGlassFilter, useLiquidPopoverMorph} from './LiquidGlass';

export interface SelectOption {
  id: string;
  label: string;
  description?: string;
}

export interface SelectProps extends Omit<AriaSelectProps<object>, 'children' | 'className'> {
  label: string;
  options: SelectOption[];
  description?: string;
}

export function Select({label, options, description, ...props}: SelectProps) {
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  const trackId = useId();
  return (
    <AriaSelect {...props} className="nacre-select">
      <Label>{label}</Label>
      <AriaButton className="nacre-select__trigger">
        <SelectValue>{({selectedText, defaultChildren}) => selectedText ?? defaultChildren}</SelectValue>
        <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
          <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </AriaButton>
      {description && <Text slot="description">{description}</Text>}
      <Popover ref={morph.ref} className="nacre-popover nacre-select__popover" data-liquid offset={8} style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
        <LiquidGlassFilter id={liquid.id} />
        <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
        <ListBox className="nacre-listbox" items={options}>
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.label} className="nacre-listbox__item">
              {({isFocused}) => <>
                {isFocused && <motion.span layoutId={trackId} className="nacre-listbox__track" transition={{type: 'spring', stiffness: 320, damping: 30, mass: .7}} />}
                <span>{item.label}</span>
                <svg className="nacre-checkmark" aria-hidden="true" viewBox="0 0 16 16" width="16" height="16">
                  <path d="m3 8.4 3.1 3.1L13 4.8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </>}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
