import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
import { Footer } from '../components/Footer'

describe('Footer', () => {
  it('renders footer component', () => {
    render(<Footer />)
    
    expect(screen.getByText('Florian Jäger')).toBeInTheDocument()
    expect(screen.getByText('Developer & Creator of this Notes App')).toBeInTheDocument()
  })

  it('displays social media links', () => {
    render(<Footer />)
    
    // Check for emoji icons
    expect(screen.getByText('👨‍💻')).toBeInTheDocument()
    expect(screen.getByText('🐙')).toBeInTheDocument()
    expect(screen.getByText('🌐')).toBeInTheDocument()
  })

  it('has correct link attributes', () => {
    render(<Footer />)
    
    const githubLink = screen.getByLabelText('GitHub Profile - flori950')
    const websiteLink = screen.getByLabelText('Personal Website - florian-hunter.de')
    
    expect(githubLink).toHaveAttribute('href', 'https://github.com/flori950')
    expect(websiteLink).toHaveAttribute('href', 'https://florian-hunter.de')
    
    // Check that links open in new tab
    expect(githubLink).toHaveAttribute('target', '_blank')
    expect(websiteLink).toHaveAttribute('target', '_blank')
    
    // Check security attributes
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
    expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('applies ambient header styling', () => {
    render(<Footer />)
    
    const footer = document.querySelector('.ambient-header')
    expect(footer).toBeInTheDocument()
  })

  it('is responsive and accessible', () => {
    render(<Footer />)
    
    // Check for proper semantic structure
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
  })

  it('displays copyright information', () => {
    render(<Footer />)
    
    expect(screen.getByText('© 2025 Note App')).toBeInTheDocument()
    expect(screen.getByText('Built with ❤️ using React & TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Glass Morphism Design')).toBeInTheDocument()
  })
})
