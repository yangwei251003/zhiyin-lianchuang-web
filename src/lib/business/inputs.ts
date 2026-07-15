import { z } from 'zod'

export const supplyOfferInput = z.object({
  purchaseId: z.string().uuid(),
  unitPrice: z.number().positive().max(10_000_000),
  minimumQuantity: z.number().int().positive().max(1_000_000),
  deliveryDays: z.number().int().positive().max(365),
  note: z.string().trim().max(500).default(''),
})

export const orderInput = z.object({
  title: z.string().trim().min(2).max(50),
  category: z.string().trim().min(1).max(30),
  craft: z.string().trim().min(1).max(100),
  budgetMin: z.number().positive().max(100_000_000),
  budgetMax: z.number().positive().max(100_000_000),
  region: z.string().trim().min(1).max(50),
  description: z.string().trim().min(10).max(500),
  mode: z.enum(['draft', 'publish']),
}).refine((value) => value.budgetMax >= value.budgetMin, { path: ['budgetMax'] })

export const bidInput = z.object({
  orderId: z.string().uuid(),
  price: z.number().positive().max(100_000_000),
  deliveryDays: z.number().int().positive().max(365),
  note: z.string().trim().max(500).default(''),
})

export const capacityInput = z.object({
  deviceType: z.string().trim().min(1).max(50),
  capacity: z.string().trim().min(2).max(200),
  region: z.string().trim().min(1).max(50),
  priceMin: z.number().positive().max(100_000_000),
  priceMax: z.number().positive().max(100_000_000),
  availableDate: z.string().date(),
}).refine((value) => value.priceMax >= value.priceMin, { path: ['priceMax'] })

export const companyApplicationInput = z.object({
  companyName: z.string().trim().min(2).max(50),
  creditCode: z.string().trim().regex(/^[0-9A-Z]{18}$/),
  licenseImageUrl: z.string().url().max(1000),
  contactName: z.string().trim().min(2).max(30),
  contactPhone: z.string().trim().regex(/^1[3-9]\d{9}$/),
}).strip()
