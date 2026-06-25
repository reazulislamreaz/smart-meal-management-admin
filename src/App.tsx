import { useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Eye,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  UsersRound,
  Utensils,
} from 'lucide-react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import notificationArt from '@/assets/hero.png'

const avatars = [
  'https://i.pravatar.cc/96?img=12',
  'https://i.pravatar.cc/96?img=32',
  'https://i.pravatar.cc/96?img=47',
  'https://i.pravatar.cc/96?img=5',
  'https://i.pravatar.cc/96?img=15',
  'https://i.pravatar.cc/96?img=11',
  'https://i.pravatar.cc/96?img=59',
]

const nav = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'User list', to: '/users', icon: UsersRound },
  { label: 'Meals', to: '/meals', icon: Utensils },
  { label: 'Subscription', to: '/subscription', icon: CreditCard },
  { label: 'Earnings', to: '/earnings', icon: CircleDollarSign },
  { label: 'Setting', to: '/settings', icon: Settings },
]

function Shell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const active = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to)

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="logo">sizzl<span>.</span></Link>
        <nav className="nav-list">
          {nav.map((item) => (
            <Link key={item.to} to={item.to} className={`nav-item ${active(item.to) ? 'active' : ''}`}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          ))}
          <button className="nav-item logout"><LogOut /><span>Logout</span></button>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button className="menu-button"><Menu /></button>
          <label className="searchbox">
            <Search />
            <input placeholder="Search name" />
          </label>
          <div className="top-actions">
            <button className="icon-button" onClick={() => setNotificationsOpen((v) => !v)}><Bell /></button>
            <button className="profile-button" onClick={() => setProfileOpen((v) => !v)}>
              <img src={avatars[0]} alt="" />
              <strong>Bashar Islam</strong>
              <ChevronDown />
            </button>
          </div>
          {profileOpen && (
            <div className="profile-popover">
              <strong>Bashar Islam</strong>
              <span>bashar@gmail.com</span>
              <button><LogOut /> Logout</button>
            </div>
          )}
          {notificationsOpen && (
            <div className="notification-popover">
              <button className="popover-close" onClick={() => setNotificationsOpen(false)}>×</button>
              <img src={notificationArt} alt="" />
              <strong>There's no notifications</strong>
            </div>
          )}
        </header>
        <main className="content">{children}</main>
      </section>
    </div>
  )
}

function PageHeading({ title, action }: { title: string; action?: ReactNode }) {
  return <div className="page-heading"><h1>{title}</h1>{action}</div>
}

function MiniStat({ icon, value, label, money }: { icon: ReactNode; value: string; label: string; money?: boolean }) {
  return (
    <div className="mini-stat">
      <div className="stat-icon">{icon}</div>
      <div><strong className={money ? 'money' : ''}>{value}</strong><span>{label}</span></div>
      <em>+20%</em>
    </div>
  )
}

const meals = [
  ['Chicken & Veg Teriyaki', 'Dinner', 'British', '25m', '$7.99', 'ACTIVE', '28 - 40'],
  ['Salmon Rice Bowls', 'Dinner', 'Asian', '20m', '$8.88', 'ACTIVE', '24 - 35'],
  ['Halloumi & Couscous', 'Lunch', 'Mediterranean', '20m', '$6.88', 'ACTIVE', '22 - 44'],
  ['Overnight Oats', 'Breakfast', 'American', '5m', '$2.88', 'ACTIVE', '19 - 30'],
  ['Veggie Curry', 'Dinner', 'Indian', '25m', '$5.88', 'ACTIVE', '21 - 36'],
  ['Beef Chilli Jackets', 'Dinner', 'British', '50m', '$7.99', 'ACTIVE', '7 - 26'],
  ['Greek Salad Jars', 'Lunch', 'Mediterranean', '15m', '$5.99', 'DRAFT', '8'],
  ['Pasta Chicken Pesto', 'Dinner', 'Italian', '20m', '$7.88', 'ACTIVE', '5 - 71'],
  ['Shakshuka', 'Breakfast', 'Mediterranean', '25m', '$4.88', 'ACTIVE', '7 - 44'],
  ['Falafel Pitas', 'Lunch', 'Middle Eastern', '15m', '$5.88', 'INACTIVE', '2 - 16'],
]

function IncomeRing() {
  return (
    <div className="income-card">
      <h3>Monthly income</h3>
      <p>Your income property calculated each month.</p>
      <div className="ring"><span>45.75%</span></div>
      <small>You earn $500K yearly. It is higher than last month.<br />Keep up your good work!</small>
      <div className="income-foot">
        <div><span>Today</span><strong>$30K <i>↑</i></strong></div>
        <div><span>Weekly</span><strong>$30K <i>↑</i></strong></div>
        <div><span>Monthly</span><strong>$30K <i>↑</i></strong></div>
      </div>
    </div>
  )
}

function Dashboard() {
  return (
    <>
      <div className="dashboard-grid">
        <div className="stats-grid">
          <MiniStat icon={<UsersRound />} value="2,543" label="Total Users" />
          <MiniStat icon={<FileText />} value="1.3k" label="Active Total" />
          <MiniStat icon={<CircleDollarSign />} value="$10,500" label="MEED" money />
          <MiniStat icon={<CreditCard />} value="32.8k" label="Meal/Payment" />
        </div>
        <IncomeRing />
      </div>
      <div className="dashboard-lower">
        <DashboardList />
        <TopMeals />
      </div>
    </>
  )
}

function DashboardList() {
  const rows = [
    ['Michael Rahman', 'Annual'], ['Philips Mark', 'Monthly'], ['James Dekker', 'Trial'],
    ['Eliza H.', 'Annual'], ['Marco Williams', 'Monthly'],
  ]
  return (
    <section className="panel compact-list">
      <h3>Recent Users</h3>
      {rows.map((row, i) => (
        <div className="person-row" key={row[0]}>
          <img src={avatars[i + 1]} alt="" /><span>{row[0]}</span><small>{row[1]}</small>
        </div>
      ))}
    </section>
  )
}

function TopMeals() {
  return (
    <section className="panel compact-list">
      <h3>Top Meals</h3>
      {meals.slice(0, 5).map((meal) => (
        <div className="meal-row" key={meal[0]}><span>–</span><strong>{meal[0]}</strong><small>{meal[4]}</small></div>
      ))}
    </section>
  )
}

function BarChart({ title = 'User ratio' }: { title?: string }) {
  const bars = [46, 58, 86, 61, 45, 61, 34, 43, 55, 71, 36, 53]
  return (
    <section className="chart-card">
      <div className="chart-head"><h3>{title}</h3><div><button>Monthly</button><button className="selected">Annually</button></div></div>
      <div className="chart">
        <div className="y-labels"><span>250</span><span>200</span><span>150</span><span>100</span><span>50</span><span>0</span></div>
        <div className="bars">
          {bars.map((height, i) => (
            <div className="bar-column" key={i}>
              <div className={`bar ${i === 2 ? 'focus' : ''}`} style={{ height: `${height}%` }}>{i === 2 && <b>220</b>}</div>
              <span>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const users = [
  ['01', 'Bashar Islam', 'bashar@gmail.com', '+244 127 134', 'Rangpur', '2025-03-12'],
  ['02', 'Amelia Rahman', 'amelia.rahman@gmail.com', '777-555', 'Dhaka', '2025-04-18'],
  ['03', 'Ayesha Begum', 'ayesha.begum@gmail.com', '666-444', 'Chittagong', '2025-05-20'],
  ['04', 'Sadik Alom', 'sadik@gmail.com', '888-123', 'Sylhet', '2025-06-18'],
  ['05', 'Tarek Ahmed', 'tarek.ahmed@gmail.com', '555-425', 'Khulna', '2025-07-04'],
  ['06', 'Nazmul Islam', 'nazmul@gmail.com', '444-321', 'Rajshahi', '2025-08-20'],
  ['07', 'Imran Khan', 'imran.khan@gmail.com', '333-499', 'Barisal', '2025-09-19'],
]

function UserTable({ earnings = false }: { earnings?: boolean }) {
  return (
    <section className="table-panel">
      <div className="table-toolbar">
        <h3>{earnings ? 'All Earning list' : 'All Users list'}</h3>
        <div className="filter-pills"><button>{earnings ? 'User Name' : 'Search Name'} <Search /></button><button>Joining Date <ChevronDown /></button><button>Subscription <ChevronDown /></button><button>Recent Created <ChevronDown /></button></div>
      </div>
      <table>
        <thead><tr>{(earnings ? ['Sl','User Image','Email','Subscription Type','Price','Expire Date','Action'] : ['Sl','User Name','Email','Phone Number','Address','Joining Date','Action']).map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {users.map((user, i) => (
            <tr key={user[0]}>
              <td>{user[0]}</td>
              <td><div className="user-cell"><img src={avatars[i]} alt="" /><strong>{earnings ? user[1].split(' ')[0] : user[1]}</strong></div></td>
              <td>{user[2]}</td>
              <td>{earnings ? (i % 2 ? 'Monthly' : 'Annual') : user[3]}</td>
              <td>{earnings ? `$${[10.99, 29.99, 49.99][i % 3]}` : user[4]}</td>
              <td>{user[5]}<br /><small>02:20PM</small></td>
              <td><Link className="row-action" to={earnings ? '/earnings/1' : '/users/1'}><Eye /></Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination"><ChevronLeft /><b>1</b><span>2</span><span>3</span><span>...</span><ChevronRight /></div>
    </section>
  )
}

function Users() {
  return <><PageHeading title="Manage User" /><BarChart /><UserTable /></>
}

function DetailCard({ earnings = false }: { earnings?: boolean }) {
  return (
    <div className="details-wrap">
      <Link to={earnings ? '/earnings' : '/users'} className="back"><ArrowLeft /> User Details</Link>
      <div className="identity-card">
        <div className="identity"><img src={avatars[earnings ? 3 : 0]} alt="" /><div><strong>{earnings ? 'Alex T' : 'Bashar Islam'}</strong><span>{earnings ? '' : 'Member'}</span></div></div>
        {!earnings && <button className="danger-pill">Block User</button>}
      </div>
      {earnings ? (
        <section className="info-card">
          <h3>Subscription Buying Information</h3>
          <div className="info-grid three">
            {[
              ['Subscription Type','Annual'],['Buying date','12/12/24'],['Current Period Start Date','15 Feb 2025'],
              ['Transaction ID','TXN1454'],['Withdraw Amount','$120'],['Subscription Expired','15 Jan 2026'],
              ['Current Plan Meal ID','Trial'],['Card Type','Visa/Pay'],['Status','Approved'],
            ].map(([a,b]) => <div key={a}><span>{a}</span><strong className={a === 'Status' ? 'approved' : ''}>{b}</strong></div>)}
          </div>
        </section>
      ) : (
        <>
          <div className="detail-stats"><div><span>Active Meals</span><strong>12</strong></div><div><span>Total Spend</span><strong>$ 350</strong></div></div>
          <section className="info-card">
            <h3>User Information</h3>
            <div className="info-grid">
              <div><span>Email</span><strong>BasharIslam123@gmail.com</strong></div>
              <div><span>Phone number</span><strong>1234567890</strong></div>
              <div><span>Joining Date</span><strong>15 Feb 2025</strong></div>
              <div><span>Current plan</span><strong className="approved">Annual</strong></div>
            </div>
          </section>
        </>
      )}
      {earnings && <div className="detail-stats"><div><span>Active Meals</span><strong>21</strong></div><div><span>Total Spend</span><strong>$ 350</strong></div></div>}
    </div>
  )
}

function MealForm() {
  return (
    <section className="meal-form panel">
      <div className="meal-form-top">
        <label className="searchbox small"><Search /><input placeholder="Search meals..." /></label>
        <div className="meal-tabs"><button className="active">All</button><button>Breakfast</button><button>Lunch</button><button>Dinner</button></div>
        <Link to="/meal-options" className="dark-button">+ Add Content</Link>
        <button className="dark-button">+ Add Meal</button>
      </div>
      <h3>Add new meal</h3>
      <div className="meal-inputs">
        <label>Name<input placeholder="e.g. Shakshuka" /></label>
        <label>Type<select><option>Dinner</option></select></label>
        <label>Duration<input placeholder="25m" /></label>
        <label>Price<input placeholder="e.g. $5.50" /></label>
      </div>
      <button className="dark-button">Save meal</button>
    </section>
  )
}

function Meals() {
  return (
    <>
      <MealForm />
      <section className="table-panel meal-table">
        <table>
          <thead><tr>{['MEAL','TYPE','CUISINE','TIME','ESTIMATE','STATUS','AGE',''].map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{meals.map((m) => <tr key={m[0]}>{m.map((v,i) => <td key={i}>{i === 5 ? <span className={`status ${v.toLowerCase()}`}>{v}</span> : i === 0 || i === 4 ? <strong>{v}</strong> : v}</td>)}<td><button className="tiny-action"><Pencil /></button><button className="tiny-action delete"><Trash2 /></button></td></tr>)}</tbody>
        </table>
      </section>
    </>
  )
}

function MealOptions() {
  const diet = ['Vegetarian','Vegan','Halal','Kosher','Gluten-free','Dairy-free','Nut-free','Pescatarian','High-protein']
  const cuisine = ['Italian','Mexican','Asian','Mediterranean','American','Indian','Middle Eastern','British']
  return (
    <div className="options-page">
      <section className="option-card"><div><h3>Dietary options</h3><button className="add pale-green"><Plus /> Add</button></div><div className="chips">{diet.map(x => <span key={x}>{x}<b>×</b></span>)}</div></section>
      <section className="option-card"><div><h3>Cuisine types</h3><button className="add pale-blue"><Plus /> Add</button></div><div className="chips">{cuisine.map(x => <span key={x}>{x}<b>×</b></span>)}</div></section>
    </div>
  )
}

function SubscriptionOverview() {
  return (
    <>
      <PageHeading title="Subscription" action={<Link to="/subscription/plans" className="dark-button">Subscription plan</Link>} />
      <p className="subtitle">Manage your subscription plan.</p>
      <div className="subscription-stats">
        <div><span>TOTAL</span><strong>1309</strong><small>Subscribers</small><i /></div>
        <div><span>ANNUAL</span><strong>1309</strong><small>Subscribers</small><i className="blue" /></div>
        <div><span>SUBSCRIPTION</span><strong>$20</strong><small>Monthly revenue</small><i className="orange" /></div>
      </div>
      <BarChart title="Revenue Breakdown" />
    </>
  )
}

const features = ['Unlimited meal plans','Nutrition tracking','Advanced analytics','Priority support']
function PlanCard({ premium = false }: { premium?: boolean }) {
  return (
    <div className="plan-card">
      <div className="plan-head"><span>{premium ? 'Premium Plan' : 'Basic Plan'}</span><p>{premium ? 'Best for growing health programs' : 'Everything you need to get started'}</p></div>
      <div className="plan-body">
        <strong>${premium ? '29.99' : '9.99'}<small>/Month</small></strong>
        <p>Every Monthly Billing</p>
        <div className="plan-actions"><Link to="/subscription/edit">Edit</Link><button className="remove">Delete</button></div>
        <h4>Features</h4>
        <ul>{features.map((f) => <li key={f}>✓ {f}</li>)}</ul>
      </div>
    </div>
  )
}

function SubscriptionPlans() {
  return (
    <>
      <PageHeading title="Subscription" action={<Link to="/subscription/create" className="dark-button">Create Subscription</Link>} />
      <p className="subtitle">Manage your Subscription.</p>
      <div className="plans-grid"><PlanCard /><PlanCard premium /></div>
    </>
  )
}

function SubscriptionForm({ edit = false }: { edit?: boolean }) {
  return (
    <div className="narrow-page">
      <Link to="/subscription/plans" className="back"><ArrowLeft /> {edit ? 'Edit Subscription' : 'Create Subscription'}</Link>
      <form className="form-card">
        <h3>Create Subscription</h3>
        <label>Subscription Plan Name<input defaultValue={edit ? 'Premium Plan' : ''} placeholder="Subscription Plan Name" /></label>
        <label>Subscription Price<input defaultValue={edit ? '29.99' : ''} placeholder="29.99" /></label>
        <label>Duration<select><option>Select</option></select></label>
        <label className="feature-label">Features<select><option>Monthly</option></select><button type="button">Add</button></label>
        <input placeholder="Nutrition tracker" />
        <input placeholder="Advanced analytics" />
        <input placeholder="Description" />
        <button type="button" className="outline-button">+ Add More</button>
        <button type="button" className="dark-button wide">{edit ? 'Update' : 'Create'}</button>
      </form>
    </div>
  )
}

function Earnings() {
  return (
    <>
      <PageHeading title="Earnings Overview" />
      <p className="subtitle">Track your revenue, profits, and financial metrics</p>
      <BarChart title="Revenue Breakdown" />
      <UserTable earnings />
    </>
  )
}

const settingsNav = [
  ['General','/settings'], ['Edit Profile','/settings/edit-profile'], ['Change Password','/settings/password'],
  ['Notification','/settings/notification'], ['Language','/settings/language'], ['Privacy Policy','/settings/privacy'],
  ['About Us','/settings/about'], ['Contact Us','/settings/contact'],
]

function SettingsLayout({ children }: { children: ReactNode }) {
  const loc = useLocation()
  return (
    <>
      <PageHeading title="Settings" />
      <p className="subtitle">Update your photo and personal details here.</p>
      <div className="settings-layout">
        <nav className="settings-nav">{settingsNav.map(([label,to]) => <Link className={loc.pathname === to || (to !== '/settings' && loc.pathname.startsWith(to)) ? 'active' : ''} to={to} key={to}>{label}</Link>)}</nav>
        <div className="settings-body">{children}</div>
      </div>
    </>
  )
}

function GeneralSettings() {
  return (
    <SettingsLayout>
      <section className="identity-card settings-identity"><div className="identity"><img src={avatars[0]} alt="" /><div><strong>Bashar Islam</strong><span>Admin</span></div></div><Link to="/settings/edit-profile" className="dark-button">Edit Profile</Link></section>
      <section className="info-card"><h3>Personal information</h3><div className="info-grid three"><div><span>Name</span><strong>Bashar Islam</strong></div><div><span>Email</span><strong>bashar@gmail.com</strong></div><div><span>Phone Number</span><strong>1234567890</strong></div><div><span>Role</span><strong>Admin</strong></div><div><span>Member Since</span><strong>January</strong></div><div><span>Address</span><strong>Dhaka</strong></div></div></section>
    </SettingsLayout>
  )
}

function BasicSettingsForm({ type }: { type: 'profile' | 'password' | 'language' }) {
  return (
    <SettingsLayout>
      <form className="form-card settings-form">
        <h3>{type === 'profile' ? 'Edit Profile' : type === 'password' ? 'Change Password' : 'Change Language'}</h3>
        {type === 'profile' && <><label>Full Name<input defaultValue="Bashar Islam" /></label><label>Email<input defaultValue="bashar@gmail.com" /></label><label>Phone<input defaultValue="1234567890" /></label><label>Address<input defaultValue="Dhaka, Bangladesh" /></label></>}
        {type === 'password' && <><label>Current Password<input type="password" placeholder="••••••••" /></label><label>New Password<input type="password" placeholder="••••••••" /></label><label>Confirm Password<input type="password" placeholder="••••••••" /></label></>}
        {type === 'language' && <><label>Change Language<select><option>English (UK)</option></select></label><label>Time Zone<select><option>GMT +06:00</option></select></label></>}
        <button type="button" className="dark-button wide">{type === 'language' ? 'Save Setting' : 'Save Changes'}</button>
      </form>
    </SettingsLayout>
  )
}

function Toggle({ on = true }: { on?: boolean }) {
  return <button className={`toggle ${on ? 'on' : ''}`}><span /></button>
}

function NotificationSettings() {
  return (
    <SettingsLayout>
      <section className="notification-card">
        <div><h3>Security Notification</h3><p>Receive emails about your account security.</p></div><Toggle />
        <div><h3>New Subscription</h3><p>Notify me when a customer subscribes.</p></div><Toggle />
        <div><h3>Meal Updates</h3><p>Receive updates about meal content.</p></div><Toggle on={false} />
        <div><h3>Marketing emails</h3><p>Receive product news and offers.</p></div><Toggle />
        <button className="dark-button">Save changes</button>
      </section>
    </SettingsLayout>
  )
}

const pageCopy = {
  privacy: {
    title: 'Privacy Policy',
    text: 'At Sizzl, we value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, store, and safeguard information when you use our meal management services. We only collect information necessary to provide a safe, personalized experience, process subscriptions, and improve our products. Your information is never sold to third parties. We use appropriate security measures and retain data only for as long as required to deliver our services or meet legal obligations.',
  },
  about: {
    title: 'About Us',
    text: 'Sizzl makes everyday meal planning simple, personal, and enjoyable. Our platform helps people discover meals, organize food choices, and manage subscriptions in one clear place. We believe healthy decisions should fit naturally into daily life, so we combine practical tools with thoughtfully selected recipes and reliable nutritional information. Our team is focused on building a friendly service that saves time and supports better eating habits.',
  },
}

function TextSettings({ kind, edit = false }: { kind: 'privacy' | 'about'; edit?: boolean }) {
  const copy = pageCopy[kind]
  return (
    <SettingsLayout>
      <section className={`text-settings ${edit ? 'editing' : ''}`}>
        <h3>{edit ? `Edit ${copy.title}` : copy.title}</h3>
        <div className="editor-bar">{edit && <><b>B</b><i>I</i><u>U</u><span>≡</span><span>☷</span></>}</div>
        {edit ? <textarea defaultValue={copy.text} /> : <p>{copy.text}</p>}
        <Link to={edit ? `/settings/${kind}` : `/settings/${kind}/edit`} className="dark-button">{edit ? 'Update' : 'Edit'}</Link>
      </section>
    </SettingsLayout>
  )
}

function ContactSettings({ edit = false }: { edit?: boolean }) {
  return (
    <SettingsLayout>
      <section className="contact-card">
        <h3>{edit ? 'Edit Contact Info' : 'Contact Us'}</h3>
        {edit ? (
          <form>
            <label>Title<input defaultValue="Get in touch with us" /></label>
            <label>Mail address<input defaultValue="hello@sizzl.com" /></label>
            <label>Phone Number<input defaultValue="+1 123 456 789" /></label>
            <button type="button" className="dark-button wide">Save contact info</button>
          </form>
        ) : (
          <div className="contact-info"><span>Mail</span><strong>hello@sizzl.com</strong><span>Phone number</span><strong>+1 123 456 789</strong><span>Address</span><strong>Dhaka, Bangladesh</strong><Link className="dark-button wide" to="/settings/contact/edit">Edit</Link></div>
        )}
      </section>
    </SettingsLayout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<DetailCard />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/meal-options" element={<MealOptions />} />
          <Route path="/subscription" element={<SubscriptionOverview />} />
          <Route path="/subscription/plans" element={<SubscriptionPlans />} />
          <Route path="/subscription/create" element={<SubscriptionForm />} />
          <Route path="/subscription/edit" element={<SubscriptionForm edit />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/earnings/:id" element={<DetailCard earnings />} />
          <Route path="/settings" element={<GeneralSettings />} />
          <Route path="/settings/edit-profile" element={<BasicSettingsForm type="profile" />} />
          <Route path="/settings/password" element={<BasicSettingsForm type="password" />} />
          <Route path="/settings/notification" element={<NotificationSettings />} />
          <Route path="/settings/language" element={<BasicSettingsForm type="language" />} />
          <Route path="/settings/privacy" element={<TextSettings kind="privacy" />} />
          <Route path="/settings/privacy/edit" element={<TextSettings kind="privacy" edit />} />
          <Route path="/settings/about" element={<TextSettings kind="about" />} />
          <Route path="/settings/about/edit" element={<TextSettings kind="about" edit />} />
          <Route path="/settings/contact" element={<ContactSettings />} />
          <Route path="/settings/contact/edit" element={<ContactSettings edit />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  )
}
