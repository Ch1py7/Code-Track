
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { config } from 'dotenv'
import { Task } from './entities/task.entity'
import { TaskController } from './task.controller'
import { TaskModule } from './task.module'
import { TaskService } from './task.service'
config()

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    url: process.env.PSQL_URL,
    entities: [Task],
    synchronize: true,
    autoLoadEntities: true,
  }), TaskModule],
  providers: [TaskService],
  controllers: [TaskController]
})
export class TaskHttpModule { }
