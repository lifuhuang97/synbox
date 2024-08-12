import {
  useGetLyricsBySongId,
  useGetYoutubeVideoInfo,
  useStreamValidateVideoById,
  useValidateVideoById,
} from '@/lib/react-query/queriesAndMutations'
import { formatCountToString, formatDuration } from '@/utils'
import { useDisclosure } from '@mantine/hooks'
import { useCallback, useEffect, useState } from 'react'
import JSONPretty from 'react-json-pretty'
import { useNavigate } from 'react-router-dom'
import Loader from '../shared/Loader'
import RequestDialog from '../shared/RequestDialog'
import { Button } from '../ui/button'
import { Dialog, DialogTrigger } from '../ui/dialog'

interface HeroGenerateLyricsValidationProps {
  subStage: number
  setSubStage: (stage: number) => void
  videoId: string
  setInputVideoId: (videoId: string) => void
  setProcessingStage: (stage: number) => void
}

const HeroGenerateLyricsValidation = ({
  subStage,
  setSubStage,
  setProcessingStage,
  videoId,
  setInputVideoId,
}: HeroGenerateLyricsValidationProps) => {
  const navigate = useNavigate()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [loaderVisible, loaderVisibilityHandler] = useDisclosure(false)

  //TODO: Auto redirect for if there's lyrics, set this up in the future
  const lyrics = null
  useEffect(() => {
    // If lyrics exist, navigate to /v/{videoId}
    if (lyrics) {
      setTimeout(() => {
        setProcessingStage(1)
        setInputVideoId('')
        navigate(`/v/${videoId}`)
      }, 2000) // 2 seconds delay
    }
  }, [lyrics, navigate, videoId, setProcessingStage, setInputVideoId])

  const handleBackButton = () => {
    setProcessingStage(1)
    setInputVideoId('')
  }

  const handleStreamClick = useCallback(() => {
    if (!isLoading) {
      mutate(id, {
        onSuccess: (data) => {
          const result = { id, data }
          setStreamResult(result)
          // Save to query cache
          queryClient.setQueryData(['streamResult', id], result)
        },
      })
    }
  }, [id, isLoading, mutate, queryClient])




  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isLoading) {
        event.preventDefault()
        event.returnValue = '' // Standard way to trigger a confirmation dialog
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isLoading])

  
  useEffect(() => {
    if (streamResult) {
      setStreamResult(streamResult)
    }
  }, [streamResult])

  const handleGenerate = () => {
    if (!vidValidationInfo) return

    setDialogOpen(true)
    loaderVisibilityHandler.open()
    const { vid_info, subtitle_info } = vidValidationInfo
    const { vid_id } = vid_info
    const { subtitle_exists, extension, path } = subtitle_info
  }

  const renderVideoInfo = () => {
    if (!vidValidationInfo) return null

    const { vid_info } = vidValidationInfo
    const {
      title,
      likes,
      views,
      channel_name: channel,
      thumbnail,
      duration,
    } = vid_info

    if (typeof duration === 'number') {
      duration.toString()
    }

    return (
      <div className='flex w-full max-w-2xl flex-col items-center space-y-4 p-4'>
        <div className='w-full' style={{ maxHeight: '200px' }}>
          <img
            src={thumbnail}
            alt={title}
            className='h-auto max-h-full w-full rounded-lg object-contain shadow-lg'
          />
        </div>
        <h2 className='text-center text-2xl font-bold'>{title}</h2>
        <p className='text-lg text-white'>{channel}</p>
        <p className='text-md text-white'>{formatDuration(duration)}</p>
        <div className='flex justify-center space-x-4'>
          <p className='text-sm text-gray-500'>
            {formatCountToString(views)} Views
          </p>
          <p className='text-sm text-gray-500'>
            {formatCountToString(likes)} Likes
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='items-top bg-grid-white/[0.90] relative flex w-full overflow-y-auto rounded-md bg-dark-1/[0.15] pt-10 antialiased md:min-h-[25rem]  md:justify-center'>
      <div className='flex-between w-full flex-col'>
        <h1>HeroGenerateLyricsValidation</h1>
        <h1>Substage: {subStage}</h1>
        <h1>YT Validation Output</h1>
        {vidValidationInfoFetching ? (
          <Loader />
        ) : (
          <>
            {renderVideoInfo()}
            {/* <div className='w-full overflow-auto rounded-lg bg-gray-800 p-4 shadow-lg'> */}
            {/* <JSONPretty
                id='json-pretty'
                data={vidValidationInfo}
                theme={{
                  main: 'line-height:1.3;color:#fff;background:#272822;overflow:auto;',
                  error:
                    'line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;',
                  key: 'color:#f92672;',
                  string: 'color:#fd971f;',
                  value: 'color:#a6e22e;',
                  boolean: 'color:#ac81fe;',
                }}
              /> */}
            {/* </div> */}
          </>
        )}
        <Dialog open={dialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleGenerate}
              disabled={
                vidValidationInfoFetching
                  ? true
                  : vidValidationInfo.validated
                    ? false
                    : true
              }
              variant='default'
              role='combobox'
              className='mt-4 w-1/3 border-2 border-primary-500/40 py-6 hover:border-primary-500/90 hover:bg-gray-200/20 md:w-4/12 lg:w-1/4'>
              Create
            </Button>
          </DialogTrigger>
          <RequestDialog
            setDialogOpen={setDialogOpen}
            loaderVisible={loaderVisible}
            loaderVisibilityHandler={loaderVisibilityHandler}
          />
        </Dialog>
        <Button onClick={handleBackButton} className='mt-4'>
          Back
        </Button>
      </div>
    </div>
  )
}
export default HeroGenerateLyricsValidation