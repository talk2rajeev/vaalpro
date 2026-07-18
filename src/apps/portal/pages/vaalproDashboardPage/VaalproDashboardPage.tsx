import { useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ClipboardCheck,
  FileCheck2,
  Gauge,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import DashboardHeader from '@/apps/shared/components/DashboardHeader';


type AppConfig = {
  id: 'vaaldoc' | 'caaldoc' | 'qdoc';
  title: string;
  subtitle: string;
  description: string;
  icon: typeof FileCheck2;
  route: string;
  image: string;
  gradient: string;
};

const apps: AppConfig[] = [
  {
    id: 'caaldoc',
    title: 'Caaldoc',
    subtitle: 'Calibration Operations Hub',
    description:
      'Automated calibration and maintenance workflows. Ensure instrumentation meets global regulatory compliance standards.',
    icon: Gauge,
    route: '/caaldoc/dashboard',
    image: '/images/caaldoc-card.png',
    gradient: 'from-[#0F766E] via-[#11847D] to-[#21A99F]',
  },
  {
    id: 'vaaldoc',
    title: 'Vaaldoc',
    subtitle: 'Validation Lifecycle Manager',
    description:
      'End-to-end validation lifecycle management. Track document approvals and equipment calibration schedules in real time.',
    icon: FileCheck2,
    route: '/vaaldoc',
    image: '/images/vaaldoc-card.png',
    gradient: 'from-[#163D73] via-[#1E4E8C] to-[#2E6FB5]',
  },
  {
    id: 'qdoc',
    title: 'QDoc',
    subtitle: 'Quality Document & Audit SOPs',
    description:
      'Quality management for protocol generation and peer-review audits. Centralize QMS and FDA-ready assets.',
    icon: ClipboardCheck,
    route: '/dashboard',
    image: '/images/qdoc.png',
    gradient: 'from-[#B96800] via-[#E88500] to-[#F6A92D]',
  },
];

const VaalproDashboardPage = () => {
  const searchQuery = '';
  const navigate = useNavigate();

  const filteredApps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return apps;
    }

    return apps.filter((app) =>
      [app.title, app.subtitle, app.description].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased">
      <DashboardHeader showLogo />
      
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <section className="mb-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-[#E88500]">
                Enterprise Compliance Gateway
              </p>
              <h1 className="text-4xl font-extrabold leading-none tracking-tight text-[#1E4E8C] sm:text-5xl">
                Welcome back, Rajeev
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg"
            >
              Your enterprise compliance gateway is operational. Monitor validation
              workflows, manage laboratory inventory, and generate regulatory reports
              for industrial precision.
            </motion.p>
          </div>
        </section>

        

        <section>
          {searchQuery && (
            <div className="mb-6 flex justify-end">
              <span className="text-xs font-semibold text-[#1E4E8C]">
                Filtered: {filteredApps.length} of {apps.length} apps
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredApps.map((app, index) => (
                <motion.article
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.08, duration: 0.35 }}
                  className="flex min-h-[440px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className={`relative aspect-[3/2] overflow-hidden bg-gradient-to-br ${app.gradient}`}>
                    <img src={app.image} alt={app.title} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.16),transparent_45%)]" />
                    <div className="relative flex h-full flex-col justify-between p-6 text-white">
                      <app.icon className="h-12 w-12" />
                      <div className='flex flex-col items-center justify-center bg-black/50'>
                        <h3 className="mt-2 text-3xl font-black tracking-tight">{app.title}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between space-y-6 p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#E88500]">
                          {app.subtitle}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                          {app.description}
                        </p>
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(app.route)}
                      className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#1E4E8C] px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition-all duration-300 hover:bg-blue-800"
                    >
                      <span>Enter App</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VaalproDashboardPage;
