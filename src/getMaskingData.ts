import { conformToMask } from './conformToMask';
import {
  convertMaskToPlaceholder,
  getSafeRawValue,
  getRawValue,
  processCursorTraps,
} from './utils';

type MaskingConfig = {
  currentCursorPosition: number;
  previousConformedValue: string;
  previousPlaceholder: string;
  mask: MaskOrMaskGetter;
  placeholderChar: string;
  pipe?: Pipe;
  guide?: boolean;
  keepCharPositions?: boolean;
  showMask?: boolean;
};

export function getMaskingData(
  rawValue: string,
  {
    currentCursorPosition,
    previousConformedValue,
    previousPlaceholder,
    mask,
    guide = false,
    pipe,
    placeholderChar,
    keepCharPositions = false,
    showMask = false,
  }: MaskingConfig
): MaskingData {
  let providedMask = mask;
  let providedPipe = pipe;
  let usableMask: MaskIndex[];

  let result: MaskingData = {
    conformedValue: rawValue,
    rawValue: rawValue,
    placeholder: previousPlaceholder,
    indexesOfPipedChars: [],
    cursorTrapIndexes: [],
  };

  // *** Removing this functionality for now because I don't like it
  // // The api allows pipe to be passed by itself or as part of mask.
  // // If mask contains pipe set provided mask and pipe accordingly
  // if (
  //   typeof mask === 'object' &&
  //   mask.pipe !== undefined &&
  //   mask.mask !== undefined
  // ) {
  //   providedPipe = providedMask.pipe;
  //   providedMask = providedMask.mask;
  // }

  // If the provided mask is an array, we can call `convertMaskToPlaceholder` here once and we'll always have the
  // correct `placeholder`.
  if (providedMask instanceof Array) {
    result.placeholder = convertMaskToPlaceholder(
      providedMask,
      placeholderChar
    );
  }

  // In framework components that support reactivity, it's possible to turn off masking by passing
  // `false` for `mask` after initialization.
  if (providedMask === false) {
    return result;
  }

  // We check the provided `rawValue` before moving further.
  // If it's something we can't work with `getSafeRawValue` will throw.
  const safeRawValue = getSafeRawValue(rawValue);

  // If the `providedMask` is a function. We need to call it at every `update` to get the `mask` array.
  // Then we also need to get the `placeholder`
  if (typeof providedMask === 'function') {
    let processedMask = providedMask(safeRawValue, {
      currentCursorPosition,
      previousConformedValue,
      placeholderChar,
    });

    // disable masking if `processedMask` is `false`
    if (processedMask === false) {
      return result;
    }

    // mask functions can setup cursor traps to have some control over how the cursor moves. We need to process
    // the mask for any cursor traps. `processCursorTraps` will remove the cursor traps from the mask and return
    // the indexes of the cursor traps.
    const { maskWithoutCursorTraps, indexes } = processCursorTraps(
      processedMask
    );

    // The processed usableMask is what we're interested in
    usableMask = maskWithoutCursorTraps;
    // And we need to store these indexes because they're needed by `getAdjustedCaretPosition`
    result.cursorTrapIndexes = indexes;

    result.placeholder = convertMaskToPlaceholder(usableMask, placeholderChar);
  } else {
    // If the `providedMask` is not a function, we just use it as-is.
    usableMask = providedMask as MaskIndex[];
  }

  let maskAndPipeConfig = {
    previousConformedValue,
    guide,
    placeholderChar,
    placeholder: result.placeholder,
    currentCursorPosition,
    keepCharPositions,
    cursorTrapIndexes: result.cursorTrapIndexes,
  };

  // `conformToMask` returns `conformedValue` as part of an object for future API flexibility
  const { conformedValue } = conformToMask(
    safeRawValue,
    usableMask,
    maskAndPipeConfig
  );

  // Handle Pipe feature.
  const isPiped = typeof providedPipe === 'function';

  let pipeResults: PipeResult | null = null;

  // If `providedPipe` is a function, we call it.
  if (isPiped) {
    // `providedPipe` receives the `conformedValue` and the configurations with which `conformToMask` was called.
    let piped = providedPipe!(conformedValue, {
      rawValue: safeRawValue,
      ...maskAndPipeConfig,
    });

    // `piped` should be an object. But as a convenience, we allow the providedPipe author to just return `false` to
    // indicate rejection. Or return just a string when there are no piped characters.
    // If the `providedPipe` returns `false` or a string, the block below turns it into an object that the rest
    // of the code can work with.
    if (piped === false) {
      // If the `providedPipe` rejects `conformedValue`, we use the `previousConformedValue`, and set `rejected` to `true`.
      pipeResults = { value: previousConformedValue, rejected: true };
    } else if (typeof piped === 'string') {
      pipeResults = { value: piped };
    } else {
      pipeResults = piped;
    }
  }

  // Before we proceed, we need to know which conformed value to use, the one returned by the pipe or the one
  // returned by `conformToMask`.
  const usableConformedValue = pipeResults?.value ?? conformedValue;

  // Add indexesOfPipedChars to the result so that it can be used to adjust the cursor position.
  result.indexesOfPipedChars = pipeResults?.indexesOfPipedChars ?? [];

  // Get rawValue
  result.rawValue = getRawValue(
    usableConformedValue,
    result.placeholder,
    placeholderChar
  );

  // Text Mask sets the input value to an empty string when the condition below is set. It provides a better UX.
  const inputValueShouldBeEmpty =
    usableConformedValue === result.placeholder || !result.rawValue;

  result.conformedValue = inputValueShouldBeEmpty
    ? showMask
      ? result.placeholder
      : ''
    : usableConformedValue;

  return result;
}
