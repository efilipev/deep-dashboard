import { Module } from "@nestjs/common";
import { HealthController } from "./controllers/health.controller";
import { ScoreModule } from "@/src/score/score.module";
import { TrafficModule } from "@/src/traffic/traffic.module";
import { QueueModule } from "@/src/queue/queue.module";
import { DbModule } from "@/src/db/db.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    DbModule,
    QueueModule,
    ScoreModule,
    TrafficModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
