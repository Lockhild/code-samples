import React, { useCallback, useState } from 'react';
import Select from 'react-select';

import { SelectStyle } from './styles';
import Menu from './custom-components/Menu';
import Option from './custom-components/Option';
import DropdownIndicator from './custom-components/DropdownIndicator';
import { Response } from '../../helpers/types';
import { useSocket } from '../../helpers/socket';
import { ISearchSelectProps } from './';

export const SearchSelect: React.FC<ISearchSelectProps> = (props) => {
  const { selectOptions, isOpen } = props;
  const { sendMessage } = useSocket();

  const [selected, setSelected] = useState<string[] | undefined>();

  const onSelect = useCallback((options) => {
    const optionLabels = options.map((option) => option.label);

    setSelected(optionLabels);
  }, []);

  const onOk = useCallback(() => {
    if (!selected) {
      return;
    }
    sendMessage(JSON.stringify(selected), 'object');
  }, [selected, sendMessage]);

  const onCancel = useCallback(() => {
    sendMessage(Response.NEGATIVE);
  }, [sendMessage]);

  return (
    <Select
      //@ts-ignore
      isMulti
      menuIsOpen={isOpen}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      controlShouldRenderValue={false}
      styles={SelectStyle}
      components={{
        Menu,
        Option,
        DropdownIndicator,
        IndicatorSeparator: () => null,
        ClearIndicator: () => null,
      }}
      placeholder='Search for an app'
      options={selectOptions}
      onChange={onSelect}
      onOk={onOk}
      onCancel={onCancel}
      {...props}
    />
  );
};
