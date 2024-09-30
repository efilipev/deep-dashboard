import { useCallback, useState } from "react";
import {
  ModelTrafficHeader,
  ModelTrafficTypes,
} from "@/pages/Dashboard/components/ModelTraffic/components/ModelTrafficHeader";
import { ModelTrafficChart } from "@/pages/Dashboard/components/ModelTraffic/components/ModelTrafficChart";

export interface ModelTrafficEventPayload {
  period: number;
  total: {
    [ModelTrafficTypes.TRAFFIC]: number;
    [ModelTrafficTypes.DETECTORS]: number;
    [ModelTrafficTypes.PROTECTORS]: number;
  };
  data: {
    timestamp: Date;
    traffic: number;
    detectors: number;
    protectors: number;
  }[];
}

const initialModelTrafficData = {
  period: 20,
  total: {
    [ModelTrafficTypes.TRAFFIC]: 0,
    [ModelTrafficTypes.DETECTORS]: 0,
    [ModelTrafficTypes.PROTECTORS]: 0,
  },
  data: [],
} as ModelTrafficEventPayload;

export const ModelTraffic = () => {
  const [modelTraffic, setModelTraffic] = useState<ModelTrafficEventPayload>(
    initialModelTrafficData,
  );

  const handleModelTraffic = useCallback((data: ModelTrafficEventPayload) => {
    setModelTraffic((prevData) => ({ ...prevData, ...data }));
  }, []);

  return (
    <div className="flex flex-col h-1/2 min-h-[500px] flex-1 rounded-lg bg-primary p-8">
      <ModelTrafficHeader onChange={handleModelTraffic} />
      <ModelTrafficChart data={modelTraffic} />
    </div>
  );
};
