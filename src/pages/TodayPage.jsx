import { useState, useMemo } from 'react'
import { format, isToday, isPast } from 'date-fns'
import TaskItem  from '../components/TaskItem'
import TaskModal from '../components/TaskModal'
import styles from './TodayPage.module.css'

export default function TodayPage({ tasks, loading, addTask, updateTask, deleteTask, toggleTask }) {
  const [showModal, setShowModal] = useState(false)
  const [editTask,  setEditTask]  = useState(null)

  const todayTasks = useMemo(() => tasks.filter(t => {
    if (!t.due_date) return !t.completed
    return isToday(new Date(t.due_date)) || (isPast(new Date(t.due_date)) && !t.completed)
  }), [tasks])

  const pending   = todayTasks.filter(t => !t.completed)
  const completed = todayTasks.filter(t =>  t.completed)
  const pct = todayTasks.length ? Math.round(completed.length / todayTasks.length * 100) : 0

  const greet = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const handleSave = (data) => {
    if (editTask) updateTask(editTask.id, data)
    else addTask(data)
    setEditTask(null)
  }

  return (
    <div className={styles.page + ' fade-up'}>
      <div className={styles.header}>
        <div>
          <div className={styles.screenLabel}>Your day</div>
          <h1 className={styles.title + ' serif'}>{greet()}</h1>
          <p className={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>
        <button className={styles.addBtn} onClick={() => setShowModal(true)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Add Task
        </button>
      </div>

      {todayTasks.length > 0 && (
        <div className={styles.progressWrap}>
          <div className={styles.progressMeta}>
            <span>{completed.length} of {todayTasks.length} tasks complete</span>
            <span className={styles.pct}>{pct}%</span>
          </div>
          <div className={styles.progressBg}>
            <div className={styles.progressFill} style={{ width: pct + '%' }} />
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : todayTasks.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>✨</span>
          <p>No tasks for today — add one to get started!</p>
        </div>
      ) : (
        <div className={styles.columns}>
          {/* Pending column */}
          <div className={styles.column}>
            <div className={styles.sectionLabel}>Remaining · {pending.length}</div>
            {pending.length === 0 ? (
              <div className={styles.emptyColumn}>All caught up! 🎉</div>
            ) : (
              <div className={styles.list}>
                {pending.map(t => (
                  <TaskItem key={t.id} task={t}
                    onToggle={toggleTask}
                    onEdit={task => { setEditTask(task); setShowModal(true) }}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Completed column */}
          <div className={styles.column}>
            <div className={styles.sectionLabel}>Completed · {completed.length}</div>
            {completed.length === 0 ? (
              <div className={styles.emptyColumn}>Complete a task to see it here</div>
            ) : (
              <div className={styles.list}>
                {completed.map(t => (
                  <TaskItem key={t.id} task={t}
                    onToggle={toggleTask}
                    onEdit={task => { setEditTask(task); setShowModal(true) }}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {pct === 100 && todayTasks.length > 0 && (
        <div className={styles.allDone}>🎉 All done for today! Great work.</div>
      )}

      {(showModal || editTask) && (
        <TaskModal
          task={editTask}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditTask(null) }}
        />
      )}
    </div>
  )
}
