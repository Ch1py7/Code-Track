'use client'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import type { Task } from '@/lib/types'
import { format } from 'date-fns'
import { Calendar, CheckCircle, Circle, Clock, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface TaskCardProps {
	task: Task
	onEdit: (task: Task) => void
	onDelete: (id: string) => void
	onToggleComplete: (id: string, state: boolean) => void
}

const priorityColors = {
	high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
	medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
	low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
}

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

	const isOverdue = task.deadline && new Date(task.deadline) < new Date() && !task.completed

	return (
		<>
			<Card className={`transition-all ${task.completed ? 'opacity-70' : ''}`}>
				<CardHeader className='p-4 pb-2 flex flex-row justify-between items-start'>
					<div className='flex-1'>
						<div className='flex items-center gap-2'>
							<Button
								variant='ghost'
								size='icon'
								className='h-6 w-6'
								onClick={() => onToggleComplete(task.id, task.completed)}
							>
								{task.completed ? (
									<CheckCircle className='h-5 w-5 text-primary' />
								) : (
									<Circle className='h-5 w-5' />
								)}
							</Button>
							<h3
								className={`font-medium text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}
							>
								{task.title}
							</h3>
						</div>
						<div className='flex flex-wrap gap-1 mt-2'>
							<Badge variant='outline' className={priorityColors[task.priority]}>
								{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
							</Badge>
							{isOverdue && (
								<Badge
									variant='outline'
									className='bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
								>
									Overdue
								</Badge>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent className='p-4 pt-2'>
					<p className={`text-sm text-muted-foreground ${task.completed ? 'line-through' : ''}`}>
						{task.description}
					</p>

					{task.tags.length > 0 && (
						<div className='flex flex-wrap gap-1 mt-3'>
							{task.tags.map((tag) => (
								<Badge key={tag} variant='secondary' className='text-xs'>
									{tag}
								</Badge>
							))}
						</div>
					)}

					{task.deadline && (
						<div className='flex items-center mt-3 text-sm text-muted-foreground'>
							<Calendar className='h-3.5 w-3.5 mr-1' />
							<span>{format(new Date(task.deadline), 'MMM d, yyyy')}</span>
							{task.deadline.includes('T') && (
								<>
									<Clock className='h-3.5 w-3.5 ml-2 mr-1' />
									<span>{format(new Date(task.deadline), 'h:mm a')}</span>
								</>
							)}
						</div>
					)}
				</CardContent>
				<CardFooter className='p-4 pt-0 flex justify-end gap-2'>
					<Button variant='ghost' size='icon' onClick={() => onEdit(task)} className='h-8 w-8'>
						<Edit className='h-4 w-4' />
					</Button>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => setIsDeleteDialogOpen(true)}
						className='h-8 w-8 text-destructive'
					>
						<Trash2 className='h-4 w-4' />
					</Button>
				</CardFooter>
			</Card>

			<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete the task "{task.title}".
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => onDelete(task.id)}
							className='bg-destructive hover:bg-destructive/90 text-white'
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	)
}
