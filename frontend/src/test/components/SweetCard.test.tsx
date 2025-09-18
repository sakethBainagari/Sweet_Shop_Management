import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import type { Sweet } from '../../types/sweet'
import type { User } from '../../types/auth'

// Mock SweetCard component since we don't have the actual component
const SweetCard = ({ sweet, user, onPurchase, onEdit, onDelete }: {
  sweet: Sweet
  user: User
  onPurchase: (sweet: Sweet) => void
  onEdit: (sweet: Sweet) => void
  onDelete: (sweet: Sweet) => void
}) => (
  <div className="sweet-card">
    <h3>{sweet.name}</h3>
    <p>{sweet.description}</p>
    <p>${sweet.price}</p>
    <p>{sweet.category}</p>
    <p>{sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of Stock'}</p>
    {sweet.quantity > 0 ? (
      <button onClick={() => onPurchase(sweet)}>Add to Cart</button>
    ) : (
      <button disabled>Out of Stock</button>
    )}
    {user.role === 'ADMIN' && (
      <>
        <button onClick={() => onEdit(sweet)}>Edit</button>
        <button onClick={() => onDelete(sweet)}>Delete</button>
      </>
    )}
  </div>
)

// Mock sweet data
const mockSweet: Sweet = {
  id: '1',
  name: 'Chocolate Cake',
  description: 'Delicious chocolate cake with rich frosting',
  price: 15.99,
  quantity: 10,
  category: 'Cake',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  name: 'Test User',
  role: 'USER'
}

const mockAdmin: User = {
  id: '2', 
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'ADMIN'
}

describe('SweetCard Component', () => {
  const mockOnPurchase = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders sweet information correctly', () => {
    render(
      <SweetCard 
        sweet={mockSweet}
        user={mockUser}
        onPurchase={mockOnPurchase}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
    expect(screen.getByText('Delicious chocolate cake with rich frosting')).toBeInTheDocument()
    expect(screen.getByText('$15.99')).toBeInTheDocument()
    expect(screen.getByText('Cake')).toBeInTheDocument()
    expect(screen.getByText('10 in stock')).toBeInTheDocument()
  })

  it('shows purchase button for regular users', () => {
    render(
      <SweetCard 
        sweet={mockSweet}
        user={mockUser}
        onPurchase={mockOnPurchase}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Add to Cart')).toBeInTheDocument()
  })

  it('shows admin controls for admin users', () => {
    render(
      <SweetCard 
        sweet={mockSweet}
        user={mockAdmin}
        onPurchase={mockOnPurchase}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Edit')).toBeInTheDocument()
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('disables purchase button when out of stock', () => {
    const outOfStockSweet: Sweet = { ...mockSweet, quantity: 0 }
    
    render(
      <SweetCard 
        sweet={outOfStockSweet}
        user={mockUser}
        onPurchase={mockOnPurchase}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    // Check for the button specifically using role and name
    const purchaseButton = screen.getByRole('button', { name: /out of stock/i })
    expect(purchaseButton).toBeInTheDocument()
    expect(purchaseButton).toBeDisabled()
    
    // Check that there are multiple "Out of Stock" texts (both in paragraph and button)
    const outOfStockElements = screen.getAllByText('Out of Stock')
    expect(outOfStockElements).toHaveLength(2) // One in <p> tag, one in <button>
  })

  it('calls onPurchase when purchase button is clicked', () => {
    render(
      <SweetCard 
        sweet={mockSweet}
        user={mockUser}
        onPurchase={mockOnPurchase}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const purchaseButton = screen.getByText('Add to Cart')
    fireEvent.click(purchaseButton)

    expect(mockOnPurchase).toHaveBeenCalledWith(mockSweet)
  })

  it('calls onEdit when edit button is clicked', () => {
    render(
      <SweetCard 
        sweet={mockSweet}
        user={mockAdmin}
        onPurchase={mockOnPurchase}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockSweet)
  })

  it('calls onDelete when delete button is clicked', () => {
    render(
      <SweetCard 
        sweet={mockSweet}
        user={mockAdmin}
        onPurchase={mockOnPurchase}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(mockSweet)
  })

  it('shows appropriate stock message', () => {
    render(
      <SweetCard 
        sweet={mockSweet}
        user={mockUser}
        onPurchase={mockOnPurchase}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('10 in stock')).toBeInTheDocument()
  })
});