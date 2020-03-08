import { getMaskingData } from '../getMaskingData';
import { getAdjustedCursorPosition } from '../getAdjustedCursorPosition';
import { createNumberMask } from '../addons';

let placeholderChar = '_';

describe('createNumberMask', () => {
  test('Simulate first input', () => {
    let numberMask = createNumberMask({});
    let maskedData;
    let adjustedCursor;
    let changedValue = '1';

    let previous = {
      previousConformedValue: '',
      previousPlaceholder: '',
      previousRawValue: '',
    };

    /** Simulate first input */
    maskedData = getMaskingData(changedValue, {
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
      changedValue,
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
    let changedValue = '1234';

    let previous = {
      previousConformedValue: '123',
      previousPlaceholder: '___',
      previousRawValue: '123',
    };

    maskedData = getMaskingData(changedValue, {
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
      changedValue,
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
    let changedValue = '1,23';

    let previous = {
      previousConformedValue: '1,234',
      previousPlaceholder: '_,___',
      previousRawValue: '1234',
    };

    maskedData = getMaskingData(changedValue, {
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
      changedValue,
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
    let changedValue = ',234';

    let previous = {
      previousConformedValue: '1,234',
      previousPlaceholder: '_,___',
      previousRawValue: '1234',
    };

    maskedData = getMaskingData(changedValue, {
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
      changedValue,
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
      previousPlaceholder: '',
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
      changedValue: '0',
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
      previousPlaceholder: previousMaskedData.placeholder,
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
      changedValue: '00',
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(1);

    previousMaskedData = maskedData;
  });

  test('createNumberMask -> allowLeadingZeros - If your value starts with zero, it shouldnt allow additional input', () => {
    let numberMask = createNumberMask();
    let changedValue = '01';

    let previous = {
      previousConformedValue: '0',
      previousRawValue: '0',
      previousPlaceholder: '_',
      previousCursorPosition: 1,
    };

    let maskedData = getMaskingData(changedValue, {
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
      changedValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(0);
  });

  test('createNumberMask -> prefix -> result when first focusing input', () => {
    let numberMask = createNumberMask({
      prefix: '$',
    });
    let maskedData;
    let changedValue = '';

    let previous = {
      previousRawValue: '',
      previousConformedValue: '',
      previousPlaceholder: '',
      previousCursorPosition: 0,
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(changedValue, {
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
  });

  test('prefix -> removing char right after prefix', () => {
    let numberMask = createNumberMask({
      prefix: '$',
    });
    let maskedData;
    let changedValue = '$23';

    let previous = {
      previousRawValue: '123',
      previousConformedValue: '$123',
      previousPlaceholder: '$___',
      previousCursorPosition: 2,
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(changedValue, {
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
      changedValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(0);
  });

  test('createNumberMask -> removing last digit in value with masked chars', () => {
    let numberMask = createNumberMask();
    let maskedData;
    let changedValue = '1,234,56';

    let previous = {
      previousRawValue: '1234567',
      previousConformedValue: '1,234,567',
      previousPlaceholder: '_,___,___',
      previousCursorPosition: 9,
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(changedValue, {
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
    let changedValue = '1234';

    let previous = {
      previousRawValue: '1234',
      previousConformedValue: '1,234',
      previousPlaceholder: '_,___',
      previousCursorPosition: 2,
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(changedValue, {
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
      changedValue,
      placeholderChar,
      placeholder: maskedData.placeholder,
      indexesOfPipedChars: maskedData.indexesOfPipedChars,
      cursorTrapIndexes: maskedData.cursorTrapIndexes,
    });

    expect(adjustedCursor).toBe(1);
  });
});
