export interface IGeometry {
  type: string;
  coordinates: number[][][];
}

/**
 * Context will identify a specific operation or incident to which all the
 * corresponding objects must be related, such as missions, measurements,
 * evacuation routes, etc. Database collection: contexts
 */
export interface IContext {
  /** Context unique identifier */
  _id: string;
  /**
   * Context will identify a specific operation or incident to which all the
   * corresponding objects must be related, such as missions, measurements,
   * evacuation routes, etc. Database collection: contexts
   */
  description: string;
  /** Geographic data as a GeoJSON geometry object */
  geometry: IGeometry;
  /** Date in ISO 8601 format in which the context begins */
  start: number;
  /** Date in ISO 8601 format in which the context is inserted/updated */
  timestamp: number;
}
