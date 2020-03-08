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

  function numberMask(rawValue = '') {
    const rawValueLength = rawValue.length;

    if (
      rawValue === '' ||
      (rawValue[0] === prefix[0] && rawValueLength === 1)
    ) {
      return (prefix.split('') as MaskIndex[])
        .concat(digitRegExp)
        .concat(suffix.split(''));
    } else if (rawValue === decimalSymbol && allowDecimal) {
      return (prefix.split('') as MaskIndex[])
        .concat(['0', decimalSymbol, digitRegExp])
        .concat(suffix.split(''));
    }

    const isNegative = rawValue[0] === minus && allowNegative;
    //If negative remove "-" sign
    if (isNegative) {
      rawValue = rawValue.toString().substr(1);
    }

    const indexOfLastDecimal = rawValue.lastIndexOf(decimalSymbol);
    const hasDecimal = indexOfLastDecimal !== -1;

    let integer;
    let fraction;
    let mask: MaskIndex[];

    // remove the suffix
    if (rawValue.slice(suffixLength * -1) === suffix) {
      rawValue = rawValue.slice(0, suffixLength * -1);
    }

    if (hasDecimal && (allowDecimal || requireDecimal)) {
      integer = rawValue.slice(
        rawValue.slice(0, prefixLength) === prefix ? prefixLength : 0,
        indexOfLastDecimal
      );

      fraction = rawValue.slice(indexOfLastDecimal + 1, rawValueLength);
      fraction = convertToMask(fraction.replace(nonDigitsRegExp, ''));
    } else {
      if (rawValue.slice(0, prefixLength) === prefix) {
        integer = rawValue.slice(prefixLength);
      } else {
        integer = rawValue;
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
      if (rawValue[indexOfLastDecimal - 1] !== decimalSymbol) {
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
        rawValue[indexOfLastDecimal - 1] === decimalSymbol
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

function convertToMask(strNumber: string) {
  return strNumber
    .split('')
    .map(char => (digitRegExp.test(char) ? digitRegExp : char));
}

// http://stackoverflow.com/a/10899795/604296
function addThousandsSeparator(n: string, thousandsSeparatorSymbol: string) {
  return n.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparatorSymbol);
}
