// Mock data simulating real API response structure for Air Quality Monitoring System

export const AQI_LEVELS = {
  good: { range: [0, 50], label: 'Good', color: '#00e400', bg: '#003300', textColor: '#00e400' },
  moderate: { range: [51, 100], label: 'Moderate', color: '#ffff00', bg: '#333300', textColor: '#e6e600' },
  sensitive: { range: [101, 150], label: 'Unhealthy for Sensitive Groups', color: '#ff7e00', bg: '#331a00', textColor: '#ff7e00' },
  unhealthy: { range: [151, 200], label: 'Unhealthy', color: '#ff0000', bg: '#330000', textColor: '#ff4444' },
  veryUnhealthy: { range: [201, 300], label: 'Very Unhealthy', color: '#8f3f97', bg: '#1a0020', textColor: '#c070cc' },
  hazardous: { range: [301, 500], label: 'Hazardous', color: '#7e0023', bg: '#200008', textColor: '#cc3355' },
};

export const HEALTH_RECOMMENDATIONS = {
  good: 'Air quality is satisfactory. Enjoy outdoor activities freely.',
  moderate: 'Unusually sensitive people should consider reducing prolonged outdoor exertion.',
  sensitive: 'Sensitive groups should limit prolonged outdoor exertion. Keep quick-relief medicine handy.',
  unhealthy: 'Everyone should reduce prolonged outdoor exertion. Sensitive groups should avoid it.',
  veryUnhealthy: 'Everyone should avoid prolonged outdoor exertion. Stay indoors when possible.',
  hazardous: 'Health alert: Everyone should avoid all outdoor physical activity. Remain indoors.',
};

export const WHO_THRESHOLDS = {
  pm25: { safe: 15, unit: 'µg/m³', name: 'PM2.5', fullName: 'Fine Particulate Matter' },
  pm10: { safe: 45, unit: 'µg/m³', name: 'PM10', fullName: 'Coarse Particulate Matter' },
  co2: { safe: 1000, unit: 'ppm', name: 'mq135', fullName: 'mq135 Sensor' },
  no2: { safe: 25, unit: 'µg/m³', name: 'mq2', fullName: 'mq2 Sensor' },
  o3: { safe: 100, unit: '°C', name: 'temperature', fullName: 'Temperature' },
  so2: { safe: 40, unit: '%', name: 'humidity', fullName: 'Humidity' },
};

export const getAQILevel = (aqi) => {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'sensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'veryUnhealthy';
  return 'hazardous';
};

// Sensors data (mock)
export const SENSORS = [
  {
    id: 'sensor-001',
    name: 'Live Station',
    location: 'Real-time Firebase Sensor',
    lat: 28.6139,
    lng: 77.2090, // keep generic coords or the same
    aqi: 50,
    pollutants: { pm25: 0, pm10: 0, co2: 0, no2: 0, o3: 0, so2: 0 },
    lastUpdated: new Date().toISOString(),
  }
];

// Primary sensor (currently selected)
export const PRIMARY_SENSOR_ID = 'sensor-001';

export const HISTORICAL_DATA = {
  '24h': [],
  '7d': [],
  '30d': [],
};

