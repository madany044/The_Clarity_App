import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const signUp = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      return { error: null }
    } catch (e) {
      return { error: { message: friendlyError(e.code) } }
    }
  }

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { error: null }
    } catch (e) {
      return { error: { message: friendlyError(e.code) } }
    }
  }

  const signOut = () => firebaseSignOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

function friendlyError(code) {
  switch (code) {
    case 'auth/email-already-in-use':   return 'This email is already registered. Try signing in.'
    case 'auth/invalid-email':          return 'Please enter a valid email address.'
    case 'auth/weak-password':          return 'Password must be at least 6 characters.'
    case 'auth/user-not-found':         return 'No account found with this email.'
    case 'auth/wrong-password':         return 'Incorrect password. Please try again.'
    case 'auth/invalid-credential':     return 'Invalid email or password.'
    case 'auth/too-many-requests':      return 'Too many attempts. Please wait a moment and try again.'
    default:                            return 'Something went wrong. Please try again.'
  }
}
