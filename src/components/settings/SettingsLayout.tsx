import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";

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

export function SettingsLayout({ children }: { children: ReactNode }) {
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
export default SettingsLayout;
