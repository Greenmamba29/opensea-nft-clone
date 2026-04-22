import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <Sidebar />
      <div className="flex flex-col ml-[52px] min-h-screen">
        <Header />
        <main className="flex-1 pb-9">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}
