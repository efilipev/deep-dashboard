import { ModelScoreTrend } from "@/pages/Dashboard/components/ModelScore/components/ModelScoreCards/components/ModelScoreTrend";

interface ModelScoreCardInterface {
  title: string;
  text: string;
  trend: "up" | "down";
  score: number;
}
export const ModelScoreCard = ({
  title,
  text,
  score,
  trend,
}: ModelScoreCardInterface) => {
  return (
    <div className="flex-1 p-4 rounded-lg bg-ms-period-bg">
      <h2 className="text-xl text-ms-title-font">{title}</h2>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold text-font-primary">{text}</span>
        <ModelScoreTrend trend={trend} score={score} />
      </div>
    </div>
  );
};
