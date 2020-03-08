type MaskAndPipeConfig = {
  previousConformedValue: string;
  guide: boolean;
  placeholderChar: string;
  placeholder: string;
  currentCursorPosition: number;
  keepCharPositions: boolean;
  cursorTrapIndexes: number[];
};

type PipeResult = {
  value: string;
  indexesOfPipedChars?: number[];
  rejected?: boolean;
};

type Pipe = (
  conformedValue: string,
  config: MaskAndPipeConfig & {
    rawValue: string;
  }
) => false | string | PipeResult;

type MaskIndex = RegExp | string;
type Mask = MaskIndex[] | false;
type MaskAndPipe = {
  mask: Mask;
  pipe: Pipe;
};
type MaskProp = Mask | MaskAndPipe;

type MaskGetter = (
  rawValue: string,
  config: {
    currentCursorPosition: number;
    previousConformedValue: string;
    placeholderChar: string;
  }
) => Mask;

type MaskOrMaskGetter = MaskProp | MaskGetter;

type MaskingData = {
  conformedValue: string;
  rawValue: string;
  placeholder: string;
  indexesOfPipedChars: number[];
  cursorTrapIndexes: number[];
};

type Props = {
  inputRef: React.MutableRefObject<HTMLInputElement>;
  mask: MaskOrMaskGetter;
  value: string;
  onChange: (value: string) => void;
  keepCharPositions?: boolean;
  placeholderChar?: string;
  pipe?: Pipe;
  guide?: boolean;
  showMask?: boolean;
};

type EventRef = null | {
  value: string;
  start: number | null;
};
