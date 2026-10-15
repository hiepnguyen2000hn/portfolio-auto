import { z } from 'zod';

export const ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Tên phải có từ 2 đến 80 ký tự' })
    .max(80, { message: 'Tên phải có từ 2 đến 80 ký tự' }),
  email: z
    .string()
    .trim()
    .email({ message: 'Email không hợp lệ' }),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Tin nhắn phải có từ 10 đến 2000 ký tự' })
    .max(2000, { message: 'Tin nhắn phải có từ 10 đến 2000 ký tự' }),
  website: z.string().optional().nullable(),
});

export type ContactInput = z.infer<typeof ContactSchema>;
