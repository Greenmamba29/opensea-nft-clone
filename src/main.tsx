import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/globals.css'
import AuthProvider from './auth/AuthProvider'
import ProtectedRoute from './auth/ProtectedRoute'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AislesPage from './pages/AislesPage'
import AisleDetailPage from './pages/AisleDetailPage'
import ProductsPage from './pages/ProductsPage'
import QuotesPage from './pages/QuotesPage'
import OrdersPage from './pages/OrdersPage'
import DirectionsPage from './pages/DirectionsPage'
import CollectionPage from './pages/CollectionPage'
import NFTDetailPage from './pages/NFTDetailPage'
import RankingsPage from './pages/RankingsPage'
import TokensPage from './pages/TokensPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import RewardsPage from './pages/RewardsPage'
import DropsPage from './pages/DropsPage'
import StudioPage from './pages/StudioPage'
import SupportPage from './pages/SupportPage'
import LandingPage from './pages/grahmos/LandingPage'
import MallOSPage from './pages/grahmos/MallOSPage'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* GrahmOS public marketing site */}
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

          {/* GrahmOS Virtual Mall — the in-mall shopping experience under /mall */}
          <Route element={<Layout />}>
            <Route path="/mall" element={<HomePage />} />
            <Route path="/mall/aisles" element={<AislesPage />} />
            <Route path="/mall/aisles/:slug" element={<AisleDetailPage />} />
            <Route path="/mall/stores" element={<RankingsPage />} />
            <Route path="/mall/products" element={<ProductsPage />} />
            <Route path="/mall/product/:id" element={<NFTDetailPage />} />
            <Route path="/mall/collection" element={<CollectionPage />} />
            <Route path="/mall/collection/:id" element={<NFTDetailPage />} />
            <Route path="/mall/quotes" element={<QuotesPage />} />
            <Route path="/mall/orders" element={<OrdersPage />} />
            <Route path="/mall/tokens" element={<TokensPage />} />
            <Route path="/mall/profile" element={<ProfilePage />} />
            <Route path="/mall/settings" element={<SettingsPage />} />
            <Route path="/mall/rewards" element={<RewardsPage />} />
            <Route path="/mall/drops" element={<DropsPage />} />
            <Route path="/mall/studio" element={<StudioPage />} />
            <Route path="/mall/support" element={<SupportPage />} />
            <Route path="/mall/directions" element={<DirectionsPage />} />
            {/* Legacy paths — keep deep links alive */}
            <Route path="/mall/rankings" element={<Navigate to="/mall/stores" replace />} />
            <Route path="/mall/activity" element={<Navigate to="/mall/orders" replace />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
