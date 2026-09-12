'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SITE } from '@/lib/site-content'

/** F-A-03: 연속 실패를 잠시 막는다. 서버 측 제한은 Supabase Auth 가 별도로 건다. */
const MAX_TRIES = 5

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [tries, setTries] = useState(0)
  const [error, setError] = useState(
    searchParams.get('error') === 'forbidden'
      ? '관리자 권한이 없는 계정입니다. 운영자에게 문의하세요.'
      : '',
  )
  const [pending, setPending] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (tries >= MAX_TRIES) {
      setError('로그인 시도가 5회 초과되었습니다. 잠시 후 다시 시도해 주세요.')
      return
    }

    setPending(true)
    setError('')

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setTries((n) => n + 1)
      setError('아이디 또는 비밀번호가 올바르지 않습니다.')
      setPending(false)
      return
    }

    router.replace(searchParams.get('next') || '/admin')
    router.refresh()
  }

  return (
    <div className="w-full max-w-[380px]">
      <div className="mb-7">
        <p className="text-lg font-extrabold tracking-[-0.02em]">{SITE.name} 상담 관리</p>
        <p className="mt-[7px] text-[13.5px] text-fg-ghost">인가된 담당자만 접근할 수 있습니다.</p>
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 border border-line-700 bg-ink-750 px-7 py-[30px]"
      >
        <div>
          <label htmlFor="a-id" className="mb-2 block text-[13px] font-semibold text-fg-muted">
            이메일
          </label>
          <input
            id="a-id"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-line-600 bg-ink-850 px-[15px] py-3.5 text-[15px] text-fg outline-none focus:border-brand"
          />
        </div>

        <div>
          <label htmlFor="a-pw" className="mb-2 block text-[13px] font-semibold text-fg-muted">
            비밀번호
          </label>
          <input
            id="a-pw"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-line-600 bg-ink-850 px-[15px] py-3.5 text-[15px] text-fg outline-none focus:border-brand"
          />
        </div>

        {error && <p className="text-[13px] text-danger-fg">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-brand py-3.5 text-[15px] font-bold text-white transition hover:bg-brand-hover disabled:opacity-60"
        >
          {pending ? '로그인 중…' : '로그인'}
        </button>
      </form>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-850 px-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
