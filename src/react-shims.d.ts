declare module 'react' {
  export type ReactNode = unknown
  export type Dispatch<T> = (value: T) => void
  export type SetStateAction<T> = T | ((previous: T) => T)

  export function createElement(
    type: unknown,
    props?: Record<string, unknown> | null,
    ...children: ReactNode[]
  ): ReactNode

  export function useState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>]
}

declare module 'react-dom/client' {
  import type { ReactNode } from 'react'

  export interface Root {
    render(children: ReactNode): void
    unmount(): void
  }

  export function createRoot(container: Element | DocumentFragment): Root
}
