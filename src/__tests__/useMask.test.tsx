import * as React from 'react';
import { useMask } from '../useMask';
import { render, screen, fireEvent } from '@testing-library/react';

const defaultMaskConfig = {
  mask: [/\d/, '/', /\d/],
  onChange: jest.fn(),
  keepCharPositions: true,
  guide: true,
  placeholderChar: ' ',
};

const MaskedInput = ({ initial = '', config = {} }) => {
  const [value, setValue] = React.useState(initial);

  const mask = useMask({
    ...defaultMaskConfig,
    value,
    onChange: val => {
      defaultMaskConfig.onChange(val);
      setValue(val);
    },
    ...config,
  });

  return <input type="text" {...mask} />;
};

describe('useMask', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('allows deleting entire selection', () => {
    render(<MaskedInput />);

    let input = screen.getByRole('textbox') as HTMLInputElement;

    // we have to mock selectionStart until we can update our version of jest
    fireEvent.change(input, { target: { value: '1/1', selectionStart: 3 } });
    expect(input.selectionStart).toBe(3);
    expect(input.value).toBe('1/1');

    fireEvent.change(input, { target: { value: '', selectionStart: 0 } });
    expect(input.value).toBe('');
  });

  it('handles backspacing on a placeholder char', () => {
    render(<MaskedInput />);

    let input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '1', selectionStart: 1 } });
    expect(input.selectionStart).toBe(2);
    expect(input.value).toBe('1/ ');

    fireEvent.change(input, { target: { value: '1', selectionStart: 1 } });
    expect(input.selectionStart).toBe(0);
    expect(input.value).toBe('1/ ');
  });
});
