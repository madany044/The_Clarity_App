import { useState, useEffect } from 'react'
import styles from './TaskModal.module.css'

const TAGS = ['Work', 'Personal', 'Health', 'Design', 'Study', 'Finance']

export default function TaskModal({ task, onSave, onClose }) {
  const [title,    setTitle]    = useState(task?.title    || '')
  const [dueDate,  setDueDate]  = useState(task?.due_date || '')
  const [dueTime,  setDueTime]  = useState(task?.due_time || '')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [tag,      setTag]      = useState(task?.tag      || '')
  const [notes,    setNotes]    = useState(task?.notes    || '')

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), due_date: dueDate || null, due_time: dueTime || null, priority, tag, notes })
    onClose()
  }

  // Close on Escape
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal + ' fade-up'}>
        <div className={styles.header}>
          <h2 className={styles.title + ' serif'}>{task ? 'Edit Task' : 'New Task'}</h2>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={submit}>
          <div className={styles.field}>
            <label className={styles.label}>Task name *</label>
            <input
              className={styles.input}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to get done?"
              autoFocus
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Due date</label>
              <input className={styles.input} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Reminder time</label>
              <input className={styles.input} type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Priority</label>
            <div className={styles.priorityRow}>
              {['high','medium','low'].map(p => (
                <button
                  key={p}
                  type="button"
                  className={`${styles.priorityBtn} ${priority === p ? styles['p_'+p] : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p === 'high' ? '🔴' : p === 'medium' ? '🟡' : '🟢'} {p.charAt(0).toUpperCase()+p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Tag</label>
            <div className={styles.chips}>
              {TAGS.map(t => (
                <button key={t} type="button"
                  className={`${styles.chip} ${tag === t ? styles.chipSel : ''}`}
                  onClick={() => setTag(tag === t ? '' : t)}
                >{t}</button>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Notes</label>
            <textarea className={styles.input} rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any extra details…" />
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.btnGhost} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.btnPrimary}>{task ? 'Save changes' : 'Add Task'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
