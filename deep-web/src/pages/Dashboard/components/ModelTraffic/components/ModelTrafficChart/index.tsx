import { memo } from "react";
import { GoDotFill } from "react-icons/go";
import {
  YAxis,
  Label,
  XAxis,
  Line,
  Tooltip,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { ModelTrafficEventPayload } from "@/pages/Dashboard/components/ModelTraffic";
import { ModelTrafficTypes } from "@/pages/Dashboard/components/ModelTraffic/components/ModelTrafficHeader";

interface ModelTrafficChartProps {
  data: ModelTrafficEventPayload;
}

const colors = {
  [ModelTrafficTypes.PROTECTORS]: ["#cc3981", "#703179"],
  [ModelTrafficTypes.DETECTORS]: ["#953dd8", "#51337a"],
  [ModelTrafficTypes.TRAFFIC]: ["#72dade", "#426f7c"],
};

const formatDate = (date: string) => {
  const d = new Date(date);
  const minutes = d.getMinutes();
  const hours = d.getHours();
  return `${hours}:${minutes}`;
};

export const ModelTrafficChart = memo(
  ({ data: modelTraffic }: ModelTrafficChartProps) => {
    return (
      <>
        <div className="flex items-center gap-8 pt-8 pb-8">
          {Object.entries(modelTraffic.total).map(([type, value]) => (
            <div key={type}>
              <div className="flex items-center gap-1 pb-2">
                <div>
                  <GoDotFill color={colors[type as ModelTrafficTypes][0]} />
                </div>
                <span className="text-lg" style={{ color: "#707379" }}>
                  {type}
                </span>
              </div>
              <span className="text-xl font-semibold text-font-primary">
                {value}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center self-center h-full w-full bg-secondary rounded-lg">
          <ResponsiveContainer
            className="bg-primary"
            width="100%"
            height="100%"
          >
            <LineChart
              data={modelTraffic.data}
              margin={{ top: 30, right: 45, bottom: 30, left: -10 }}
            >
              <CartesianGrid strokeWidth={0.5} />
              <XAxis
                dy={10}
                dx={10}
                dataKey="timestamp"
                strokeWidth={0.5}
                strokeMiterlimit={5}
                overlinePosition={5}
                tickFormatter={formatDate}
                allowDuplicatedCategory={false}
              >
                <Label dx={10} position="center" value="Time (Local)" />
              </XAxis>
              <Tooltip />
              <YAxis>
                <Label dx={-15} angle={-90} value="Number of Events" />
              </YAxis>
              <Line
                type="monotone"
                dataKey="traffic"
                strokeLinejoin="round"
                fill={colors[ModelTrafficTypes.TRAFFIC][1]}
                stroke={colors[ModelTrafficTypes.TRAFFIC][1]}
              />
              <Line
                type="monotone"
                dataKey="detectors"
                fill={colors[ModelTrafficTypes.DETECTORS][1]}
                stroke={colors[ModelTrafficTypes.DETECTORS][1]}
              />
              <Line
                type="monotone"
                dataKey="protectors"
                fill={colors[ModelTrafficTypes.PROTECTORS][1]}
                stroke={colors[ModelTrafficTypes.PROTECTORS][1]}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </>
    );
  },
);
