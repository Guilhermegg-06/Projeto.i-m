import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { links, profiles } from '../content'
import { PrimaryLink } from './PrimaryAction'

export function InvestmentProfiles() {
  const [activeProfile, setActiveProfile] = useState(1)
  const reduceMotion = useReducedMotion()
  const profile = profiles[activeProfile]

  return (
    <div className="profile-experience">
      <div className="profile-tabs" role="tablist" aria-label="Perfis de investimento">
        {profiles.map((item, index) => (
          <button
            id={`profile-tab-${index}`}
            className={index === activeProfile ? 'is-active' : ''}
            type="button"
            role="tab"
            aria-selected={index === activeProfile}
            aria-controls={`profile-panel-${index}`}
            tabIndex={index === activeProfile ? 0 : -1}
            onClick={() => setActiveProfile(index)}
            key={item.name}
          >
            <span>{item.name}</span>
            <small>{item.intro}</small>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.article
          id={`profile-panel-${activeProfile}`}
          className="profile-stage"
          role="tabpanel"
          aria-labelledby={`profile-tab-${activeProfile}`}
          key={profile.name}
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="profile-stage__summary">
            {profile.featured && <p className="profile-stage__choice">Mais escolhido</p>}
            <h3>{profile.name}</h3>
            <p>{profile.intro}</p>
            <div className="profile-stage__metric">
              <strong>{profile.value}</strong>
              <span>{profile.period}</span>
            </div>
          </div>

          <div className="profile-stage__details">
            <ul>
              {profile.features.map((feature, index) => (
                <li key={feature}>
                  <span className="profile-feature__index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <PrimaryLink href={links.contact} icon={<ArrowRight aria-hidden="true" />}>
              Quero saber mais
            </PrimaryLink>
          </div>
        </motion.article>
      </AnimatePresence>
    </div>
  )
}
