/**
 * 관리자 계정을 만든다. Supabase Auth 사용자와 admin_users 행을 함께 생성한다.
 * 사용: pnpm admin:create <email> <password> [name]
 */
import { createClient } from '@supabase/supabase-js'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma'

const [email, password, name] = process.argv.slice(2)

if (!email || !password) {
  console.error('사용법: pnpm admin:create <email> <password> [name]')
  process.exit(1)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  console.error('NEXT_PUBLIC_SUPABASE_URL 과 SUPABASE_SERVICE_ROLE_KEY 가 .env.local 에 있어야 합니다.')
  process.exit(1)
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

async function main() {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  let userId = data?.user?.id

  // 이미 있는 계정이면 목록에서 찾아 admin_users 등재만 보정한다.
  if (error) {
    if (!/already/i.test(error.message)) throw error
    const { data: list, error: listError } = await supabase.auth.admin.listUsers()
    if (listError) throw listError
    userId = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id
    if (!userId) throw new Error(`Auth 사용자를 찾지 못했습니다: ${email}`)
    console.log('이미 존재하는 Auth 계정입니다. admin_users 등재만 진행합니다.')
  }

  await prisma.adminUser.upsert({
    where: { id: userId! },
    update: { email, name: name ?? null },
    create: { id: userId!, email, name: name ?? null },
  })

  console.log(`관리자 등록 완료: ${email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
