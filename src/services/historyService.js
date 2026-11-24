import { api } from './api'

export const getHistory = () => api.get('/medical-history')
