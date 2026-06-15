import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Settings, 
  LogOut, 
  Building2, 
  Factory, 
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Cpu
} from 'lucide-react';
import { MOCK_PHARMA, MOCK_PLANTS, MOCK_EQUIPMENT } from '@/constants';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import DashboardHeader from '@/apps/shared/components/DashboardHeader';

const CaaldocDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const stats = [
    { label: 'Total Assets', value: '1,284', icon: Cpu, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Workflows', value: '42', icon: ClipboardList, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pending Certs', value: '12', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completed Today', value: '8', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <img
            src="/images/vaalpro-logo.png"
            alt="Vaalpro"
            className="h-auto w-36"
          />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab('workflows')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'workflows' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ClipboardList size={20} />
            <span>Workflows</span>
          </button>
          <button 
            onClick={() => setActiveTab('hierarchy')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'hierarchy' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Building2 size={20} />
            <span>Hierarchy</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader />

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Caaldoc Dashboard Overview</h2>
                <p className="text-slate-500">Welcome back, here's what's happening today.</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2">
                <ClipboardList size={18} />
                New Workflow
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                </motion.div>
              ))}
            </div>

            {/* Main Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Hierarchy Explorer & Workflows */}
              <div className="lg:col-span-2 space-y-6">
                {/* Active Workflows Section */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <ClipboardList size={20} className="text-blue-600" />
                      Active Workflows
                    </h3>
                    <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {[
                        { id: 'WF-001', title: 'HVAC Validation - Block A', progress: 65, status: 'Active', deadline: '2 days left' },
                        { id: 'WF-002', title: 'Autoclave Sterilization Test', progress: 30, status: 'Active', deadline: '5 days left' },
                      ].map((wf) => (
                        <div key={wf.id} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-all group">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md mb-1 inline-block">{wf.id}</span>
                              <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{wf.title}</h4>
                            </div>
                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                              <Clock size={12} />
                              {wf.deadline}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${wf.progress}%` }}
                                className="h-full bg-blue-600 rounded-full"
                              />
                            </div>
                            <span className="text-sm font-bold text-slate-700">{wf.progress}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Building2 size={20} className="text-blue-600" />
                      Organizational Hierarchy
                    </h3>
                    <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {MOCK_PHARMA.map((org, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                              <Building2 size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{org.name}</h4>
                              <p className="text-xs text-slate-500">{org.location}</p>
                            </div>
                          </div>
                          <ChevronRight size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Plants */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Factory size={20} className="text-blue-600" />
                      Plant Status
                    </h3>
                    <button className="text-blue-600 text-sm font-semibold hover:underline">View All</button>
                  </div>
                  <div className="p-6 space-y-4">
                    {MOCK_PLANTS.slice(0, 3).map((plant, idx) => (
                      <div key={idx} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${plant.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                            <Factory size={18} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm">{plant.name}</h4>
                            <p className="text-xs text-slate-500">{plant.id}</p>
                          </div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${plant.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {plant.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Equipment: {plant.equipmentCount}</span>
                          <span className="text-slate-500">Compliance: {plant.complianceRate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                  <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
                  <p className="text-sm text-blue-100 mb-4">Common validation tasks</p>
                  <div className="space-y-2">
                    <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-left text-sm font-medium transition-all flex items-center gap-2">
                      <ClipboardList size={16} />
                      Start New Validation
                    </button>
                    <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-left text-sm font-medium transition-all flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Review Pending Items
                    </button>
                    <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-xl text-left text-sm font-medium transition-all flex items-center gap-2">
                      <AlertCircle size={16} />
                      View Alerts
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaaldocDashboardPage;
