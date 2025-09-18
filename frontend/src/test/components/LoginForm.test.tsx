import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Loading from '../../components/common/Loading'

describe('Loading Component', () => {
  it('renders with default message', () => {
    render(<Loading />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    const customMessage = 'Please wait while we process your request'
    render(<Loading message={customMessage} />)
    
    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('renders without message when message is empty', () => {
    render(<Loading message="" />)
    
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('applies correct size classes', () => {
    const { container } = render(<Loading size="large" />)
    const spinnerElement = container.querySelector('.animate-spin')
    
    expect(spinnerElement).toHaveClass('w-12', 'h-12')
  })

  it('applies default medium size when no size specified', () => {
    const { container } = render(<Loading />)
    const spinnerElement = container.querySelector('.animate-spin')
    
    expect(spinnerElement).toHaveClass('w-8', 'h-8')
  })

  it('applies small size classes', () => {
    const { container } = render(<Loading size="small" />)
    const spinnerElement = container.querySelector('.animate-spin')
    
    expect(spinnerElement).toHaveClass('w-4', 'h-4')
  })

  it('has correct base spinner classes', () => {
    const { container } = render(<Loading />)
    const spinnerElement = container.querySelector('.animate-spin')
    
    expect(spinnerElement).toHaveClass(
      'animate-spin',
      'rounded-full',
      'border-4',
      'border-neutral-300',
      'border-t-primary-600'
    )
  })

  it('has correct container layout classes', () => {
    const { container } = render(<Loading />)
    const containerElement = container.firstChild
    
    expect(containerElement).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'p-8'
    )
  })
});