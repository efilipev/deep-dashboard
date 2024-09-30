import { Redis, RedisOptions } from "ioredis";
import { Inject, Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import dbConfig from "../config";

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);

  private redisClient: Redis;
  private isActive: boolean = false;

  constructor(
    @Inject(dbConfig.KEY)
    private readonly config: ConfigType<typeof dbConfig>,
  ) {
    this.initCache();
  }

  private async initCache(): Promise<Redis> {
    const { clientOptions } = this.config.redis;
    if (!this?.redisClient) {
      this.redisClient = new Redis(clientOptions as RedisOptions);

      if (this.redisClient) {
        this.redisClient.on("error", (err: any) => {
          this.logger.error("Redis error:", err);
          this.isActive = false;
        });

        this.redisClient.on("ready", () => {
          this.logger.log("Redis client is ready");
          this.isActive = true;
        });

        this.redisClient.on("end", () => {
          this.logger.log("Redis connection has been ended");
          this.isActive = false;
        });
      }
    }

    return this.redisClient;
  }

  getClient(): Redis {
    return this.redisClient;
  }

  async shutdown(): Promise<void> {
    if (this.redisClient) {
      this.logger.log("Closing Redis connection...");
      await this.redisClient.quit();
      this.logger.log("Redis connection CLOSED.");
      this.isActive = false;
      this.redisClient = undefined;
    }
  }

  onModuleDestroy(): void {
    this.shutdown();
  }
}
