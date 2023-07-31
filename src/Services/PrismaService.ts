import Isla from "../Classes/Isla";
import { BaseService } from "./BaseService";
import { PrismaClient } from "@prisma/client";

export class PrismaService extends PrismaClient implements BaseService {
  async onReady(_isla: Isla): Promise<void> {
    await this.$connect();
  }
}
