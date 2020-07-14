/** TODO - get number mask working properly **/

// import { getMaskingData } from '../getMaskingData';
// import { getAdjustedCursorPosition } from '../getAdjustedCursorPosition';
// import { createNumberMask } from '../addons';

// let placeholderChar = '_';

// describe('createNumberMask w/ allowDecimals', () => {
//   test('. as first input', () => {
//     let numberMask = createNumberMask({ allowDecimal: true });
//     let maskedData;
//     let adjustedCursor;
//     let inputValue = '.';

//     let previous = {
//       previousConformedValue: '',
//       previousPlaceholder: '',
//       previousRawValue: '',
//     };

//     maskedData = getMaskingData(inputValue, {
//       mask: numberMask,
//       currentCursorPosition: 1,
//       guide: false,
//       placeholderChar,
//       ...previous,
//     });

//     expect(maskedData).toEqual({
//       conformedValue: '0.',
//       rawValue: '.',
//       placeholder: '0._',
//       indexesOfPipedChars: [],
//       cursorTrapIndexes: [],
//     });

//     adjustedCursor = getAdjustedCursorPosition({
//       ...previous,
//       currentCursorPosition: 1,
//       conformedValue: maskedData.conformedValue,
//       inputValue,
//       placeholderChar,
//       placeholder: maskedData.placeholder,
//       indexesOfPipedChars: maskedData.indexesOfPipedChars,
//       cursorTrapIndexes: maskedData.cursorTrapIndexes,
//     });

//     expect(adjustedCursor).toBe(2);
//   });

//   test('0 as first input', () => {
//     let numberMask = createNumberMask({ allowDecimal: true });
//     let placeholderChar = '_';
//     let maskedData;
//     let adjustedCursor;
//     let inputValue = '0';

//     let previous = {
//       previousConformedValue: '',
//       previousPlaceholder: '',
//       previousRawValue: '',
//     };

//     maskedData = getMaskingData(inputValue, {
//       mask: numberMask,
//       currentCursorPosition: 1,
//       guide: false,
//       placeholderChar,
//       ...previous,
//     });

//     expect(maskedData).toEqual({
//       conformedValue: '0',
//       rawValue: '0',
//       placeholder: '_',
//       indexesOfPipedChars: [],
//       cursorTrapIndexes: [],
//     });

//     adjustedCursor = getAdjustedCursorPosition({
//       ...previous,
//       currentCursorPosition: 1,
//       conformedValue: maskedData.conformedValue,
//       inputValue,
//       placeholderChar,
//       placeholder: maskedData.placeholder,
//       indexesOfPipedChars: maskedData.indexesOfPipedChars,
//       cursorTrapIndexes: maskedData.cursorTrapIndexes,
//     });

//     expect(adjustedCursor).toBe(1);
//   });

//   test('. after entering integer', () => {
//     let numberMask = createNumberMask({ allowDecimal: true });
//     let placeholderChar = '_';
//     let maskedData;
//     let adjustedCursor;
//     let inputValue = '0.';

//     let previous = {
//       previousConformedValue: '0',
//       previousRawValue: '0',
//       previousPlaceholder: '_',
//     };

//     maskedData = getMaskingData(inputValue, {
//       mask: numberMask,
//       currentCursorPosition: 2,
//       guide: false,
//       placeholderChar,
//       ...previous,
//     });

//     expect(maskedData).toEqual({
//       conformedValue: '0.',
//       rawValue: '0.', // Make sure decimals don't get stripped
//       placeholder: '_.',
//       indexesOfPipedChars: [],
//       cursorTrapIndexes: [1, 2],
//     });

//     adjustedCursor = getAdjustedCursorPosition({
//       ...previous,
//       currentCursorPosition: 2,
//       conformedValue: maskedData.conformedValue,
//       inputValue,
//       placeholderChar,
//       placeholder: maskedData.placeholder,
//       indexesOfPipedChars: maskedData.indexesOfPipedChars,
//       cursorTrapIndexes: maskedData.cursorTrapIndexes,
//     });

//     expect(adjustedCursor).toBe(2);
//   });

//   test('adding decimal value', () => {
//     let numberMask = createNumberMask({ allowDecimal: true });
//     let placeholderChar = '_';
//     let maskedData;
//     let adjustedCursor;
//     let inputValue = '0.1';

//     let previous = {
//       previousRawValue: '0.',
//       previousConformedValue: '0.',
//       previousPlaceholder: '_.',
//     };

//     /** Simulating typing value after decimal */
//     maskedData = getMaskingData(inputValue, {
//       mask: numberMask,
//       currentCursorPosition: 3,
//       guide: false,
//       placeholderChar,
//       ...previous,
//     });

//     expect(maskedData).toEqual({
//       conformedValue: '0.1',
//       rawValue: '0.1',
//       placeholder: '_._',
//       indexesOfPipedChars: [],
//       cursorTrapIndexes: [1, 2],
//     });

//     adjustedCursor = getAdjustedCursorPosition({
//       ...previous,
//       currentCursorPosition: 3,
//       conformedValue: maskedData.conformedValue,
//       inputValue,
//       placeholderChar,
//       placeholder: maskedData.placeholder,
//       indexesOfPipedChars: maskedData.indexesOfPipedChars,
//       cursorTrapIndexes: maskedData.cursorTrapIndexes,
//     });

//     expect(adjustedCursor).toBe(3);
//   });

//   test('adding decimal to value that has a masked char', () => {
//     let numberMask = createNumberMask({ allowDecimal: true });
//     let placeholderChar = '_';
//     let maskedData;
//     let adjustedCursor;
//     let inputValue = '1,234.';

//     let previous = {
//       previousRawValue: '1234',
//       previousConformedValue: '1,234',
//       previousPlaceholder: '_,___',
//       previousCursorPosition: 5,
//     };

//     maskedData = getMaskingData(inputValue, {
//       mask: numberMask,
//       currentCursorPosition: 6,
//       guide: false,
//       placeholderChar,
//       ...previous,
//     });

//     let expectedResult = {
//       conformedValue: '1,234.',
//       rawValue: '1234.',
//       placeholder: '_,___.',
//       indexesOfPipedChars: [],
//       cursorTrapIndexes: [5, 6],
//     };

//     expect(maskedData).toEqual(expectedResult);

//     adjustedCursor = getAdjustedCursorPosition({
//       ...previous,
//       currentCursorPosition: 6,
//       conformedValue: maskedData.conformedValue,
//       inputValue,
//       placeholderChar,
//       placeholder: maskedData.placeholder,
//       indexesOfPipedChars: maskedData.indexesOfPipedChars,
//       cursorTrapIndexes: maskedData.cursorTrapIndexes,
//     });

//     expect(adjustedCursor).toBe(6);
//   });

//   test('removing digit before decimal index', () => {
//     let numberMask = createNumberMask({ allowDecimal: true });
//     let placeholderChar = '_';
//     let maskedData;
//     let adjustedCursor;
//     let inputValue = '12.45';

//     let previous = {
//       previousRawValue: '123.45',
//       previousConformedValue: '123.45',
//       previousPlaceholder: '___.__',
//     };

//     /** Simulating removing integer before decimal */
//     maskedData = getMaskingData(inputValue, {
//       mask: numberMask,
//       currentCursorPosition: 2,
//       previousConformedValue: '123.45',
//       previousPlaceholder: '___.__',
//       guide: false,
//       placeholderChar,
//     });

//     expect(maskedData).toEqual({
//       conformedValue: '12.45',
//       rawValue: '12.45',
//       placeholder: '__.__',
//       indexesOfPipedChars: [],
//       cursorTrapIndexes: [2, 3],
//     });

//     adjustedCursor = getAdjustedCursorPosition({
//       ...previous,
//       currentCursorPosition: 2,
//       conformedValue: maskedData.conformedValue,
//       inputValue,
//       placeholderChar,
//       placeholder: maskedData.placeholder,
//       indexesOfPipedChars: maskedData.indexesOfPipedChars,
//       cursorTrapIndexes: maskedData.cursorTrapIndexes,
//     });

//     expect(adjustedCursor).toBe(2);
//   });

//   test('removing digit directly after decimal index', () => {
//     let numberMask = createNumberMask({ allowDecimal: true });
//     let placeholderChar = '_';
//     let maskedData;
//     let adjustedCursor;
//     let inputValue = '123.';

//     let previous = {
//       previousRawValue: '123.4',
//       previousConformedValue: '123.4',
//       previousPlaceholder: '___._',
//       previousCursorPosition: 5,
//     };

//     maskedData = getMaskingData(inputValue, {
//       mask: numberMask,
//       currentCursorPosition: 4,
//       guide: false,
//       placeholderChar,
//       ...previous,
//     });

//     expect(maskedData).toEqual({
//       conformedValue: '123.',
//       rawValue: '123.',
//       placeholder: '___.',
//       indexesOfPipedChars: [],
//       cursorTrapIndexes: [3, 4],
//     });

//     adjustedCursor = getAdjustedCursorPosition({
//       ...previous,
//       currentCursorPosition: 4,
//       conformedValue: maskedData.conformedValue,
//       inputValue,
//       placeholderChar,
//       placeholder: maskedData.placeholder,
//       indexesOfPipedChars: maskedData.indexesOfPipedChars,
//       cursorTrapIndexes: maskedData.cursorTrapIndexes,
//     });

//     expect(adjustedCursor).toBe(4);
//   });

//   test('removing decimal symbol in value with thousands seperator symbol', () => {
//     let numberMask = createNumberMask({ allowDecimal: true });
//     let placeholderChar = '_';
//     let maskedData;
//     let adjustedCursor;
//     let inputValue = '1,234';

//     let previous = {
//       previousRawValue: '1234.',
//       previousConformedValue: '1,234.',
//       previousPlaceholder: '_,___.',
//       previousCursorPosition: 6,
//     };

//     maskedData = getMaskingData(inputValue, {
//       mask: numberMask,
//       currentCursorPosition: 5,
//       guide: false,
//       placeholderChar,
//       ...previous,
//     });

//     expect(maskedData).toEqual({
//       conformedValue: '1,234',
//       rawValue: '1234',
//       placeholder: '_,___',
//       indexesOfPipedChars: [],
//       cursorTrapIndexes: [],
//     });

//     adjustedCursor = getAdjustedCursorPosition({
//       ...previous,
//       currentCursorPosition: 5,
//       conformedValue: maskedData.conformedValue,
//       inputValue,
//       placeholderChar,
//       placeholder: maskedData.placeholder,
//       indexesOfPipedChars: maskedData.indexesOfPipedChars,
//       cursorTrapIndexes: maskedData.cursorTrapIndexes,
//     });

//     expect(adjustedCursor).toBe(5);
//   });

//   test('typing decimal char first with prefix', () => {
//     let numberMask = createNumberMask({ allowDecimal: true, prefix: '$' });
//     let placeholderChar = '_';
//     let maskedData;
//     let adjustedCursor;
//     let inputValue = '.';

//     let previous = {
//       previousRawValue: '',
//       previousConformedValue: '',
//       previousPlaceholder: '',
//     };

//     maskedData = getMaskingData(inputValue, {
//       mask: numberMask,
//       currentCursorPosition: 1,
//       guide: false,
//       placeholderChar,
//       ...previous,
//     });

//     expect(maskedData).toEqual({
//       conformedValue: '$0.',
//       rawValue: '.',
//       placeholder: '$0._',
//       indexesOfPipedChars: [],
//       cursorTrapIndexes: [],
//     });

//     adjustedCursor = getAdjustedCursorPosition({
//       ...previous,
//       currentCursorPosition: 1,
//       conformedValue: maskedData.conformedValue,
//       inputValue,
//       placeholderChar,
//       placeholder: maskedData.placeholder,
//       indexesOfPipedChars: maskedData.indexesOfPipedChars,
//       cursorTrapIndexes: maskedData.cursorTrapIndexes,
//     });

//     expect(adjustedCursor).toBe(3);
//   });

//   test('type decimal char whith prefix already there', () => {
//     let numberMask = createNumberMask({ allowDecimal: true, prefix: '$' });
//     let placeholderChar = '_';
//     let maskedData;
//     let adjustedCursor;
//     let inputValue = '.';

//     let previous = {
//       previousConformedValue: '',
//       previousRawValue: '',
//       previousPlaceholder: '$_',
//     };

//     maskedData = getMaskingData(inputValue, {
//       mask: numberMask,
//       currentCursorPosition: 2,
//       guide: false,
//       placeholderChar,
//       ...previous,
//     });

//     expect(maskedData).toEqual({
//       conformedValue: '$0.',
//       rawValue: '.',
//       placeholder: '$0._',
//       indexesOfPipedChars: [],
//       cursorTrapIndexes: [],
//     });

//     adjustedCursor = getAdjustedCursorPosition({
//       ...previous,
//       currentCursorPosition: 2,
//       conformedValue: maskedData.conformedValue,
//       inputValue,
//       placeholderChar,
//       placeholder: maskedData.placeholder,
//       indexesOfPipedChars: maskedData.indexesOfPipedChars,
//       cursorTrapIndexes: maskedData.cursorTrapIndexes,
//     });

//     expect(adjustedCursor).toBe(3);
//   });

//   test('type decimal after value that contains a masked character (1,234 -> 1,234.)', () => {
//     let numberMask = createNumberMask({ allowDecimal: true });
//     let placeholderChar = '_';
//     let maskedData;
//     let adjustedCursor;
//     let inputValue = '1,234.';

//     let previous = {
//       previousConformedValue: '1,234',
//       previousRawValue: '1234',
//       previousPlaceholder: '_,___',
//     };

//     maskedData = getMaskingData(inputValue, {
//       mask: numberMask,
//       currentCursorPosition: 6,
//       guide: false,
//       placeholderChar,
//       ...previous,
//     });

//     expect(maskedData).toEqual({
//       conformedValue: '1,234.',
//       rawValue: '1234.',
//       placeholder: '_,___.',
//       indexesOfPipedChars: [],
//       cursorTrapIndexes: [5, 6],
//     });

//     adjustedCursor = getAdjustedCursorPosition({
//       ...previous,
//       currentCursorPosition: 6,
//       conformedValue: maskedData.conformedValue,
//       inputValue,
//       placeholderChar,
//       placeholder: maskedData.placeholder,
//       indexesOfPipedChars: maskedData.indexesOfPipedChars,
//       cursorTrapIndexes: maskedData.cursorTrapIndexes,
//     });

//     expect(adjustedCursor).toBe(6);
//   });

//   test('add digit before decimal that also adds a masked character (123.9 -> 1,234.9', () => {
//     let numberMask = createNumberMask({ allowDecimal: true });
//     let placeholderChar = '_';
//     let maskedData;
//     let adjustedCursor;
//     let inputValue = '1,234.9';

//     let previous = {
//       previousConformedValue: '123.9',
//       previousRawValue: '123.9',
//       previousPlaceholder: '___._',
//       previousCursorPosition: 3,
//     };

//     maskedData = getMaskingData(inputValue, {
//       mask: numberMask,
//       currentCursorPosition: 5,
//       guide: false,
//       placeholderChar,
//       ...previous,
//     });

//     expect(maskedData).toEqual({
//       conformedValue: '1,234.9',
//       rawValue: '1234.9',
//       placeholder: '_,___._',
//       indexesOfPipedChars: [],
//       cursorTrapIndexes: [5, 6],
//     });

//     adjustedCursor = getAdjustedCursorPosition({
//       ...previous,
//       currentCursorPosition: 5,
//       conformedValue: maskedData.conformedValue,
//       inputValue,
//       placeholderChar,
//       placeholder: maskedData.placeholder,
//       indexesOfPipedChars: maskedData.indexesOfPipedChars,
//       cursorTrapIndexes: maskedData.cursorTrapIndexes,
//     });

//     expect(adjustedCursor).toBe(5);
//   });
// });
