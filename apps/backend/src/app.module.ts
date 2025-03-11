import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from 'dotenv'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { Task } from './modules/task/entities/task.entity'
config()

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    url: process.env.PSQL_URL,
    entities: [Task],
    synchronize: true,
    autoLoadEntities: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
