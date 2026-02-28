import { useState } from 'react'
import { format, isToday, isPast } from 'date-fns'
import styles from './TaskItem.module.css'

const PRIORITY_COLORS = { high: '#c85a2a', medium: '#d4a843', low: '#6a9e6a' }

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  const dueDate = task.due_date ? new Date(task.due_date + (task.due_time ? 'T' + task.due_time : '')) : null
  const overdue = dueDate && !task.completed && isPast(dueDate)
  const dueToday = dueDate && isToday(dueDate)

  return (
    <div className={`${styles.item} ${task.completed ? styles.done : ''}`}>
      <button className={styles.check} onClick={() => onToggle(task.id)}>
        {task.completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className={styles.dot} style={{ background: PRIORITY_COLORS[task.priority] || '#ccc' }} />

      <div className={styles.body} onClick={() => !task.completed && onEdit(task)}>
        <div className={styles.name}>{task.title}</div>
        <div className={styles.meta}>
          {dueDate && (
            <span className={`${styles.due} ${overdue ? styles.overdue : ''} ${dueToday && !overdue ? styles.today : ''}`}>
              {overdue ? '⏰ Overdue · ' : ''}
              {format(dueDate, task.due_time ? 'MMM d, h:mm a' : 'MMM d')}
            </span>
          )}
          {task.tag && <span className={styles.tag}>{task.tag}</span>}
        </div>
      </div>

      <div className={styles.actions}>
        {!task.completed && (
          <button className={styles.editBtn} onClick={() => onEdit(task)} title="Edit">✎</button>
        )}
        {confirmDelete ? (
          <>
            <button className={styles.confirmBtn} onClick={() => onDelete(task.id)}>Delete</button>
            <button className={styles.cancelBtn} onClick={() => setConfirmDelete(false)}>Cancel</button>
          </>
        ) : (
          <button className={styles.deleteBtn} onClick={() => setConfirmDelete(true)} title="Delete">×</button>
        )}
      </div>
    </div>
  )
}
