import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  Target,
  BarChart3,
  Settings,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/activity", icon: Activity, label: "Activity" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/insights", icon: BarChart3, label: "Insights" },
  { to: "/profile", icon: Settings, label: "Settings" },
];

function NavItem({
  to,
  icon: Icon,
  label,
  end,
}: {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
          isActive
            ? "bg-violet-50 text-violet-700"
            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "h-[18px] w-[18px] flex-shrink-0",
              isActive ? "text-violet-600" : "text-gray-400"
            )}
            strokeWidth={isActive ? 2.5 : 2}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}

export function Layout() {
  return (
    <div className="flex min-h-screen bg-[#f9f9fb]">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-gray-100 bg-white sticky top-0 h-screen">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
            <Wallet className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-gray-900 tracking-tight">Zorvyn</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ to, icon, label }) => (
            <NavItem key={to} to={to} icon={icon} label={label} end={to === "/"} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">Personal Finance</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
              <Wallet className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-gray-900">Zorvyn</span>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8 pb-24 lg:pb-8">
            <Outlet />
          </div>
        </main>

        {/* Bottom nav — mobile only */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors text-[10px] font-medium",
                    isActive ? "text-violet-600" : "text-gray-400"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={isActive ? 2.5 : 2}
                    />
                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
