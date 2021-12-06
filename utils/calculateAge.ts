import { IPatient } from 'redux/slices/patients';

export function calculateAge(patients: IPatient[]): IPatient[] {
  return patients.map((patient) => {
    try {
      if (!patient.birthday) {
        return patient;
      }

      const birthday = new Date(patient.birthday);
      const msDiff = Date.now() - birthday.getTime();
      const ageDate = new Date(msDiff);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      return {
        ...patient,
        age
      };
    } catch (error) {
      console.log(error);
      return patient;
    }
  });
}
