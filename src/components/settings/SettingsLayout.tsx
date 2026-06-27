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
      <p className="m-0 mb-[18px] text-[#71757b] text-[16px]">
        Manage your account preferences and settings
      </p>
      <div className="grid grid-cols-[150px_minmax(0,1fr)] gap-[22px] mt-[18px] items-start max-[900px]:grid-cols-[130px_minmax(0,1fr)] max-[900px]:gap-[14px] max-[620px]:grid-cols-1">
        <nav className="flex flex-col gap-[5px] max-[620px]:flex-row max-[620px]:overflow-x-auto">
          {settingsNav.map(([label, to]) => {
            const active =
              loc.pathname === to ||
              (to === "/settings" && loc.pathname === "/settings/edit-profile") ||
              (to !== "/settings" && loc.pathname.startsWith(to));
            return (
              <Link
                className={`px-[10px] py-2 rounded-[4px] text-[12px] transition-[background,color] duration-150 max-[620px]:whitespace-nowrap ${active ? "text-white bg-[#17181a]" : "hover:bg-[#e7e8eb]"}`}
                to={to}
                key={to}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="max-w-[850px] animate-[fadeIn_.22s_ease]">{children}</div>
      </div>
    </>
  );
}
export default SettingsLayout;
