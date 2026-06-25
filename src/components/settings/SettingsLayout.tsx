import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";

const settingsNav = [
  ["My profile", "/settings"],
  ["App Configuration", "/settings/config"],
  ["Privacy Policy", "/settings/privacy"],
  ["About us", "/settings/about"],
  ["Change Password", "/settings/password"],
  ["Contact us", "/settings/contact"],
];

export function SettingsLayout({ children }: { children: ReactNode }) {
  const loc = useLocation();
  return (
    <>
      <PageHeading title="Settings" />
      <p className="subtitle">Manage your account preferences and settings</p>
      <div className="settings-layout">
        <nav className="settings-nav">
          {settingsNav.map(([label, to]) => (
            <Link
              className={
                loc.pathname === to ||
                (to === "/settings" && loc.pathname === "/settings/edit-profile") ||
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
export default SettingsLayout;
