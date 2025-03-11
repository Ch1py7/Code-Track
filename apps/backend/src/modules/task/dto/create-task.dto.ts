import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsDate, IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class CreateTaskDto {
  @MaxLength(50, { message: 'Title is too long' })
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string

  @MaxLength(500, { message: 'Description is too long' })
  @IsString()
  description: string

  @IsIn(['high', 'medium', 'low'], { message: 'Priority must be high, medium, or low' })
  @IsString()
  @IsNotEmpty({ message: 'Priority is required' })
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
