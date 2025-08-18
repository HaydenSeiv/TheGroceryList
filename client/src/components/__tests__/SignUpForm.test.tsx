import { render, screen, fireEvent } from '../../test/test-utils'
import { describe, expect, it, vi } from 'vitest'
import SignUpForm from '../SignUpForm'

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
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock config
vi.mock('../../utils/config', () => ({
  BASE_URL: 'http://localhost:5000/api',
}))

describe('SignUpForm', () => {
  it('shows password mismatch validation', async () => {
    render(<SignUpForm />)
    
    const passwordInput = screen.getByPlaceholderText('Create a password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } })
    
    // The form should show validation error styling
    const confirmPasswordControl = confirmPasswordInput.closest('[data-invalid]')
    expect(confirmPasswordControl).toBeInTheDocument()
  })

  it('allows matching passwords', async () => {
    render(<SignUpForm />)
    
    const passwordInput = screen.getByPlaceholderText('Create a password')
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm your password')
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    
    // The form should not show validation error
    const confirmPasswordControl = confirmPasswordInput.closest('[data-invalid]')
    expect(confirmPasswordControl).toBeNull()
  })
})