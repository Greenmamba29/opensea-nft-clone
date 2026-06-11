import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/globals.css'
import AuthProvider from './auth/AuthProvider'
import ProtectedRoute from './auth/ProtectedRoute'
import Layout from './components/Layout'
import PageTransition from './components/PageTransition'

// Route-level code splitting: each surface loads only when visited.
const LandingPage = lazy(() => import('./pages/grahmos/LandingPage'))
const MallOSPage = lazy(() => import('./pages/grahmos/MallOSPage'))
const HomePage = lazy(() => import('./pages/HomePage'))
const AislesPage = lazy(() => import('./pages/AislesPage'))
const AisleDetailPage = lazy(() => import('./pages/AisleDetailPage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const QuotesPage = lazy(() => import('./pages/QuotesPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const DirectionsPage = lazy(() => import('./pages/DirectionsPage'))
const CollectionPage = lazy(() => import('./pages/CollectionPage'))
const NFTDetailPage = lazy(() => import('./pages/NFTDetailPage'))
const RankingsPage = lazy(() => import('./pages/RankingsPage'))
const TokensPage = lazy(() => import('./pages/TokensPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const RewardsPage = lazy(() => import('./pages/RewardsPage'))
const DropsPage = lazy(() => import('./pages/DropsPage'))
const StudioPage = lazy(() => import('./pages/StudioPage'))
const SupportPage = lazy(() => import('./pages/SupportPage'))

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--os-bg)]">
      <div className="flex items-center gap-3 text-[var(--os-text-secondary)] text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-[var(--os-blue)] animate-pulse" />
        Opening the mall…
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* GrahmOS public marketing site */}
            <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />

            {/* Operator console — auth + role gated */}
            <Route
              path="/os"
              element={
                <PageTransition>
                  <ProtectedRoute roles={["operator", "agent"]}>
                    <MallOSPage />
                  </ProtectedRoute>
                </PageTransition>
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
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
