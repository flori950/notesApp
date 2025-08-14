import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { SEOHead } from '../components/SEOHead'

// Helper to render component with HelmetProvider
const renderWithHelmet = (component: React.ReactNode) => {
  return render(
    <HelmetProvider>
      {component}
    </HelmetProvider>
  )
}

describe('SEOHead', () => {
  it('renders without crashing', () => {
    renderWithHelmet(<SEOHead />)
  })

  it('renders with custom title', () => {
    renderWithHelmet(<SEOHead title="Custom Page Title" />)
  })

  it('renders with custom description', () => {
    renderWithHelmet(<SEOHead description="Custom description for testing" />)
  })

  it('renders with custom keywords', () => {
    renderWithHelmet(<SEOHead keywords="test, keywords, custom" />)
  })

  it('renders with all custom props', () => {
    renderWithHelmet(
      <SEOHead 
        title="Custom Title"
        description="Custom description"
        keywords="custom, keywords"
        ogImage="/custom-image.png"
        canonicalUrl="https://test.example.com"
      />
    )
  })

  it('renders component successfully', () => {
    const { container } = renderWithHelmet(<SEOHead title="Test Title" />)
    
    // Component should render without errors
    expect(container).toBeTruthy()
  })

  it('renders with default props', () => {
    const { container } = renderWithHelmet(<SEOHead />)
    
    // Should render with default configuration
    expect(container).toBeTruthy()
  })
})
