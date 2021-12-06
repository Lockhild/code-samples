import './styles.css';

import { useState, useEffect, SetStateAction } from 'react';
import { startCase, capitalize } from 'lodash';
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid';
import { RootState, useDispatch, useSelector } from 'redux/store';
import { getPatients, IPatient } from 'redux/slices/patients';

import { escapeRegExp } from 'utils/escapeRegExp';
import CustomToolbar from './custom-components/CustomToolbar';
import { CustomPagination } from './custom-components/CustomPagination';
import FullScreenDialog from './custom-components/FullScreenDialog';
import SendMessageDialog from './custom-components/SendMessageDialog';

type Field = keyof IPatient;

export const Patients: React.FC = () => {
  const dispatch = useDispatch();
  const { patients } = useSelector((state: RootState) => state.patients);

  const uniqueKeys = new Set([
    'id',
    'firstName',
    'lastName',
    'phone',
    'birthday',
    'gender',
    'age',
    'lastVisit',
  ]);
  const tempKeys = new Set();
  patients.forEach((patient) =>
    Object.keys(patient).forEach((key) => tempKeys.add(key)),
  );

  // sorting the rest of the keys
  Array.from(tempKeys)
    .sort()
    .map((key) => uniqueKeys.add(key as string));

  const columns: GridColDef[] = Array.from(uniqueKeys).map((key: string) => {
    return {
      field: key,
      hide: [
        'id',
        'gender',
        'firstVisit',
        'secondVisit',
        'thirdVisit',
      ].includes(key)
        ? true
        : false,
      type: [
        'birthday',
        'firstVisit',
        'secondVisit',
        'thirdVisit',
        'lastVisit',
      ].includes(key)
        ? 'date'
        : ['age'].includes(key)
        ? 'number'
        : 'string',
      headerName: capitalize(startCase(key)),
      minWidth: ['sex'].includes(key) ? 50 : 100,
      flex: [
        'firstName',
        'lastName',
        'birthday',
        'phone',
        'lastVisit',
      ].includes(key)
        ? 1
        : 0.5,
      align: 'left',
      headerAlign: 'left',
    };
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onImport = () => {
    handleOpen();
  };

  const [rows, setRows] = useState<IPatient[]>([]);

  const requestSearch = (searchValue: SetStateAction<string>) => {
    const searchRegex = new RegExp(escapeRegExp(searchValue as string), 'i');

    const filteredRows = patients.filter((row) => {
      const keys: Field[] = Object.keys(row) as Field[];

      return keys.some((field) => searchRegex.test(row[field]!.toString()));
    });
    setRows(filteredRows);
  };

  useEffect(() => {
    if (patients.length > 0) return;

    dispatch(getPatients());
  }, [dispatch]);

  useEffect(() => {
    setRows(patients);
  }, [patients]);

  const [selected, setSelected] = useState<GridSelectionModel>([]);
  const [sendMessage, setSendMessage] = useState(false);

  const handleMessageOpen = () => {
    setSendMessage(true);
  };

  const handleMessageClose = () => {
    setSendMessage(false);
  };

  const onSelect = (patients: GridSelectionModel) => {
    setSelected(patients);
  };

  return (
    <>
      <DataGrid
        checkboxSelection
        disableSelectionOnClick
        rows={rows}
        columns={columns}
        pagination
        sortingMode="client"
        autoPageSize
        onSelectionModelChange={onSelect}
        components={{
          Toolbar: CustomToolbar,
          Pagination: CustomPagination,
          ColumnSortedAscendingIcon: null,
          ColumnSortedDescendingIcon: null,
          ColumnUnsortedIcon: null,
        }}
        componentsProps={{
          toolbar: {
            onChange: requestSearch,
            onImport,
            onSendMessage: handleMessageOpen,
            messageButtonDisabled: !selected.length,
          },
        }}
      />
      {open && (
        <FullScreenDialog
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
        />
      )}
      {sendMessage && (
        <SendMessageDialog
          patients={selected}
          open={sendMessage}
          onClose={handleMessageClose}
        />
      )}
    </>
  );
};
