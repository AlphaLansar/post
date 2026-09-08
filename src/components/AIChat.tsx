import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Sparkles, User } from 'lucide-react'
import type { ChatBlock, ChatMessage } from '../types'
import { askCopilot, SUGGESTED_QUESTIONS, userMessage } from '../services/ai/copilot'
import { compact } from '../lib/format'
import { Bar } from './ui'

function Blocks({ blocks }: { blocks?: ChatBlock[] }) {
  if (!blocks?.length) return null
  return (
    <div className="mt-3 space-y-3">
      {blocks.map((b, i) => {
        if (b.type === 'kpis' && b.kpis)
          return (
            <div key={i} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {b.kpis.map((k, j) => (
                <div key={j} className="border border-line rounded-lg p-2.5 bg-surface">
                  <div className="stat-label !text-[10px]">{k.label}</div>
                  <div className="text-[15px] font-semibold text-navy mt-1 tabular-nums">{k.value}</div>
                  {k.delta && (
                    <div className={`text-[11px] font-semibold ${k.tone === 'pos' ? 'text-pos' : k.tone === 'neg' ? 'text-neg' : 'text-ink-faint'}`}>{k.delta}</div>
                  )}
                </div>
              ))}
            </div>
          )
        if (b.type === 'bars' && b.bars) {
          const max = Math.max(...b.bars.map((x) => Math.abs(x.value)))
          return (
            <div key={i} className="space-y-2 border border-line rounded-lg p-3 bg-surface">
              {b.bars.map((x, j) => (
                <div key={j}>
                  <div className="flex justify-between text-[11.5px] mb-1">
                    <span className="text-ink font-medium">{x.label}</span>
                    <span className="text-ink-muted tabular-nums">{compact(x.value)}{x.hint ? ` · ${x.hint}` : ''}</span>
                  </div>
                  <Bar value={Math.abs(x.value)} max={max} tone="navy" />
                </div>
              ))}
            </div>
          )
        }
        if (b.type === 'list' && b.items)
          return (
            <ul key={i} className="border border-line rounded-lg p-3 bg-surface space-y-1.5">
              {b.items.map((it, j) => (
                <li key={j} className="text-[12.5px] text-ink-muted flex gap-2 leading-relaxed">
                  <span className="text-gold-dark mt-0.5">▸</span>
                  {it}
                </li>
              ))}
            </ul>
          )
        if (b.type === 'note')
          return (
            <p key={i} className="text-[11px] text-ink-faint bg-navy-50 border border-line rounded-md px-2.5 py-2 leading-relaxed">
              {b.text}
            </p>
          )
        if (b.type === 'text') return <p key={i} className="text-[12.5px] text-ink-muted">{b.text}</p>
        return null
      })}
    </div>
  )
}

function Bubble({ m }: { m: ChatMessage }) {
  const isUser = m.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} fade-up`}>
      <span
        className={`shrink-0 w-8 h-8 rounded-lg grid place-items-center ${
          isUser ? 'bg-navy text-white' : 'bg-gold/15 text-gold-dark'
        }`}
      >
        {isUser ? <User size={15} /> : <Sparkles size={15} />}
      </span>
      <div className={`max-w-[86%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block text-left rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-line ${
            isUser ? 'bg-navy text-white' : 'bg-surface border border-line text-ink'
          }`}
        >
          {m.content}
          {!isUser && <Blocks blocks={m.blocks} />}
        </div>
      </div>
    </div>
  )
}

export function AIChat({ compactMode = false }: { compactMode?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'seed',
      role: 'assistant',
      content:
        "Bonjour. Je suis le copilote POSTE AI. Interrogez les données opérationnelles, financières et territoriales pour obtenir des analyses décisionnelles. Prototype — réponses simulées à partir de données de démonstration.",
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  function send(text: string) {
    const q = text.trim()
    if (!q || thinking) return
    setMessages((m) => [...m, userMessage(q)])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      setMessages((m) => [...m, askCopilot(q)])
      setThinking(false)
    }, 620)
  }

  return (
    <div className="card flex flex-col overflow-hidden" style={{ height: compactMode ? 460 : 'calc(100vh - 210px)' }}>
      <div className="card-h">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg grid place-items-center bg-navy text-gold">
            <Sparkles size={15} />
          </span>
          <div>
            <div className="text-[13px] font-semibold text-navy">POSTE AI Copilot</div>
            <div className="text-[11px] text-ink-muted">Assistant d'analyse décisionnelle</div>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-pos pulse-dot" title="Moteur analytique actif" />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-canvas/40">
        {messages.map((m) => (
          <Bubble key={m.id} m={m} />
        ))}
        {thinking && (
          <div className="flex gap-3 fade-up">
            <span className="shrink-0 w-8 h-8 rounded-lg grid place-items-center bg-gold/15 text-gold-dark">
              <Sparkles size={15} />
            </span>
            <div className="bg-surface border border-line rounded-xl px-3.5 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-ink-faint pulse-dot" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-line p-3 bg-surface">
        <div className="flex gap-1.5 flex-wrap mb-2">
          {SUGGESTED_QUESTIONS.slice(0, compactMode ? 3 : 6).map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-[11.5px] text-ink-muted bg-navy-50 hover:bg-navy-50/70 border border-line rounded-full px-2.5 py-1 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send(input)
              }
            }}
            rows={1}
            placeholder="Posez une question sur la performance, les risques, les prévisions…"
            className="flex-1 resize-none text-[13px] border border-line rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy/20 max-h-28"
          />
          <button type="submit" className="btn-primary !px-3 !py-2.5 shrink-0" disabled={thinking}>
            <ArrowUp size={15} />
          </button>
        </form>
      </div>
    </div>
  )
}
