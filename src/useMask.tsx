import * as React from 'react';
import { getMaskingData } from './getMaskingData';
import { getAdjustedCursorPosition } from './getAdjustedCursorPosition';
import { UseMaskArgs, MaskingData, MaskedInputProps } from './types';

type EventRef = null | {
  value: string;
  start: number | null;
  target: HTMLInputElement;
};

export function useMask({
  value = '',
  onChange,
  mask,
  pipe,
  guide = true,
  keepCharPositions = false,
  placeholderChar = '_',
  showMask = false,
}: UseMaskArgs): MaskedInputProps {
  const [, refresh] = React.useReducer((state: number) => state + 1, 0);
  let masked = React.useRef<MaskingData>({
    conformedValue: '',
    rawValue: '',
    placeholder: '',
    indexesOfPipedChars: [],
    cursorTrapIndexes: [],
  });
  let event = React.useRef<EventRef>(null);

  // Save the event and force an update so that the effect can handle
  // any changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    event.current = {
      value: e.target.value,
      start: e.target.selectionStart,
      target: e.target,
    };
    refresh();
  };

  React.useLayoutEffect(() => {
    let currentEvent = event ? event.current : null;
    let cursorPosition = 0;

    if (currentEvent || !value || value !== masked.current.conformedValue) {
      // grab previous masekdValues
      let {
        conformedValue: previousConformedValue,
        placeholder: previousPlaceholder,
      } = masked.current;
      let inputValue = (currentEvent ? currentEvent.value : value) || '';
      let start = currentEvent?.start ?? 0;

      let maskedData = getMaskingData(inputValue, {
        currentCursorPosition: start,
        previousConformedValue,
        showMask,
        guide,
        keepCharPositions,
        mask,
        pipe,
        placeholderChar,
      });

      cursorPosition = getAdjustedCursorPosition({
        previousPlaceholder: masked.current.placeholder,
        previousConformedValue: masked.current.conformedValue,
        currentCursorPosition: start,
        conformedValue: maskedData.conformedValue,
        inputValue,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
        placeholderChar,
      });

      const { conformedValue } = maskedData;
      if (inputValue && inputValue === conformedValue) {
        conformedValue !== previousConformedValue && refresh();
      } else if (conformedValue !== value) {
        onChange(conformedValue);
      }

      masked.current = maskedData;
    }

    return () => {
      if (currentEvent && currentEvent.target) {
        currentEvent.target.selectionStart = currentEvent.target.selectionEnd = cursorPosition;
        event.current = null;
      }
    };
  });

  return {
    onChange: handleChange,
    value: masked.current.conformedValue,
  };
}
