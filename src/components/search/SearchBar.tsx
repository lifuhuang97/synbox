import { Input } from '@/components/ui/input'
import { useGetYoutubeSearchResults } from '@/lib/react-query/queriesAndMutations'
import { formattedSearchResult } from '@/types'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
import SearchResultsFrame from './SearchResultsFrame'
import SearchResultsItem from './SearchResultsItem'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: songList, isFetching: isSearchFetching } =
    useGetYoutubeSearchResults(searchTerm)

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      console.log('search enter pressed & triggered')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)

    // Clear results when search term is empty
    if (e.target.value === '') {
      //
    }
  }

  const handleListItemClick = () => {
    setSearchTerm('')
  }

  return (
    <div className='flex justify-between items-center bg-gray-100 dark:bg-gray-800 rounded-lg py-1 md:w-96'>
      <SearchIcon className='text-primary m-2' sx={{ fontSize: 26 }} />
      <Input
        className='flex-1 bg-transparent text-black focus:ring-2 w-full mr-3 focus:ring-pink-600'
        placeholder='Search...'
        type='search'
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleSearchSubmit}
      />
      {isSearchFetching && <div>Loading...</div>}
      {songList && songList.length > 0 && (
        <SearchResultsFrame
          isOpen={Boolean(songList && songList.length)}
          onSelect={handleListItemClick}>
          {songList.map((result: formattedSearchResult) => (
            <SearchResultsItem
              thumbnailUrl={result.thumbnailUrl}
              key={result.videoId}
              videoId={result.videoId}
              title={result.title}
              creator={result.channel}
            />
          ))}
        </SearchResultsFrame>
      )}
    </div>
  )
}

export default SearchBar
