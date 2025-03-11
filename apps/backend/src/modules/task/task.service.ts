import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateTaskDto } from './dto/create-task.dto'
import { UpdateTaskDto } from './dto/update-task.dto'
import { Task } from './entities/task.entity'

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) { }

  create(createTaskDto: CreateTaskDto) {
    return this.tasksRepository.save(createTaskDto)
  }

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find()
  }

  findOne(id: string) {
    return this.tasksRepository.findOneBy({ id })
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return this.tasksRepository.update({ id }, updateTaskDto)
  }

  remove(id: string) {
    return this.tasksRepository.delete(id)
  }
}
