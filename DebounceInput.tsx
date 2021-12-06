import React, { forwardRef, useState } from 'react';
import debounce from 'lodash.debounce';

import SearchIcon from '@mui/icons-material/Search';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { IconButton, TextField } from '@mui/material';

export interface DebounceInputProps {
  onChange: (value: string) => void;
  delay: number;
}

export const DebounceInput = forwardRef((props: DebounceInputProps, ref: any) => {
  const { delay, onChange, ...inputProps } = props;

  const [value, setValue] = useState('');

  let debounced: () => void;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (setValue) {
      setValue(event.target.value);
    }

    event.persist();

    if (!debounced) {
      debounced = debounce(() => {
        onChange && onChange(event.target.value);
      }, delay);
    }

    debounced();
  };

  const onClear = () => {
    setValue('');
    onChange('');
  };

  return (
    <TextField
      {...inputProps}
      variant='outlined'
      value={value}
      size='small'
      onChange={handleChange}
      placeholder='Search…'
      InputProps={{
        startAdornment: <SearchIcon fontSize='small' sx={{ marginRight: '10px' }} />,
        endAdornment: (
          <IconButton
            title='Clear'
            aria-label='Clear'
            size='small'
            style={{ visibility: value ? 'visible' : 'hidden' }}
            onClick={onClear}>
            <HighlightOffIcon fontSize='small' />
          </IconButton>
        )
      }}
    />
  );
});
