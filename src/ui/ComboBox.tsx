import {
  ComboBox as AriaComboBox,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Text,
  type ComboBoxProps as AriaComboBoxProps,
} from 'react-aria-components';
import {motion} from 'motion/react';
import {useId} from 'react';
import {LiquidGlassFilter, useLiquidGlassFilter, useLiquidPopoverMorph} from './LiquidGlass';
import {GlassAutoRim} from './Glass';

export interface ComboOption {
  id: string;
  label: string;
  description?: string;
  meta?: string;
}

export interface ComboBoxProps extends Omit<AriaComboBoxProps<ComboOption>, 'children' | 'className' | 'items' | 'defaultItems'> {
  label: string;
  options: ComboOption[];
  description?: string;
  placeholder?: string;
  matchTriggerWidth?: boolean;
}

export function ComboBox({label, options, description, placeholder, matchTriggerWidth = true, ...props}: ComboBoxProps) {
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  const trackId = useId();
  return (
    <AriaComboBox {...props} className="nacre-combobox" defaultItems={options}>
      <Label>{label}</Label>
      <div className="nacre-combobox__shell">
        <svg aria-hidden="true" viewBox="0 0 18 18" width="17" height="17">
          <circle cx="8" cy="8" r="4.8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="m11.6 11.6 3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <Input placeholder={placeholder} />
      </div>
      {description && <Text slot="description">{description}</Text>}
      <Popover ref={morph.ref} className="nacre-popover nacre-combobox__popover" data-liquid data-match-trigger-width={matchTriggerWidth || undefined} placement="bottom start" offset={8} containerPadding={12} shouldFlip style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
        <GlassAutoRim />
        <LiquidGlassFilter id={liquid.id} />
        <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
        <ListBox<ComboOption> className="nacre-listbox">
          {(item) => (
            <ListBoxItem id={item.id} textValue={item.label} className="nacre-listbox__item nacre-combo-option">
              {({isFocused}) => <>
                {isFocused && <motion.span layoutId={trackId} className="nacre-listbox__track" transition={{type: 'spring', stiffness: 320, damping: 30, mass: .7}} />}
                <span>{item.label}</span>
              </>}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </AriaComboBox>
  );
}
