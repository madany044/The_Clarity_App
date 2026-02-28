import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import styles from './AuthPage.module.css'

export default function AuthPage() {
  const [mode,     setMode]     = useState('signin')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const fn = mode === 'signup' ? signUp : signIn
    const { error } = await fn(email, password)
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/')
  }

  const switchMode = () => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError('') }

  return (
    <div className={styles.page}>
      <div className={styles.card + ' fade-up'}>
        <div className={styles.logo}>clarity<span>.</span></div>
        <p className={styles.tagline}>Distraction-free tasks, every day.</p>

        <div className={styles.tabs}>
          <button className={mode === 'signin' ? styles.tabActive : styles.tab} onClick={() => { setMode('signin'); setError('') }}>Sign In</button>
          <button className={mode === 'signup' ? styles.tabActive : styles.tab} onClick={() => { setMode('signup'); setError('') }}>Create Account</button>
        </div>

        <form onSubmit={submit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <p className={styles.footnote}>
          {mode === 'signin' ? "Don't have an account? " : 'Already have one? '}
          <span className={styles.link} onClick={switchMode}>
            {mode === 'signin' ? 'Sign up free' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  )
}
