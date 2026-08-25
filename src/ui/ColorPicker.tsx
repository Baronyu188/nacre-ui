import {type InputHTMLAttributes} from 'react';
import {Button as AriaButton, Dialog, DialogTrigger, Popover} from 'react-aria-components';
import {Button} from './Button';
import {LiquidGlassFilter, useLiquidGlassFilter, useLiquidPopoverMorph} from './LiquidGlass';

const defaultColors = ['#0a84ff', '#007aff', '#1f6feb', '#18a0fb', '#00a7c4', '#16a085', '#21a366', '#e38b24', '#dc3f55'];

export interface ColorPickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  colors?: string[];
}

export function ColorPicker({label, value, onChange, colors = defaultColors, disabled, ...props}: ColorPickerProps) {
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();

  return (
    <DialogTrigger>
      <Button className="nacre-color-picker__trigger" aria-label={label} isDisabled={disabled} magnetic={false}>
        <span className="nacre-color-picker__swatch" style={{backgroundColor: value}} />
      </Button>
      <Popover
        ref={morph.ref}
        className="nacre-popover nacre-menu-popover nacre-color-picker__popover"
        placement="bottom end"
        data-liquid
        offset={8}
        style={liquid.style}
        onPointerMove={morph.onPointerMove}
        onPointerLeave={morph.onPointerLeave}
      >
        <LiquidGlassFilter id={liquid.id} />
        <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
        <Dialog className="nacre-color-picker__panel">
          <strong>{label}</strong>
          <div className="nacre-color-picker__grid">
            {colors.map((color) => (
              <AriaButton
                key={color}
                className="nacre-color-picker__option"
                aria-label={`选择颜色 ${color}`}
                data-selected={value.toLowerCase() === color.toLowerCase() || undefined}
                style={{backgroundColor: color}}
                onPress={() => onChange(color)}
              />
            ))}
          </div>
          <label className="nacre-color-picker__custom">
            <span>自定义颜色</span>
            <input {...props} type="color" aria-label={`${label}自定义颜色`} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} />
          </label>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
