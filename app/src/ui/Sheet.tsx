import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useRef, useState, type PointerEvent, type ReactNode } from 'react'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
}

const CLOSE_DISTANCE = 110

/**
 * Painel que sobe de baixo da tela. O Radix cuida de foco preso dentro do painel,
 * Esc, trava da rolagem e ARIA; aqui entra só o gesto de arrastar para baixo.
 */
export function Sheet({ title, onClose, children }: Props) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startY = useRef(0)

  function down(event: PointerEvent<HTMLDivElement>) {
    if (window.matchMedia('(min-width: 1024px)').matches) return // painel lateral não arrasta
    startY.current = event.clientY
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  function move(event: PointerEvent<HTMLDivElement>) {
    if (dragging) setOffset(Math.max(0, event.clientY - startY.current))
  }
  function up() {
    if (!dragging) return
    setDragging(false)
    if (offset > CLOSE_DISTANCE) onClose()
    else setOffset(0)
  }

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Content
          aria-describedby={undefined}
          style={{ transform: offset ? `translateY(${offset}px)` : undefined, transition: dragging ? 'none' : undefined }}
          className="sheet-in fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92dvh] w-full max-w-lg flex-col rounded-t-3xl bg-canvas shadow-2xl outline-none lg:inset-y-0 lg:left-auto lg:right-0 lg:mx-0 lg:h-dvh lg:max-h-none lg:max-w-md lg:rounded-none lg:rounded-l-3xl"
        >
          <div
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            className="touch-none select-none"
          >
            <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-line lg:hidden" aria-hidden="true" />
            <div className="flex items-center justify-between px-5 pb-2 pt-2 lg:pt-5">
              <Dialog.Title className="text-xl font-extrabold text-brand-deep">{title}</Dialog.Title>
              <Dialog.Close
                aria-label="Fechar"
                className="grid size-12 place-items-center rounded-full text-ink-soft active:bg-aqua-wash"
              >
                <X />
              </Dialog.Close>
            </div>
          </div>
          <div className="overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
