import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsDate, IsIn, IsOptional, MaxLength, MinLength } from 'class-validator'

export class CreateTaskDto {
  @MinLength(1, { message: 'Title is required' })
  @MaxLength(50, { message: 'Title is too long' })
  title: string

  @MaxLength(500, { message: 'Description is too long' })
  description: string

  @IsIn(['high', 'medium', 'low'], { message: 'Priority must be high, medium, or low' })
  priority: 'high' | 'medium' | 'low'

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'Deadline must be a valid date' })
  deadline?: Date

  @IsOptional()
  @IsArray({ message: 'Tags must be an array' })
  tags?: string[]

  @IsBoolean({ message: 'Completed must be a boolean' })
  completed: boolean
}
