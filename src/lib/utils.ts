import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  const options = { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
  return formattedDate.replace(',', '');
}