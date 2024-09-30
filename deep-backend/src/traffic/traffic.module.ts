import { Module } from "@nestjs/common";
import { DbModule } from "@/src/db/db.module";
import { QueueModule } from "@/src/queue/queue.module";
import { ModelTrafficService } from "@/src/traffic/services/traffic.service";
import { ModelTrafficController } from "@/src/traffic/controllers/traffic.controller";
import { ModelTrafficProducerService } from "@/src/traffic/services/traffic.producer.service";

@Module({
  imports: [QueueModule, DbModule],
  controllers: [ModelTrafficController],
  providers: [ModelTrafficService, ModelTrafficProducerService],
})
export class TrafficModule {}
