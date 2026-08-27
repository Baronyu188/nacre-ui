import {
  Checkbox as AriaCheckbox,
  Label,
  Slider as AriaSlider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  Switch as AriaSwitch,
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
  type CheckboxProps,
  type SliderProps,
  type SwitchProps,
  type ToggleButtonGroupProps as AriaToggleButtonGroupProps,
  type ToggleButtonProps as AriaToggleButtonProps,
} from 'react-aria-components';
import {type ReactNode} from 'react';
import {GlassAutoRim} from './Glass';

export interface NacreSwitchProps extends Omit<SwitchProps, 'children' | 'className'> {
  children?: ReactNode;
}

export function Switch({children, ...props}: NacreSwitchProps) {
  return (
    <AriaSwitch {...props} className="nacre-switch">
      <span className="nacre-switch__track"><span className="nacre-switch__thumb" /></span>
      <span>{children}</span>
    </AriaSwitch>
  );
}

export interface NacreCheckboxProps extends Omit<CheckboxProps, 'children' | 'className'> {
  children?: ReactNode;
}

export function Checkbox({children, ...props}: NacreCheckboxProps) {
  return (
    <AriaCheckbox {...props} className="nacre-checkbox">
      <span className="nacre-checkbox__box">
        <svg aria-hidden="true" viewBox="0 0 16 16" width="14" height="14">
          <path d="m3 8.2 3 3.1 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span>{children}</span>
    </AriaCheckbox>
  );
}

export interface RangeProps extends Omit<SliderProps<number | number[]>, 'children' | 'className'> {
  label: string;
}

export function Range({label, ...props}: RangeProps) {
  return (
    <AriaSlider {...props} className="nacre-slider">
      <div className="nacre-slider__head">
        <Label>{label}</Label>
        <SliderOutput>{({state}) => `${state.getThumbValueLabel(0)}`}</SliderOutput>
      </div>
      <SliderTrack className="nacre-slider__track">
        {({state}) => (
          <>
            <span className="nacre-slider__fill" style={{width: `${state.getThumbPercent(0) * 100}%`}} />
            <SliderThumb className="nacre-slider__thumb" />
          </>
        )}
      </SliderTrack>
    </AriaSlider>
  );
}

export interface SegmentedOption {
  id: string;
  label: ReactNode;
}

export interface SegmentedControlProps extends Omit<AriaToggleButtonGroupProps, 'children' | 'className'> {
  options: SegmentedOption[];
  ariaLabel: string;
}

export function SegmentedControl({options, ariaLabel, ...props}: SegmentedControlProps) {
  return (
    <AriaToggleButtonGroup {...props} aria-label={ariaLabel} className="nacre-segmented">
      <GlassAutoRim />
      {options.map((option) => <AriaToggleButton key={option.id} id={option.id}><span className="nacre-segmented__label">{option.label}</span></AriaToggleButton>)}
    </AriaToggleButtonGroup>
  );
}

export interface ToggleButtonProps extends Omit<AriaToggleButtonProps, 'children' | 'className'> {
  children?: ReactNode;
  icon?: ReactNode;
  className?: string;
  selectionVariant?: 'neutral' | 'accent';
}

export function ToggleButton({children, icon, className = '', selectionVariant = 'neutral', ...props}: ToggleButtonProps) {
  return (
    <AriaToggleButton {...props} className={`nacre-button nacre-toggle-button ${className}`.trim()} data-variant="glass" data-selection-variant={selectionVariant}>
      <GlassAutoRim />
      <span className="nacre-button__label">{icon}{children}</span>
    </AriaToggleButton>
  );
}

export interface ToggleButtonGroupProps extends Omit<AriaToggleButtonGroupProps, 'children' | 'className'> {
  children: ReactNode;
  className?: string;
  selectionVariant?: 'neutral' | 'accent';
}

export function ToggleButtonGroup({children, className = '', selectionVariant = 'neutral', ...props}: ToggleButtonGroupProps) {
  return <AriaToggleButtonGroup {...props} className={`nacre-toggle-button-group ${className}`.trim()} data-selection-variant={selectionVariant}>{children}</AriaToggleButtonGroup>;
}
