/**
 * =============================================================================
 * I18N/EN.TS - English Translations
 * =============================================================================
 * Complete translation file in English.
 * Organized by sections for easy maintenance.
 * =============================================================================
 */

export default {
  // ===========================================================================
  // GENERAL
  // ===========================================================================
  general: {
    appName: 'Eventify',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    all: 'All',
    none: 'None',
    actions: 'Actions',
    details: 'Details',
    view: 'View',
    noData: 'No data available',
    noResults: 'No results found',
    required: 'Required',
    optional: 'Optional'
  },

  // ===========================================================================
  // NAVIGATION
  // ===========================================================================
  nav: {
    home: 'Home',
    events: 'Events',
    locations: 'Locations',
    dashboard: 'Dashboard',
    users: 'Users',
    profile: 'My Profile',
    settings: 'Settings',
    logout: 'Log Out',
    login: 'Log In',
    register: 'Sign Up',
    admin: 'Administration'
  },

  // ===========================================================================
  // AUTHENTICATION
  // ===========================================================================
  auth: {
    login: {
      title: 'Log In',
      subtitle: 'Access your Eventify account',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot your password?',
      submit: 'Sign In',
      noAccount: "Don't have an account?",
      registerLink: 'Sign up here'
    },
    register: {
      title: 'Create Account',
      subtitle: 'Join Eventify',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      acceptTerms: 'I accept the terms and conditions',
      submit: 'Sign Up',
      hasAccount: 'Already have an account?',
      loginLink: 'Log in here'
    },
    errors: {
      invalidCredentials: 'Invalid credentials',
      emailExists: 'This email is already registered',
      weakPassword: 'Password is too weak',
      passwordMismatch: 'Passwords do not match',
      sessionExpired: 'Your session has expired. Please log in again.'
    },
    messages: {
      loginSuccess: 'Welcome back!',
      registerSuccess: 'Account created successfully!',
      logoutSuccess: 'You have logged out successfully'
    }
  },

  // ===========================================================================
  // EVENTS
  // ===========================================================================
  events: {
    title: 'Events',
    subtitle: 'Discover upcoming events',
    create: 'Create Event',
    edit: 'Edit Event',
    delete: 'Delete Event',
    
    // Fields
    fields: {
      title: 'Title',
      description: 'Description',
      startDate: 'Start Date',
      endDate: 'End Date',
      location: 'Location',
      category: 'Category',
      capacity: 'Capacity',
      registeredCount: 'Registered',
      status: 'Status',
      organizer: 'Organizer',
      image: 'Image'
    },
    
    // Status
    status: {
      draft: 'Draft',
      published: 'Published',
      cancelled: 'Cancelled',
      completed: 'Completed'
    },
    
    // Actions
    actions: {
      register: 'Register',
      unregister: 'Cancel Registration',
      publish: 'Publish',
      unpublish: 'Unpublish',
      duplicate: 'Duplicate'
    },
    
    // Messages
    messages: {
      created: 'Event created successfully',
      updated: 'Event updated',
      deleted: 'Event deleted',
      published: 'Event published',
      registered: "You've registered for the event!",
      unregistered: 'Your registration has been cancelled',
      full: 'This event is full',
      alreadyRegistered: "You're already registered for this event"
    },
    
    // Filters
    filters: {
      all: 'All events',
      upcoming: 'Upcoming',
      past: 'Past',
      myEvents: 'My events',
      dateRange: 'Date range',
      startDate: 'From',
      endDate: 'To'
    },
    
    // Details
    details: {
      availableSpots: '{count} spots available',
      noSpots: 'No spots left',
      startingSoon: 'Starting soon',
      inProgress: 'In progress',
      ended: 'Ended'
    },
    
    // Confirmations
    confirmations: {
      delete: 'Are you sure you want to delete this event? This action cannot be undone.',
      cancel: 'Are you sure you want to cancel this event? Registered users will be notified.'
    }
  },

  // ===========================================================================
  // LOCATIONS
  // ===========================================================================
  locations: {
    title: 'Locations',
    subtitle: 'Manage event venues',
    create: 'Create Location',
    edit: 'Edit Location',
    delete: 'Delete Location',
    
    // Fields
    fields: {
      name: 'Name',
      address: 'Address',
      capacity: 'Capacity',
      description: 'Description',
      image: 'Image',
      isActive: 'Active',
      contactEmail: 'Contact Email',
      contactPhone: 'Contact Phone'
    },
    
    // Messages
    messages: {
      created: 'Location created successfully',
      updated: 'Location updated',
      deleted: 'Location deleted',
      hasEvents: 'This location has associated events and cannot be deleted'
    },
    
    // Confirmations
    confirmations: {
      delete: 'Are you sure you want to delete this location?',
      deactivate: 'Are you sure you want to deactivate this location? New events cannot be created here.'
    }
  },

  // ===========================================================================
  // USERS
  // ===========================================================================
  users: {
    title: 'Users',
    subtitle: 'System user management',
    edit: 'Edit User',
    
    // Fields
    fields: {
      email: 'Email',
      firstName: 'First Name',
      lastName: 'Last Name',
      role: 'Role',
      isActive: 'Active',
      createdAt: 'Registration Date'
    },
    
    // Roles
    roles: {
      admin: 'Administrator',
      organizer: 'Organizer',
      user: 'User'
    },
    
    // Messages
    messages: {
      updated: 'User updated',
      roleChanged: 'Role updated successfully',
      deactivated: 'User deactivated',
      activated: 'User activated'
    }
  },

  // ===========================================================================
  // REGISTRATIONS
  // ===========================================================================
  registrations: {
    title: 'Registrations',
    myRegistrations: 'My Registrations',
    
    // Status
    status: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      attended: 'Attended',
      noShow: 'No Show'
    },
    
    // Messages
    messages: {
      confirmed: 'Registration confirmed',
      cancelled: 'Registration cancelled'
    }
  },

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Control panel and statistics',
    
    // KPIs
    kpis: {
      totalEvents: 'Total Events',
      activeEvents: 'Active Events',
      totalRegistrations: 'Total Registrations',
      averageOccupancy: 'Average Occupancy'
    },
    
    // Charts
    charts: {
      eventsByCategory: 'Events by Category',
      registrationsByMonth: 'Registrations by Month',
      eventsByStatus: 'Events by Status'
    },
    
    // Filters
    filters: {
      dateRange: 'Period',
      lastWeek: 'Last week',
      lastMonth: 'Last month',
      lastYear: 'Last year',
      custom: 'Custom'
    }
  },

  // ===========================================================================
  // CATEGORIES
  // ===========================================================================
  categories: {
    conference: 'Conference',
    workshop: 'Workshop',
    meetup: 'Meetup',
    seminar: 'Seminar',
    networking: 'Networking',
    course: 'Course',
    exhibition: 'Exhibition',
    other: 'Other'
  },

  // ===========================================================================
  // VALIDATION
  // ===========================================================================
  validation: {
    required: 'This field is required',
    email: 'Enter a valid email address',
    minLength: 'Minimum {min} characters',
    maxLength: 'Maximum {max} characters',
    min: 'Minimum value is {min}',
    max: 'Maximum value is {max}',
    passwordMin: 'Password must be at least 8 characters',
    passwordRequirements: 'Must include uppercase, lowercase and number',
    passwordMatch: 'Passwords do not match',
    dateAfter: 'Date must be after {date}',
    dateBefore: 'Date must be before {date}',
    futureDate: 'Date must be in the future',
    endAfterStart: 'End date must be after start date',
    capacityPositive: 'Capacity must be greater than 0',
    url: 'Enter a valid URL'
  },

  // ===========================================================================
  // ERRORS
  // ===========================================================================
  errors: {
    generic: 'An error occurred. Please try again.',
    network: 'Connection error. Check your internet connection.',
    notFound: 'The requested resource does not exist.',
    unauthorized: 'You do not have permission to perform this action.',
    forbidden: 'Access denied.',
    serverError: 'Server error. Please try again later.',
    validation: 'Please fix the form errors.'
  },

  // ===========================================================================
  // SETTINGS
  // ===========================================================================
  settings: {
    title: 'Settings',
    theme: {
      title: 'Theme',
      light: 'Light',
      dark: 'Dark',
      system: 'System'
    },
    language: {
      title: 'Language',
      es: 'Español',
      en: 'English'
    }
  },

  // ===========================================================================
  // PAGINATION
  // ===========================================================================
  pagination: {
    showing: 'Showing {from} to {to} of {total}',
    itemsPerPage: 'Items per page',
    page: 'Page',
    of: 'of'
  },

  // ===========================================================================
  // CONFIRMATIONS
  // ===========================================================================
  confirmations: {
    title: 'Confirm action',
    unsavedChanges: 'You have unsaved changes. Are you sure you want to leave?'
  },

  // ===========================================================================
  // FOOTER
  // ===========================================================================
  footer: {
    copyright: '© {year} Eventify. All rights reserved.',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    contact: 'Contact'
  }
}
