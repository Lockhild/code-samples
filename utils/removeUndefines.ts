import { IPatient } from 'redux/slices/patients';

type Key = keyof IPatient;

export function removeUndefines(patients: IPatient[]): IPatient[] {
  return patients.map((patient) => {
    Object.keys(patient).forEach((key) =>
      patient[key as Key] === undefined ? delete patient[key as Key] : {}
    );
    return patient;
  });
}
