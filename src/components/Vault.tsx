import { useState } from 'react'
import '../styles/vault.css'
import { HashPanel } from './HashPanel'
import { HmacPanel } from './HmacPanel'
import { CodecPanel } from './CodecPanel'
import { RandomPanel } from './RandomPanel'

type Tab = 'hash' | 'hmac' | 'codec' | 'random'
const TABS: { id: Tab; label: string }[] = [
  { id: 'hash', label: 'HASH' },
  { id: 'hmac', label: 'HMAC' },
  { id: 'codec', label: 'BASE64/HEX' },
  { id: 'random', label: 'RANDOM' },
]

export default function Vault() {
  const [tab, setTab] = useState<Tab>('hash')
  return (
    <>
      <div className="tumbler" role="tablist" aria-label="tools">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            id={`tab-${t.id}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        {tab === 'hash' && <HashPanel />}
        {tab === 'hmac' && <HmacPanel />}
        {tab === 'codec' && <CodecPanel />}
        {tab === 'random' && <RandomPanel />}
      </div>
    </>
  )
}
