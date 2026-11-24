import { useEffect, useState } from 'react'
import { getAllDoctors } from '../services/doctorService'
import { unwrapCollection } from '../utils/collections'
import { toDoctorViewModel } from '../utils/doctors'

export default function useDoctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    const loadDoctors = async () => {
      try {
        const response = await getAllDoctors()
        const records = unwrapCollection(response)
        if (!records) {
          throw new Error('Unexpected response from /api/doctors. Expected an array of doctors.')
        }
        if (!active) return
        setDoctors(records.map(toDoctorViewModel))
        setError('')
      } catch (requestError) {
        if (!active) return
        setDoctors([])
        if ([403, 404].includes(requestError?.response?.status ?? requestError?.status)) {
          setError('No doctors found')
        } else {
          setError(requestError.message || 'Unable to load doctors.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }
    loadDoctors()
    return () => {
      active = false
    }
  }, [reloadKey])

  const retry = () => {
    setLoading(true)
    setError('')
    setReloadKey((key) => key + 1)
  }

  return { doctors, loading, error, retry }
}
