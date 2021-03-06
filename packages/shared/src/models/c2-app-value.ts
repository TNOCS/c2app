import { IChemicalIncident } from './chemical_incident-value';
import { FeatureCollection } from 'geojson'

export interface IGridOptions {
  gridCellSize: number;
  updateLocation: boolean;
  gridLocation: [number, number, number, number];
  updateGrid: boolean;
}

export interface IMessage {
  id: string;
  sender: string;
  message: string;
}

export interface IServerMessage {
  id: string;
  callsign: string;
  message: string;
}

export interface IGroup {
  id: string;
  callsigns: Array<string>;
  owner: string;
  name: string;
}

export interface IServerGroup {
  features: FeatureCollection;
  callsigns: Array<string>;
  owner: string;
  name: string;
}

export interface IReturnGroup {
  id: string;
  callsigns: Array<string>;
  owner: string;
  name: string;
}

export interface IGroupsInit {
  callsign: string;
}

export interface IGroupCreate {
  callsign: string;
  group: FeatureCollection;
  name: string
}

export interface INameUpdate {
  callsign: string;
  id: string;
  name: string;
}

export interface IGroupUpdate {
  callsign: string;
  group: FeatureCollection;
  id: string;
  name: string;
}

export interface IGroupDelete {
  callsign: string;
  id: string;
}

export interface ICHT {
  hazard: Partial<IChemicalIncident>
}
