const regex = {
  FIRST_NAME: /\bprenume|prenumele\b/i,
  LAST_NAME: /\bnume|numele|familia\b/i,
  BIRTHDAY: /\bdatanașterii|datanasterii|ziuadenastere|ziuadenaștere|nascut\b/i,
  PHONE: /\btelefon|telefonul|numaruldetelefon|număruldetelefon|mobil|numarmobil|numărulmobil\b/i,
  SEX: /\bgenul|sexul|sex\b/i,
  AGE: /\bvarsta|vîrsta|vârsta\b/i,
  VISIT1: /\b1datainvestigatiei\b/i,
  VISIT2: /\b2datainvestigatiei\b/i,
  VISIT3: /\b3datainvestigatiei\b/i
};

export function normalizeHeaders(headers: string[]): string[] {
  return headers.map((header) => {
    if (regex.FIRST_NAME.test(header)) {
      return 'firstName';
    }
    if (regex.LAST_NAME.test(header)) {
      return 'lastName';
    }
    if (regex.BIRTHDAY.test(header)) {
      return 'birthday';
    }
    if (regex.PHONE.test(header)) {
      return 'phone';
    }
    if (regex.SEX.test(header)) {
      return 'gender';
    }
    if (regex.AGE.test(header)) {
      return 'age';
    }
    if (regex.VISIT1.test(header)) {
      return 'firstVisit';
    }
    if (regex.VISIT2.test(header)) {
      return 'secondVisit';
    }
    if (regex.VISIT3.test(header)) {
      return 'thirdVisit';
    }
    return header;
  });
}
