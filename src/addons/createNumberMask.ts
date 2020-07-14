import { MaskIndex } from '../types';

const minus = '-';
const minusRegExp = /-/;
const nonDigitsRegExp = /\D+/g;
const number = 'number';
const digitRegExp = /\d/;
const cursorTrap = '[]';

export function createNumberMask({
  prefix = '',
  suffix = '',
  includeThousandsSeparator = true,
  thousandsSeparatorSymbol = ',',
  allowDecimal = false,
  decimalSymbol = '.',
  decimalLimit = 2,
  requireDecimal = false,
  allowNegative = false,
  allowLeadingZeros = false,
  integerLimit = null,
} = {}) {
  const prefixLength = (prefix && prefix.length) || 0;
  const suffixLength = (suffix && suffix.length) || 0;
  const thousandsSeparatorSymbolLength =
    (thousandsSeparatorSymbol && thousandsSeparatorSymbol.length) || 0;

  function numberMask(inputValue = ''): MaskIndex[] {
    const inputValueLength = inputValue.length;

    if (
      inputValue === '' ||
      (inputValue[0] === prefix[0] && inputValueLength === 1)
    ) {
      return (prefix.split('') as MaskIndex[])
        .concat(digitRegExp)
        .concat(suffix.split(''));
    } else if (inputValue === decimalSymbol && allowDecimal) {
      return (prefix.split('') as MaskIndex[])
        .concat(['0', decimalSymbol, digitRegExp])
        .concat(suffix.split(''));
    }

    const isNegative = inputValue[0] === minus && allowNegative;

    // If negative remove "-" sign
    if (isNegative) {
      inputValue = inputValue.toString().substr(1);
    }

    const indexOfLastDecimal = inputValue.lastIndexOf(decimalSymbol);
    const hasDecimal = indexOfLastDecimal !== -1;

    let integer;
    let fraction;
    let mask: MaskIndex[];

    // remove the suffix
    if (inputValue.slice(suffixLength * -1) === suffix) {
      inputValue = inputValue.slice(0, suffixLength * -1);
    }

    if (hasDecimal && (allowDecimal || requireDecimal)) {
      integer = inputValue.slice(
        inputValue.slice(0, prefixLength) === prefix ? prefixLength : 0,
        indexOfLastDecimal
      );

      fraction = inputValue.slice(indexOfLastDecimal + 1, inputValueLength);
      fraction = convertToMask(fraction.replace(nonDigitsRegExp, ''));
    } else {
      if (inputValue.slice(0, prefixLength) === prefix) {
        integer = inputValue.slice(prefixLength);
      } else {
        integer = inputValue;
      }
    }

    if (integerLimit && typeof integerLimit === number) {
      const thousandsSeparatorRegex =
        thousandsSeparatorSymbol === '.'
          ? '[.]'
          : `${thousandsSeparatorSymbol}`;
      const numberOfThousandSeparators = (
        integer.match(new RegExp(thousandsSeparatorRegex, 'g')) || []
      ).length;

      integer = integer.slice(
        0,
        integerLimit! +
          numberOfThousandSeparators * thousandsSeparatorSymbolLength
      );
    }

    integer = integer.replace(nonDigitsRegExp, '');

    if (!allowLeadingZeros) {
      integer = integer.replace(/^0+(0$|[^0])/, '$1');
    }

    integer = includeThousandsSeparator
      ? addThousandsSeparator(integer, thousandsSeparatorSymbol)
      : integer;

    mask = convertToMask(integer);

    if ((hasDecimal && allowDecimal) || requireDecimal === true) {
      if (inputValue[indexOfLastDecimal - 1] !== decimalSymbol) {
        mask.push(cursorTrap);
      }

      mask.push(decimalSymbol, cursorTrap);

      if (fraction) {
        if (typeof decimalLimit === number) {
          fraction = fraction.slice(0, decimalLimit);
        }

        mask = mask.concat(fraction);
      }

      if (
        requireDecimal === true &&
        inputValue[indexOfLastDecimal - 1] === decimalSymbol
      ) {
        mask.push(digitRegExp);
      }
    }

    if (prefixLength > 0) {
      mask = (prefix.split('') as MaskIndex[]).concat(mask);
    }

    if (isNegative) {
      // If user is entering a negative number, add a mask placeholder spot to attract the cursor to it.
      if (mask.length === prefixLength) {
        mask.push(digitRegExp);
      }

      mask = ([minusRegExp] as MaskIndex[]).concat(mask);
    }

    if (suffix.length > 0) {
      mask = mask.concat(suffix.split(''));
    }

    return mask;
  }

  numberMask.instanceOf = 'createNumberMask';

  return numberMask;
}

function convertToMask(strNumber: string): MaskIndex[] {
  return strNumber
    .split('')
    .map(char => (digitRegExp.test(char) ? digitRegExp : char));
}

// http://stackoverflow.com/a/10899795/604296
function addThousandsSeparator(
  value: string,
  thousandsSeparatorSymbol: string
): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparatorSymbol);
}
