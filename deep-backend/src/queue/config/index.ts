import { registerAs } from "@nestjs/config";
import { Transport } from "@nestjs/microservices";
import { QueueConfig } from "../common/types";
import { QUEUE_CONFIG_KEY } from "@/src/queue/common/constants";

export default registerAs<QueueConfig>(
  QUEUE_CONFIG_KEY,
  (): QueueConfig => ({
    environment: process.env.NODE_ENV,
    kafka: {
      transport: Transport.KAFKA,
      clientId: process.env.KAFKA_CLIENT_ID,
      groupId: process.env.KAFKA_GROUP_ID,
      consumer: process.env.KAFKA_CONSUMER,
      brokers: process.env.KAFKA_BROKER.split(","),
      retryAttempts: parseInt(process.env.KAFKA_RETRY_ATTEMPS, 10) || 5,
      retryDelayTime: parseInt(process.env.KAFKA_RETRY_DELAY_TIME, 10) || 5000,
    },
  }),
);
