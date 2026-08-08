import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  CircleDollarSign,
  Compass,
  Gem,
  Camera,
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
import { Reveal } from './components/Reveal'
import { SectionHeading } from './components/SectionHeading'
import {
  casamarBenefits,
  ecosystem,
  investorSteps,
  links,
  pillars,
  profiles,
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
  const reduceMotion = useReducedMotion()
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const { scrollYProgress } = useScroll()
  const heroImageY = useTransform(heroScroll, [0, 1], ['0%', '16%'])
  const heroImageScale = useTransform(heroScroll, [0, 1], [1.02, 1.13])
  const sculptureX = useTransform(scrollYProgress, [0.12, 0.38, 0.7], ['-5vw', '5vw', '-2vw'])
  const sculptureRotate = useTransform(scrollYProgress, [0.12, 0.7], [-12, 14])

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
            <div className="hero__grain" />
          </div>

          <div className="hero__content container">
            <Reveal className="hero__copy">
              <p className="eyebrow eyebrow--light">Bem-vindo à IMvester</p>
              <h1>
                Seu novo jeito
                <span>de investir em imóveis.</span>
              </h1>
              <p className="hero__intro">
                Um ecossistema completo de rentabilidade imobiliária — do
                lançamento ao crédito, da decoração à locação. Lux Realty para
                alto padrão, IMvester para todos os perfis de investidor.
              </p>
              <div className="hero__actions">
                <a className="button button--accent" href={links.contact}>
                  Investir <ArrowRight aria-hidden="true" />
                </a>
                <a
                  className="button button--glass"
                  href={links.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle aria-hidden="true" /> Falar no WhatsApp
                </a>
              </div>
            </Reveal>

            <Reveal className="hero__stats" delay={0.18}>
              {stats.map((stat) => (
                <div className="hero-stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </Reveal>
          </div>

          <a className="scroll-cue" href="#sobre">
            <span>Role para descobrir</span>
            <ArrowDown aria-hidden="true" />
          </a>
        </section>

        <section id="sobre" className="about section section-anchor">
          <div className="container about__grid">
            <Reveal className="about__visual">
              <div className="about__image-wrap">
                <img
                  src="/assets/imvester-team.jpg"
                  alt="Equipe IMvester em reunião com vista para a cidade"
                  width="1600"
                  height="1280"
                  loading="lazy"
                />
                <div className="about__badge">
                  <strong>10+</strong>
                  <span>Anos transformando o mercado imobiliário</span>
                </div>
              </div>
            </Reveal>

            <div className="about__content">
              <Reveal>
                <SectionHeading
                  eyebrow="Sobre a IMvester"
                  title="Gestão patrimonial com foco em resultado."
                />
              </Reveal>
              <Reveal delay={0.08}>
                <p className="lead-copy">
                  Estruturação e gestão de ativos imobiliários com foco em
                  segurança, eficiência e resultado financeiro.
                </p>
                <p>
                  Nossa equipe atua de forma estratégica, interpretando com
                  clareza o perfil e os objetivos de cada investidor para oferecer
                  soluções bem fundamentadas.
                </p>
                <p>
                  A IMvester se posiciona como uma gestora patrimonial que antecipa
                  movimentos do mercado e entrega assessoria especializada em
                  produtos exclusivos e de alto padrão.
                </p>
              </Reveal>

              <div className="pillars">
                {pillars.map((pillar, index) => (
                  <Reveal className="pillar" delay={index * 0.06} key={pillar.title}>
                    <span>0{index + 1}</span>
                    <div>
                      <h3>{pillar.title}</h3>
                      <p>{pillar.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="ecossistema" className="ecosystem-section section section-anchor">
          <motion.div
            className="architectural-sculpture"
            aria-hidden="true"
            style={reduceMotion ? undefined : { x: sculptureX, rotate: sculptureRotate }}
          >
            <span className="architectural-sculpture__core" />
            <span className="architectural-sculpture__ring architectural-sculpture__ring--one" />
            <span className="architectural-sculpture__ring architectural-sculpture__ring--two" />
          </motion.div>

          <div className="container">
            <Reveal>
              <SectionHeading
                eyebrow="Nosso modelo de atuação"
                title="Como a IMvester pode te ajudar."
                description="Verticais integradas que cobrem todo o ciclo do investimento imobiliário — do lançamento ao recebimento do aluguel."
                light
              />
            </Reveal>

            <div className="ecosystem-grid">
              {ecosystem.map((item, index) => {
                const Icon = ecosystemIcons[index]
                return (
                  <Reveal className="ecosystem-card" delay={(index % 3) * 0.07} key={item.number}>
                    <div className="ecosystem-card__top">
                      <span>{item.number}</span>
                      <Icon aria-hidden="true" />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="ecosystem-card__line" />
                  </Reveal>
                )
              })}
            </div>

            <Reveal className="ecosystem-conclusion">
              <p>Um único parceiro.</p>
              <strong>Todas as soluções para o seu próximo investimento.</strong>
            </Reveal>
          </div>
        </section>

        <section id="destaque" className="casamar section section-anchor">
          <div className="container casamar__grid">
            <Reveal className="casamar__visual">
              <div className="casamar__image-wrap">
                <img
                  src="/assets/casamar-artefacto.jpg"
                  alt="CasaMar Artefacto, empreendimento residencial em cenário litorâneo"
                  width="1280"
                  height="1600"
                  loading="lazy"
                />
                <div className="casamar__rate">
                  <span>Renda passiva premium</span>
                  <strong>a partir de 0,8% a.m.</strong>
                </div>
              </div>
            </Reveal>

            <div className="casamar__content">
              <Reveal>
                <SectionHeading
                  eyebrow="Destaque do mês"
                  title="CasaMar Artefacto"
                  description="Investimento patrimonial com a maior rentabilidade do mercado. Localização premium, gestão profissional e seis razões para começar hoje."
                />
              </Reveal>

              <div className="benefits-grid">
                {casamarBenefits.map((benefit, index) => {
                  const Icon = benefitIcons[index]
                  return (
                    <Reveal className="benefit" delay={(index % 2) * 0.06} key={benefit.title}>
                      <Icon aria-hidden="true" />
                      <div>
                        <h3>{benefit.title}</h3>
                        <p>{benefit.description}</p>
                      </div>
                    </Reveal>
                  )
                })}
              </div>

              <Reveal className="casamar__actions">
                <a className="button button--dark" href={links.contact}>
                  Quero investir <ArrowRight aria-hidden="true" />
                </a>
                <p className="investment-note">
                  Rentabilidades divulgadas são estimativas e não representam
                  garantia de retorno futuro.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="guide section">
          <div className="container">
            <Reveal>
              <SectionHeading
                eyebrow="Passo a passo"
                title="Guia do investidor."
                description="Da definição do perfil ao relacionamento de longo prazo — cada etapa estruturada para maximizar segurança, valorização e rentabilidade."
              />
            </Reveal>

            <div className="timeline">
              <div className="timeline__rail" aria-hidden="true">
                <motion.span
                  initial={reduceMotion ? false : { scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              {investorSteps.map((step, index) => (
                <Reveal className="timeline-item" key={step.number} delay={(index % 2) * 0.05}>
                  <span className="timeline-item__number">{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="investimentos" className="profiles section section-anchor">
          <div className="container">
            <Reveal>
              <SectionHeading
                eyebrow="Estratégias para cada objetivo"
                title="Encontre o investimento que conversa com você."
                description="Três caminhos possíveis, uma mesma curadoria patrimonial."
                align="center"
              />
            </Reveal>

            <div className="profiles-grid">
              {profiles.map((profile, index) => (
                <Reveal
                  className={`profile-card${profile.featured ? ' profile-card--featured' : ''}`}
                  delay={index * 0.06}
                  key={profile.name}
                >
                  {profile.featured && <span className="profile-card__tag">Mais escolhido</span>}
                  <p className="profile-card__index">0{index + 1}</p>
                  <h3>{profile.name}</h3>
                  <p className="profile-card__intro">{profile.intro}</p>
                  <div className="profile-card__value">
                    <strong>{profile.value}</strong>
                    <span>{profile.period}</span>
                  </div>
                  <ul>
                    {profile.features.map((feature) => (
                      <li key={feature}>
                        <Check aria-hidden="true" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <a className="profile-card__link" href={links.contact}>
                    Quero saber mais <ArrowUpRight aria-hidden="true" />
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal className="consultation-banner">
              <div>
                <span>Não sabe por onde começar?</span>
                <h3>
                  Agende uma consultoria gratuita e descubra o melhor caminho para
                  o seu patrimônio.
                </h3>
              </div>
              <a className="button button--ivory" href={links.contact}>
                Agendar consultoria <ArrowRight aria-hidden="true" />
              </a>
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
                />
              </Reveal>
              <Reveal className="google-rating" delay={0.08}>
                <strong>5,0</strong>
                <span>
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} fill="currentColor" aria-hidden="true" />
                  ))}
                </span>
                <small>centenas de avaliações</small>
              </Reveal>
            </div>

            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <Reveal className="testimonial-card" delay={index * 0.07} key={testimonial.name}>
                  <Quote aria-hidden="true" />
                  <blockquote>“{testimonial.quote}”</blockquote>
                  <div className="testimonial-card__author">
                    <span>{testimonial.name.charAt(0)}</span>
                    <p>
                      <strong>{testimonial.name}</strong>
                      <small>{testimonial.date}</small>
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="contact section section-anchor">
          <div className="container contact__grid">
            <div className="contact__content">
              <Reveal>
                <SectionHeading
                  eyebrow="Vamos conversar"
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
            <a href="#inicio" aria-label="IMvester — voltar ao início"><Brand /></a>
            <p>Gestão patrimonial com foco em segurança, eficiência e resultado financeiro.</p>
          </div>

          <div>
            <h3>Ecossistema</h3>
            <ul>
              {['IM Lançamento', 'IM Capital · Crédito', 'IM Decor', 'Halugo · Gestão de locação', 'IM Terceiros', 'IM Lux · Alto padrão'].map((item) => (
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
              <li>São Paulo · Brasil</li>
            </ul>
          </div>
        </div>

        <div className="container footer__bottom">
          <span>© 2026 IMvester · Todos os direitos reservados.</span>
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

