import { memo, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/DropDownMenu";
import { getEventsEndpoint } from "@/api";
import { useEventSource, useQueryParamsState } from "@/hooks";
import { ModelScoreEventPayload } from "@/pages/Dashboard/components/ModelScore";

interface ModelScoreHeaderProps {
  onChange: (data: ModelScoreEventPayload) => void;
}

enum ModelScorePeriods {
  TWENTY_MINUTES = "20",
  LAST_HOUR = "60",
}

const periods = {
  [ModelScorePeriods.TWENTY_MINUTES]: "Last 20 Minutes",
  [ModelScorePeriods.LAST_HOUR]: "Last 1 hour",
};

export const ModelScoreHeader = memo(({ onChange }: ModelScoreHeaderProps) => {
  const [searchParams] = useSearchParams();
  const queryPeriod = searchParams.get("sp");

  const [period, setPeriod] = useState<ModelScorePeriods>(
    ModelScorePeriods.TWENTY_MINUTES,
  );

  const [handleQueryParamUpdate] = useQueryParamsState(
    "sp",
    ModelScorePeriods.TWENTY_MINUTES,
  );

  useEventSource(getEventsEndpoint(`score/events?sp=${period}`), onChange);

  useEffect(() => {
    if (queryPeriod && queryPeriod !== ModelScorePeriods.TWENTY_MINUTES) {
      setPeriod(queryPeriod as ModelScorePeriods);
    }
  }, []);

  return (
    <div className="flex justify-between items-center">
      <div className="p-2 bg-ms-status-bg text-ms-status-font rounded-lg border-ms-status-border border-2">
        Running
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="data-[state=open]:bg-muted p-2 bg-ms-period-bg text-ms-status-font rounded-lg border-0">
              {periods[period]}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[160px] bg-ms-period-bg text-ms-status-font"
          >
            {Object.values(ModelScorePeriods).map((period) => (
              <div key={period}>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setPeriod(period as ModelScorePeriods);
                    handleQueryParamUpdate("sp", period);
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
