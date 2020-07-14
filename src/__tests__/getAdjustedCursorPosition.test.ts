import { getMaskingData } from '../getMaskingData';
import { getAdjustedCursorPosition } from '../getAdjustedCursorPosition';
import { createNumberMask } from '../addons';

let placeholderChar = '_';
let digit = /\d/;

describe('getAdjustedCursorPosition', () => {
  test('Standard input, not masked chars, piped chars, or traps', () => {
    let mask = [digit];
    let maskedData;
    let adjustedCursor;
    let inputValue = '1';

    let previous = {
      previousConformedValue: '',
      previousPlaceholder: '',
    };

    maskedData = getMaskingData(inputValue, {
      mask,
      currentCursorPosition: 1,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '1',
      rawValue: '1',
      placeholder: '_',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    adjustedCursor = getAdjustedCursorPosition({
      ...previous,
      currentCursorPosition: 1,
      conformedValue: maskedData.conformedValue,
      inputValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(1);
  });

  test('Input with masked char before', () => {
    let mask = ['(', digit];
    let maskedData;
    let adjustedCursor;
    let inputValue = '1';

    let previous = {
      previousConformedValue: '',
      previousPlaceholder: '',
    };

    maskedData = getMaskingData(inputValue, {
      mask,
      currentCursorPosition: 1,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '(1',
      rawValue: '1',
      placeholder: '(_',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    adjustedCursor = getAdjustedCursorPosition({
      ...previous,
      currentCursorPosition: 1,
      conformedValue: maskedData.conformedValue,
      inputValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(2);
  });

  test('Input with masked char after', () => {
    let mask = [digit, '-'];
    let maskedData;
    let adjustedCursor;
    let inputValue = '1';

    let previous = {
      previousConformedValue: '',
      previousPlaceholder: '',
    };

    maskedData = getMaskingData(inputValue, {
      mask,
      currentCursorPosition: 1,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '1-',
      rawValue: '1',
      placeholder: '_-',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    adjustedCursor = getAdjustedCursorPosition({
      ...previous,
      currentCursorPosition: 1,
      conformedValue: maskedData.conformedValue,
      inputValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(1);
  });

  test('Input with masked char after followed by placeholder', () => {
    let mask = [digit, '-', digit];
    let maskedData;
    let adjustedCursor;
    let inputValue = '1';

    let previous = {
      previousConformedValue: '',
      previousPlaceholder: '',
    };

    maskedData = getMaskingData(inputValue, {
      mask,
      currentCursorPosition: 1,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '1-_',
      rawValue: '1',
      placeholder: '_-_',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    adjustedCursor = getAdjustedCursorPosition({
      ...previous,
      currentCursorPosition: 1,
      conformedValue: maskedData.conformedValue,
      inputValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(2);
  });

  describe('with piped chars', () => {
    function mockPipe(value: string) {
      return {
        value: `0${value.substr(0, 1)}`,
        indexesOfPipedChars: [0],
      };
    }

    test('adding char before and no masked chars', () => {
      let mask = [digit, digit];
      let maskedData;
      let adjustedCursor;
      let inputValue = '1';

      let previous = {
        previousConformedValue: '',
        previousPlaceholder: '',
      };

      maskedData = getMaskingData(inputValue, {
        mask,
        pipe: mockPipe,
        currentCursorPosition: 1,
        placeholderChar,
        ...previous,
      });

      expect(maskedData).toEqual({
        conformedValue: '01',
        rawValue: '01',
        placeholder: '__',
        indexesOfPipedChars: [0],
        cursorTrapIndexes: [],
      });

      adjustedCursor = getAdjustedCursorPosition({
        ...previous,
        currentCursorPosition: 1,
        conformedValue: maskedData.conformedValue,
        inputValue,
        placeholderChar,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
      });

      expect(adjustedCursor).toBe(2);
    });

    test('adding char before and following masked char', () => {
      let mask = [digit, digit, '-', digit];
      let maskedData;
      let adjustedCursor;
      let inputValue = '1';

      maskedData = getMaskingData(inputValue, {
        mask,
        pipe: mockPipe,
        currentCursorPosition: 1,
        placeholderChar,
        previousConformedValue: '',
      });

      expect(maskedData).toEqual({
        conformedValue: '01',
        rawValue: '01',
        placeholder: '__-_',
        indexesOfPipedChars: [0],
        cursorTrapIndexes: [],
      });

      adjustedCursor = getAdjustedCursorPosition({
        previousConformedValue: '',
        previousPlaceholder: '',
        currentCursorPosition: 1,
        conformedValue: maskedData.conformedValue,
        inputValue,
        placeholderChar,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
      });

      expect(adjustedCursor).toBe(3);
    });
  });

  test('with carat traps -> adding value before a cursor trap', () => {
    let mask = createNumberMask({ allowDecimal: true });
    let maskedData;
    let adjustedCursor;
    let inputValue = '125.34';

    let previous = {
      previousConformedValue: '12.34',
      previousPlaceholder: '__.__',
    };

    maskedData = getMaskingData(inputValue, {
      mask,
      currentCursorPosition: 3,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '125.34',
      rawValue: '12534',
      placeholder: '___.__',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [3, 4],
    });

    adjustedCursor = getAdjustedCursorPosition({
      ...previous,
      currentCursorPosition: 3,
      conformedValue: maskedData.conformedValue,
      inputValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    // Without a cursor trap, the cursor would jump to the other side of the decimal.
    expect(adjustedCursor).toBe(3);
  });

  test('Backspacing a masked char with keepCharPositions', () => {
    let mask = [digit, digit, '/', digit, digit];
    let maskedData;
    let adjustedCursor;
    let inputValue = '11__';

    let previous = {
      previousConformedValue: '11/__',
      previousPlaceholder: '__/__',
    };

    maskedData = getMaskingData(inputValue, {
      mask,
      currentCursorPosition: 2,
      placeholderChar,
      keepCharPositions: true,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '11/__',
      rawValue: '11',
      placeholder: '__/__',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    adjustedCursor = getAdjustedCursorPosition({
      ...previous,
      currentCursorPosition: 2,
      conformedValue: maskedData.conformedValue,
      inputValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(2);
  });

  test('keepCharPositions -> cursor starting after masked char, before placeholder', () => {
    let mask = [
      digit,
      digit,
      '/',
      digit,
      digit,
      '/',
      digit,
      digit,
      digit,
      digit,
    ];
    let maskedData;
    let adjustedCursor;
    let inputValue = '11/11/2_019';

    let previous = {
      previousConformedValue: '11/11/_019',
      previousPlaceholder: '__/__/____',
    };

    maskedData = getMaskingData(inputValue, {
      mask,
      currentCursorPosition: 7,
      placeholderChar,
      keepCharPositions: true,
      guide: true,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '11/11/2019',
      rawValue: '11112019',
      placeholder: '__/__/____',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    adjustedCursor = getAdjustedCursorPosition({
      ...previous,
      currentCursorPosition: 7,
      conformedValue: maskedData.conformedValue,
      inputValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(7);
  });

  test('keepCharPositions -> cursor starting before masked char, before placeholder', () => {
    let mask = [
      digit,
      digit,
      '/',
      digit,
      digit,
      '/',
      digit,
      digit,
      digit,
      digit,
    ];
    let maskedData;
    let adjustedCursor;
    let inputValue = '11/112/_019';

    let previous = {
      previousConformedValue: '11/11/_019',
      previousPlaceholder: '__/__/____',
    };

    maskedData = getMaskingData(inputValue, {
      mask,
      currentCursorPosition: 6,
      placeholderChar,
      keepCharPositions: true,
      guide: true,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '11/11/2019',
      rawValue: '11112019',
      placeholder: '__/__/____',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    adjustedCursor = getAdjustedCursorPosition({
      ...previous,
      currentCursorPosition: 6,
      conformedValue: maskedData.conformedValue,
      inputValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(7);
  });
});
