import { Styles, OptionTypeBase } from 'react-select';

export const SelectStyle: Styles<OptionTypeBase, false> = {
  control: (provided) => ({
    ...provided,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#1A1C26',
    borderRadius: '4px',
    paddingRight: '10px',
    paddingLeft: '15px',
    cursor: 'pointer',
    borderColor: 'transparent',
    boxShadow: 'none',
    '&:hover': {},
  }),

  input: (provided) => ({
    ...provided,
    color: 'white',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: '#1A1C26',
    boxShadow: 'none',
    margin: 0,
    borderRadius: '0 0 4px 4px',
    top: '95%',
    position: 'relative',
    padding: '10px',
    marginTop: '-12px',
  }),

  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : '#546380',
    backgroundColor: '#1A1C26',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: 'transparent',
    },
    fontSize: '14px'
  }),

  singleValue: (provided) => ({
    ...provided,
    backgroundColor: '#2d3748',
    color: 'white',
  }),

  noOptionsMessage: (priovided) => ({
    ...priovided,
    color: 'white',
  }),

  placeholder: (provided) => ({
    ...provided,
    color: '#546380',
    fontSize: '14px',
  }),
};
