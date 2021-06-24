export enum UseMeteoService {
  true = 'true',
  false = 'false'
}

export enum ChemicalSubstance {
  UnknownLow = 'UnknownLow',
  UnknownMedium = 'UnknownMedium',
  UnknownHigh = 'UnknownHigh',
  alpha_Methylstyrene = 'alpha_Methylstyrene',
  Trichloroethane_1_1_1 = 'Trichloroethane_1_1_1',
  Dichloroethane_1_1 = 'Dichloroethane_1_1',
  Dichloroethylene_1_1 = 'Dichloroethylene_1_1',
  Dimethylhydrazine_1_1 = 'Dimethylhydrazine_1_1',
  Trimethylbenzene_1_2_3 = 'Trimethylbenzene_1_2_3',
  Trimethylbenzene_1_2_4 = 'Trimethylbenzene_1_2_4',
  Dichloroethane_1_2 = 'Dichloroethane_1_2',
  Dichloroethylene_1_2 = 'Dichloroethylene_1_2',
  Dichloropropane_1_2 = 'Dichloropropane_1_2',
  Trimethylbenzene_1_3_5 = 'Trimethylbenzene_1_3_5',
  Butadiene_1_3 = 'Butadiene_1_3',
  Dichloropropene_1_3 = 'Dichloropropene_1_3',
  Dioxane_1_4 = 'Dioxane_1_4',
  Bromopropane_1 = 'Bromopropane_1',
  Butanol_1 = 'Butanol_1',
  Butene_1 = 'Butene_1',
  Ethoxy_2_propanol_1 = 'Ethoxy_2_propanol_1',
  Hexanol_1 = 'Hexanol_1',
  Propanethiol_1 = 'Propanethiol_1',
  Propanol_1 = 'Propanol_1',
  Propene_1_1_3_3_3_pentafluoro_2_trifluoromethyl_1 = 'Propene_1_1_3_3_3_pentafluoro_2_trifluoromethyl_1',
  Butanedione_2_3 = 'Butanedione_2_3',
  Dinitroaniline_2_4 = 'Dinitroaniline_2_4',
  Butene_2 = 'Butene_2',
  Chloroethanol_2 = 'Chloroethanol_2',
  Chloropropane_2 = 'Chloropropane_2',
  Ethoxyethanol_2 = 'Ethoxyethanol_2',
  Methoxyethanol_2 = 'Methoxyethanol_2',
  Methylbutane_2 = 'Methylbutane_2',
  Nitropropane_2 = 'Nitropropane_2',
  Bromopropene_3 = 'Bromopropene_3',
  Methylenedi_phenylisocyanate_4_4 = 'Methylenedi_phenylisocyanate_4_4',
  Methyl_2_pentanol_4 = 'Methyl_2_pentanol_4',
  Ethylidene_2_norbornene_5 = 'Ethylidene_2_norbornene_5',
  Acetaldehyde = 'Acetaldehyde',
  Aceticacid = 'Aceticacid',
  Aceticacid_2_2_2_trifluoro = 'Aceticacid_2_2_2_trifluoro',
  Aceticacid_2_bromo_ethylester = 'Aceticacid_2_bromo_ethylester',
  Aceticanhydride = 'Aceticanhydride',
  Acetone = 'Acetone',
  Acetonecyanohydrin = 'Acetonecyanohydrin',
  Acetonitrile = 'Acetonitrile',
  Acetylchloride = 'Acetylchloride',
  Acetylene = 'Acetylene',
  Acrolein = 'Acrolein',
  Acrylicacid = 'Acrylicacid',
  Acrylonitrile = 'Acrylonitrile',
  AllylAlcohol = 'AllylAlcohol',
  Allylchloride = 'Allylchloride',
  Allylglycidylether = 'Allylglycidylether',
  Allylamine = 'Allylamine',
  Aluminumphosphide = 'Aluminumphosphide',
  Ammonia = 'Ammonia',
  Amylmercaptan = 'Amylmercaptan',
  Aniline = 'Aniline',
  Arsine = 'Arsine',
  Aziridine = 'Aziridine',
  Benzene = 'Benzene',
  Benzene_1_1_dichlorosilylene_bis = 'Benzene_1_1_dichlorosilylene_bis',
  Benzylchloride = 'Benzylchloride',
  Biphenyl = 'Biphenyl',
  Bis_chloromethyl_ether = 'Bis_chloromethyl_ether',
  Borontribromide = 'Borontribromide',
  Borontrichloride = 'Borontrichloride',
  Borontrifluoride = 'Borontrifluoride',
  Bromine = 'Bromine',
  Bromoethane = 'Bromoethane',
  Butane = 'Butane',
  Butane_1_1_1_2_2_3_3_4_4_nonafluoro_4_methoxy = 'Butane_1_1_1_2_2_3_3_4_4_nonafluoro_4_methoxy',
  Butylacrylate = 'Butylacrylate',
  Butylisocyanate = 'Butylisocyanate',
  Butylmercaptan = 'Butylmercaptan',
  Butylamine = 'Butylamine',
  Calciumphosphide = 'Calciumphosphide',
  Carbondioxide = 'Carbondioxide',
  Carbondisulfide = 'Carbondisulfide',
  Carbonmonoxide = 'Carbonmonoxide',
  Carbontetrachloride = 'Carbontetrachloride',
  Carbonicdifluoride = 'Carbonicdifluoride',
  Carbonylsulfide = 'Carbonylsulfide',
  CFC_114 = 'CFC_114',
  CFC_12 = 'CFC_12',
  CFC_13 = 'CFC_13',
  Chloral = 'Chloral',
  Chlorine = 'Chlorine',
  Chlorinedioxide = 'Chlorinedioxide',
  Chlorinetrifluoride = 'Chlorinetrifluoride',
  Chloroacetaldehyde = 'Chloroacetaldehyde',
  Chloroaceticacid = 'Chloroaceticacid',
  Chloroacetone = 'Chloroacetone',
  Chloroacetylchloride = 'Chloroacetylchloride',
  Chlorobenzene = 'Chlorobenzene',
  Chloroethane = 'Chloroethane',
  Chloroform = 'Chloroform',
  Chloromethane = 'Chloromethane',
  Chloromethylmethylether = 'Chloromethylmethylether',
  Chloropicrin = 'Chloropicrin',
  Chloroprene = 'Chloroprene',
  Chlorosulfonicacid = 'Chlorosulfonicacid',
  Chlorotoluene = 'Chlorotoluene',
  Chlorotrifluoroethylene = 'Chlorotrifluoroethylene',
  cis_1_2_Dichloroethylene = 'cis_1_2_Dichloroethylene',
  Cobalthydrocarbonyl = 'Cobalthydrocarbonyl',
  Cumene = 'Cumene',
  Cumenehydroperoxide = 'Cumenehydroperoxide',
  Cyanogen = 'Cyanogen',
  Cyanogenbromide = 'Cyanogenbromide',
  Cyanogenchloride = 'Cyanogenchloride',
  Cyclohexanone = 'Cyclohexanone',
  Cyclohexylisocyanate = 'Cyclohexylisocyanate',
  Cyclohexylamine = 'Cyclohexylamine',
  Diallylamine = 'Diallylamine',
  Diborane = 'Diborane',
  Dichloroacetylchloride = 'Dichloroacetylchloride',
  Dichlorosilane = 'Dichlorosilane',
  Dicyclopentadiene = 'Dicyclopentadiene',
  Diethylsulfide = 'Diethylsulfide',
  Diethylamine = 'Diethylamine',
  Diisodecylphthalate = 'Diisodecylphthalate',
  Diketene = 'Diketene',
  Dimethoxymethane = 'Dimethoxymethane',
  Dimethylether = 'Dimethylether',
  Dimethylsulfate = 'Dimethylsulfate',
  Dimethylsulfide = 'Dimethylsulfide',
  Dimethylamine = 'Dimethylamine',
  Dimethyldichlorosilane = 'Dimethyldichlorosilane',
  Distillates_petroleum_straight_runmiddle = 'Distillates_petroleum_straight_runmiddle',
  Epichlorohydrin = 'Epichlorohydrin',
  Ethanamine_N_methyl = 'Ethanamine_N_methyl',
  Ethanol = 'Ethanol',
  Ethylacetate = 'Ethylacetate',
  Ethylacrylate = 'Ethylacrylate',
  Ethylchloroformate = 'Ethylchloroformate',
  Ethylether = 'Ethylether',
  Ethylformate = 'Ethylformate',
  Ethylisocyanate = 'Ethylisocyanate',
  Ethylmercaptan = 'Ethylmercaptan',
  Ethylamine = 'Ethylamine',
  Ethylbenzene = 'Ethylbenzene',
  Ethylene = 'Ethylene',
  Ethylenedibromide = 'Ethylenedibromide',
  Ethyleneglycolmonoethyletheracetate = 'Ethyleneglycolmonoethyletheracetate',
  Ethyleneoxide = 'Ethyleneoxide',
  Ethylenediamine = 'Ethylenediamine',
  Fluorine = 'Fluorine',
  Formaldehyde = 'Formaldehyde',
  Formicacid = 'Formicacid',
  Fumingsulfuricacid = 'Fumingsulfuricacid',
  Furan = 'Furan',
  Furfural = 'Furfural',
  Glutaraldehyde = 'Glutaraldehyde',
  Halon1011 = 'Halon1011',
  Halon1301 = 'Halon1301',
  HCFC_142b = 'HCFC_142b',
  HCFC_21 = 'HCFC_21',
  HCFC_22 = 'HCFC_22',
  Heptane = 'Heptane',
  Hexachlorobutadiene = 'Hexachlorobutadiene',
  Hexachlorocyclopentadiene = 'Hexachlorocyclopentadiene',
  Hexafluoroacetone = 'Hexafluoroacetone',
  Hexane = 'Hexane',
  Hydrazine = 'Hydrazine',
  Hydriodicacid = 'Hydriodicacid',
  Hydrobromicacid = 'Hydrobromicacid',
  Hydrochloricacid = 'Hydrochloricacid',
  Hydrofluoricacid = 'Hydrofluoricacid',
  Hydrogen = 'Hydrogen',
  Hydrogencyanide = 'Hydrogencyanide',
  Hydrogenperoxide = 'Hydrogenperoxide',
  Hydrogenselenide = 'Hydrogenselenide',
  Hydrogensulfide = 'Hydrogensulfide',
  Ironpentacarbonyl = 'Ironpentacarbonyl',
  Isobutane = 'Isobutane',
  Isobutanol = 'Isobutanol',
  Isobutene = 'Isobutene',
  Isobutylacetate = 'Isobutylacetate',
  Isobutylacrylate = 'Isobutylacrylate',
  Isobutylmethacrylate = 'Isobutylmethacrylate',
  Isobutylamine = 'Isobutylamine',
  Isobutyronitrile = 'Isobutyronitrile',
  Isophorone = 'Isophorone',
  Isoprene = 'Isoprene',
  Isopropanol = 'Isopropanol',
  Isopropylacetate = 'Isopropylacetate',
  Isopropylchloroformate = 'Isopropylchloroformate',
  Isopropylether = 'Isopropylether',
  Isopropylamine = 'Isopropylamine',
  Isovaleraldehyde = 'Isovaleraldehyde',
  Kerosene = 'Kerosene',
  Ketene = 'Ketene',
  Magnesiumphosphide = 'Magnesiumphosphide',
  Magnesiumaluminiumphosphide = 'Magnesiumaluminiumphosphide',
  Maleicanhydride = 'Maleicanhydride',
  MAPP = 'MAPP',
  Mercury = 'Mercury',
  Methacrolein = 'Methacrolein',
  Methacrylonitrile = 'Methacrylonitrile',
  Methacryloyloxyethylisocyanate = 'Methacryloyloxyethylisocyanate',
  Methanol = 'Methanol',
  Methylacetate = 'Methylacetate',
  Methylacrylate = 'Methylacrylate',
  Methylbromide = 'Methylbromide',
  Methylchlorocarbonate = 'Methylchlorocarbonate',
  Methyldisulfide = 'Methyldisulfide',
  Methylethylketone = 'Methylethylketone',
  Methylformate = 'Methylformate',
  Methylhydrazine = 'Methylhydrazine',
  Methyliodide = 'Methyliodide',
  Methylisocyanate = 'Methylisocyanate',
  Methylmercaptan = 'Methylmercaptan',
  Methylmethacrylate = 'Methylmethacrylate',
  Methyltert_butylether = 'Methyltert_butylether',
  Methylvinylketone = 'Methylvinylketone',
  Methylamine = 'Methylamine',
  Methyldichlorosilane = 'Methyldichlorosilane',
  Methylenechloride = 'Methylenechloride',
  Methyltrichlorosilane = 'Methyltrichlorosilane',
  Mustardgas = 'Mustardgas',
  N_N_Dimethylformamide = 'N_N_Dimethylformamide',
  Naturalgasoline = 'Naturalgasoline',
  n_Butylacetate = 'n_Butylacetate',
  Nickelcarbonyl = 'Nickelcarbonyl',
  Nicotine = 'Nicotine',
  Nitricacid = 'Nitricacid',
  Nitricacid_1_methylethylester = 'Nitricacid_1_methylethylester',
  Nitricoxide = 'Nitricoxide',
  Nitrobenzene = 'Nitrobenzene',
  Nitrocellulose = 'Nitrocellulose',
  Nitrogendioxide = 'Nitrogendioxide',
  Nitrogentrifluoride = 'Nitrogentrifluoride',
  Nitromethane = 'Nitromethane',
  Nitrosylchloride = 'Nitrosylchloride',
  Nitrousoxide = 'Nitrousoxide',
  n_Propylnitrate = 'n_Propylnitrate',
  o_Chlorobenzylidenemalononitrile = 'o_Chlorobenzylidenemalononitrile',
  o_Cresol = 'o_Cresol',
  Octane = 'Octane',
  O_EthylS_2_diisopropylaminoethyl_methylphosphonothioate = 'O_EthylS_2_diisopropylaminoethyl_methylphosphonothioate',
  Osmiumtetroxide = 'Osmiumtetroxide',
  Ozone = 'Ozone',
  Parathion = 'Parathion',
  Pentaborane = 'Pentaborane',
  Pentane = 'Pentane',
  Peraceticacid = 'Peraceticacid',
  Perchloromethylmercaptan = 'Perchloromethylmercaptan',
  Petroleumgases_liquefied = 'Petroleumgases_liquefied',
  Phenol = 'Phenol',
  Phenylether = 'Phenylether',
  Phenylisocyanate = 'Phenylisocyanate',
  Phosgene = 'Phosgene',
  Phosphine = 'Phosphine',
  Phosphonofluoridicacid_methyl_cyclohexylester = 'Phosphonofluoridicacid_methyl_cyclohexylester',
  Phosphoricacid = 'Phosphoricacid',
  Phosphorusoxychloride = 'Phosphorusoxychloride',
  Phosphoruspentasulfide = 'Phosphoruspentasulfide',
  Phosphoruspentoxide = 'Phosphoruspentoxide',
  Phosphorustribromide = 'Phosphorustribromide',
  Phosphorustrichloride = 'Phosphorustrichloride',
  Piperazine = 'Piperazine',
  Piperidine = 'Piperidine',
  Potassiumphosphide_K3P = 'Potassiumphosphide_K3P',
  Propane = 'Propane',
  Propane_1_isocyanato_2_methyl = 'Propane_1_isocyanato_2_methyl',
  Propanenitrile = 'Propanenitrile',
  Propanoylchloride = 'Propanoylchloride',
  Propionaldehyde = 'Propionaldehyde',
  Propionicacid = 'Propionicacid',
  Propylacetate = 'Propylacetate',
  Propylamine = 'Propylamine',
  Propylene = 'Propylene',
  Propyleneglycol = 'Propyleneglycol',
  Propyleneglycoldinitrate = 'Propyleneglycoldinitrate',
  Propyleneoxide = 'Propyleneoxide',
  Propyleneimine = 'Propyleneimine',
  Pyridine = 'Pyridine',
  Quinone = 'Quinone',
  Sarin = 'Sarin',
  sec_Butylamine = 'sec_Butylamine',
  Seleniumhexafluoride = 'Seleniumhexafluoride',
  Silane = 'Silane',
  Silane_tetrachloro = 'Silane_tetrachloro',
  Silane_trichloroethenyl = 'Silane_trichloroethenyl',
  Silane_trichloropropyl = 'Silane_trichloropropyl',
  Sodiumphosphide_Na3P = 'Sodiumphosphide_Na3P',
  Stannane_tetrachloro = 'Stannane_tetrachloro',
  Stibine = 'Stibine',
  Stoddardsolvent = 'Stoddardsolvent',
  Strontiumphosphide_SrP = 'Strontiumphosphide_SrP',
  Styrene = 'Styrene',
  Sulfurchloride_SCl2 = 'Sulfurchloride_SCl2',
  Sulfurdioxide = 'Sulfurdioxide',
  Sulfurmonochloride = 'Sulfurmonochloride',
  Sulfurtetrafluoride = 'Sulfurtetrafluoride',
  Sulfurtrioxide = 'Sulfurtrioxide',
  Sulfuricacid = 'Sulfuricacid',
  Sulfurylchloride = 'Sulfurylchloride',
  Sulfurylfluoride = 'Sulfurylfluoride',
  tert_Butylhydroperoxide = 'tert_Butylhydroperoxide',
  Tetrachloroethylene = 'Tetrachloroethylene',
  Tetrafluoroethene = 'Tetrafluoroethene',
  Tetrahydrofuran = 'Tetrahydrofuran',
  Tetrahydrothiophene = 'Tetrahydrothiophene',
  Tetramethylsilicate = 'Tetramethylsilicate',
  Tetramethyllead = 'Tetramethyllead',
  Tetranitromethane = 'Tetranitromethane',
  Thionylchloride = 'Thionylchloride',
  Titaniumtetrachloride = 'Titaniumtetrachloride',
  Toluene = 'Toluene',
  Toluene_2_4_diisocyanate = 'Toluene_2_4_diisocyanate',
  Toluene_2_6_diisocyanate = 'Toluene_2_6_diisocyanate',
  trans_1_2_Dichloroethylene = 'trans_1_2_Dichloroethylene',
  trans_Crotonaldehyde = 'trans_Crotonaldehyde',
  Trichloroethylene = 'Trichloroethylene',
  Trichloroethylsilane = 'Trichloroethylsilane',
  Trichlorosilane = 'Trichlorosilane',
  Triethylaluminum = 'Triethylaluminum',
  Triethylamine = 'Triethylamine',
  Trimethoxysilane = 'Trimethoxysilane',
  Trimethylamine = 'Trimethylamine',
  Trimethylchlorosilane = 'Trimethylchlorosilane',
  Turpentine_oil = 'Turpentine_oil',
  Uraniumfluoride_UF6_OC_6_11 = 'Uraniumfluoride_UF6_OC_6_11',
  Uraniumoxide_U3O8 = 'Uraniumoxide_U3O8',
  Uraniumoxide_UO2 = 'Uraniumoxide_UO2',
  Vinylacetate = 'Vinylacetate',
  Vinylbromide = 'Vinylbromide',
  Vinylchloride = 'Vinylchloride',
  Vinylethylether = 'Vinylethylether',
  Vinylidenefluoride = 'Vinylidenefluoride',
  Vinyltrimethoxysilane = 'Vinyltrimethoxysilane',
  Xylene = 'Xylene',
  Xylidine = 'Xylidine',
  Zincphosphide = 'Zincphosphide'
}

export enum Toxicity {
  low = 'low',
  medium = 'medium',
  high = 'high'
}

export enum PasquillClass {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F'
}

/** Describes the chemical incident. */
export interface IChemicalIncidentScenario {
  /**
   * The time (incl. date) at which the release started. Datetime in ISO 8601 format.
   */
  start_of_release?: null | undefined | string;
  /**
   * Whether the CHT should use meteo information from external meteo service or
   * from this message
   */
  use_meteo_service?: null | undefined | UseMeteoService;
  /** The height in meter above the ground at which the release takes place */
  source_height?: null | undefined | number;
  /** Released quantity */
  quantity?: null | undefined | number;
  /** The rate (kg/s) at which gas is released */
  release_rate?: null | undefined | number;
  /** the (estimated) duration in seconds after which the releases is stopped */
  duration?: null | undefined | number;
  /** the (English) name of the chemical (gas) */
  chemical?: null | undefined | ChemicalSubstance;
  /** toxicity estimation (low, medium, high) in case the chemical is unknown */
  toxicity?: null | undefined | Toxicity;
  /** the initial size in meter of the gas cloud */
  initial_size?: null | undefined | number;
  /**
   * Coordinates of the location where the release takes place: longitude, latitude
   * in decimal degrees (WGS84), m
   */
  source_location: number[];
  /** the representative wind speed in m/s at and around the location */
  windspeed?: null | undefined | number;
  /**
   * the representative wind direction at and around the location in deg (True North
   * clockwise; direction where the wind comes from)
   */
  winddirection?: null | undefined | number;
  /** the atmospheric stability at and around the location */
  pasquill_class?: null | undefined | PasquillClass;
  /** the terrain roughness in meter at and around the location */
  roughness_length?: null | undefined | number;
}

export enum OutputKind {
  contours = 'contours',
  template = 'template',
  ensemble = 'ensemble',
  trajectories = 'trajectories'
}

/** Extra options to control the output */
export interface IChemicalIncidentControlParameters {
  /** the maximum distance in meter up to which the calculation should be done */
  max_dist?: null | undefined | number;
  /** the height above the ground at which the contour shoud be calculated */
  z?: null | undefined | number;
  cell_size?: null | undefined | number;
  /**
   * the time in second after the release at which the contour shoud be calculated
   */
  time_of_interest?: null | undefined | number;
  /** which kind of output (see enums) is expected */
  output?: null | undefined | OutputKind;
}

export interface IChemicalIncident {
  _id: string;
  context: string;
  /** Describes the chemical incident. */
  scenario: IChemicalIncidentScenario;
  /** Extra options to control the output */
  control_parameters?: null | undefined | IChemicalIncidentControlParameters;
  /** Date in ISO 8601 format in which the context is inserted/updated */
  timestamp: number;
}
