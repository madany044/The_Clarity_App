import { useState, useEffect, useRef, useCallback } from 'react'

const WORK_MINS  = 25
const BREAK_MINS = 5

export function useTimer() {
  const [seconds,  setSeconds]  = useState(WORK_MINS * 60)
  const [running,  setRunning]  = useState(false)
  const [session,  setSession]  = useState(1)
  const [mode,     setMode]     = useState('work') // 'work' | 'break'
  const interval = useRef(null)

  useEffect(() => {
    if (running) {
      interval.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(interval.current)
            setRunning(false)
            if (mode === 'work') {
              setMode('break')
              setSeconds(BREAK_MINS * 60)
              if ('Notification' in window && Notification.permission === 'granted')
                new Notification('✅ Focus session done!', { body: 'Time for a short break.', icon: '/favicon.svg' })
            } else {
              setMode('work')
              setSession(n => n + 1)
              setSeconds(WORK_MINS * 60)
              if ('Notification' in window && Notification.permission === 'granted')
                new Notification('💪 Break over!', { body: 'Time to focus again.', icon: '/favicon.svg' })
            }
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(interval.current)
    }
    return () => clearInterval(interval.current)
  }, [running, mode])

  const toggle = useCallback(() => setRunning(r => !r), [])
  const reset  = useCallback(() => {
    setRunning(false)
    setMode('work')
    setSeconds(WORK_MINS * 60)
  }, [])
  const skip = useCallback(() => {
    setRunning(false)
    if (mode === 'work') { setMode('break'); setSeconds(BREAK_MINS * 60) }
    else { setMode('work'); setSession(n => n + 1); setSeconds(WORK_MINS * 60) }
  }, [mode])

  const totalSeconds = mode === 'work' ? WORK_MINS * 60 : BREAK_MINS * 60
  const progress = seconds / totalSeconds

  return { seconds, running, session, mode, progress, toggle, reset, skip }
}
