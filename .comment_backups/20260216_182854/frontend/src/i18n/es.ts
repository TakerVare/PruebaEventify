/**
 * =============================================================================
 * I18N/ES.TS - Traducciones en Español
 * =============================================================================
 * Archivo de traducción completo en español.
 * Organizado por secciones para facilitar el mantenimiento.
 * =============================================================================
 */

export default {
  // ===========================================================================
  // GENERAL
  // ===========================================================================
  general: {
    appName: 'Eventify',
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    search: 'Buscar',
    filter: 'Filtrar',
    clear: 'Limpiar',
    confirm: 'Confirmar',
    back: 'Volver',
    next: 'Siguiente',
    previous: 'Anterior',
    close: 'Cerrar',
    yes: 'Sí',
    no: 'No',
    all: 'Todos',
    none: 'Ninguno',
    actions: 'Acciones',
    details: 'Detalles',
    view: 'Ver',
    noData: 'No hay datos disponibles',
    noResults: 'No se encontraron resultados',
    required: 'Obligatorio',
    optional: 'Opcional'
  },

  // ===========================================================================
  // NAVEGACIÓN
  // ===========================================================================
  nav: {
    home: 'Inicio',
    events: 'Eventos',
    locations: 'Ubicaciones',
    dashboard: 'Dashboard',
    users: 'Usuarios',
    profile: 'Mi Perfil',
    settings: 'Configuración',
    logout: 'Cerrar Sesión',
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    admin: 'Administración'
  },

  // ===========================================================================
  // AUTENTICACIÓN
  // ===========================================================================
  auth: {
    login: {
      title: 'Iniciar Sesión',
      subtitle: 'Accede a tu cuenta de Eventify',
      email: 'Correo electrónico',
      password: 'Contraseña',
      rememberMe: 'Recordarme',
      forgotPassword: '¿Olvidaste tu contraseña?',
      submit: 'Entrar',
      noAccount: '¿No tienes cuenta?',
      registerLink: 'Regístrate aquí'
    },
    register: {
      title: 'Crear Cuenta',
      subtitle: 'Únete a Eventify',
      firstName: 'Nombre',
      lastName: 'Apellidos',
      email: 'Correo electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      acceptTerms: 'Acepto los términos y condiciones',
      submit: 'Registrarse',
      hasAccount: '¿Ya tienes cuenta?',
      loginLink: 'Inicia sesión aquí'
    },
    errors: {
      invalidCredentials: 'Credenciales incorrectas',
      emailExists: 'Este correo ya está registrado',
      weakPassword: 'La contraseña es demasiado débil',
      passwordMismatch: 'Las contraseñas no coinciden',
      sessionExpired: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.'
    },
    messages: {
      loginSuccess: '¡Bienvenido de nuevo!',
      registerSuccess: '¡Cuenta creada exitosamente!',
      logoutSuccess: 'Has cerrado sesión correctamente'
    }
  },

  // ===========================================================================
  // EVENTOS
  // ===========================================================================
  events: {
    title: 'Eventos',
    subtitle: 'Descubre los próximos eventos',
    create: 'Crear Evento',
    edit: 'Editar Evento',
    delete: 'Eliminar Evento',
    
    // Campos
    fields: {
      title: 'Título',
      description: 'Descripción',
      startDate: 'Fecha de inicio',
      endDate: 'Fecha de fin',
      location: 'Ubicación',
      category: 'Categoría',
      capacity: 'Capacidad',
      registeredCount: 'Inscritos',
      status: 'Estado',
      organizer: 'Organizador',
      image: 'Imagen'
    },
    
    // Estados
    status: {
      draft: 'Borrador',
      published: 'Publicado',
      cancelled: 'Cancelado',
      completed: 'Completado'
    },
    
    // Acciones
    actions: {
      register: 'Inscribirse',
      unregister: 'Cancelar inscripción',
      publish: 'Publicar',
      unpublish: 'Despublicar',
      duplicate: 'Duplicar'
    },
    
    // Mensajes
    messages: {
      created: 'Evento creado exitosamente',
      updated: 'Evento actualizado',
      deleted: 'Evento eliminado',
      published: 'Evento publicado',
      registered: '¡Te has inscrito al evento!',
      unregistered: 'Has cancelado tu inscripción',
      full: 'Este evento está completo',
      alreadyRegistered: 'Ya estás inscrito en este evento'
    },
    
    // Filtros
    filters: {
      all: 'Todos los eventos',
      upcoming: 'Próximos',
      past: 'Pasados',
      myEvents: 'Mis eventos',
      dateRange: 'Rango de fechas',
      startDate: 'Desde',
      endDate: 'Hasta'
    },
    
    // Detalles
    details: {
      availableSpots: '{count} plazas disponibles',
      noSpots: 'No quedan plazas',
      startingSoon: 'Comienza pronto',
      inProgress: 'En curso',
      ended: 'Finalizado'
    },
    
    // Confirmaciones
    confirmations: {
      delete: '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.',
      cancel: '¿Estás seguro de que deseas cancelar este evento? Los inscritos serán notificados.'
    }
  },

  // ===========================================================================
  // UBICACIONES
  // ===========================================================================
  locations: {
    title: 'Ubicaciones',
    subtitle: 'Gestión de espacios para eventos',
    create: 'Crear Ubicación',
    edit: 'Editar Ubicación',
    delete: 'Eliminar Ubicación',
    
    // Campos
    fields: {
      name: 'Nombre',
      address: 'Dirección',
      capacity: 'Capacidad',
      description: 'Descripción',
      image: 'Imagen',
      isActive: 'Activo',
      contactEmail: 'Email de contacto',
      contactPhone: 'Teléfono de contacto'
    },
    
    // Mensajes
    messages: {
      created: 'Ubicación creada exitosamente',
      updated: 'Ubicación actualizada',
      deleted: 'Ubicación eliminada',
      hasEvents: 'Esta ubicación tiene eventos asociados y no puede ser eliminada'
    },
    
    // Confirmaciones
    confirmations: {
      delete: '¿Estás seguro de que deseas eliminar esta ubicación?',
      deactivate: '¿Estás seguro de que deseas desactivar esta ubicación? No se podrán crear nuevos eventos en ella.'
    }
  },

  // ===========================================================================
  // USUARIOS
  // ===========================================================================
  users: {
    title: 'Usuarios',
    subtitle: 'Gestión de usuarios del sistema',
    edit: 'Editar Usuario',
    
    // Campos
    fields: {
      email: 'Correo electrónico',
      firstName: 'Nombre',
      lastName: 'Apellidos',
      role: 'Rol',
      isActive: 'Activo',
      createdAt: 'Fecha de registro'
    },
    
    // Roles
    roles: {
      admin: 'Administrador',
      organizer: 'Organizador',
      user: 'Usuario'
    },
    
    // Mensajes
    messages: {
      updated: 'Usuario actualizado',
      roleChanged: 'Rol actualizado correctamente',
      deactivated: 'Usuario desactivado',
      activated: 'Usuario activado'
    }
  },

  // ===========================================================================
  // INSCRIPCIONES
  // ===========================================================================
  registrations: {
    title: 'Inscripciones',
    myRegistrations: 'Mis Inscripciones',
    
    // Estados
    status: {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      cancelled: 'Cancelada',
      attended: 'Asistió',
      noShow: 'No asistió'
    },
    
    // Mensajes
    messages: {
      confirmed: 'Inscripción confirmada',
      cancelled: 'Inscripción cancelada'
    }
  },

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Panel de control y estadísticas',
    
    // KPIs
    kpis: {
      totalEvents: 'Total de Eventos',
      activeEvents: 'Eventos Activos',
      totalRegistrations: 'Total de Inscripciones',
      averageOccupancy: 'Ocupación Media'
    },
    
    // Gráficos
    charts: {
      eventsByCategory: 'Eventos por Categoría',
      registrationsByMonth: 'Inscripciones por Mes',
      eventsByStatus: 'Eventos por Estado'
    },
    
    // Filtros
    filters: {
      dateRange: 'Período',
      lastWeek: 'Última semana',
      lastMonth: 'Último mes',
      lastYear: 'Último año',
      custom: 'Personalizado'
    }
  },

  // ===========================================================================
  // CATEGORÍAS
  // ===========================================================================
  categories: {
    conference: 'Conferencia',
    workshop: 'Taller',
    meetup: 'Meetup',
    seminar: 'Seminario',
    networking: 'Networking',
    course: 'Curso',
    exhibition: 'Exposición',
    other: 'Otro'
  },

  // ===========================================================================
  // VALIDACIÓN
  // ===========================================================================
  validation: {
    required: 'Este campo es obligatorio',
    email: 'Introduce un correo electrónico válido',
    minLength: 'Mínimo {min} caracteres',
    maxLength: 'Máximo {max} caracteres',
    min: 'El valor mínimo es {min}',
    max: 'El valor máximo es {max}',
    passwordMin: 'La contraseña debe tener al menos 8 caracteres',
    passwordRequirements: 'Debe incluir mayúscula, minúscula y número',
    passwordMatch: 'Las contraseñas no coinciden',
    dateAfter: 'La fecha debe ser posterior a {date}',
    dateBefore: 'La fecha debe ser anterior a {date}',
    futureDate: 'La fecha debe ser futura',
    endAfterStart: 'La fecha de fin debe ser posterior a la de inicio',
    capacityPositive: 'La capacidad debe ser mayor que 0',
    url: 'Introduce una URL válida'
  },

  // ===========================================================================
  // ERRORES
  // ===========================================================================
  errors: {
    generic: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
    network: 'Error de conexión. Comprueba tu conexión a internet.',
    notFound: 'El recurso solicitado no existe.',
    unauthorized: 'No tienes permiso para realizar esta acción.',
    forbidden: 'Acceso denegado.',
    serverError: 'Error del servidor. Por favor, inténtalo más tarde.',
    validation: 'Por favor, corrige los errores del formulario.'
  },

  // ===========================================================================
  // CONFIGURACIÓN
  // ===========================================================================
  settings: {
    title: 'Configuración',
    theme: {
      title: 'Tema',
      light: 'Claro',
      dark: 'Oscuro',
      system: 'Sistema'
    },
    language: {
      title: 'Idioma',
      es: 'Español',
      en: 'English'
    }
  },

  // ===========================================================================
  // PAGINACIÓN
  // ===========================================================================
  pagination: {
    showing: 'Mostrando {from} a {to} de {total}',
    itemsPerPage: 'Elementos por página',
    page: 'Página',
    of: 'de'
  },

  // ===========================================================================
  // CONFIRMACIONES
  // ===========================================================================
  confirmations: {
    title: 'Confirmar acción',
    unsavedChanges: 'Tienes cambios sin guardar. ¿Estás seguro de que deseas salir?'
  },

  // ===========================================================================
  // FOOTER
  // ===========================================================================
  footer: {
    copyright: '© {year} Eventify. Todos los derechos reservados.',
    privacyPolicy: 'Política de Privacidad',
    termsOfService: 'Términos de Servicio',
    contact: 'Contacto'
  }
}
