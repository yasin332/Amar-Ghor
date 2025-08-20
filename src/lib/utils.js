// Utility functions for common operations

// Date utilities
export const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const isDatePast = (dateString) => {
  if (!dateString) return false
  return new Date(dateString) < new Date()
}

export const getDaysUntil = (dateString) => {
  if (!dateString) return null
  const targetDate = new Date(dateString)
  const today = new Date()
  const diffTime = targetDate - today
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Currency utilities
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(parseFloat(amount))
}

export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0
  return parseFloat(currencyString.replace(/[^0-9.-]+/g, ''))
}

// String utilities
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const capitalizeFirst = (string) => {
  if (!string) return ''
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key]
    if (!result[group]) {
      result[group] = []
    }
    result[group].push(item)
    return result
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (direction === 'desc') {
      return bVal > aVal ? 1 : -1
    }
    return aVal > bVal ? 1 : -1
  })
}

// Validation utilities
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

export const isValidPassword = (password, minLength = 8) => {
  if (!password || password.length < minLength) return false
  
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  
  return hasUppercase && hasLowercase && hasNumber && hasSpecial
}

export const isValidURL = (string) => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  const extension = getFileExtension(filename).toLowerCase()
  return imageExtensions.includes(extension)
}

// URL utilities
export const buildUrl = (base, params = {}) => {
  const url = new URL(base, window.location.origin)
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      url.searchParams.append(key, params[key])
    }
  })
  return url.toString()
}

export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search)
  const result = {}
  for (const [key, value] of params) {
    result[key] = value
  }
  return result
}

// Local storage utilities
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Error setting localStorage item:', error)
    return false
  }
}

export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error getting localStorage item:', error)
    return defaultValue
  }
}

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error removing localStorage item:', error)
    return false
  }
}

// Debounce utility
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Status utilities
export const getStatusColor = (status) => {
  const colors = {
    // Payment statuses
    pending: 'yellow',
    paid: 'green',
    overdue: 'red',
    cancelled: 'gray',
    
    // Lease statuses
    active: 'green',
    expired: 'red',
    terminated: 'gray',
    
    // Maintenance statuses
    in_progress: 'blue',
    completed: 'green',
    
    // Priority colors
    low: 'gray',
    medium: 'yellow',
    high: 'orange',
    urgent: 'red'
  }
  
  return colors[status] || 'gray'
}

export const getPriorityIcon = (priority) => {
  const icons = {
    low: '⬇️',
    medium: '➡️',
    high: '⬆️',
    urgent: '🚨'
  }
  
  return icons[priority] || '➡️'
}

// Address utilities
export const formatAddress = (address) => {
  if (!address) return ''
  
  if (typeof address === 'string') return address
  
  const { street, city, state, zipCode, country } = address
  const parts = [street, city, state, zipCode, country].filter(Boolean)
  return parts.join(', ')
}

// Error handling utilities
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error_description) return error.error_description
  return 'An unexpected error occurred'
}

// Form utilities
export const handleFormError = (error, setErrors) => {
  const message = getErrorMessage(error)
  if (setErrors) {
    setErrors({ general: message })
  }
  return message
}

export const resetFormErrors = (setErrors) => {
  if (setErrors) {
    setErrors({})
  }
}

// Copy to clipboard utility
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
} 