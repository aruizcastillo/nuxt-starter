import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Shadcn-vue utility function to merge class names with Tailwind CSS support
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
