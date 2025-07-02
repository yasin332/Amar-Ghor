import { useState } from 'react'
import { motion } from 'framer-motion'

const MaintenanceHomepage = ({ language = 'en' }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null)

  const translations = {
    en: {
      welcome: "Welcome back",
      teamName: "Ahmed Maintenance Team",
      subtitle: "Keep properties in perfect condition",
      quickActions: "Quick Actions",
      viewWorkOrders: "View Work Orders",
      updateSchedule: "Update Schedule",
      reportCompletion: "Report Completion",
      requestSupplies: "Request Supplies",
      overview: "Overview",
      workOrders: "Work Orders",
      schedule: "Schedule",
      reports: "Reports",
      settings: "Settings",
      totalAssigned: "Total Assigned",
      completedToday: "Completed Today", 
      pendingTasks: "Pending Tasks",
      upcomingJobs: "Upcoming Jobs",
      recentActivity: "Recent Activity",
      workOrderList: "Work Order List",
      priority: "Priority",
      property: "Property",
      issue: "Issue",
      assignedDate: "Assigned Date",
      status: "Status",
      action: "Action",
      high: "High",
      medium: "Medium", 
      low: "Low",
      pending: "Pending",
      inProgress: "In Progress",
      completed: "Completed",
      markComplete: "Mark Complete",
      viewDetails: "View Details",
      mySchedule: "My Schedule",
      todaysJobs: "Today's Jobs",
      upcomingSchedule: "Upcoming Schedule",
      availability: "Availability",
      workReports: "Work Reports",
      completionReport: "Completion Report",
      issueReport: "Issue Report",
      monthlyReport: "Monthly Report",
      teamSettings: "Team Settings",
      notifications: "Notifications",
      workingHours: "Working Hours",
      specialization: "Specialization"
    },
    bn: {
      welcome: "স্বাগতম",
      teamName: "আহমেদ রক্ষণাবেক্ষণ দল",
      subtitle: "সম্পত্তিগুলো নিখুঁত অবস্থায় রাখুন",
      quickActions: "দ্রুত কাজ",
      viewWorkOrders: "কাজের অর্ডার দেখুন",
      updateSchedule: "সময়সূচী আপডেট করুন",
      reportCompletion: "সম্পন্নতার রিপোর্ট",
      requestSupplies: "সরবরাহের অনুরোধ",
      overview: "সংক্ষিপ্ত বিবরণ",
      workOrders: "কাজের অর্ডার",
      schedule: "সময়সূচী",
      reports: "রিপোর্ট",
      settings: "সেটিংস",
      totalAssigned: "মোট নির্ধারিত",
      completedToday: "আজ সম্পন্ন",
      pendingTasks: "অমীমাংসিত কাজ",
      upcomingJobs: "আসন্ন কাজ",
      recentActivity: "সাম্প্রতিক কার্যকলাপ",
      workOrderList: "কাজের অর্ডার তালিকা",
      priority: "অগ্রাধিকার",
      property: "সম্পত্তি",
      issue: "সমস্যা",
      assignedDate: "নির্ধারিত তারিখ",
      status: "অবস্থা",
      action: "কাজ",
      high: "উচ্চ",
      medium: "মাঝারি",
      low: "কম",
      pending: "অমীমাংসিত",
      inProgress: "চলমান",
      completed: "সম্পন্ন",
      markComplete: "সম্পন্ন চিহ্নিত করুন",
      viewDetails: "বিস্তারিত দেখুন",
      mySchedule: "আমার সময়সূচী",
      todaysJobs: "আজকের কাজ",
      upcomingSchedule: "আসন্ন সময়সূচী",
      availability: "উপলব্ধতা",
      workReports: "কাজের রিপোর্ট",
      completionReport: "সম্পন্নতার রিপোর্ট",
      issueReport: "সমস্যার রিপোর্ট",
      monthlyReport: "মাসিক রিপোর্ট",
      teamSettings: "দলের সেটিংস",
      notifications: "বিজ্ঞপ্তি",
      workingHours: "কাজের সময়",
      specialization: "বিশেষত্ব"
    }
  }

  const t = translations[language]

  // Sample maintenance team data
  const teamData = {
    name: t.teamName,
    totalAssigned: 12,
    completedToday: 3,
    pendingTasks: 5,
    upcomingJobs: 4,
    specialization: "Plumbing & Electrical"
  }

  const workOrders = [
    {
      id: 1,
      property: "House 45, Road 12, Dhanmondi",
      issue: "Leaking faucet in kitchen",
      priority: "medium",
      assignedDate: "Dec 20, 2024",
      status: "pending",
      description: "Kitchen sink faucet has been dripping for 3 days"
    },
    {
      id: 2,
      property: "Apt 3B, Building 7, Gulshan",
      issue: "Air conditioning not cooling",
      priority: "high",
      assignedDate: "Dec 19, 2024",
      status: "inProgress",
      description: "AC in master bedroom stopped working"
    },
    {
      id: 3,
      property: "House 12, Road 5, Uttara",
      issue: "Electrical outlet not working",
      priority: "low",
      assignedDate: "Dec 18, 2024",
      status: "completed",
      description: "Living room electrical outlet needs repair"
    }
  ]

  const todaysSchedule = [
    { time: "9:00 AM", property: "House 45, Dhanmondi", task: "Fix leaking faucet", duration: "1-2 hours" },
    { time: "11:30 AM", property: "Apt 3B, Gulshan", task: "AC repair", duration: "2-3 hours" },
    { time: "3:00 PM", property: "House 8, Uttara", task: "Install new light fixtures", duration: "1 hour" }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'inProgress': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const StatCard = ({ title, value, icon, actionButton, onClick }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        {actionButton && (
          <button
            onClick={onClick}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {actionButton}
          </button>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
      <div className="text-slate-600 text-sm">{title}</div>
    </motion.div>
  )

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t.totalAssigned}
          value={teamData.totalAssigned}
          icon="📋"
          actionButton={t.viewWorkOrders}
          onClick={() => setActiveTab('workOrders')}
        />
        <StatCard
          title={t.completedToday}
          value={teamData.completedToday}
          icon="✅"
        />
        <StatCard
          title={t.pendingTasks}
          value={teamData.pendingTasks}
          icon="⏳"
        />
        <StatCard
          title={t.upcomingJobs}
          value={teamData.upcomingJobs}
          icon="📅"
          actionButton={t.mySchedule}
          onClick={() => setActiveTab('schedule')}
        />
      </div>

      {/* Today's Schedule */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.todaysJobs}</h3>
        <div className="space-y-3">
          {todaysSchedule.map((job, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-blue-600">{job.time}</div>
                <div>
                  <div className="text-sm font-medium text-slate-800">{job.task}</div>
                  <div className="text-xs text-slate-600">{job.property}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">{job.duration}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.recentActivity}</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <span className="text-green-600">✅</span>
            <div className="text-sm">
              <span className="font-medium">Completed:</span> Electrical outlet repair at House 12, Uttara
            </div>
            <div className="text-xs text-slate-500 ml-auto">2 hours ago</div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
            <span className="text-yellow-600">🔧</span>
            <div className="text-sm">
              <span className="font-medium">Started:</span> AC repair at Apt 3B, Gulshan
            </div>
            <div className="text-xs text-slate-500 ml-auto">4 hours ago</div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <span className="text-blue-600">📋</span>
            <div className="text-sm">
              <span className="font-medium">Assigned:</span> New work order for faucet repair
            </div>
            <div className="text-xs text-slate-500 ml-auto">6 hours ago</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderWorkOrders = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.workOrderList}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-600">{t.property}</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-600">{t.issue}</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-600">{t.priority}</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-600">{t.status}</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-600">{t.action}</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100">
                  <td className="py-3 px-2 text-sm text-slate-800">{order.property}</td>
                  <td className="py-3 px-2 text-sm text-slate-800">{order.issue}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                      {t[order.priority]}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {t[order.status]}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      {order.status === 'completed' ? t.viewDetails : t.markComplete}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.mySchedule}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-700 mb-3">{t.todaysJobs}</h4>
            <div className="space-y-2">
              {todaysSchedule.map((job, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-sm">{job.time} - {job.task}</div>
                  <div className="text-xs text-slate-600">{job.property}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-slate-700 mb-3">{t.availability}</h4>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-800">Available Today</div>
              <div className="text-xs text-green-600">9:00 AM - 5:00 PM</div>
              <div className="text-xs text-slate-600 mt-2">Specialization: {teamData.specialization}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.workReports}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left">
            <div className="font-medium text-slate-800">{t.completionReport}</div>
            <div className="text-sm text-slate-600 mt-1">Generate completion summary</div>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left">
            <div className="font-medium text-slate-800">{t.issueReport}</div>
            <div className="text-sm text-slate-600 mt-1">Report issues encountered</div>
          </button>
          <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-left">
            <div className="font-medium text-slate-800">{t.monthlyReport}</div>
            <div className="text-sm text-slate-600 mt-1">Monthly work summary</div>
          </button>
        </div>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.teamSettings}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t.notifications}</label>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm text-slate-600">Email notifications for new work orders</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t.workingHours}</label>
            <div className="grid grid-cols-2 gap-4">
              <input type="time" className="border border-slate-300 rounded-lg px-3 py-2" defaultValue="09:00" />
              <input type="time" className="border border-slate-300 rounded-lg px-3 py-2" defaultValue="17:00" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t.specialization}</label>
            <input 
              type="text" 
              className="w-full border border-slate-300 rounded-lg px-3 py-2" 
              defaultValue={teamData.specialization}
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-slate-200/30 to-blue-200/20 rounded-full backdrop-blur-sm animate-slow-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-slate-200/30 rounded-full backdrop-blur-sm animate-float"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{t.welcome}, {teamData.name}</h1>
              <p className="text-slate-600">{t.subtitle}</p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                onClick={() => setActiveTab('workOrders')}
              >
                {t.viewWorkOrders}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {t.reportCompletion}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="relative z-10 bg-white/60 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: t.overview },
              { id: 'workOrders', label: t.workOrders },
              { id: 'schedule', label: t.schedule },
              { id: 'reports', label: t.reports },
              { id: 'settings', label: t.settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'workOrders' && renderWorkOrders()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'reports' && renderReports()}
          {activeTab === 'settings' && renderSettings()}
        </motion.div>
      </div>
    </div>
  )
}

export default MaintenanceHomepage 