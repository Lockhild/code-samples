import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import useFirebase from 'hooks/useFirebase';
import { calculateAge } from 'utils/calculateAge';
import { updateFirestoreTimestamps } from 'utils/updateFirestoreTimestamps';
import firebase from 'firebase/compat';
import { dispatch, RootState } from '../store';

export interface IPatient {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  phone?: string;
  birthday?: Date;
  gender?: string;
  firstVisit?: Date;
  secondVisit?: Date;
  thirdVisit?: Date;
  lastVisit?: Date;
}

export interface IFirestorePatient {
  id: string;
  firstName: string;
  lastName: string;
  age?: number;
  phone?: string;
  birthday?: firebase.firestore.Timestamp;
  gender?: string;
  firstVisit?: firebase.firestore.Timestamp;
  secondVisit?: firebase.firestore.Timestamp;
  thirdVisit?: firebase.firestore.Timestamp;
  lastVisit?: firebase.firestore.Timestamp;
}

type PatientsState = {
  isLoading: boolean;
  error: boolean;
  patients: IPatient[];
};

const initialState: PatientsState = {
  isLoading: false,
  error: false,
  patients: [],
};

const slice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    updatedPatients(state, action) {
      state.isLoading = false;
      state.patients = [...state.patients, ...action.payload];
    },
  },
});

// Reducer
export default slice.reducer;

export const addPatients = createAsyncThunk(
  'addPatients',
  async (patients: IPatient[], { getState }) => {
    const { doctor } = getState() as RootState;
    const { firestore } = useFirebase();
    const batch = firestore.batch();

    try {
      patients.forEach((patient) => {
        const docRef = firestore
          .collection('doctors')
          .doc(doctor.info.id)
          .collection('patients')
          .doc();
        batch.set(docRef, patient);
      });
      await batch.commit();
      dispatch(slice.actions.updatedPatients(patients));
    } catch (error) {
      console.log(error);
    }
  },
);

export const getPatients = createAsyncThunk(
  'getPatients',
  async (undefined, { getState }) => {
    const { doctor } = getState() as RootState;
    const { firestore } = useFirebase();
    const patients: IFirestorePatient[] = [];

    try {
      const query = firestore
        .collection('doctors')
        .doc(doctor.info.id)
        .collection('patients')
        .limit(1000);
      const querySnapshot = await query.get();
      querySnapshot.forEach((doc) => {
        patients.push(doc.data() as IFirestorePatient);
      });

      // Converting firestore Timestamps to Dates
      const withDates = updateFirestoreTimestamps(patients);
      const withUpdatedAge = calculateAge(withDates);

      dispatch(slice.actions.updatedPatients(withUpdatedAge));
    } catch (error) {
      console.log(error);
    }
  },
);
