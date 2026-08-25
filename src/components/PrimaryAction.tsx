import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react'

type PrimaryActionContentProps = {
  children: ReactNode
  icon?: ReactNode
}

type PrimaryLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  PrimaryActionContentProps

type PrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  PrimaryActionContentProps

function PrimaryActionContent({ children, icon }: PrimaryActionContentProps) {
  return (
    <>
      <span className="uiverse-button__label">{children}</span>
      {icon && <span className="uiverse-button__icon">{icon}</span>}
    </>
  )
}

export function PrimaryLink({
  children,
  icon,
  className = '',
  ...props
}: PrimaryLinkProps) {
  return (
    <a {...props} className={`uiverse-button ${className}`.trim()}>
      <PrimaryActionContent icon={icon}>{children}</PrimaryActionContent>
    </a>
  )
}

export function PrimaryButton({
  children,
  icon,
  className = '',
  ...props
}: PrimaryButtonProps) {
  return (
    <button {...props} className={`uiverse-button ${className}`.trim()}>
      <PrimaryActionContent icon={icon}>{children}</PrimaryActionContent>
    </button>
  )
}
