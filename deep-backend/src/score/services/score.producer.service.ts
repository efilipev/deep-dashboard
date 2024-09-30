import {
  Inject,
  Logger,
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { generateRandom } from "@/src/utils";
import { ModelTopics } from "@/src/queue/common/topics";
import { QueueService } from "@/src/queue/services/queue.service";
import { ModelScoreEventPayload } from "@/src/score/common/types";

@Injectable()
export class ModelScoreProducerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ModelScoreProducerService.name);

  private descriptor: ReturnType<typeof setInterval> | undefined;
  constructor(@Inject() private readonly queueService: QueueService) {}

  async onModuleInit() {
    this.produceScoreData();
  }

  private produceScoreData() {
    try {
      this.descriptor = setInterval(async () => {
        const data = {
          timestamp: new Date().toISOString(),
          totalScore: generateRandom(0, 100),
          latency: generateRandom(0, 1000),
          attack: generateRandom(0, 50),
          performance: generateRandom(0, 100),
        } as ModelScoreEventPayload;

        this.queueService.send(ModelTopics.SCORE, JSON.stringify(data));
      }, 1000);
    } catch (error: any) {
      this.logger.error("Failed to produce score data : ", error);
    }
  }

  onModuleDestroy(): void {
    clearInterval(this.descriptor);
  }
}
