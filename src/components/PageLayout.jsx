import Sidebar from './Sidebar'
import { useSidebar } from '../context/SidebarContext'

const PageLayout = ({ children }) => {
  const { collapsed } = useSidebar()

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-[5.3rem]' : 'ml-64'} p-4 md:p-6`}>
        {children}
      </main>
    </div>
  )
}

export default PageLayout
