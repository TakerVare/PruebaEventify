

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/auth'
import { useUiStore } from '@/stores/ui'


const emit = defineEmits<{
  (e: 'toggle-drawer'): void
}>()

const router = useRouter()
const { t } = useI18n()
const { mobile } = useDisplay()
const authStore = useAuthStore()
const uiStore = useUiStore()


const navItems = [
  { title: t('nav.home'), icon: 'mdi-home', to: '/' },
  { title: t('nav.events'), icon: 'mdi-calendar', to: '/events' }
]


async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>

<template>
  <v-app-bar
    elevation="2"
    color="surface"
  >
    
    <v-app-bar-nav-icon
      v-if="mobile"
      @click="emit('toggle-drawer')"
    />

    
    <v-app-bar-title class="d-flex align-center cursor-pointer" @click="router.push('/')">
      <v-icon size="32" color="primary" class="mr-2">mdi-calendar-star</v-icon>
      <span class="text-h6 font-weight-bold text-primary">Eventify</span>
    </v-app-bar-title>

    
    <template v-if="!mobile">
      <v-btn
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        variant="text"
        :prepend-icon="item.icon"
      >
        {{ item.title }}
      </v-btn>
    </template>

    <v-spacer />

    
    <v-btn
      icon
      variant="text"
      @click="uiStore.toggleLocale()"
      size="small"
    >
      <v-icon>mdi-translate</v-icon>
      <v-tooltip activator="parent" location="bottom">
        {{ uiStore.locale === 'es' ? 'English' : 'Español' }}
      </v-tooltip>
    </v-btn>

    
    <v-btn
      icon
      variant="text"
      @click="uiStore.toggleTheme()"
      size="small"
    >
      <v-icon>{{ uiStore.isDarkTheme ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      <v-tooltip activator="parent" location="bottom">
        {{ uiStore.isDarkTheme ? t('settings.theme.light') : t('settings.theme.dark') }}
      </v-tooltip>
    </v-btn>

    
    <template v-if="authStore.isAuthenticated">
      
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            variant="text"
            :prepend-icon="mobile ? undefined : 'mdi-account'"
          >
            <template v-if="!mobile">
              {{ authStore.user?.firstName }}
            </template>
            <v-avatar v-if="mobile" color="primary" size="32">
              <span class="text-caption">{{ authStore.userInitials }}</span>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item>
            <v-list-item-title class="text-subtitle-2">
              {{ authStore.fullName }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption">
              {{ authStore.user?.email }}
            </v-list-item-subtitle>
          </v-list-item>

          <v-divider />

          <v-list-item
            v-if="authStore.isAdmin || authStore.isOrganizer"
            prepend-icon="mdi-view-dashboard"
            :title="t('nav.admin')"
            @click="router.push('/admin/dashboard')"
          />

          <v-list-item
            prepend-icon="mdi-account"
            :title="t('nav.profile')"
            @click="router.push('/profile')"
          />

          <v-list-item
            prepend-icon="mdi-ticket"
            :title="t('registrations.myRegistrations')"
            @click="router.push('/my-registrations')"
          />

          <v-divider />

          <v-list-item
            prepend-icon="mdi-logout"
            :title="t('nav.logout')"
            @click="handleLogout"
          />
        </v-list>
      </v-menu>
    </template>

    <template v-else>
      
      <v-btn
        variant="text"
        :prepend-icon="mobile ? undefined : 'mdi-login'"
        @click="router.push('/login')"
      >
        <template v-if="!mobile">{{ t('nav.login') }}</template>
        <v-icon v-else>mdi-login</v-icon>
      </v-btn>

      <v-btn
        v-if="!mobile"
        color="primary"
        prepend-icon="mdi-account-plus"
        @click="router.push('/register')"
      >
        {{ t('nav.register') }}
      </v-btn>
    </template>
  </v-app-bar>
</template>

<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer;
}
</style>
