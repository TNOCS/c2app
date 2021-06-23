export interface IAction {
  /** Identifier of the sensor that the action involves */
  sensor: string;
  /**
   * Index of the point in the GeoJSON coordinates field in which the action will
   * take place
   */
  position: number;
  /**
   * Identifier of the action to be taken. The possible values should be given for
   * each sensor
   */
  action: string;
  /**
   * Optional action parameters. The possible values should be given for each sensor
   */
  parameters: string;
}

/** Geographic data as a GeoJSON geometry object */
export interface IGeometry {
  type: string;
  coordinates: number[][];
}

/**
 * Mission defines the path and actions that a resource must take. Database
 * collection: missions
 */
export interface IMission {
  /** Mission unique identifier */
  _id: string;
  /** Brief description of the mission */
  doc: string;
  /** Identifier of the context to which it is related */
  context: string;
  /** Identifier of the resource to which the mission applies */
  resource: string;
  /** Actions to be taken by the resource */
  actions: IAction[];
  geometry: IGeometry;
  /** Date in ISO 8601 format in which the misson begins */
  start: number;
  /** Date in ISO 8601 format in which the misson ends */
  end?: null | undefined | number;
  /** Date in ISO 8601 format in which the misson is inserted/updated */
  timestamp: number;
}
