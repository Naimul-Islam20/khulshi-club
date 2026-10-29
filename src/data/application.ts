// Membership application — applicant accounts and the membership form.
// Front-end only for now: everything is kept in this browser's localStorage
// until there's a backend to register, sign in and submit to.

export const MEMBERSHIP_CATEGORIES = [
  'Donor Member', 'Life Member', 'Permanent Member', 'Corporate Member', 'Founding Member',
  'Service Member', 'Temporary Member', 'Honorary Member', 'Diplomat & Foreign National Member',
] as const

export const REGISTRATION_FEE = 1000

export type Address = {
  address: string; policeStation: string; postOffice: string; postalCode: string; district: string; country: string
}

export type Child = { name: string; sex: string; dob: string; occupation: string }
export type OtherClub = { name: string; type: string; year: string }

export type ApplicationForm = {
  personal: {
    fullName: string; fatherName: string; motherName: string
    maritalStatus: string; spouseName: string; anniversary: string
    dob: string; birthPlace: string; phone: string; tel: string; email: string
    nationality: string; bloodGroup: string; nidNo: string; passportNo: string; etin: string
    education: string; institution: string; photo: string | null
  }
  present: Address
  permanent: Address
  sameAsPresent: boolean
  children: Child[]
  nominee: {
    name: string; relation: string; dob: string; email: string; nidNo: string; passportNo: string
    occupation: string; phone: string; photo: string | null
  }
  professional: { profession: string; designation: string; company: string; address: Address }
  otherClubs: OtherClub[]
  category: string
  proposer: { name: string; memberId: string }
  documents: { nidCopy: string | null; photos: string | null; tradeLicence: string | null }
  agreed: boolean
}

export type ApplicantAccount = { givenName: string; surname: string; email: string; mobile: string; password: string }

export type ApplicationStatus = 'draft' | 'submitted'

export type ApplicantRecord = {
  account: ApplicantAccount
  form: ApplicationForm
  step: number
  status: ApplicationStatus
  submittedAt?: string
  reference?: string
}

export const emptyAddress = (): Address => ({ address: '', policeStation: '', postOffice: '', postalCode: '', district: '', country: 'Bangladesh' })

export function emptyForm(account: ApplicantAccount): ApplicationForm {
  return {
    personal: {
      fullName: `${account.givenName} ${account.surname}`.trim(), fatherName: '', motherName: '',
      maritalStatus: '', spouseName: '', anniversary: '',
      dob: '', birthPlace: '', phone: account.mobile, tel: '', email: account.email,
      nationality: '', bloodGroup: '', nidNo: '', passportNo: '', etin: '',
      education: '', institution: '', photo: null,
    },
    present: emptyAddress(),
    permanent: emptyAddress(),
    sameAsPresent: false,
    children: [],
    nominee: { name: '', relation: '', dob: '', email: '', nidNo: '', passportNo: '', occupation: '', phone: '', photo: null },
    professional: { profession: '', designation: '', company: '', address: emptyAddress() },
    otherClubs: [],
    category: '',
    proposer: { name: '', memberId: '' },
    documents: { nidCopy: null, photos: null, tradeLicence: null },
    agreed: false,
  }
}

export const applicantName = (a: ApplicantAccount) => `${a.givenName} ${a.surname}`.trim()

// Share of the key fields filled in — drives the dashboard progress bar
export function formCompletion(f: ApplicationForm): number {
  const checks = [
    f.personal.fullName, f.personal.fatherName, f.personal.motherName, f.personal.maritalStatus, f.personal.dob,
    f.personal.phone, f.personal.email, f.personal.nationality, f.personal.bloodGroup,
    f.personal.nidNo || f.personal.passportNo, f.personal.photo,
    f.present.address, f.present.district, f.sameAsPresent || f.permanent.address,
    f.nominee.name, f.nominee.relation,
    f.professional.profession, f.professional.company,
    f.category, f.proposer.name, f.agreed,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

// ─── Storage ─────────────────────────────────────────────────────────────────
const RECORDS_KEY = 'ckcl-applicants'
const SESSION_KEY = 'ckcl-applicant-session'

// Seeded so the login can be tried without registering first
export const DEMO_ACCOUNT: ApplicantAccount = {
  givenName: 'Demo', surname: 'Applicant', email: 'applicant@ckclbd.com', mobile: '01700000000', password: 'Member@123',
}

function readRecords(): Record<string, ApplicantRecord> {
  let records: Record<string, ApplicantRecord> = {}
  try { records = JSON.parse(localStorage.getItem(RECORDS_KEY) || '{}') } catch { /* storage unavailable */ }
  if (!records[DEMO_ACCOUNT.email]) {
    records[DEMO_ACCOUNT.email] = { account: DEMO_ACCOUNT, form: emptyForm(DEMO_ACCOUNT), step: 0, status: 'draft' }
  }
  return records
}

function writeRecords(records: Record<string, ApplicantRecord>) {
  try { localStorage.setItem(RECORDS_KEY, JSON.stringify(records)) } catch { /* quota or storage unavailable */ }
}

const key = (email: string) => email.trim().toLowerCase()

export function findRecord(email: string): ApplicantRecord | undefined {
  return readRecords()[key(email)]
}

export function saveRecord(record: ApplicantRecord) {
  const records = readRecords()
  records[key(record.account.email)] = record
  writeRecords(records)
}

export function getSession(): string | null {
  try { return localStorage.getItem(SESSION_KEY) } catch { return null }
}

export function setSession(email: string | null) {
  try {
    if (email) localStorage.setItem(SESSION_KEY, key(email))
    else localStorage.removeItem(SESSION_KEY)
  } catch { /* storage unavailable */ }
}
