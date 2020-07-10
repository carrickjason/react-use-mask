import { conformToMask } from './conformToMask';
import { convertMaskToPlaceholder, getRawValue, processMask } from './utils';
import { MaskOrMaskGetter, Pipe, MaskingData } from './types';

export type MaskingConfig = {
  currentCursorPosition: number;
  previousConformedValue: string;
  mask: MaskOrMaskGetter;
  placeholderChar: string;
  pipe?: Pipe;
  guide?: boolean;
  keepCharPositions?: boolean;
  showMask?: boolean;
};

export function getMaskingData(
  inputValue: string,
  {
    currentCursorPosition,
    previousConformedValue,
    mask,
    guide = false,
    pipe,
    placeholderChar,
    keepCharPositions = false,
    showMask = false,
  }: MaskingConfig
): MaskingData {
  let { processedMask, cursorTrapIndexes = [] } = processMask(mask, {
    inputValue,
    currentCursorPosition,
    previousConformedValue,
    placeholderChar,
  });

  if (!processedMask) {
    return {
      conformedValue: inputValue,
      rawValue: inputValue,
      placeholder: '',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    };
  }

  let placeholder = convertMaskToPlaceholder(processedMask, placeholderChar);

  let { conformedValue } = conformToMask(inputValue, processedMask, {
    previousConformedValue,
    guide,
    placeholderChar,
    currentCursorPosition,
    keepCharPositions,
    cursorTrapIndexes,
  });

  let piped =
    typeof pipe === 'function'
      ? pipe(inputValue, conformedValue, {
          previousConformedValue,
          guide,
          placeholderChar,
          placeholder,
          currentCursorPosition,
          keepCharPositions,
          cursorTrapIndexes,
        })
      : null;

  conformedValue = piped?.value ?? conformedValue;

  let rawValue = getRawValue(conformedValue, placeholder, placeholderChar);

  // Text Mask sets the input value to an empty string when the condition below is true. It provides a better UX.
  let inputValueShouldBeEmpty = conformedValue === placeholder; // || rawValue;
  let conformedValueWhenEmpty = showMask ? placeholder : '';

  return {
    conformedValue: inputValueShouldBeEmpty
      ? conformedValueWhenEmpty
      : conformedValue,
    placeholder,
    rawValue,
    cursorTrapIndexes,
    indexesOfPipedChars: piped?.indexesOfPipedChars ?? [],
  };
}
