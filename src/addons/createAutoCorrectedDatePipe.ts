import { PipeResult } from 'types';

const maxDayPerMonth = [31, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const defaultMax = {
  DD: 31,
  MM: 12,
  YY: 99,
  YYYY: 9999,
  HH: 23,
  hh: 12,
  mm: 59,
  ss: 59,
};
const defaultMin = {
  DD: 1,
  MM: 1,
  YY: 0,
  YYYY: 0,
  HH: 0,
  hh: 1,
  mm: 0,
  ss: 0,
};

type PipeConfig = {
  maxValueLookup?: any;
  minValueLookup?: any;
  formatCharsRegex?: RegExp;
};

export function createAutoCorrectedDatePipe(
  dateFormat: string = 'MM/DD/YYYY',
  {
    maxValueLookup = defaultMax,
    minValueLookup = defaultMin,
    formatCharsRegex = /[^DMmYHhsAa]+/,
  }: PipeConfig = {}
) {
  const dateFormatArray = dateFormat.split(formatCharsRegex);

  return function(conformedValue: string): PipeResult {
    const indexesOfPipedChars: number[] = [];
    const conformedValueArr = conformedValue.split('');

    // Check first digit
    dateFormatArray.forEach(format => {
      const position = dateFormat.indexOf(format);

      if (maxValueLookup[format]) {
        const maxFirstDigit = parseInt(
          maxValueLookup[format].toString().substr(0, 1),
          10
        );

        if (parseInt(conformedValueArr[position], 10) > maxFirstDigit) {
          conformedValueArr[position + 1] = conformedValueArr[position];
          conformedValueArr[position] = '0';
          indexesOfPipedChars.push(position);
        }
      }
    });

    // Check for invalid date
    let month = 0;
    const isInvalid = dateFormatArray.some(format => {
      const position = dateFormat.indexOf(format);
      const length = format.length;
      const textValue = conformedValue
        .substr(position, length)
        .replace(/\D/g, '');
      const value = parseInt(textValue, 10);
      if (format === 'mm') {
        month = value || 0;
      }
      const maxValueLookupForFormat =
        format === 'dd' ? maxDayPerMonth[month] : maxValueLookup[format];
      if (format === 'yyyy') {
        const scopedMaxValue = parseInt(
          maxValueLookup[format].toString().substring(0, textValue.length),
          10
        );
        const scopedMinValue = parseInt(
          minValueLookup[format].toString().substring(0, textValue.length),
          10
        );
        return value < scopedMinValue || value > scopedMaxValue;
      }
      return (
        value > maxValueLookupForFormat ||
        (textValue.length === length && value < minValueLookup[format])
      );
    });

    if (isInvalid) {
      return {};
    }

    return {
      value: conformedValueArr.join(''),
      indexesOfPipedChars,
    };
  };
}
