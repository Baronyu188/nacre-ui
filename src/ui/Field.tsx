import {
  Button as AriaButton,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput as AriaDateInput,
  DatePicker as AriaDatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Input,
  Label,
  Popover,
  SearchField as AriaSearchField,
  Text,
  TextArea,
  TextField,
  type DatePickerProps,
  type SearchFieldProps,
  type TextFieldProps,
} from 'react-aria-components';
import {parseDate, type CalendarDate} from '@internationalized/date';
import {useState} from 'react';
import {LiquidGlassFilter, useLiquidGlassFilter, useLiquidPopoverMorph} from './LiquidGlass';

export interface FieldProps extends Omit<TextFieldProps, 'children' | 'className'> {
  label: string;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
}

export function Field({label, description, errorMessage, placeholder, ...props}: FieldProps) {
  return (
    <TextField {...props} className="nacre-field">
      <Label>{label}</Label>
      <div className="nacre-input-shell">
        <Input placeholder={placeholder} />
        <span className="nacre-input-light" aria-hidden="true" />
      </div>
      {description && <Text slot="description">{description}</Text>}
      <Text slot="errorMessage">{errorMessage}</Text>
    </TextField>
  );
}

export interface TextAreaFieldProps extends Omit<FieldProps, 'placeholder'> {
  placeholder?: string;
  rows?: number;
}

export function TextAreaField({label, description, errorMessage, placeholder, rows = 4, ...props}: TextAreaFieldProps) {
  return (
    <TextField {...props} className="nacre-field">
      <Label>{label}</Label>
      <div className="nacre-textarea-shell"><TextArea placeholder={placeholder} rows={rows} /></div>
      {description && <Text slot="description">{description}</Text>}
      <Text slot="errorMessage">{errorMessage}</Text>
    </TextField>
  );
}

export interface NativeDateInputProps extends Omit<DatePickerProps<CalendarDate>, 'children' | 'className' | 'defaultValue'> {
  label: string;
  description?: string;
  errorMessage?: string;
  defaultValue?: string;
  type?: 'date';
}

export function NativeDateInput({label, description, errorMessage, defaultValue, type: _type, ...props}: NativeDateInputProps) {
  const liquid = useLiquidGlassFilter();
  const morph = useLiquidPopoverMorph();
  return (
    <AriaDatePicker {...props} defaultValue={defaultValue ? parseDate(defaultValue) : undefined} className="nacre-date-picker">
      <Label>{label}</Label>
      <Group className="nacre-date-picker__group">
        <AriaDateInput className="nacre-date-input">{(segment) => <DateSegment segment={segment} className="nacre-date-segment" />}</AriaDateInput>
        <AriaButton aria-label="打开日历" className="nacre-date-picker__trigger">
          <svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17"><rect x="3" y="4.5" width="14" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M6.5 2.8v3M13.5 2.8v3M3.5 8h13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </AriaButton>
      </Group>
      {description && <Text slot="description">{description}</Text>}
      <Text slot="errorMessage">{errorMessage}</Text>
      <Popover ref={morph.ref} className="nacre-popover nacre-menu-popover nacre-calendar-popover" data-liquid placement="bottom end" offset={10} style={liquid.style} onPointerMove={morph.onPointerMove} onPointerLeave={morph.onPointerLeave}>
        <LiquidGlassFilter id={liquid.id} />
        <span className="nacre-liquid-glass__refraction" aria-hidden="true" />
        <Dialog className="nacre-calendar-dialog">
          <Calendar className="nacre-calendar">
            <header className="nacre-calendar__head">
              <AriaButton slot="previous" aria-label="上个月"><svg aria-hidden="true" viewBox="0 0 20 20"><path d="m12.5 4.5-5.5 5.5 5.5 5.5" /></svg></AriaButton>
              <Heading />
              <AriaButton slot="next" aria-label="下个月"><svg aria-hidden="true" viewBox="0 0 20 20"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" /></svg></AriaButton>
            </header>
            <CalendarGrid className="nacre-calendar__grid">
              <CalendarGridHeader>{(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}</CalendarGridHeader>
              <CalendarGridBody>{(date) => <CalendarCell date={date} className="nacre-calendar__cell" />}</CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </AriaDatePicker>
  );
}

export interface PasswordFieldProps extends FieldProps {
  showLabel?: string;
  hideLabel?: string;
}

export function PasswordField({label, description, errorMessage, placeholder, showLabel = '显示密码', hideLabel = '隐藏密码', ...props}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField {...props} className="nacre-field">
      <Label>{label}</Label>
      <div className="nacre-input-shell nacre-input-shell--action">
        <Input type={visible ? 'text' : 'password'} placeholder={placeholder} />
        <AriaButton aria-label={visible ? hideLabel : showLabel} onPress={() => setVisible((value) => !value)}>
          {visible
            ? <svg aria-hidden="true" viewBox="0 0 24 24"><path d="m4 4 16 16M10.6 10.7a2 2 0 0 0 2.7 2.7M9.8 5.3A10.5 10.5 0 0 1 12 5c5.2 0 8.5 5 8.5 5a15.3 15.3 0 0 1-2.6 3.1M6.1 6.8C4.4 8 3.5 10 3.5 10s3.3 5 8.5 5c.8 0 1.6-.1 2.3-.3" /></svg>
            : <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3.5 12s3.3-5 8.5-5 8.5 5 8.5 5-3.3 5-8.5 5-8.5-5-8.5-5Z" /><circle cx="12" cy="12" r="2.4" /></svg>}
        </AriaButton>
        <span className="nacre-input-light" aria-hidden="true" />
      </div>
      {description && <Text slot="description">{description}</Text>}
      <Text slot="errorMessage">{errorMessage}</Text>
    </TextField>
  );
}

export interface SearchInputProps extends Omit<SearchFieldProps, 'children' | 'className' | 'label'> {
  label: string;
  placeholder?: string;
  description?: string;
}

export function SearchInput({label, placeholder, description, ...props}: SearchInputProps) {
  return (
    <AriaSearchField {...props} className="nacre-search-field">
      <Label>{label}</Label>
      <div className="nacre-search-field__shell">
        <svg aria-hidden="true" viewBox="0 0 20 20" width="17" height="17"><circle cx="8.5" cy="8.5" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="m12.2 12.2 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        <Input placeholder={placeholder} />
      </div>
      {description && <Text slot="description">{description}</Text>}
    </AriaSearchField>
  );
}
