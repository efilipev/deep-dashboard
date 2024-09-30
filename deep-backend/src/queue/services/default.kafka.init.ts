import { Inject, Injectable, Scope } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { ModelTopics } from "@/src/queue/common/topics";
import { KAFKA_SERVICE_NAME } from "@/src/queue/common/constants";

const topics = Object.values(ModelTopics) || [];

@Injectable({ scope: Scope.DEFAULT })
export class DefaultKafkaInitializer {
  constructor(
    @Inject(KAFKA_SERVICE_NAME) private readonly clientKafka: ClientKafka,
  ) {}

  async init() {
    try {
      const admin = this.clientKafka.createClient().admin();
      await admin.connect();
      const activeTopics = await admin.listTopics();

      if (activeTopics?.length && topics.length) {
        const topicList = topics.filter(
          (topic) => !activeTopics.includes(topic),
        );
        if (topicList.length > 0) {
          const newTopics = topicList.map((topic) => ({ topic }));
          await admin.createTopics({ topics: newTopics });
        }
      }
    } catch (error: any) {
      console.error("Failed to initialize kafka topics : ", error);
    }
  }
}
