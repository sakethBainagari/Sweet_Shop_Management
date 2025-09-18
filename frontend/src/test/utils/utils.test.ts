import { describe, it, expect, vi } from 'vitest'

// Mock utility functions for testing
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' }
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' }
  }
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' }
  }
  return { isValid: true }
}

export const calculateStockStatus = (quantity: number): string => {
  if (quantity === 0) return 'Out of Stock'
  if (quantity <= 5) return 'Low Stock'
  return 'In Stock'
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('formats price with dollar sign and two decimal places', () => {
      expect(formatPrice(10)).toBe('$10.00')
      expect(formatPrice(15.99)).toBe('$15.99')
      expect(formatPrice(0.5)).toBe('$0.50')
      expect(formatPrice(100.1)).toBe('$100.10')
    })

    it('handles zero price', () => {
      expect(formatPrice(0)).toBe('$0.00')
    })

    it('handles large numbers', () => {
      expect(formatPrice(1000000)).toBe('$1000000.00')
    })
  })

  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('user@example.com')).toBe(true)
      expect(validateEmail('test.email@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    it('rejects invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('user@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('user@domain')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('validates strong passwords', () => {
      const result = validatePassword('password123')
      expect(result.isValid).toBe(true)
      expect(result.message).toBeUndefined()
    })

    it('rejects passwords that are too short', () => {
      const result = validatePassword('12345')
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Password must be at least 6 characters long')
    })

    it('rejects passwords without lowercase letters', () => {
      const result = validatePassword('PASSWORD123')
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Password must contain at least one lowercase letter')
    })

    it('rejects passwords without numbers', () => {
      const result = validatePassword('password')
      expect(result.isValid).toBe(false)
      expect(result.message).toBe('Password must contain at least one number')
    })

    it('handles edge cases', () => {
      expect(validatePassword('').isValid).toBe(false)
      expect(validatePassword('abcdef').isValid).toBe(false)
      expect(validatePassword('123456').isValid).toBe(false)
    })
  })

  describe('calculateStockStatus', () => {
    it('returns correct stock status', () => {
      expect(calculateStockStatus(0)).toBe('Out of Stock')
      expect(calculateStockStatus(3)).toBe('Low Stock')
      expect(calculateStockStatus(5)).toBe('Low Stock')
      expect(calculateStockStatus(10)).toBe('In Stock')
      expect(calculateStockStatus(100)).toBe('In Stock')
    })
  })

  describe('truncateText', () => {
    it('truncates long text correctly', () => {
      const longText = 'This is a very long text that should be truncated'
      expect(truncateText(longText, 20)).toBe('This is a very long ...')
    })

    it('returns original text if under limit', () => {
      const shortText = 'Short text'
      expect(truncateText(shortText, 20)).toBe('Short text')
    })

    it('handles exact length', () => {
      const text = 'Exactly twenty chars'
      expect(truncateText(text, 20)).toBe('Exactly twenty chars')
    })

    it('handles empty string', () => {
      expect(truncateText('', 10)).toBe('')
    })
  })

  describe('debounce', () => {
    it('delays function execution', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('test')
      expect(mockFn).not.toHaveBeenCalled()

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(mockFn).toHaveBeenCalledWith('test')
    })

    it('cancels previous calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('first')
      debouncedFn('second')
      debouncedFn('third')

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('third')
    })
  })
});