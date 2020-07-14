import { getRawValue } from './utils';

describe('getRawValue', () => {
  it('correctly filters out masked and placeholder characters', () => {
    expect(getRawValue('1/_', '_/_', '_')).toBe('1');
    expect(getRawValue('1/', ' / ', ' ')).toBe('1');
  });
});
