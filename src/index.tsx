import * as React from 'react';
import { getMaskingData } from './getMaskingData';
import { getAdjustedCursorPosition } from './getAdjustedCursorPosition';

const useMask = ({
  guide = true,
  inputRef: forwardedRef,
  keepCharPositions = false,
  mask,
  onChange,
  pipe,
  placeholderChar = '_',
  showMask = false,
  value = '',
}: Props) => {
  let inputRef = React.useRef<HTMLInputElement>();
  if (forwardedRef) {
    inputRef = forwardedRef;
  }

  const [, refresh] = React.useReducer(c => c + 1, 0);
  let masked = React.useRef<MaskingData>({
    conformedValue: '',
    rawValue: '',
    placeholder: '',
    indexesOfPipedChars: [],
    cursorTrapIndexes: [],
  });
  let event = React.useRef<EventRef>(null);
  let cursor = React.useRef(0);

  // Save the event and force an update so that the effect can handle
  // any changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    event.current = {
      value: e.target.value,
      start: e.target.selectionStart,
    };
    refresh();
  };

  React.useEffect(() => {
    let currentEvent = event ? event.current : null;

    if (currentEvent || value !== masked.current.conformedValue) {
      // grab previous masekdValues
      let { conformedValue, placeholder } = masked.current;
      let userValue = (currentEvent ? currentEvent.value : value) || '';
      let start = currentEvent?.start ?? 0;

      let maskedData = getMaskingData(userValue, {
        currentCursorPosition: start,
        previousConformedValue: conformedValue,
        previousPlaceholder: placeholder,
        showMask,
        guide,
        keepCharPositions,
        mask,
        pipe,
        placeholderChar,
      });

      // get adjusted cursor position
      cursor.current = getAdjustedCursorPosition({
        previousPlaceholder: masked.current.placeholder,
        previousConformedValue: masked.current.conformedValue,
        currentCursorPosition: start,
        conformedValue: maskedData.conformedValue,
        changedValue: userValue,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
        placeholderChar,
      });

      if (userValue === masked.current.conformedValue) {
        maskedData.conformedValue !== masked.current.conformedValue &&
          refresh();
      } else {
        onChange(maskedData.conformedValue);
      }

      masked.current = maskedData;
      event.current = null;
    }

    if (inputRef.current) {
      inputRef.current.selectionStart = inputRef.current.selectionEnd =
        cursor.current;
    }
  });

  return [
    inputRef,
    {
      onChange: handleChange,
      value: masked.current.conformedValue,
    },
  ];
};

export default useMask;
