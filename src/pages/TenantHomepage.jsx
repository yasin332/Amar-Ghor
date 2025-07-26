import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const TenantHomepage = ({ language = 'en' }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const [tenantData, setTenantData] = useState(null)
  const [paymentHistory, setPaymentHistory] = useState([])
  const [maintenanceRequests, setMaintenanceRequests] = useState([])
  const [messages, setMessages] = useState([])
  
  // Modal states
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showLeaseModal, setShowLeaseModal] = useState(false)
  
  // Form states
  const [paymentForm, setPaymentForm] = useState({
    amount: 15000,
    method: 'bankTransfer',
    reference: ''
  })
  
  const [maintenanceForm, setMaintenanceForm] = useState({
    issue: '',
    description: '',
    priority: 'medium',
    location: ''
  })
  
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: ''
  })
  
  const [contactForm, setContactForm] = useState({
    type: 'general',
    message: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Fetch user's profile to get their name
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single()
      
      if (profileError) console.error('Error fetching profile:', profileError)
      else setUserProfile(profile)

      // Fetch tenant details (will be an array)
      const { data: tenantDetails, error: tenantError } = await supabase
        .from('tenants')
        .select(`
          *,
          properties (
            address,
            property_type,
            bedrooms,
            bathrooms,
            owner_id,
            profiles (
              first_name,
              last_name,
              phone
            ),
            amenities
          )
        `)
        .eq('email', user.email)
      
      if (tenantError) {
        console.error('Error fetching tenant details:', tenantError)
      } else if (tenantDetails && tenantDetails.length > 0) {
        const tenant = tenantDetails[0] // Use the first tenant record
        setTenantData(tenant)

        // Fetch payment history for this tenant
        const { data: payments, error: paymentsError } = await supabase
          .from('payments')
          .select('*')
          .eq('tenant_id', tenant.id)
        
        if (paymentsError) console.error('Error fetching payment history:', paymentsError)
        else setPaymentHistory(payments)

        // Fetch maintenance requests for this tenant
        const { data: maintenance, error: maintenanceError } = await supabase
          .from('maintenance_requests')
          .select('*')
          .eq('tenant_id', tenant.id)

        if (maintenanceError) console.error('Error fetching maintenance requests:', maintenanceError)
        else setMaintenanceRequests(maintenance)
      }

      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
      
      if (messagesError) console.error('Error fetching messages:', messagesError)
      else setMessages(messagesData)

      setLoading(false)
    }

    fetchData()
  }, [])

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
      submit: "Submit",
      // Payment Modal
      paymentGateway: "Payment Gateway",
      selectPaymentMethod: "Select Payment Method",
      bankTransfer: "Bank Transfer",
      mobileBanking: "Mobile Banking",
      cash: "Cash",
      paymentReference: "Payment Reference",
      enterReference: "Enter transaction reference",
      processPayment: "Process Payment",
      paymentSuccessful: "Payment Successful!",
      // Maintenance Modal
      submitMaintenanceRequest: "Submit Maintenance Request",
      issueTitle: "Issue Title",
      enterIssue: "Enter brief description of issue",
      detailedDescription: "Detailed Description",
      describeIssue: "Describe the problem in detail",
      location: "Location",
      enterLocation: "Which room/area?",
      selectPriority: "Select Priority",
      submitRequest: "Submit Request",
      requestSubmitted: "Request Submitted Successfully!",
      // Message Modal
      composeMessage: "Compose Message",
      messageSubject: "Subject",
      enterSubject: "Enter message subject",
      messageContent: "Message",
      enterMessage: "Type your message here...",
      messageSent: "Message Sent Successfully!",
      // Contact Modal
      contactLandlordTitle: "Contact Landlord",
      contactType: "Contact Type",
      general: "General Inquiry",
      emergency: "Emergency",
      complaint: "Complaint",
      contactMessage: "Message",
      sendContact: "Send Message",
      contactSent: "Message Sent Successfully!",
      // Lease Modal
      leaseDocument: "Lease Document",
      downloadLease: "Download PDF",
      printLease: "Print Document",
      leaseTerms: "Lease Terms & Conditions"
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
      submit: "জমা দিন",
      // Payment Modal
      paymentGateway: "পেমেন্ট গেটওয়ে",
      selectPaymentMethod: "পেমেন্ট পদ্ধতি নির্বাচন করুন",
      bankTransfer: "ব্যাংক ট্রান্সফার",
      mobileBanking: "মোবাইল ব্যাংকিং",
      cash: "নগদ",
      paymentReference: "পেমেন্ট রেফারেন্স",
      enterReference: "লেনদেনের রেফারেন্স দিন",
      processPayment: "পেমেন্ট প্রক্রিয়া করুন",
      paymentSuccessful: "পেমেন্ট সফল হয়েছে!",
      // Maintenance Modal
      submitMaintenanceRequest: "রক্ষণাবেক্ষণের অনুরোধ জমা দিন",
      issueTitle: "সমস্যার শিরোনাম",
      enterIssue: "সমস্যার সংক্ষিপ্ত বিবরণ দিন",
      detailedDescription: "বিস্তারিত বিবরণ",
      describeIssue: "সমস্যাটি বিস্তারিত বর্ণনা করুন",
      location: "অবস্থান",
      enterLocation: "কোন ঘর/এলাকা?",
      selectPriority: "অগ্রাধিকার নির্বাচন করুন",
      submitRequest: "অনুরোধ জমা দিন",
      requestSubmitted: "অনুরোধ সফলভাবে জমা দেওয়া হয়েছে!",
      // Message Modal
      composeMessage: "বার্তা লিখুন",
      messageSubject: "বিষয়",
      enterSubject: "বার্তার বিষয় লিখুন",
      messageContent: "বার্তা",
      enterMessage: "এখানে আপনার বার্তা লিখুন...",
      messageSent: "বার্তা সফলভাবে পাঠানো হয়েছে!",
      // Contact Modal
      contactLandlordTitle: "বাড়িওয়ালার সাথে যোগাযোগ",
      contactType: "যোগাযোগের ধরন",
      general: "সাধারণ অনুসন্ধান",
      emergency: "জরুরি",
      complaint: "অভিযোগ",
      contactMessage: "বার্তা",
      sendContact: "বার্তা পাঠান",
      contactSent: "বার্তা সফলভাবে পাঠানো হয়েছে!",
      // Lease Modal
      leaseDocument: "লিজ ডকুমেন্ট",
      downloadLease: "পিডিএফ ডাউনলোড করুন",
      printLease: "ডকুমেন্ট প্রিন্ট করুন",
      leaseTerms: "লিজের শর্তাবলী"
    }
  }

  const t = translations[language]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  const totalPaidThisYear = paymentHistory.reduce((sum, p) => sum + (p.amount || 0), 0);

  // If the user is a tenant but not yet assigned to a property
  if (!tenantData) {
    const welcomeName = userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : t.tenantName
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-12"
          >
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              {t.welcome}, {welcomeName}!
            </h1>
            <p className="text-xl text-slate-600 max-w-lg mx-auto">
              Your account is ready. Please wait for a property owner to add you as a tenant to access your dashboard.
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

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

  // Handler functions
  const handlePayment = async (e) => {
    e.preventDefault()
    
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          tenant_id: tenantData.id,
          landlord_id: tenantData.properties?.owner_id,
          amount: paymentForm.amount,
          payment_date: new Date(),
          status: 'paid' // Assuming payment is successful
        }
      ])
      .select()

    if (error) {
      console.error('Error processing payment:', error)
      alert('Payment failed.')
      return
    }

    setPaymentHistory(prev => [...prev, ...data])
    alert(t.paymentSuccessful)
    setShowPaymentModal(false)
    setPaymentForm({ amount: tenantData.rent_amount || 0, method: 'bankTransfer', reference: '' })
  }

  const handleMaintenanceRequest = async (e) => {
    e.preventDefault()

    const { data, error } = await supabase
      .from('maintenance_requests')
      .insert([
        {
          property_id: tenantData.property_id,
          tenant_id: tenantData.id,
          issue: maintenanceForm.issue,
          description: maintenanceForm.description,
          priority: maintenanceForm.priority,
          status: 'submitted'
        }
      ])
      .select()

    if (error) {
      console.error('Error submitting maintenance request:', error)
      alert('Failed to submit request.')
      return
    }

    setMaintenanceRequests(prev => [...prev, ...data])
    alert(t.requestSubmitted)
    setShowMaintenanceModal(false)
    setMaintenanceForm({ issue: '', description: '', priority: 'medium', location: '' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    // Simulate message sending
    setTimeout(() => {
      alert(t.messageSent)
      setShowMessageModal(false)
      setMessageForm({ subject: '', message: '' })
      // Add to messages (in real app, this would be handled by backend)
    }, 500)
  }

  const handleContactLandlord = (e) => {
    e.preventDefault()
    // Simulate contact message
    setTimeout(() => {
      alert(t.contactSent)
      setShowContactModal(false)
      setContactForm({ type: 'general', message: '' })
    }, 500)
  }

  const handleDownloadLease = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(22)
    doc.text("Lease Agreement", 14, 22)

    // Add lease details
    doc.setFontSize(12)
    doc.text(`Property: ${tenantData.properties?.address}`, 14, 40)
    doc.text(`Tenant: ${tenantData.name}`, 14, 48)
    doc.text(`Landlord: ${tenantData.properties?.profiles?.first_name} ${tenantData.properties?.profiles?.last_name}`, 14, 56)
    doc.text(`Lease Period: ${tenantData.lease_start_date} to ${tenantData.lease_end_date}`, 14, 64)
    doc.text(`Monthly Rent: ${t.taka}${(tenantData.rent_amount || 0).toLocaleString()}`, 14, 72)
    doc.text(`Security Deposit: ${t.taka}${(tenantData.security_deposit || 0).toLocaleString()}`, 14, 80)

    // Add terms and conditions
    doc.autoTable({
      startY: 90,
      head: [['Terms & Conditions']],
      body: [
        ['Rent is due on the 1st of each month'],
        ['Late payment fee of 5% applies after 5 days'],
        ['Property must be maintained in good condition'],
        ['No subletting without written permission'],
        ['24-hour notice required for landlord visits'],
        ['Security deposit refundable upon satisfactory inspection']
      ],
      theme: 'grid'
    })

    doc.save('lease_agreement.pdf')
  }

  const handleViewLease = () => {
    setShowLeaseModal(true)
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
          value={`${t.taka}${(tenantData.rent_amount || 0).toLocaleString()}`} 
          icon="💰" 
        />
        <StatCard 
          title={t.nextPayment} 
          value={`Due Next Month`} 
          icon="📅"
          actionButton={t.payNow}
          onClick={() => setShowPaymentModal(true)}
        />
        <StatCard 
          title={t.totalPaid} 
          value={`${t.taka}${totalPaidThisYear.toLocaleString()}`} 
          icon="📊" 
        />
        <StatCard 
          title={t.activeRequests} 
          value={`${maintenanceRequests.filter(r => r.status !== 'completed').length} pending`} 
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
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💳</span>
            <span className="text-sm font-medium text-slate-700">{t.payRent}</span>
          </button>
          <button 
            onClick={() => setShowMaintenanceModal(true)}
            className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🔧</span>
            <span className="text-sm font-medium text-slate-700">{t.requestMaintenance}</span>
          </button>
          <button 
            onClick={() => setShowContactModal(true)}
            className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all group"
          >
            <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">📞</span>
            <span className="text-sm font-medium text-slate-700">{t.contactLandlord}</span>
          </button>
          <button 
            onClick={handleViewLease}
            className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all group"
          >
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
              <p className="text-slate-800 font-medium text-lg">{tenantData.properties?.address}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.landlord}</label>
              <p className="text-slate-800 font-medium">{`${tenantData.properties?.profiles?.first_name || ''} ${tenantData.properties?.profiles?.last_name || ''}`}</p>
              <p className="text-slate-600 text-sm">{tenantData.properties?.profiles?.phone}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.propertyType}</label>
              <p className="text-slate-800 font-medium">{tenantData.properties?.property_type}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <label className="text-sm font-medium text-slate-600">{t.bedrooms}</label>
                <p className="text-slate-800 font-medium text-xl">{tenantData.properties?.bedrooms}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <label className="text-sm font-medium text-slate-600">{t.bathrooms}</label>
                <p className="text-slate-800 font-medium text-xl">{tenantData.properties?.bathrooms}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.leaseStart}</label>
              <p className="text-slate-800 font-medium">{tenantData.lease_start_date}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.leaseEnd}</label>
              <p className="text-slate-800 font-medium">{tenantData.lease_end_date}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.monthlyRent}</label>
              <p className="text-slate-800 font-bold text-xl">{t.taka}{(tenantData.rent_amount || 0).toLocaleString()}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <label className="text-sm font-medium text-slate-600">{t.securityDeposit}</label>
              <p className="text-slate-800 font-medium">{t.taka}{(tenantData.security_deposit || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">{t.amenities}</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(tenantData.properties?.amenities || []).map((amenity, index) => (
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
        <button 
          onClick={() => setShowPaymentModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
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
                <td className="py-3 px-4 text-slate-600">{payment.payment_date}</td>
                <td className="py-3 px-4 text-slate-800 font-semibold">{t.taka}{payment.amount.toLocaleString()}</td>
                <td className="py-3 px-4 text-slate-600">{payment.payment_method}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status === 'paid' ? t.paid : payment.status === 'pending' ? t.pending : t.overdue}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-slate-600">{t.totalPaid}: <span className="font-bold text-green-700">{t.taka}{tenantData.total_paid_this_year.toLocaleString()}</span></p>
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
          <button 
            onClick={() => setShowMaintenanceModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
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
                <span className="ml-2 text-slate-700">{request.request_date}</span>
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
          <button 
            onClick={() => setShowMessageModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          >
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

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-xl"
            >
              ×
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </div>
    )
  }

  // Payment Modal
  const PaymentModal = () => (
    <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title={t.paymentGateway}>
      <form onSubmit={handlePayment} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.amount}</label>
          <input
            type="number"
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm(prev => ({...prev, amount: e.target.value}))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.selectPaymentMethod}</label>
          <select
            value={paymentForm.method}
            onChange={(e) => setPaymentForm(prev => ({...prev, method: e.target.value}))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="bankTransfer">{t.bankTransfer}</option>
            <option value="mobileBanking">{t.mobileBanking}</option>
            <option value="cash">{t.cash}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.paymentReference}</label>
          <input
            type="text"
            value={paymentForm.reference}
            onChange={(e) => setPaymentForm(prev => ({...prev, reference: e.target.value}))}
            placeholder={t.enterReference}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowPaymentModal(false)}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t.processPayment}
          </button>
        </div>
      </form>
    </Modal>
  )

  // Maintenance Modal
  const MaintenanceModal = () => (
    <Modal isOpen={showMaintenanceModal} onClose={() => setShowMaintenanceModal(false)} title={t.submitMaintenanceRequest}>
      <form onSubmit={handleMaintenanceRequest} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.issueTitle}</label>
          <input
            type="text"
            value={maintenanceForm.issue}
            onChange={(e) => setMaintenanceForm(prev => ({...prev, issue: e.target.value}))}
            placeholder={t.enterIssue}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.detailedDescription}</label>
          <textarea
            value={maintenanceForm.description}
            onChange={(e) => setMaintenanceForm(prev => ({...prev, description: e.target.value}))}
            placeholder={t.describeIssue}
            rows="3"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.location}</label>
          <input
            type="text"
            value={maintenanceForm.location}
            onChange={(e) => setMaintenanceForm(prev => ({...prev, location: e.target.value}))}
            placeholder={t.enterLocation}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.selectPriority}</label>
          <select
            value={maintenanceForm.priority}
            onChange={(e) => setMaintenanceForm(prev => ({...prev, priority: e.target.value}))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="low">{t.low}</option>
            <option value="medium">{t.medium}</option>
            <option value="high">{t.high}</option>
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowMaintenanceModal(false)}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t.submitRequest}
          </button>
        </div>
      </form>
    </Modal>
  )

  // Message Modal
  const MessageModal = () => (
    <Modal isOpen={showMessageModal} onClose={() => setShowMessageModal(false)} title={t.composeMessage}>
      <form onSubmit={handleSendMessage} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.messageSubject}</label>
          <input
            type="text"
            value={messageForm.subject}
            onChange={(e) => setMessageForm(prev => ({...prev, subject: e.target.value}))}
            placeholder={t.enterSubject}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.messageContent}</label>
          <textarea
            value={messageForm.message}
            onChange={(e) => setMessageForm(prev => ({...prev, message: e.target.value}))}
            placeholder={t.enterMessage}
            rows="4"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowMessageModal(false)}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t.sendMessage}
          </button>
        </div>
      </form>
    </Modal>
  )

  // Contact Modal
  const ContactModal = () => (
    <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title={t.contactLandlordTitle}>
      <form onSubmit={handleContactLandlord} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.contactType}</label>
          <select
            value={contactForm.type}
            onChange={(e) => setContactForm(prev => ({...prev, type: e.target.value}))}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="general">{t.general}</option>
            <option value="emergency">{t.emergency}</option>
            <option value="complaint">{t.complaint}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.contactMessage}</label>
          <textarea
            value={contactForm.message}
            onChange={(e) => setContactForm(prev => ({...prev, message: e.target.value}))}
            placeholder={t.enterMessage}
            rows="4"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowContactModal(false)}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t.sendContact}
          </button>
        </div>
      </form>
    </Modal>
  )

  // Lease Modal
  const LeaseModal = () => (
    <Modal isOpen={showLeaseModal} onClose={() => setShowLeaseModal(false)} title={t.leaseDocument}>
      <div className="space-y-4">
        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-semibold text-slate-800 mb-2">{t.leaseTerms}</h4>
          <div className="space-y-2 text-sm text-slate-700">
            <p><strong>Property:</strong> {tenantData.properties?.address}</p>
            <p><strong>Tenant:</strong> {tenantData.name}</p>
            <p><strong>Landlord:</strong> {`${tenantData.properties?.profiles?.first_name || ''} ${tenantData.properties?.profiles?.last_name || ''}`}</p>
            <p><strong>Lease Period:</strong> {tenantData.lease_start_date} - {tenantData.lease_end_date}</p>
            <p><strong>Monthly Rent:</strong> {t.taka}{(tenantData.rent_amount || 0).toLocaleString()}</p>
            <p><strong>Security Deposit:</strong> {t.taka}{(tenantData.security_deposit || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h5 className="font-medium text-slate-800 mb-2">Terms & Conditions:</h5>
          <ul className="text-sm text-slate-700 space-y-1 list-disc list-inside">
            <li>Rent is due on the 1st of each month</li>
            <li>Late payment fee of 5% applies after 5 days</li>
            <li>Property must be maintained in good condition</li>
            <li>No subletting without written permission</li>
            <li>24-hour notice required for landlord visits</li>
            <li>Security deposit refundable upon satisfactory inspection</li>
          </ul>
        </div>
        <div className="flex gap-3 pt-4">
          <button
            onClick={() => setShowLeaseModal(false)}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            {t.cancel}
          </button>
          <button
            onClick={handleDownloadLease}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t.downloadLease}
          </button>
        </div>
      </div>
    </Modal>
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
              {t.welcome}, {tenantData.name}
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

      {/* Modals */}
      <PaymentModal />
      <MaintenanceModal />
      <MessageModal />
      <ContactModal />
      <LeaseModal />
    </div>
  )
}

export default TenantHomepage
