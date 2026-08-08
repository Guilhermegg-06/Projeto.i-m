import { ArrowUpRight, LockKeyhole } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { formOptions, links } from '../content'

function Options({ options }: { options: { value: string; label: string }[] }) {
  return options.map((option) => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))
}

export function ContactForm() {
  const [region, setRegion] = useState('')
  const [showNotice, setShowNotice] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    setShowNotice(true)
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate={false}>
      <div className="form-grid">
        <label className="field field--wide" htmlFor="name">
          <span>Nome *</span>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Seu nome completo"
            maxLength={120}
            required
          />
        </label>

        <label className="field" htmlFor="email">
          <span>E-mail *</span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="voce@email.com"
            maxLength={180}
            required
          />
        </label>

        <label className="field" htmlFor="phone">
          <span>Telefone *</span>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="(11) 99999-9999"
            maxLength={20}
            required
          />
        </label>

        <label className="field" htmlFor="region">
          <span>Região desejada *</span>
          <select
            id="region"
            name="region"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            required
          >
            <option value="" disabled>
              Selecione uma região
            </option>
            <Options options={formOptions.regions} />
          </select>
        </label>

        {region === 'outra' && (
          <label className="field" htmlFor="other-region">
            <span>Qual região? *</span>
            <input
              id="other-region"
              name="otherRegion"
              type="text"
              placeholder="Informe a região"
              maxLength={100}
              required
            />
          </label>
        )}

        <label className="field" htmlFor="investment">
          <span>Investimento para o momento *</span>
          <select id="investment" name="investment" defaultValue="" required>
            <option value="" disabled>
              Selecione uma faixa
            </option>
            <Options options={formOptions.investments} />
          </select>
        </label>

        <label className="field" htmlFor="property-type">
          <span>Tipo do imóvel *</span>
          <select id="property-type" name="propertyType" defaultValue="" required>
            <option value="" disabled>
              Selecione o tipo
            </option>
            <Options options={formOptions.propertyTypes} />
          </select>
        </label>

        <label className="field" htmlFor="typology">
          <span>Tipologia desejada *</span>
          <select id="typology" name="typology" defaultValue="" required>
            <option value="" disabled>
              Selecione a tipologia
            </option>
            <Options options={formOptions.typologies} />
          </select>
        </label>

        <label className="field field--wide" htmlFor="message">
          <span>Mensagem</span>
          <textarea
            id="message"
            name="message"
            rows={3}
            maxLength={1000}
            placeholder="Como podemos ajudar?"
          />
        </label>
      </div>

      <button className="button button--accent button--submit" type="submit">
        Enviar mensagem <ArrowUpRight aria-hidden="true" />
      </button>

      <p className="form-privacy">
        <LockKeyhole size={14} aria-hidden="true" />
        Seus dados não são enviados sem uma integração segura.
      </p>

      {showNotice && (
        <div className="form-notice" role="status" aria-live="polite">
          <strong>O formulário está pronto para receber a integração.</strong>
          <span>
            Como o site atual não possui uma API de envio, seus dados não foram
            transmitidos. Para atendimento imediato, fale pelo{' '}
            <a href={links.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            .
          </span>
        </div>
      )}
    </form>
  )
}

