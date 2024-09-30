import { memo, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getEventsEndpoint } from "@/api";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/DropDownMenu";
import { useEventSource, useQueryParamsState } from "@/hooks";
import { ModelTrafficEventPayload } from "@/pages/Dashboard/components/ModelTraffic";

export enum ModelTrafficTypes {
  TRAFFIC = "Traffic Pattern",
  DETECTORS = "Detectors",
  PROTECTORS = "Protectors",
}

export enum ModelTrafficPeriods {
  TWENTY_MINUTES = "20",
  LAST_HOUR = "60",
}

const periods = {
  [ModelTrafficPeriods.TWENTY_MINUTES]: "Last 20 Minutes",
  [ModelTrafficPeriods.LAST_HOUR]: "Last 1 hour",
};

interface ModelTrafficProps {
  onChange: (data: ModelTrafficEventPayload) => void;
}

export const ModelTrafficHeader = memo(({ onChange }: ModelTrafficProps) => {
  const [searchParams] = useSearchParams();
  const queryPeriod = searchParams.get("tp");
  const [handleQueryParamUpdate] = useQueryParamsState(
    "tp",
    ModelTrafficPeriods.TWENTY_MINUTES,
  );

  const [period, setPeriod] = useState<ModelTrafficPeriods>(
    ModelTrafficPeriods.TWENTY_MINUTES,
  );

  useEventSource(getEventsEndpoint(`traffic/events?tp=${period}`), onChange);

  useEffect(() => {
    if (queryPeriod && queryPeriod !== ModelTrafficPeriods.TWENTY_MINUTES) {
      setPeriod(queryPeriod as ModelTrafficPeriods);
    }
  }, []);

  return (
    <div className="flex justify-between items-center pb-2">
      <div className="p-2 text-2xl text-font-primary font-semibold">
        Model Traffic
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="data-[state=open]:border data-[state=open]:border-dr-border p-2 borderbg-ms-period-bg text-ms-status-font rounded-lg">
              {periods[period]}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[160px] bg-ms-period-bg text-ms-status-font"
          >
            {Object.values(ModelTrafficPeriods).map((period) => (
              <div key={period}>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setPeriod(period as ModelTrafficPeriods);
                    handleQueryParamUpdate("tp", period);
                  }}
                >
                  {periods[period]}
                </DropdownMenuItem>
              </div>
            ))}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
});
