import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OneIdProvider } from '@explorills/one-id-auth'
import { Layout } from '@/components/layout/Layout'
import { getOneIdApiUrl } from '@/lib/utils'
import { WALLETCONNECT_PROJECT_ID } from '@/lib/constants'
import Home from '@/pages/Home'
import Explore from '@/pages/Explore'
import NFTDetail from '@/pages/NFTDetail'
import CollectionPage from '@/pages/CollectionPage'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import Rankings from '@/pages/Rankings'
import NotFound from '@/pages/NotFound'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/nft/:id" element={<NFTDetail />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
          <Route path="/profile/:address" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <OneIdProvider apiUrl={getOneIdApiUrl()} walletConnectId={WALLETCONNECT_PROJECT_ID}>
      <AppRoutes />
    </OneIdProvider>
  )
}
