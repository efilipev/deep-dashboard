import { Injectable, Logger } from "@nestjs/common";
import { CachingTypes } from "@/src/db/common/types";
import { CacheService } from "@/src/db/services/cache.service";
import { ModelScoreEventPayload } from "@/src/score/common/types";
import { ScorePeriod } from "@/src/score/common/constants";

@Injectable()
export class ModelScoreService {
  private readonly logger = new Logger(ModelScoreService.name);

  private cachingClient;

  constructor(private readonly cachingService: CacheService) {
    this.cachingClient = this.cachingService.getClient();
  }

  async processModelScore(data: ModelScoreEventPayload): Promise<void> {
    try {
      const timestamp = Math.floor(new Date(data.timestamp).getTime() / 1000);

      // Store data in Redis sorted set
      await this.cachingClient.zadd(
        CachingTypes.SCORE,
        timestamp,
        JSON.stringify(data),
      );

      // Remove data older than 1 hour
      const oneHourAgo = Math.floor((Date.now() - 60 * 60 * 1000) / 1000);
      this.cachingClient.zremrangebyscore(CachingTypes.SCORE, 0, oneHourAgo);
    } catch (error: any) {
      this.logger.error("Failed to process score data : ", error);
      return error;
    }
  }

  async getModelScore(
    period: ScorePeriod = "20",
  ): Promise<ModelScoreEventPayload> {
    try {
      const parsedPeriod = parseInt(period as string, 10) || 20;
      const cutoffTime = Math.floor(
        (Date.now() - parsedPeriod * 60 * 1000) / 1000,
      );
      const data = await this.cachingClient.zrangebyscore(
        CachingTypes.SCORE,
        cutoffTime,
        "+inf",
      );

      const modelScoreData: ModelScoreEventPayload[] = data.map((item) => {
        const parsedItem = JSON.parse(item);
        return {
          timestamp: new Date(parsedItem.timestamp * 1000),
          attack: parsedItem.attack,
          latency: parsedItem.latency,
          totalScore: parsedItem.totalScore,
          performance: parsedItem.performance,
        };
      });

      return this.aggregateModelScoreData(modelScoreData);
    } catch (error: any) {
      this.logger.error("Failed to get score data : ", error);
      return error;
    }
  }

  private aggregateModelScoreData(
    data: ModelScoreEventPayload[] = [],
  ): ModelScoreEventPayload {
    if (!data || !data.length) {
      return {
        timestamp: new Date().toISOString(),
        attack: 0,
        latency: 0,
        totalScore: 0,
        performance: 0,
      };
    }
    const totalEntries = data.length;

    const totalScoreSum = data.reduce((sum, item) => sum + item.totalScore, 0);
    const latencySum = data.reduce((sum, item) => sum + item.latency, 0);
    const attackSum = data.reduce((sum, item) => sum + item.attack, 0);
    const performanceSum = data.reduce(
      (sum, item) => sum + item.performance,
      0,
    );

    return {
      timestamp: new Date().toISOString(),
      totalScore: Math.floor(totalScoreSum / totalEntries),
      latency: Math.floor(latencySum / totalEntries),
      attack: Math.floor(attackSum / totalEntries),
      performance: Math.floor(performanceSum / totalEntries),
    };
  }
}
