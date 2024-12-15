const DataTable = ({ columns = [], data = [] }) => {
	return (
		<div className='overflow-x-auto'>
			<table className='min-w-full divide-y divide-gray-200'>
				<thead className='bg-gray-50'>
					<tr>
						{columns.map((column, columnIndex) => (
							<th
								key={columnIndex}
								className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
							>
								{column.header}
							</th>
						))}
					</tr>
				</thead>
				<tbody className='bg-white divide-y divide-gray-200'>
					{data.length > 0 ? (
						data.map((row, rowIndex) => (
							<tr key={row.id || rowIndex}>
								{columns.map((column, columnIndex) => (
									<td
										key={columnIndex}
										className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
									>
										{column.cell ? column.cell(row) : row[column.accessor]}
									</td>
								))}
							</tr>
						))
					) : (
						<tr>
							<td
								colSpan={columns.length}
								className='px-6 py-4 text-center text-sm text-gray-500'
							>
								No data available
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}

export default DataTable
