import { camelCase, trim } from 'lodash';
import { InitPatient } from 'pages/patients/custom-components/FullScreenDialog';
import { IPatient } from 'redux/slices/patients';
import { normalizeHeaders } from './normalizeHeaders';
import { v4 as uuidv4 } from 'uuid';
import { normalizeDates } from './normalizeDates';
import { addLastVisitColumn } from './addLastVisitColumn';
import { normalizePhoneNumbers } from './normalizePhoneNumbers';
import { removeUndefines } from './removeUndefines';

const formatPatients = (patients: InitPatient[]): IPatient[] => {
  // Adding an unique ID for each patient
  const withId = patients.map((patient) => ({ ...patient, id: uuidv4() }));
  console.log('WITHID: ', withId);
  // From strings to dates (for birthday, and visits)
  const withDatesNormalized = normalizeDates(withId);
  // Setting lastVisit as one of first, second or third
  const withLastVisit = addLastVisitColumn(withDatesNormalized);
  // Adding (+373) to phones from MD
  const withPhonesNormalized = normalizePhoneNumbers(withLastVisit);
  // Removing undefines
  const noUndefines = removeUndefines(withPhonesNormalized);

  return noUndefines as IPatient[];
};

export function csvToArray(str: string) {
  return new Promise<IPatient[]>((resolve, reject) => {
    // Takes the first row and transforms it into headers (array of strings)
    const initHeaders = str
      .slice(0, str.indexOf('\n'))
      .split(',')
      .map((val) => camelCase(val));

    const headers = normalizeHeaders(initHeaders);

    const rows = str.slice(str.indexOf('\n') + 1).split('\n');

    const initPatients = rows.map((row) => {
      const values = row.split(',');
      const el = headers.reduce((object, header, index) => {
        //@ts-ignore
        object[header] = trim(values[index], '"').replace(/(\r\n|\n|\r)/gm, '');
        return object;
      }, {});
      return el;
    });

    const patients = formatPatients(initPatients as InitPatient[]);

    resolve(patients as IPatient[]);
  });
}
