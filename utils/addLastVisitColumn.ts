import { IPatient } from 'redux/slices/patients';

export const addLastVisitColumn = (patients: IPatient[]): IPatient[] => {
  return patients.map((patient) => ({
    ...patient,
    lastVisit: patient.thirdVisit || patient.secondVisit || patient.firstVisit
  }));
};
