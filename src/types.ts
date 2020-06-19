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
  value: string;
  indexesOfPipedChars?: number[];
  rejected?: boolean;
};

export type Pipe = (
  conformedValue: string,
  config: MaskAndPipeConfig & {
    rawValue: string;
  }
) => false | string | PipeResult;

export type MaskIndex = RegExp | string;
export type Mask = MaskIndex[] | false;
export type MaskAndPipe = {
  mask: Mask;
  pipe: Pipe;
};
export type MaskProp = Mask | MaskAndPipe;

export type MaskGetter = (
  rawValue: string,
  config: {
    currentCursorPosition: number;
    previousConformedValue: string;
    placeholderChar: string;
  }
) => Mask;

export type MaskOrMaskGetter = MaskProp | MaskGetter;

export type MaskingData = {
  conformedValue: string;
  rawValue: string;
  placeholder: string;
  indexesOfPipedChars: number[];
  cursorTrapIndexes: number[];
};

export type EventRef = null | {
  value: string;
  start: number | null;
  target: HTMLInputElement;
};
