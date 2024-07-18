import TopBar from '@/components/shared/TopBar'
import { useAppContext } from '@/context/AppContext'

import { Outlet, useLocation, useMatch } from 'react-router-dom'

const RootLayout = () => {
  const { playerControlsVisible } = useAppContext()

  const isHomePage = useMatch('/')
  const isVideoPage = useMatch('/v/:videoId')

  // const handlePageClick = (event: React.MouseEvent<HTMLDivElement>) => {
  //   if (event.target === event.currentTarget) {
  //     if (isHomePage) {
  //       console.log('Clicked on Home Page')
  //     } else if (isVideoPage) {
  //       console.log('Clicked on Video Page')
  //     } else {
  //       console.log('Clicked on Other Page')
  //     }
  //   }
  // }

  return (
    <div className={`w-full ${!playerControlsVisible && 'cursor-none'} `}>
      <TopBar />
      <section className='-my-14 flex h-full flex-1'>
        {/* Outlet lets us show what's gonna be on the Landing Page later */}
        <Outlet />
      </section>
    </div>
  )
}
export default RootLayout
