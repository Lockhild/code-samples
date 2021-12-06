import { IFirestorePatient, IPatient } from 'redux/slices/patients';
import firebase from 'firebase/compat';
import { Timestamp as TTimestamp } from '@firebase/firestore-types';

type Key = keyof IPatient;

export function updateFirestoreTimestamps(patients: IFirestorePatient[]): IPatient[] {
  const Timestamp = firebase.firestore.Timestamp;

  return patients.map((patient) => {
    const keys = Object.keys(patient) as Key[];

    keys.forEach((key) => {
      const value = patient[key];
      if (value instanceof Timestamp) {
        //@ts-ignore
        patient[key] = (value as TTimestamp).toDate();
      }
    });

    return patient;
  }) as IPatient[];
}
