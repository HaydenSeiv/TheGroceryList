import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import { describe, expect, it, vi } from 'vitest'
import LoginForm from '../LoginForm'

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  }
})

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock config
vi.mock('../../utils/config', () => ({
    BASE_URL: 'http://localhost:5000/api',
  }))
  
  describe('LoginForm', () => {
    it('renders login form fields', () => {
      render(<LoginForm />)
      
      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument()
    })
  
    it('requires email and password fields', () => {
      render(<LoginForm />)
      
      const emailInput = screen.getByPlaceholderText('Enter your email')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      
      expect(emailInput).toBeRequired()
      expect(passwordInput).toBeRequired()
    })
  
    it('updates input values when typed', async () => {
      render(<LoginForm />)
      
      const emailInput = screen.getByPlaceholderText('Enter your email')
      const passwordInput = screen.getByPlaceholderText('Enter your password')
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      
      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('password123')
    })
  })