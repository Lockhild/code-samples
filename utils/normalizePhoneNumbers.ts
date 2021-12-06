import { IPatient } from 'redux/slices/patients';

const regex = /^60|^61|^62|^66|^67|^68|^69|^76|^78|^79/;

export function normalizePhoneNumbers(patients: IPatient[]): IPatient[] {
  return patients.map((patient) => ({
    ...patient,
    phone:
      patient.phone && regex.test(patient.phone) && patient.phone.length === 8
        ? `(+373) ${patient.phone}`
        : patient.phone
  }));
}
