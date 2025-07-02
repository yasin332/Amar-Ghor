import { useState } from 'react'
import { motion } from 'framer-motion'

const TenantHomepage = ({ language = 'en' }) => {
  const [activeTab, setActiveTab] = useState('overview')

  const translations = {
    en: {
      welcome: "Welcome back",
      tenantName: "Fatima Khan",
      subtitle: "Manage your rental with ease",
      quickActions: "Quick Actions",
      payRent: "Pay Rent",
      requestMaintenance: "Request Maintenance",
      contactLandlord: "Contact Landlord",
      viewLease: "View Lease",
      overview: "Overview",
      myProperty: "My Property",
      payments: "Payments",
      maintenance: "Maintenance",
      messages: "Messages",
      currentRent: "Current Rent",
      nextPayment: "Next Payment Due",
      propertyAddress: "Property Address",
      leasePeriod: "Lease Period",
      recentActivity: "Recent Activity",
      propertyDetails: "Property Details",
      address: "Address",
      landlord: "Landlord",
      leaseStart: "Lease Start",
      leaseEnd: "Lease End",
      monthlyRent: "Monthly Rent",
      securityDeposit: "Security Deposit",
      propertyType: "Property Type",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      amenities: "Amenities",
      paymentHistory: "Payment History",
      date: "Date",
      amount: "Amount",
      method: "Method",
      status: "Status",
      paid: "Paid",
      pending: "Pending",
      overdue: "Overdue",
      maintenanceRequests: "Maintenance Requests",
      issue: "Issue",
      priority: "Priority",
      requestDate: "Request Date",
      requestStatus: "Status",
      submitted: "Submitted",
      inProgress: "In Progress",
      completed: "Completed",
      high: "High",
      medium: "Medium",
      low: "Low",
      messageHistory: "Message History",
      from: "From",
      to: "To",
      subject: "Subject",
      house: "House",
      apartment: "Apartment",
      taka: "৳",
      dueIn: "Due in",
      days: "days",
      payNow: "Pay Now",
      totalPaid: "Total Paid This Year",
      upcomingPayments: "Upcoming Payments",
      activeRequests: "Active Requests",
      newMessage: "New Message",
      sendMessage: "Send Message",
      cancel: "Cancel",
      submit: "Submit"
    },
    bn: {
      welcome: "স্বাগতম",
      tenantName: "ফাতিমা খান",
      subtitle: "সহজেই আপনার ভাড়া পরিচালনা করুন",
      quickActions: "দ্রুত কাজ",
      payRent: "ভাড়া পরিশোধ",
      requestMaintenance: "রক্ষণাবেক্ষণের অনুরোধ",
      contactLandlord: "বাড়িওয়ালার সাথে যোগাযোগ",
      viewLease: "লিজ দেখুন",
      overview: "সংক্ষিপ্ত বিবরণ",
      myProperty: "আমার সম্পত্তি",
      payments: "পেমেন্ট",
      maintenance: "রক্ষণাবেক্ষণ",
      messages: "বার্তা",
      currentRent: "বর্তমান ভাড়া",
      nextPayment: "পরবর্তী পেমেন্ট বকেয়া",
      propertyAddress: "সম্পত্তির ঠিকানা",
      leasePeriod: "লিজের সময়কাল",
      recentActivity: "সাম্প্রতিক কার্যকলাপ",
      propertyDetails: "সম্পত্তির বিবরণ",
      address: "ঠিকানা",
      landlord: "বাড়িওয়ালা",
      leaseStart: "লিজ শুরু",
      leaseEnd: "লিজ শেষ",
      monthlyRent: "মাসিক ভাড়া",
      securityDeposit: "জামানত",
      propertyType: "সম্পত্তির ধরন",
      bedrooms: "শোবার ঘর",
      bathrooms: "বাথরুম",
      amenities: "সুবিধা",
      paymentHistory: "পেমেন্টের ইতিহাস",
      date: "তারিখ",
      amount: "পরিমাণ",
      method: "পদ্ধতি",
      status: "অবস্থা",
      paid: "পরিশোধিত",
      pending: "অমীমাংসিত",
      overdue: "অতিরিক্ত বকেয়া",
      maintenanceRequests: "রক্ষণাবেক্ষণের অনুরোধ",
      issue: "সমস্যা",
      priority: "অগ্রাধিকার",
      requestDate: "অনুরোধের তারিখ",
      requestStatus: "অবস্থা",
      submitted: "জমা দেওয়া",
      inProgress: "চলমান",
      completed: "সম্পন্ন",
      high: "উচ্চ",
      medium: "মাঝারি",
      low: "কম",
      messageHistory: "বার্তার ইতিহাস",
      from: "থেকে",
      to: "প্রতি",
      subject: "বিষয়",
      house: "বাড়ি",
      apartment: "অ্যাপার্টমেন্ট",
      taka: "৳",
      dueIn: "বকেয়া",
      days: "দিনে",
      payNow: "এখনই পরিশোধ করুন",
      totalPaid: "এই বছর মোট পরিশোধিত",
      upcomingPayments: "আসন্ন পেমেন্ট",
      activeRequests: "সক্রিয় অনুরোধ",
      newMessage: "নতুন বার্তা",
      sendMessage: "বার্তা পাঠান",
      cancel: "বাতিল",
      submit: "জমা দিন"
    }
  }

  const t = translations[language]

  // Sample tenant data
  const tenantData = {
    name: t.tenantName,
    property: "House 45, Road 12, Dhanmondi",
    landlord: "Karim Rahman",
    landlordPhone: "01712345678",
    monthlyRent: 15000,
    nextPaymentDue: "Jan 1, 2025",
    daysUntilDue: 5,
    leaseStart: "Jan 1, 2024",
    leaseEnd: "Dec 31, 2024",
    securityDeposit: 30000,
    propertyType: t.house,
    bedrooms: 3,
    bathrooms: 2,
    totalPaidThisYear: 165000
  }

  const amenities = [
    "24/7 Security", "Generator Backup", "Parking Space", "Garden", 
    "Internet Ready", "Gas Connection", "Water Supply", "CCTV"
  ]

  const paymentHistory = [
    { id: 1, date: "Dec 1, 2024", amount: 15000, method: "Bank Transfer", status: "paid" },
    { id: 2, date: "Nov 1, 2024", amount: 15000, method: "Cash", status: "paid" },
    { id: 3, date: "Oct 1, 2024", amount: 15000, method: "Bank Transfer", status: "paid" },
    { id: 4, date: "Sep 1, 2024", amount: 15000, method: "Mobile Banking", status: "paid" },
    { id: 5, date: "Aug 1, 2024", amount: 15000, method: "Bank Transfer", status: "paid" },
    { id: 6, date: "Jul 1, 2024", amount: 15000, method: "Cash", status: "paid" }
  ]

  const maintenanceRequests = [
    { 
      id: 1, 
      issue: "Leaking faucet in kitchen", 
      priority: "medium", 
      date: "Dec 15, 2024", 
      status: "inProgress",
      description: "Kitchen sink faucet has been dripping for 3 days. Water waste is concerning."
    },
    { 
      id: 2, 
      issue: "Air conditioning not cooling", 
      priority: "high", 
      date: "Dec 10, 2024", 
      status: "completed",
      description: "AC in master bedroom stopped working. Need immediate repair due to heat."
    },
    { 
      id: 3, 
      issue: "Light bulb replacement needed", 
      priority: "low", 
      date: "Dec 5, 2024", 
      status: "completed",
      description: "Living room ceiling light bulb burnt out."
    },
    { 
      id: 4, 
      issue: "Window lock broken", 
      priority: "high", 
      date: "Nov 28, 2024", 
      status: "completed",
      description: "Security concern - bedroom window lock mechanism is broken."
    }
  ]

  const messages = [
    { 
      id: 1, 
      from: "Karim Rahman", 
      to: t.tenantName, 
      subject: "Monthly Rent Receipt - December", 
      date: "Dec 16, 2024", 
      message: "Dear Fatima, Thank you for your timely payment of December rent. Please find the receipt attached to this message. Have a great month ahead!"
    },
    { 
      id: 2, 
      from: t.tenantName, 
      to: "Karim Rahman", 
      subject: "Kitchen Faucet Issue Update", 
      date: "Dec 15, 2024", 
      message: "Dear Mr. Rahman, Just wanted to update you that the kitchen faucet is still leaking. When can we expect the plumber to come? The water wastage is quite significant now."
    },
    { 
      id: 3, 
      from: "Karim Rahman", 
      to: t.tenantName, 
      subject: "Maintenance Team Response", 
      date: "Dec 14, 2024", 
      message: "Hello Fatima, I've contacted our maintenance team regarding the faucet issue. They will visit tomorrow between 10 AM - 2 PM. Please ensure someone is available."
    },
    { 
      id: 4, 
      from: "Karim Rahman", 
      to: t.tenantName, 
      subject: "Property Inspection Notice", 
      date: "Dec 1, 2024", 
      message: "Dear Tenant, This is to inform you about our quarterly property inspection scheduled for December 20th, 2024. The inspection will be conducted between 2-4 PM. Please let me know if this time works for you."
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      case 'submitted': return 'text-blue-600 bg-blue-100'
      case 'inProgress': return 'text-yellow-600 bg-yellow-100'
      case 'completed': return 'text-green-600 bg-green-100'
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const StatCard = ({ title, value, icon, actionButton, onClick }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
          {actionButton && (
            <button 
              onClick={onClick}
              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
            >
              {actionButton}
            </button>
          )}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </motion.div>
  )

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title={t.currentRent} 
          value={`${t.taka}${tenantData.monthlyRent.toLocaleString()}`} 
          icon="💰" 
        />
        <StatCard 
          title={t.nextPayment} 
          value={`${t.dueIn} ${tenantData.daysUntilDue} ${t.days}`} 
          icon="📅"
          actionButton={t.payNow}
          onClick={() => alert('Payment gateway would open here')}
        />
        <StatCard 
          title={t.totalPaid} 
          value={`${t.taka}${tenantData.totalPaidThisYear.toLocaleString()}`} 
          icon="📊" 
        />
        <StatCard 
          title={t.activeRequests} 
          value="1 pending" 
          icon="🔧" 
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.quickActions}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all group">
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💳</span>
            <span className="text-sm font-medium text-slate-700">{t.payRent}</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all group">
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔧</span>
            <span className="text-sm font-medium text-slate-700">{t.requestMaintenance}</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all group">
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📞</span>
            <span className="text-sm font-medium text-slate-700">{t.contactLandlord}</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all group">
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📄</span>
            <span className="text-sm font-medium text-slate-700">{t.viewLease}</span>
          </button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.recentActivity}</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <span className="text-green-600 text-xl">✅</span>
            <div>
              <p className="text-sm font-medium text-slate-800">December rent payment confirmed</p>
              <p className="text-xs text-slate-600">Dec 16, 2024 - {t.taka}15,000 via Bank Transfer</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <span className="text-yellow-600 text-xl">🔧</span>
            <div>
              <p className="text-sm font-medium text-slate-800">Kitchen faucet repair in progress</p>
              <p className="text-xs text-slate-600">Dec 15, 2024 - Maintenance team assigned</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <span className="text-blue-600 text-xl">📩</span>
            <div>
              <p className="text-sm font-medium text-slate-800">New message from landlord</p>
              <p className="text-xs text-slate-600">Dec 14, 2024 - Maintenance update received</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <span className="text-green-600 text-xl">🔧</span>
            <div>
              <p className="text-sm font-medium text-slate-800">AC repair completed successfully</p>
              <p className="text-xs text-slate-600">Dec 12, 2024 - Cooling restored in master bedroom</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )

  const renderMyProperty = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Property Overview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">{t.propertyDetails}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.address}</label>
              <p className="text-slate-800 font-medium text-lg">{tenantData.property}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.landlord}</label>
              <p className="text-slate-800 font-medium">{tenantData.landlord}</p>
              <p className="text-slate-600 text-sm">{tenantData.landlordPhone}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.propertyType}</label>
              <p className="text-slate-800 font-medium">{tenantData.propertyType}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <label className="text-sm font-medium text-slate-600">{t.bedrooms}</label>
                <p className="text-slate-800 font-medium text-xl">{tenantData.bedrooms}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <label className="text-sm font-medium text-slate-600">{t.bathrooms}</label>
                <p className="text-slate-800 font-medium text-xl">{tenantData.bathrooms}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.leaseStart}</label>
              <p className="text-slate-800 font-medium">{tenantData.leaseStart}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.leaseEnd}</label>
              <p className="text-slate-800 font-medium">{tenantData.leaseEnd}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.monthlyRent}</label>
              <p className="text-slate-800 font-bold text-xl">{t.taka}{tenantData.monthlyRent.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.securityDeposit}</label>
              <p className="text-slate-800 font-medium">{t.taka}{tenantData.securityDeposit.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">{t.amenities}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-blue-600">✓</span>
              <span className="text-sm font-medium text-slate-700">{amenity}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )

  const renderPayments = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-800">{t.paymentHistory}</h3>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
          {t.payNow}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.date}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.amount}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.method}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment) => (
              <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 text-slate-600">{payment.date}</td>
                <td className="py-3 px-4 text-slate-800 font-semibold">{t.taka}{payment.amount.toLocaleString()}</td>
                <td className="py-3 px-4 text-slate-600">{payment.method}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {t.paid}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-slate-600">{t.totalPaid}: <span className="font-bold text-green-700">{t.taka}{tenantData.totalPaidThisYear.toLocaleString()}</span></p>
      </div>
    </motion.div>
  )

  const renderMaintenance = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* New Request Button */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">{t.maintenanceRequests}</h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
            {t.requestMaintenance}
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {maintenanceRequests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-semibold text-slate-800 text-lg">{request.issue}</h4>
                <p className="text-slate-600 text-sm mt-1">{request.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {request.status === 'submitted' ? t.submitted : 
                 request.status === 'inProgress' ? t.inProgress : t.completed}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-500">{t.priority}:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.priority)}`}>
                  {request.priority === 'high' ? t.high : 
                   request.priority === 'medium' ? t.medium : t.low}
                </span>
              </div>
              <div>
                <span className="text-slate-500">{t.requestDate}:</span>
                <span className="ml-2 text-slate-700">{request.date}</span>
              </div>
              <div>
                <span className="text-slate-500">ID:</span>
                <span className="ml-2 text-slate-700 font-mono">#{request.id.toString().padStart(4, '0')}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const renderMessages = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* New Message Button */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">{t.messageHistory}</h3>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
            {t.newMessage}
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-slate-800 text-lg">{msg.subject}</h4>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{msg.date}</span>
            </div>
            <div className="mb-3 text-sm text-slate-600">
              <span className="font-medium">{t.from}:</span> 
              <span className="ml-1 text-slate-800">{msg.from}</span>
              <span className="mx-2">→</span>
              <span className="font-medium">{t.to}:</span> 
              <span className="ml-1 text-slate-800">{msg.to}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-slate-700 leading-relaxed">{msg.message}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-slate-200/30 to-blue-200/20 rounded-full backdrop-blur-sm animate-slow-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-slate-200/30 rounded-full backdrop-blur-sm animate-float"></div>
        <div className="absolute top-1/2 left-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl animate-slow-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {t.welcome}, {t.tenantName}
            </h1>
            <p className="text-slate-600">{t.subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-slate-200 inline-flex">
              {[
                { key: 'overview', label: t.overview, icon: '📊' },
                { key: 'myProperty', label: t.myProperty, icon: '🏠' },
                { key: 'payments', label: t.payments, icon: '💰' },
                { key: 'maintenance', label: t.maintenance, icon: '🔧' },
                { key: 'messages', label: t.messages, icon: '💬' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    activeTab === tab.key
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <div className="min-h-[600px]">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'myProperty' && renderMyProperty()}
            {activeTab === 'payments' && renderPayments()}
            {activeTab === 'maintenance' && renderMaintenance()}
            {activeTab === 'messages' && renderMessages()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TenantHomepage
