import { memo } from "react";
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from "recharts";

const defaultColors = [
  ["#49203b", "#4a213b", "#902d60"],
  ["#251d2b", "#231f2b", "#502e4b"],
  ["#23202c", "#22202b", "#42354a"],
  ["#22232f", "#22232f", "#3d4756"],
  ["#20262f", "#20262f", "#36565e"],
];

const totalSections = 5;
const sectionAngles = [60, 60, 60, 60, 60];

interface ModelScoreChartProps {
  score: number;
}

export const ModelScoreChart = memo(({ score }: ModelScoreChartProps) => {
  const data = sectionAngles.map((angle, index) => ({
    name: `Section ${index + 1}`,
    value: angle,
    color: index === 2 ? "#8884d8" : "#373737",
  }));

  const activeIndex = Math.floor((score / 100) * totalSections);
  return (
    <div className="flex items-center self-center h-full w-96 min-h-48 bg-secondary rounded-lg">
      <ResponsiveContainer width="100%">
        <PieChart>
          <Pie
            data={data}
            stroke="none"
            labelLine={false}
            innerRadius={50}
            outerRadius={120}
            startAngle={210}
            endAngle={-30}
            dataKey="value"
          >
            <defs>
              {defaultColors.map((color, index) => (
                <linearGradient
                  key={index}
                  id={`color${color[0]}${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color[0]} />
                  <stop offset="95%" stopColor={color[1]} />
                </linearGradient>
              ))}
            </defs>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  index === activeIndex
                    ? defaultColors[index][1]
                    : defaultColors[index][0]
                }
                stroke={defaultColors[index][2]}
                strokeWidth={2}
              />
            ))}
            <Label
              value={score}
              fill="#ffffff"
              position="center"
              className="text-3xl font-bold"
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});
