import { Inject, Injectable, Logger } from "@nestjs/common";
import { CachingTypes } from "@/src/db/common/types";
import { TrafficPeriod } from "@/src/traffic/common/constants";
import { CacheService } from "@/src/db/services/cache.service";
import {
  ModelTrafficTypes,
  ModelTrafficEventPayload,
  ModelTrafficPayloadResponse,
} from "@/src/traffic/common/types";
import { generateRandom } from "@/src/utils";

@Injectable()
export class ModelTrafficService {
  private readonly logger = new Logger(ModelTrafficService.name);

  private cacheClient;

  constructor(@Inject() private readonly cachingService: CacheService) {
    this.cacheClient = this.cachingService.getClient();
  }

  async processTraffic(data: ModelTrafficEventPayload): Promise<void> {
    try {
      const timestamp = Math.floor(new Date(data.timestamp).getTime() / 1000);

      // Store data in Redis sorted set
      await this.cacheClient.zadd(
        CachingTypes.TRAFFIC,
        timestamp,
        JSON.stringify(data),
      );

      // Remove data older than 1 hour
      const oneHourAgo = Math.floor((Date.now() - 60 * 60 * 1000) / 1000);
      await this.cacheClient.zremrangebyscore(
        CachingTypes.TRAFFIC,
        0,
        oneHourAgo,
      );
    } catch (error: any) {
      this.logger.error("Failed to process traffic : ", error);
    }
  }

  async getTrafficData(
    period: TrafficPeriod = "20",
  ): Promise<ModelTrafficPayloadResponse> {
    try {
      const parserPeriod = parseInt(period as string, 10) || 20;

      const cutoffTime = Math.floor(
        (Date.now() - parserPeriod * 60 * 1000) / 1000,
      );

      const data = await this.cacheClient.zrangebyscore(
        CachingTypes.TRAFFIC,
        cutoffTime,
        "+inf",
      );
      const modelTrafficData = data.map((item) =>
        JSON.parse(item),
      ) as ModelTrafficEventPayload[];
      return this.aggregateModelTrafficData(modelTrafficData, parserPeriod);
    } catch (error: any) {
      this.logger.error("Failed to get traffic data : ", error);
    }
  }

  private aggregateModelTrafficData(
    data: ModelTrafficEventPayload[] = [],
    period: number = 20,
  ): ModelTrafficPayloadResponse {
    if (!data || !data.length) {
      return {
        period,
        total: {
          [ModelTrafficTypes.TRAFFIC]: 0,
          [ModelTrafficTypes.DETECTORS]: 0,
          [ModelTrafficTypes.PROTECTORS]: 0,
        },
        data: [],
      };
    }

    const total = data.length;
    const traffic = data.reduce((sum, item) => sum + item.traffic, 0);
    const detectors = data.reduce((sum, item) => sum + item.detectors, 0);
    const protectors = data.reduce((sum, item) => sum + item.protectors, 0);

    const modelTrafficByMinutes: Record<string, ModelTrafficEventPayload[]> =
      {};

    data.forEach((traffic) => {
      const minutes = new Date(traffic.timestamp).getMinutes();

      if (!modelTrafficByMinutes[minutes]) {
        modelTrafficByMinutes[minutes] = [];
      }

      modelTrafficByMinutes[minutes].push(traffic);
    });

    const nextModelTrafficData: ModelTrafficEventPayload[] = [];

    for (const minute in modelTrafficByMinutes) {
      const trafficByMinute = modelTrafficByMinutes[minute];
      const splitTraffic = Array.from(
        { length: Math.floor(trafficByMinute.length / 5) },
        (v, i) => trafficByMinute.slice(i * 5, i * 5 + 5),
      );

      splitTraffic.map((subarray) => {
        const trafficItem = subarray[generateRandom(0, subarray.length - 1)];
        if (trafficItem) {
          nextModelTrafficData.push(trafficItem);
          return;
        }
      });
    }

    return {
      period,
      total: {
        [ModelTrafficTypes.TRAFFIC]: Math.floor(traffic / total),
        [ModelTrafficTypes.DETECTORS]: Math.floor(detectors / total),
        [ModelTrafficTypes.PROTECTORS]: Math.floor(protectors / total),
      },
      data: nextModelTrafficData,
    };
  }
}
