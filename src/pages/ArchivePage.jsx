import { useState, useMemo } from 'react'
import { format, isToday, isYesterday, startOfWeek, isThisWeek } from 'date-fns'
import TaskItem from '../components/TaskItem'
import styles from './ArchivePage.module.css'

const TAGS = ['All','Work','Personal','Health','Design','Study','Finance']

export default function ArchivePage({ tasks, updateTask, deleteTask, toggleTask }) {
  const [tag,    setTag]    = useState('All')
  const [search, setSearch] = useState('')

  const completed = useMemo(() =>
    tasks.filter(t => {
      if (!t.completed) return false
      if (tag !== 'All' && t.tag !== tag) return false
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }).sort((a, b) => new Date(b.completed_at || b.created_at) - new Date(a.completed_at || a.created_at)),
  [tasks, tag, search])

  // Stats
  const thisWeek  = tasks.filter(t => t.completed && isThisWeek(new Date(t.completed_at || t.created_at))).length
  const today     = tasks.filter(t => t.completed && isToday(new Date(t.completed_at || t.created_at))).length
  const total     = tasks.filter(t => t.completed).length
  const rate      = tasks.length ? Math.round(total / tasks.length * 100) : 0

  // Group by date
  const grouped = useMemo(() => {
    const groups = {}
    completed.forEach(t => {
      const d = new Date(t.completed_at || t.created_at)
      const key = isToday(d) ? 'Today' : isYesterday(d) ? 'Yesterday' : format(d, 'MMM d, yyyy')
      if (!groups[key]) groups[key] = []
      groups[key].push(t)
    })
    return groups
  }, [completed])

  return (
    <div className={styles.page + ' fade-up'}>
      <div className={styles.header}>
        <div>
          <div className={styles.screenLabel}>History</div>
          <h1 className={styles.title + ' serif'}>Completed</h1>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statNum}>{today}</div>
          <div className={styles.statLabel}>Today</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>{thisWeek}</div>
          <div className={styles.statLabel}>This week</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum}>{total}</div>
          <div className={styles.statLabel}>All time</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statNum} style={{ color: 'var(--priority-low)' }}>{rate}%</div>
          <div className={styles.statLabel}>Completion</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search tasks…"
        />
      </div>

      <div className={styles.filters}>
        {TAGS.map(t => (
          <button key={t}
            className={`${styles.filter} ${tag === t ? styles.filterActive : ''}`}
            onClick={() => setTag(t)}
          >{t}</button>
        ))}
      </div>

      <div className={styles.taskGrid}>
      {completed.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📦</span>
          <p>{search || tag !== 'All' ? 'No tasks match your filters.' : 'No completed tasks yet.'}</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, dateTasks]) => (
          <div key={date}>
            <div className={styles.groupLabel}>{date}</div>
            <div className={styles.list}>
              {dateTasks.map(t => (
                <TaskItem key={t.id} task={t}
                  onToggle={toggleTask}
                  onEdit={() => {}}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          </div>
        ))
      )}
      </div>
    </div>
  )
}
