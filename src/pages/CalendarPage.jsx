import { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns'
import TaskItem  from '../components/TaskItem'
import TaskModal from '../components/TaskModal'
import styles from './CalendarPage.module.css'

export default function CalendarPage({ tasks, addTask, updateTask, deleteTask, toggleTask }) {
  const [current,   setCurrent]   = useState(new Date())
  const [selected,  setSelected]  = useState(new Date())
  const [showModal, setShowModal] = useState(false)
  const [editTask,  setEditTask]  = useState(null)

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(current), { weekStartsOn: 1 })
    const end   = endOfWeek(endOfMonth(current),     { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [current])

  const tasksForDay = (day) => tasks.filter(t => t.due_date && isSameDay(new Date(t.due_date), day))
  const selectedTasks = useMemo(() => tasks.filter(t => t.due_date && isSameDay(new Date(t.due_date), selected)), [tasks, selected])

  const handleSave = (data) => {
    const dateStr = format(selected, 'yyyy-MM-dd')
    if (editTask) updateTask(editTask.id, data)
    else addTask({ ...data, due_date: data.due_date || dateStr })
    setEditTask(null)
  }

  return (
    <div className={styles.page + ' fade-up'}>
      <div className={styles.header}>
        <h1 className={styles.title + ' serif'}>
          {format(current, 'MMMM')} <span>{format(current, 'yyyy')}</span>
        </h1>
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth()-1))}>‹</button>
          <button className={styles.navBtn} onClick={() => setCurrent(new Date())}>Today</button>
          <button className={styles.navBtn} onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth()+1))}>›</button>
        </div>
      </div>

      <div className={styles.layout}>
      <div className={styles.calCard}>
      <div className={styles.grid}>
        {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
          <div key={d} className={styles.dayName}>{d}</div>
        ))}
        {days.map(day => {
          const dayTasks = tasksForDay(day)
          return (
            <div
              key={day}
              className={[
                styles.day,
                isToday(day)                   ? styles.today    : '',
                isSameDay(day, selected)       ? styles.selected : '',
                !isSameMonth(day, current)     ? styles.otherMonth : ''
              ].join(' ')}
              onClick={() => setSelected(day)}
            >
              <span>{format(day, 'd')}</span>
              {dayTasks.length > 0 && (
                <div className={styles.dots}>
                  {dayTasks.slice(0,3).map((t,i) => (
                    <span key={i} className={styles.dot}
                      style={{ background: t.priority === 'high' ? 'var(--priority-high)' : t.priority === 'low' ? 'var(--priority-low)' : 'var(--priority-med)' }}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
      </div>

      <div className={styles.dayPanel}>
        <div className={styles.dayPanelHeader}>
          <span className={styles.dayPanelTitle + ' serif'}>
            {isToday(selected) ? 'Today' : format(selected, 'EEEE, MMM d')}
          </span>
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>+ Add</button>
        </div>
        {selectedTasks.length === 0 ? (
          <div className={styles.noDayTasks}>No tasks on this day</div>
        ) : (
          <div className={styles.list}>
            {selectedTasks.map(t => (
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
