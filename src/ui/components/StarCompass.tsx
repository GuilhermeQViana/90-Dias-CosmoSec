// Logo star-compass da marca, em SVG vetorial limpo. Sem arquivo de imagem.
export function StarCompass({ size = 64 }: { size?: number }): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="Logo star-compass da CosmoSec"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="32" cy="32" r="28" stroke="#3B82F6" strokeOpacity="0.4" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="20" stroke="#22D3EE" strokeOpacity="0.3" strokeWidth="1" />
      <path d="M32 4 L37 27 L32 60 L27 27 Z" fill="#22D3EE" fillOpacity="0.9" />
      <path d="M4 32 L27 27 L60 32 L27 37 Z" fill="#3B82F6" fillOpacity="0.8" />
      <circle cx="32" cy="32" r="3" fill="#F8FAFC" />
    </svg>
  )
}
