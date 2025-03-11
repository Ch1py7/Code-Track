export type Priority = 'high' | 'medium' | 'low'

export interface Task {
	id: string
	title: string
	description: string
	priority: Priority
	deadline: string | null
	tags: string[]
	completed: boolean
	createdAt: string
}
