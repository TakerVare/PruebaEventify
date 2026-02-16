/**
 * =============================================================================
 * PLUGINS/VUETIFY.TS - Configuración de Vuetify 3
 * =============================================================================
 * Este archivo configura Vuetify 3 para la aplicación, incluyendo:
 * - Temas claro y oscuro con colores personalizados
 * - Iconos de Material Design Icons
 * - Configuración de componentes por defecto
 * - Localización en español
 * =============================================================================
 */

// -----------------------------------------------------------------------------
// IMPORTACIONES
// -----------------------------------------------------------------------------
import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

// Importar localización en español
import { es, en } from 'vuetify/locale'

// -----------------------------------------------------------------------------
// DEFINICIÓN DE TEMAS
// -----------------------------------------------------------------------------

/**
 * Tema claro de Eventify.
 * Colores basados en Material Design con personalización para la marca.
 */
const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    // Colores principales
    primary: '#1976D2',          // Azul principal (Material Blue 700)
    'primary-darken-1': '#1565C0', // Azul oscuro para hover
    secondary: '#424242',        // Gris oscuro
    'secondary-darken-1': '#212121',
    
    // Colores de acento
    accent: '#82B1FF',           // Azul claro de acento
    
    // Colores semánticos
    error: '#FF5252',            // Rojo para errores
    info: '#2196F3',             // Azul para información
    success: '#4CAF50',          // Verde para éxito
    warning: '#FB8C00',          // Naranja para advertencias
    
    // Colores de fondo
    background: '#FAFAFA',       // Fondo general
    surface: '#FFFFFF',          // Fondo de cards y superficies
    'surface-variant': '#F5F5F5', // Variante de superficie
    
    // Colores de texto
    'on-background': '#212121',  // Texto sobre fondo
    'on-surface': '#212121',     // Texto sobre superficies
    'on-primary': '#FFFFFF',     // Texto sobre primary
    'on-secondary': '#FFFFFF',   // Texto sobre secondary
    
    // Colores personalizados para la app
    'event-draft': '#9E9E9E',    // Gris para eventos en borrador
    'event-published': '#4CAF50', // Verde para eventos publicados
    'event-cancelled': '#F44336', // Rojo para eventos cancelados
    'event-completed': '#2196F3'  // Azul para eventos completados
  }
}

/**
 * Tema oscuro de Eventify.
 * Versión oscura con colores ajustados para mejor legibilidad.
 */
const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    // Colores principales (más brillantes para tema oscuro)
    primary: '#42A5F5',          // Azul más claro
    'primary-darken-1': '#1E88E5',
    secondary: '#BDBDBD',        // Gris claro
    'secondary-darken-1': '#9E9E9E',
    
    // Colores de acento
    accent: '#82B1FF',
    
    // Colores semánticos (ajustados para tema oscuro)
    error: '#FF8A80',
    info: '#64B5F6',
    success: '#69F0AE',
    warning: '#FFB74D',
    
    // Colores de fondo (tonos oscuros)
    background: '#121212',       // Fondo general oscuro
    surface: '#1E1E1E',          // Fondo de cards
    'surface-variant': '#2D2D2D', // Variante de superficie
    
    // Colores de texto (claros para tema oscuro)
    'on-background': '#FAFAFA',
    'on-surface': '#FAFAFA',
    'on-primary': '#000000',
    'on-secondary': '#000000',
    
    // Colores personalizados (ajustados)
    'event-draft': '#757575',
    'event-published': '#81C784',
    'event-cancelled': '#EF5350',
    'event-completed': '#64B5F6'
  }
}

// -----------------------------------------------------------------------------
// CREAR INSTANCIA DE VUETIFY
// -----------------------------------------------------------------------------

/**
 * Crea y exporta la instancia de Vuetify configurada.
 */
const vuetify = createVuetify({
  // ===========================================================================
  // CONFIGURACIÓN DE TEMAS
  // ===========================================================================
  theme: {
    // Tema por defecto al cargar la app
    defaultTheme: 'light',
    
    // Definición de temas disponibles
    themes: {
      light: lightTheme,
      dark: darkTheme
    },
    
    // Variaciones de color automáticas
    variations: {
      colors: ['primary', 'secondary', 'accent'],
      lighten: 2,
      darken: 2
    }
  },
  
  // ===========================================================================
  // CONFIGURACIÓN DE ICONOS
  // ===========================================================================
  icons: {
    // Usar Material Design Icons como set por defecto
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  
  // ===========================================================================
  // LOCALIZACIÓN
  // ===========================================================================
  locale: {
    // Idioma por defecto
    locale: 'es',
    
    // Idioma de fallback
    fallback: 'en',
    
    // Mensajes de localización
    messages: { es, en }
  },
  
  // ===========================================================================
  // VALORES POR DEFECTO DE COMPONENTES
  // ===========================================================================
  defaults: {
    // Configuración global de componentes
    global: {
      // Ripple activado en todos los componentes interactivos
      ripple: true
    },
    
    // Botones
    VBtn: {
      // Color primary por defecto
      color: 'primary',
      // Variante elevada por defecto
      variant: 'elevated',
      // Bordes redondeados
      rounded: 'lg'
    },
    
    // Campos de texto
    VTextField: {
      // Variante outlined (con borde)
      variant: 'outlined',
      // Densidad compacta
      density: 'comfortable',
      // Color primary para focus
      color: 'primary',
      // Ocultar detalles hasta que haya error
      hideDetails: 'auto'
    },
    
    // Select
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      hideDetails: 'auto'
    },
    
    // Textarea
    VTextarea: {
      variant: 'outlined',
      color: 'primary',
      hideDetails: 'auto'
    },
    
    // Cards
    VCard: {
      // Elevación suave
      elevation: 2,
      // Bordes redondeados
      rounded: 'lg'
    },
    
    // Chips
    VChip: {
      // Tamaño pequeño por defecto
      size: 'small',
      // Variante tonal (fondo suave)
      variant: 'tonal'
    },
    
    // Alertas
    VAlert: {
      // Variante tonal
      variant: 'tonal',
      // Bordes redondeados
      rounded: 'lg'
    },
    
    // Diálogos
    VDialog: {
      // Ancho máximo por defecto
      maxWidth: 600,
      // Scroll interno
      scrollable: true
    },
    
    // Tablas de datos
    VDataTable: {
      // Mostrar items por página
      itemsPerPage: 10,
      // Opciones de paginación
      itemsPerPageOptions: [5, 10, 25, 50]
    },
    
    // Listas
    VList: {
      // Densidad compacta
      density: 'comfortable'
    },
    
    // Navegación
    VNavigationDrawer: {
      // Elevación
      elevation: 4
    },
    
    // App Bar
    VAppBar: {
      // Elevación
      elevation: 2,
      // Densidad
      density: 'default'
    }
  },
  
  // ===========================================================================
  // DISPLAY (BREAKPOINTS PERSONALIZADOS)
  // ===========================================================================
  display: {
    // Puntos de quiebre para responsive design
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
})

// Exportar la instancia de Vuetify
export default vuetify
