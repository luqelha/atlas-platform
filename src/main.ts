import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  // Prefix all routes with /api
  app.setGlobalPrefix('api');

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Atlas Platform API')
    .setDescription('The Atlas Platform API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Connect Microservice for RabbitMQ Worker
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
      queue: process.env.QUEUE_NAME || 'log_export_queue',
      queueOptions: {
        durable: true,
      },
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Atlas Platform is running on: http://localhost:${port}/api`);
  console.log(`📚 Swagger documentation is available at: http://localhost:${port}/api/docs`);
}
bootstrap();
