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

export type ConformToMaskConfig = {
  previousConformedValue: string;
  guide: boolean;
  placeholderChar: string;
  currentCursorPosition: number;
  keepCharPositions: boolean;
  cursorTrapIndexes: number[];
};

export type PipeConfig = {
  inputValue: string;
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

export type Pipe = (conformedValue: string, config: PipeConfig) => PipeResult;

export type MaskIndex = RegExp | string;
export type Mask = MaskIndex[] | false;

export type MaskGetter = (
  rawValue: string,
  config: {
    currentCursorPosition: number;
    previousConformedValue: string | null;
    placeholderChar: string;
  }
) => Mask;

export type MaskOrMaskGetter = Mask | MaskGetter;

export type MaskingData = {
  conformedValue: string | null;
  rawValue: string;
  placeholder: string;
  indexesOfPipedChars: number[];
  cursorTrapIndexes: number[];
};
