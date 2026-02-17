import { createContext, useContext, useState } from 'react'

const SidebarContext = createContext()

export const useSidebar = () => useContext(SidebarContext)

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => setCollapsed(prev => !prev)

  return (
    <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}
