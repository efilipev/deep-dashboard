import { Module } from "@nestjs/common";
import { ClientsModule } from "@nestjs/microservices";
import { ConfigModule } from "@nestjs/config";
import { QueueService } from "@/src/queue/services/queue.service";
import { getKafkaClientConfiguration } from "@/src/queue/config/kafka";
import { DefaultKafkaInitializer } from "@/src/queue/services/default.kafka.init";
import queueConfig from "./config";

@Module({
  imports: [
    ConfigModule.forFeature(queueConfig),
    ClientsModule.registerAsync([getKafkaClientConfiguration()]),
  ],
  providers: [QueueService, DefaultKafkaInitializer],
  exports: [QueueService, DefaultKafkaInitializer],
})
export class QueueModule {}
