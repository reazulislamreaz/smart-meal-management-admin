import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type FormEvent,
  type ReactNode,
  type SetStateAction,
} from "react";
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
  X,
} from "lucide-react";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import notificationArt from "@/assets/hero.png";

type Profile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  memberSince: string;
};

type Preferences = {
  language: string;
  timezone: string;
  notifications: boolean[];
};

type AppData = {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  preferences: Preferences;
  setPreferences: Dispatch<SetStateAction<Preferences>>;
  privacy: string;
  setPrivacy: Dispatch<SetStateAction<string>>;
  about: string;
  setAbout: Dispatch<SetStateAction<string>>;
  contact: typeof initialContactDetails;
  setContact: Dispatch<SetStateAction<typeof initialContactDetails>>;
};

const initialProfile: Profile = {
  name: "Bashar Islam",
  email: "bashar@gmail.com",
  phone: "1234567890",
  address: "Dhaka, Bangladesh",
  role: "Admin",
  memberSince: "January",
};

const initialPreferences: Preferences = {
  language: "English (UK)",
  timezone: "GMT +06:00",
  notifications: [true, true, false, true],
};

const initialContactDetails = {
  title: "Get in touch with us",
  email: "hello@sizzl.com",
  phone: "+1 123 456 789",
  address: "Dhaka, Bangladesh",
};

const initialPageCopy = {
  privacy: {
    title: "Privacy Policy",
    text: "At Sizzl, we value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, store, and safeguard information when you use our meal management services. We only collect information necessary to provide a safe, personalized experience, process subscriptions, and improve our products. Your information is never sold to third parties. We use appropriate security measures and retain data only for as long as required to deliver our services or meet legal obligations.",
  },
  about: {
    title: "About Us",
    text: "Sizzl makes everyday meal planning simple, personal, and enjoyable. Our platform helps people discover meals, organize food choices, and manage subscriptions in one clear place. We believe healthy decisions should fit naturally into daily life, so we combine practical tools with thoughtfully selected recipes and reliable nutritional information. Our team is focused on building a friendly service that saves time and supports better eating habits.",
  },
};

const AppDataContext = createContext<AppData | null>(null);

function useAppData() {
  const value = useContext(AppDataContext);
  if (!value) throw new Error("App data is unavailable");
  return value;
}

function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function AppDataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useStoredState("sizzl-profile", initialProfile);
  const [preferences, setPreferences] = useStoredState(
    "sizzl-preferences",
    initialPreferences,
  );
  const [privacy, setPrivacy] = useStoredState(
    "sizzl-privacy",
    initialPageCopy.privacy.text,
  );
  const [about, setAbout] = useStoredState(
    "sizzl-about",
    initialPageCopy.about.text,
  );
  const [contact, setContact] = useStoredState(
    "sizzl-contact",
    initialContactDetails,
  );
  const value = useMemo(
    () => ({
      profile,
      setProfile,
      preferences,
      setPreferences,
      privacy,
      setPrivacy,
      about,
      setAbout,
      contact,
      setContact,
    }),
    [
      about,
      contact,
      preferences,
      privacy,
      profile,
      setAbout,
      setContact,
      setPreferences,
      setPrivacy,
      setProfile,
    ],
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

const avatars = [
  "https://i.pravatar.cc/96?img=12",
  "https://i.pravatar.cc/96?img=32",
  "https://i.pravatar.cc/96?img=47",
  "https://i.pravatar.cc/96?img=5",
  "https://i.pravatar.cc/96?img=15",
  "https://i.pravatar.cc/96?img=11",
  "https://i.pravatar.cc/96?img=59",
];

const nav = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "User list", to: "/users", icon: UsersRound },
  { label: "Meals", to: "/meals", icon: Utensils },
  { label: "Subscription", to: "/subscription", icon: CreditCard },
  { label: "Earnings", to: "/earnings", icon: CircleDollarSign },
  { label: "Setting", to: "/settings", icon: Settings },
];

function Shell({ children }: { children: ReactNode }) {
  const { profile } = useAppData();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 900);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const active = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  useEffect(() => {
    setSidebarOpen(window.innerWidth > 900);
    setProfileOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (search.trim()) {
        const searchablePaths = ["/", "/users", "/meals", "/earnings"];
        const currentPath = location.pathname.replace(/\/$/, "") || "/";
        const isSearchable = searchablePaths.some((p) =>
          p === "/" ? currentPath === "/" : currentPath.startsWith(p),
        );
        if (!isSearchable) {
          navigate(`/users?q=${encodeURIComponent(search.trim())}`, {
            replace: true,
          });
          return;
        }
      }
      const next = new URLSearchParams(searchParams);
      if (search.trim()) next.set("q", search.trim());
      else next.delete("q");
      if (next.toString() !== searchParams.toString())
        setSearchParams(next, { replace: true });
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [search, searchParams, setSearchParams, location.pathname, navigate]);

  const clearSearch = () => {
    setSearch("");
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const logout = () => {
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <div
      className={`app-shell ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}
    >
      <button
        className="sidebar-backdrop"
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
      />
      <aside className="sidebar" aria-label="Main navigation">
        <Link to="/" className="logo">
          sizzl<span>.</span>
        </Link>
        <nav className="nav-list">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${active(item.to) ? "active" : ""}`}
            >
              <item.icon />
              <span>{item.label}</span>
            </Link>
          ))}
          <button className="nav-item logout" onClick={logout}>
            <LogOut />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button
            className="menu-button"
            aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((value) => !value)}
          >
            <Menu />
          </button>
          <label className="searchbox">
            <Search />
            <input
              aria-label="Search"
              placeholder="Search name"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") clearSearch();
                if (event.key === "Enter") {
                  event.preventDefault();
                  const next = new URLSearchParams(searchParams);
                  if (search.trim()) next.set("q", search.trim());
                  else next.delete("q");
                  setSearchParams(next, { replace: true });
                }
              }}
            />
            {search && (
              <button
                type="button"
                className="search-clear"
                aria-label="Clear search"
                onClick={clearSearch}
              >
                <X />
              </button>
            )}
          </label>
          <div className="top-actions">
            <button
              className="icon-button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen((v) => !v);
                setProfileOpen(false);
              }}
            >
              <Bell />
            </button>
            <button
              className="profile-button"
              aria-expanded={profileOpen}
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotificationsOpen(false);
              }}
            >
              <img src={avatars[0]} alt="" />
              <strong>{profile.name}</strong>
              <ChevronDown />
            </button>
          </div>
          {profileOpen && (
            <div className="profile-popover">
              <strong>{profile.name}</strong>
              <span>{profile.email}</span>
              <button onClick={logout}>
                <LogOut /> Logout
              </button>
            </div>
          )}
          {notificationsOpen && (
            <div className="notification-popover">
              <button
                className="popover-close"
                onClick={() => setNotificationsOpen(false)}
              >
                ×
              </button>
              <img src={notificationArt} alt="" />
              <strong>There's no notifications</strong>
            </div>
          )}
        </header>
        <main className="content">{children}</main>
      </section>
    </div>
  );
}

function PageHeading({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="page-heading">
      <h1>{title}</h1>
      {action}
    </div>
  );
}

function MiniStat({
  icon,
  value,
  label,
  money,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  money?: boolean;
}) {
  return (
    <div className="mini-stat">
      <div className="stat-icon">{icon}</div>
      <div>
        <strong className={money ? "money" : ""}>{value}</strong>
        <span>{label}</span>
      </div>
      <em>+20%</em>
    </div>
  );
}

const meals = [
  [
    "Chicken & Veg Teriyaki",
    "Dinner",
    "British",
    "25m",
    "$7.99",
    "ACTIVE",
    "28 - 40",
  ],
  ["Salmon Rice Bowls", "Dinner", "Asian", "20m", "$8.88", "ACTIVE", "24 - 35"],
  [
    "Halloumi & Couscous",
    "Lunch",
    "Mediterranean",
    "20m",
    "$6.88",
    "ACTIVE",
    "22 - 44",
  ],
  [
    "Overnight Oats",
    "Breakfast",
    "American",
    "5m",
    "$2.88",
    "ACTIVE",
    "19 - 30",
  ],
  ["Veggie Curry", "Dinner", "Indian", "25m", "$5.88", "ACTIVE", "21 - 36"],
  [
    "Beef Chilli Jackets",
    "Dinner",
    "British",
    "50m",
    "$7.99",
    "ACTIVE",
    "7 - 26",
  ],
  ["Greek Salad Jars", "Lunch", "Mediterranean", "15m", "$5.99", "DRAFT", "8"],
  [
    "Pasta Chicken Pesto",
    "Dinner",
    "Italian",
    "20m",
    "$7.88",
    "ACTIVE",
    "5 - 71",
  ],
  [
    "Shakshuka",
    "Breakfast",
    "Mediterranean",
    "25m",
    "$4.88",
    "ACTIVE",
    "7 - 44",
  ],
  [
    "Falafel Pitas",
    "Lunch",
    "Middle Eastern",
    "15m",
    "$5.88",
    "INACTIVE",
    "2 - 16",
  ],
];

function IncomeRing() {
  return (
    <div className="income-card">
      <h3>Monthly income</h3>
      <p>Your income property calculated each month.</p>
      <div className="ring">
        <span>45.75%</span>
      </div>
      <small>
        You earn $500K yearly. It is higher than last month.
        <br />
        Keep up your good work!
      </small>
      <div className="income-foot">
        <div>
          <span>Today</span>
          <strong>
            $30K <i>↑</i>
          </strong>
        </div>
        <div>
          <span>Weekly</span>
          <strong>
            $30K <i>↑</i>
          </strong>
        </div>
        <div>
          <span>Monthly</span>
          <strong>
            $30K <i>↑</i>
          </strong>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  return (
    <>
      <div className="dashboard-grid">
        <div className="stats-grid">
          <MiniStat icon={<UsersRound />} value="2,543" label="Total Users" />
          <MiniStat icon={<FileText />} value="1.3k" label="Active Total" />
          <MiniStat
            icon={<CircleDollarSign />}
            value="$10,500"
            label="MEED"
            money
          />
          <MiniStat icon={<CreditCard />} value="32.8k" label="Meal/Payment" />
        </div>
        <IncomeRing />
      </div>
      <div className="dashboard-lower">
        <DashboardList />
        <TopMeals />
      </div>
    </>
  );
}

function DashboardList() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const rows = [
    ["Michael Rahman", "Annual"],
    ["Philips Mark", "Monthly"],
    ["James Dekker", "Trial"],
    ["Eliza H.", "Annual"],
    ["Marco Williams", "Monthly"],
  ].filter((row) => row.join(" ").toLowerCase().includes(query));
  return (
    <section className="panel compact-list">
      <h3>Recent Users</h3>
      {rows.length ? (
        rows.map((row, i) => (
          <div className="person-row" key={row[0]}>
            <img src={avatars[i + 1]} alt="" />
            <span>{row[0]}</span>
            <small>{row[1]}</small>
          </div>
        ))
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

function TopMeals() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const filteredMeals = meals
    .slice(0, 5)
    .filter((meal) => meal.join(" ").toLowerCase().includes(query));
  return (
    <section className="panel compact-list">
      <h3>Top Meals</h3>
      {filteredMeals.length ? (
        filteredMeals.map((meal) => (
          <div className="meal-row" key={meal[0]}>
            <span>–</span>
            <strong>{meal[0]}</strong>
            <small>{meal[4]}</small>
          </div>
        ))
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

function EmptyState({ label = "No results found" }: { label?: string }) {
  return <div className="empty-state">{label}</div>;
}

function BarChart({ title = "User ratio" }: { title?: string }) {
  const [period, setPeriod] = useState<"monthly" | "annually">("annually");
  const bars =
    period === "annually"
      ? [46, 58, 86, 61, 45, 61, 34, 43, 55, 71, 36, 53]
      : [40, 53, 72, 56, 63, 48, 67, 58, 45, 64, 51, 69];
  return (
    <section className="chart-card">
      <div className="chart-head">
        <h3>{title}</h3>
        <div>
          <button
            className={period === "monthly" ? "selected" : ""}
            onClick={() => setPeriod("monthly")}
          >
            Monthly
          </button>
          <button
            className={period === "annually" ? "selected" : ""}
            onClick={() => setPeriod("annually")}
          >
            Annually
          </button>
        </div>
      </div>
      <div className="chart">
        <div className="y-labels">
          <span>250</span>
          <span>200</span>
          <span>150</span>
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>
        <div className="bars">
          {bars.map((height, i) => (
            <div className="bar-column" key={i}>
              <div
                className={`bar ${i === 2 ? "focus" : ""}`}
                style={{ height: `${height}%` }}
              >
                {i === 2 && <b>220</b>}
              </div>
              <span>
                {
                  [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ][i]
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const users = [
  [
    "01",
    "Bashar Islam",
    "bashar@gmail.com",
    "+244 127 134",
    "Rangpur",
    "2025-03-12",
  ],
  [
    "02",
    "Amelia Rahman",
    "amelia.rahman@gmail.com",
    "777-555",
    "Dhaka",
    "2025-04-18",
  ],
  [
    "03",
    "Ayesha Begum",
    "ayesha.begum@gmail.com",
    "666-444",
    "Chittagong",
    "2025-05-20",
  ],
  ["04", "Sadik Alom", "sadik@gmail.com", "888-123", "Sylhet", "2025-06-18"],
  [
    "05",
    "Tarek Ahmed",
    "tarek.ahmed@gmail.com",
    "555-425",
    "Khulna",
    "2025-07-04",
  ],
  [
    "06",
    "Nazmul Islam",
    "nazmul@gmail.com",
    "444-321",
    "Rajshahi",
    "2025-08-20",
  ],
  [
    "07",
    "Imran Khan",
    "imran.khan@gmail.com",
    "333-499",
    "Barisal",
    "2025-09-19",
  ],
];

function UserTable({ earnings = false }: { earnings?: boolean }) {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const [page, setPage] = useState(1);
  const [ascending, setAscending] = useState(false);
  const [subscription, setSubscription] = useState<
    "All" | "Annual" | "Monthly"
  >("All");
  const pageSize = 4;
  const filteredUsers = useMemo(
    () =>
      users
        .filter((user) => user.join(" ").toLowerCase().includes(query))
        .filter((user) => {
          if (subscription === "All") return true;
          const userSubscription = Number(user[0]) % 2 ? "Annual" : "Monthly";
          return userSubscription === subscription;
        })
        .sort((a, b) =>
          ascending ? a[5].localeCompare(b[5]) : b[5].localeCompare(a[5]),
        ),
    [ascending, query, subscription],
  );
  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const visibleUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  useEffect(() => setPage(1), [query, subscription]);

  const cycleSubscription = () => {
    setSubscription((value) =>
      value === "All" ? "Annual" : value === "Annual" ? "Monthly" : "All",
    );
  };

  return (
    <section className="table-panel">
      <div className="table-toolbar">
        <h3>{earnings ? "All Earning list" : "All Users list"}</h3>
        <div className="filter-pills">
          <button
            type="button"
            onClick={() =>
              document
                .querySelector<HTMLInputElement>('input[aria-label="Search"]')
                ?.focus()
            }
          >
            {earnings ? "User Name" : "Search Name"} <Search />
          </button>
          <button type="button" onClick={() => setAscending((value) => !value)}>
            Joining Date <ChevronDown />
          </button>
          <button type="button" onClick={cycleSubscription}>
            {subscription === "All" ? "Subscription" : subscription}{" "}
            <ChevronDown />
          </button>
          <button type="button" onClick={() => setAscending(false)}>
            Recent Created <ChevronDown />
          </button>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            {(earnings
              ? [
                  "Sl",
                  "User Image",
                  "Email",
                  "Subscription Type",
                  "Price",
                  "Expire Date",
                  "Action",
                ]
              : [
                  "Sl",
                  "User Name",
                  "Email",
                  "Phone Number",
                  "Address",
                  "Joining Date",
                  "Action",
                ]
            ).map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleUsers.map((user, i) => (
            <tr key={user[0]}>
              <td>{user[0]}</td>
              <td>
                <div className="user-cell">
                  <img src={avatars[i]} alt="" />
                  <strong>{earnings ? user[1].split(" ")[0] : user[1]}</strong>
                </div>
              </td>
              <td>{user[2]}</td>
              <td>{earnings ? (i % 2 ? "Monthly" : "Annual") : user[3]}</td>
              <td>{earnings ? `$${[10.99, 29.99, 49.99][i % 3]}` : user[4]}</td>
              <td>
                {user[5]}
                <br />
                <small>02:20PM</small>
              </td>
              <td>
                <Link
                  aria-label={`View ${user[1]}`}
                  className="row-action"
                  to={earnings ? `/earnings/${user[0]}` : `/users/${user[0]}`}
                >
                  <Eye />
                </Link>
              </td>
            </tr>
          ))}
          {!visibleUsers.length && (
            <tr>
              <td colSpan={7}>
                <EmptyState />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((value) => Math.max(1, value - 1))}
        >
          <ChevronLeft />
        </button>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map(
          (number) => (
            <button
              key={number}
              className={page === number ? "current" : ""}
              onClick={() => setPage(number)}
            >
              {number}
            </button>
          ),
        )}
        <button
          disabled={page === pageCount}
          onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}

function Users() {
  return (
    <>
      <PageHeading title="Manage User" />
      <BarChart />
      <UserTable />
    </>
  );
}

function DetailCard({ earnings = false }: { earnings?: boolean }) {
  const { id } = useParams();
  const user = users.find((item) => item[0] === id) ?? users[0];
  const [blocked, setBlocked] = useState(false);
  return (
    <div className="details-wrap">
      <Link to={earnings ? "/earnings" : "/users"} className="back">
        <ArrowLeft /> User Details
      </Link>
      <div className="identity-card">
        <div className="identity">
          <img src={avatars[(Number(user[0]) - 1) % avatars.length]} alt="" />
          <div>
            <strong>{user[1]}</strong>
            <span>{earnings ? "" : "Member"}</span>
          </div>
        </div>
        {!earnings && (
          <button
            className="danger-pill"
            onClick={() => setBlocked((value) => !value)}
          >
            {blocked ? "Unblock User" : "Block User"}
          </button>
        )}
      </div>
      {earnings ? (
        <section className="info-card">
          <h3>Subscription Buying Information</h3>
          <div className="info-grid three">
            {[
              ["Subscription Type", "Annual"],
              ["Buying date", "12/12/24"],
              ["Current Period Start Date", "15 Feb 2025"],
              ["Transaction ID", "TXN1454"],
              ["Withdraw Amount", "$120"],
              ["Subscription Expired", "15 Jan 2026"],
              ["Current Plan Meal ID", "Trial"],
              ["Card Type", "Visa/Pay"],
              ["Status", "Approved"],
            ].map(([a, b]) => (
              <div key={a}>
                <span>{a}</span>
                <strong className={a === "Status" ? "approved" : ""}>
                  {b}
                </strong>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          <div className="detail-stats">
            <div>
              <span>Active Meals</span>
              <strong>12</strong>
            </div>
            <div>
              <span>Total Spend</span>
              <strong>$ 350</strong>
            </div>
          </div>
          <section className="info-card">
            <h3>User Information</h3>
            <div className="info-grid">
              <div>
                <span>Email</span>
                <strong>{user[2]}</strong>
              </div>
              <div>
                <span>Phone number</span>
                <strong>{user[3]}</strong>
              </div>
              <div>
                <span>Joining Date</span>
                <strong>{user[5]}</strong>
              </div>
              <div>
                <span>Current plan</span>
                <strong className="approved">Annual</strong>
              </div>
            </div>
          </section>
        </>
      )}
      {earnings && (
        <div className="detail-stats">
          <div>
            <span>Active Meals</span>
            <strong>21</strong>
          </div>
          <div>
            <span>Total Spend</span>
            <strong>$ 350</strong>
          </div>
        </div>
      )}
    </div>
  );
}

type MealDraft = {
  name: string;
  type: string;
  duration: string;
  price: string;
};

function MealForm({
  draft,
  editing,
  error,
  onChange,
  onSubmit,
  onCancel,
}: {
  draft: MealDraft;
  editing: boolean;
  error: string;
  onChange: (field: keyof MealDraft, value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
}) {
  return (
    <form className="meal-form panel" onSubmit={onSubmit}>
      <div className="meal-form-top">
        <Link to="/meal-options" className="dark-button">
          + Add Content
        </Link>
        <button
          type="button"
          className="dark-button"
          onClick={() =>
            document.querySelector<HTMLInputElement>("#meal-name")?.focus()
          }
        >
          + Add Meal
        </button>
      </div>
      <h3>{editing ? "Edit meal" : "Add new meal"}</h3>
      <div className="meal-inputs">
        <label>
          Name
          <input
            id="meal-name"
            value={draft.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="e.g. Shakshuka"
            required
          />
        </label>
        <label>
          Type
          <select
            value={draft.type}
            onChange={(event) => onChange("type", event.target.value)}
          >
            <option>Dinner</option>
            <option>Lunch</option>
            <option>Breakfast</option>
          </select>
        </label>
        <label>
          Duration
          <input
            value={draft.duration}
            onChange={(event) => onChange("duration", event.target.value)}
            placeholder="25m"
            required
          />
        </label>
        <label>
          Price
          <input
            value={draft.price}
            onChange={(event) => onChange("price", event.target.value)}
            placeholder="e.g. $5.50"
            required
          />
        </label>
      </div>
      {error && (
        <p className="form-message error" role="alert">
          {error}
        </p>
      )}
      <div className="form-actions">
        <button className="dark-button" type="submit">
          {editing ? "Update meal" : "Save meal"}
        </button>
        {editing && (
          <button className="outline-button" type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Meals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [mealRows, setMealRows] = useStoredState(
    "sizzl-meals",
    meals.map((meal) => [...meal]),
  );
  const [category, setCategory] = useState("All");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<MealDraft>({
    name: "",
    type: "Dinner",
    duration: "",
    price: "",
  });
  const [error, setError] = useState("");

  const filteredMeals = mealRows.filter((meal) => {
    const matchesQuery = meal
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesQuery && (category === "All" || meal[1] === category);
  });

  const resetDraft = () => {
    setDraft({ name: "", type: "Dinner", duration: "", price: "" });
    setEditingIndex(null);
    setError("");
  };

  const saveMeal = (event: FormEvent) => {
    event.preventDefault();
    if (
      !draft.name.trim() ||
      !draft.duration.trim() ||
      !/^\$?\d+(\.\d{1,2})?$/.test(draft.price.trim())
    ) {
      setError("Enter a meal name, duration, and a valid price.");
      return;
    }
    const price = draft.price.startsWith("$") ? draft.price : `$${draft.price}`;
    const row = [
      draft.name.trim(),
      draft.type,
      "American",
      draft.duration.trim(),
      price,
      "ACTIVE",
      "18 - 45",
    ];
    setMealRows((current) =>
      editingIndex === null
        ? [row, ...current]
        : current.map((meal, index) => (index === editingIndex ? row : meal)),
    );
    resetDraft();
  };

  const editMeal = (meal: string[]) => {
    const index = mealRows.indexOf(meal);
    setEditingIndex(index);
    setDraft({
      name: meal[0],
      type: meal[1],
      duration: meal[3],
      price: meal[4],
    });
    setError("");
    document.querySelector<HTMLInputElement>("#meal-name")?.focus();
  };

  const updateSearch = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set("q", value.trim());
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <section className="meal-search-row">
        <label className="searchbox small">
          <Search />
          <input
            value={query}
            onChange={(event) => updateSearch(event.target.value)}
            onKeyDown={(event) => event.key === "Escape" && updateSearch("")}
            placeholder="Search meals..."
          />
          {query && (
            <button
              className="search-clear"
              onClick={() => updateSearch("")}
              type="button"
            >
              <X />
            </button>
          )}
        </label>
        <div className="meal-tabs">
          {["All", "Breakfast", "Lunch", "Dinner"].map((tab) => (
            <button
              key={tab}
              className={category === tab ? "active" : ""}
              onClick={() => setCategory(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>
      <MealForm
        draft={draft}
        editing={editingIndex !== null}
        error={error}
        onChange={(field, value) =>
          setDraft((current) => ({ ...current, [field]: value }))
        }
        onSubmit={saveMeal}
        onCancel={resetDraft}
      />
      <section className="table-panel meal-table">
        <table>
          <thead>
            <tr>
              {[
                "MEAL",
                "TYPE",
                "CUISINE",
                "TIME",
                "ESTIMATE",
                "STATUS",
                "AGE",
                "",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredMeals.map((m) => (
              <tr key={m[0]}>
                {m.map((v, i) => (
                  <td key={i}>
                    {i === 5 ? (
                      <span className={`status ${v.toLowerCase()}`}>{v}</span>
                    ) : i === 0 || i === 4 ? (
                      <strong>{v}</strong>
                    ) : (
                      v
                    )}
                  </td>
                ))}
                <td>
                  <button
                    aria-label={`Edit ${m[0]}`}
                    className="tiny-action"
                    onClick={() => editMeal(m)}
                  >
                    <Pencil />
                  </button>
                  <button
                    aria-label={`Delete ${m[0]}`}
                    className="tiny-action delete"
                    onClick={() =>
                      setMealRows((current) =>
                        current.filter((meal) => meal !== m),
                      )
                    }
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
            {!filteredMeals.length && (
              <tr>
                <td colSpan={8}>
                  <EmptyState label="No meals found" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}

function MealOptions() {
  const [diet, setDiet] = useStoredState("sizzl-diets", [
    "Vegetarian",
    "Vegan",
    "Halal",
    "Kosher",
    "Gluten-free",
    "Dairy-free",
    "Nut-free",
    "Pescatarian",
    "High-protein",
  ]);
  const [cuisine, setCuisine] = useStoredState("sizzl-cuisines", [
    "Italian",
    "Mexican",
    "Asian",
    "Mediterranean",
    "American",
    "Indian",
    "Middle Eastern",
    "British",
  ]);
  const addOption = (setter: Dispatch<SetStateAction<string[]>>) => {
    const value = window.prompt("Enter option name")?.trim();
    if (value)
      setter((current) =>
        current.some((item) => item.toLowerCase() === value.toLowerCase())
          ? current
          : [...current, value],
      );
  };
  return (
    <div className="options-page">
      <section className="option-card">
        <div>
          <h3>Dietary options</h3>
          <button className="add pale-green" onClick={() => addOption(setDiet)}>
            <Plus /> Add
          </button>
        </div>
        <div className="chips">
          {diet.map((x) => (
            <span key={x}>
              {x}
              <button
                aria-label={`Remove ${x}`}
                onClick={() =>
                  setDiet((current) => current.filter((item) => item !== x))
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>
      <section className="option-card">
        <div>
          <h3>Cuisine types</h3>
          <button
            className="add pale-blue"
            onClick={() => addOption(setCuisine)}
          >
            <Plus /> Add
          </button>
        </div>
        <div className="chips">
          {cuisine.map((x) => (
            <span key={x}>
              {x}
              <button
                aria-label={`Remove ${x}`}
                onClick={() =>
                  setCuisine((current) => current.filter((item) => item !== x))
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function SubscriptionOverview() {
  return (
    <>
      <PageHeading
        title="Subscription"
        action={
          <Link to="/subscription/plans" className="dark-button">
            Subscription plan
          </Link>
        }
      />
      <p className="subtitle">Manage your subscription plan.</p>
      <div className="subscription-stats">
        <div>
          <span>TOTAL</span>
          <strong>1309</strong>
          <small>Subscribers</small>
          <i />
        </div>
        <div>
          <span>ANNUAL</span>
          <strong>1309</strong>
          <small>Subscribers</small>
          <i className="blue" />
        </div>
        <div>
          <span>SUBSCRIPTION</span>
          <strong>$20</strong>
          <small>Monthly revenue</small>
          <i className="orange" />
        </div>
      </div>
      <BarChart title="Revenue Breakdown" />
    </>
  );
}

const features = [
  "Unlimited meal plans",
  "Nutrition tracking",
  "Advanced analytics",
  "Priority support",
];
type SubscriptionPlan = {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: "monthly" | "annual";
  features: string[];
};

const initialPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic Plan",
    description: "Everything you need to get started",
    price: "9.99",
    duration: "monthly",
    features,
  },
  {
    id: "premium",
    name: "Premium Plan",
    description: "Best for growing health programs",
    price: "29.99",
    duration: "monthly",
    features,
  },
];

function PlanCard({
  plan,
  onDelete,
}: {
  plan: SubscriptionPlan;
  onDelete: () => void;
}) {
  return (
    <div className="plan-card">
      <div className="plan-head">
        <span>{plan.name}</span>
        <p>{plan.description}</p>
      </div>
      <div className="plan-body">
        <strong>
          ${plan.price}
          <small>/{plan.duration === "annual" ? "Year" : "Month"}</small>
        </strong>
        <p>Every {plan.duration === "annual" ? "Annual" : "Monthly"} Billing</p>
        <div className="plan-actions">
          <Link to={`/subscription/edit/${plan.id}`}>Edit</Link>
          <button className="remove" onClick={onDelete}>
            Delete
          </button>
        </div>
        <h4>Features</h4>
        <ul>
          {plan.features.map((f) => (
            <li key={f}>✓ {f}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SubscriptionPlans() {
  const [plans, setPlans] = useStoredState("sizzl-plans", initialPlans);
  return (
    <>
      <PageHeading
        title="Subscription"
        action={
          <Link to="/subscription/create" className="dark-button">
            Create Subscription
          </Link>
        }
      />
      <p className="subtitle">Manage your Subscription.</p>
      <div className="plans-grid">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onDelete={() =>
              setPlans((current) =>
                current.filter((item) => item.id !== plan.id),
              )
            }
          />
        ))}
        {!plans.length && <EmptyState label="No subscription plans" />}
      </div>
    </>
  );
}

function SubscriptionForm({ edit = false }: { edit?: boolean }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [plans, setPlans] = useStoredState("sizzl-plans", initialPlans);
  const existing = edit
    ? (plans.find((plan) => plan.id === id) ?? plans[0])
    : undefined;
  const [name, setName] = useState(existing?.name ?? "");
  const [price, setPrice] = useState(existing?.price ?? "");
  const [duration, setDuration] = useState<"monthly" | "annual">(
    existing?.duration ?? "monthly",
  );
  const [description, setDescription] = useState(existing?.description ?? "");
  const [featureDraft, setFeatureDraft] = useState("");
  const [planFeatures, setPlanFeatures] = useState(existing?.features ?? []);
  // const addFeature = () => {
  //   const value = featureDraft.trim();
  //   if (
  //     !value ||
  //     planFeatures.some(
  //       (feature) => feature.toLowerCase() === value.toLowerCase(),
  //     )
  //   )
  //     return;
  //   setPlanFeatures((current) => [...current, value]);
  //   setFeatureDraft("");
  // };
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const normalizedPrice = price.replace(/^\$/, "").trim();
    if (!/^\d+(\.\d{1,2})?$/.test(normalizedPrice)) return;
    const plan: SubscriptionPlan = {
      id: existing?.id ?? `${Date.now()}`,
      name: name.trim(),
      price: normalizedPrice,
      duration,
      description: description.trim(),
      features: planFeatures,
    };
    setPlans((current) =>
      existing
        ? current.map((item) => (item.id === existing.id ? plan : item))
        : [...current, plan],
    );
    alert(
      edit
        ? "Subscription updated successfully."
        : "Subscription created successfully.",
    );
    navigate("/subscription/plans");
  };
  return (
    <div className="narrow-page">
      <Link to="/subscription/plans" className="back">
        <ArrowLeft /> {edit ? "Edit Subscription" : "Create Subscription"}
      </Link>
      <form className="form-card" onSubmit={handleSubmit}>
        <h3>{edit ? "Edit Subscription" : "Create Subscription"}</h3>
        <label>
          Subscription Plan Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Subscription Plan Name"
            required
          />
        </label>
        <label>
          Subscription Price
          <input
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            inputMode="decimal"
            placeholder="29.99"
            required
          />
        </label>
        <label>
          Duration
          <select
            value={duration}
            onChange={(event) =>
              setDuration(event.target.value as "monthly" | "annual")
            }
            required
          >
            <option value="monthly">Monthly</option>
            <option value="annual">Annual</option>
          </select>
        </label>
        <label className="feature-label">
          Features
          <select
            value={featureDraft}
            onChange={(event) => setFeatureDraft(event.target.value)}
          >
            <option value="">Select feature</option>
            {features.map((feature) => (
              <option key={feature}>{feature}</option>
            ))}
          </select>
        </label>
        <input
          value={planFeatures[0] ?? ""}
          onChange={(event) =>
            setPlanFeatures((current) => [
              event.target.value,
              ...current.slice(1),
            ])
          }
          placeholder="Nutrition tracker"
        />
        <input
          value={planFeatures[1] ?? ""}
          onChange={(event) =>
            setPlanFeatures((current) => [
              current[0] ?? "",
              event.target.value,
              ...current.slice(2),
            ])
          }
          placeholder="Advanced analytics"
        />
        {planFeatures.slice(2).map((feature, index) => (
          <input
            key={index + 2}
            value={feature}
            onChange={(event) =>
              setPlanFeatures((current) =>
                current.map((item, itemIndex) =>
                  itemIndex === index + 2 ? event.target.value : item,
                ),
              )
            }
            placeholder="Feature"
          />
        ))}
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description"
        />
        <button
          type="button"
          className="outline-button"
          onClick={() => setPlanFeatures((current) => [...current, ""])}
        >
          + Add More
        </button>
        <button type="submit" className="dark-button wide">
          {edit ? "Update" : "Create"}
        </button>
      </form>
    </div>
  );
}

function Earnings() {
  return (
    <>
      <PageHeading title="Earnings Overview" />
      <p className="subtitle">
        Track your revenue, profits, and financial metrics
      </p>
      <BarChart title="Revenue Breakdown" />
      <UserTable earnings />
    </>
  );
}

const settingsNav = [
  ["General", "/settings"],
  ["Edit Profile", "/settings/edit-profile"],
  ["Change Password", "/settings/password"],
  ["Notification", "/settings/notification"],
  ["Language", "/settings/language"],
  ["Privacy Policy", "/settings/privacy"],
  ["About Us", "/settings/about"],
  ["Contact Us", "/settings/contact"],
];

function SettingsLayout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  return (
    <>
      <PageHeading title="Settings" />
      <p className="subtitle">Update your photo and personal details here.</p>
      <div className="settings-layout">
        <nav className="settings-nav">
          {settingsNav.map(([label, to]) => (
            <Link
              className={
                loc.pathname === to ||
                (to !== "/settings" && loc.pathname.startsWith(to))
                  ? "active"
                  : ""
              }
              to={to}
              key={to}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="settings-body">{children}</div>
      </div>
    </>
  );
}

function GeneralSettings() {
  const { profile } = useAppData();
  return (
    <SettingsLayout>
      <section className="identity-card settings-identity">
        <div className="identity">
          <img src={avatars[0]} alt="" />
          <div>
            <strong>{profile.name}</strong>
            <span>{profile.role}</span>
          </div>
        </div>
        <Link to="/settings/edit-profile" className="dark-button">
          Edit Profile
        </Link>
      </section>
      <section className="info-card">
        <h3>Personal information</h3>
        <div className="info-grid three">
          <div>
            <span>Name</span>
            <strong>{profile.name}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{profile.email}</strong>
          </div>
          <div>
            <span>Phone Number</span>
            <strong>{profile.phone}</strong>
          </div>
          <div>
            <span>Role</span>
            <strong>{profile.role}</strong>
          </div>
          <div>
            <span>Member Since</span>
            <strong>{profile.memberSince}</strong>
          </div>
          <div>
            <span>Address</span>
            <strong>{profile.address}</strong>
          </div>
        </div>
      </section>
    </SettingsLayout>
  );
}

function BasicSettingsForm({
  type,
}: {
  type: "profile" | "password" | "language";
}) {
  const navigate = useNavigate();
  const { profile, setProfile, preferences, setPreferences } = useAppData();
  const [profileDraft, setProfileDraft] = useState(profile);
  const [language, setLanguage] = useState(preferences.language);
  const [timezone, setTimezone] = useState(preferences.timezone);
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (type === "profile") {
      setProfile(profileDraft);
    }
    if (type === "language") {
      setPreferences((current) => ({ ...current, language, timezone }));
    }
    if (type === "password") {
      if (passwords.next.length < 8) {
        setError("New password must be at least 8 characters.");
        return;
      }
      if (passwords.next !== passwords.confirm) {
        setError("New passwords do not match.");
        return;
      }
    }
    alert("Changes saved successfully.");
    navigate("/settings");
  };
  return (
    <SettingsLayout>
      <form className="form-card settings-form" onSubmit={handleSubmit}>
        <h3>
          {type === "profile"
            ? "Edit Profile"
            : type === "password"
              ? "Change Password"
              : "Change Language"}
        </h3>
        {type === "profile" && (
          <>
            <label>
              Full Name
              <input
                value={profileDraft.name}
                onChange={(event) =>
                  setProfileDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={profileDraft.email}
                onChange={(event) =>
                  setProfileDraft((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              Phone
              <input
                value={profileDraft.phone}
                onChange={(event) =>
                  setProfileDraft((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                required
              />
            </label>
            <label>
              Address
              <input
                value={profileDraft.address}
                onChange={(event) =>
                  setProfileDraft((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                required
              />
            </label>
          </>
        )}
        {type === "password" && (
          <>
            <label>
              Current Password
              <input
                type="password"
                value={passwords.current}
                onChange={(event) =>
                  setPasswords((current) => ({
                    ...current,
                    current: event.target.value,
                  }))
                }
                placeholder="••••••••"
                required
              />
            </label>
            <label>
              New Password
              <input
                type="password"
                value={passwords.next}
                onChange={(event) =>
                  setPasswords((current) => ({
                    ...current,
                    next: event.target.value,
                  }))
                }
                placeholder="••••••••"
                required
              />
            </label>
            <label>
              Confirm Password
              <input
                type="password"
                value={passwords.confirm}
                onChange={(event) =>
                  setPasswords((current) => ({
                    ...current,
                    confirm: event.target.value,
                  }))
                }
                placeholder="••••••••"
                required
              />
            </label>
          </>
        )}
        {type === "language" && (
          <>
            <label>
              Change Language
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                required
              >
                <option>English (UK)</option>
                <option>English (US)</option>
                <option>বাংলা</option>
              </select>
            </label>
            <label>
              Time Zone
              <select
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                required
              >
                <option>GMT +06:00</option>
                <option>GMT +00:00</option>
                <option>GMT -05:00</option>
              </select>
            </label>
          </>
        )}
        {error && (
          <p className="form-message error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="dark-button wide">
          {type === "language" ? "Save Setting" : "Save Changes"}
        </button>
      </form>
    </SettingsLayout>
  );
}

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-label={label}
      aria-checked={on}
      onClick={onChange}
      className={`toggle ${on ? "on" : ""}`}
    >
      <span />
    </button>
  );
}

function NotificationSettings() {
  const navigate = useNavigate();
  const { preferences, setPreferences } = useAppData();
  const [notifications, setNotifications] = useState(preferences.notifications);
  const toggle = (index: number) =>
    setNotifications((current) =>
      current.map((value, itemIndex) => (itemIndex === index ? !value : value)),
    );
  const handleSave = () => {
    setPreferences((current) => ({ ...current, notifications }));
    alert("Notification settings saved successfully.");
    navigate("/settings");
  };
  return (
    <SettingsLayout>
      <section className="notification-card">
        <div>
          <h3>Security Notification</h3>
          <p>Receive emails about your account security.</p>
        </div>
        <Toggle
          label="Security notifications"
          on={notifications[0]}
          onChange={() => toggle(0)}
        />
        <div>
          <h3>New Subscription</h3>
          <p>Notify me when a customer subscribes.</p>
        </div>
        <Toggle
          label="New subscription notifications"
          on={notifications[1]}
          onChange={() => toggle(1)}
        />
        <div>
          <h3>Meal Updates</h3>
          <p>Receive updates about meal content.</p>
        </div>
        <Toggle
          label="Meal update notifications"
          on={notifications[2]}
          onChange={() => toggle(2)}
        />
        <div>
          <h3>Marketing emails</h3>
          <p>Receive product news and offers.</p>
        </div>
        <Toggle
          label="Marketing emails"
          on={notifications[3]}
          onChange={() => toggle(3)}
        />
        <button className="dark-button" onClick={handleSave}>
          Save changes
        </button>
      </section>
    </SettingsLayout>
  );
}

function TextSettings({
  kind,
  edit = false,
}: {
  kind: "privacy" | "about";
  edit?: boolean;
}) {
  const navigate = useNavigate();
  const { privacy, setPrivacy, about, setAbout } = useAppData();
  const copy = initialPageCopy[kind];
  const currentValue = kind === "privacy" ? privacy : about;
  const [val, setVal] = useState(currentValue);

  const handleUpdate = () => {
    if (!val.trim()) return;
    if (kind === "privacy") setPrivacy(val.trim());
    else setAbout(val.trim());
    alert(`${copy.title} updated successfully.`);
    navigate(`/settings/${kind}`);
  };

  return (
    <SettingsLayout>
      <section className={`text-settings ${edit ? "editing" : ""}`}>
        <h3>{edit ? `Edit ${copy.title}` : copy.title}</h3>
        <div className="editor-bar">
          {edit && (
            <>
              <b>B</b>
              <i>I</i>
              <u>U</u>
              <span>≡</span>
              <span>☷</span>
            </>
          )}
        </div>
        {edit ? (
          <textarea
            value={val}
            onChange={(e) => setVal(e.target.value)}
            required
          />
        ) : (
          <p>{currentValue}</p>
        )}
        {edit ? (
          <button type="button" onClick={handleUpdate} className="dark-button">
            Update
          </button>
        ) : (
          <Link to={`/settings/${kind}/edit`} className="dark-button">
            Edit
          </Link>
        )}
      </section>
    </SettingsLayout>
  );
}

function ContactSettings({ edit = false }: { edit?: boolean }) {
  const navigate = useNavigate();
  const { contact, setContact } = useAppData();
  const [email, setEmail] = useState(contact.email);
  const [phone, setPhone] = useState(contact.phone);
  const [address, setAddress] = useState(contact.address);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setContact((current) => ({
      ...current,
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    }));
    alert("Contact settings saved successfully.");
    navigate("/settings/contact");
  };

  return (
    <SettingsLayout>
      <section className="contact-card">
        <h3>{edit ? "Edit Contact Info" : "Contact Us"}</h3>
        {edit ? (
          <form onSubmit={handleSubmit}>
            <label>
              Mail address
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Phone Number
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </label>
            <label>
              Address
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="dark-button wide">
              Save contact info
            </button>
          </form>
        ) : (
          <div className="contact-info">
            <span>Mail</span>
            <strong>{contact.email}</strong>
            <span>Phone number</span>
            <strong>{contact.phone}</strong>
            <span>Address</span>
            <strong>{contact.address}</strong>
            <Link className="dark-button wide" to="/settings/contact/edit">
              Edit
            </Link>
          </div>
        )}
      </section>
    </SettingsLayout>
  );
}

export default function App() {
  return (
    <AppDataProvider>
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
            <Route
              path="/subscription/edit/:id"
              element={<SubscriptionForm edit />}
            />
            <Route
              path="/subscription/edit"
              element={<Navigate to="/subscription/plans" replace />}
            />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/earnings/:id" element={<DetailCard earnings />} />
            <Route path="/settings" element={<GeneralSettings />} />
            <Route
              path="/settings/edit-profile"
              element={<BasicSettingsForm type="profile" />}
            />
            <Route
              path="/settings/password"
              element={<BasicSettingsForm type="password" />}
            />
            <Route
              path="/settings/notification"
              element={<NotificationSettings />}
            />
            <Route
              path="/settings/language"
              element={<BasicSettingsForm type="language" />}
            />
            <Route
              path="/settings/privacy"
              element={<TextSettings kind="privacy" />}
            />
            <Route
              path="/settings/privacy/edit"
              element={<TextSettings kind="privacy" edit />}
            />
            <Route
              path="/settings/about"
              element={<TextSettings kind="about" />}
            />
            <Route
              path="/settings/about/edit"
              element={<TextSettings kind="about" edit />}
            />
            <Route path="/settings/contact" element={<ContactSettings />} />
            <Route
              path="/settings/contact/edit"
              element={<ContactSettings edit />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </AppDataProvider>
  );
}
