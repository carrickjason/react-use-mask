import * as React from 'react';
import { getMaskingData } from './getMaskingData';
import { getAdjustedCursorPosition } from './getAdjustedCursorPosition';
import { UseMaskArgs, MaskingData, MaskedInputProps } from './types';

type EventRef = null | {
  value: string;
  selectionStart: number | null;
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
      selectionStart: e.target.selectionStart,
      target: e.target,
    };
    refresh();
  };

  React.useLayoutEffect(() => {
    let currentEvent = event ? event.current : null;
    let cursorPosition = 0;

    if (currentEvent || !value || value !== masked.current.conformedValue) {
      let inputValue = (currentEvent ? currentEvent.value : value) || '';
      let selectionStart = currentEvent?.selectionStart ?? 0;

      let updatedMaskedData = getMaskingData(inputValue, {
        currentCursorPosition: selectionStart,
        previousConformedValue: masked.current.conformedValue,
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
        currentCursorPosition: selectionStart,
        conformedValue: updatedMaskedData.conformedValue,
        inputValue,
        placeholder: updatedMaskedData.placeholder,
        indexesOfPipedChars: updatedMaskedData.indexesOfPipedChars,
        cursorTrapIndexes: updatedMaskedData.cursorTrapIndexes,
        placeholderChar,
      });

      const { conformedValue } = updatedMaskedData;

      // When a change results in the same conformedValue as previous
      // (ie: backspacing a masked character with keepCharPositions) we need to
      // force an update so that our changes to the cursor position can be
      // made in the effect return call
      if (
        masked.current.conformedValue &&
        masked.current.conformedValue === conformedValue
      ) {
        refresh();
      } else if (conformedValue !== value) {
        onChange(conformedValue);
      }

      masked.current = updatedMaskedData;
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
