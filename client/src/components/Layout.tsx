import { useEffect, useRef } from "react";
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
import { useFinanceStore } from "@/store/useFinanceStore";

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
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
          isActive
            ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5"
            : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              "h-5 w-5 flex-shrink-0 transition-colors duration-300",
              isActive ? "text-violet-400" : "text-gray-500 hover:text-violet-400"
            )}
            strokeWidth={isActive ? 2.5 : 2}
          />
          <span className="tracking-wide">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export function Layout() {
  const initialize = useFinanceStore((s) => s.initialize);
  const didInit = useRef(false);

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      initialize();
    }
  }, [initialize]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 glass-panel-elevated m-6 rounded-3xl h-[calc(100vh-3rem)] sticky top-6 z-40">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            <Wallet className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white text-xl tracking-wide">Zorvyn</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map(({ to, icon, label }) => (
            <NavItem key={to} to={to} icon={icon} label={label} end={to === "/"} />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-white/5">
          <p className="text-xs text-gray-500 tracking-wider uppercase font-medium">Personal Finance</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:py-6 lg:pr-6 lg:pl-2">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-white/10 glass-panel-elevated rounded-b-2xl px-5 py-4 mx-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 shadow-[0_0_15px_rgba(139,92,246,0.4)]">
              <Wallet className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-white text-lg tracking-wide">Zorvyn</span>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-4 py-8 lg:px-6 pb-28 lg:pb-8">
            <Outlet />
          </div>
        </main>

        {/* Bottom nav — mobile only */}
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 z-50 glass-panel-elevated rounded-2xl border border-white/10">
          <div className="flex items-center justify-around px-2 py-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 text-[10px] uppercase tracking-wider font-semibold",
                    isActive ? "text-white bg-white/10" : "text-gray-500 hover:text-white"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={cn("h-5 w-5 mb-0.5 transition-colors duration-300", isActive ? "text-violet-400" : "")}
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
