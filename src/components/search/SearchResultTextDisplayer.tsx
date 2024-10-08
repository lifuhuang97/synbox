interface SearchResultTextDisplayerProps {
  title: string
  misc: string
  fontSize?: string // e.g., '16px', '1em'
  color?: string // e.g., '#333', 'red'
  fontFamily?: string // e.g., 'Arial', 'sans-serif'
}

const SearchResultTextDisplayer = ({
  title,
  misc,
  fontSize = '1rem', // Provide default values
  color = 'black',
  fontFamily = 'Arial',
}: SearchResultTextDisplayerProps) => {
  const textStyle = {
    fontSize,
    color,
    fontFamily,
  }

  return (
    <div className='grid shrink-0 gap-0.5 text-xs'>
      <p className='text-red font-medium'>{title}</p>
      <p className='text-xs text-gray-500 dark:text-gray-400'>{misc}</p>
    </div>
  )
}
export default SearchResultTextDisplayer
