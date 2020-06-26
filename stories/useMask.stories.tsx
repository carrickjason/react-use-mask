import React from 'react';
import { useMask } from '../src/useMask';
import { boolean } from '@storybook/addon-knobs';

export default { title: 'useMask' };

const MaskedInput = ({ initial = '', config = {} }) => {
  const [value, setValue] = React.useState(initial);

  const mask = useMask({
    mask: [/\d/, '/', /\d/],
    onChange: setValue,
    value,
    keepCharPositions: boolean('keepCharPositions', true),
    guide: boolean('guide', true),
    placeholderChar: ' ',
    ...config,
  });

  return <input {...mask} />;
};

export const _useMask = () => <MaskedInput />;
