import { ClientsProviderAsyncOptions, Transport } from "@nestjs/microservices";
import { QueueConfig } from "@/src/queue/common/types";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  QUEUE_CONFIG_KEY,
  KAFKA_SERVICE_NAME,
} from "@/src/queue/common/constants";
import { KafkaOptions } from "@nestjs/microservices/interfaces/microservice-configuration.interface";

export const genericKafkaConfiguration = async (
  config: ConfigService,
): Promise<KafkaOptions> => {
  try {
    const configuration = await config.get<QueueConfig>(QUEUE_CONFIG_KEY);

    return {
      transport: configuration.kafka.transport as Transport.KAFKA,
      options: {
        client: {
          brokers: configuration.kafka.brokers,
          clientId: configuration.kafka.clientId,
        },
        producer: {
          retry: {
            retries: configuration.kafka.retryAttempts,
            maxRetryTime: configuration.kafka.retryDelayTime,
          },
          allowAutoTopicCreation: true,
        },
        consumer: {
          groupId: configuration.kafka.groupId,
          retry: {
            retries: configuration.kafka.retryAttempts,
            maxRetryTime: configuration.kafka.retryDelayTime,
          },
          allowAutoTopicCreation: true,
        },
      },
    } as KafkaOptions;
  } catch (error: any) {
    console.error("Failed to create a kafka configuration : ", error);
    throw error;
  }
};

export const getKafkaClientConfiguration = (): ClientsProviderAsyncOptions => {
  return {
    name: KAFKA_SERVICE_NAME,
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return await genericKafkaConfiguration(configService);
    },
  };
};
