import DOMPurify from 'dompurify'

interface CaptionTextProps {
  htmlContent: string
}

const LyricText: React.FC<CaptionTextProps> = ({ htmlContent }) => {
  const createMarkup = (html: string) => {
    return { __html: DOMPurify.sanitize(html) }
  }
  return (
    <p
      className='font-outline-1 font_noto_sans_jp_black_900 sm:pl-2 text-4.2vw'
      dangerouslySetInnerHTML={createMarkup(htmlContent)}
    />
  )
}
export default LyricText
