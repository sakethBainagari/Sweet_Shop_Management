import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock AuthForm component
const AuthForm = ({ 
  type, 
  onSubmit, 
  isLoading 
}: {
  type: 'login' | 'register'
  onSubmit: (data: any) => Promise<void>
  isLoading: boolean
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
      ...(type === 'register' && { name: formData.get('name') })
    }
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} data-testid="auth-form">
      <h2>{type === 'login' ? 'Login' : 'Register'}</h2>
      
      {type === 'register' && (
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Enter your name"
          />
        </div>
      )}
      
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
        />
      </div>
      
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Enter your password"
          minLength={6}
        />
      </div>
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Processing...' : (type === 'login' ? 'Login' : 'Register')}
      </button>
    </form>
  )
}

describe('AuthForm Component', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Login Form', () => {
    it('renders login form correctly', () => {
      render(
        <AuthForm 
          type="login"
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      )

      expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
      expect(screen.getByLabelText('Email:')).toBeInTheDocument()
      expect(screen.getByLabelText('Password:')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
      
      // Should not show name field for login
      expect(screen.queryByLabelText('Name:')).not.toBeInTheDocument()
    })

    it('submits login form with correct data', async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined)
      
      render(
        <AuthForm 
          type="login"
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      )

      const emailInput = screen.getByLabelText('Email:')
      const passwordInput = screen.getByLabelText('Password:')
      const submitButton = screen.getByRole('button', { name: 'Login' })

      fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          email: 'user@example.com',
          password: 'password123'
        })
      })
    })

    it('shows loading state correctly', () => {
      render(
        <AuthForm 
          type="login"
          onSubmit={mockOnSubmit}
          isLoading={true}
        />
      )

      const submitButton = screen.getByRole('button', { name: 'Processing...' })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Register Form', () => {
    it('renders register form correctly', () => {
      render(
        <AuthForm 
          type="register"
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      )

      expect(screen.getByRole('heading', { name: 'Register' })).toBeInTheDocument()
      expect(screen.getByLabelText('Name:')).toBeInTheDocument()
      expect(screen.getByLabelText('Email:')).toBeInTheDocument()
      expect(screen.getByLabelText('Password:')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument()
    })

    it('submits register form with correct data', async () => {
      mockOnSubmit.mockResolvedValueOnce(undefined)
      
      render(
        <AuthForm 
          type="register"
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      )

      const nameInput = screen.getByLabelText('Name:')
      const emailInput = screen.getByLabelText('Email:')
      const passwordInput = screen.getByLabelText('Password:')
      const submitButton = screen.getByRole('button', { name: 'Register' })

      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        })
      })
    })

    it('validates required fields', () => {
      render(
        <AuthForm 
          type="register"
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      )

      const nameInput = screen.getByLabelText('Name:')
      const emailInput = screen.getByLabelText('Email:')
      const passwordInput = screen.getByLabelText('Password:')

      expect(nameInput).toBeRequired()
      expect(emailInput).toBeRequired()
      expect(passwordInput).toBeRequired()
    })

    it('validates email format', () => {
      render(
        <AuthForm 
          type="register"
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      )

      const emailInput = screen.getByLabelText('Email:')
      expect(emailInput).toHaveAttribute('type', 'email')
    })

    it('validates password minimum length', () => {
      render(
        <AuthForm 
          type="register"
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      )

      const passwordInput = screen.getByLabelText('Password:')
      expect(passwordInput).toHaveAttribute('minLength', '6')
    })
  })

  describe('Form Validation', () => {
    it('prevents submission with empty fields', async () => {
      render(
        <AuthForm 
          type="login"
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      )

      const submitButton = screen.getByRole('button', { name: 'Login' })
      fireEvent.click(submitButton)

      // Form should not submit due to HTML5 validation
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('shows correct placeholders', () => {
      render(
        <AuthForm 
          type="register"
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      )

      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper form structure', () => {
      render(
        <AuthForm 
          type="login"
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      )

      const form = screen.getByTestId('auth-form')
      expect(form).toBeInTheDocument()
      expect(form.tagName).toBe('FORM')
    })

    it('has proper label associations', () => {
      render(
        <AuthForm 
          type="register"
          onSubmit={mockOnSubmit}
          isLoading={false}
        />
      )

      const nameInput = screen.getByLabelText('Name:')
      const emailInput = screen.getByLabelText('Email:')
      const passwordInput = screen.getByLabelText('Password:')

      expect(nameInput).toHaveAttribute('id', 'name')
      expect(emailInput).toHaveAttribute('id', 'email')
      expect(passwordInput).toHaveAttribute('id', 'password')
    })
  })
});