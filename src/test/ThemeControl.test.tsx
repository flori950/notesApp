import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { ThemeControl } from '../components/ThemeControl'

// Mock session storage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
})

describe('ThemeControl', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSessionStorage.clear()
    // Reset document attributes
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.removeAttribute('data-accent')
  })

  it('renders theme toggle button', () => {
    render(<ThemeControl />)
    
    const themeButton = screen.getByLabelText('Switch to dark mode')
    expect(themeButton).toBeInTheDocument()
  })

  it('renders accent color buttons', () => {
    render(<ThemeControl />)
    
    expect(screen.getByLabelText('Set Ocean Blue accent color')).toBeInTheDocument()
    expect(screen.getByLabelText('Set Royal Purple accent color')).toBeInTheDocument()
    expect(screen.getByLabelText('Set Forest Emerald accent color')).toBeInTheDocument()
    expect(screen.getByLabelText('Set Sunset Orange accent color')).toBeInTheDocument()
    expect(screen.getByLabelText('Set Cherry Pink accent color')).toBeInTheDocument()
    expect(screen.getByLabelText('Set Cool Mint accent color')).toBeInTheDocument()
  })

  it('toggles theme from light to dark', async () => {
    const user = userEvent.setup()
    render(<ThemeControl />)
    
    const themeButton = screen.getByLabelText('Switch to dark mode')
    await user.click(themeButton)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('theme', JSON.stringify('dark'))
  })

  it('toggles theme from dark to light', async () => {
    const user = userEvent.setup()
    
    // Set initial dark theme
    mockSessionStorage.setItem('theme', JSON.stringify('dark'))
    
    render(<ThemeControl />)
    
    const themeButton = screen.getByLabelText('Switch to light mode')
    await user.click(themeButton)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('theme', JSON.stringify('light'))
  })

  it('changes accent color to purple', async () => {
    const user = userEvent.setup()
    render(<ThemeControl />)
    
    const purpleButton = screen.getByLabelText('Set Royal Purple accent color')
    await user.click(purpleButton)
    
    expect(document.documentElement.getAttribute('data-accent')).toBe('purple')
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('accent', JSON.stringify('purple'))
  })

  it('loads saved theme from session storage', () => {
    mockSessionStorage.setItem('theme', JSON.stringify('dark'))
    
    render(<ThemeControl />)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('loads saved accent color from session storage', () => {
    mockSessionStorage.setItem('accent', JSON.stringify('emerald'))
    
    render(<ThemeControl />)
    
    expect(document.documentElement.getAttribute('data-accent')).toBe('emerald')
  })

  it('uses default values when no saved preferences exist', () => {
    render(<ThemeControl />)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(document.documentElement.getAttribute('data-accent')).toBe('blue')
  })

  it('displays correct theme icon for light theme', () => {
    render(<ThemeControl />)
    
    // Should show moon icon for light theme (indicating it will switch to dark)
    expect(screen.getByText('🌙')).toBeInTheDocument()
  })

  it('displays correct theme icon for dark theme', () => {
    mockSessionStorage.setItem('theme', JSON.stringify('dark'))
    
    render(<ThemeControl />)
    
    // Should show sun icon for dark theme (indicating it will switch to light)
    expect(screen.getByText('☀️')).toBeInTheDocument()
  })

  it('shows active accent color with pressed state', () => {
    render(<ThemeControl />)
    
    const blueButton = screen.getByLabelText('Set Ocean Blue accent color')
    expect(blueButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('handles rapid theme toggles', async () => {
    const user = userEvent.setup()
    render(<ThemeControl />)
    
    const themeButton = screen.getByLabelText('Switch to dark mode')
    
    // Rapidly toggle theme multiple times
    await user.click(themeButton)
    await user.click(screen.getByLabelText('Switch to light mode'))
    await user.click(screen.getByLabelText('Switch to dark mode'))
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('handles multiple accent color changes', async () => {
    const user = userEvent.setup()
    render(<ThemeControl />)
    
    await user.click(screen.getByLabelText('Set Royal Purple accent color'))
    await user.click(screen.getByLabelText('Set Sunset Orange accent color'))
    await user.click(screen.getByLabelText('Set Cool Mint accent color'))
    
    expect(document.documentElement.getAttribute('data-accent')).toBe('mint')
    expect(mockSessionStorage.setItem).toHaveBeenLastCalledWith('accent', JSON.stringify('mint'))
  })

  it('maintains button titles for accessibility', () => {
    render(<ThemeControl />)
    
    const themeButton = screen.getByLabelText('Switch to dark mode')
    expect(themeButton).toHaveAttribute('title', 'Switch to dark mode')
    
    const blueButton = screen.getByLabelText('Set Ocean Blue accent color')
    expect(blueButton).toHaveAttribute('title', 'Set Ocean Blue accent color')
  })
})
