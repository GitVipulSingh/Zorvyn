import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Wallet,
  TrendingUp,
  Target,
  BarChart3,
  Activity,
  X,
} from "lucide-react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { getCurrencySymbol } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ONBOARDING_KEY = "zorvyn_onboarding_complete";

export function useOnboarding() {
  const [show, setShow] = useState(
    () => localStorage.getItem(ONBOARDING_KEY) !== "true"
  );

  const complete = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShow(false);
  };

  return { show, complete };
}

// ─── Step data ────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Wallet,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "Salary Tracking",
    desc: "Log where every rupee goes so you stop wondering where it went.",
  },
  {
    icon: BarChart3,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    title: "50/30/20 Guide",
    desc: "A proven rule: 50% needs, 30% wants, 20% savings — auto-visualized.",
  },
  {
    icon: Target,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    title: "Goal Builder",
    desc: "Set savings goals like an emergency fund and track your progress.",
  },
  {
    icon: Activity,
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    title: "Wellness Score",
    desc: "Your personal financial pulse — based on how mindfully you spend.",
  },
];

const APP_TOUR = [
  { icon: Wallet, label: "Dashboard", desc: "Your financial snapshot at a glance — budget, mood, and recent activity.", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { icon: Activity, label: "Activity", desc: "Browse and search all your transactions. Add intents to each expense.", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { icon: Target, label: "Goals", desc: "Create savings milestones. Use Quick Start to set up an emergency fund instantly.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  { icon: BarChart3, label: "Insights", desc: "See your 50/30/20 breakdown and your Financial Wellness Score.", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
];

// ─── Step components ───────────────────────────────────────────────────────────

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-[0_0_30px_rgba(59,130,246,0.4)] mb-6">
        <Wallet className="h-8 w-8 text-white" strokeWidth={2} />
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 mb-4">
        <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">
          Designed for First-Time Earners
        </span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
        Welcome to Zorvyn
      </h2>
      <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-8">
        Your personal finance companion built for professionals managing their first salary. 
        Set up takes less than a minute.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
        {FEATURES.map(({ icon: Icon, color, bg, title, desc }) => (
          <div key={title} className={`flex gap-3 rounded-2xl border p-4 text-left ${bg}`}>
            <div className={`mt-0.5 flex-shrink-0 ${color}`}>
              <Icon className="h-4 w-4" strokeWidth={2} />
            </div>
            <div>
              <p className={`text-xs font-bold ${color} mb-0.5`}>{title}</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onNext} className="w-full sm:w-auto gap-2 px-8">
        Get Started <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function StepSetup({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { user, updateUser } = useFinanceStore();
  const symbol = getCurrencySymbol(user.currency);
  const [name, setName] = useState(user.name === "Friend" ? "" : user.name);
  const [income, setIncome] = useState(user.monthlyIncome?.toString() || "");
  const [budget, setBudget] = useState(
    user.monthlyBudget === 3000 ? "" : user.monthlyBudget.toString()
  );
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    const parsedBudget = Number(budget);
    if (!budget || isNaN(parsedBudget) || parsedBudget <= 0) {
      setError("Please enter your monthly spending budget.");
      return;
    }
    const parsedIncome = Number(income);
    updateUser({
      name: name.trim() || "Friend",
      monthlyBudget: parsedBudget,
      monthlyIncome: income && !isNaN(parsedIncome) && parsedIncome > 0 ? parsedIncome : undefined,
    });
    setError(null);
    onNext();
  };

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Set Up Your Profile</h2>
      <p className="text-sm text-gray-400 mb-6">
        This helps Zorvyn give you personalized guidance. You can change these anytime in Settings.
      </p>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="ob-name">Your first name</Label>
          <Input
            id="ob-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya"
            maxLength={40}
            autoFocus
          />
          <p className="text-[11px] text-gray-500">We'll use this to greet you on the dashboard.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ob-income">Monthly take-home salary</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{symbol}</span>
            <Input
              id="ob-income"
              type="number"
              className="pl-7"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              min="0"
              placeholder="e.g. 45000"
            />
          </div>
          <p className="text-[11px] text-gray-500">
            Used to power your 50/30/20 budget breakdown on the Insights page.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ob-budget">
            Monthly spending limit <span className="text-rose-400 font-bold">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{symbol}</span>
            <Input
              id="ob-budget"
              type="number"
              className="pl-7"
              value={budget}
              onChange={(e) => { setBudget(e.target.value); setError(null); }}
              min="1"
              placeholder="e.g. 30000"
            />
          </div>
          <p className="text-[11px] text-gray-500">
            The max you want to spend each month. Zorvyn uses this to track your Money Mood.
          </p>
        </div>

        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="ghost" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={handleNext} className="flex-1 gap-2">
          Continue <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function StepTour({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Quick App Tour</h2>
      <p className="text-sm text-gray-400 mb-6">
        Here's what each section of Zorvyn does.
      </p>

      <div className="space-y-3">
        {APP_TOUR.map(({ icon: Icon, label, desc, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`flex items-start gap-4 rounded-2xl border p-4 ${bg}`}
          >
            <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} strokeWidth={2} />
            </div>
            <div>
              <p className={`text-sm font-bold ${color}`}>{label}</p>
              <p className="text-[12px] text-gray-400 leading-relaxed mt-0.5">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <Button variant="ghost" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={onNext} className="flex-1 gap-2">
          Let's Go <CheckCircle2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function StepDone({ onComplete }: { onComplete: () => void }) {
  const { user } = useFinanceStore();
  const firstName = user.name.split(" ")[0] || "there";

  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-6"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-400" strokeWidth={1.5} />
      </motion.div>

      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
        You're all set, {firstName}!
      </h2>
      <p className="text-sm text-gray-400 leading-relaxed max-w-sm mb-8">
        Your financial journey starts now. Log your first expense, set up an Emergency Fund goal, 
        and check your Wellness Score after a week of tracking.
      </p>

      <div className="grid grid-cols-3 gap-3 w-full mb-8">
        {[
          { step: "1", label: "Log an expense", sub: "Activity → Add Expense" },
          { step: "2", label: "Set a goal", sub: "Goals → Quick Start" },
          { step: "3", label: "Check Insights", sub: "See your 50/30/20" },
        ].map(({ step, label, sub }) => (
          <div key={step} className="rounded-2xl border border-white/5 bg-white/[0.03] p-3 text-center">
            <p className="text-xs font-bold text-blue-400 mb-1">Step {step}</p>
            <p className="text-[11px] font-semibold text-white">{label}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <Button onClick={onComplete} className="w-full sm:w-auto gap-2 px-8">
        Open Dashboard <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Progress dots ─────────────────────────────────────────────────────────────

function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < step ? "bg-blue-400 w-6" : i === step ? "bg-blue-400 w-4" : "bg-white/10 w-2"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

const STEPS = ["welcome", "setup", "tour", "done"] as const;

export function OnboardingModal({ onComplete }: Props) {
  const [step, setStep] = useState(0);

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const stepKey = STEPS[step];
  const showClose = step < STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        key="modal"
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0c111d] shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <ProgressDots step={step} total={STEPS.length} />
          {showClose && (
            <button
              onClick={onComplete}
              aria-label="Skip onboarding"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all duration-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Step content */}
        <div className="px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              {stepKey === "welcome" && <StepWelcome onNext={next} />}
              {stepKey === "setup" && <StepSetup onNext={next} onBack={back} />}
              {stepKey === "tour" && <StepTour onNext={next} onBack={back} />}
              {stepKey === "done" && <StepDone onComplete={onComplete} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
