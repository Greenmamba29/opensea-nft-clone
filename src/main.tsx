import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './styles/globals.css'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CollectionPage from './pages/CollectionPage'
import NFTDetailPage from './pages/NFTDetailPage'
import RankingsPage from './pages/RankingsPage'
import TokensPage from './pages/TokensPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import ActivityPage from './pages/ActivityPage'
import RewardsPage from './pages/RewardsPage'
import DropsPage from './pages/DropsPage'
import StudioPage from './pages/StudioPage'
import SupportPage from './pages/SupportPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/collection/:id" element={<NFTDetailPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/drops" element={<DropsPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/support" element={<SupportPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
