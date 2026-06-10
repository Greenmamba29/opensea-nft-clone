import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'
import Concierge from './grahmos/Concierge'
import RouteCard from './grahmos/RouteCard'
import { RouteProvider } from '@/lib/routeContext'

export default function Layout() {
  return (
    <RouteProvider>
      <Sidebar />
      <div className="flex flex-col ml-[52px] min-h-screen">
        <Header />
        <main className="flex-1 pb-9">
          <Outlet />
        </main>
        <Footer />
      </div>
      <RouteCard />
      <Concierge surface="mall" />
    </RouteProvider>
  )
}
