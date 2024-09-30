import { registerAs } from "@nestjs/config";
import { RedisOptions } from "ioredis";
import { DatabaseConfig } from "@/src/db/common/types";
import { DATABASE_CONFIG_KEY } from "@/src/db/common/constants";

export default registerAs(DATABASE_CONFIG_KEY, (): DatabaseConfig => {
  return {
    environment: process.env.NODE_ENV,
    localTesting: process.env.LOCAL_TESTING,
    redis: {
      clientOptions: {
        host: process.env.REDIS_CLUSTER_HOST,
        port: parseInt(process.env.REDIS_CLUSTER_PORT, 10),
      } as RedisOptions,
    },
  };
});
