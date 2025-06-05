import { toast } from "../app/components/ui/use-toast"

type NotificationType = 'success' | 'error' | 'info' | 'warning'

export const showNotification = (
  title: string,
  description?: string,
  type: NotificationType = 'info'
) => {
  const baseConfig = {
    title,
    description,
    variant: 'default' as const,
  }

  switch (type) {
    case 'success':
      toast({
        ...baseConfig,
        variant: 'default',
        className: 'bg-green-500 text-white border-green-600',
      })
      break
    case 'error':
      toast({
        ...baseConfig,
        variant: 'destructive',
        className: 'bg-red-500 text-white border-red-600',
      })
      break
    case 'warning':
      toast({
        ...baseConfig,
        variant: 'default',
        className: 'bg-yellow-500 text-white border-yellow-600',
      })
      break
    default:
      toast(baseConfig)
  }
}

// Convenience methods for common notification types
export const notify = {
  success: (title: string, description?: string) => 
    showNotification(title, description, 'success'),
  error: (title: string, description?: string) => 
    showNotification(title, description, 'error'),
  info: (title: string, description?: string) => 
    showNotification(title, description, 'info'),
  warning: (title: string, description?: string) => 
    showNotification(title, description, 'warning'),
}

// Specific notification helpers for common actions
export const authNotifications = {
  signInSuccess: () => 
    notify.success('Welcome back!', 'You have successfully signed in.'),
  signUpSuccess: () =>
    notify.success('Account created!', 'Please check your email to verify your account.'),
  signOutSuccess: () =>
    notify.success('Signed out', 'You have been successfully signed out.'),
  resetPasswordSuccess: () =>
    notify.success('Email sent', 'Check your email for the password reset link.'),
  resetPasswordError: (error?: string) =>
    notify.error('Error', error || 'Failed to send password reset email. Please try again.'),
  updatePasswordSuccess: () =>
    notify.success('Password updated', 'Your password has been successfully updated.'),
  updatePasswordError: (error?: string) =>
    notify.error('Error', error || 'Failed to update password. Please try again.'),
  authError: (error?: string) =>
    notify.error('Authentication Error', error || 'An error occurred during authentication'),
}
