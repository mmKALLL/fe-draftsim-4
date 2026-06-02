declare module 'react' {
  export type ReactNode = unknown

  export function createElement(
    type: string | ((props: Record<string, unknown>) => ReactNode),
    props?: Record<string, unknown> | null,
    ...children: ReactNode[]
  ): ReactNode
}

declare module 'react-dom/client' {
  import type { ReactNode } from 'react'

  export interface Root {
    render(children: ReactNode): void
    unmount(): void
  }

  export function createRoot(container: Element | DocumentFragment): Root
}

