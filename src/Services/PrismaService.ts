import { BaseService } from "./BaseService";
import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient implements BaseService {
  async onStart(): Promise<void> {
    await this.$connect();
  }
}
