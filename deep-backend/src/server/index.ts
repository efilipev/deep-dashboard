import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "@/src/app.module";
import { MicroserviceOptions } from "@nestjs/microservices";
import { genericKafkaConfiguration } from "@/src/queue/config/kafka";
import { DefaultKafkaInitializer } from "@/src/queue/services/default.kafka.init";
import applicationConfig from "../config";

const { API_BASE_URL, PORT } = applicationConfig();

export class ApplicationServer {
  private static server: NestFastifyApplication;

  constructor() {
    ApplicationServer.init();
  }

  static async init(): Promise<void> {
    // Create billing fastify server
    this.server = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      {
        logger: ["log", "error", "warn"],
      },
    );

    this.server.enableCors();
    this.server.useGlobalPipes(new ValidationPipe());
    this.server.setGlobalPrefix("api");
    await this.initializeKafka();
    await this.server.startAllMicroservices();

    this.listen();
    this.registerShutdownHandlers();
  }

  private static initializeKafka = async () => {
    const configService = this.server.get<ConfigService>(ConfigService);
    const kafkaOptions = await genericKafkaConfiguration(configService);
    this.server.connectMicroservice<MicroserviceOptions>(kafkaOptions);
    const defaultKafka = this.server.get(DefaultKafkaInitializer);
    await defaultKafka.init();
  };

  private static listen() {
    return this.server.listen(PORT, API_BASE_URL, () =>
      console.log(`Server is up and running at ${API_BASE_URL}:${PORT}`),
    );
  }

  private static async closeServer(): Promise<void> {
    if (this.server) {
      console.log("Closing the server...");
      await new Promise<void>((resolve) => {
        this.server?.close();
        console.log("Server closed successfully.");
        resolve();
      });
    }
  }

  private static registerShutdownHandlers() {
    process.on("SIGINT", async () => {
      console.log("\nReceived SIGINT signal. Shutting down...");
      await this.closeServer();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("\nReceived SIGTERM signal. Shutting down...");
      await this.closeServer();
      process.exit(0);
    });
  }
}
