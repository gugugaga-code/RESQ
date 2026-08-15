const withTrailingSlashRemoved = (value: string | undefined, fallback: string): string => {
  const nextValue = value?.trim() || fallback
  return nextValue.endsWith('/') ? nextValue.slice(0, -1) : nextValue
}

export const env = {
  appName: 'RESQ',
  environment: import.meta.env.MODE,
  isProduction: import.meta.env.PROD,
  routing: {
    osrmBaseUrl: withTrailingSlashRemoved(import.meta.env.VITE_OSRM_BASE_URL, 'https://router.project-osrm.org'),
  },
  map: {
    tileUrl: import.meta.env.VITE_MAP_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution:
      import.meta.env.VITE_MAP_ATTRIBUTION ||
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
} as const
