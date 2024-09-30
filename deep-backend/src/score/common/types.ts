export interface ModelScoreEventPayload {
  timestamp: string;
  totalScore: number;
  latency: number;
  attack: number;
  performance: number;
}
