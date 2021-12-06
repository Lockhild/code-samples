import isDate from 'lodash';
import { InitPatient } from 'pages/patients/custom-components/FullScreenDialog';
import { IPatient } from 'redux/slices/patients';

const transform = (date: string | undefined): Date | undefined => {
  if (!date) {
    return;
  }
  const dateStr = date.replace(/(\d+[/|.|-])(\d+[/|.|-])/, '$2$1');
  const toDate = new Date(dateStr);

  if (isDate(dateStr) && toDate.toString() !== 'Invalid Date') {
    return new Date(dateStr);
  }
};

export function normalizeDates(patients: InitPatient[]): IPatient[] {
  return patients.map((patient) => ({
    ...patient,
    birthday: transform(patient.birthday),
    firstVisit: transform(patient.firstVisit),
    secondVisit: transform(patient.secondVisit),
    thirdVisit: transform(patient.thirdVisit),
    lastVisit: transform(patient.lastVisit)
  }));
}
