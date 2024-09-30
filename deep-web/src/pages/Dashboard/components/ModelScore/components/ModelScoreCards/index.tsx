import { memo } from "react";
import { ModelScoreCard } from "src/pages/Dashboard/components/ModelScore/components/ModelScoreCards/components/ModelScoreCard";

interface ModelScoreCardsProps {
  latency: number;
  attack: number;
  performance: number;
}

enum ModelCardTypes {
  LATENCY = "Latency",
  PERFORMANCE = "Performance",
  ATTACKS_RATE = "Attacks rate",
}

export const ModelScoreCards = memo(
  ({ attack, latency, performance }: ModelScoreCardsProps) => {
    return (
      <div className="flex gap-4 items-center">
        <ModelScoreCard
          score={latency}
          trend="down"
          text={`${latency}ms`}
          title={ModelCardTypes.LATENCY}
        />
        <ModelScoreCard
          score={attack}
          trend="up"
          text={`${attack}ms`}
          title={ModelCardTypes.ATTACKS_RATE}
        />
        <ModelScoreCard
          score={performance}
          trend="up"
          text={`${performance}ms`}
          title={ModelCardTypes.PERFORMANCE}
        />
      </div>
    );
  },
);
