// Fictional frontend examples only. Do not use real patient information.
export const doctors = [
  {
    id: 'doctor-1',
    name: 'Dr. Avery Chen',
    specialty: 'Cardiology',
    clinic: 'Harbor Medical Center',
    rating: '4.9',
    experience: '12 years',
    fee: '$80',
    nextSlot: 'Tomorrow, 10:00 AM',
    initials: 'AC',
    color: '#ccfbf1',
  },
  {
    id: 'doctor-2',
    name: 'Dr. Jordan Ellis',
    specialty: 'Primary care',
    clinic: 'Northside Health',
    rating: '4.8',
    experience: '8 years',
    fee: '$60',
    nextSlot: 'Today, 4:00 PM',
    initials: 'JE',
    color: '#fce7f3',
  },
  {
    id: 'doctor-3',
    name: 'Dr. Sam Rivera',
    specialty: 'Orthopedics',
    clinic: 'Cedar Point Clinic',
    rating: '4.9',
    experience: '15 years',
    fee: '$90',
    nextSlot: 'Tomorrow, 11:30 AM',
    initials: 'SR',
    color: '#dcfce7',
  },
]

export const patients = [
  { id: 'patient-1', label: 'Sample Patient A', visit: 'Follow-up', status: 'Checked in' },
  { id: 'patient-2', label: 'Sample Patient B', visit: 'Consultation', status: 'Waiting' },
  { id: 'patient-3', label: 'Sample Patient C', visit: 'Review', status: 'Upcoming' },
]

export const initialAppointments = [
  {
    id: 'appointment-1',
    patient: 'Sample Patient A',
    doctor: 'Dr. Avery Chen',
    specialty: 'Cardiology',
    date: 'Nov 24, 2026',
    time: '10:00 AM',
    status: 'Confirmed',
  },
  {
    id: 'appointment-2',
    patient: 'Sample Patient B',
    doctor: 'Dr. Jordan Ellis',
    specialty: 'Primary care',
    date: 'Nov 25, 2026',
    time: '11:30 AM',
    status: 'Pending',
  },
]

export const reports = [
  { id: 'report-1', title: 'Routine blood panel', date: 'Nov 20, 2026', status: 'Available' },
  { id: 'report-2', title: 'Imaging summary', date: 'Nov 18, 2026', status: 'Available' },
  { id: 'report-3', title: 'Cardiology review', date: 'Nov 15, 2026', status: 'Processing' },
]
