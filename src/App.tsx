import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { OneIdProvider, EcosystemNavbar, EcosystemFooter } from '@explorills/one-ecosystem-ui'
import { Layout } from '@/components/layout/Layout'
import { WALLETCONNECT_PROJECT_ID } from '@/lib/constants'
import Home from '@/pages/Home'
import Explore from '@/pages/Explore'
import NFTDetail from '@/pages/NFTDetail'
import CollectionPage from '@/pages/CollectionPage'
import Profile from '@/pages/Profile'
import NotFound from '@/pages/NotFound'

function AppRoutes() {
  return (
    <BrowserRouter>
      <EcosystemNavbar
        logo="/logo.png"
        projectName="deal"
        themeColor="oklch(0.72 0.17 195)"
        currentDomain="deal.expl.one"
      />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/nft/:chain/:address/:tokenId" element={<NFTDetail />} />
          <Route path="/collection/:chain/:address" element={<CollectionPage />} />
          <Route path="/profile/:address" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <EcosystemFooter themeColor="oklch(0.72 0.17 195)" />
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <OneIdProvider projectId={WALLETCONNECT_PROJECT_ID} profilePath="/profile" platformColor="oklch(0.72 0.17 195)">
      <AppRoutes />
    </OneIdProvider>
  )
}
