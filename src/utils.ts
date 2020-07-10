import { MaskIndex, MaskOrMaskGetter, Mask } from './types';

export function processMask(
  mask: MaskOrMaskGetter,
  {
    inputValue,
    currentCursorPosition,
    previousConformedValue,
    placeholderChar,
  }: {
    inputValue: string;
    currentCursorPosition: number;
    previousConformedValue: string;
    placeholderChar: string;
  }
): { processedMask: Mask; cursorTrapIndexes?: number[] } {
  if (typeof mask === 'function') {
    let processedMask = mask(inputValue, {
      currentCursorPosition,
      previousConformedValue,
      placeholderChar,
    });

    if (!processedMask) return { processedMask: false };

    // mask functions can setup cursor traps to have some control over how the cursor moves. We need to process
    // the mask for any cursor traps. `processCursorTraps` will remove the cursor traps from the mask and return
    // the indexes of the cursor traps.
    const { maskWithoutCursorTraps, indexes } = processCursorTraps(
      processedMask
    );

    // And we need to store these indexes because they're needed by `getAdjustedCursorPosition`
    return {
      processedMask: maskWithoutCursorTraps,
      cursorTrapIndexes: indexes,
    };
  }

  return { processedMask: mask };
}

export function convertMaskToPlaceholder(
  mask: MaskIndex[] = [],
  placeholderChar: string = '_'
): string {
  if (mask.indexOf(placeholderChar) !== -1) {
    throw new Error(
      'Placeholder character must not be used as part of the mask. Please specify a character ' +
        'that is not present in your mask as your placeholder character.\n\n' +
        `The placeholder character that was received is: ${JSON.stringify(
          placeholderChar
        )}\n\n` +
        `The mask that was received is: ${JSON.stringify(mask)}`
    );
  }

  return mask
    .map(char => {
      return char instanceof RegExp ? placeholderChar : char;
    })
    .join('');
}

export function isNil(value: any) {
  return typeof value === 'undefined' || value === null;
}

const strCursorTrap = '[]';
export function processCursorTraps(
  mask: MaskIndex[]
): { maskWithoutCursorTraps: MaskIndex[]; indexes: number[] } {
  const indexes = [];

  let indexOfCursorTrap;
  while (
    ((indexOfCursorTrap = mask.indexOf(strCursorTrap)),
    indexOfCursorTrap !== -1)
  ) {
    indexes.push(indexOfCursorTrap);
    mask.splice(indexOfCursorTrap, 1);
  }

  return { maskWithoutCursorTraps: mask, indexes };
}

export function getRawValue(
  value: string = '',
  placeholder: string = '',
  placeholderChar: string = '_'
): string {
  if (value === '' || placeholder === '') {
    return value;
  }

  return placeholder.split('').reduce((result, char, i) => {
    let raw =
      char === placeholderChar && value[i]
        ? `${result}${value[i] === placeholderChar ? '' : value[i]}`
        : result;

    return raw;
  }, '');
}
