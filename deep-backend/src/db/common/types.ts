import { RedisOptions } from "ioredis";

export interface DatabaseConfig {
  localTesting: string;
  environment: string;
  redis: {
    clientOptions: RedisOptions;
  };
}

export enum CachingTypes {
  SCORE = "score",
  TRAFFIC = "traffic",
}
