import { getMaskingData } from '../getMaskingData';
import { getAdjustedCursorPosition } from '../getAdjustedCursorPosition';
import { createNumberMask } from '../addons';

let placeholderChar = '_';

function mockPipe(value: string) {
  return {
    value: `0${value}`,
    indexesOfPipedChars: [0],
  };
}

describe('getAdjustedCursorPosition', () => {
  test('Standard input, not masked chars, piped chars, or traps', () => {
    let mask = [/\d/];
    let maskedData;
    let adjustedCursor;
    let inputValue = '1';

    let previous = {
      previousConformedValue: '',
      previousRawValue: '',
      previousPlaceholder: '',
      previousCursorPosition: 0,
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
    let mask = ['(', /\d/];
    let maskedData;
    let adjustedCursor;
    let inputValue = '1';

    let previous = {
      previousConformedValue: '',
      previousRawValue: '',
      previousPlaceholder: '',
      previousCursorPosition: 0,
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
    let mask = [/\d/, '-'];
    let maskedData;
    let adjustedCursor;
    let inputValue = '1';

    let previous = {
      previousConformedValue: '',
      previousRawValue: '',
      previousPlaceholder: '',
      previousCursorPosition: 0,
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
    let mask = [/\d/, '-', /\d/];
    let maskedData;
    let adjustedCursor;
    let inputValue = '1';

    let previous = {
      previousConformedValue: '',
      previousRawValue: '',
      previousPlaceholder: '',
      previousCursorPosition: 0,
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

  test('with piped chars -> adding char before and no masked chars', () => {
    let mask = [/\d/, /\d/];
    let maskedData;
    let adjustedCursor;
    let inputValue = '1';

    let previous = {
      previousConformedValue: '',
      previousRawValue: '',
      previousPlaceholder: '',
      previousCursorPosition: 0,
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

  test('with piped chars -> adding char before and following masked char', () => {
    let mask = [/\d/, /\d/, '-', /\d/];
    let maskedData;
    let adjustedCursor;
    let inputValue = '1';

    let previous = {
      previousConformedValue: '',
      previousRawValue: '',
      previousPlaceholder: '',
      previousCursorPosition: 0,
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
      placeholder: '__-_',
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

    expect(adjustedCursor).toBe(3);
  });

  test('with carat traps -> adding value before a cursor trap', () => {
    let mask = createNumberMask({ allowDecimal: true });
    let maskedData;
    let adjustedCursor;
    let inputValue = '125.34';

    let previous = {
      previousConformedValue: '12.34',
      previousRawValue: '1234',
      previousPlaceholder: '__.__',
      previousCursorPosition: 2,
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

  test('removing value after a masked char', () => {
    let mask = createNumberMask();
    let maskedData;
    let adjustedCursor;
    let inputValue = '1,23';

    let previous = {
      previousConformedValue: '1,234',
      previousRawValue: '1234',
      previousPlaceholder: '_,___',
      previousCursorPosition: 5,
    };

    maskedData = getMaskingData(inputValue, {
      ...previous,
      mask,
      currentCursorPosition: 4,
      placeholderChar,
    });

    expect(maskedData).toEqual({
      conformedValue: '123',
      rawValue: '123',
      placeholder: '___',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    adjustedCursor = getAdjustedCursorPosition({
      ...previous,
      currentCursorPosition: 4,
      conformedValue: maskedData.conformedValue,
      inputValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(3);
  });

  test('Backspacing a masked char with keepCharPositions', () => {
    let mask = [/\d/, /\d/, '/', /\d/, /\d/];
    let maskedData;
    let adjustedCursor;
    let inputValue = '11__';

    let previous = {
      previousCursorPosition: 3,
      previousConformedValue: '11/__',
      previousRawValue: '11',
      previousPlaceholder: '__/__',
    };

    maskedData = getMaskingData(inputValue, {
      mask,
      currentCursorPosition: 2,
      placeholderChar,
      keepCharPositions: true,
      guide: true,
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
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let maskedData;
    let adjustedCursor;
    let inputValue = '11/11/2_019';

    let previous = {
      previousConformedValue: '11/11/_019',
      previousRawValue: '1111019',
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
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let maskedData;
    let adjustedCursor;
    let inputValue = '11/112/_019';

    let previous = {
      previousConformedValue: '11/11/_019',
      previousRawValue: '1111019',
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
