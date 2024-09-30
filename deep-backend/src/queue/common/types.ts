import { Transport } from "@nestjs/microservices";

export interface QueueConfig {
  environment: string;
  kafka: {
    retryAttempts: number;
    retryDelayTime: number;
    transport: Transport;
    clientId: string;
    groupId: string;
    brokers: string[];
    consumer: string;
  };
}
