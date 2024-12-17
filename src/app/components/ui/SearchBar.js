'use client'

export function SearchBar({
	value,
	onChange,
	placeholder = 'Search...',
	isLoading = false,
	onClear,
	className = '',
}) {
	return (
		<div className={`relative ${className}`}>
			{/* Search Icon */}
			<svg
				className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
				fill='none'
				strokeWidth='2'
				stroke='currentColor'
				viewBox='0 0 24 24'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
				/>
			</svg>

			{/* Input Field */}
			<input
				type='text'
				value={value}
				onChange={e => onChange(e.target.value)}
				placeholder={placeholder}
				className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  bg-white shadow-sm transition-all duration-200
                  hover:border-gray-400'
			/>

			{/* Clear/Loading Button */}
			{(value || isLoading) && (
				<button
					onClick={() => {
						if (!isLoading && onClear) {
							onClear()
						}
					}}
					className='absolute right-3 top-1/2 -translate-y-1/2'
					type='button'
				>
					{isLoading ? (
						// Loading Spinner
						<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400' />
					) : (
						// Clear Icon (X)
						<svg
							className='w-5 h-5 text-gray-400 hover:text-gray-600'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					)}
				</button>
			)}
		</div>
	)
}
