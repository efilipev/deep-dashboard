export enum ModelTrafficTypes {
  TRAFFIC = "Traffic Pattern",
  DETECTORS = "Detectors",
  PROTECTORS = "Protectors",
}

export interface ModelTrafficEventPayload {
  timestamp: string;
  traffic: number;
  detectors: number;
  protectors: number;
}

export interface ModelTrafficPayloadResponse {
  period: number;
  total: {
    [ModelTrafficTypes.TRAFFIC]: number;
    [ModelTrafficTypes.DETECTORS]: number;
    [ModelTrafficTypes.PROTECTORS]: number;
  };
  data: ModelTrafficEventPayload[];
}
