import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CacheService } from "@/src/db/services/cache.service";
import dbConfig from "./config";

@Module({
  imports: [ConfigModule.forFeature(dbConfig)],
  providers: [CacheService],
  exports: [CacheService],
})
export class DbModule {}
