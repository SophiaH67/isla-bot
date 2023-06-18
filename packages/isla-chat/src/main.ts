import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { protobufPackage } from '@marnixah/isla-proto/dist/islachat';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: protobufPackage,
        protoPath: join(
          __dirname,
          '../../isla-proto/dist/proto/islachat.proto',
        ),
      },
    },
  );
  await app.listen();
}
bootstrap();
