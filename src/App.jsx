import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import SelectRole from './pages/SelectRole'
import RegisterStudent from './pages/RegisterStudent'
import RegisterTeacher from './pages/RegisterTeacher'
import RegisterSelfLearner from './pages/RegisterSelfLearner'
import SelectField from './pages/SelectField'
import Onboarding from './pages/Onboarding'
import Roadmap from './pages/Roadmap'
import Course from './pages/Course'
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'
import Requests from './pages/Requests'
import GroupDetail from './pages/GroupDetail'
import Lessons from './pages/Lessons'
import Exercises from './pages/Exercises'
import Messages from './pages/Messages'
import AIChat from './pages/AIChat'
import Schedule from './pages/Schedule'
import Settings from './pages/Settings'
import Quizzes from './pages/Quizzes'
import Analytics from './pages/Analytics'
import { ThemeProvider } from './context/ThemeContext'
import { AppDataProvider } from './context/AppDataContext'
import { SidebarProvider } from './context/SidebarContext'

// Protected Route komponenti
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}

// Auth sahifalarini himoya qilish (login bo'lganlar uchun)
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }
  
  return user ? <Navigate to="/dashboard" /> : children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
      <Route path="/register" element={<AuthRoute><SelectRole /></AuthRoute>} />
      <Route path="/register/student" element={<AuthRoute><RegisterStudent /></AuthRoute>} />
      <Route path="/register/teacher" element={<AuthRoute><RegisterTeacher /></AuthRoute>} />
      <Route path="/register/self-learner" element={<AuthRoute><RegisterSelfLearner /></AuthRoute>} />
      <Route path="/select-field" element={<ProtectedRoute><SelectField /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
      <Route path="/course" element={<ProtectedRoute><Course /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/groups" element={<ProtectedRoute><Groups /></ProtectedRoute>} />
      <Route path="/groups/:groupId" element={<ProtectedRoute><GroupDetail /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
      <Route path="/lessons" element={<ProtectedRoute><Lessons /></ProtectedRoute>} />
      <Route path="/exercises" element={<ProtectedRoute><Exercises /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/ai-chat" element={<ProtectedRoute><AIChat /></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppDataProvider>
            <SidebarProvider>
              <AppRoutes />
            </SidebarProvider>
          </AppDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
