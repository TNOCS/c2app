export enum FeatureCollectionType {
  FeatureCollection = 'FeatureCollection'
}

export enum FeatureType {
  Feature = 'Feature'
}

export enum PointType {
  Point = 'Point'
}

/** Describes a point geometry */
export interface IPoint {
  type: PointType;
  coordinates: number[];
}

export enum LineStringType {
  LineString = 'LineString'
}

/** Describes a LineString geometry */
export interface ILineString {
  type: LineStringType;
  coordinates: number[][];
}

export enum MultiLineStringType {
  MultiLineString = 'MultiLineString'
}

/** Describes a MultiLineString geometry */
export interface IMultiLineString {
  type: MultiLineStringType;
  coordinates: number[][][];
}

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

export interface ICbrnProperties {
  comments?: null | undefined | string;
  validity?: null | undefined | string;
  deltaTime?: null | undefined | number;
  color?: null | undefined | string;
  fillOpacity?: null | undefined | number;
  level?: null | undefined | number;
  timestamp?: null | undefined | string;
  confidence?: null | undefined | number;
  toxicityLevel?: 'VERY_LOW' | 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
}

/** A GeoJSON Feature object */
export interface IFeature {
  type: FeatureType;
  bbox?: null | undefined | number[];
  geometry: IPoint | ILineString | IMultiLineString | IPolygon | IMultiPolygon;
  properties: ICbrnProperties;
}

/**
 * A GeoJSON FeatureCollection object where the properties represent CBRN plumes.
 */
export interface ICbrnFeatureCollection {
  _id: string;
  context: string;
  type: FeatureCollectionType;
  bbox?: null | undefined | number[];
  features?: null | undefined | IFeature[];
}
