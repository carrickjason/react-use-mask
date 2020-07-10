import * as React from 'react';

export type UseMaskArgs = {
  mask: MaskOrMaskGetter;
  value: string;
  onChange: (value: string) => void;
  keepCharPositions?: boolean;
  placeholderChar?: string;
  pipe?: Pipe;
  guide?: boolean;
  showMask?: boolean;
};

export type MaskedInputProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export type MaskAndPipeConfig = {
  previousConformedValue: string;
  guide: boolean;
  placeholderChar: string;
  placeholder: string;
  currentCursorPosition: number;
  keepCharPositions: boolean;
  cursorTrapIndexes: number[];
};

export type PipeResult = {
  value?: string;
  indexesOfPipedChars?: number[];
};

export type Pipe = (
  inputValue: string,
  conformedValue: string,
  config: MaskAndPipeConfig
) => PipeResult;

export type MaskIndex = RegExp | string;
export type Mask = MaskIndex[] | false;
export type MaskAndPipe = {
  mask: Mask;
  pipe: Pipe;
};

export type MaskGetter = (
  rawValue: string,
  config: {
    currentCursorPosition: number;
    previousConformedValue: string;
    placeholderChar: string;
  }
) => Mask;

export type MaskOrMaskGetter = Mask | MaskGetter;

export type MaskingData = {
  conformedValue: string;
  rawValue: string;
  placeholder: string;
  indexesOfPipedChars: number[];
  cursorTrapIndexes: number[];
};
