type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  light?: boolean
  align?: 'left' | 'center'
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  align = 'left',
}: SectionHeadingProps) {
  return (
    <header
      className={`section-heading section-heading--${align}${light ? ' section-heading--light' : ''}`}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="section-heading__description">{description}</p>}
    </header>
  )
}

