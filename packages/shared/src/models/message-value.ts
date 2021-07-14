export enum MessageType {
  info = 'info',
  warning = 'warning',
  danger = 'danger',
  INFO = 'INFO',
  WARNING = 'WARNING',
  DANGER = 'DANGER',
}

export enum PriorityType {
  very_low = 'very_low',
  low = 'low',
  medium = 'medium',
  high = 'high',
  very_high = 'very_high',
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
}

export enum PointType {
  Point = 'Point',
}

/** Describes a point geometry */
export interface IPoint {
  type: PointType;
  coordinates: number[];
}

export enum MultiPointType {
  MultiPoint = 'MultiPoint',
}

/** Describes a collection of points geometry */
export interface IMultiPoint {
  type: MultiPointType;
  coordinates: number[][];
}

export enum LineStringType {
  LineString = 'LineString',
}

/** Describes a LineString geometry */
export interface ILineString {
  type: LineStringType;
  coordinates: number[][];
}

export enum MultiLineStringType {
  MultiLineString = 'MultiLineString',
}

/** Describes a MultiLineString geometry */
export interface IMultiLineString {
  type: MultiLineStringType;
  coordinates: number[][][];
}

export enum PolygonType {
  Polygon = 'Polygon',
}

/** Describes a Polygon geometry */
export interface IPolygon {
  type: PolygonType;
  coordinates: number[][][];
}

export enum MultiPolygonType {
  MultiPolygon = 'MultiPolygon',
}

/** Describes a MultiPolygon geometry */
export interface IMultiPolygon {
  type: MultiPolygonType;
  coordinates: number[][][][];
}

export interface IAssistanceMessage {
  /** Message unique identifier */
  _id: string;
  /** Identifier of the context to which it is related */
  context?: null | undefined | string;
  /** Name or identifier of the service, application, etc. sending the message */
  sender: string;
  /** Identifier of the resource hat must receive the message */
  resource: string;
  /** Classification of the information contained in the message */
  type?: MessageType;
  /** Priority of the message */
  priority?: PriorityType;
  /** Content of the message sent to the resource */
  text?: null | undefined | string;
  /**
   * GeoJSON geometry object that may be sent to complement the text message (e.g.
   * to indicate the receiver where to go, a danger zone, etc.)
   */
  geometry?: null | undefined | IPoint | IMultiPoint | ILineString | IMultiLineString | IPolygon | IMultiPolygon;
  /**
   * Optional message attachments. These could be a base64 encoded image or the ID
   * of a file uploaded to the SAS that the receiver should download
   */
  attachments?: null | undefined | string[];
  /**
   * Text sent by the reciever. It should be used at least as acknowledgement so the
   * sender can verify the message has been received
   */
  response?: null | undefined | string;
  /**
   * Date in ISO 8601 format on which information should be taken into consideration
   */
  dueBy?: null | undefined | number;
  /** Date in ISO 8601 format on which the information may no longer be valid */
  expires?: null | undefined | number;
  /** Date in ISO 8601 format on which the message is inserted/updated */
  timestamp?: null | undefined | number;
}
