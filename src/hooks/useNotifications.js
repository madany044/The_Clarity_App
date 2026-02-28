import { useEffect, useRef } from 'react'

export function useNotifications(tasks) {
  const notified = useRef(new Set())

  // Request permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Check tasks every minute
  useEffect(() => {
    const check = () => {
      if (!('Notification' in window) || Notification.permission !== 'granted') return
      const now = new Date()
      tasks.forEach(task => {
        if (task.completed || !task.due_date) return
        const due = new Date(task.due_date)
        const diffMin = (due - now) / 60000
        // Notify at 60 min before and at due time
        const key60 = `${task.id}-60`
        const key0  = `${task.id}-0`
        if (diffMin <= 60 && diffMin > 59 && !notified.current.has(key60)) {
          notified.current.add(key60)
          new Notification('⏰ Task due in 1 hour', { body: task.title, icon: '/favicon.svg' })
        }
        if (diffMin <= 0 && diffMin > -1 && !notified.current.has(key0)) {
          notified.current.add(key0)
          new Notification('🔔 Task is due now!', { body: task.title, icon: '/favicon.svg' })
        }
      })
    }
    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [tasks])
}
