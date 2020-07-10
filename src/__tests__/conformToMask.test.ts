import { conformToMask, ConformConfig } from '../conformToMask';

const digit = /\d/;

describe('conformToMask', () => {
  describe('default', () => {
    const defaultConfig: ConformConfig = {
      guide: true,
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
      expect(conformedValue).toBe('1/_');
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
      let { conformedValue } = conformToMask('11/_', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '1/_',
      });
      expect(conformedValue).toBe('1/1');
    });

    it('handles pasted input', () => {
      let { conformedValue } = conformToMask('11', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '',
      });
      expect(conformedValue).toBe('1/1');
    });

    it('handles pasted input with masked chars', () => {
      let { conformedValue } = conformToMask(
        '1/1//',
        [digit, '/', '/', '/', digit],
        {
          ...defaultConfig,
          currentCursorPosition: 5,
          previousConformedValue: '',
        }
      );
      expect(conformedValue).toBe('1///1');
    });

    it('handles simple deletion from end of value', () => {
      let { conformedValue } = conformToMask('1/', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '1/1',
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
          previousConformedValue: '11/_',
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
        '11',
        [digit, digit, '/', digit, digit],
        {
          ...defaultConfig,
          currentCursorPosition: 1,
          previousConformedValue: '11/11',
        }
      );
      expect(conformedValue).toBe('11/__');
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
      let { conformedValue } = conformToMask('11/', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '1/',
      });
      expect(conformedValue).toBe('1/1');
    });

    it('handles pasted input', () => {
      let { conformedValue } = conformToMask('11', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '',
      });
      expect(conformedValue).toBe('1/1');
    });

    it('handles pasted input with masked chars', () => {
      let { conformedValue } = conformToMask(
        '1/1//',
        [digit, '/', '/', '/', digit],
        {
          ...defaultConfig,
          currentCursorPosition: 5,
          previousConformedValue: '',
        }
      );
      expect(conformedValue).toBe('1///1');
    });

    it('handles simple deletion from end of value', () => {
      let { conformedValue } = conformToMask('1/', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '1/1',
      });
      expect(conformedValue).toBe('1/');
    });

    it('handles deletion of single character mid-value', () => {
      let { conformedValue } = conformToMask('1/', [digit, digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 1,
        previousConformedValue: '11/',
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
        '11',
        [digit, digit, '/', digit, digit],
        {
          ...defaultConfig,
          currentCursorPosition: 1,
          previousConformedValue: '11/11',
        }
      );
      expect(conformedValue).toBe('11');
    });
  });

  describe('keepCharPositions = true', () => {
    const defaultConfig: ConformConfig = {
      guide: false,
      previousConformedValue: '',
      currentCursorPosition: 1,
      keepCharPositions: true,
      cursorTrapIndexes: [],
    };

    it('handles entering char between existing chars', () => {
      let { conformedValue } = conformToMask(
        '11_/_1',
        [digit, digit, '/', digit, digit],
        {
          ...defaultConfig,
          currentCursorPosition: 2,
          previousConformedValue: '1_/_1',
        }
      );
      expect(conformedValue).toBe('11/_1');
    });

    it('handles entering char between existing chars in the position of a masked char', () => {
      let { conformedValue } = conformToMask(
        '11/_1',
        [digit, '/', digit, digit],
        {
          ...defaultConfig,
          currentCursorPosition: 2,
          previousConformedValue: '1/_1',
        }
      );
      expect(conformedValue).toBe('1/11');
    });

    it('handles pasting chars between existing chars', () => {
      let { conformedValue } = conformToMask(
        '111_/_1',
        [digit, digit, '/', digit, digit],
        {
          ...defaultConfig,
          currentCursorPosition: 3,
          previousConformedValue: '1_/_1',
        }
      );
      expect(conformedValue).toBe('11/11');
    });

    it('handles simple deletion from end of value', () => {
      let { conformedValue } = conformToMask('1/', [digit, '/', digit], {
        ...defaultConfig,
        currentCursorPosition: 2,
        previousConformedValue: '1/1',
      });
      expect(conformedValue).toBe('1/_');
    });

    it('handles deletion of single character mid-value', () => {
      let { conformedValue } = conformToMask(
        '1/1',
        [digit, digit, '/', digit],
        {
          ...defaultConfig,
          currentCursorPosition: 1,
          previousConformedValue: '11/1',
        }
      );
      expect(conformedValue).toBe('1_/1');
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
        '11',
        [digit, digit, '/', digit, digit],
        {
          ...defaultConfig,
          currentCursorPosition: 1,
          previousConformedValue: '11/11',
        }
      );
      expect(conformedValue).toBe('1_/_1');
    });
  });
});
