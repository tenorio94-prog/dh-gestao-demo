/** Placa no padrão Mercosul: faixa azul "BRASIL" e caracteres em fonte monoespaçada. */
export function PlateBadge({ plate, large = false }: { plate: string; large?: boolean }) {
  return (
    <span
      className="inline-flex flex-col overflow-hidden rounded-md border border-[#003399] bg-white shadow-[inset_0_1px_2px_rgb(0_0_0/0.06)]"
      aria-label={`Placa ${plate}`}
    >
      <span className="flex items-center justify-between bg-[#003399] px-2 text-[9px] font-extrabold leading-3 tracking-widest text-white">
        BRASIL
        <span className="ml-3 inline-block size-1.5 rounded-full bg-[#ffdf00]" />
      </span>
      <span
        className={`px-2.5 py-0.5 text-center font-mono font-extrabold tracking-[0.12em] text-[#111827] ${
          large ? 'text-2xl' : 'text-lg'
        }`}
      >
        {plate}
      </span>
    </span>
  )
}
