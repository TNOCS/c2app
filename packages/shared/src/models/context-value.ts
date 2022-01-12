import { Geometry } from "geojson";

export enum PolygonType {
  Polygon = 'Polygon'
}

/** Describes a Polygon geometry */
export interface IPolygon {
  type: PolygonType;
  coordinates: number[][][];
}

export enum MultiPolygonType {
  MultiPolygon = 'MultiPolygon'
}

/** Describes a MultiPolygon geometry */
export interface IMultiPolygon {
  type: MultiPolygonType;
  coordinates: number[][][][];
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
  geometry: IPolygon | IMultiPolygon | Record<string, Geometry>;
  /** Date in ISO 8601 format in which the context begins */
  start: number;
  /** Date in ISO 8601 format in which the context is inserted/updated */
  timestamp: number;
}
