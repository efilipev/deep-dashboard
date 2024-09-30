import {
  Get,
  Sse,
  Query,
  Logger,
  Controller,
  ValidationPipe,
} from "@nestjs/common";
import {
  TrafficPeriod,
  ROOT_TRAFFIC_API,
  TRAFFIC_QUERY_KEY,
  TRAFFIC_SSE_ENDPOINT,
} from "@/src/traffic/common/constants";
import { from, map, Observable } from "rxjs";
import { MODEL_TRAFFIC } from "@/src/queue/common/topics";
import { EventPattern, Payload } from "@nestjs/microservices";
import { ModelTrafficEventPayload } from "@/src/traffic/common/types";
import { ModelTrafficService } from "@/src/traffic/services/traffic.service";

@Controller(ROOT_TRAFFIC_API)
export class ModelTrafficController {
  private readonly logger = new Logger(ModelTrafficController.name);

  constructor(private readonly modelTrafficService: ModelTrafficService) {}

  @EventPattern(MODEL_TRAFFIC)
  processTraffic(
    @Payload(ValidationPipe) payload: ModelTrafficEventPayload,
  ): void {
    this.modelTrafficService.processTraffic(payload);
  }

  @Sse(TRAFFIC_SSE_ENDPOINT)
  trafficEvents(
    @Query(TRAFFIC_QUERY_KEY) period: TrafficPeriod,
  ): Observable<{ data: string }> {
    try {
      return from(this.modelTrafficService.getTrafficData(period)).pipe(
        map((data) => ({
          data: JSON.stringify({ type: "update", data }),
        })),
      );
    } catch (error: any) {
      this.logger.error("Failed to process model traffic event : ", error);
      return error;
    }
  }

  @Get()
  getTrafficEvents(@Query(TRAFFIC_QUERY_KEY) period: TrafficPeriod) {
    return this.modelTrafficService.getTrafficData(period);
  }
}
