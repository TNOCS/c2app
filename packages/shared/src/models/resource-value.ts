export enum ResourceType {
  person = 'person',
  vehicle = 'vehicle',
  unmannedVehicle = 'unmannedVehicle',
}

export enum ResourceSubtype {
  fireman = 'fireman',
  policeman = 'policeman',
  first_responder = 'first_responder',
  sanitary = 'sanitary',
  car = 'car',
  van = 'van',
  truck = 'truck',
  air = 'air',
  ground = 'ground',
}

export interface IGeometry {
  type: string;
  coordinates: number[];
}

export interface IAttitude {
  /** Pitch angle */
  pitch: number;
  /** roll angle */
  roll: number;
  /** Yaw angle */
  yaw: number;
  /** Camera offset from the resource's GPS (3 floats) */
  offset?: null | undefined | number[];
}

export interface ICamera {
  /** Identifier of the camera */
  _id: string;
  /** URL of the camera's video streaming */
  url: string;
  /** Attitude of the camera at last status */
  attitude?: null | undefined | IAttitude;
  /** Frame encoded in base64 at time of last status */
  photo: string;
}

/**
 * This object represents any type of resource whether it be FRs, vehicles,
 * UxVs... Database collection: resources
 */
export interface IResource {
  /** Resource unique identifier */
  _id: string;
  /** Type of resource */
  type: ResourceType;
  /**
   * Subtype of resource. Note that the subtype must be in accordance with the type
   * of resource, so the applicable subtypes for 'person' are ['fireman',
   * 'policeman', 'sanitary'], for 'vehicle' are ['car', 'van', 'truck'] and for
   * 'unmannedVehicle' are ['air', 'ground']
   */
  subtype: ResourceSubtype;
  /** Position of the unit in its organization */
  hierarchy?: null | undefined | number[];
  /** Vehicle plate */
  plate?: null | undefined | string;
  /** Minimum altitude in meters at which the unmanned vehicle can work */
  workingAltitudeMinimum?: null | undefined | number;
  /** Maximum altitude in meters at which the unmanned vehicle can work */
  workingAltitudeMaximum?: null | undefined | number;
  /** Speed in m/s at which the unmanned vehicle moves in normal conditions */
  operationSpeed?: null | undefined | number;
  /** Speed in m/s at which the unmanned vehicle lifts in normal conditions */
  climbSpeed?: null | undefined | number;
  /** Identifiers of the sensors that the resource has */
  sensors?: null | undefined | string[];
  /** Identifier of the context to which the last status is related */
  context?: null | undefined | string;
  /** Identifier of the mission (if any) to which the last status is related */
  mission: string;
  /** Approximate minutes of battery life remaining */
  remainingAutonomy?: null | undefined | number;
  /**
   * GeoJSON geometry object to represent the last known location of the resource
   */
  geometry: IGeometry;
  /** Height above ground at last status */
  height?: null | undefined | number;
  /** Speed at last status */
  speed?: null | undefined | number;
  /** Attitude at last status */
  attitude?: null | undefined | IAttitude;
  /** Properties and last status of the resource cameras */
  cameras?: null | undefined | ICamera[];
  /**
   * Date in ISO 8601 format in which the resource is inserted/updated, e.g.
   * 2020-01-01T10:00:00.000Z
   */
  timestamp: number;
}
