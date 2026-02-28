import { useState, useEffect, useCallback } from 'react'
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, query, where, orderBy, onSnapshot, serverTimestamp
} from 'firebase/firestore'
import { db } from '../lib/firebase'

const LS_KEY = 'clarity_tasks'
function localLoad() { try { return JSON.parse(localStorage.getItem(LS_KEY)) || [] } catch { return [] } }
function localSave(t) { localStorage.setItem(LS_KEY, JSON.stringify(t)) }

export function useTasks(user) {
  const [tasks,   setTasks]   = useState([])
  const [loading, setLoading] = useState(true)
  const online = !!user

  useEffect(() => {
    if (!online) {
      setTasks(localLoad())
      setLoading(false)
      return
    }
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [user, online])

  const addTask = useCallback(async (task) => {
    if (!online) {
      const t = { ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString(), completed: false }
      setTasks(ts => { const n = [t, ...ts]; localSave(n); return n })
      return
    }
    await addDoc(collection(db, 'tasks'), {
      ...task, userId: user.uid, completed: false, createdAt: serverTimestamp()
    })
  }, [online, user])

  const updateTask = useCallback(async (id, updates) => {
    if (!online) {
      setTasks(ts => { const n = ts.map(t => t.id === id ? { ...t, ...updates } : t); localSave(n); return n })
      return
    }
    await updateDoc(doc(db, 'tasks', id), updates)
  }, [online])

  const deleteTask = useCallback(async (id) => {
    if (!online) {
      setTasks(ts => { const n = ts.filter(t => t.id !== id); localSave(n); return n })
      return
    }
    await deleteDoc(doc(db, 'tasks', id))
  }, [online])

  const toggleTask = useCallback((id) => {
    const task = tasks.find(t => t.id === id)
    if (task) updateTask(id, {
      completed: !task.completed,
      completedAt: !task.completed ? new Date().toISOString() : null
    })
  }, [tasks, updateTask])

  return { tasks, loading, addTask, updateTask, deleteTask, toggleTask }
}
