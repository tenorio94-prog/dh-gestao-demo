import { Undo2 } from 'lucide-react'
import { useEffect } from 'react'
import { useStore } from '../store/useStore'

const VISIBLE_MS = 7000

/** Confirma a última ação e deixa desfazer por alguns segundos (toque errado com a mão molhada). */
export function UndoToast() {
  const undo = useStore((s) => s.undo)
  const undoLast = useStore((s) => s.undoLast)
  const dismiss = useStore((s) => s.dismissUndo)

  useEffect(() => {
    if (!undo) return
    const timer = window.setTimeout(dismiss, VISIBLE_MS)
    return () => window.clearTimeout(timer)
  }, [undo, dismiss])

  if (!undo) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-20 flex justify-center px-4">
      <div
        role="status"
        className="toast-in pointer-events-auto flex w-full max-w-lg items-center justify-between gap-2 rounded-2xl bg-ink py-1.5 pl-4 pr-1.5 text-white shadow-2xl"
      >
        <p className="text-sm font-bold">{undo.message}</p>
        <button
          type="button"
          onClick={undoLast}
          className="inline-flex min-h-12 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-extrabold text-aqua-soft active:bg-white/10"
        >
          <Undo2 size={18} aria-hidden="true" /> Desfazer
        </button>
      </div>
    </div>
  )
}
