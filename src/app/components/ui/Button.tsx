interface ButtonProps {
	children: React.ReactNode
	onClick?: () => void
	className?: string
}

export const Button: React.FC<ButtonProps> = ({
	children,
	onClick,
	className,
}): React.ReactNode => {
	return (
		<button
			onClick={onClick}
			type='button'
			className={`border-1 rounded-md border-gray-400/40 cursor-pointer px-3 tracking-tight ${className}`}
		>
			{children}
		</button>
	)
}
