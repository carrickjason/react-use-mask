import React from 'react';
import useMask from '../src';
import { createAutoCorrectedDatePipe } from '../src/addons';

export default { title: 'Date Mask' };

const DateInput = ({ initial = '', config = {} }) => {
  const [value, setValue] = React.useState(initial);

  const [ref, mask] = useMask({
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    onChange: setValue,
    value,
    keepCharPositions: true,
    showMask: true,
    ...config,
  });

  return <input ref={ref} {...mask} />;
};

export const dateMask = () => <DateInput />;

const pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');

export const withPipe = () => <DateInput config={{ pipe }} />;
export const withInitialValue = () => (
  <DateInput initial="03/09/2020" config={{ pipe }} />
);
