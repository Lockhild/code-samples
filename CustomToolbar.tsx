import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector
} from '@mui/x-data-grid';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SmsIcon from '@mui/icons-material/Sms';
import { DebounceInput } from './DebounceInput';
import { useState } from 'react';

interface ICustomToolbar {
  onImport?: () => void;
  onSendMessage: () => void;
  onChange: (value: string) => void;
  value: string;
  messageButtonDisabled: boolean;
}

const CustomToolbar: React.FC<ICustomToolbar> = (props) => {
  const { messageButtonDisabled, onImport, onSendMessage, onChange } = props;
  const [isOpenMaxHeight, setOpenMaxHeight] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenMaxHeight(event.currentTarget);
  };

  const handleMaxHeightClose = () => {
    setOpenMaxHeight(null);
  };

  const menuItem = {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    padding: '7px',
    justifyContent: 'left',
    paddingLeft: '60px'
  };

  return (
    <div>
      <GridToolbarContainer>
        <div className='flex-1'></div>
        <DebounceInput onChange={onChange} delay={500} />
        <IconButton
          aria-label='more'
          aria-controls='long-menu'
          aria-haspopup='true'
          sx={{ marginLeft: '20px', marginRight: '20px' }}
          onClick={handleClick}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          keepMounted
          id='long-menu'
          anchorEl={isOpenMaxHeight}
          onClose={handleMaxHeightClose}
          open={Boolean(isOpenMaxHeight)}
          PaperProps={{
            style: {
              width: '20ch'
            }
          }}>
          <MenuItem onClick={handleMaxHeightClose} sx={{ padding: 0 }}>
            <GridToolbarColumnsButton sx={menuItem} />
          </MenuItem>
          <MenuItem onClick={handleMaxHeightClose} sx={{ padding: 0 }}>
            <GridToolbarFilterButton sx={menuItem} />
          </MenuItem>
          <MenuItem onClick={handleMaxHeightClose} sx={{ padding: 0 }}>
            <GridToolbarDensitySelector sx={menuItem} />
          </MenuItem>
          <MenuItem
            onClick={handleMaxHeightClose}
            sx={{ padding: 0 }}
            disabled={messageButtonDisabled}>
            <Button
              type='button'
              size='small'
              startIcon={<SmsIcon />}
              onClick={onSendMessage}
              sx={menuItem}>
              Send SMS
            </Button>
          </MenuItem>
          <MenuItem onClick={handleMaxHeightClose} sx={{ padding: 0 }}>
            <Button
              type='button'
              size='small'
              startIcon={<UploadFileIcon />}
              onClick={onImport}
              sx={menuItem}>
              Import
            </Button>
          </MenuItem>
          <MenuItem onClick={handleMaxHeightClose} sx={{ padding: 0 }}>
            <GridToolbarExport sx={menuItem} />
          </MenuItem>
        </Menu>
      </GridToolbarContainer>
    </div>
  );
};

export default CustomToolbar;
