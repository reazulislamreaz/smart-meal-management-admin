import { useState, useEffect, useMemo, type ReactNode } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppData } from "@/context/AppDataContext";
import { avatars, nav } from "@/data/adminData";
import notificationArt from "@/assets/hero.png";

export function Shell({ children, onLogout }: { children: ReactNode; onLogout?: () => void }) {
  const { profile } = useAppData();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 900);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const query = searchParams.get("q") ?? "";

  const active = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const searchPlaceholder = useMemo(() => {
    if (location.pathname.startsWith("/meals")) return "Search meals...";
    if (location.pathname.startsWith("/subscription")) return "Search plans...";
    if (location.pathname.startsWith("/earnings")) return "Search earnings...";
    if (location.pathname.startsWith("/users")) return "Search users...";
    return "Search name";
  }, [location.pathname]);

  useEffect(() => {
    setSidebarOpen(window.innerWidth > 900);
    setProfileOpen(false);
    setNotificationsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!profileOpen && !notificationsOpen) return;
    const closePopovers = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.closest(".profile-button") ||
        target.closest(".profile-popover") ||
        target.closest(".icon-button") ||
        target.closest(".notification-popover")
      )
        return;
      setProfileOpen(false);
      setNotificationsOpen(false);
    };
    document.addEventListener("mousedown", closePopovers);
    return () => document.removeEventListener("mousedown", closePopovers);
  }, [profileOpen, notificationsOpen]);

  const handleSearchChange = (val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val) next.set("q", val);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const clearSearch = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next, { replace: true });
  };

  const logout = () => {
    setProfileOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      navigate("/");
    }
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
              placeholder={searchPlaceholder}
              value={query}
              onChange={(event) => handleSearchChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") clearSearch();
                if (event.key === "Enter") {
                  event.preventDefault();
                }
              }}
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                aria-label="Clear search"
                onClick={clearSearch}
              >
                {/* <X /> */}
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
        <main className="content page-enter">{children}</main>
      </section>
    </div>
  );
}
export default Shell;
