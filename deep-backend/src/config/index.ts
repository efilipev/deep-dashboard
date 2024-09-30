import * as process from "node:process";
import { ApplicationConfig } from "@/src/config/common/types";

export default (): ApplicationConfig => {
  return {
    PORT: parseInt(process.env.API_PORT, 10) || 3003,
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
    API_BASE_URL: process.env.API_BASE_URL || "http://localhost",
  };
};
