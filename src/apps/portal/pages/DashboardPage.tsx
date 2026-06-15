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

const DashboardPage: React.FC = () => {
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
        <div className="p-6 border-b border-slate-100">
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
                <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
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
                    <div className="space-y-4">
                      {MOCK_PHARMA.map(pharma => (
                        <div key={pharma.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <Building2 size={18} className="text-slate-600" />
                              </div>
                              <span className="font-bold text-slate-800">{pharma.name}</span>
                            </div>
                            <ChevronRight size={16} className="text-slate-400" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-4">
                            {MOCK_PLANTS.filter(p => p.pharmaId === pharma.id).map(plant => (
                              <div key={plant.id} className="bg-white p-3 rounded-lg border border-slate-100 flex items-center gap-3 shadow-sm">
                                <Factory size={16} className="text-blue-500" />
                                <span className="text-sm font-medium text-slate-700">{plant.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Equipment Status */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                      <Cpu size={20} className="text-blue-600" />
                      Recent Equipment Monitoring
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 font-semibold">Equipment</th>
                          <th className="px-6 py-4 font-semibold">Location</th>
                          <th className="px-6 py-4 font-semibold">Type</th>
                          <th className="px-6 py-4 font-semibold">Status</th>
                          <th className="px-6 py-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {MOCK_EQUIPMENT.map(eq => (
                          <tr key={eq.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                                  <Cpu size={16} className="text-slate-600" />
                                </div>
                                <span className="font-semibold text-slate-800">{eq.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                              Room 101, Block A
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{eq.type}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                eq.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                eq.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {eq.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm">Details</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Recent Activity</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {[
                      { user: 'Field Worker A', action: 'completed reading for AHU-01', time: '12 mins ago', icon: CheckCircle2, color: 'text-emerald-500' },
                      { user: 'System', action: 'generated certificate for Incubator-05', time: '1 hour ago', icon: ClipboardList, color: 'text-blue-500' },
                      { user: 'Admin', action: 'assigned workflow to Field Worker B', time: '3 hours ago', icon: Clock, color: 'text-slate-500' },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className={`mt-1 ${item.color}`}>
                          <item.icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-800">
                            <span className="font-bold">{item.user}</span> {item.action}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-200">
                  <h4 className="font-bold text-lg mb-2">Compliance Alert</h4>
                  <p className="text-blue-100 text-sm mb-4">3 AHU units in Plant 1 are due for re-certification in the next 7 days.</p>
                  <button className="w-full bg-white text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-50 transition-all">
                    Schedule Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
