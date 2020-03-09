import React from 'react';
import useMask from '../src';
import { createAutoCorrectedDatePipe } from '../src/addons';
import { format } from 'date-fns';

export default { title: 'Date Mask' };

const DateInput = ({ initial = '', config = {} }) => {
  const [value, setValue] = React.useState(initial);

  const mask = useMask({
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
    onChange: setValue,
    value,
    keepCharPositions: true,
    showMask: true,
    ...config,
  });

  return (
    <>
      <input {...mask} />
      <button onClick={() => setValue(format(new Date(), 'MM/dd/yyyy'))}>
        Today
      </button>
    </>
  );
};

export const dateMask = () => <DateInput />;

const pipe = createAutoCorrectedDatePipe('MM/DD/YYYY');

export const withPipe = () => <DateInput config={{ pipe }} />;
export const withInitialValue = () => (
  <DateInput initial={format(new Date(), 'MM/dd/yyyy')} config={{ pipe }} />
);
