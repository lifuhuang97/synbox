import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  globalControlsVisibilityAtom,
  userInteractedWithSettingsAtom,
} from '@/context/atoms'
import { formatTimeDisplay } from '@/utils'
import PauseIcon from '@mui/icons-material/Pause'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import RepeatIcon from '@mui/icons-material/Repeat'
import RepeatOnIcon from '@mui/icons-material/RepeatOn'
import SettingsIcon from '@mui/icons-material/Settings'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import ReactPlayer from 'react-player'
import screenfull from 'screenfull'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
// import ClosedCaptionOffIcon from '@mui/icons-material/ClosedCaptionOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import SubtitlesIcon from '@mui/icons-material/Subtitles'
import SubtitlesOffIcon from '@mui/icons-material/SubtitlesOff'
import React from 'react'
import VolumeControl from './VolumeControl'

import { useAppContext } from '@/context/AppContext'
import {
  fullscreenAtom,
  lyricsControlVisibilityAtom,
  mutedAtom,
} from '@/context/atoms'
import { useAtom, useAtomValue } from 'jotai'

interface PlayerBottomBarProps {
  playing: boolean
  loop: boolean
  played: number
  duration: number
  romajiEnabled: boolean
  handleInitMutedPlay: () => void
  handlePause: () => void
  handlePlayPause: () => void
  handleSeekMouseDown: () => void
  handleSeekChange: (value: number) => void
  handleSeekMouseUp: (e: MouseEvent<HTMLInputElement>) => void
  handleProgress: (state: { played: number; loaded: number }) => void
  handleToggleLoop: () => void
  handleToggleRomajiVisibility: () => void
  handleToggleTranslationVisibility: () => void
  handleToggleLyricsOverlayVisibility: () => void
  handleToggleLyricsVisibility: (visibility: boolean) => void
  playerRef: React.MutableRefObject<ReactPlayer | null>
}

const PlayerBottomBar = ({
  playing,
  loop,
  played,
  duration,
  romajiEnabled,
  // playerRef,
  handleInitMutedPlay,
  // handlePause,
  handlePlayPause,
  // handleSeekMouseDown,
  handleSeekChange,
  // handleSeekMouseUp,
  // handleProgress,
  handleToggleLoop,
  handleToggleLyricsOverlayVisibility,
}: PlayerBottomBarProps) => {
  const bottomBarRef = useRef<HTMLDivElement>(null)
  // console.log('Player Bottom Bar re-rendered...')
  const { playerControlsVisible, setBottomBarHeight } = useAppContext()
  const globalControlsVisible = useAtomValue(globalControlsVisibilityAtom)

  const [isFullscreen, setIsFullscreen] = useAtom(fullscreenAtom)
  const [lyricsControlVisibility, setLyricsControlVisibility] = useAtom(
    lyricsControlVisibilityAtom,
  )
  const muted = useAtomValue(mutedAtom)

  const getCurrentPlayedPercentage = useCallback(() => {
    if (isNaN(played) || isNaN(duration) || duration === 0) {
      return 0
    }

    return parseFloat((played / duration).toFixed(3))
  }, [duration, played])

  const formattedPlayed = useMemo(() => formatTimeDisplay(played), [played])
  const formattedDuration = useMemo(
    () => formatTimeDisplay(duration),
    [duration],
  )

  //? Calculate Bottom Bar Height
  useEffect(() => {
    if (bottomBarRef.current && setBottomBarHeight) {
      setBottomBarHeight(bottomBarRef.current.offsetHeight)
      // console.log('bottom bar height is: ', bottomBarRef.current.offsetHeight)
    }
  }, [bottomBarRef, setBottomBarHeight])

  //? Screenfull lib to handle toggling of full screen
  const handleFullscreen = useCallback(() => {
    if (screenfull.isEnabled) {
      screenfull.toggle()
      // The screenfull 'change' event will trigger once the state changes
    }
  }, [])

  useEffect(() => {
    if (screenfull.isEnabled) {
      // Add a listener for when fullscreen mode is toggled
      const onChange = () => {
        setIsFullscreen(screenfull.isFullscreen) // Update atom state based on fullscreen mode
      }

      screenfull.on('change', onChange)

      // Cleanup listener on unmount
      return () => {
        screenfull.off('change', onChange)
      }
    }
  }, [setIsFullscreen])

  //* Player controls icon animations
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  const [userInteractedWithSettings, setUserInteractedWithSettings] = useAtom(
    userInteractedWithSettingsAtom,
  )

  const handleSettingsClick = () => {
    if (!userInteractedWithSettings) {
      setUserInteractedWithSettings(true)
    }
    setIsSettingsOpen(!isSettingsOpen)
    setLyricsControlVisibility(!lyricsControlVisibility)
  }

  const handleButtonHover = (buttonId: string) => {
    setHoveredButton(buttonId)
  }

  const handleButtonLeave = () => {
    setHoveredButton(null)
  }

  const getButtonStyle = (buttonId: string) => {
    const isHovered = hoveredButton === buttonId
    if (buttonId === 'loop') {
      return {
        opacity: loop ? 1 : isHovered ? 1 : 0.7,
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
      }
    }
    return {
      opacity: isHovered ? 1 : 0.7,
      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      transition: 'opacity 0.15s ease-in-out, transform 0.15s ease-in-out',
    }
  }

  return (
    <TooltipProvider delayDuration={0} skipDelayDuration={1000}>
      <div
        ref={bottomBarRef}
        className={`controls fixed inset-x-0 bottom-0 bg-dark-3 ${playerControlsVisible ? 'visible' : 'hidden'}`}>
        <div className='relative h-1 cursor-pointer'>
          <div className='absolute inset-x-0 z-10'>
            <Slider
              defaultValue={[0]}
              max={0.999999}
              step={0.000001}
              value={[getCurrentPlayedPercentage()]}
              onValueChange={(value) => handleSeekChange(value[0])}
              className='z-20'
            />
          </div>
        </div>
        <div className='flex items-center justify-between pb-1 pt-2'>
          <div className='flex items-center lg:mr-6'>
            <Button
              className='rounded-full'
              size='icon'
              variant='ghost'
              onMouseEnter={() => handleButtonHover('previous')}
              onMouseLeave={handleButtonLeave}
              style={getButtonStyle('previous')}>
              <SkipPreviousIcon sx={{ fontSize: 32 }} />
              <span className='sr-only'>Previous track</span>
            </Button>
            <Button
              className='rounded-full'
              size='icon'
              variant='ghost'
              onClick={muted ? handleInitMutedPlay : handlePlayPause}
              onMouseEnter={() => handleButtonHover('playPause')}
              onMouseLeave={handleButtonLeave}
              style={getButtonStyle('playPause')}>
              {playing ? (
                <PauseIcon sx={{ fontSize: 32 }} />
              ) : (
                <PlayArrowIcon sx={{ fontSize: 32 }} />
              )}
              <span className='sr-only'>Play</span>
            </Button>
            <Button
              className='rounded-full'
              size='icon'
              variant='ghost'
              onMouseEnter={() => handleButtonHover('next')}
              onMouseLeave={handleButtonLeave}
              style={getButtonStyle('next')}>
              <SkipNextIcon sx={{ fontSize: 32 }} />
              <span className='sr-only'>Next track</span>
            </Button>
            {/* //! Shuffle Play */}
            <Button
              className='rounded-full'
              size='icon'
              variant='ghost'
              onClick={handleToggleLoop}
              onMouseEnter={() => handleButtonHover('loop')}
              onMouseLeave={handleButtonLeave}
              style={getButtonStyle('loop')}>
              {loop ? (
                <RepeatOnIcon sx={{ fontSize: 32, color: 'bg-primary' }} />
              ) : (
                <RepeatIcon sx={{ fontSize: 32 }} />
              )}
              <span className='sr-only'>Shuffle</span>
            </Button>
            <VolumeControl
              onMouseEnter={(buttonId) => handleButtonHover(buttonId)}
              onMouseLeave={handleButtonLeave}
              getButtonStyle={getButtonStyle}
              timeDisplay={
                <div className='flex-between unselectable ml-2'>
                  <span className='hidden w-12 text-right sm:inline'>
                    {formattedPlayed}
                  </span>
                  <span className='hidden w-4 text-center sm:inline'>
                    {'/'}
                  </span>
                  <span className='hidden text-center sm:inline'>
                    {formattedDuration}
                  </span>
                </div>
              }
            />
          </div>

          <div className='ml-6 flex items-center justify-end gap-1 md:gap-2'>
            {/* //! Subtitles Selection & Upload
          {/* //* Lyrics visibility toggle */}
            <Button
              className='rounded-full'
              size='icon'
              variant='ghost'
              onClick={handleToggleLyricsOverlayVisibility}
              onMouseEnter={() => handleButtonHover('romaji')}
              onMouseLeave={handleButtonLeave}
              style={getButtonStyle('romaji')}>
              {romajiEnabled ? (
                <SubtitlesIcon className='h-4 w-4' sx={{ fontSize: 32 }} />
              ) : (
                <SubtitlesOffIcon className='h-4 w-4' sx={{ fontSize: 32 }} />
              )}
              <span className='sr-only'>Toggle Lyrics</span>
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className='rounded-full'
                  size='icon'
                  variant='ghost'
                  onClick={handleSettingsClick}
                  onMouseEnter={() => handleButtonHover('settings')}
                  onMouseLeave={handleButtonLeave}
                  style={{
                    ...getButtonStyle('settings'),
                    transition:
                      'opacity 0.2s ease-in-out, transform 0.18s ease-in-out',
                    transform: isSettingsOpen
                      ? 'rotate(30deg)'
                      : 'rotate(0deg)',
                  }}>
                  <SettingsIcon className='h-4 w-4' sx={{ fontSize: 32 }} />
                  <span className='sr-only'>Settings</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side='left'
                className='unhighlightable border-none bg-primary'>
                {isSettingsOpen
                  ? 'Hide Lyrics Controls'
                  : 'Show Lyrics Controls'}
              </TooltipContent>
            </Tooltip>
            {/* //*TODO: Handle Dismissing Top Bar & Bottom Bar to make more space  */}
            <Button
              className='invisible-ring rounded-full pr-2'
              size='icon'
              variant='ghost'
              onClick={handleFullscreen}
              onMouseEnter={() => handleButtonHover('fullscreen')}
              onMouseLeave={handleButtonLeave}
              style={getButtonStyle('fullscreen')}>
              {isFullscreen ? (
                <FullscreenExitIcon className='h-4 w-4' sx={{ fontSize: 36 }} />
              ) : (
                <FullscreenIcon className='h-4 w-4' sx={{ fontSize: 36 }} />
              )}
              <span className='sr-only'>Fullscreen</span>
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export const MemoizedPlayerBottomBar = React.memo(PlayerBottomBar)
