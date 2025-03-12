'use client'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import type { Priority, Task } from '@/lib/types'
import axios from 'axios'
import { ArrowUpDown, Filter, PlusCircle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'

const URL = 'https://code-track.onrender.com/task'

export default function TaskManager() {
	const [tasks, setTasks] = useState<Task[]>([])
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingTask, setEditingTask] = useState<Task | null>(null)
	const [searchQuery, setSearchQuery] = useState('')
	const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all')
	const [filterTag, setFilterTag] = useState<string | 'all'>('all')
	const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'created'>('created')
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

	const getTasks = useCallback(async () => {
		const { data, status } = await axios.get<Task[]>(URL)
		if (status === 200) {
			setTasks(data)
		}
	}, [])

	useEffect(() => {
		getTasks()
	}, [getTasks])

	const handleAddTask = async (task: Task) => {
		if (editingTask) {
			const { status } = await axios.patch(`${URL}/${task.id}`, { ...task })
			if (status === 200) {
				setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
			}
		} else {
			const { status } = await axios.post(URL, { ...task })
			if (status === 201) {
				setTasks([
					...tasks,
					{ ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
				])
			}
		}
		setIsModalOpen(false)
		setEditingTask(null)
	}

	const handleEditTask = (task: Task) => {
		setEditingTask(task)
		setIsModalOpen(true)
	}

	const handleDeleteTask = async (id: string) => {
		const { status } = await axios.delete(`${URL}/${id}`)
		if (status) {
			getTasks()
		}
	}

	const handleToggleComplete = async (id: string, state: boolean) => {
		await axios.patch(`${URL}/${id}`, { completed: !state })
		setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
	}

	const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags)))

	const filteredTasks = tasks.filter((task) => {
		const matchesSearch =
			task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			task.description.toLowerCase().includes(searchQuery.toLowerCase())
		const matchesPriority = filterPriority === 'all' || task.priority === filterPriority
		const matchesTag = filterTag === 'all' || task.tags.includes(filterTag)

		return matchesSearch && matchesPriority && matchesTag
	})

	const sortedTasks = [...filteredTasks].sort((a, b) => {
		if (sortBy === 'priority') {
			const priorityValues = { high: 3, medium: 2, low: 1 }
			const diff = priorityValues[b.priority] - priorityValues[a.priority]
			return sortDirection === 'asc' ? -diff : diff
		}

		if (sortBy === 'deadline') {
			const dateA = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY
			const dateB = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY
			return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
		}
		const dateA = new Date(a.createdAt).getTime()
		const dateB = new Date(b.createdAt).getTime()
		return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
	})

	return (
		<div className='space-y-6'>
			<div className='flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0'>
				<h1 className='text-3xl font-bold tracking-tight'>Task Manager</h1>
				<Button
					onClick={() => {
						setEditingTask(null)
						setIsModalOpen(true)
					}}
					className='flex items-center gap-2'
				>
					<PlusCircle className='h-4 w-4' />
					Add Task
				</Button>
			</div>

			<div className='flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0'>
				<div className='flex-1'>
					<Input
						placeholder='Search tasks...'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className='w-full'
					/>
				</div>

				<div className='flex space-x-2'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' className='flex items-center gap-2'>
								<Filter className='h-4 w-4' />
								Filter
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-56'>
							<div className='p-2'>
								<p className='mb-2 text-sm font-medium'>Priority</p>
								<DropdownMenuItem onClick={() => setFilterPriority('all')}>All</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setFilterPriority('high')}>High</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setFilterPriority('medium')}>
									Medium
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setFilterPriority('low')}>Low</DropdownMenuItem>
							</div>

							{allTags.length > 0 && (
								<div className='p-2 border-t'>
									<p className='mb-2 text-sm font-medium'>Tags</p>
									<DropdownMenuItem onClick={() => setFilterTag('all')}>All Tags</DropdownMenuItem>
									{allTags.map((tag) => (
										<DropdownMenuItem key={tag} onClick={() => setFilterTag(tag)}>
											{tag}
										</DropdownMenuItem>
									))}
								</div>
							)}
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline' className='flex items-center gap-2'>
								<ArrowUpDown className='h-4 w-4' />
								Sort
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-56'>
							<DropdownMenuItem
								onClick={() => {
									setSortBy('priority')
									setSortDirection(
										sortBy === 'priority' && sortDirection === 'desc' ? 'asc' : 'desc'
									)
								}}
							>
								By Priority
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setSortBy('deadline')
									setSortDirection(
										sortBy === 'deadline' && sortDirection === 'desc' ? 'asc' : 'desc'
									)
								}}
							>
								By Deadline
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									setSortBy('created')
									setSortDirection(
										sortBy === 'created' && sortDirection === 'desc' ? 'asc' : 'desc'
									)
								}}
							>
								By Created Date
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			{sortedTasks.length === 0 ? (
				<div className='flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-muted/50'>
					<p className='text-muted-foreground'>
						No tasks found. Create your first task to get started!
					</p>
				</div>
			) : (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{sortedTasks.map((task) => (
						<TaskCard
							key={task.id}
							task={task}
							onEdit={handleEditTask}
							onDelete={handleDeleteTask}
							onToggleComplete={handleToggleComplete}
						/>
					))}
				</div>
			)}

			<TaskModal
				isOpen={isModalOpen}
				onClose={() => {
					setIsModalOpen(false)
					setEditingTask(null)
				}}
				onSave={handleAddTask}
				task={editingTask}
			/>
		</div>
	)
}
