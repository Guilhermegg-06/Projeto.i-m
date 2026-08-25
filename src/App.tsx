import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Camera,
  CircleDollarSign,
  Compass,
  Gem,
  Mail,
  MessageCircle,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UsersRound,
} from 'lucide-react'
import { useRef } from 'react'
import { Brand } from './components/Brand'
import { ContactForm } from './components/ContactForm'
import { Header } from './components/Header'
import { InvestmentProfiles } from './components/InvestmentProfiles'
import { InvestorJourney } from './components/InvestorJourney'
import { PrimaryLink } from './components/PrimaryAction'
import { Reveal } from './components/Reveal'
import { SectionHeading } from './components/SectionHeading'
import {
  casamarBenefits,
  ecosystem,
  links,
  pillars,
  stats,
  testimonials,
} from './content'

const ecosystemIcons = [
  Building2,
  CircleDollarSign,
  Sparkles,
  TrendingUp,
  Compass,
  Gem,
]

const benefitIcons = [TrendingUp, Compass, Sparkles, Building2, ShieldCheck, Gem]

function App() {
  const heroRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const casamarRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const { scrollYProgress: aboutScroll } = useScroll({
    target: aboutRef,
    offset: ['start end', 'end start'],
  })
  const { scrollYProgress: casamarScroll } = useScroll({
    target: casamarRef,
    offset: ['start end', 'end start'],
  })

  const heroImageY = useTransform(heroScroll, [0, 1], ['0%', '12%'])
  const heroImageScale = useTransform(heroScroll, [0, 1], [1.02, 1.1])
  const aboutImageX = useTransform(aboutScroll, [0, 1], [-28, 28])
  const aboutImageRotate = useTransform(aboutScroll, [0, 1], [-1.6, 1.6])
  const casamarImageX = useTransform(casamarScroll, [0, 1], [34, -34])
  const casamarImageScale = useTransform(casamarScroll, [0, 1], [1.08, 1.01])

  return (
    <div className="site-shell">
      <Header />

      <main id="conteudo">
        <section ref={heroRef} id="inicio" className="hero section-anchor">
          <div className="hero__media" aria-hidden="true">
            <motion.img
              src="/assets/imvester-hero-architecture.webp"
              alt=""
              width="1536"
              height="1024"
              fetchPriority="high"
              style={reduceMotion ? undefined : { y: heroImageY, scale: heroImageScale }}
            />
            <div className="hero__veil" />
          </div>

          <div className="hero__content container">
            <Reveal className="hero__copy">
              <p className="eyebrow eyebrow--light">Bem-vindo à IMvester</p>
              <h1>
                Seu novo jeito
                <span>de investir em imóveis.</span>
              </h1>
              <p className="hero__intro">
                Um ecossistema completo de rentabilidade imobiliária, do lançamento
                ao crédito, da decoração à locação.
              </p>
              <div className="hero__actions">
                <PrimaryLink href={links.contact} icon={<ArrowRight aria-hidden="true" />}>
                  Investir
                </PrimaryLink>
                <a
                  className="secondary-action secondary-action--light"
                  href={links.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle aria-hidden="true" />
                  Falar no WhatsApp
                </a>
              </div>
            </Reveal>

            <div className="hero__signature" aria-hidden="true">
              <span>IM</span>
            </div>
          </div>
        </section>

        <section className="proof-bar" aria-label="Indicadores da IMvester">
          <div className="container proof-bar__inner">
            <div className="proof-bar__stats">
              {stats.map((stat) => (
                <div className="proof-stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
            <p>
              Lux Realty para alto padrão. IMvester para todos os perfis de investidor.
            </p>
          </div>
        </section>

        <section ref={aboutRef} id="sobre" className="about section section-anchor">
          <div className="container about__grid">
            <div className="about__content">
              <Reveal>
                <SectionHeading title="Gestão patrimonial com foco em resultado." />
              </Reveal>

              <Reveal className="about__copy" delay={0.06}>
                <p className="lead-copy">
                  Estruturação e gestão de ativos imobiliários com foco em segurança,
                  eficiência e resultado financeiro.
                </p>
                <p>
                  Nossa equipe atua de forma estratégica, interpretando com clareza o
                  perfil e os objetivos de cada investidor para oferecer soluções bem
                  fundamentadas.
                </p>
                <p>
                  A IMvester se posiciona como uma gestora patrimonial que antecipa
                  movimentos do mercado e entrega assessoria especializada em produtos
                  exclusivos e de alto padrão.
                </p>
              </Reveal>

              <div className="pillars">
                {pillars.map((pillar, index) => (
                  <Reveal className="pillar-row" delay={index * 0.05} key={pillar.title}>
                    <span>0{index + 1}</span>
                    <div>
                      <h3>{pillar.title}</h3>
                      <p>{pillar.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal className="about__visual" delay={0.08}>
              <figure>
                <div className="about__image-wrap">
                  <motion.img
                    src="/assets/imvester-team.jpg"
                    alt="Equipe IMvester em reunião com vista para a cidade"
                    width="1600"
                    height="1280"
                    loading="lazy"
                    style={reduceMotion ? undefined : { x: aboutImageX, rotate: aboutImageRotate }}
                  />
                </div>
                <figcaption>
                  <strong>10+</strong>
                  <span>Anos transformando o mercado imobiliário</span>
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </section>

        <section id="ecossistema" className="ecosystem-section section section-anchor">
          <div className="container">
            <div className="ecosystem-section__heading">
              <Reveal>
                <SectionHeading
                  title="Como a IMvester pode te ajudar."
                  description="Verticais integradas que cobrem todo o ciclo do investimento imobiliário, do lançamento ao recebimento do aluguel."
                  light
                />
              </Reveal>
              <Reveal className="ecosystem-section__statement" delay={0.08}>
                <span>Um único parceiro.</span>
                <strong>Todas as soluções para o seu próximo investimento.</strong>
              </Reveal>
            </div>

            <div className="ecosystem-layout">
              <aside className="ecosystem-aside" aria-hidden="true">
                <div className="ecosystem-monolith">
                  <span className="ecosystem-monolith__face" />
                  <span className="ecosystem-monolith__edge" />
                </div>
              </aside>

              <div className="service-list">
                {ecosystem.map((item, index) => {
                  const Icon = ecosystemIcons[index]
                  return (
                    <Reveal className="service-row" delay={(index % 2) * 0.05} key={item.number}>
                      <div className="service-row__meta">
                        <Icon aria-hidden="true" />
                        <span>{item.number}</span>
                      </div>
                      <div className="service-row__body">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                      <ArrowUpRight className="service-row__arrow" aria-hidden="true" />
                    </Reveal>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <section ref={casamarRef} id="destaque" className="casamar section section-anchor">
          <div className="container casamar__stage">
            <motion.div
              className="casamar__visual"
              style={reduceMotion ? undefined : { x: casamarImageX }}
            >
              <motion.img
                src="/assets/casamar-artefacto.jpg"
                alt="CasaMar Artefacto, empreendimento residencial em cenário litorâneo"
                width="1280"
                height="1600"
                loading="lazy"
                style={reduceMotion ? undefined : { scale: casamarImageScale }}
              />
            </motion.div>

            <Reveal className="casamar__panel">
              <SectionHeading
                eyebrow="Destaque do mês"
                title="CasaMar Artefacto"
                description="Investimento patrimonial com a maior rentabilidade do mercado. Localização premium, gestão profissional e seis razões para começar hoje."
                light
              />

              <div className="casamar__rate">
                <span>Renda passiva premium</span>
                <strong>a partir de 0,8% a.m.</strong>
              </div>

              <div className="benefits-list">
                {casamarBenefits.map((benefit, index) => {
                  const Icon = benefitIcons[index]
                  return (
                    <div className="benefit-row" key={benefit.title}>
                      <Icon aria-hidden="true" />
                      <div>
                        <h3>{benefit.title}</h3>
                        <p>{benefit.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="casamar__actions">
                <PrimaryLink href={links.contact} icon={<ArrowRight aria-hidden="true" />}>
                  Quero investir
                </PrimaryLink>
                <p className="investment-note">
                  Rentabilidades divulgadas são estimativas e não representam garantia
                  de retorno futuro.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="guide section">
          <div className="container">
            <Reveal>
              <SectionHeading
                title="Guia do investidor."
                description="Da definição do perfil ao relacionamento de longo prazo, cada etapa é estruturada para maximizar segurança, valorização e rentabilidade."
                light
              />
            </Reveal>
            <InvestorJourney />
          </div>
        </section>

        <section id="investimentos" className="profiles section section-anchor">
          <div className="container">
            <Reveal>
              <SectionHeading
                title="Encontre o investimento que conversa com você."
                description="Três caminhos possíveis, uma mesma curadoria patrimonial."
                light
              />
            </Reveal>

            <Reveal delay={0.08}>
              <InvestmentProfiles />
            </Reveal>

            <Reveal className="consultation-banner">
              <div>
                <span>Não sabe por onde começar?</span>
                <h3>
                  Agende uma consultoria gratuita e descubra o melhor caminho para o
                  seu patrimônio.
                </h3>
              </div>
              <PrimaryLink href={links.contact} icon={<ArrowRight aria-hidden="true" />}>
                Agendar consultoria
              </PrimaryLink>
            </Reveal>
          </div>
        </section>

        <section className="testimonials section">
          <div className="container">
            <div className="testimonials__heading-row">
              <Reveal>
                <SectionHeading
                  eyebrow="Avaliações do Google"
                  title="Histórias reais de quem confiou."
                  light
                />
              </Reveal>
              <Reveal className="google-rating" delay={0.08}>
                <strong>5,0</strong>
                <span role="img" aria-label="5 de 5 estrelas">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} fill="currentColor" aria-hidden="true" />
                  ))}
                </span>
                <small>Centenas de avaliações</small>
              </Reveal>
            </div>

            <div
              className="testimonial-track"
              tabIndex={0}
              aria-label="Avaliações de clientes. Use as setas para navegar."
            >
              {testimonials.map((testimonial) => (
                <article className="testimonial-card" key={testimonial.name}>
                  <Quote aria-hidden="true" />
                  <blockquote title={testimonial.quote}>“{testimonial.quote}”</blockquote>
                  <div className="testimonial-card__author">
                    <span>{testimonial.name.charAt(0)}</span>
                    <p>
                      <strong>{testimonial.name}</strong>
                      <small>{testimonial.date}</small>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="contact section section-anchor">
          <div className="container contact__grid">
            <div className="contact__content">
              <Reveal>
                <p className="contact__invitation">Vamos conversar.</p>
                <SectionHeading
                  title="Entre em contato para investir com alta rentabilidade e valorização."
                  description="Acompanhe nosso Instagram para receber as melhores oportunidades."
                  light
                />
              </Reveal>

              <Reveal className="contact-links" delay={0.08}>
                <a href={links.whatsappDirect} target="_blank" rel="noreferrer">
                  <MessageCircle aria-hidden="true" />
                  <span><small>WhatsApp</small><strong>+55 (11) 91175-2888</strong></span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
                <a href={links.email}>
                  <Mail aria-hidden="true" />
                  <span><small>E-mail</small><strong>ativacao@imvester.com.br</strong></span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
                <a href={links.instagram} target="_blank" rel="noreferrer">
                  <Camera aria-hidden="true" />
                  <span><small>Instagram</small><strong>@imvester.br</strong></span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </Reveal>

              <Reveal className="contact__trust" delay={0.14}>
                <UsersRound aria-hidden="true" />
                <span>
                  <strong>Atendimento próximo, análise precisa.</strong>
                  Um especialista acompanha você em cada decisão.
                </span>
              </Reveal>
            </div>

            <Reveal className="contact__form-wrap" delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand-column">
            <a href="#inicio" aria-label="IMvester, voltar ao início"><Brand /></a>
            <p>Gestão patrimonial com foco em segurança, eficiência e resultado financeiro.</p>
          </div>

          <div>
            <h3>Ecossistema</h3>
            <ul>
              {['IM Lançamento', 'IM Capital, Crédito', 'IM Decor', 'Halugo, Gestão de locação', 'IM Terceiros', 'IM Lux, Alto padrão'].map((item) => (
                <li key={item}><a href="#ecossistema">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h3>Institucional</h3>
            <ul>
              <li><a href="#inicio">Início</a></li>
              <li><a href="#sobre">Sobre</a></li>
              <li><a href="#destaque">Portfólio</a></li>
              <li><a href="#investimentos">Investimentos</a></li>
              <li><a href="#contato">Contato</a></li>
            </ul>
          </div>

          <div>
            <h3>Contato</h3>
            <ul>
              <li><a href={links.phone}>+55 (11) 91175-2888</a></li>
              <li><a href={links.email}>ativacao@imvester.com.br</a></li>
              <li><a href={links.instagram} target="_blank" rel="noreferrer">@imvester.br</a></li>
              <li>São Paulo, Brasil</li>
            </ul>
          </div>
        </div>

        <div className="container footer__bottom">
          <span>© 2026 IMvester. Todos os direitos reservados.</span>
          <span>Crafted with elegance</span>
        </div>
      </footer>

      <a
        className="floating-whatsapp"
        href={links.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a IMvester pelo WhatsApp"
      >
        <MessageCircle aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
    </div>
  )
}

export default App
