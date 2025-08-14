import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSessionStorage } from '../hooks/use-session-storage'

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

describe('useSessionStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSessionStorage.clear()
  })

  it('returns initial value when no stored value exists', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial-value'))
    
    expect(result.current[0]).toBe('initial-value')
  })

  it('returns stored value when it exists', () => {
    mockSessionStorage.setItem('test-key', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial-value'))
    
    expect(result.current[0]).toBe('stored-value')
  })

  it('sets value in session storage', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial-value'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(result.current[0]).toBe('new-value')
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('test-key', JSON.stringify('new-value'))
  })

  it('removes value from session storage', () => {
    mockSessionStorage.setItem('test-key', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial-value'))
    
    act(() => {
      result.current[2]()
    })
    
    expect(result.current[0]).toBe('initial-value')
    expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('test-key')
  })

  it('handles complex objects', () => {
    const complexObject = { id: 1, name: 'Test', items: ['a', 'b', 'c'] }
    
    const { result } = renderHook(() => useSessionStorage('complex-key', complexObject))
    
    act(() => {
      result.current[1]({ id: 2, name: 'Updated', items: ['x', 'y'] })
    })
    
    expect(result.current[0]).toEqual({ id: 2, name: 'Updated', items: ['x', 'y'] })
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
      'complex-key',
      JSON.stringify({ id: 2, name: 'Updated', items: ['x', 'y'] })
    )
  })

  it('handles arrays', () => {
    const initialArray = [1, 2, 3]
    
    const { result } = renderHook(() => useSessionStorage('array-key', initialArray))
    
    act(() => {
      result.current[1]([4, 5, 6])
    })
    
    expect(result.current[0]).toEqual([4, 5, 6])
  })

  it('handles invalid JSON gracefully', () => {
    // Manually set invalid JSON in storage
    mockSessionStorage.getItem = vi.fn().mockReturnValue('invalid-json{')
    
    const { result } = renderHook(() => useSessionStorage('invalid-key', 'fallback'))
    
    expect(result.current[0]).toBe('fallback')
  })

  it('handles session storage errors gracefully', () => {
    // Mock session storage to throw errors
    mockSessionStorage.setItem = vi.fn().mockImplementation(() => {
      throw new Error('Storage quota exceeded')
    })
    
    const { result } = renderHook(() => useSessionStorage('error-key', 'initial'))
    
    // Should not throw when setting value
    act(() => {
      result.current[1]('new-value')
    })
    
    // Value should still be updated in state
    expect(result.current[0]).toBe('new-value')
  })

  it('handles function updates', () => {
    const { result } = renderHook(() => useSessionStorage('function-key', 10))
    
    act(() => {
      result.current[1]((prev: number) => prev + 5)
    })
    
    expect(result.current[0]).toBe(15)
  })

  it('persists value across hook re-renders', () => {
    const { result, rerender } = renderHook(() => useSessionStorage('persist-key', 'initial'))
    
    act(() => {
      result.current[1]('updated')
    })
    
    rerender()
    
    expect(result.current[0]).toBe('updated')
  })
})
