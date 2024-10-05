import { z } from 'zod'

export const LoginAuthSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string(),
})

export const RegisterAuthSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  role: z.enum([
    "ZONE_LEADER",
    "FELLOWSHIP_LEADER",
    "CELL_LEADER",
    "MEMBER",
    "ADMIN",
  ]),
});

export type LoginAuth = z.infer<typeof LoginAuthSchema>;
export type RegisterAuth = z.infer<typeof RegisterAuthSchema>