




import 'vuetify/styles'
import { createVuetify, type ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'


import { es, en } from 'vuetify/locale'






const lightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    
    primary: '#1976D2',          
    'primary-darken-1': '#1565C0', 
    secondary: '#424242',        
    'secondary-darken-1': '#212121',
    
    
    accent: '#82B1FF',           
    
    
    error: '#FF5252',            
    info: '#2196F3',             
    success: '#4CAF50',          
    warning: '#FB8C00',          
    
    
    background: '#FAFAFA',       
    surface: '#FFFFFF',          
    'surface-variant': '#F5F5F5', 
    
    
    'on-background': '#212121',  
    'on-surface': '#212121',     
    'on-primary': '#FFFFFF',     
    'on-secondary': '#FFFFFF',   
    
    
    'event-draft': '#9E9E9E',    
    'event-published': '#4CAF50', 
    'event-cancelled': '#F44336', 
    'event-completed': '#2196F3'  
  }
}


const darkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    
    primary: '#42A5F5',          
    'primary-darken-1': '#1E88E5',
    secondary: '#BDBDBD',        
    'secondary-darken-1': '#9E9E9E',
    
    
    accent: '#82B1FF',
    
    
    error: '#FF8A80',
    info: '#64B5F6',
    success: '#69F0AE',
    warning: '#FFB74D',
    
    
    background: '#121212',       
    surface: '#1E1E1E',          
    'surface-variant': '#2D2D2D', 
    
    
    'on-background': '#FAFAFA',
    'on-surface': '#FAFAFA',
    'on-primary': '#000000',
    'on-secondary': '#000000',
    
    
    'event-draft': '#757575',
    'event-published': '#81C784',
    'event-cancelled': '#EF5350',
    'event-completed': '#64B5F6'
  }
}






const vuetify = createVuetify({
  
  
  
  theme: {
    
    defaultTheme: 'light',
    
    
    themes: {
      light: lightTheme,
      dark: darkTheme
    },
    
    
    variations: {
      colors: ['primary', 'secondary', 'accent'],
      lighten: 2,
      darken: 2
    }
  },
  
  
  
  
  icons: {
    
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  
  
  
  
  locale: {
    
    locale: 'es',
    
    
    fallback: 'en',
    
    
    messages: { es, en }
  },
  
  
  
  
  defaults: {
    
    global: {
      
      ripple: true
    },
    
    
    VBtn: {
      
      color: 'primary',
      
      variant: 'elevated',
      
      rounded: 'lg'
    },
    
    
    VTextField: {
      
      variant: 'outlined',
      
      density: 'comfortable',
      
      color: 'primary',
      
      hideDetails: 'auto'
    },
    
    
    VSelect: {
      variant: 'outlined',
      density: 'comfortable',
      color: 'primary',
      hideDetails: 'auto'
    },
    
    
    VTextarea: {
      variant: 'outlined',
      color: 'primary',
      hideDetails: 'auto'
    },
    
    
    VCard: {
      
      elevation: 2,
      
      rounded: 'lg'
    },
    
    
    VChip: {
      
      size: 'small',
      
      variant: 'tonal'
    },
    
    
    VAlert: {
      
      variant: 'tonal',
      
      rounded: 'lg'
    },
    
    
    VDialog: {
      
      maxWidth: 600,
      
      scrollable: true
    },
    
    
    VDataTable: {
      
      itemsPerPage: 10,
      
      itemsPerPageOptions: [5, 10, 25, 50]
    },
    
    
    VList: {
      
      density: 'comfortable'
    },
    
    
    VNavigationDrawer: {
      
      elevation: 4
    },
    
    
    VAppBar: {
      
      elevation: 2,
      
      density: 'default'
    }
  },
  
  
  
  
  display: {
    
    thresholds: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
})


export default vuetify
