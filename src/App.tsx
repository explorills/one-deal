import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Home from './pages/Home'
import Explore from './pages/Explore'
import NFTDetail from './pages/NFTDetail'
import CollectionPage from './pages/CollectionPage'
import Profile from './pages/Profile'
import Create from './pages/Create'
import CreateCollection from './pages/CreateCollection'
import Settings from './pages/Settings'
import Rankings from './pages/Rankings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/nft/:id" element={<NFTDetail />} />
          <Route path="/collection/:id" element={<CollectionPage />} />
          <Route path="/profile/:address" element={<Profile />} />
          <Route path="/create" element={<Create />} />
          <Route path="/create-collection" element={<CreateCollection />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/rankings" element={<Rankings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
