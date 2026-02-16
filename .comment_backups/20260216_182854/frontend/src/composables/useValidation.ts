/**
 * =============================================================================
 * USE VALIDATION - Composable de validación de formularios
 * =============================================================================
 * Composable que proporciona esquemas de validación con Yup para usar
 * con VeeValidate en los formularios.
 *
 * Uso:
 * ```ts
 * const { loginSchema, registerSchema } = useValidation()
 * ```
 * =============================================================================
 */

import * as yup from 'yup'
import { useI18n } from 'vue-i18n'

export function useValidation() {
  const { t } = useI18n()

  // ===========================================================================
  // REGLAS DE VALIDACIÓN COMUNES
  // ===========================================================================

  /**
   * Regla de email
   */
  const emailRule = yup
    .string()
    .required(t('validation.required'))
    .email(t('validation.email'))

  /**
   * Regla de contraseña (mínimo 8 caracteres, incluye mayúscula, minúscula y número)
   */
  const passwordRule = yup
    .string()
    .required(t('validation.required'))
    .min(8, t('validation.passwordMin'))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      t('validation.passwordRequirements')
    )

  /**
   * Regla de campo requerido
   */
  const requiredRule = yup.string().required(t('validation.required'))

  /**
   * Regla de capacidad (número positivo)
   */
  const capacityRule = yup
    .number()
    .required(t('validation.required'))
    .positive(t('validation.capacityPositive'))
    .integer()

  /**
   * Regla de fecha futura
   */
  const futureDateRule = yup
    .date()
    .required(t('validation.required'))
    .min(new Date(), t('validation.futureDate'))

  /**
   * Regla de URL
   */
  const urlRule = yup
    .string()
    .url(t('validation.url'))
    .nullable()

  // ===========================================================================
  // ESQUEMAS DE VALIDACIÓN
  // ===========================================================================

  /**
   * Esquema de validación para login
   */
  const loginSchema = yup.object({
    email: emailRule,
    password: yup.string().required(t('validation.required'))
  })

  /**
   * Esquema de validación para registro
   */
  const registerSchema = yup.object({
    firstName: requiredRule,
    lastName: requiredRule,
    email: emailRule,
    password: passwordRule,
    confirmPassword: yup
      .string()
      .required(t('validation.required'))
      .oneOf([yup.ref('password')], t('validation.passwordMatch'))
  })

  /**
   * Esquema de validación para cambiar contraseña
   */
  const changePasswordSchema = yup.object({
    currentPassword: yup.string().required(t('validation.required')),
    newPassword: passwordRule,
    confirmNewPassword: yup
      .string()
      .required(t('validation.required'))
      .oneOf([yup.ref('newPassword')], t('validation.passwordMatch'))
  })

  /**
   * Esquema de validación para crear/editar eventos
   */
  const eventSchema = yup.object({
    title: requiredRule.min(3, t('validation.minLength', { min: 3 })),
    description: requiredRule.min(10, t('validation.minLength', { min: 10 })),
    startDate: futureDateRule,
    endDate: yup
      .date()
      .required(t('validation.required'))
      .min(yup.ref('startDate'), t('validation.endAfterStart')),
    capacity: capacityRule,
    locationId: yup.number().required(t('validation.required')),
    categoryId: yup.number().required(t('validation.required')),
    imageUrl: urlRule
  })

  /**
   * Esquema de validación para crear/editar ubicaciones
   */
  const locationSchema = yup.object({
    name: requiredRule.min(3, t('validation.minLength', { min: 3 })),
    address: requiredRule.min(5, t('validation.minLength', { min: 5 })),
    capacity: capacityRule,
    description: yup.string().nullable(),
    imageUrl: urlRule,
    contactEmail: yup.string().email(t('validation.email')).nullable(),
    contactPhone: yup.string().nullable(),
    latitude: yup.number().nullable(),
    longitude: yup.number().nullable()
  })

  /**
   * Esquema de validación para actualizar perfil de usuario
   */
  const updateProfileSchema = yup.object({
    firstName: requiredRule,
    lastName: requiredRule,
    avatarUrl: urlRule
  })

  /**
   * Esquema de validación para búsqueda de eventos
   */
  const eventSearchSchema = yup.object({
    search: yup.string().nullable(),
    categoryId: yup.number().nullable(),
    locationId: yup.number().nullable(),
    startDate: yup.date().nullable(),
    endDate: yup
      .date()
      .nullable()
      .when('startDate', {
        is: (val: any) => val != null,
        then: (schema) => schema.min(yup.ref('startDate'), t('validation.endAfterStart')),
        otherwise: (schema) => schema
      })
  })

  /**
   * Esquema de validación para inscripción a evento
   */
  const registrationSchema = yup.object({
    eventId: yup.number().required(t('validation.required')),
    notes: yup.string().max(500, t('validation.maxLength', { max: 500 })).nullable()
  })

  // ===========================================================================
  // MÉTODOS DE VALIDACIÓN MANUAL
  // ===========================================================================

  /**
   * Valida un email de forma sincrónica
   * @param email - Email a validar
   * @returns boolean
   */
  function isValidEmail(email: string): boolean {
    try {
      emailRule.validateSync(email)
      return true
    } catch {
      return false
    }
  }

  /**
   * Valida una contraseña de forma sincrónica
   * @param password - Contraseña a validar
   * @returns boolean
   */
  function isValidPassword(password: string): boolean {
    try {
      passwordRule.validateSync(password)
      return true
    } catch {
      return false
    }
  }

  /**
   * Valida que dos contraseñas coincidan
   * @param password - Contraseña
   * @param confirmPassword - Confirmación de contraseña
   * @returns boolean
   */
  function passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword
  }

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    // Reglas individuales
    emailRule,
    passwordRule,
    requiredRule,
    capacityRule,
    futureDateRule,
    urlRule,

    // Esquemas completos
    loginSchema,
    registerSchema,
    changePasswordSchema,
    eventSchema,
    locationSchema,
    updateProfileSchema,
    eventSearchSchema,
    registrationSchema,

    // Métodos de validación manual
    isValidEmail,
    isValidPassword,
    passwordsMatch
  }
}
