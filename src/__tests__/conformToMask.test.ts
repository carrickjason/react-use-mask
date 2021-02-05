import {
  conformToMask,
  ConformConfig,
  getChangeIndexRange,
} from '../conformToMask';

const digit = /\d/;

describe('conformToMask', () => {
  describe('default', () => {
    const defaultConfig: ConformConfig = {
      guide: true,
      previousConformedValue: '',
      currentCursorPosition: 0,
      keepCharPositions: false,
      cursorTrapIndexes: [],
    };

    it('handles accepted single character entry', () => {
      let { conformedValue } = conformToMask(
        '1',
        [digit, '/', digit],
        defaultConfig
      );
      expect(conformedValue).toBe('1/_');
    });

    it('handles full initial value', () => {
      let { conformedValue } = conformToMask(
        '11/11/2021',
        [digit, digit, '/', digit, digit, '/', digit, digit, digit, digit],
        defaultConfig
      );

      expect(conformedValue).toBe('11/11/2021');
    });

    it('it adds masked chars that are adjacent to accepted input', () => {
      let { conformedValue } = conformToMask(
        '1',
        [digit, '/', '/', '/', digit],
        {
          ...defaultConfig,
        }
      );
      expect(conformedValue).toBe('1///_');
    });

    it('places input that was added in the position of a masked char', () => {
      let { conformedValue } = conformToMask('12/_', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '1/_',
      });
      expect(conformedValue).toBe('1/2');
    });

    it('handles pasted input', () => {
      let { conformedValue } = conformToMask('12', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '',
      });
      expect(conformedValue).toBe('1/2');
    });

    it('handles pasted input with masked chars', () => {
      let { conformedValue } = conformToMask(
        '1/2//',
        [digit, '/', '/', '/', digit],
        {
          ...defaultConfig,
          currentCursorPosition: 5,
          previousConformedValue: '',
        }
      );
      expect(conformedValue).toBe('1///2');
    });

    it('handles simple deletion from end of value', () => {
      let { conformedValue } = conformToMask('1/', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '1/2',
      });
      expect(conformedValue).toBe('1/_');
    });

    it('handles deletion of single character mid-value', () => {
      let { conformedValue } = conformToMask(
        '1/_',
        [digit, digit, '/', digit],
        {
          ...defaultConfig,
          currentCursorPosition: 1,
          previousConformedValue: '12/_',
        }
      );
      expect(conformedValue).toBe('1_/_');
    });

    it('handles deletion of masked character', () => {
      let { conformedValue } = conformToMask('1_', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 1,
        previousConformedValue: '1/_',
      });
      expect(conformedValue).toBe('1/_');
    });

    it('handles deletion of selection', () => {
      let { conformedValue } = conformToMask(
        '14',
        [digit, digit, '/', digit, digit],
        {
          ...defaultConfig,
          currentCursorPosition: 1,
          previousConformedValue: '12/34',
        }
      );
      expect(conformedValue).toBe('14/__');
    });
  });

  describe('guide = false', () => {
    const defaultConfig: ConformConfig = {
      guide: false,
      previousConformedValue: '',
      currentCursorPosition: 1,
      keepCharPositions: false,
      cursorTrapIndexes: [],
    };

    it('handles accepted single character entry', () => {
      let { conformedValue } = conformToMask(
        '1',
        [digit, '/', digit],
        defaultConfig
      );
      expect(conformedValue).toBe('1/');
    });

    it('it adds masked chars that are adjacent to accepted input', () => {
      let { conformedValue } = conformToMask(
        '1',
        [digit, '/', '/', '/', digit],
        {
          ...defaultConfig,
        }
      );
      expect(conformedValue).toBe('1///');
    });

    it('places input that was added in the position of a masked char', () => {
      let { conformedValue } = conformToMask('12/', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '1/',
      });
      expect(conformedValue).toBe('1/2');
    });

    it('handles pasted input', () => {
      let { conformedValue } = conformToMask('12', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '',
      });
      expect(conformedValue).toBe('1/2');
    });

    it('handles pasted input with masked chars', () => {
      let { conformedValue } = conformToMask(
        '1/2//',
        [digit, '/', '/', '/', digit],
        {
          ...defaultConfig,
          currentCursorPosition: 5,
          previousConformedValue: '',
        }
      );
      expect(conformedValue).toBe('1///2');
    });

    it('handles simple deletion from end of value', () => {
      let { conformedValue } = conformToMask('1/', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '1/2',
      });
      expect(conformedValue).toBe('1/');
    });

    it('handles deletion of single character mid-value', () => {
      let { conformedValue } = conformToMask('1/', [digit, digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 1,
        previousConformedValue: '12/',
      });
      expect(conformedValue).toBe('1');
    });

    it('handles deletion of masked character', () => {
      let { conformedValue } = conformToMask('1', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 1,
        previousConformedValue: '1/',
      });
      expect(conformedValue).toBe('1');
    });

    it('handles deletion of selection', () => {
      let { conformedValue } = conformToMask(
        '14',
        [digit, digit, '/', digit, digit],
        {
          ...defaultConfig,
          currentCursorPosition: 1,
          previousConformedValue: '12/34',
        }
      );
      expect(conformedValue).toBe('14');
    });
  });

  describe('keepCharPositions = true', () => {
    const defaultConfig: ConformConfig = {
      guide: false,
      previousConformedValue: '',
      currentCursorPosition: 0,
      keepCharPositions: true,
      cursorTrapIndexes: [],
    };

    it('handles full initial value', () => {
      let { conformedValue } = conformToMask(
        '11/11/2021',
        [digit, digit, '/', digit, digit, '/', digit, digit, digit, digit],
        defaultConfig
      );

      expect(conformedValue).toBe('11/11/2021');
    });

    it('handles entering char between existing chars', () => {
      let { conformedValue } = conformToMask(
        '12_/_4',
        [digit, digit, '/', digit, digit],
        {
          ...defaultConfig,
          currentCursorPosition: 2,
          previousConformedValue: '1_/_4',
        }
      );
      expect(conformedValue).toBe('12/_4');
    });

    it('handles entering char between existing chars in the position of a masked char', () => {
      let { conformedValue } = conformToMask(
        '12/_3',
        [digit, '/', digit, digit],
        {
          ...defaultConfig,
          currentCursorPosition: 2,
          previousConformedValue: '1/_3',
        }
      );
      expect(conformedValue).toBe('1/23');
    });

    it('handles pasting chars between existing chars', () => {
      let { conformedValue } = conformToMask(
        '123_/_4',
        [digit, digit, '/', digit, digit],
        {
          ...defaultConfig,
          currentCursorPosition: 3,
          previousConformedValue: '1_/_4',
        }
      );
      expect(conformedValue).toBe('12/34');
    });

    it('handles simple deletion from end of value', () => {
      let { conformedValue } = conformToMask('1/', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '1/2',
      });
      expect(conformedValue).toBe('1/_');
    });

    it('handles deletion of single character mid-value', () => {
      let { conformedValue } = conformToMask(
        '1/3',
        [digit, digit, '/', digit],
        {
          ...defaultConfig,
          currentCursorPosition: 1,
          previousConformedValue: '12/3',
        }
      );
      expect(conformedValue).toBe('1_/3');
    });

    it('handles deletion of masked character', () => {
      let { conformedValue } = conformToMask('1_', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 1,
        previousConformedValue: '1/_',
      });
      expect(conformedValue).toBe('1/_');
    });

    it('handles deletion of selection', () => {
      let { conformedValue } = conformToMask(
        '14',
        [digit, digit, '/', digit, digit],
        {
          ...defaultConfig,
          currentCursorPosition: 1,
          previousConformedValue: '12/34',
        }
      );
      expect(conformedValue).toBe('1_/_4');
    });
  });
});

describe('getChangeIndexRange', () => {
  it('returns correct range with single input', () => {
    let [start, end] = getChangeIndexRange({
      currentCursorPosition: 1,
      isAddition: true,
      editDistance: 1,
    });

    expect(start).toBe(0);
    expect(end).toBe(1);
  });

  it('returns correct range with bulk input', () => {
    let [start, end] = getChangeIndexRange({
      currentCursorPosition: 2,
      isAddition: true,
      editDistance: 2,
    });

    expect(start).toBe(0);
    expect(end).toBe(2);
  });

  it('returns correct range when simulating initial value', () => {
    let [start, end] = getChangeIndexRange({
      currentCursorPosition: 0,
      isAddition: true,
      editDistance: 2,
    });

    expect(start).toBe(0);
    expect(end).toBe(2);
  });
});
