import { getMaskingData } from '../getMaskingData';
import { getAdjustedCursorPosition } from '../getAdjustedCursorPosition';
import { createAutoCorrectedDatePipe } from '../addons';

describe('createAutoCorrectedDatePipe', () => {
  test('result when first focusing input', () => {
    let pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let placeholderChar = '_';
    let maskedData;
    let inputValue = '';

    let previous = {
      previousConformedValue: '',
      previousPlaceholder: '',
    };

    maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 0,
      pipe,
      mask,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '',
      rawValue: '',
      placeholder: '__/__/____',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });
  });

  test('result when first focusing input with initial value', () => {
    let pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let placeholderChar = '_';
    let maskedData;
    let inputValue = '01/01/2021';

    let previous = {
      previousConformedValue: '',
      previousPlaceholder: '',
    };

    maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 0,
      pipe,
      mask,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '01/01/2021',
      rawValue: '01012021',
      placeholder: '__/__/____',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });
  });

  test('entering non-piped month (12)', () => {
    let pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let placeholderChar = '_';
    let maskedData;
    let inputValue = '12_/__/____';

    let previous = {
      previousConformedValue: '1_/__/____',
      previousPlaceholder: '__/__/____',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 2,
      pipe,
      mask,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '12/__/____',
      rawValue: '12',
      placeholder: '__/__/____',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    expect(
      getAdjustedCursorPosition({
        ...previous,
        currentCursorPosition: 2,
        conformedValue: maskedData.conformedValue,
        inputValue,
        placeholderChar,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
      })
    ).toBe(3);
  });

  test('adding digit just before masked char (1_/ -> 11/)', () => {
    let pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let placeholderChar = '_';
    let maskedData;
    let inputValue = '11_/__/____';

    let previous = {
      previousConformedValue: '1_/__/____',
      previousPlaceholder: '__/__/____',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 2,
      pipe,
      mask,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '11/__/____',
      rawValue: '11',
      placeholder: '__/__/____',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    expect(
      getAdjustedCursorPosition({
        ...previous,
        currentCursorPosition: 2,
        conformedValue: maskedData.conformedValue,
        inputValue,
        placeholderChar,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
      })
    ).toBe(3);
  });

  test('entering first digit of day (12/ -> 12/1)', () => {
    let pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let placeholderChar = '_';
    let maskedData;
    let inputValue = '12/1__/____';

    let previous = {
      previousConformedValue: '12/__/____',
      previousPlaceholder: '__/__/____',
    };

    maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 4,
      pipe,
      mask,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '12/1_/____',
      rawValue: '121',
      placeholder: '__/__/____',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    expect(
      getAdjustedCursorPosition({
        ...previous,
        currentCursorPosition: 4,
        conformedValue: maskedData.conformedValue,
        inputValue,
        placeholderChar,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
      })
    ).toBe(4);
  });

  test('entering digit that should result in piped chars', () => {
    let pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let placeholderChar = '_';
    let maskedData;
    let inputValue = '4';

    let previous = {
      previousConformedValue: '',
      previousPlaceholder: '',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 1,
      pipe,
      mask,
      placeholderChar,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '04/__/____',
      rawValue: '04',
      placeholder: '__/__/____',
      indexesOfPipedChars: [0],
      cursorTrapIndexes: [],
    });

    expect(
      getAdjustedCursorPosition({
        ...previous,
        currentCursorPosition: 1,
        conformedValue: maskedData.conformedValue,
        inputValue,
        placeholderChar,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
      })
    ).toBe(3);
  });

  test('removing character from middle of string', () => {
    let pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let placeholderChar = '_';
    let maskedData;
    let inputValue = '0/04/2019';

    let previous = {
      previousConformedValue: '04/04/2019',
      previousPlaceholder: '__/__/____',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 1,
      pipe,
      mask,
      placeholderChar,
      keepCharPositions: true,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '0_/04/2019',
      rawValue: '0042019',
      placeholder: '__/__/____',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    expect(
      getAdjustedCursorPosition({
        ...previous,
        currentCursorPosition: 1,
        conformedValue: maskedData.conformedValue,
        inputValue,
        placeholderChar,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
      })
    ).toBe(1);
  });

  test('removing character after masked character in middle of string', () => {
    let pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let placeholderChar = '_';
    let maskedData;
    let inputValue = '04/04/019';

    let previous = {
      previousConformedValue: '04/04/2019',
      previousPlaceholder: '__/__/____',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 6,
      pipe,
      mask,
      placeholderChar,
      keepCharPositions: true,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '04/04/_019',
      rawValue: '0404019',
      placeholder: '__/__/____',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    expect(
      getAdjustedCursorPosition({
        ...previous,
        currentCursorPosition: 6,
        conformedValue: maskedData.conformedValue,
        inputValue,
        placeholderChar,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
      })
    ).toBe(5);
  });

  test('adding char when cursor is just left of maskedChar', () => {
    let pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let placeholderChar = '_';
    let maskedData;
    let inputValue = '04/042/_019';

    let previous = {
      previousConformedValue: '04/04/_019',
      previousPlaceholder: '__/__/____',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(inputValue, {
      currentCursorPosition: 6,
      pipe,
      mask,
      placeholderChar,
      keepCharPositions: true,
      ...previous,
    });

    expect(maskedData).toEqual({
      conformedValue: '04/04/2019',
      rawValue: '04042019',
      placeholder: '__/__/____',
      indexesOfPipedChars: [],
      cursorTrapIndexes: [],
    });

    expect(
      getAdjustedCursorPosition({
        currentCursorPosition: 6,
        conformedValue: maskedData.conformedValue,
        inputValue,
        placeholderChar,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
        ...previous,
      })
    ).toBe(7);
  });
});
