import { Inject, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { ClientKafka } from "@nestjs/microservices";
import { KAFKA_SERVICE_NAME } from "@/src/queue/common/constants";

@Injectable()
export class QueueService {
  constructor(
    @Inject(KAFKA_SERVICE_NAME) private readonly client: ClientKafka,
  ) {}

  send<T>(destination: string, event: T): Observable<T> {
    return this.client.emit(destination, event);
  }
}
