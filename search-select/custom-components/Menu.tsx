import React from 'react';
import { components, MenuProps, OptionTypeBase } from 'react-select';

import ActionButtons from '../../action-buttons/ActionButtons';

const Menu: React.FC<MenuProps<OptionTypeBase, false>> = (options) => {
  const values = options.selectProps.value;

  const onSelectCancel = () => {
    options.clearValue();
    options.setValue(null, 'deselect-option');
    options.selectProps.onCancel;
  };

  return (
    <components.Menu {...options}>
      <div>
        <div>{options.children}</div>
        <span className='ml-2 text-s0gray-6 text-sm'>
          {values?.length || 0}
          <span className='ml-1'>selected</span>
        </span>
        <ActionButtons
          className='m-2'
          okLabel='Add'
          cancelLabel='Not now'
          onOk={options.selectProps.onOk}
          onCancel={onSelectCancel}
        />
      </div>
    </components.Menu>
  );
};

export default Menu;
