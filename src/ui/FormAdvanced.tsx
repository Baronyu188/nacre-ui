import {
  Button as AriaButton,
  Group,
  Input,
  Label,
  NumberField as AriaNumberField,
  Radio,
  RadioGroup,
  Tag,
  TagGroup,
  TagList,
  Text,
  type NumberFieldProps,
  type RadioGroupProps,
  type TagGroupProps,
} from 'react-aria-components';
import {CloseIcon} from './Button';

export interface RadioCardOption {
  value: string;
  label: string;
  description?: string;
}

export interface RadioCardsProps extends Omit<RadioGroupProps, 'children' | 'className' | 'label'> {
  label: string;
  options: RadioCardOption[];
}

export function RadioCards({label, options, ...props}: RadioCardsProps) {
  return (
    <RadioGroup {...props} className="nacre-radio-group">
      <Label>{label}</Label>
      <div className="nacre-radio-cards">
        {options.map((option) => (
          <Radio key={option.value} value={option.value} className="nacre-radio-card">
            <span className="nacre-radio-card__control"><span /></span>
            <span><strong>{option.label}</strong>{option.description && <small>{option.description}</small>}</span>
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
}

export interface NumberInputProps extends Omit<NumberFieldProps, 'children' | 'className' | 'label'> {
  label: string;
  description?: string;
}

export function NumberInput({label, description, ...props}: NumberInputProps) {
  return (
    <AriaNumberField {...props} className="nacre-number-field">
      <Label>{label}</Label>
      <Group className="nacre-number-field__group">
        <AriaButton slot="decrement" aria-label={`减少${label}`}>−</AriaButton>
        <Input />
        <AriaButton slot="increment" aria-label={`增加${label}`}>+</AriaButton>
      </Group>
      {description && <Text slot="description">{description}</Text>}
    </AriaNumberField>
  );
}

export interface TagItem {
  id: string;
  label: string;
}

export interface TagsProps extends Omit<TagGroupProps, 'children' | 'className' | 'label'> {
  label: string;
  items: TagItem[];
}

export function Tags({label, items, ...props}: TagsProps) {
  return (
    <TagGroup {...props} className="nacre-tag-group">
      <Label>{label}</Label>
      <TagList items={items} className="nacre-tag-list">
        {(item) => (
          <Tag id={item.id} textValue={item.label} className="nacre-tag">
            {({allowsRemoving}) => <>{item.label}{allowsRemoving && <AriaButton slot="remove" aria-label={`移除${item.label}`}><CloseIcon /></AriaButton>}</>}
          </Tag>
        )}
      </TagList>
    </TagGroup>
  );
}
