import { forwardRef, useCallback, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Slide,
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Paper
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import UploadSingleFile from './UploadSingleFile';
import { csvToArray } from '../../../utils/csvToArray';
import { BasicTable } from './BasicTable';
import { IPatient, addPatients } from 'redux/slices/patients';
import { useDispatch } from 'redux/store';
import useNotify from 'hooks/useNotify';

export interface InitPatient {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  phone?: string;
  birthday?: string;
  gender?: string;
  firstVisit?: string;
  secondVisit?: string;
  thirdVisit?: string;
  lastVisit?: string;
}

const Transition = forwardRef(
  (
    props: TransitionProps & {
      children?: React.ReactElement;
    },
    ref: React.Ref<unknown>
  ) => <Slide direction='up' ref={ref} {...props} />
);

interface IFullScreenDialogProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const FullScreenDialog: React.FC<IFullScreenDialogProps> = ({ open, onOpen, onClose }) => {
  const [patients, setPatients] = useState<IPatient[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { notify } = useNotify();

  const onDropAccepted = async (files: File[]) => {
    setIsLoading(true);
    const file = await files[0].text();
    const patients = await csvToArray(file);

    setPatients(patients);
    setIsLoading(false);
  };

  const onDiscard = () => {
    setPatients(undefined);
  };

  const onAddPatients = () => {
    setIsLoading(true);

    if (patients) {
      dispatch(addPatients(patients)).then(() => notify.success('Patients were imported'));
    }

    onClose();
  };
  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar position='relative'>
        <Toolbar>
          <IconButton color='inherit' edge='start' onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <Typography variant='h6' sx={{ flex: 1, ml: 2 }}>
            Import patients
          </Typography>
          <Stack direction='row' spacing={2}>
            <Button color='inherit' onClick={onDiscard} disabled={!patients}>
              Discard
            </Button>
            <Button
              color='inherit'
              autoFocus
              variant='outlined'
              onClick={onAddPatients}
              disabled={!patients}>
              {`Import ${patients?.length ?? ''} patients`}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Card sx={{ borderRadius: 0, position: 'relative' }}>
        {isLoading && !patients && (
          <Paper
            sx={{
              position: 'absolute',
              top: '0',
              left: '0',
              zIndex: 999,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0.9,
              borderRadius: '0'
            }}>
            <CircularProgress size={60} />
          </Paper>
        )}
        <CardContent sx={{ padding: '0 !important', marginTop: '-1px' }}>
          {patients ? (
            <BasicTable patients={patients} />
          ) : (
            <UploadSingleFile file={null} onDropAccepted={onDropAccepted} />
          )}
        </CardContent>
      </Card>
    </Dialog>
  );
};

export default FullScreenDialog;
