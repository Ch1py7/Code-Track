'use client'

import { ArrowUpDown, Filter, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/Button'

const priorityTags = ['All', 'High', 'Medium', 'Low']
const sortTags = ['Priority', 'Deadline', 'Created Date']

export const Header: React.FC = (): React.ReactNode => {
	const [showFilters, setShowFilters] = useState<boolean>(false)
	const [filterPriority, setFilterPriority] = useState<string>('')
	const [showSort, setShowSort] = useState<boolean>(false)
	const [sort, setSort] = useState<string>('')

	const handlePriority = (prio: string) => {
		setFilterPriority(prio)
		setShowFilters(false)
	}

	const handleSort = (sort: string) => {
		setSort(sort)
		setShowSort(false)
	}

	const handleDropDown = (open: 'filters' | 'sort') => {
		if (open === 'filters') {
			setShowSort(false)
			setShowFilters((prev) => !prev)
		} else if (open === 'sort') {
			setShowFilters(false)
			setShowSort((prev) => !prev)
		}
	}

	return (
		<div>
			<div className='flex justify-between'>
				<h1 className='text-3xl font-bold tracking-tight'>Task Manager</h1>
				<Button className='flex items-center gap-2 bg-black text-white hover:bg-black/80'>
					<PlusCircle className='h-4 w-4' />
					Add Task
				</Button>
			</div>
			<div className='flex space-x-2 mt-4'>
				<input
					placeholder='Search tasks...'
					className='w-full border-1 rounded-md border-gray-400/40 py-1 px-2'
				/>
				<div className='relative'>
					<Button
						onClick={() => handleDropDown('filters')}
						className='flex h-full items-center gap-2 bg-white text-black hover:bg-gray-400/15'
					>
						<Filter className='h-4 w-4' color='black' />
						Filter
					</Button>
					{showFilters && (
						<div className='absolute right-0 mt-2 border-1 rounded-md border-gray-400/40 px-4 py-2 sm:w-40'>
							<ul>
								<li className='mb-2 font-medium'>Priority</li>
								{priorityTags.map((pt) => (
									<li key={pt} className='hover:bg-gray-500/10'>
										<button
											type='button'
											className='py-1 rounded-sm ps-3 w-full h-full text-start'
											onClick={() => handlePriority(pt)}
										>
											{pt}
										</button>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
				<div className='relative'>
					<Button
						onClick={() => handleDropDown('sort')}
						className='flex h-full items-center gap-2 bg-white text-black hover:bg-gray-400/15'
					>
						<ArrowUpDown className='h-4 w-4' color='black' />
						Sort
					</Button>
					{showSort && (
						<div className='absolute right-0 mt-2 border-1 rounded-md border-gray-400/40 px-4 py-2 sm:w-40'>
							<ul>
								{sortTags.map((st) => (
									<li key={st} className='hover:bg-gray-500/10'>
										<button
											type='button'
											className='py-1 rounded-sm ps-3 w-full h-full text-start'
											onClick={() => handleSort(st)}
										>
											{st}
										</button>
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
