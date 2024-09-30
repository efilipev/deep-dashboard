import { useCallback, useState } from "react";
import { ModelScoreHeader } from "@/pages/Dashboard/components/ModelScore/components/ModelScoreHeader";
import { ModelScoreChart } from "@/pages/Dashboard/components/ModelScore/components/ModelScoreChart";
import { ModelScoreCards } from "@/pages/Dashboard/components/ModelScore/components/ModelScoreCards";

export interface ModelScoreEventPayload {
  timestamp: Date;
  attack: number;
  latency: number;
  totalScore: number;
  performance: number;
}

const initialModelScore = {
  timestamp: new Date(),
  attack: 0,
  latency: 0,
  totalScore: 0,
  performance: 0,
};

export const ModelScore = () => {
  const [modelData, setModelData] =
    useState<ModelScoreEventPayload>(initialModelScore);

  const handleModelScore = useCallback((data: ModelScoreEventPayload) => {
    setModelData((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <div className="flex flex-col h-1/2 min-h-[500px] flex-1 gap-8 pr-4">
      <ModelScoreHeader onChange={handleModelScore} />
      <ModelScoreChart score={modelData.totalScore} />
      <ModelScoreCards
        attack={modelData.attack}
        latency={modelData.latency}
        performance={modelData.performance}
      />
    </div>
  );
};
