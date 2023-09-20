import { BaseService } from "./BaseService";
import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient implements BaseService {
  async start(): Promise<void> {
    await this.$connect();
  }
}
