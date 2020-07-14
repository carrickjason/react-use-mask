import { getMaskingData } from '../getMaskingData';
import { getAdjustedCursorPosition } from '../getAdjustedCursorPosition';
import { createNumberMask } from '../addons';

let placeholderChar = '_';

describe('createNumberMask', () => {
  test('Simulate first input', () => {
    let numberMask = createNumberMask({});
    let maskedData;
    let adjustedCursor;
    let inputValue = '1';

    let previous = {
      previousConformedValue: '',
      previousPlaceholder: '',
    };

    /** Simulate first input */
    maskedData = getMaskingData(inputValue, {
      mask: numberMask,
      currentCursorPosition: 1,
      guide: false,
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

  test('Input that adds masked char 123 -> 1,234', () => {
    let numberMask = createNumberMask({});
    let maskedData;
    let adjustedCursor;
    let inputValue = '1234';

    let previous = {
      previousConformedValue: '123',
      previousPlaceholder: '___',
    };

    maskedData = getMaskingData(inputValue, {
      mask: numberMask,
      currentCursorPosition: 4,
      guide: false,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '1,234',
      rawValue: '1234',
      placeholder: '_,___',
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

    expect(adjustedCursor).toBe(5);
  });

  test('Simulate backspace that removes masked char (1,234 -> 123)', () => {
    let numberMask = createNumberMask({});
    let maskedData;
    let adjustedCursor;
    let inputValue = '1,23';

    let previous = {
      previousConformedValue: '1,234',
      previousPlaceholder: '_,___',
    };

    maskedData = getMaskingData(inputValue, {
      mask: numberMask,
      currentCursorPosition: 4,
      guide: false,
      placeholderChar,
      ...previous,
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

  test('Simulate removing char before last index (1,234 -> 234)', () => {
    let numberMask = createNumberMask({});
    let maskedData;
    let adjustedCursor;
    let inputValue = ',234';

    let previous = {
      previousConformedValue: '1,234',
      previousPlaceholder: '_,___',
    };

    maskedData = getMaskingData(inputValue, {
      mask: numberMask,
      currentCursorPosition: 4,
      guide: false,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '234',
      rawValue: '234',
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

  /**
   * Test allowLeadingZeros
   **/
  test('allowLeadingZeros', () => {
    let numberMask = createNumberMask({});
    let maskedData;
    let adjustedCursor;
    let previousMaskedData;

    /** FIRST INPUT - 0 */
    maskedData = getMaskingData('0', {
      mask: numberMask,
      currentCursorPosition: 1,
      previousConformedValue: '',
      guide: false,
      placeholderChar,
    });

    expect(maskedData).toEqual({
      conformedValue: '0',
      rawValue: '0',
      placeholder: '_',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    adjustedCursor = getAdjustedCursorPosition({
      previousConformedValue: '',
      previousPlaceholder: '',
      currentCursorPosition: 1,
      conformedValue: maskedData.conformedValue,
      inputValue: '0',
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(1);

    previousMaskedData = maskedData;

    /** SECOND INPUT - 00 */
    maskedData = getMaskingData('00', {
      mask: numberMask,
      currentCursorPosition: 2,
      previousConformedValue: previousMaskedData.conformedValue,
      guide: false,
      placeholderChar,
    });

    expect(maskedData).toEqual({
      conformedValue: '0',
      rawValue: '0',
      placeholder: '_',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    adjustedCursor = getAdjustedCursorPosition({
      previousConformedValue: '',
      previousPlaceholder: '',
      currentCursorPosition: 1,
      conformedValue: maskedData.conformedValue,
      inputValue: '00',
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(1);

    previousMaskedData = maskedData;
  });

  test('allowLeadingZeros - If your value starts with zero, it shouldnt allow additional input', () => {
    let numberMask = createNumberMask();
    let inputValue = '01';

    let previous = {
      previousConformedValue: '0',
      previousPlaceholder: '_',
    };

    let maskedData = getMaskingData(inputValue, {
      mask: numberMask,
      currentCursorPosition: 2,
      guide: false,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '0',
      rawValue: '0',
      placeholder: '_',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    let adjustedCursor = getAdjustedCursorPosition({
      ...previous,
      currentCursorPosition: 1,
      conformedValue: maskedData.conformedValue,
      inputValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(0);
  });

  test('prefix -> result when first focusing input', () => {
    let numberMask = createNumberMask({
      prefix: '$',
    });
    let inputValue = '';

    let previous = {
      previousConformedValue: '',
    };

    let maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 0,
      guide: true,
      mask: numberMask,
      showMask: true,
      placeholderChar,
      ...previous,
    });

    let maskedDataWithNoGuide = getMaskingData(inputValue, {
      currentCursorPosition: 0,
      guide: false,
      mask: numberMask,
      showMask: true,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '$_',
      rawValue: '',
      placeholder: '$_',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    expect(maskedDataWithNoGuide).toEqual({
      conformedValue: '$',
      rawValue: '',
      placeholder: '$_',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });
  });

  test('prefix -> removing char right after prefix', () => {
    let numberMask = createNumberMask({
      prefix: '$',
    });
    let maskedData;
    let inputValue = '$23';

    let previous = {
      previousConformedValue: '$123',
      previousPlaceholder: '$___',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 1,
      guide: false,
      mask: numberMask,
      showMask: true,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '$23',
      rawValue: '23',
      placeholder: '$__',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    let adjustedCursor = getAdjustedCursorPosition({
      ...previous,
      currentCursorPosition: 1,
      conformedValue: maskedData.conformedValue,
      inputValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(0);
  });

  test('removing last digit in value with masked chars', () => {
    let numberMask = createNumberMask();
    let maskedData;
    let inputValue = '1,234,56';

    let previous = {
      previousConformedValue: '1,234,567',
      previousPlaceholder: '_,___,___',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 8,
      guide: false,
      mask: numberMask,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '123,456',
      rawValue: '123456',
      placeholder: '___,___',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });
  });

  test('backspacing on masked char', () => {
    let numberMask = createNumberMask();
    let maskedData;
    let inputValue = '1234';

    let previous = {
      previousConformedValue: '1,234',
      previousPlaceholder: '_,___',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 1,
      guide: false,
      mask: numberMask,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '1,234',
      rawValue: '1234',
      placeholder: '_,___',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    let adjustedCursor = getAdjustedCursorPosition({
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
});
