import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
} from '@mui/material';
import dateFormat from 'dateformat';
import { startCase, capitalize, isDate } from 'lodash';
import { IPatient } from 'redux/slices/patients';
import Scrollbar from '../../../components/Scrollbar';

interface IBasicTableProps {
  patients: IPatient[];
}

type Header = keyof IPatient;

export const BasicTable: React.FC<IBasicTableProps> = ({ patients }) => {
  const headers = (Object.keys(patients[0]) as Header[]).filter(
    (label) => label !== 'id',
  );

  return (
    <>
      <Scrollbar>
        <TableContainer sx={{ width: '100%', maxHeight: '90vh' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ background: 'red' }}>
                {headers.map((cell, index) => (
                  <TableCell
                    key={index}
                    variant="head"
                    sx={{
                      backgroundImage: 'none',
                      borderRadius: '0 !important',
                    }}>
                    {capitalize(startCase(cell))}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {patients.map((patient, index) => (
                <TableRow key={index}>
                  {headers.map((header, index) => (
                    <TableCell
                      key={index}
                      variant="body"
                      style={{ whiteSpace: 'nowrap' }}>
                      {isDate(patient[header])
                        ? dateFormat(patient[header], 'dd/mm/yyyy')
                        : patient[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
    </>
  );
};
