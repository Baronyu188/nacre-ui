import {useState, type ReactNode} from 'react';
import {Button} from './Button';

export interface StepperItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  content?: ReactNode;
  isDisabled?: boolean;
}

export interface StepperProps {
  items: StepperItem[];
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string) => void;
  previousLabel?: string;
  nextLabel?: string;
  jumpToEndLabel?: string;
  ariaLabel?: string;
}

function BackIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m12.5 4.5-5.5 5.5 5.5 5.5" /></svg>;
}

function NextIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" /></svg>;
}

function CheckIcon() {
  return <svg aria-hidden="true" viewBox="0 0 20 20"><path d="m4.5 10.2 3.4 3.4 7.6-7.4" /></svg>;
}

export function Stepper({
  items,
  selectedKey,
  defaultSelectedKey,
  onSelectionChange,
  previousLabel = '上一步',
  nextLabel = '下一步',
  jumpToEndLabel = '跳至最后',
  ariaLabel = '流程步骤',
}: StepperProps) {
  const [internalKey, setInternalKey] = useState(defaultSelectedKey ?? items[0]?.id ?? '');
  const currentKey = selectedKey ?? internalKey;
  const currentIndex = Math.max(0, items.findIndex((item) => item.id === currentKey));
  const currentItem = items[currentIndex];

  function select(key: string | undefined) {
    if (!key) return;
    const item = items.find((candidate) => candidate.id === key);
    if (!item || item.isDisabled) return;
    if (selectedKey === undefined) setInternalKey(key);
    onSelectionChange?.(key);
  }

  return (
    <section className="nacre-stepper" aria-label={ariaLabel}>
      <ol className="nacre-stepper__track">
        {items.map((item, index) => {
          const state = index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming';
          return (
            <li key={item.id} className="nacre-stepper__step" data-state={state}>
              <Button
                className="nacre-stepper__step-button"
                variant={state === 'current' ? 'prominent' : 'glass'}
                magnetic={false}
                isDisabled={item.isDisabled}
                aria-current={state === 'current' ? 'step' : undefined}
                onPress={() => select(item.id)}
              >
                <span className="nacre-stepper__marker">{state === 'complete' ? <CheckIcon /> : index + 1}</span>
                <span className="nacre-stepper__label"><strong>{item.label}</strong>{item.description && <small>{item.description}</small>}</span>
              </Button>
              {index < items.length - 1 && <span className="nacre-stepper__connector" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>

      {currentItem?.content && <div className="nacre-stepper__content" key={currentItem.id}>{currentItem.content}</div>}

      <footer className="nacre-stepper__actions">
        <Button magnetic={false} isDisabled={currentIndex === 0} onPress={() => select(items[currentIndex - 1]?.id)}><BackIcon />{previousLabel}</Button>
        <div>
          {currentIndex < items.length - 1 && <Button variant="quiet" magnetic={false} onPress={() => select(items.at(-1)?.id)}>{jumpToEndLabel}</Button>}
          <Button variant="prominent" magnetic={false} isDisabled={currentIndex === items.length - 1} onPress={() => select(items[currentIndex + 1]?.id)}>{nextLabel}<NextIcon /></Button>
        </div>
      </footer>
    </section>
  );
}
