import { useState, useEffect, useCallback } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* 存储不可用时静默忽略 */
    }
  }, [key, value])

  const update = useCallback((v: T | ((prev: T) => T)) => setValue(v as T), [])
  return [value, update] as const
}
