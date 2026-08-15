import { env } from './env'

export const mapConfig = {
  center: { lat: 12.9716, lng: 77.5946 },
  zoom: 12,
  tileUrl: env.map.tileUrl,
  attribution: env.map.attribution,
}
