import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}

// 👆🏻 The best practice according to Nest.js documentation. (the onModuleInit is optional, if we leave it out, it will be initialized when the first query is made (lazy load))
