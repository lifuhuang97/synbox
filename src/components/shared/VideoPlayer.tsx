import { useAppContext } from '@/context/AppContext'
import { ForwardedRef, useEffect } from 'react'
import ReactPlayer from 'react-player'

interface VideoPlayerProps {
  videoId: string // The video ID to play
  playing: boolean // Whether the video is currently playing
  loop: boolean // Whether the video should loop on end
  volume: number // The volume level of the video (0-1)
  muted: boolean // Whether the video is muted
  handlePlay: () => void
  handleDuration: (duration: number) => void
  handleProgress: () => void
  handleStart: () => void
  handleEnded: () => void
  playerRef: ForwardedRef<ReactPlayer>
  // Add methods for handling playback control (play, pause, seek)
  // and volume control (setVolume, toggleMute)
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  loop,
  playing,
  handlePlay,
  handleEnded,
  handleStart,
  handleDuration,
  handleProgress,
  volume,
  muted,
  playerRef,
}) => {
  // const handlePlayerReady = () => {}
  const { setPlayerControlsVisible } = useAppContext()

  //? UseEffect to handle delay in dismissing controls visibility when playing video
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> // Declare timer to use it inside clearTimeout

    const showControlsTemporarily = () => {
      clearTimeout(timer) // Clear any existing timer on mouse move
      setPlayerControlsVisible(true) // Show the controls on mouse move

      // Set a new timer to hide the controls after 4.5 seconds of no mouse movement
      if (playing) {
        // Check if the video is playing
        timer = setTimeout(() => {
          setPlayerControlsVisible(false)
        }, 4500)
      }
    }

    showControlsTemporarily() // Show the controls initially when the video starts playing

    document.addEventListener('mousemove', showControlsTemporarily)

    // Cleanup function to remove the event listener and clear the timeout when the component unmounts or before the effect runs again
    return () => {
      document.removeEventListener('mousemove', showControlsTemporarily)
      clearTimeout(timer)
    }
  }, [setPlayerControlsVisible, playing])

  const handlePause = () => {
    console.log('VideoPlayer.tsx player has been paused')
  }

  const handleReady = () => {
    handlePlay()
  }

  return (
    <>
      <ReactPlayer
        className='absolute top-0 left-0 right-0'
        ref={playerRef}
        config={{
          youtube: {
            playerVars: {
              rel: 0,
            },
          },
        }}
        width='100%'
        height='100%'
        url={`https://www.youtube.com/watch?v=${videoId}&cc_load_policy=3&rel=0`}
        muted={muted}
        volume={volume}
        playing={playing}
        loop={loop}
        controls={false}
        onReady={handleReady}
        onStart={handleStart}
        onPlay={handlePlay}
        onSeek={(e) => console.log('onSeek', e)}
        onEnded={handleEnded}
        onError={(e) => console.log('onError', e)}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onPause={handlePause}
      />
      {playing ? (
        <div className='absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 flex justify-center items-center text-white'></div>
      ) : (
        ''
      )}
    </>
  )
}
export default VideoPlayer
