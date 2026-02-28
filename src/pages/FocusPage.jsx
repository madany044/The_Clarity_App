import { useState, useMemo } from 'react'
import { useTimer } from '../hooks/useTimer'
import styles from './FocusPage.module.css'

export default function FocusPage({ tasks, toggleTask }) {
  const { seconds, running, session, mode, progress, toggle, reset, skip } = useTimer()
  const [focusIdx, setFocusIdx] = useState(0)

  const pending = useMemo(() => tasks.filter(t => !t.completed), [tasks])
  const focusTask = pending[focusIdx] || null

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  const circumference = 2 * Math.PI * 70
  const strokeOffset  = circumference * (1 - progress)

  const handleDone = () => {
    if (focusTask) {
      toggleTask(focusTask.id)
      setFocusIdx(0)
    }
  }

  return (
    <div className={styles.page + ' fade-up'}>
      <div className={styles.screen}>
        <div className={styles.modeLabel}>
          {mode === 'work' ? `Session ${session} of 4 · Focus` : '☕ Break time'}
        </div>

        {focusTask ? (
          <>
            <div className={styles.taskName + ' serif'}>{focusTask.title}</div>
            <div className={styles.taskMeta}>
              {focusTask.tag && <span className={styles.tag}>{focusTask.tag}</span>}
              <span className={styles.priorityLabel}>{focusTask.priority} priority</span>
            </div>
          </>
        ) : (
          <div className={styles.noTask + ' serif'}>All tasks complete! 🎉</div>
        )}

        <div className={styles.ring}>
          <svg viewBox="0 0 160 160" width="160" height="160">
            <circle className={styles.ringBg} cx="80" cy="80" r="70" />
            <circle
              className={styles.ringFill}
              cx="80" cy="80" r="70"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeOffset,
                stroke: mode === 'break' ? 'var(--priority-low)' : 'var(--accent)'
              }}
            />
          </svg>
          <div className={styles.timerText}>{mm}:{ss}</div>
        </div>

        <div className={styles.controls}>
          <button className={styles.btn} onClick={reset}  title="Reset">↺</button>
          <button className={`${styles.btn} ${styles.primary}`} onClick={toggle}>
            {running ? '⏸' : '▶'}
          </button>
          <button className={styles.btn} onClick={skip}   title="Skip">⏭</button>
        </div>

        {focusTask && mode === 'work' && (
          <button className={styles.doneBtn} onClick={handleDone}>
            ✓ Mark as complete
          </button>
        )}

        {pending.length > 1 && (
          <div className={styles.queue}>
            <div className={styles.queueLabel}>Queue</div>
            {pending.slice(0, 5).map((t, i) => (
              <div
                key={t.id}
                className={`${styles.queueItem} ${i === focusIdx ? styles.queueActive : ''}`}
                onClick={() => setFocusIdx(i)}
              >
                <span className={styles.qNum}>{i + 1}</span>
                {t.title}
              </div>
            ))}
          </div>
        )}

        {pending.length === 0 && (
          <p className={styles.emptyHint}>Add tasks from the Today screen to start focusing.</p>
        )}
      </div>
    </div>
  )
}
