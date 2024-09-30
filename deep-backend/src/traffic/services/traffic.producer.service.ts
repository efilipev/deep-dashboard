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
import { ModelTrafficEventPayload } from "@/src/traffic/common/types";

@Injectable()
export class ModelTrafficProducerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(ModelTrafficProducerService.name);

  private descriptor: ReturnType<typeof setInterval> | undefined;
  constructor(@Inject() private readonly queueService: QueueService) {}

  onModuleInit() {
    this.startProduceTrafficData();
  }

  private startProduceTrafficData() {
    try {
      this.descriptor = setInterval(async () => {
        const data = {
          timestamp: new Date().toISOString(),
          traffic: generateRandom(40, 80),
          detectors: generateRandom(0, 20),
          protectors: generateRandom(20, 40),
        } as ModelTrafficEventPayload;

        this.queueService.send(ModelTopics.TRAFFIC, data);
      }, 1000);
    } catch (error: any) {
      this.logger.error("Failed to produce model traffic data : ", error);
    }
  }

  onModuleDestroy(): void {
    clearInterval(this.descriptor);
  }
}
