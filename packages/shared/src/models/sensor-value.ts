export enum SensorKind {
  wind_speed = 'wind_speed',
  wind_direction = 'wind_direction',
  pressure = 'pressure',
  temperature = 'temperature',
  humidity = 'humidity',
  rain_accumulation = 'rain_accumulation',
  rain_duration = 'rain_duration',
  rain_intensity = 'rain_intensity',
  rain_peak_intensity = 'rain_peak_intensity',
  hail_accumulation = 'hail_accumulation',
  hail_duration = 'hail_duration',
  hail_intensity = 'hail_intensity',
  hail_peak_intensity = 'hail_peak_intensity',
  gray_per_h = 'gray_per_h',
  sivert_per_h = 'sivert_per_h',
  PM2_5 = 'PM2_5',
  PM10 = 'PM10',
  SO2 = 'SO2',
  NO2 = 'NO2',
  HCHO = 'HCHO',
  CL2 = 'CL2',
  CO = 'CO',
  CO2 = 'CO2',
  H2S = 'H2S',
  O3 = 'O3',
  IRCamera = 'IRCamera',
  visibleCamera = 'visibleCamera'
}

/** Geographic data as a GeoJSON geometry object */
export interface IGeometry {
  type: string;
  coordinates: number[];
}

export interface IAttitude {
  pitch: number;
  roll: number;
  yaw: number;
}

export interface IMeasurement {
  /** Identifier of the MetricFeature object related with this measurement */
  metricFeature: string;
  /** Measurement units */
  unit: string;
  /** Measurement value */
  value: number;
  /** Measurement confidence */
  confidence: number;
}

/** Sensors to measure temperature, gases, etc. Database collection: sensors */
export interface ISensor {
  /** Sensor unique identifier */
  _id: string;
  /** Type of sensor */
  type: SensorKind;
  /** Identifier of the context to which the last measurement is related */
  context: string;
  /**
   * Identifier of the mission (if any) to which the last measurement is related
   */
  mission: string;
  geometry: IGeometry;
  height?: null | undefined | number;
  attitude: IAttitude;
  /** Last measurement data */
  measurement: IMeasurement;
  /** Date in ISO 8601 format in which the misson is inserted/updated */
  timestamp: number;
}
