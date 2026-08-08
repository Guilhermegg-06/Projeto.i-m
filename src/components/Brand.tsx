type BrandProps = {
  className?: string
}

export function Brand({ className = '' }: BrandProps) {
  return (
    <img
      className={`brand ${className}`.trim()}
      src="/assets/imvester-logo.png"
      alt="IMvester"
      width="1920"
      height="381"
    />
  )
}

