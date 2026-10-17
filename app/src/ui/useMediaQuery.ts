import { useSyncExternalStore } from 'react'

/** Acompanha uma media query; usada para trocar a casca do app entre celular e computador. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', notify)
      return () => list.removeEventListener('change', notify)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useDesktop = () => useMediaQuery('(min-width: 1024px)')
