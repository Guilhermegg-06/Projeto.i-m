import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { links } from '../content'
import { Brand } from './Brand'
import { PrimaryLink } from './PrimaryAction'

const navItems = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Ecossistema', href: '#ecossistema' },
  { label: 'Investimentos', href: '#investimentos' },
  { label: 'Contato', href: '#contato' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuPanelRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24)
  })

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = menuPanelRef.current
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    )
    focusable?.[0]?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || !focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    window.setTimeout(() => menuButtonRef.current?.focus(), 0)
  }

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className={`site-header${scrolled ? ' site-header--scrolled' : ''}`}>
        <div className="site-header__inner container">
          <a className="site-header__brand" href="#inicio" aria-label="IMvester, início">
            <Brand />
          </a>

          <nav className="desktop-nav" aria-label="Navegação principal">
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="desktop-actions">
            <a
              className="text-link"
              href={links.careers}
              target="_blank"
              rel="noreferrer"
            >
              Trabalhe conosco <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <PrimaryLink
              className="uiverse-button--compact"
              href={links.whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              Falar no WhatsApp
            </PrimaryLink>
          </div>

          <button
            ref={menuButtonRef}
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu-backdrop"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeMenu()
            }}
          >
            <motion.div
              ref={menuPanelRef}
              id="menu-mobile"
              className="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label="Menu de navegação"
              initial={reduceMotion ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mobile-menu__top">
                <Brand />
                <button type="button" onClick={closeMenu} aria-label="Fechar menu">
                  <X aria-hidden="true" />
                </button>
              </div>
              <nav aria-label="Navegação mobile">
                {navItems.map((item) => (
                  <a key={item.href} href={item.href} onClick={closeMenu}>
                    {item.label}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
              </nav>
              <div className="mobile-menu__actions">
                <a
                  className="secondary-action secondary-action--full"
                  href={links.careers}
                  target="_blank"
                  rel="noreferrer"
                >
                  Trabalhe conosco
                </a>
                <PrimaryLink
                  href={links.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  Falar no WhatsApp
                </PrimaryLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
