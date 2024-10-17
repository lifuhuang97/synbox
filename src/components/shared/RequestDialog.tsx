import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { dialogStepAtom } from '@/context/atoms'
import { useStreamValidationApi } from '@/hooks/useStreamValidationApi'
import { useUploadHardCodedLyrics } from '@/lib/react-query/queriesAndMutations'
import { DialogDescription } from '@radix-ui/react-dialog'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import RequestDialogAnnotateDisplay from './RequestDialogAnnotateDisplay'
import RequestDialogStepTwoDisplay from './RequestDialogStepTwoDisplay'
import RequestDialogValidationDisplay from './RequestDialogValidationDisplay'
import UpdateMessagesDisplay from './UpdateMessagesDisplay'

interface RequestDialogProps {
  videoId: string
  handleClose: () => void
}

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>

const RequestDialog = ({ videoId, handleClose }: RequestDialogProps) => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useAtom(dialogStepAtom)
  const [showLoader, setShowLoader] = useState(false)
  const [lyrics, setLyrics] = useState<string[]>([])
  const [timestampedLyrics, setTimestampedLyrics] = useState<unknown[]>([])
  const [engTranslation, setEngTranslation] = useState<string[]>([])
  const [chiTranslation, setChiTranslation] = useState<string[]>([])
  const [romajiLyrics, setRomajiLyrics] = useState<string[]>([])
  const [kanjiAnnotations, setKanjiAnnotations] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const { mutate: uploadHardCodedLyrics } = useUploadHardCodedLyrics()
  const {
    isStreaming,
    updateMessages,
    vidInfo,
    showVidInfo,
    setShowVidInfo,
    error,
    resetStream,
    mutate,
  } = useStreamValidationApi()

  useEffect(() => {
    if (videoId) {
      mutate(videoId)
    }
    // Clean up function to reset the stream when the component unmounts
    return () => {
      resetStream()
    }
  }, [videoId, mutate, resetStream])

  useEffect(() => {
    if (isStreaming) {
      setShowLoader(true)
    } else {
      const timer = setTimeout(() => setShowLoader(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isStreaming])

  useEffect(() => {
    if (vidInfo && !error) {
      const timer = setTimeout(() => setShowVidInfo(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [vidInfo, error, setShowVidInfo])
  const getDialogHeaderContent = () => {
    switch (currentStep) {
      case 0:
        return {
          title: 'Step 1 - Validation',
          description: '',
        }
      case 1:
        return {
          title: 'Step 2 - Transcription',
          description: '',
        }
      case 2:
        return {
          title: 'Step 3 - Translation & Annotation',
          description: '',
        }
      case 3:
        return {
          title: 'Step 4 - Confirmation',
          description: '',
        }
      default:
        return {
          title: 'Complete',
          description: '',
        }
    }
  }

  const { title, description } = getDialogHeaderContent()

  const handlePreviousClick = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0))
  }

  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    event.preventDefault()
  }

  const handlePointerDownOutside = (event: PointerDownOutsideEvent) => {
    event.preventDefault()
  }

  const handleInteractOutside = (event: PointerDownOutsideEvent) => {
    event.preventDefault()
  }

  const handleLyricsUpdate = (
    newLyrics: string[],
    newTimestampedLyrics: unknown[],
  ) => {
    setLyrics(newLyrics)
    setTimestampedLyrics(newTimestampedLyrics)
  }

  const handleAnnotationsUpdate = (
    newEngTranslation: string[],
    newChiTranslation: string[],
    newRomajiLyrics: string[],
    newKanjiAnnotations: string[],
  ) => {
    setEngTranslation(newEngTranslation)
    setChiTranslation(newChiTranslation)
    setRomajiLyrics(newRomajiLyrics)
    setKanjiAnnotations(newKanjiAnnotations)
  }

  const handleUpload = () => {
    setIsUploading(true)
    setUploadError(null)

    if (!Array.isArray(timestampedLyrics) || timestampedLyrics.length === 0) {
      setUploadError('Timestamped lyrics are missing or invalid')
      setIsUploading(false)
      return
    }

    try {
      const formatTime = (seconds: number): string => {
        const pad = (num: number) => num.toString().padStart(2, '0')
        const roundedSeconds = Math.round(seconds * 1000) / 1000
        const hours = Math.floor(roundedSeconds / 3600)
        const minutes = Math.floor((roundedSeconds % 3600) / 60)
        const secs = Math.floor(roundedSeconds % 60)
        const milliseconds = Math.floor((roundedSeconds % 1) * 1000)
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${milliseconds.toString().padStart(3, '0')}`
      }

      const convertToRuby = (annotatedLine: string) => {
        const rubyLines = annotatedLine.replace(
          /([一-龯々]+)\[([^\]]+)\]/g,
          (match, kanji, reading) => {
            return `<ruby>${kanji}<rp>(</rp><rt>${reading}</rt><rp>)</rp></ruby>`
          },
        )
        return rubyLines.replace(/\[[^\]]+\]/g, '')
      }

      const adjustedTimestampedLyrics = timestampedLyrics.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (item: any, index) => ({
          id: (index + 1).toString(),
          startTime: formatTime(item.start_time),
          startSeconds: item.start_time,
          endTime: formatTime(item.end_time),
          endSeconds: item.end_time,
          text: item.lyric,
        }),
      )

      const labelledLyrics = adjustedTimestampedLyrics.map((item, index) => ({
        ...item,
        text: convertToRuby(kanjiAnnotations[index] || item.text),
      }))

      const lyricsData = {
        full_lyrics: JSON.stringify(adjustedTimestampedLyrics),
        plain_lyrics: JSON.stringify(lyrics),
        romaji: JSON.stringify(romajiLyrics),
        eng_translation: JSON.stringify(engTranslation),
        chi_translation: JSON.stringify(chiTranslation),
        labelled_full_lyrics: JSON.stringify(labelledLyrics),
      }

      uploadHardCodedLyrics(
        { songId: videoId, lyricsData },
        {
          onSuccess: () => {
            setIsUploading(false)
            setUploadSuccess(true)
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            setIsUploading(false)
            setUploadError('Upload failed: ' + error.message)
            console.error('Upload failed:', error)
          },
        },
      )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setIsUploading(false)
      setUploadError(
        'An error occurred while processing the data: ' + err.message,
      )
      console.error('Error processing data:', err)
    }
  }

  const handleProceedClick = () => {
    if (currentStep === 3) {
      handleUpload()
    } else {
      setCurrentStep((prevStep) => prevStep + 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <UpdateMessagesDisplay
              isStreaming={isStreaming}
              showLoader={showLoader}
              updateMessages={updateMessages}
            />
            {showVidInfo && !showLoader && !error && vidInfo && (
              <RequestDialogValidationDisplay vidInfo={vidInfo} />
            )}
          </>
        )
      case 1:
        return (
          <RequestDialogStepTwoDisplay
            vidInfo={vidInfo}
            onLyricsUpdate={handleLyricsUpdate}
          />
        )
      case 2:
        return (
          <RequestDialogAnnotateDisplay
            id={videoId}
            lyrics={lyrics}
            timestampedLyrics={timestampedLyrics}
            onAnnotationsUpdate={handleAnnotationsUpdate}
          />
        )
      case 3:
        return (
          <div className='mt-4 w-full'>
            <h3 className='mb-4 text-xl font-bold'>Step 4: Upload Lyrics</h3>
            <p className='mb-4'>
              All data has been processed. Click the button below to upload the
              lyrics and translations.
            </p>
            {uploadError && <p className='mb-4 text-red-500'>{uploadError}</p>}
            {uploadSuccess && (
              <div className='mb-4'>
                <p className='text-green-500'>Upload successful!</p>
                <Button
                  onClick={() => navigate(`/v/${videoId}`)}
                  className='mt-2 bg-green-500 text-white hover:bg-green-600'>
                  Play
                </Button>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <DialogContent
      className='invisible-ring flex h-auto max-h-[90vh] flex-col border-2 border-cyan-500 border-opacity-60 bg-primary-600 sm:max-w-2xl'
      onEscapeKeyDown={handleEscapeKeyDown}
      onPointerDownOutside={handlePointerDownOutside}
      onInteractOutside={handleInteractOutside}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <div className='mx-4 mt-2 flex-grow overflow-y-auto'>
        {renderStep()}
        {error && (
          <div className='mt-4 text-red-500'>
            <h3 className='text-xl font-bold'>Error</h3>
            <p>{error}</p>
          </div>
        )}
      </div>

      <DialogFooter className='flex w-full flex-col-reverse gap-4 bg-primary-600 p-4 md:flex-row md:justify-between'>
        <DialogClose asChild>
          <Button
            type='button'
            variant='secondary'
            onClick={handleClose}
            disabled={isStreaming || isUploading}
            className='invisible-ring text-md w-full text-light-1 hover:border-primary hover:bg-light-1 hover:text-primary hover:outline-1 md:w-auto'>
            Close
          </Button>
        </DialogClose>

        <div className='flex w-full justify-between gap-2 md:w-auto md:justify-end'>
          {currentStep > 0 && (
            <Button
              onClick={handlePreviousClick}
              disabled={isStreaming || isUploading}
              className='invisible-ring flex-1 bg-gray-500 text-white hover:bg-gray-600 md:flex-initial'>
              Previous Step
            </Button>
          )}
          {((showVidInfo && currentStep === 0) ||
            (currentStep > 0 && currentStep <= 3)) && (
            <Button
              onClick={handleProceedClick}
              disabled={isUploading}
              className='invisible-ring flex-1 bg-blue-500 text-white hover:bg-blue-600 md:flex-initial'>
              {currentStep === 3 ? 'Upload Lyrics' : 'Next Step'}
            </Button>
          )}
        </div>
      </DialogFooter>
    </DialogContent>
  )
}

export default RequestDialog
