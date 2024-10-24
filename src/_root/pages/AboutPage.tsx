import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Divider } from '@mantine/core'
import { Helmet } from 'react-helmet-async'

const AboutPage = () => {
  //? To force errorboundary page to test
  // useEffect(() => {
  //   throw new Error('This is a test error')
  // }, [])

  return (
    <section className='custom-scrollbar mt-14 flex flex-1 flex-col overflow-y-scroll px-4 md:px-10'>
      <Helmet>
        <title>About | Synbox</title>
      </Helmet>

      <div className='mx-auto w-full max-w-4xl'>
        <h1 className='my-8 text-center text-4xl font-bold'>Why Synbox?</h1>
        <div className='space-y-6'>
          <p className='text-justify'>
            Paragraph 1 Paragraph 1 Paragraph 1 Paragraph 1 Paragraph 1
            Paragraph 1 Paragraph 1 Paragraph 1 Paragraph 1 Paragraph 1
            Paragraph 1 Paragraph 1 Paragraph 1
          </p>

          <p className='text-justify'>
            Paragraph 2 Paragraph 2 Paragraph 2 Paragraph 2 Paragraph 2
            Paragraph 2 Paragraph 2 Paragraph 2 Paragraph 2 Paragraph 2
            Paragraph 2 Paragraph 2 Paragraph 2
          </p>
        </div>
        <Divider my='lg' color='pink' />
        <h1 className='my-8 text-center text-4xl font-bold'>FAQs</h1>
        <div className='my-8'>
          <Accordion type='multiple' className='w-full'>
            <AccordionItem value='item-1'>
              <AccordionTrigger>How does Synbox work?</AccordionTrigger>
              <AccordionContent>
                Synbox allows users to generate english and chinese translations
                as well as romaji annotations given a specific Japanese song
                YouTube URL.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='item-2'>
              <AccordionTrigger>
                What videos are supported by Synbox?
              </AccordionTrigger>
              <AccordionContent>
                Currently, only Japanese music videos with a duration between 1
                minute and 8 minutes are supported by Synbox.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='item-3'>
              <AccordionTrigger>
                Why is the transcription quality so bad for a song?
              </AccordionTrigger>
              <AccordionContent>
                From testing, I figured that the duration of the song intro, the
                audio quality of the original video, and the tempo of the song
                all contribute significantly to the quality of the transcription
                made by the LLM. Only music videos that do not need transcribing
                have guaranteed success.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='item-4'>
              <AccordionTrigger>Accordion 4</AccordionTrigger>
              <AccordionContent>Accordion 4</AccordionContent>
            </AccordionItem>

            <AccordionItem value='item-5'>
              <AccordionTrigger>Accordion 5</AccordionTrigger>
              <AccordionContent>Accordion 5</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}

export default AboutPage
