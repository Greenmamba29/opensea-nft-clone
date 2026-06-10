import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/globals.css'
import AuthProvider from './auth/AuthProvider'
import ProtectedRoute from './auth/ProtectedRoute'
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
import LandingPage from './pages/accio/LandingPage'
import MallOSPage from './pages/accio/MallOSPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Accio public marketing site */}
          <Route path="/" element={<LandingPage />} />

          {/* Operator console — auth + role gated */}
          <Route
            path="/os"
            element={
              <ProtectedRoute roles={["operator", "agent"]}>
                <MallOSPage />
              </ProtectedRoute>
            }
          />

          {/* Mall shopping experience (legacy scaffold) under /mall */}
          <Route element={<Layout />}>
            <Route path="/mall" element={<HomePage />} />
            <Route path="/mall/collection" element={<CollectionPage />} />
            <Route path="/mall/collection/:id" element={<NFTDetailPage />} />
            <Route path="/mall/rankings" element={<RankingsPage />} />
            <Route path="/mall/tokens" element={<TokensPage />} />
            <Route path="/mall/profile" element={<ProfilePage />} />
            <Route path="/mall/settings" element={<SettingsPage />} />
            <Route path="/mall/activity" element={<ActivityPage />} />
            <Route path="/mall/rewards" element={<RewardsPage />} />
            <Route path="/mall/drops" element={<DropsPage />} />
            <Route path="/mall/studio" element={<StudioPage />} />
            <Route path="/mall/support" element={<SupportPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
