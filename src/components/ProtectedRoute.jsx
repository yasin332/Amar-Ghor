import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    // You can add a loading spinner here
    return <div>Loading...</div>
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const userRole = session.user.user_metadata.user_type
  if (!allowedRoles.includes(userRole)) {
    // Redirect to a default page if the role is not allowed
    // Or to a specific "unauthorized" page
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute 