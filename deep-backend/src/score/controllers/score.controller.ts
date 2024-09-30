import {
  Sse,
  Get,
  Query,
  Inject,
  Logger,
  Controller,
  ValidationPipe,
} from "@nestjs/common";
import {
  ScorePeriod,
  ROOT_SCORE_API,
  SCORE_QUERY_KEY,
  SSE_SCORE_ENDPOINT,
} from "@/src/score/common/constants";
import { from, map, Observable } from "rxjs";
import { MODEL_SCORE } from "@/src/queue/common/topics";
import { EventPattern, Payload } from "@nestjs/microservices";
import { ModelScoreEventPayload } from "@/src/score/common/types";
import { ModelScoreService } from "@/src/score/services/score.service";

@Controller(ROOT_SCORE_API)
export class ModelScoreController {
  private readonly logger = new Logger(ModelScoreController.name);

  constructor(
    @Inject() private readonly modelScoreService: ModelScoreService,
  ) {}

  @EventPattern(MODEL_SCORE)
  processModelScore(@Payload(ValidationPipe) payload: ModelScoreEventPayload) {
    this.modelScoreService.processModelScore(payload);
  }

  @Sse(SSE_SCORE_ENDPOINT)
  modelScore(
    @Query(SCORE_QUERY_KEY) period: ScorePeriod,
  ): Observable<{ data: string }> {
    try {
      return from(this.modelScoreService.getModelScore(period)).pipe(
        map((data) => ({
          data: JSON.stringify({ type: "update", data }),
        })),
      );
    } catch (error: any) {
      this.logger.error("Failed to process model score event : ", error);
      return error;
    }
  }

  @Get()
  getModelScore(@Query(SCORE_QUERY_KEY) period: ScorePeriod) {
    return this.modelScoreService.getModelScore(period);
  }
}
