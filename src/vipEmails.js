// List of exempt VIP emails (Admins, testing, family, schools)
export const VIP_EMAILS = [
  // Empty by default so you can test the Paywall modal with your account
];

/**
 * Check if a given email is exempt from payment and gets free Premium
 */
export function isVipEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  return VIP_EMAILS.some(vip => clean === vip.toLowerCase());
}
