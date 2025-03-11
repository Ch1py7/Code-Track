import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 50 })
  title: string

  @Column({ length: 500 })
  description: string

  @Column({ type: 'enum', enum: ['high', 'medium', 'low'], default: 'medium' })
  priority: 'high' | 'medium' | 'low'

  @Column({ type: 'timestamp', nullable: true })
  deadline?: Date

  @Column('simple-array', { nullable: true })
  tags?: string[]

  @Column({ default: false })
  completed: boolean

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date
}
