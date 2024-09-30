import { BiTrendingDown, BiTrendingUp } from "react-icons/bi";

interface ModelScoreTrendProps {
  trend: "up" | "down";
  score: number;
}

const trendColors = {
  up: "#43876b",
  down: "#a1316c",
};

export const ModelScoreTrend = ({ trend, score }: ModelScoreTrendProps) => {
  return (
    <div className="flex items-center gap-1">
      {trend === "up" && (
        <>
          <BiTrendingUp color={trendColors[trend]} size={24} />
          <span className="text-xl" style={{ color: trendColors[trend] }}>
            +{score}
          </span>
        </>
      )}
      {trend === "down" && (
        <>
          <BiTrendingDown color={trendColors[trend]} size={24} />
          <span className="text-xl" style={{ color: trendColors[trend] }}>
            -{score}
          </span>
        </>
      )}
    </div>
  );
};
