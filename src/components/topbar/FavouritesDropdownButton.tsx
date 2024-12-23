import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { favoritesAtom } from '@/context/atoms'
import BookmarksIcon from '@mui/icons-material/Bookmarks'
import { useAtom } from 'jotai'
import React from 'react'
import FavouritesDropdownItem from './FavouritesDropdownItem'

const FavouritesDropdownButton = ({ buttonVisibility }) => {
  const [favorites] = useAtom(favoritesAtom)

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className={`invisible-ring border-primary/80 hover:border-white ${buttonVisibility}`}>
                <BookmarksIcon className='h-6 w-6' />
                <span className='sr-only'>View Bookmarks</span>
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <TooltipContent className='unhighlightable border-none bg-accent'>
            {'View Bookmarks'}
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent
          align='end'
          sideOffset={10}
          className='w-[400px] max-w-[400px] border border-primary bg-background p-0'>
          <div className='flex flex-col'>
            {/* Fixed Header */}
            <div className='sticky top-0 z-10 bg-background/95 p-2'>
              <DropdownMenuLabel className='unselectable text-xl'>
                Bookmarks
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </div>

            {/* Scrollable Content */}
            <div className='max-h-[600px] overflow-y-auto px-2'>
              {favorites.length > 0 ? (
                <div className='space-y-1 pb-4'>
                  {[...favorites].reverse().map((item) => (
                    <FavouritesDropdownItem key={item.videoId} {...item} />
                  ))}
                </div>
              ) : (
                <div className='flex flex-col items-center justify-center py-2 text-center'>
                  <p className='text-lg font-medium text-muted-foreground'>
                    Your bookmarks list is empty
                  </p>
                  <p className='pb-4 pt-2 text-sm text-muted-foreground'>
                    Songs you bookmarked will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}

export default FavouritesDropdownButton
