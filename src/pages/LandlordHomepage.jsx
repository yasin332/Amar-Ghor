import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

const LandlordHomepage = ({ language = 'en' }) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false)
  const [showAddTenantModal, setShowAddTenantModal] = useState(false)
  const [showSendReminderModal, setShowSendReminderModal] = useState(false)
  const [showPropertyDetailsModal, setShowPropertyDetailsModal] = useState(false)
  const [showResolveMaintenanceModal, setShowResolveMaintenanceModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [selectedMaintenanceRequest, setSelectedMaintenanceRequest] = useState(null)
  const [newProperty, setNewProperty] = useState({
    address: '',
    propertyType: 'house',
    bedrooms: '',
    bathrooms: '',
    rent: '',
    description: '',
    amenities: [],
    photos: []
  })
  const [newTenant, setNewTenant] = useState({
    name: '',
    phone: '',
    email: '',
    nationalId: '',
    currentAddress: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    selectedProperty: '',
    leaseStartDate: '',
    leaseEndDate: '',
    rentAmount: '',
    securityDeposit: '',
    notes: ''
  })
  const [reminder, setReminder] = useState({
    type: 'rent_due',
    recipients: [],
    deliveryMethod: 'sms',
    customMessage: '',
    useTemplate: true,
    scheduledDate: '',
    scheduledTime: ''
  })
  const [maintenanceAssignment, setMaintenanceAssignment] = useState({
    selectedTeam: '',
    priority: 'normal',
    specialInstructions: '',
    expectedCompletionDate: '',
    costApprovalLimit: '',
    notifyTenant: true,
    notifyTeam: true,
    scheduledDate: '',
    scheduledTime: ''
  })
  const [dragOver, setDragOver] = useState(false)
  const [showSuppliesModal, setShowSuppliesModal] = useState(false)
  const [properties, setProperties] = useState([])
  const [tenants, setTenants] = useState([])
  const [payments, setPayments] = useState([])
  const [maintenanceRequests, setMaintenanceRequests] = useState([])
  const [maintenanceTeams, setMaintenanceTeams] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Fetch user's profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (profileError) console.error('Error fetching profile:', profileError)
      else setUserProfile(profileData)

      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select('*')
      
      if (propertiesError) console.error('Error fetching properties:', propertiesError)
      else setProperties(propertiesData)

      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('*')

      if (tenantsError) console.error('Error fetching tenants:', tenantsError)
      else setTenants(tenantsData)

      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select('*')

      if (paymentsError) console.error('Error fetching payments:', paymentsError)
      else setPayments(paymentsData)

      const { data: maintenanceData, error: maintenanceError } = await supabase
        .from('maintenance_requests')
        .select('*')

      if (maintenanceError) console.error('Error fetching maintenance requests:', maintenanceError)
      else setMaintenanceRequests(maintenanceData)

      const { data: teamsData, error: teamsError } = await supabase
        .from('maintenance_teams')
        .select('*')
      
      if (teamsError) console.error('Error fetching maintenance teams:', teamsError)
      else setMaintenanceTeams(teamsData)

      setLoading(false)
    }

    fetchData()
  }, [])

  const translations = {
    en: {
      welcome: "Welcome back",
      subtitle: "Manage your properties with confidence",
      quickActions: "Quick Actions",
      addProperty: "Add New Property",
      addTenant: "Add Tenant",
      recordPayment: "Record Payment",
      sendReminder: "Send Reminder",
      overview: "Overview",
      properties: "Properties",
      tenants: "Tenants",
      payments: "Payments",
      maintenance: "Maintenance",
      totalProperties: "Total Properties",
      totalTenants: "Active Tenants",
      monthlyIncome: "Monthly Income",
      pendingPayments: "Pending Payments",
      recentActivity: "Recent Activity",
      upcomingRent: "Upcoming Rent Due",
      maintenanceRequests: "Maintenance Requests",
      propertyList: "Property List",
      address: "Address",
      tenant: "Tenant",
      rent: "Rent",
      status: "Status",
      occupied: "Occupied",
      vacant: "Vacant",
      action: "Action",
      viewDetails: "View Details",
      tenantList: "Tenant List",
      phone: "Phone",
      rentDue: "Rent Due",
      paid: "Paid",
      pending: "Pending",
      overdue: "Overdue",
      paymentHistory: "Payment History",
      date: "Date",
      amount: "Amount",
      property: "Property",
      maintenanceList: "Maintenance Requests",
      issue: "Issue",
      priority: "Priority",
      requestDate: "Request Date",
      high: "High",
      medium: "Medium",
      low: "Low",
      resolve: "Resolve",
      assign: "Assign",
      contact: "Contact",
      taka: "৳",
      // Add Property Modal
      addPropertyTitle: "Add New Property",
      propertyAddress: "Property Address",
      propertyType: "Property Type",
      house: "House",
      apartment: "Apartment",
      flat: "Flat",
      room: "Room",
      bedrooms: "Bedrooms",
      bathrooms: "Bathrooms",
      monthlyRent: "Monthly Rent",
      propertyDescription: "Property Description",
      amenities: "Amenities",
      parking: "Parking",
      garden: "Garden",
      balcony: "Balcony",
      furnished: "Furnished",
      airConditioning: "Air Conditioning",
      internet: "Internet/WiFi",
      security: "Security",
      elevator: "Elevator",
      cancel: "Cancel",
      save: "Save Property",
      required: "This field is required",
      addressPlaceholder: "Enter full address",
      descriptionPlaceholder: "Describe the property features, location benefits, etc.",
      rentPlaceholder: "Enter monthly rent amount",
      propertyPhotos: "Property Photos",
      dragDropPhotos: "Drag and drop photos here, or click to select",
      supportedFormats: "Supported formats: JPG, PNG, WEBP (Max 5MB each)",
      removePhoto: "Remove photo",
      maxPhotos: "Maximum 10 photos allowed",
      invalidFileType: "Please select only image files (JPG, PNG, WEBP)",
      fileTooLarge: "File size should not exceed 5MB",
      // Add Tenant Modal
      addTenantTitle: "Add New Tenant",
      personalInformation: "Personal Information",
      tenantName: "Full Name",
      tenantPhone: "Phone Number",
      tenantEmail: "Email Address",
      nationalId: "National ID",
      currentAddress: "Current Address",
      emergencyContact: "Emergency Contact",
      emergencyContactName: "Emergency Contact Name",
      emergencyContactPhone: "Emergency Contact Phone",
      leaseDetails: "Lease Details",
      selectProperty: "Select Property",
      selectPropertyPlaceholder: "Choose a property",
      leaseStartDate: "Lease Start Date",
      leaseEndDate: "Lease End Date",
      securityDeposit: "Security Deposit",
      additionalNotes: "Additional Notes",
      namePlaceholder: "Enter tenant's full name",
      phonePlaceholder: "Enter phone number",
      emailPlaceholder: "Enter email address",
      nationalIdPlaceholder: "Enter national ID number",
      addressPlaceholder: "Enter current address",
      emergencyNamePlaceholder: "Enter emergency contact name",
      emergencyPhonePlaceholder: "Enter emergency contact phone",
      depositPlaceholder: "Enter security deposit amount",
      notesPlaceholder: "Any additional notes or requirements",
      saveTenant: "Save Tenant",
      // Send Reminder Modal
      sendReminderTitle: "Send Reminder",
      reminderType: "Reminder Type",
      recipients: "Recipients",
      selectRecipients: "Select Recipients",
      deliveryMethod: "Delivery Method",
      messageContent: "Message Content",
      useTemplate: "Use Template",
      customMessage: "Custom Message",
      scheduleReminder: "Schedule Reminder",
      sendNow: "Send Now",
      sendLater: "Schedule for Later",
      selectDate: "Select Date",
      selectTime: "Select Time",
      sendReminder: "Send Reminder",
      // Reminder Types
      rentDueReminder: "Rent Due Reminder",
      overdueRentReminder: "Overdue Rent Reminder",
      leaseRenewalReminder: "Lease Renewal Reminder",
      maintenanceReminder: "Maintenance Reminder",
      generalNotice: "General Notice",
      paymentConfirmation: "Payment Thank You",
      // Delivery Methods
      sms: "SMS/Text",
      email: "Email",
      whatsapp: "WhatsApp",
      inApp: "In-App Notification",
      // Recipients Options
      allTenants: "All Tenants",
      overduePayments: "Tenants with Overdue Payments",
      upcomingRent: "Tenants with Upcoming Rent Due",
      specificProperty: "Tenants from Specific Property",
      individualTenant: "Individual Tenant",
      // Message Templates
      rentDueTemplate: "Hi [Name], friendly reminder that rent for [Property] is due on [Date]. Amount: ৳[Amount]. Thank you!",
      overdueTemplate: "Dear [Name], your rent payment for [Property] is [Days] days overdue. Please contact us immediately. Amount: ৳[Amount]",
      leaseRenewalTemplate: "Dear [Name], your lease for [Property] expires on [Date]. Please contact us to discuss renewal options.",
      maintenanceTemplate: "Dear [Name], we will be conducting maintenance at [Property] on [Date]. Please ensure access.",
      generalTemplate: "Dear [Name], we have an important update regarding [Property]. Please read the details below.",
      paymentThankYouTemplate: "Thank you [Name] for your timely payment for [Property]. We appreciate your promptness!",
      customMessagePlaceholder: "Write your custom message here...",
      previewMessage: "Preview Message",
      estimatedCost: "Estimated Cost",
      smsPerMessage: "SMS per message",
      totalMessages: "Total Messages",
      selectAtLeastOne: "Please select at least one recipient",
      // Property Details Modal
      propertyDetailsTitle: "Property Details",
      propertyInformation: "Property Information",
      currentTenant: "Current Tenant",
      noTenant: "No current tenant",
      propertyStats: "Property Statistics",
      totalRentCollected: "Total Rent Collected",
      occupancyRate: "Occupancy Rate",
      averageStayDuration: "Average Stay Duration",
      months: "months",
      propertyAmenities: "Property Amenities",
      recentPayments: "Recent Payments",
      maintenanceHistory: "Maintenance History",
      noPayments: "No payment history",
      noMaintenance: "No maintenance requests",
      editProperty: "Edit Property",
      deleteProperty: "Delete Property",
      addTenantToProperty: "Add Tenant to Property",
      markAsVacant: "Mark as Vacant",
      tenantDetails: "Tenant Details",
      leaseInformation: "Lease Information",
      leaseStart: "Lease Start",
      leaseEnd: "Lease End",
      monthsRemaining: "months remaining",
      securityDepositAmount: "Security Deposit",
      contactTenant: "Contact Tenant",
      viewFullHistory: "View Full History",
      confirmMarkVacant: "Are you sure you want to mark this property as vacant?",
      thisWillRemoveTenant: "This will remove the current tenant assignment.",
      propertyMarkedVacant: "Property has been marked as vacant successfully!",
      fullHistoryFor: "Full History for",
      totalPayments: "Total Payments",
      totalRentCollected: "Total Rent Collected",
      lastPayment: "Last Payment",
      totalMaintenanceRequests: "Total Maintenance Requests",
      lastMaintenance: "Last Maintenance",
      noPaymentsYet: "No payments yet",
      noMaintenanceYet: "No maintenance requests",
      contactOptions: "Contact Options for",
      sampleMessage: "Sample message",
      sendSMS: "Send SMS",
      showAllOptions: "Show all options",
      callTenant: "Call",
      allContactOptions: "All contact options",
      messageTemplate: "Message template",
      // Assign Maintenance Modal
      assignMaintenanceTitle: "Assign Maintenance Work",
      requestDetails: "Request Details",
      requestedBy: "Requested by",
      requestDate: "Request Date",
      assignmentDetails: "Assignment Details",
      selectMaintenanceTeam: "Select Maintenance Team",
      electricalTeam: "Electrical Team",
      plumbingTeam: "Plumbing Team",
      hardwareTeam: "Hardware Team",
      hvacTeam: "HVAC Team",
      generalMaintenance: "General Maintenance",
      teamAvailable: "Available",
      teamBusy: "Busy",
      workPriority: "Work Priority",
      urgent: "Urgent",
      normal: "Normal",
      low: "Low Priority",
      specialInstructions: "Special Instructions",
      instructionsPlaceholder: "Any special instructions for the team (optional)",
      schedulingSection: "Scheduling",
      expectedCompletion: "Expected Completion Date",
      costApprovalLimit: "Cost Approval Limit",
      costLimitPlaceholder: "Maximum approved cost for this work",
      scheduledVisit: "Schedule Team Visit",
      visitDate: "Visit Date",
      visitTime: "Visit Time",
      notificationSettings: "Notifications",
      notifyTeam: "Notify Team via SMS",
      notifyTenant: "Notify Tenant about Team Visit",
      assignWork: "Assign Work",
      teamContactInfo: "Team Contact Information",
      teamLeader: "Team Leader",
      teamPhone: "Team Phone",
      teamSpecialization: "Specialization",
      teamAvailability: "Availability",
      costPerHour: "Cost per Hour",
      // Team Information
      electricalTeamLeader: "Rashid Ahmed (Electrician)",
      electricalTeamPhone: "01711-123456",
      electricalSpecialization: "Wiring, Lighting, Outlets, Circuit Issues",
      plumbingTeamLeader: "Kamal Hassan (Plumber)", 
      plumbingTeamPhone: "01712-234567",
      plumbingSpecialization: "Pipes, Toilets, Water Leaks, Drainage",
      hardwareTeamLeader: "Abdul Kader (Technician)",
      hardwareTeamPhone: "01713-345678", 
      hardwareSpecialization: "Doors, Windows, Locks, Hinges",
      hvacTeamLeader: "Nazrul Islam (AC Technician)",
      hvacTeamPhone: "01714-456789",
      hvacSpecialization: "Air Conditioning, Heating, Ventilation",
      generalTeamLeader: "Faruk Mia (Handyman)",
      generalTeamPhone: "01715-567890",
      generalSpecialization: "Painting, Cleaning, Minor Repairs, General Work"
    },
    bn: {
      welcome: "স্বাগতম",
      subtitle: "আত্মবিশ্বাসের সাথে আপনার সম্পত্তি পরিচালনা করুন",
      quickActions: "দ্রুত কাজ",
      addProperty: "নতুন সম্পত্তি যোগ করুন",
      addTenant: "ভাড়াটে যোগ করুন",
      recordPayment: "পেমেন্ট রেকর্ড করুন",
      sendReminder: "অনুস্মারক পাঠান",
      overview: "সংক্ষিপ্ত বিবরণ",
      properties: "সম্পত্তি",
      tenants: "ভাড়াটে",
      payments: "পেমেন্ট",
      maintenance: "রক্ষণাবেক্ষণ",
      totalProperties: "মোট সম্পত্তি",
      totalTenants: "সক্রিয় ভাড়াটে",
      monthlyIncome: "মাসিক আয়",
      pendingPayments: "অমীমাংসিত পেমেন্ট",
      recentActivity: "সাম্প্রতিক কার্যকলাপ",
      upcomingRent: "আসন্ন ভাড়া বকেয়া",
      maintenanceRequests: "রক্ষণাবেক্ষণের অনুরোধ",
      propertyList: "সম্পত্তির তালিকা",
      address: "ঠিকানা",
      tenant: "ভাড়াটে",
      rent: "ভাড়া",
      status: "অবস্থা",
      occupied: "দখলকৃত",
      vacant: "খালি",
      action: "কাজ",
      viewDetails: "বিস্তারিত দেখুন",
      tenantList: "ভাড়াটের তালিকা",
      phone: "ফোন",
      rentDue: "ভাড়া বকেয়া",
      paid: "পরিশোধিত",
      pending: "অমীমাংসিত",
      overdue: "অতিরিক্ত বকেয়া",
      paymentHistory: "পেমেন্টের ইতিহাস",
      date: "তারিখ",
      amount: "পরিমাণ",
      property: "সম্পত্তি",
      maintenanceList: "রক্ষণাবেক্ষণের অনুরোধ",
      issue: "সমস্যা",
      priority: "অগ্রাধিকার",
      requestDate: "অনুরোধের তারিখ",
      high: "উচ্চ",
      medium: "মাঝারি",
      low: "কম",
      resolve: "সমাধান",
      assign: "বরাদ্দ",
      contact: "যোগাযোগ",
      taka: "৳",
      // Add Property Modal
      addPropertyTitle: "নতুন সম্পত্তি যোগ করুন",
      propertyAddress: "সম্পত্তির ঠিকানা",
      propertyType: "সম্পত্তির ধরন",
      house: "বাড়ি",
      apartment: "অ্যাপার্টমেন্ট",
      flat: "ফ্ল্যাট",
      room: "রুম",
      bedrooms: "শোবার ঘর",
      bathrooms: "বাথরুম",
      monthlyRent: "মাসিক ভাড়া",
      propertyDescription: "সম্পত্তির বিবরণ",
      amenities: "সুবিধাসমূহ",
      parking: "পার্কিং",
      garden: "বাগান",
      balcony: "বারান্দা",
      furnished: "সাজানো",
      airConditioning: "এয়ার কন্ডিশনিং",
      internet: "ইন্টারনেট/ওয়াইফাই",
      security: "নিরাপত্তা",
      elevator: "লিফট",
      cancel: "বাতিল",
      save: "সম্পত্তি সংরক্ষণ করুন",
      required: "এই ক্ষেত্রটি প্রয়োজনীয়",
      addressPlaceholder: "সম্পূর্ণ ঠিকানা লিখুন",
      descriptionPlaceholder: "সম্পত্তির বৈশিষ্ট্য, অবস্থানের সুবিধা ইত্যাদি বর্ণনা করুন",
      rentPlaceholder: "মাসিক ভাড়ার পরিমাণ লিখুন",
      propertyPhotos: "সম্পত্তির ছবি",
      dragDropPhotos: "এখানে ছবি টেনে আনুন, অথবা নির্বাচন করতে ক্লিক করুন",
      supportedFormats: "সমর্থিত ফরম্যাট: JPG, PNG, WEBP (সর্বোচ্চ ৫MB প্রতিটি)",
      removePhoto: "ছবি সরান",
      maxPhotos: "সর্বোচ্চ ১০টি ছবি অনুমোদিত",
      invalidFileType: "অনুগ্রহ করে শুধু ছবি ফাইল নির্বাচন করুন (JPG, PNG, WEBP)",
      fileTooLarge: "ফাইলের আকার ৫MB এর বেশি হওয়া উচিত নয়",
      // Add Tenant Modal
      addTenantTitle: "নতুন ভাড়াটে যোগ করুন",
      personalInformation: "ব্যক্তিগত তথ্য",
      tenantName: "পূর্ণ নাম",
      tenantPhone: "ফোন নম্বর",
      tenantEmail: "ইমেইল ঠিকানা",
      nationalId: "জাতীয় পরিচয়পত্র",
      currentAddress: "বর্তমান ঠিকানা",
      emergencyContact: "জরুরি যোগাযোগ",
      emergencyContactName: "জরুরি যোগাযোগের নাম",
      emergencyContactPhone: "জরুরি যোগাযোগের ফোন",
      leaseDetails: "লিজের বিবরণ",
      selectProperty: "সম্পত্তি নির্বাচন করুন",
      selectPropertyPlaceholder: "একটি সম্পত্তি বেছে নিন",
      leaseStartDate: "লিজ শুরুর তারিখ",
      leaseEndDate: "লিজ শেষের তারিখ",
      securityDeposit: "নিরাপত্তা জামানত",
      additionalNotes: "অতিরিক্ত নোট",
      namePlaceholder: "ভাড়াটের পূর্ণ নাম লিখুন",
      phonePlaceholder: "ফোন নম্বর লিখুন",
      emailPlaceholder: "ইমেইল ঠিকানা লিখুন",
      nationalIdPlaceholder: "জাতীয় পরিচয়পত্র নম্বর লিখুন",
      addressPlaceholder: "বর্তমান ঠিকানা লিখুন",
      emergencyNamePlaceholder: "জরুরি যোগাযোগের নাম লিখুন",
      emergencyPhonePlaceholder: "জরুরি যোগাযোগের ফোন লিখুন",
      depositPlaceholder: "নিরাপত্তা জামানতের পরিমাণ লিখুন",
      notesPlaceholder: "কোনো অতিরিক্ত নোট বা প্রয়োজনীয়তা",
      saveTenant: "ভাড়াটে সংরক্ষণ করুন",
      // Send Reminder Modal
      sendReminderTitle: "অনুস্মারক পাঠান",
      reminderType: "অনুস্মারকের ধরন",
      recipients: "প্রাপক",
      selectRecipients: "প্রাপক নির্বাচন করুন",
      deliveryMethod: "প্রেরণের পদ্ধতি",
      messageContent: "বার্তার বিষয়বস্তু",
      useTemplate: "টেমপ্লেট ব্যবহার করুন",
      customMessage: "কাস্টম বার্তা",
      scheduleReminder: "অনুস্মারক নির্ধারণ করুন",
      sendNow: "এখনই পাঠান",
      sendLater: "পরে পাঠানোর জন্য নির্ধারণ করুন",
      selectDate: "তারিখ নির্বাচন করুন",
      selectTime: "সময় নির্বাচন করুন",
      sendReminder: "অনুস্মারক পাঠান",
      // Reminder Types
      rentDueReminder: "ভাড়া বকেয়ার অনুস্মারক",
      overdueRentReminder: "অতিরিক্ত বকেয়া ভাড়ার অনুস্মারক",
      leaseRenewalReminder: "লিজ নবায়নের অনুস্মারক",
      maintenanceReminder: "রক্ষণাবেক্ষণের অনুস্মারক",
      generalNotice: "সাধারণ নোটিশ",
      paymentConfirmation: "পেমেন্টের ধন্যবাদ",
      // Delivery Methods
      sms: "এসএমএস/টেক্সট",
      email: "ইমেইল",
      whatsapp: "হোয়াটসঅ্যাপ",
      inApp: "অ্যাপ নোটিফিকেশন",
      // Recipients Options
      allTenants: "সকল ভাড়াটে",
      overduePayments: "বকেয়া পেমেন্টের ভাড়াটে",
      upcomingRent: "আসন্ন ভাড়া বকেয়ার ভাড়াটে",
      specificProperty: "নির্দিষ্ট সম্পত্তির ভাড়াটে",
      individualTenant: "ব্যক্তিগত ভাড়াটে",
      // Message Templates
      rentDueTemplate: "হ্যালো [Name], [Property] এর ভাড়া [Date] তারিখে বকেয়া। পরিমাণ: ৳[Amount]। ধন্যবাদ!",
      overdueTemplate: "প্রিয় [Name], আপনার [Property] এর ভাড়া [Days] দিন বকেয়া। অনুগ্রহ করে দ্রুত যোগাযোগ করুন। পরিমাণ: ৳[Amount]",
      leaseRenewalTemplate: "প্রিয় [Name], আপনার [Property] এর লিজ [Date] তারিখে শেষ হবে। নবায়নের জন্য যোগাযোগ করুন।",
      maintenanceTemplate: "প্রিয় [Name], আমরা [Date] তারিখে [Property] তে রক্ষণাবেক্ষণ করব। অনুগ্রহ করে প্রবেশাধিকার নিশ্চিত করুন।",
      generalTemplate: "প্রিয় [Name], [Property] সম্পর্কে একটি গুরুত্বপূর্ণ আপডেট আছে। নিচের বিবরণ পড়ুন।",
      paymentThankYouTemplate: "ধন্যবাদ [Name], [Property] এর জন্য সময়মতো পেমেন্টের জন্য। আমরা আপনার সময়ানুবর্তিতার প্রশংসা করি!",
      customMessagePlaceholder: "এখানে আপনার কাস্টম বার্তা লিখুন...",
      previewMessage: "বার্তার পূর্বরূপ",
      estimatedCost: "আনুমানিক খরচ",
      smsPerMessage: "প্রতি বার্তায় এসএমএস",
      totalMessages: "মোট বার্তা",
      selectAtLeastOne: "অনুগ্রহ করে কমপক্ষে একজন প্রাপক নির্বাচন করুন",
      // Property Details Modal
      propertyDetailsTitle: "সম্পত্তির বিবরণ",
      propertyInformation: "সম্পত্তির তথ্য",
      currentTenant: "বর্তমান ভাড়াটে",
      noTenant: "কোনো বর্তমান ভাড়াটে নেই",
      propertyStats: "সম্পত্তির পরিসংখ্যান",
      totalRentCollected: "মোট সংগৃহীত ভাড়া",
      occupancyRate: "দখলের হার",
      averageStayDuration: "গড় অবস্থানের সময়কাল",
      months: "মাস",
      propertyAmenities: "সম্পত্তির সুবিধাসমূহ",
      recentPayments: "সাম্প্রতিক পেমেন্ট",
      maintenanceHistory: "রক্ষণাবেক্ষণের ইতিহাস",
      noPayments: "কোনো পেমেন্ট ইতিহাস নেই",
      noMaintenance: "কোনো রক্ষণাবেক্ষণের অনুরোধ নেই",
      editProperty: "সম্পত্তি সম্পাদনা করুন",
      deleteProperty: "সম্পত্তি মুছুন",
      addTenantToProperty: "সম্পত্তিতে ভাড়াটে যোগ করুন",
      markAsVacant: "খালি হিসেবে চিহ্নিত করুন",
      tenantDetails: "ভাড়াটের বিবরণ",
      leaseInformation: "লিজের তথ্য",
      leaseStart: "লিজ শুরু",
      leaseEnd: "লিজ শেষ",
      monthsRemaining: "মাস বাকি",
      securityDepositAmount: "নিরাপত্তা জামানত",
      contactTenant: "ভাড়াটের সাথে যোগাযোগ করুন",
      viewFullHistory: "সম্পূর্ণ ইতিহাস দেখুন",
      confirmMarkVacant: "আপনি কি নিশ্চিত যে এই সম্পত্তিটি খালি হিসেবে চিহ্নিত করতে চান?",
      thisWillRemoveTenant: "এটি বর্তমান ভাড়াটের নিয়োগ সরিয়ে দেবে।",
      propertyMarkedVacant: "সম্পত্তি সফলভাবে খালি হিসেবে চিহ্নিত হয়েছে!",
      fullHistoryFor: "সম্পূর্ণ ইতিহাস",
      totalPayments: "মোট পেমেন্ট",
      totalRentCollected: "মোট সংগৃহীত ভাড়া",
      lastPayment: "শেষ পেমেন্ট",
      totalMaintenanceRequests: "মোট রক্ষণাবেক্ষণের অনুরোধ",
      lastMaintenance: "শেষ রক্ষণাবেক্ষণ",
      noPaymentsYet: "এখনো কোনো পেমেন্ট নেই",
      noMaintenanceYet: "কোনো রক্ষণাবেক্ষণের অনুরোধ নেই",
      contactOptions: "যোগাযোগের বিকল্প",
      sampleMessage: "নমুনা বার্তা",
      sendSMS: "এসএমএস পাঠান",
      showAllOptions: "সকল বিকল্প দেখান",
      callTenant: "কল করুন",
      allContactOptions: "সকল যোগাযোগের বিকল্প",
      messageTemplate: "বার্তার টেমপ্লেট",
      // Assign Maintenance Modal
      assignMaintenanceTitle: "রক্ষণাবেক্ষণের কাজ বরাদ্দ করুন",
      requestDetails: "অনুরোধের বিবরণ",
      requestedBy: "অনুরোধকারী",
      requestDate: "অনুরোধের তারিখ",
      assignmentDetails: "বরাদ্দের বিবরণ",
      selectMaintenanceTeam: "রক্ষণাবেক্ষণ দল নির্বাচন করুন",
      electricalTeam: "বৈদ্যুতিক দল",
      plumbingTeam: "প্লাম্বিং দল",
      hardwareTeam: "হার্ডওয়্যার দল",
      hvacTeam: "এইচভিএসি দল",
      generalMaintenance: "সাধারণ রক্ষণাবেক্ষণ",
      teamAvailable: "উপলব্ধ",
      teamBusy: "ব্যস্ত",
      workPriority: "কাজের অগ্রাধিকার",
      urgent: "জরুরি",
      normal: "সাধারণ",
      low: "কম অগ্রাধিকার",
      specialInstructions: "বিশেষ নির্দেশাবলী",
      instructionsPlaceholder: "দলের জন্য কোনো বিশেষ নির্দেশাবলী (ঐচ্ছিক)",
      schedulingSection: "সময়সূচী",
      expectedCompletion: "প্রত্যাশিত সম্পন্নের তারিখ",
      costApprovalLimit: "খরচ অনুমোদনের সীমা",
      costLimitPlaceholder: "এই কাজের জন্য সর্বোচ্চ অনুমোদিত খরচ",
      scheduledVisit: "দলের ভিজিট নির্ধারণ করুন",
      visitDate: "ভিজিটের তারিখ",
      visitTime: "ভিজিটের সময়",
      notificationSettings: "নোটিফিকেশন সেটিংস",
      notifyTeam: "এসএমএসের মাধ্যমে দলকে জানান",
      notifyTenant: "ভাড়াটেকে দলের ভিজিট সম্পর্কে জানান",
      assignWork: "কাজ বরাদ্দ করুন",
      teamContactInfo: "দলের যোগাযোগের তথ্য",
      teamLeader: "দলনেতা",
      teamPhone: "দলের ফোন",
      teamSpecialization: "বিশেষত্ব",
      teamAvailability: "উপলব্ধতা",
      costPerHour: "ঘন্টা প্রতি খরচ",
      // Team Information
      electricalTeamLeader: "রশিদ আহমেদ (ইলেকট্রিশিয়ান)",
      electricalTeamPhone: "০১৭১১-১২৩৪৫৬",
      electricalSpecialization: "তারের কাজ, লাইটিং, আউটলেট, সার্কিটের সমস্যা",
      plumbingTeamLeader: "কামাল হাসান (প্লাম্বার)",
      plumbingTeamPhone: "০১৭১২-২৩৪৫৬৭",
      plumbingSpecialization: "পাইপ, টয়লেট, পানি লিক, ড্রেনেজ",
      hardwareTeamLeader: "আব্দুল কাদের (টেকনিশিয়ান)",
      hardwareTeamPhone: "০১৭১৩-৩৪৫৬৭৮",
      hardwareSpecialization: "দরজা, জানালা, তালা, কবজা",
      hvacTeamLeader: "নজরুল ইসলাম (এসি টেকনিশিয়ান)",
      hvacTeamPhone: "০১৭১৪-৪৫৬৭৮৯",
      hvacSpecialization: "এয়ার কন্ডিশনিং, হিটিং, বায়ু চলাচল",
      generalTeamLeader: "ফারুক মিয়া (কারিগর)",
      generalTeamPhone: "০১৭১৫-৫৬৭৮৯০",
      generalSpecialization: "রং, পরিষ্কার, ছোট মেরামত, সাধারণ কাজ"
    }
  }

  const t = translations[language]

  // Calculate stats from live data
  const monthlyIncome = tenants.reduce((sum, tenant) => sum + (tenant.rent_amount || 0), 0)
  const dashboardStats = {
    totalProperties: properties.length,
    totalTenants: tenants.length,
    monthlyIncome: monthlyIncome,
    pendingPayments: payments.filter(p => p.status === 'pending').length
  }

  // Get available properties for tenant assignment
  const availableProperties = properties.filter(property => !tenants.some(t => t.property_id === property.id))

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      case 'occupied': return 'text-green-600 bg-green-100'
      case 'vacant': return 'text-gray-600 bg-gray-100'
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  const handleAddProperty = () => {
    setShowAddPropertyModal(true)
  }

  const handleAddTenant = () => {
    setShowAddTenantModal(true)
  }

  const handleSendReminder = () => {
    setShowSendReminderModal(true)
  }

  const handleViewPropertyDetails = (property) => {
    setSelectedProperty(property)
    setShowPropertyDetailsModal(true)
  }

  const handleClosePropertyDetailsModal = () => {
    setShowPropertyDetailsModal(false)
    setSelectedProperty(null)
  }

  const handleContactTenant = (tenant) => {
    if (tenant) {
      const phoneNumber = tenant.phone
      const tenantEmail = tenants.find(t => t.name === tenant.name)?.email || 'Not provided'
      const message = `Hello ${tenant.name}, this is regarding your rental property at ${selectedProperty.address}. Please let me know if you have any questions or concerns.`
      
      // Create contact options
      const contactOptions = [
        `📞 ${t.callTenant}: ${phoneNumber}`,
        `📱 SMS: ${phoneNumber}`,
        `📧 Email: ${tenantEmail}`
      ].join('\n')
      
      const contactMessage = `${t.contactOptions} ${tenant.name}:\n\n${contactOptions}\n\n${t.sampleMessage}:\n"${message}"\n\nWould you like to:`
      
      // On mobile, try to open SMS directly
      if (window.innerWidth <= 768) {
        if (confirm(`${contactMessage}\n\n• OK - ${t.sendSMS}\n• Cancel - ${t.showAllOptions}`)) {
          window.open(`sms:${phoneNumber}?body=${encodeURIComponent(message)}`)
        } else {
          alert(`${t.allContactOptions}:\n\n${contactOptions}\n\n${t.messageTemplate}:\n"${message}"`)
        }
      } else {
        // On desktop, show all options
        if (confirm(`${contactMessage}\n\n• OK - ${t.callTenant} ${phoneNumber}\n• Cancel - ${t.showAllOptions}`)) {
          window.open(`tel:${phoneNumber}`)
        } else {
          alert(`${t.allContactOptions}:\n\n${contactOptions}\n\n${t.messageTemplate}:\n"${message}"`)
        }
      }
    }
  }

  const handleEditProperty = (property) => {
    // Pre-populate the add property modal with existing data for editing
    setNewProperty({
      address: property.address,
      propertyType: property.type,
      bedrooms: property.bedrooms.toString(),
      bathrooms: property.bathrooms.toString(),
      rent: property.rent.toString(),
      description: property.description,
      amenities: property.amenities,
      photos: [] // In a real app, this would load existing photos
    })
    setShowPropertyDetailsModal(false)
    setShowAddPropertyModal(true)
  }

  const handleMarkAsVacant = (property) => {
    if (confirm(`${t.confirmMarkVacant}\n\n"${property.address}"\n\n${t.thisWillRemoveTenant}`)) {
      // In a real app, this would make an API call to update the property status
      console.log('Marking property as vacant:', property.id)
      
      // Update the property status locally for demo
      const updatedProperty = { ...property, status: 'vacant', tenant: '' }
      setSelectedProperty(updatedProperty)
      
      alert(t.propertyMarkedVacant)
    }
  }

  const handleAddTenantToProperty = (property) => {
    // Pre-populate tenant form with selected property
    setNewTenant(prev => ({
      ...prev,
      selectedProperty: property.id.toString(),
      rentAmount: property.rent.toString()
    }))
    setShowPropertyDetailsModal(false)
    setShowAddTenantModal(true)
  }

  const handleViewFullHistory = (property) => {
    // In a real app, this would navigate to a dedicated history page
    // For now, we'll show a comprehensive summary
    const propertyPayments = payments.filter(p => p.property.includes(property.address.split(',')[0]))
    const propertyMaintenance = maintenanceRequests.filter(m => m.property.includes(property.address.split(',')[0]))
    
    const historyData = {
      property: property.address,
      totalPayments: propertyPayments.length,
      totalMaintenanceRequests: propertyMaintenance.length,
      totalRentCollected: propertyPayments.reduce((sum, p) => sum + p.amount, 0),
      lastPayment: propertyPayments[0]?.date || t.noPaymentsYet,
      lastMaintenance: propertyMaintenance[0]?.date || t.noMaintenanceYet
    }
    
    alert(`${t.fullHistoryFor} ${property.address}:\n\n` +
          `${t.totalPayments}: ${historyData.totalPayments}\n` +
          `${t.totalRentCollected}: ${t.taka}${historyData.totalRentCollected.toLocaleString()}\n` +
          `${t.lastPayment}: ${historyData.lastPayment}\n\n` +
          `${t.totalMaintenanceRequests}: ${historyData.totalMaintenanceRequests}\n` +
          `${t.lastMaintenance}: ${historyData.lastMaintenance}\n\n` +
          `${t.occupancyRate}: ${property.occupancyRate}%`)
  }

  const handleAssignMaintenance = (request) => {
    setSelectedMaintenanceRequest(request)
    setShowResolveMaintenanceModal(true)
  }

  const handleCloseAssignMaintenanceModal = () => {
    setShowResolveMaintenanceModal(false)
    setSelectedMaintenanceRequest(null)
    setMaintenanceAssignment({
      selectedTeam: '',
      priority: 'normal',
      specialInstructions: '',
      expectedCompletionDate: '',
      costApprovalLimit: '',
      notifyTenant: true,
      notifyTeam: true,
      scheduledDate: '',
      scheduledTime: ''
    })
  }

  const handleMaintenanceAssignmentChange = (field, value) => {
    setMaintenanceAssignment(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAssignMaintenanceWork = () => {
    // Validation
    if (!maintenanceAssignment.selectedTeam) {
      alert('Please select a maintenance team')
      return
    }

    if (!maintenanceAssignment.expectedCompletionDate) {
      alert('Please set expected completion date')
      return
    }

    // Get selected team info
    const selectedTeam = maintenanceTeams[maintenanceAssignment.selectedTeam]

    // In a real app, this would make an API call to assign the work
    const assignmentData = {
      ...maintenanceAssignment,
      requestId: selectedMaintenanceRequest.id,
      teamInfo: selectedTeam,
      assignedBy: 'Karim Rahman', // Current landlord
      assignedDate: new Date().toISOString(),
      request: selectedMaintenanceRequest,
      status: 'assigned'
    }

    console.log('Assigning maintenance work:', assignmentData)

    // Simulate notifications
    if (maintenanceAssignment.notifyTeam) {
      console.log(`SMS sent to team: ${selectedTeam.phone}`)
    }
    if (maintenanceAssignment.notifyTenant) {
      console.log(`Tenant notification sent about team visit`)
    }
    
    // Close modal and reset form
    handleCloseAssignMaintenanceModal()
    
    // Show success message
    alert(`Work assigned successfully to ${selectedTeam.name}!\n\nTeam Leader: ${selectedTeam.leader}\nPhone: ${selectedTeam.phone}\nExpected Completion: ${maintenanceAssignment.expectedCompletionDate}`)
  }

  const handleCloseModal = () => {
    setShowAddPropertyModal(false)
    setNewProperty({
      address: '',
      propertyType: 'house',
      bedrooms: '',
      bathrooms: '',
      rent: '',
      description: '',
      amenities: [],
      photos: []
    })
    setDragOver(false)
  }

  const handleCloseTenantModal = () => {
    setShowAddTenantModal(false)
    setNewTenant({
      name: '',
      phone: '',
      email: '',
      nationalId: '',
      currentAddress: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      selectedProperty: '',
      leaseStartDate: '',
      leaseEndDate: '',
      rentAmount: '',
      securityDeposit: '',
      notes: ''
    })
  }

  const handleCloseReminderModal = () => {
    setShowSendReminderModal(false)
    setReminder({
      type: 'rent_due',
      recipients: [],
      deliveryMethod: 'sms',
      customMessage: '',
      useTemplate: true,
      scheduledDate: '',
      scheduledTime: ''
    })
  }

  const handleInputChange = (field, value) => {
    setNewProperty(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTenantInputChange = (field, value) => {
    setNewTenant(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleReminderInputChange = (field, value) => {
    setReminder(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRecipientToggle = (recipientId, recipientType) => {
    setReminder(prev => {
      const exists = prev.recipients.find(r => r.id === recipientId && r.type === recipientType)
      if (exists) {
        return {
          ...prev,
          recipients: prev.recipients.filter(r => !(r.id === recipientId && r.type === recipientType))
        }
      } else {
        return {
          ...prev,
          recipients: [...prev.recipients, { id: recipientId, type: recipientType }]
        }
      }
    })
  }

  const handleAmenityToggle = (amenity) => {
    setNewProperty(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleSaveProperty = async () => {
    // Validation
    if (!newProperty.address || !newProperty.rent || !newProperty.bedrooms || !newProperty.bathrooms) {
      alert(t.required)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('You must be logged in to add a property.')
      return
    }

    // In a real app, this would make an API call
    const { data, error } = await supabase
      .from('properties')
      .insert([
        { 
          owner_id: user.id,
          address: newProperty.address,
          property_type: newProperty.propertyType,
          bedrooms: newProperty.bedrooms,
          bathrooms: newProperty.bathrooms,
          rent: newProperty.rent,
          description: newProperty.description,
          amenities: newProperty.amenities,
          photos: newProperty.photos.map(p => p.name) // Just storing names for now
        }
      ])
      .select()

    if (error) {
      console.error('Error adding property:', error)
      alert('Failed to add property.')
      return
    }
    
    // Add the new property to the local state
    setProperties(prev => [...prev, ...data])

    // Close modal and reset form
    handleCloseModal()
    
    // Show success message (you could add a toast notification here)
    alert('Property added successfully!')
  }

  const handleSaveTenant = async () => {
    // Validation
    if (!newTenant.name || !newTenant.phone || !newTenant.selectedProperty || !newTenant.leaseStartDate) {
      alert(t.required)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('You must be logged in to add a tenant.')
      return
    }

    const { data, error } = await supabase
      .from('tenants')
      .insert([
        { 
          landlord_id: user.id,
          property_id: newTenant.selectedProperty,
          name: newTenant.name,
          phone: newTenant.phone,
          email: newTenant.email,
          national_id: newTenant.nationalId,
          lease_start_date: newTenant.leaseStartDate,
          lease_end_date: newTenant.leaseEndDate,
          rent_amount: newTenant.rentAmount,
          security_deposit: newTenant.securityDeposit,
        }
      ])
      .select()
      
    if (error) {
      console.error('Error adding tenant:', error)
      alert('Failed to add tenant.')
      return
    }
    
    setTenants(prev => [...prev, ...data])
    
    // Close modal and reset form
    handleCloseTenantModal()
    
    // Show success message (you could add a toast notification here)
    alert('Tenant added successfully!')
  }

  const getTemplateMessage = (type) => {
    const templates = {
      rent_due: t.rentDueTemplate,
      overdue_rent: t.overdueTemplate,
      lease_renewal: t.leaseRenewalTemplate,
      maintenance: t.maintenanceTemplate,
      general_notice: t.generalTemplate,
      payment_confirmation: t.paymentThankYouTemplate
    }
    return templates[type] || t.generalTemplate
  }

  const handleSendReminderAction = () => {
    // Validation
    if (reminder.recipients.length === 0) {
      alert(t.selectAtLeastOne)
      return
    }

    // Get message content
    const messageContent = reminder.useTemplate 
      ? getTemplateMessage(reminder.type)
      : reminder.customMessage

    if (!messageContent.trim()) {
      alert('Please provide a message')
      return
    }

    // In a real app, this would make an API call
    const reminderData = {
      ...reminder,
      message: messageContent,
      recipientCount: reminder.recipients.length,
      timestamp: new Date().toISOString()
    }
    
    console.log('Sending reminder:', reminderData)
    
    // Close modal and reset form
    handleCloseReminderModal()
    
    // Show success message
    alert(`Reminder sent successfully to ${reminder.recipients.length} recipient(s)!`)
  }

  const validateFile = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!validTypes.includes(file.type)) {
      alert(t.invalidFileType)
      return false
    }

    if (file.size > maxSize) {
      alert(t.fileTooLarge)
      return false
    }

    return true
  }

  const handlePhotoSelect = (files) => {
    const fileArray = Array.from(files)
    const currentPhotosCount = newProperty.photos.length
    
    if (currentPhotosCount + fileArray.length > 10) {
      alert(t.maxPhotos)
      return
    }

    const validFiles = fileArray.filter(validateFile)
    
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newPhoto = {
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target.result,
          name: file.name
        }
        
        setNewProperty(prev => ({
          ...prev,
          photos: [...prev.photos, newPhoto]
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const handlePhotoRemove = (photoId) => {
    setNewProperty(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    handlePhotoSelect(files)
  }

  const StatCard = ({ title, value, icon, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200 hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
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
          title={t.totalProperties} 
          value={dashboardStats.totalProperties} 
          icon="🏠" 
        />
        <StatCard 
          title={t.totalTenants} 
          value={dashboardStats.totalTenants} 
          icon="👥" 
        />
        <StatCard 
          title={t.monthlyIncome} 
          value={`${t.taka}${dashboardStats.monthlyIncome.toLocaleString()}`} 
          icon="💰" 
        />
        <StatCard 
          title={t.pendingPayments} 
          value={dashboardStats.pendingPayments} 
          icon="⏰" 
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
            onClick={handleAddProperty}
            className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <span className="text-2xl mb-2">🏠</span>
            <span className="text-sm font-medium text-slate-700">{t.addProperty}</span>
          </button>
          <button 
            onClick={handleAddTenant}
            className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <span className="text-2xl mb-2">👤</span>
            <span className="text-sm font-medium text-slate-700">{t.addTenant}</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all">
            <span className="text-2xl mb-2">💳</span>
            <span className="text-sm font-medium text-slate-700">{t.recordPayment}</span>
          </button>
          <button 
            onClick={handleSendReminder}
            className="flex flex-col items-center p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <span className="text-2xl mb-2">📲</span>
            <span className="text-sm font-medium text-slate-700">{t.sendReminder}</span>
          </button>
        </div>
      </motion.div>

      {/* Recent Activity - Placeholder, as we don't have a dedicated activity table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
      >
        <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.recentActivity}</h3>
        <p className="text-slate-500 text-sm">Recent activity feed will be implemented here.</p>
      </motion.div>
    </div>
  )

  const renderProperties = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-6">{t.propertyList}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.address}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.tenant}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.rent}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.status}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-800">{property.address}</td>
                <td className="py-3 px-4 text-slate-600">{property.tenant_name || '-'}</td>
                <td className="py-3 px-4 text-slate-800">{t.taka}{property.rent.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status || 'vacant')}`}>
                    {property.status === 'occupied' ? t.occupied : t.vacant}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => handleViewPropertyDetails(property)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {t.viewDetails}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  const renderTenants = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-6">{t.tenantList}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.tenant}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.phone}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.property}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.rent}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.status}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-800 font-medium">{tenant.name}</td>
                <td className="py-3 px-4 text-slate-600">{tenant.phone}</td>
                <td className="py-3 px-4 text-slate-600">{tenant.property}</td>
                <td className="py-3 px-4 text-slate-800">{t.taka}{tenant.rent.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                    {tenant.status === 'paid' ? t.paid : tenant.status === 'pending' ? t.pending : t.overdue}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {t.contact}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  const renderPayments = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-6">{t.paymentHistory}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.date}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.tenant}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.property}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.amount}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-600">{payment.date}</td>
                <td className="py-3 px-4 text-slate-800 font-medium">{payment.tenant}</td>
                <td className="py-3 px-4 text-slate-600">{payment.property}</td>
                <td className="py-3 px-4 text-slate-800 font-semibold">{t.taka}{payment.amount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status === 'paid' ? t.paid : payment.status === 'pending' ? t.pending : t.overdue}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  const renderMaintenance = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200"
    >
      <h3 className="text-lg font-semibold text-slate-800 mb-6">{t.maintenanceList}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.tenant}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.property}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.issue}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.priority}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.requestDate}</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">{t.action}</th>
            </tr>
          </thead>
          <tbody>
            {maintenanceRequests.map((request) => (
              <tr key={request.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4 text-slate-800 font-medium">{request.tenant}</td>
                <td className="py-3 px-4 text-slate-600">{request.property}</td>
                <td className="py-3 px-4 text-slate-800">{request.issue}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.priority)}`}>
                    {request.priority === 'high' ? t.high : request.priority === 'medium' ? t.medium : t.low}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600">{request.date}</td>
                <td className="py-3 px-4">
                  <button 
                    onClick={() => handleAssignMaintenance(request)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {t.assign}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-slate-200/30 to-blue-200/20 rounded-full backdrop-blur-sm animate-slow-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-slate-200/30 rounded-full backdrop-blur-sm animate-float"></div>
        <div className="absolute top-1/2 left-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl animate-slow-pulse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {t.welcome}, {userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : ''}
            </h1>
            <p className="text-slate-600">{t.subtitle}</p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-slate-200 inline-flex">
              {[
                { key: 'overview', label: t.overview, icon: '📊' },
                { key: 'properties', label: t.properties, icon: '🏠' },
                { key: 'tenants', label: t.tenants, icon: '👥' },
                { key: 'payments', label: t.payments, icon: '💰' },
                { key: 'maintenance', label: t.maintenance, icon: '🔧' }
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

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'properties' && renderProperties()}
            {activeTab === 'tenants' && renderTenants()}
            {activeTab === 'payments' && renderPayments()}
            {activeTab === 'maintenance' && renderMaintenance()}
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      {showAddPropertyModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">{t.addPropertyTitle}</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Property Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.propertyAddress} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newProperty.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={t.addressPlaceholder}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.propertyType}
                </label>
                <select
                  value={newProperty.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="house">{t.house}</option>
                  <option value="apartment">{t.apartment}</option>
                  <option value="flat">{t.flat}</option>
                  <option value="room">{t.room}</option>
                </select>
              </div>

              {/* Bedrooms and Bathrooms */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.bedrooms} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProperty.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.bathrooms} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProperty.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Monthly Rent */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.monthlyRent} ({t.taka}) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={newProperty.rent}
                  onChange={(e) => handleInputChange('rent', e.target.value)}
                  placeholder={t.rentPlaceholder}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Property Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.propertyDescription}
                </label>
                <textarea
                  value={newProperty.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder={t.descriptionPlaceholder}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  {t.amenities}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { key: 'parking', label: t.parking, icon: '🚗' },
                    { key: 'garden', label: t.garden, icon: '🌳' },
                    { key: 'balcony', label: t.balcony, icon: '🏗️' },
                    { key: 'furnished', label: t.furnished, icon: '🛋️' },
                    { key: 'airConditioning', label: t.airConditioning, icon: '❄️' },
                    { key: 'internet', label: t.internet, icon: '📶' },
                    { key: 'security', label: t.security, icon: '🔒' },
                    { key: 'elevator', label: t.elevator, icon: '🛗' }
                  ].map((amenity) => (
                    <label
                      key={amenity.key}
                      className="flex items-center space-x-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={newProperty.amenities.includes(amenity.key)}
                        onChange={() => handleAmenityToggle(amenity.key)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-lg">{amenity.icon}</span>
                      <span className="text-sm text-slate-700 group-hover:text-slate-900">
                        {amenity.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Photos */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  {t.propertyPhotos}
                </label>
                
                {/* Photo Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                    dragOver 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                  onClick={() => document.getElementById('photo-input').click()}
                >
                  <input
                    id="photo-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handlePhotoSelect(e.target.files)}
                    className="hidden"
                  />
                  
                  <div className="flex flex-col items-center space-y-2">
                    <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-600 font-medium">{t.dragDropPhotos}</p>
                    <p className="text-xs text-slate-500">{t.supportedFormats}</p>
                    <p className="text-xs text-slate-500">
                      {newProperty.photos.length}/10 {t.propertyPhotos.toLowerCase()}
                    </p>
                  </div>
                </div>

                {/* Photo Previews */}
                {newProperty.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {newProperty.photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                          <img
                            src={photo.preview}
                            alt={photo.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePhotoRemove(photo.id)
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
                          title={t.removePhoto}
                        >
                          ×
                        </button>
                        <p className="mt-1 text-xs text-slate-600 truncate" title={photo.name}>
                          {photo.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSaveProperty}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  {t.save}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Tenant Modal */}
      {showAddTenantModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">{t.addTenantTitle}</h2>
                <button
                  onClick={handleCloseTenantModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <span className="text-blue-600 mr-2">👤</span>
                  {t.personalInformation}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.tenantName} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newTenant.name}
                      onChange={(e) => handleTenantInputChange('name', e.target.value)}
                      placeholder={t.namePlaceholder}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.tenantPhone} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={newTenant.phone}
                      onChange={(e) => handleTenantInputChange('phone', e.target.value)}
                      placeholder={t.phonePlaceholder}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.tenantEmail}
                    </label>
                    <input
                      type="email"
                      value={newTenant.email}
                      onChange={(e) => handleTenantInputChange('email', e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.nationalId}
                    </label>
                    <input
                      type="text"
                      value={newTenant.nationalId}
                      onChange={(e) => handleTenantInputChange('nationalId', e.target.value)}
                      placeholder={t.nationalIdPlaceholder}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.currentAddress}
                  </label>
                  <textarea
                    value={newTenant.currentAddress}
                    onChange={(e) => handleTenantInputChange('currentAddress', e.target.value)}
                    placeholder={t.addressPlaceholder}
                    rows={2}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <span className="text-red-600 mr-2">🚨</span>
                  {t.emergencyContact}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.emergencyContactName}
                    </label>
                    <input
                      type="text"
                      value={newTenant.emergencyContactName}
                      onChange={(e) => handleTenantInputChange('emergencyContactName', e.target.value)}
                      placeholder={t.emergencyNamePlaceholder}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.emergencyContactPhone}
                    </label>
                    <input
                      type="tel"
                      value={newTenant.emergencyContactPhone}
                      onChange={(e) => handleTenantInputChange('emergencyContactPhone', e.target.value)}
                      placeholder={t.emergencyPhonePlaceholder}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Lease Details Section */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">📋</span>
                  {t.leaseDetails}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.selectProperty} <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newTenant.selectedProperty}
                      onChange={(e) => {
                        const selectedProp = properties.find(p => p.id.toString() === e.target.value)
                        handleTenantInputChange('selectedProperty', e.target.value)
                        if (selectedProp) {
                          handleTenantInputChange('rentAmount', selectedProp.rent.toString())
                        }
                      }}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">{t.selectPropertyPlaceholder}</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.address} - {t.taka}{property.rent.toLocaleString()}
                          {property.status === 'occupied' ? ' (Currently Occupied)' : ' (Available)'}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t.leaseStartDate} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={newTenant.leaseStartDate}
                        onChange={(e) => handleTenantInputChange('leaseStartDate', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t.leaseEndDate}
                      </label>
                      <input
                        type="date"
                        value={newTenant.leaseEndDate}
                        onChange={(e) => handleTenantInputChange('leaseEndDate', e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t.monthlyRent} ({t.taka})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newTenant.rentAmount}
                        onChange={(e) => handleTenantInputChange('rentAmount', e.target.value)}
                        placeholder={t.rentPlaceholder}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {t.securityDeposit} ({t.taka})
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={newTenant.securityDeposit}
                        onChange={(e) => handleTenantInputChange('securityDeposit', e.target.value)}
                        placeholder={t.depositPlaceholder}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.additionalNotes}
                </label>
                <textarea
                  value={newTenant.notes}
                  onChange={(e) => handleTenantInputChange('notes', e.target.value)}
                  placeholder={t.notesPlaceholder}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseTenantModal}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleSaveTenant}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  {t.saveTenant}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Send Reminder Modal */}
      {showSendReminderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">{t.sendReminderTitle}</h2>
                <button
                  onClick={handleCloseReminderModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Reminder Type & Delivery Method */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Reminder Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    {t.reminderType}
                  </label>
                  <select
                    value={reminder.type}
                    onChange={(e) => handleReminderInputChange('type', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="rent_due">📅 {t.rentDueReminder}</option>
                    <option value="overdue_rent">⚠️ {t.overdueRentReminder}</option>
                    <option value="lease_renewal">📋 {t.leaseRenewalReminder}</option>
                    <option value="maintenance">🔧 {t.maintenanceReminder}</option>
                    <option value="payment_confirmation">✅ {t.paymentConfirmation}</option>
                    <option value="general_notice">📢 {t.generalNotice}</option>
                  </select>
                </div>

                {/* Delivery Method */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    {t.deliveryMethod}
                  </label>
                  <select
                    value={reminder.deliveryMethod}
                    onChange={(e) => handleReminderInputChange('deliveryMethod', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="sms">📱 {t.sms}</option>
                    <option value="email">📧 {t.email}</option>
                    <option value="whatsapp">💬 {t.whatsapp}</option>
                    <option value="inApp">�� {t.inApp}</option>
                  </select>
                </div>
              </div>

              {/* Recipients Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  {t.recipients} ({reminder.recipients.length} selected)
                </label>
                
                {/* Quick Select Options */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  <button
                    onClick={() => {
                      const allTenantIds = tenants.map(t => ({ id: t.id, type: 'tenant' }))
                      setReminder(prev => ({ ...prev, recipients: allTenantIds }))
                    }}
                    className="flex items-center justify-center p-3 border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-sm"
                  >
                    👥 {t.allTenants}
                  </button>
                  <button
                    onClick={() => {
                      const overdueIds = tenants.filter(t => t.status === 'overdue').map(t => ({ id: t.id, type: 'tenant' }))
                      setReminder(prev => ({ ...prev, recipients: overdueIds }))
                    }}
                    className="flex items-center justify-center p-3 border border-slate-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-all text-sm"
                  >
                    ⚠️ {t.overduePayments}
                  </button>
                  <button
                    onClick={() => {
                      const pendingIds = tenants.filter(t => t.status === 'pending').map(t => ({ id: t.id, type: 'tenant' }))
                      setReminder(prev => ({ ...prev, recipients: pendingIds }))
                    }}
                    className="flex items-center justify-center p-3 border border-slate-300 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-all text-sm"
                  >
                    ⏰ {t.upcomingRent}
                  </button>
                </div>

                {/* Individual Tenant Selection */}
                <div className="border border-slate-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">{t.individualTenant}</h4>
                  <div className="space-y-2">
                    {tenants.map((tenant) => (
                      <label key={tenant.id} className="flex items-center space-x-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={reminder.recipients.some(r => r.id === tenant.id && r.type === 'tenant')}
                          onChange={() => handleRecipientToggle(tenant.id, 'tenant')}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 group-hover:text-slate-900">
                            {tenant.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {tenant.property} • {tenant.phone} • 
                            <span className={`ml-1 px-1 rounded text-xs ${getStatusColor(tenant.status)}`}>
                              {tenant.status === 'paid' ? t.paid : tenant.status === 'pending' ? t.pending : t.overdue}
                            </span>
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  {t.messageContent}
                </label>
                
                {/* Template Toggle */}
                <div className="flex items-center space-x-4 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={reminder.useTemplate}
                      onChange={() => handleReminderInputChange('useTemplate', true)}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">{t.useTemplate}</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={!reminder.useTemplate}
                      onChange={() => handleReminderInputChange('useTemplate', false)}
                      className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">{t.customMessage}</span>
                  </label>
                </div>

                {/* Template Preview or Custom Message */}
                {reminder.useTemplate ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-slate-700 mb-2">{t.previewMessage}:</p>
                    <p className="text-sm text-slate-600 italic">
                      {getTemplateMessage(reminder.type)}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      * [Name], [Property], [Date], [Amount], [Days] will be automatically replaced with actual values
                    </p>
                  </div>
                ) : (
                  <textarea
                    value={reminder.customMessage}
                    onChange={(e) => handleReminderInputChange('customMessage', e.target.value)}
                    placeholder={t.customMessagePlaceholder}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  />
                )}
              </div>

              {/* Schedule Options */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  {t.scheduleReminder}
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={!reminder.scheduledDate}
                          onChange={() => {
                            handleReminderInputChange('scheduledDate', '')
                            handleReminderInputChange('scheduledTime', '')
                          }}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">{t.sendNow}</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          checked={!!reminder.scheduledDate}
                          onChange={() => {
                            const tomorrow = new Date()
                            tomorrow.setDate(tomorrow.getDate() + 1)
                            handleReminderInputChange('scheduledDate', tomorrow.toISOString().split('T')[0])
                            handleReminderInputChange('scheduledTime', '09:00')
                          }}
                          className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">{t.sendLater}</span>
                      </label>
                    </div>
                  </div>
                  
                  {reminder.scheduledDate && (
                    <>
                      <div>
                        <input
                          type="date"
                          value={reminder.scheduledDate}
                          onChange={(e) => handleReminderInputChange('scheduledDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <input
                          type="time"
                          value={reminder.scheduledTime}
                          onChange={(e) => handleReminderInputChange('scheduledTime', e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Cost Estimation */}
              {reminder.deliveryMethod === 'sms' && reminder.recipients.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">{t.estimatedCost}</h4>
                  <div className="text-sm text-blue-700">
                    <p>{reminder.recipients.length} {t.totalMessages} × ৳2.50 {t.smsPerMessage} = ৳{(reminder.recipients.length * 2.5).toFixed(2)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-600">
                  {reminder.recipients.length > 0 && (
                    <span>Ready to send to {reminder.recipients.length} recipient(s)</span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCloseReminderModal}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleSendReminderAction}
                    disabled={reminder.recipients.length === 0}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {reminder.scheduledDate ? `📅 ${t.sendLater}` : `📲 ${t.sendReminder}`}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Property Details Modal */}
      {showPropertyDetailsModal && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">{t.propertyDetailsTitle}</h2>
                <button
                  onClick={handleClosePropertyDetailsModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Property Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.propertyInformation}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-600">{t.address}:</span>
                      <span className="text-slate-800 text-right">{selectedProperty.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-600">{t.propertyType}:</span>
                      <span className="text-slate-800">{selectedProperty.property_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-600">{t.bedrooms}:</span>
                      <span className="text-slate-800">{selectedProperty.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-600">{t.bathrooms}:</span>
                      <span className="text-slate-800">{selectedProperty.bathrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-600">{t.monthlyRent}:</span>
                      <span className="text-slate-800 font-semibold">{t.taka}{(selectedProperty.rent || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.propertyAmenities}</h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProperty.amenities || []).map((amenity, i) => (
                      <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{amenity}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Tenant & Stats */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.currentTenant}</h3>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-600">{t.noTenant}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">{t.propertyStats}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-600">{t.totalRentCollected}:</span>
                      <span className="text-slate-800">{t.taka}0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-600">{t.occupancyRate}:</span>
                      <span className="text-slate-800">0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-xl">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleEditProperty(selectedProperty)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  {t.editProperty}
                </button>
                <button
                  onClick={() => { /* Add delete logic here */ }}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg transition-colors"
                >
                  {t.deleteProperty}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Assign Maintenance Modal */}
      {showResolveMaintenanceModal && selectedMaintenanceRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">{t.assignMaintenanceTitle}</h2>
                  <p className="text-sm text-slate-600 mt-1">Request #{selectedMaintenanceRequest.id}</p>
                </div>
                <button
                  onClick={handleCloseAssignMaintenanceModal}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Original Request Details */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <span className="text-blue-600 mr-2">📋</span>
                  {t.requestDetails}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.requestedBy}</label>
                    <p className="text-slate-800">{selectedMaintenanceRequest.tenant}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.property}</label>
                    <p className="text-slate-800">{selectedMaintenanceRequest.property}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.requestDate}</label>
                    <p className="text-slate-800">{selectedMaintenanceRequest.date}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.priority}</label>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedMaintenanceRequest.priority)}`}>
                      {selectedMaintenanceRequest.priority === 'high' ? t.high : 
                       selectedMaintenanceRequest.priority === 'medium' ? t.medium : t.low}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.issue}</label>
                  <p className="text-slate-800 bg-white p-3 rounded border">{selectedMaintenanceRequest.issue}</p>
                </div>
              </div>

              {/* Team Selection */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <span className="text-orange-600 mr-2">👷</span>
                  {t.assignmentDetails}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.selectMaintenanceTeam} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={maintenanceAssignment.selectedTeam}
                    onChange={(e) => handleMaintenanceAssignmentChange('selectedTeam', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select a team...</option>
                    {Object.values(maintenanceTeams).map((team) => (
                      <option key={team.id} value={team.id} disabled={team.availability === 'busy'}>
                        {team.icon} {team.name} - {team.availability === 'available' ? t.teamAvailable : t.teamBusy}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Team Information Display */}
                {maintenanceAssignment.selectedTeam && (
                  <div className="mt-4 bg-white border border-slate-200 rounded-lg p-4">
                    <h4 className="font-medium text-slate-800 mb-3">{t.teamContactInfo}</h4>
                    {(() => {
                      const team = maintenanceTeams[maintenanceAssignment.selectedTeam]
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">{t.teamLeader}:</span>
                            <p className="font-medium">{team.leader}</p>
                          </div>
                          <div>
                            <span className="text-slate-600">{t.teamPhone}:</span>
                            <p className="font-medium">{team.phone}</p>
                          </div>
                          <div className="md:col-span-2">
                            <span className="text-slate-600">{t.teamSpecialization}:</span>
                            <p className="font-medium">{team.specialization}</p>
                          </div>
                          <div>
                            <span className="text-slate-600">{t.teamAvailability}:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              team.availability === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {team.availability === 'available' ? t.teamAvailable : t.teamBusy}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-600">{t.costPerHour}:</span>
                            <p className="font-medium">{t.taka}{team.costPerHour}/hour</p>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                )}
              </div>

              {/* Priority and Instructions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.workPriority}
                  </label>
                  <select
                    value={maintenanceAssignment.priority}
                    onChange={(e) => handleMaintenanceAssignmentChange('priority', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="low">🔵 {t.low}</option>
                    <option value="normal">🟡 {t.normal}</option>
                    <option value="urgent">🔴 {t.urgent}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t.expectedCompletion} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={maintenanceAssignment.expectedCompletionDate}
                    onChange={(e) => handleMaintenanceAssignmentChange('expectedCompletionDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t.specialInstructions}
                </label>
                <textarea
                  value={maintenanceAssignment.specialInstructions}
                  onChange={(e) => handleMaintenanceAssignmentChange('specialInstructions', e.target.value)}
                  placeholder={t.instructionsPlaceholder}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              {/* Cost and Scheduling */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <span className="text-green-600 mr-2">📅</span>
                  {t.schedulingSection}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.costApprovalLimit} ({t.taka})
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={maintenanceAssignment.costApprovalLimit}
                      onChange={(e) => handleMaintenanceAssignmentChange('costApprovalLimit', e.target.value)}
                      placeholder={t.costLimitPlaceholder}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.visitDate}
                    </label>
                    <input
                      type="date"
                      value={maintenanceAssignment.scheduledDate}
                      onChange={(e) => handleMaintenanceAssignmentChange('scheduledDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
                {maintenanceAssignment.scheduledDate && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      {t.visitTime}
                    </label>
                    <input
                      type="time"
                      value={maintenanceAssignment.scheduledTime}
                      onChange={(e) => handleMaintenanceAssignmentChange('scheduledTime', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <span className="text-purple-600 mr-2">🔔</span>
                  {t.notificationSettings}
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintenanceAssignment.notifyTeam}
                      onChange={(e) => handleMaintenanceAssignmentChange('notifyTeam', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">{t.notifyTeam}</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintenanceAssignment.notifyTenant}
                      onChange={(e) => handleMaintenanceAssignmentChange('notifyTenant', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-slate-700">{t.notifyTenant}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 rounded-b-xl">
              <div className="flex justify-between items-center">
                <div className="text-sm text-slate-600">
                  {maintenanceAssignment.selectedTeam && maintenanceTeams[maintenanceAssignment.selectedTeam] && (
                    <span>
                      {maintenanceTeams[maintenanceAssignment.selectedTeam].icon} {maintenanceTeams[maintenanceAssignment.selectedTeam].name} - 
                      {t.taka}{maintenanceTeams[maintenanceAssignment.selectedTeam].costPerHour}/hour
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCloseAssignMaintenanceModal}
                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    onClick={handleAssignMaintenanceWork}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    {t.assignWork}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default LandlordHomepage 