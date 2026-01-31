import { z } from 'zod';

// Helper function to calculate age
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Regex patterns
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const phoneRegex = /^[6-9]\d{9}$/;
const nameRegex = /^[A-Za-z\s]+$/;
const pinRegex = /^\d{6}$/;

// Customer Details Schema (Tab 1)
export const customerDetailsSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name must be less than 100 characters')
    .refine((val) => nameRegex.test(val), 'Full name should contain only letters'),

  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => {
      const age = calculateAge(val);
      return age >= 18;
    }, 'You must be at least 18 years old'),

  pan: z
    .string()
    .min(1, 'PAN is required')
    .length(10, 'PAN must be exactly 10 characters')
    .refine((val) => panRegex.test(val.toUpperCase()), 'Invalid PAN format (e.g., ABCDE1234F)'),

  annualIncome: z
    .string()
    .min(1, 'Annual income is required')
    .refine((val) => Number(val) > 0, 'Annual income must be greater than 0'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format'),

  phone: z
    .string()
    .min(1, 'Phone number is required')
    .length(10, 'Phone number must be 10 digits')
    .refine((val) => phoneRegex.test(val), 'Invalid phone number'),

  profession: z.object({
    type: z.enum(['SALARIED', 'SELF_EMPLOYED'], {
      required_error: 'Please select profession type',
    }),
    company: z.string().optional(),
  }),
});

// Address Details Schema (Tab 2)
export const addressDetailsSchema = z.object({
  address: z.object({
    line1: z
      .string()
      .min(1, 'Address line 1 is required')
      .min(5, 'Address must be at least 5 characters'),

    line2: z.string().optional(),

    city: z
      .string()
      .min(1, 'City is required')
      .min(2, 'City must be at least 2 characters'),

    state: z
      .string()
      .min(1, 'State is required'),

    pin: z
      .string()
      .min(1, 'PIN code is required')
      .length(6, 'PIN code must be 6 digits')
      .refine((val) => pinRegex.test(val), 'Invalid PIN code'),
  }),

  addressConfirmed: z
    .boolean()
    .refine((val) => val === true, 'You must confirm the address'),
});
