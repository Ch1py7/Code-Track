import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { config } from 'dotenv'
import "reflect-metadata"
import { TaskHttpModule } from './modules/task/task-http.module'
config()

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(TaskHttpModule, { cors: true })
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
