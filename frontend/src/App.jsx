import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/common/ProtectedRoute'
import Navbar from './components/common/Navbar'

// Pages
import LoginPage      from './pages/auth/LoginPage'
import RegisterPage   from './pages/auth/RegisterPage'
import HomePage       from './pages/user/HomePage'
import BusListPage    from './pages/user/BusListPage'
import BookingPage    from './pages/user/BookingPage'
import MyTicketsPage  from './pages/user/MyTicketsPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import AddBusPage     from './pages/admin/AddBusPage'
import ManageBusesPage from './pages/admin/ManageBusesPage'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-bold text-brand-500/20 font-display mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-slate-400 text-sm mb-6">The page you're looking for doesn't exist.</p>
        <a href="/" className="btn-primary inline-block">Go Home</a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/"        element={<HomePage />} />
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/buses"    element={<BusListPage />} />

          {/* Protected — Passenger */}
          <Route path="/book/:id"   element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/my-tickets" element={<ProtectedRoute><MyTicketsPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin"            element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/add-bus"    element={<AdminRoute><AddBusPage /></AdminRoute>} />
          <Route path="/admin/buses"      element={<AdminRoute><ManageBusesPage /></AdminRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
