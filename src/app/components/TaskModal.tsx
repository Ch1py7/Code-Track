'use client'

import type React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Priority, Task } from '@/lib/types'
import { Plus, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TaskModalProps {
	isOpen: boolean
	onClose: () => void
	onSave: (task: Task) => void
	task: Task | null
}

export default function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [priority, setPriority] = useState<Priority>('medium')
	const [deadline, setDeadline] = useState('')
	const [deadlineTime, setDeadlineTime] = useState('')
	const [tags, setTags] = useState<string[]>([])
	const [newTag, setNewTag] = useState('')

	useEffect(() => {
		if (task) {
			setTitle(task.title)
			setDescription(task.description)
			setPriority(task.priority)

			if (task.deadline) {
				const date = new Date(task.deadline)
				setDeadline(date.toISOString().split('T')[0])

				if (task.deadline.includes('T')) {
					setDeadlineTime(date.toISOString().split('T')[1].substring(0, 5))
				} else {
					setDeadlineTime('')
				}
			} else {
				setDeadline('')
				setDeadlineTime('')
			}

			setTags(task.tags)
		} else {
			setTitle('')
			setDescription('')
			setPriority('medium')
			setDeadline('')
			setDeadlineTime('')
			setTags([])
		}
		setNewTag('')
	}, [task])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		let finalDeadline = deadline
		if (deadline && deadlineTime) {
			finalDeadline = `${deadline}T${deadlineTime}:00`
		}

		onSave({
			id: task?.id || '',
			title,
			description,
			priority,
			deadline: finalDeadline || null,
			tags,
			completed: task?.completed || false,
			createdAt: task?.createdAt || new Date().toISOString(),
		})
	}

	const handleAddTag = () => {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			setTags([...tags, newTag.trim()])
			setNewTag('')
		}
	}

	const handleRemoveTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove))
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleAddTag()
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[500px]'>
				<DialogHeader>
					<DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4 py-2'>
					<div className='space-y-2'>
						<Label htmlFor='title'>Title</Label>
						<Input
							id='title'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder='Task title'
							required
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='description'>Description</Label>
						<Textarea
							id='description'
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder='Task description'
							rows={3}
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='priority'>Priority</Label>
						<Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
							<SelectTrigger id='priority'>
								<SelectValue placeholder='Select priority' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='high'>High</SelectItem>
								<SelectItem value='medium'>Medium</SelectItem>
								<SelectItem value='low'>Low</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<Label htmlFor='deadline'>Deadline Date</Label>
							<Input
								id='deadline'
								type='date'
								value={deadline}
								onChange={(e) => setDeadline(e.target.value)}
							/>
						</div>
						<div className='space-y-2'>
							<Label htmlFor='deadlineTime'>Deadline Time (optional)</Label>
							<Input
								id='deadlineTime'
								type='time'
								value={deadlineTime}
								onChange={(e) => setDeadlineTime(e.target.value)}
								disabled={!deadline}
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='tags'>Tags</Label>
						<div className='flex space-x-2'>
							<Input
								id='tags'
								value={newTag}
								onChange={(e) => setNewTag(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder='Add a tag'
							/>
							<Button type='button' variant='outline' size='icon' onClick={handleAddTag}>
								<Plus className='h-4 w-4' />
							</Button>
						</div>

						{tags.length > 0 && (
							<div className='flex flex-wrap gap-1 mt-2'>
								{tags.map((tag) => (
									<Badge key={tag} variant='secondary' className='flex items-center gap-1'>
										{tag}
										<button
											type='button'
											onClick={() => handleRemoveTag(tag)}
											className='h-4 w-4 rounded-full inline-flex items-center justify-center hover:bg-muted'
										>
											<X className='h-3 w-3' />
											<span className='sr-only'>Remove {tag} tag</span>
										</button>
									</Badge>
								))}
							</div>
						)}
					</div>

					<DialogFooter>
						<Button type='button' variant='outline' onClick={onClose}>
							Cancel
						</Button>
						<Button type='submit'>{task ? 'Update Task' : 'Create Task'}</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
