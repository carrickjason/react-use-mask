import { getMaskingData } from '../getMaskingData';
import { getAdjustedCursorPosition } from '../getAdjustedCursorPosition';
import { createAutoCorrectedDatePipe } from '../addons';

describe('createAutoCorrectedDatePipe', () => {
  test('result when first focusing input', () => {
    let pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let placeholderChar = '_';
    let maskedData;
    let changedValue = '';

    let previous = {
      previousConformedValue: '',
      previousRawValue: '',
      previousPlaceholder: '',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(changedValue, {
      currentCursorPosition: 0,
      guide: true,
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

  test('entering non-piped month (12)', () => {
    let pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let placeholderChar = '_';
    let maskedData;
    let changedValue = '12_/__/____';

    let previous = {
      previousConformedValue: '1_/__/____',
      previousRawValue: '1',
      previousPlaceholder: '__/__/____',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(changedValue, {
      currentCursorPosition: 2,
      guide: true,
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
        changedValue,
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
    let changedValue = '11_/__/____';

    let previous = {
      previousConformedValue: '1_/__/____',
      previousRawValue: '1',
      previousPlaceholder: '__/__/____',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(changedValue, {
      currentCursorPosition: 2,
      guide: true,
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
        changedValue,
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
    let changedValue = '12/1_/____';

    let previous = {
      previousConformedValue: '12/__/____',
      previousRawValue: '12',
      previousPlaceholder: '__/__/____',
    };

    maskedData = getMaskingData(changedValue, {
      currentCursorPosition: 4,
      guide: true,
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
        changedValue,
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
    let changedValue = '4';

    let previous = {
      previousConformedValue: '',
      previousRawValue: '',
      previousPlaceholder: '',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(changedValue, {
      currentCursorPosition: 1,
      guide: true,
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
        changedValue,
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
    let changedValue = '0/04/2019';

    let previous = {
      previousRawValue: '04042019',
      previousConformedValue: '04/04/2019',
      previousPlaceholder: '__/__/____',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(changedValue, {
      currentCursorPosition: 1,
      guide: true,
      pipe,
      mask,
      placeholderChar,
      previousRawValue: '04042019',
      previousConformedValue: '04/04/2019',
      previousPlaceholder: '__/__/____',
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
        changedValue,
        placeholderChar,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
      })
    ).toBe(1);
  });

  test('removing character from middle of string - after a masked character', () => {
    let pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');
    let mask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
    let placeholderChar = '_';
    let maskedData;
    let changedValue = '04/04/019';

    let previous = {
      previousRawValue: '04042019',
      previousConformedValue: '04/04/2019',
      previousPlaceholder: '__/__/____',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(changedValue, {
      currentCursorPosition: 6,
      guide: true,
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
        changedValue,
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
    let changedValue = '04/042/019';

    let previous = {
      previousRawValue: '0404019',
      previousConformedValue: '04/04/_019',
      previousPlaceholder: '__/__/____',
    };

    /** Simulating removing integer before decimal */
    maskedData = getMaskingData(changedValue, {
      currentCursorPosition: 6,
      guide: true,
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
        changedValue,
        placeholderChar,
        placeholder: maskedData.placeholder,
        indexesOfPipedChars: maskedData.indexesOfPipedChars,
        cursorTrapIndexes: maskedData.cursorTrapIndexes,
        ...previous,
      })
    ).toBe(7);
  });
});
