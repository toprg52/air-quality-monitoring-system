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
  co2: { safe: 1000, unit: 'ppm', name: 'CO₂', fullName: 'Carbon Dioxide' },
  no2: { safe: 25, unit: 'µg/m³', name: 'NO₂', fullName: 'Nitrogen Dioxide' },
  o3: { safe: 100, unit: 'µg/m³', name: 'O₃', fullName: 'Ozone' },
  so2: { safe: 40, unit: 'µg/m³', name: 'SO₂', fullName: 'Sulfur Dioxide' },
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
    name: 'Downtown Central',
    location: 'Central Business District',
    lat: 28.6139,
    lng: 77.2090,
    aqi: 142,
    pollutants: { pm25: 38.4, pm10: 72.1, co2: 820, no2: 48.3, o3: 89.2, so2: 22.1 },
    lastUpdated: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 'sensor-002',
    name: 'North Industrial Zone',
    location: 'Industrial Area, Sector 12',
    lat: 28.6639,
    lng: 77.2390,
    aqi: 218,
    pollutants: { pm25: 88.2, pm10: 142.5, co2: 1450, no2: 112.4, o3: 72.1, so2: 89.3 },
    lastUpdated: new Date(Date.now() - 4 * 60000).toISOString(),
  },
  {
    id: 'sensor-003',
    name: 'Green Park Residential',
    location: 'Green Park, South Delhi',
    lat: 28.5594,
    lng: 77.2059,
    aqi: 62,
    pollutants: { pm25: 14.2, pm10: 28.7, co2: 520, no2: 18.4, o3: 55.3, so2: 8.2 },
    lastUpdated: new Date(Date.now() - 1 * 60000).toISOString(),
  },
  {
    id: 'sensor-004',
    name: 'East Highway Monitor',
    location: 'NH-58 Highway Junction',
    lat: 28.6339,
    lng: 77.3090,
    aqi: 176,
    pollutants: { pm25: 62.1, pm10: 98.4, co2: 980, no2: 84.2, o3: 102.3, so2: 45.6 },
    lastUpdated: new Date(Date.now() - 3 * 60000).toISOString(),
  },
  {
    id: 'sensor-005',
    name: 'University Campus',
    location: 'JNU Campus, South-West',
    lat: 28.5400,
    lng: 77.1672,
    aqi: 88,
    pollutants: { pm25: 22.1, pm10: 41.3, co2: 640, no2: 28.7, o3: 68.4, so2: 12.1 },
    lastUpdated: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'sensor-006',
    name: 'Airport Terminal',
    location: 'Indira Gandhi International Airport',
    lat: 28.5562,
    lng: 77.1000,
    aqi: 155,
    pollutants: { pm25: 52.3, pm10: 88.6, co2: 890, no2: 72.1, o3: 78.9, so2: 38.4 },
    lastUpdated: new Date(Date.now() - 6 * 60000).toISOString(),
  },
];

// Primary sensor (currently selected)
export const PRIMARY_SENSOR_ID = 'sensor-001';

// Generate historical data for charts
const generateHistoricalData = (hours, baseAQI, variance) => {
  const data = [];
  const now = Date.now();
  for (let i = hours; i >= 0; i--) {
    const ts = now - i * 3600000;
    const timeOfDay = new Date(ts).getHours();
    // Simulate higher pollution during rush hours
    const rushModifier = (timeOfDay >= 7 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 20) ? 1.4 : 0.8;
    const aqi = Math.round(Math.max(20, baseAQI * rushModifier + (Math.random() - 0.5) * variance));

    data.push({
      timestamp: ts,
      time: new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      label: hours <= 24
        ? new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      aqi,
      pm25: Math.round(Math.max(5, (aqi * 0.27 + (Math.random() - 0.5) * 8) * 10) / 10),
      pm10: Math.round(Math.max(10, (aqi * 0.5 + (Math.random() - 0.5) * 12) * 10) / 10),
      no2: Math.round(Math.max(5, (aqi * 0.34 + (Math.random() - 0.5) * 10) * 10) / 10),
      o3: Math.round(Math.max(15, (aqi * 0.62 + (Math.random() - 0.5) * 15) * 10) / 10),
    });
  }
  return data;
};

export const HISTORICAL_DATA = {
  '24h': generateHistoricalData(24, 142, 40),
  '7d': generateHistoricalData(168, 138, 50).filter((_, i) => i % 6 === 0),
  '30d': generateHistoricalData(720, 135, 60).filter((_, i) => i % 24 === 0),
};

// Simulate data variation for auto-refresh
export const generateVariant = (sensor, delta = 0) => {
  const factor = 1 + (Math.random() - 0.5) * 0.08 + delta * 0.001;
  const newPollutants = {};
  Object.entries(sensor.pollutants).forEach(([key, val]) => {
    newPollutants[key] = Math.round(Math.max(1, val * factor) * 10) / 10;
  });
  const newAQI = Math.round(Math.max(10, Math.min(500, sensor.aqi * factor)));
  return {
    ...sensor,
    aqi: newAQI,
    pollutants: newPollutants,
    lastUpdated: new Date().toISOString(),
  };
};
