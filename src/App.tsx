import { Route, Routes } from 'react-router-dom'
import RootLayout from './_root/RootLayout'
import { LandingPage, PlayerPage, TestPage } from './_root/pages'

import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        {/* <Route element={<AuthLayout />}>
        <Route path='/sign-in' element={<SignInForm />} />
        <Route path='/sign-up' element={<SignUpForm />} />
      </Route> */}

        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<LandingPage />} />
          <Route path='/v/:videoId' element={<PlayerPage />} />
          <Route path='/test' element={<TestPage />} />
          {/* <Route path='/explore' element={<Explore />}/>
        // <Route path='/saved' element={<Saved />} />
        // <Route path='/all-users' element={<AllUsers />} />
        // <Route path='/create-post' element={<CreatePost />} />
        // <Route path='/update-post/:id' element={<EditPost />} />
        // <Route path='/posts/:id' element={<PostDetails />} />
        // <Route path='/profile/:id' element={<Profile />} />
        // <Route path='/update-profile/:id' element={<UpdateProfile />} /> */}
        </Route>
      </Routes>
      <Toaster />
    </main>
  )
}
export default App
