import { MaskIndex } from './types';
import { convertMaskToPlaceholder } from './utils';

export type ConformConfig = {
  guide: boolean;
  previousConformedValue: string;
  placeholderChar?: string;
  currentCursorPosition: number;
  keepCharPositions: boolean;
  cursorTrapIndexes: number[];
};

export function conformToMask(
  inputValue: string = '',
  mask: MaskIndex[] = [],
  {
    guide = true,
    previousConformedValue = '',
    placeholderChar = '_',
    currentCursorPosition,
    keepCharPositions,
  }: // TODO: need to handle cursor trap indexes
  // cursorTrapIndexes,
  ConformConfig
): { conformedValue: string; meta?: { someCharsRejected: boolean } } {
  let isGuide = guide || keepCharPositions;
  let inputChars = inputValue.split('');
  let previousConformedValueLength = previousConformedValue.length;
  let editDistance = inputValue.length - previousConformedValueLength;
  let isAddition = editDistance > 0;
  let indexOfFirstChange =
    currentCursorPosition + (isAddition ? -editDistance : 0);
  let indexOfLastChange = indexOfFirstChange + Math.abs(editDistance);
  let maskLength = mask.length;

  if (keepCharPositions) {
    if (isAddition) {
      inputChars = [
        ...inputChars.slice(0, indexOfLastChange),
        ...inputChars.slice(indexOfLastChange + editDistance),
      ];
    } else {
      let placeholderForRemovedChars = convertMaskToPlaceholder(
        mask.slice(indexOfFirstChange, indexOfLastChange),
        placeholderChar
      ).split('');
      let inputCharsBeforeRemoved = inputChars.slice(0, indexOfFirstChange);
      let inputCharsAfterRemoved = inputChars.slice(indexOfFirstChange);
      inputChars = [
        ...inputCharsBeforeRemoved,
        ...placeholderForRemovedChars,
        ...inputCharsAfterRemoved,
      ];

      // TODO is this all I need? can I just return here?
      // return { conformedValue: inputChars.join('') };
    }
  }

  let conformedChars: string[] = previousConformedValue
    .split('')
    .slice(0, indexOfFirstChange);

  let inputIndex = indexOfFirstChange;
  let maskIndex = indexOfFirstChange;
  let adjacentMaskedCharStatus = 'UNFOUND';
  while (maskIndex < maskLength) {
    let char = inputChars[inputIndex];
    let maskAtIndex = mask[maskIndex];
    let hasMoreInputToProcess = inputIndex < inputChars.length - 1;

    if (maskAtIndex instanceof RegExp) {
      let isCharAcceptable = char === placeholderChar || maskAtIndex.test(char);

      if (adjacentMaskedCharStatus === 'FOUND') {
        adjacentMaskedCharStatus = 'PAST';
      }

      conformedChars = conformedChars.concat(
        isCharAcceptable ? char : isGuide ? placeholderChar : ''
      );

      maskIndex++;
      if (isCharAcceptable) {
        inputIndex = maskIndex;
      }
    } else {
      if (adjacentMaskedCharStatus === 'UNFOUND') {
        adjacentMaskedCharStatus = 'FOUND';
      }

      if (
        isGuide ||
        hasMoreInputToProcess ||
        (isAddition && adjacentMaskedCharStatus === 'FOUND')
      ) {
        conformedChars = conformedChars.concat(maskAtIndex);
        maskIndex++;
      } else {
        maskIndex = maskLength;
      }

      if (char && char === maskAtIndex) {
        inputIndex = maskIndex;
      }
    }
  }

  return { conformedValue: conformedChars.filter(Boolean).join('') };
}
