import { useState, useEffect, useCallback } from 'react'
import {
  collection, addDoc, deleteDoc, doc,
  query, where, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { format } from 'date-fns'

const LS_HABITS = 'clarity_habits'
const LS_LOGS   = 'clarity_habit_logs'
function lsGet(k) { try { return JSON.parse(localStorage.getItem(k)) || [] } catch { return [] } }
function lsSet(k, v) { localStorage.setItem(k, JSON.stringify(v)) }

export function useHabits(user) {
  const [habits,  setHabits]  = useState([])
  const [logs,    setLogs]    = useState([])
  const [loading, setLoading] = useState(true)
  const online = !!user
  const today  = format(new Date(), 'yyyy-MM-dd')

  // Habits listener
  useEffect(() => {
    if (!online) { setHabits(lsGet(LS_HABITS)); setLoading(false); return }
    const q = query(collection(db, 'habits'), where('userId', '==', user.uid), orderBy('createdAt'))
    return onSnapshot(q, snap => {
      setHabits(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [user, online])

  // Logs listener (last 30 days)
  useEffect(() => {
    if (!online) { setLogs(lsGet(LS_LOGS)); return }
    const since = format(new Date(Date.now() - 30 * 86400000), 'yyyy-MM-dd')
    const q = query(
      collection(db, 'habit_logs'),
      where('userId', '==', user.uid),
      where('logDate', '>=', since)
    )
    return onSnapshot(q, snap => {
      setLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
  }, [user, online])

  const addHabit = useCallback(async (name, color = '#c85a2a', icon = '⭐') => {
    if (!online) {
      const h = { id: crypto.randomUUID(), name, color, icon, createdAt: new Date().toISOString() }
      setHabits(hs => { const n = [...hs, h]; lsSet(LS_HABITS, n); return n })
      return
    }
    await addDoc(collection(db, 'habits'), { userId: user.uid, name, color, icon, createdAt: serverTimestamp() })
  }, [online, user])

  const deleteHabit = useCallback(async (id) => {
    if (!online) {
      setHabits(hs => { const n = hs.filter(h => h.id !== id); lsSet(LS_HABITS, n); return n })
      return
    }
    await deleteDoc(doc(db, 'habits', id))
  }, [online])

  const toggleLog = useCallback(async (habitId) => {
    const existing = logs.find(l => l.habitId === habitId && l.logDate === today)
    if (existing) {
      if (!online) {
        setLogs(ls => { const n = ls.filter(l => l.id !== existing.id); lsSet(LS_LOGS, n); return n })
      } else {
        await deleteDoc(doc(db, 'habit_logs', existing.id))
      }
    } else {
      if (!online) {
        const log = { id: crypto.randomUUID(), habitId, logDate: today }
        setLogs(ls => { const n = [...ls, log]; lsSet(LS_LOGS, n); return n })
      } else {
        await addDoc(collection(db, 'habit_logs'), { userId: user.uid, habitId, logDate: today })
      }
    }
  }, [logs, today, online, user])

  const isDoneToday = (habitId) => logs.some(l => l.habitId === habitId && l.logDate === today)

  const getStreak = (habitId) => {
    const habitLogs = logs.filter(l => l.habitId === habitId).map(l => l.logDate).sort().reverse()
    let streak = 0
    let check = today
    for (let i = 0; i < 365; i++) {
      if (habitLogs.includes(check)) {
        streak++
        check = format(new Date(new Date(check + 'T12:00:00').getTime() - 86400000), 'yyyy-MM-dd')
      } else break
    }
    return streak
  }

  return { habits, logs, loading, addHabit, deleteHabit, toggleLog, isDoneToday, getStreak }
}
