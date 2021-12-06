import React from 'react';
import { components, IndicatorProps, OptionTypeBase } from 'react-select';
import SearchIcon from '../../../components/svg-components/search-icon/SearchIcon';

const DropdownIndicator: React.FC<IndicatorProps<OptionTypeBase, false>> = (props) => (
  <components.DropdownIndicator {...props}>
    <SearchIcon fill='transparent' width={16} height={16} />
  </components.DropdownIndicator>
);

export default DropdownIndicator;
