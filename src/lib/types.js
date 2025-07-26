// Database types based on the provided schema

export const UserRole = {
  TENANT: 'tenant',
  LANDLORD: 'landlord', 
  MAINTENANCE: 'maintenance'
}

export const PropertyType = {
  APARTMENT: 'apartment',
  HOUSE: 'house',
  CONDO: 'condo',
  ROOM: 'room',
  STUDIO: 'studio'
}

export const LeaseStatus = {
  PENDING: 'pending',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  TERMINATED: 'terminated'
}

export const PaymentStatus = {
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
}

export const MaintenanceStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const MaintenancePriority = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
}

export const PaymentType = {
  RENT: 'rent',
  SECURITY_DEPOSIT: 'security_deposit',
  LATE_FEE: 'late_fee',
  UTILITY: 'utility',
  OTHER: 'other'
}

export const MessageType = {
  GENERAL: 'general',
  MAINTENANCE: 'maintenance',
  PAYMENT: 'payment',
  LEASE: 'lease',
  EMERGENCY: 'emergency'
}

export const NotificationType = {
  PAYMENT_DUE: 'payment_due',
  PAYMENT_RECEIVED: 'payment_received',
  MAINTENANCE_REQUEST: 'maintenance_request',
  MAINTENANCE_UPDATE: 'maintenance_update',
  LEASE_EXPIRING: 'lease_expiring',
  MESSAGE_RECEIVED: 'message_received',
  REVIEW_REQUEST: 'review_request'
}

export const ReviewType = {
  TENANT_TO_LANDLORD: 'tenant_to_landlord',
  LANDLORD_TO_TENANT: 'landlord_to_tenant',
  PROPERTY_REVIEW: 'property_review'
}

// Validation helpers
export const isValidRole = (role) => Object.values(UserRole).includes(role)
export const isValidPropertyType = (type) => Object.values(PropertyType).includes(type)
export const isValidLeaseStatus = (status) => Object.values(LeaseStatus).includes(status)
export const isValidPaymentStatus = (status) => Object.values(PaymentStatus).includes(status)
export const isValidMaintenanceStatus = (status) => Object.values(MaintenanceStatus).includes(status)
export const isValidMaintenancePriority = (priority) => Object.values(MaintenancePriority).includes(priority) 