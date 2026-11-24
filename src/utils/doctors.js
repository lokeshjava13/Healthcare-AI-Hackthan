const avatarColors = ['var(--primary-light)']

export function formatDoctorName(value) {
  const normalized = String(value || 'Doctor')
    .trim()
    .replace(/\.([A-Za-z])/g, '. $1')
    .replace(/\s+/g, ' ')
    .toLowerCase()

  return normalized.replace(/(^|[\s.-])([a-z])/g, (_, separator, letter) =>
    `${separator}${letter.toUpperCase()}`,
  )
}

export function getDisplayQualification(value) {
  return String(value || '')
    .split(/[,;|]/)
    .map((part) => part.trim())
    .filter((part) =>
      /\b(mbbs|mds?|bds|bpt|mpt|bams|bhms|dnb|dm|dch|dgo|phd|bsc|msc|fellowship|diploma|bachelor|master)\b/i
        .test(part),
    )
    .join(', ')
}

export function toDoctorViewModel(doctor, index) {
  const name = formatDoctorName(
    doctor?.name || doctor?.doctorName || doctor?.user?.name || doctor?.fullName,
  )
  const availability = doctor?.availability ?? doctor?.available
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'DR'

  return {
    ...doctor,
    name,
    id: doctor?.id ?? doctor?.doctorId,
    specialization: formatDoctorName(
      doctor?.specialization || doctor?.speciality || doctor?.department || 'Not available',
    ),
    qualification: doctor?.qualification || 'Not available',
    hospitalName: doctor?.hospital_name || doctor?.hospitalName || 'Not available',
    experience: doctor?.experience ?? 'Not available',
    consultationFee: doctor?.consultation_fee ?? doctor?.consultationFee ?? doctor?.fee ?? doctor?.price ?? 'Not available',
    availability: availability === true
      || availability === 1
      || ['1', 'true', 'available'].includes(String(availability).toLowerCase()),
    initials,
    color: avatarColors[index % avatarColors.length],
  }
}
