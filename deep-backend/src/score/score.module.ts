import { Module } from "@nestjs/common";
import { DbModule } from "@/src/db/db.module";
import { QueueModule } from "@/src/queue/queue.module";
import { ModelScoreService } from "@/src/score/services/score.service";
import { ModelScoreController } from "@/src/score/controllers/score.controller";
import { ModelScoreProducerService } from "@/src/score/services/score.producer.service";

@Module({
  imports: [QueueModule, DbModule],
  controllers: [ModelScoreController],
  providers: [ModelScoreService, ModelScoreProducerService],
})
export class ScoreModule {}
