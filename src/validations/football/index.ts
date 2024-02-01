import { z } from 'zod'

export const queryValidationAllSports = z.object(
  {
    date: z.string(
      {
        invalid_type_error: 'date must be a string'
      }
    ).optional(),
    sort: z.enum(
      ['desc', 'asc']
    ).default('desc'),
    'no-cache': z.string(
      {
        invalid_type_error: 'no-cache must be a string'
      }
    ).trim().optional()
  }
)
