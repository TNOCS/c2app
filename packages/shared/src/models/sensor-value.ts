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
  metricFeature?: null | undefined | string;
  /** Measurement type */
  type: string;
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
  type: string;
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
