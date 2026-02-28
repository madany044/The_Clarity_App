import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTasks } from '../hooks/useTasks'
import { useHabits } from '../hooks/useHabits'
import { useNotifications } from '../hooks/useNotifications'
import TodayPage    from './TodayPage'
import CalendarPage from './CalendarPage'
import FocusPage    from './FocusPage'
import ArchivePage  from './ArchivePage'
import HabitsPage   from './HabitsPage'
import styles from './Dashboard.module.css'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const taskState  = useTasks(user)
  const habitState = useHabits(user)
  const [theme, setTheme] = useState(() => localStorage.getItem('clarity_theme') || 'light')
  const [menuOpen, setMenuOpen] = useState(false)

  useNotifications(taskState.tasks)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('clarity_theme', theme)
  }, [theme])

  const todayCount = taskState.tasks.filter(t => {
    if (t.completed) return false
    if (!t.due_date) return true
    return new Date(t.due_date).toDateString() === new Date().toDateString()
  }).length

  const handleSignOut = async () => { await signOut(); navigate('/auth') }

  const navItems = [
    { to: '/',         label: 'Today',    icon: '☀️', badge: todayCount },
    { to: '/calendar', label: 'Calendar', icon: '📅' },
    { to: '/focus',    label: 'Focus',    icon: '🎯' },
    { to: '/habits',   label: 'Habits',   icon: '🔁' },
    { to: '/archive',  label: 'Archive',  icon: '📦' },
  ]

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}>
        <div className={styles.sidebarLogo}>clarity<span>.</span></div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
              {item.badge > 0 && <span className={styles.badge}>{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <button className={styles.themeBtn} onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
            {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
          </button>
          <div className={styles.userRow}>
            <div className={styles.avatar}>{user?.email?.[0]?.toUpperCase()}</div>
            <span className={styles.userEmail}>{user?.email}</span>
            <button className={styles.signOut} onClick={handleSignOut} title="Sign out">↪</button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className={styles.mobileHeader}>
        <button className={styles.menuBtn} onClick={() => setMenuOpen(o => !o)}>☰</button>
        <span className={styles.mobileLogo}>clarity<span>.</span></span>
        <button className={styles.themeBtn2} onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}

      {/* Main */}
      <main className={styles.main}>
        <Routes>
          <Route path="/"         element={<TodayPage    {...taskState} />} />
          <Route path="/calendar" element={<CalendarPage {...taskState} />} />
          <Route path="/focus"    element={<FocusPage    tasks={taskState.tasks} toggleTask={taskState.toggleTask} />} />
          <Route path="/habits"   element={<HabitsPage   {...habitState} />} />
          <Route path="/archive"  element={<ArchivePage  {...taskState} />} />
        </Routes>
      </main>
    </div>
  )
}
