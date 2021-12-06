import { useRef, useEffect, useState, useMemo } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@mui/material';
import { GridSelectionModel } from '@mui/x-data-grid';
import { RootState, useDispatch, useSelector } from 'redux/store';
import { IPatient } from 'redux/slices/patients';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import useIsMountedRef from 'hooks/useIsMountedRef';
import { MobileDateTimePicker } from '@mui/lab';
import { isEmpty } from 'lodash';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MuiPhoneNumber from 'material-ui-phone-number';
import {
  addMessagesInQueue,
  sendMessage,
  TMessage,
} from 'redux/slices/messages';
import useNotify from 'hooks/useNotify';

interface ISendMessageDialogProps {
  patients: GridSelectionModel;
  open: boolean;
  onClose: () => void;
}

type InitialValues = {
  from: string;
  message: string;
  schedule: Date;
};

const SendMessageDialog: React.FC<ISendMessageDialogProps> = (props) => {
  const { open, onClose } = props;
  const descriptionElementRef = useRef<HTMLElement>(null);
  const { patients } = useSelector((state: RootState) => state.patients);
  const [viable, setViable] = useState<IPatient[]>([]);
  const isMountedRef = useIsMountedRef();
  const dispatch = useDispatch();
  const { notify } = useNotify();

  useEffect(() => {
    const filtered = patients.filter(
      (patient) => props.patients.includes(patient.id) && patient.phone?.length,
    );
    setViable(filtered);
  }, [props.patients, patients]);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  const ValidationSchema = Yup.object().shape({
    from: Yup.string()
      .required('From send ID is required')
      .matches(/^[a-zA-Z0-9]+$/, 'Only numbers and letters are allowed')
      .max(11, 'Maximum 11 characters')
      .min(3, 'Minimum 3 characters'),
    message: Yup.string()
      .required('SMS message is required')
      .max(300, 'Maximum 300 characters')
      .min(3, 'Minimum 3 characters'),
  });

  const formik = useFormik<InitialValues>({
    initialValues: {
      from: '',
      message: '',
      schedule: new Date(),
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { setErrors, setSubmitting, resetForm }) => {
      try {
        const messages: TMessage[] = viable.map((patient) => {
          const { id, firstName, lastName, phone } = patient;
          return {
            ...values,
            message: values.message.replace('{name}', patient.firstName),
            patient: {
              id,
              lastName,
              firstName,
              phone,
            },
          };
        });

        dispatch(addMessagesInQueue(messages)).then(() =>
          notify.success('Messages were added in queue'),
        );
        onClose();

        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        resetForm();
        if (isMountedRef.current) {
          setSubmitting(false);
          //@ts-ignore
          setErrors({ afterSubmit: error.message });
        }
      }
    },
  });

  const {
    errors,
    touched,
    values,
    handleSubmit,
    getFieldProps,
    setFieldValue,
  } = formik;

  const handleSend = () => {
    if (!viable.length) {
      notify.warn('No viable phone numbers!');
      return;
    }
    handleSubmit();
  };

  const isDisabled = useMemo(
    () => !values.from.length || !values.message.length || !isEmpty(errors),
    [errors, values],
  );

  const [testPhone, setTestPhone] = useState({ number: '', isValid: false });

  const handleTestPhone = (number: any) => {
    if (number.length === 18) {
      setTestPhone({ number, isValid: true });
      return;
    }
    setTestPhone({ number, isValid: false });
  };

  const handleTestSend = () => {
    if (!viable.length) {
      notify.warn('No viable phone numbers!');
      return;
    }
    const message = {
      from: values.from,
      to: testPhone.number.replace(/\s+|-|\(|\)/g, ''),
      body: values.message.replace('{name}', viable[0].firstName),
    };

    dispatch(sendMessage(message))
      .then(() => notify.success('SMS was sent'))
      .catch((error) => console.error(error));
  };

  return (
    <Dialog open={open} onClose={onClose} scroll={'paper'}>
      <DialogTitle sx={{ pb: 2 }}>
        Send SMS messages to {viable.length} patients
      </DialogTitle>
      <DialogContent dividers>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                type="text"
                label="From"
                {...getFieldProps('from')}
                error={Boolean(touched.from && errors.from)}
                helperText={touched.from && errors.from}
              />
              <TextField
                fullWidth
                type="text"
                multiline
                label="Message"
                {...getFieldProps('message')}
                error={Boolean(touched.message && errors.message)}
                helperText={touched.message && errors.message}
              />
              <MobileDateTimePicker
                {...getFieldProps('schedule')}
                ampm={false}
                label="Schedule"
                inputFormat="dd/MM/yyyy HH:mm"
                minDate={new Date()}
                onChange={(date) => setFieldValue('schedule', date)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Send test message</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2}>
                    <MuiPhoneNumber
                      fullWidth
                      defaultCountry={'md'}
                      onlyCountries={['md']}
                      onChange={handleTestPhone}
                    />
                    <Button
                      className="float-right"
                      variant="outlined"
                      onClick={handleTestSend}
                      disabled={!testPhone.isValid || isDisabled}>
                      Send test message
                    </Button>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Form>
        </FormikProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSend} disabled={isDisabled}>
          Send messages
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendMessageDialog;
