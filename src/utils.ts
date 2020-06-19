import type { MaskIndex } from './types';

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
  placeholderChar: string = '_',
  includedChars: MaskIndex[] = []
): string {
  if (value === '' || placeholder == '') {
    return value;
  }

  return placeholder.split('').reduce((result, char, i) => {
    let isIncludedChar = includedChars.some(charOrRegex =>
      charOrRegex instanceof RegExp
        ? charOrRegex.test(char)
        : charOrRegex === char
    );

    let raw =
      (char === placeholderChar || isIncludedChar) && value[i]
        ? `${result}${value[i] === placeholderChar ? '' : value[i]}`
        : result;

    return raw;
  }, '');
}

export function getSafeRawValue(inputValue: string): string {
  if (typeof inputValue === 'string') {
    return inputValue;
  } else if (typeof inputValue === 'number') {
    return String(inputValue);
  } else if (inputValue === undefined || inputValue === null) {
    return '';
  } else {
    throw new Error(
      "The 'value' provided to Text Mask needs to be a string or a number. The value " +
        `received was:\n\n ${JSON.stringify(inputValue)}`
    );
  }
}

export function mergeWithPlaceholder(
  value: string,
  placeholder: string,
  placeholderChar: string
): string {
  if (!placeholder) {
    return value;
  }

  let merged = placeholder.split('').reduce(
    ({ conformed, remainder, maskedCount }, char, i) => {
      let currentValue = value[i - maskedCount];
      let shouldFill = char === placeholderChar || char == currentValue;

      return {
        conformed: `${conformed}${shouldFill ? currentValue : char}`,
        remainder: shouldFill ? remainder.substr(1) : remainder,
        maskedCount: !shouldFill ? maskedCount + 1 : maskedCount,
      };
    },
    { conformed: '', remainder: value, maskedCount: 0 }
  );

  return `${merged.conformed}${merged.remainder}`;
}
