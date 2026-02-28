import { useState } from 'react'
import { format, subDays } from 'date-fns'
import styles from './HabitsPage.module.css'

const COLORS  = ['#c85a2a','#d4a843','#6a9e6a','#4a8ec2','#9b6aaa','#e05252']
const ICONS   = ['⭐','💪','📚','🧘','🏃','💧','🎯','✍️','🍎','😴']

export default function HabitsPage({ habits, logs, loading, addHabit, deleteHabit, toggleLog, isDoneToday, getStreak }) {
  const [newName,  setNewName]  = useState('')
  const [newColor, setNewColor] = useState(COLORS[0])
  const [newIcon,  setNewIcon]  = useState(ICONS[0])
  const [showForm, setShowForm] = useState(false)
  const [confirm,  setConfirm]  = useState(null)

  // Last 7 days for mini heatmap
  const last7 = Array.from({ length: 7 }, (_, i) => format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'))

  const handleAdd = (e) => {
    e.preventDefault()
    if (!newName.trim()) return
    addHabit(newName.trim(), newColor, newIcon)
    setNewName(''); setShowForm(false)
  }

  return (
    <div className={styles.page + ' fade-up'}>
      <div className={styles.header}>
        <div>
          <div className={styles.screenLabel}>Daily Practice</div>
          <h1 className={styles.title + ' serif'}>Habits</h1>
        </div>
        <button className={styles.addBtn} onClick={() => setShowForm(s => !s)}>
          {showForm ? '✕ Cancel' : '+ New Habit'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className={styles.form + ' fade-up'}>
          <div className={styles.iconRow}>
            {ICONS.map(ic => (
              <button key={ic} type="button"
                className={`${styles.iconBtn} ${newIcon === ic ? styles.iconSel : ''}`}
                onClick={() => setNewIcon(ic)}
              >{ic}</button>
            ))}
          </div>
          <div className={styles.formRow}>
            <input
              className={styles.input}
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Habit name…"
              autoFocus
            />
            <div className={styles.colorRow}>
              {COLORS.map(c => (
                <button key={c} type="button"
                  className={`${styles.colorDot} ${newColor === c ? styles.colorSel : ''}`}
                  style={{ background: c }}
                  onClick={() => setNewColor(c)}
                />
              ))}
            </div>
            <button type="submit" className={styles.saveBtn}>Add</button>
          </div>
        </form>
      )}

      {/* 7-day header */}
      <div className={styles.calHeader}>
        <span className={styles.habitColLabel}>Habit</span>
        <div className={styles.dayHeaders}>
          {last7.map(d => (
            <span key={d} className={`${styles.dayHeader} ${d === format(new Date(), 'yyyy-MM-dd') ? styles.todayHeader : ''}`}>
              {format(new Date(d + 'T12:00:00'), 'EEE')[0]}
            </span>
          ))}
          <span className={styles.streakHeader}>🔥</span>
        </div>
      </div>

      {loading ? (
        <div className={styles.empty}>Loading…</div>
      ) : habits.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔁</span>
          <p>No habits yet — add one above to start tracking!</p>
        </div>
      ) : (
        <div className={styles.habitList}>
          {habits.map(habit => {
            const done  = isDoneToday(habit.id)
            const streak = getStreak(habit.id)
            return (
              <div key={habit.id} className={styles.habitRow}>
                <div className={styles.habitInfo}>
                  <span className={styles.habitIcon}>{habit.icon}</span>
                  <span className={styles.habitName}>{habit.name}</span>
                  {confirm === habit.id ? (
                    <div className={styles.confirmRow}>
                      <button className={styles.confirmDel} onClick={() => { deleteHabit(habit.id); setConfirm(null) }}>Delete</button>
                      <button className={styles.cancelDel} onClick={() => setConfirm(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button className={styles.delBtn} onClick={() => setConfirm(habit.id)}>×</button>
                  )}
                </div>
                <div className={styles.dayChecks}>
                  {last7.map(d => {
                    const logged = logs.some(l => l.habit_id === habit.id && l.log_date === d)
                    const isToday = d === format(new Date(), 'yyyy-MM-dd')
                    return (
                      <button
                        key={d}
                        className={`${styles.check} ${logged ? styles.checked : ''} ${isToday ? styles.checkToday : ''}`}
                        style={logged ? { background: habit.color, borderColor: habit.color } : {}}
                        onClick={() => isToday && toggleLog(habit.id)}
                        disabled={!isToday}
                        title={isToday ? (logged ? 'Unmark today' : 'Mark as done') : d}
                      >
                        {logged && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </button>
                    )
                  })}
                  <span className={`${styles.streak} ${streak > 0 ? styles.streakActive : ''}`}>
                    {streak > 0 ? streak : '—'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
