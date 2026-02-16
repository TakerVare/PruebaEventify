

import * as yup from 'yup'
import { useI18n } from 'vue-i18n'

export function useValidation() {
  const { t } = useI18n()

  
  
  

  
  const emailRule = yup
    .string()
    .required(t('validation.required'))
    .email(t('validation.email'))

  
  const passwordRule = yup
    .string()
    .required(t('validation.required'))
    .min(8, t('validation.passwordMin'))
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      t('validation.passwordRequirements')
    )

  
  const requiredRule = yup.string().required(t('validation.required'))

  
  const capacityRule = yup
    .number()
    .required(t('validation.required'))
    .positive(t('validation.capacityPositive'))
    .integer()

  
  const futureDateRule = yup
    .date()
    .required(t('validation.required'))
    .min(new Date(), t('validation.futureDate'))

  
  const urlRule = yup
    .string()
    .url(t('validation.url'))
    .nullable()

  
  
  

  
  const loginSchema = yup.object({
    email: emailRule,
    password: yup.string().required(t('validation.required'))
  })

  
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

  
  const changePasswordSchema = yup.object({
    currentPassword: yup.string().required(t('validation.required')),
    newPassword: passwordRule,
    confirmNewPassword: yup
      .string()
      .required(t('validation.required'))
      .oneOf([yup.ref('newPassword')], t('validation.passwordMatch'))
  })

  
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

  
  const updateProfileSchema = yup.object({
    firstName: requiredRule,
    lastName: requiredRule,
    avatarUrl: urlRule
  })

  
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

  
  const registrationSchema = yup.object({
    eventId: yup.number().required(t('validation.required')),
    notes: yup.string().max(500, t('validation.maxLength', { max: 500 })).nullable()
  })

  
  
  

  
  function isValidEmail(email: string): boolean {
    try {
      emailRule.validateSync(email)
      return true
    } catch {
      return false
    }
  }

  
  function isValidPassword(password: string): boolean {
    try {
      passwordRule.validateSync(password)
      return true
    } catch {
      return false
    }
  }

  
  function passwordsMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword
  }

  
  
  

  return {
    
    emailRule,
    passwordRule,
    requiredRule,
    capacityRule,
    futureDateRule,
    urlRule,

    
    loginSchema,
    registerSchema,
    changePasswordSchema,
    eventSchema,
    locationSchema,
    updateProfileSchema,
    eventSearchSchema,
    registrationSchema,

    
    isValidEmail,
    isValidPassword,
    passwordsMatch
  }
}
