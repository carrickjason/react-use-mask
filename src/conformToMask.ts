// @ts-nocheck
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
    cursorTrapIndexes,
  }: ConformConfig
): { conformedValue: string; meta?: { someCharsRejected: boolean } } {
  let isGuide = guide || keepCharPositions;
  let inputChars = inputValue.split('');
  let inputValueLength = inputValue.length;
  let previousConformedValueLength = previousConformedValue.length;
  let maskLength = mask.length;
  let editDistance = inputValueLength - previousConformedValueLength;
  let isAddition = editDistance > 0;
  let indexOfFirstChange =
    currentCursorPosition + (isAddition ? -editDistance : 0);
  let indexOfLastChange = indexOfFirstChange + Math.abs(editDistance);

  if (keepCharPositions) {
    if (isAddition) {
      inputChars = [].concat(
        inputChars.slice(0, indexOfLastChange),
        inputChars.slice(indexOfLastChange + editDistance)
      );
    } else {
      let previousInputChars = previousConformedValue.split('');
      let placeholderForRemovedChars = convertMaskToPlaceholder(
        mask.slice(indexOfFirstChange, indexOfLastChange)
      ).split('');
      inputChars = [].concat(
        previousInputChars.slice(0, indexOfFirstChange),
        placeholderForRemovedChars,
        previousInputChars.slice(indexOfLastChange - 1)
      );
    }
  }

  let conformedChars: string[] = [].concat(
    previousConformedValue.split('').slice(0, indexOfFirstChange)
  );

  let inputIndex = indexOfFirstChange;
  let maskIndex = indexOfFirstChange;
  let adjacentMaskedCharStatus = 'UNFOUND';
  while (maskIndex < maskLength) {
    let char = inputChars[inputIndex];
    let maskAtIndex = mask[maskIndex];
    let hasMoreInputToProcess = inputIndex < inputIndex.length - 1;

    if (maskAtIndex instanceof RegExp) {
      let isCharAcceptable = char === placeholderChar || maskAtIndex.test(char);

      if (adjacentMaskedCharStatus === 'FOUND') {
        adjacentMaskedCharStatus = 'PAST';
      }

      conformedChars = conformedChars.concat(
        isCharAcceptable ? char : isGuide && placeholderChar
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

  // TODO: need to handle cursor trap indexes

  return { conformedValue: conformedChars.filter(Boolean).join('') };
}
