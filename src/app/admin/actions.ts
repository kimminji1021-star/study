'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { ConsultationStatus } from '@/generated/prisma'

/** 로그인 + admin_users 등재 여부를 함께 확인한다. proxy 는 로그인만 본다. */
export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const admin = await prisma.adminUser.findUnique({ where: { id: user.id } })
  if (!admin) redirect('/admin/login?error=forbidden')

  return admin
}

export async function updateConsultationStatus(formData: FormData) {
  const admin = await requireAdmin()

  const id = String(formData.get('id') ?? '')
  const status = String(formData.get('status') ?? '')
  if (!id || !(status in ConsultationStatus)) return

  const current = await prisma.consultationRequest.findUnique({
    where: { id },
    select: { status: true },
  })
  if (!current || current.status === status) return

  // F-A-14: 상태 변경과 이력 기록은 한 트랜잭션으로 묶는다.
  await prisma.$transaction([
    prisma.consultationRequest.update({
      where: { id },
      data: { status: status as ConsultationStatus },
    }),
    prisma.consultationHistory.create({
      data: {
        consultationId: id,
        prevStatus: current.status,
        nextStatus: status as ConsultationStatus,
        changedBy: admin.name ?? admin.email,
      },
    }),
  ])

  revalidatePath('/admin')
}

export async function updateConsultationMemo(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') ?? '')
  const adminMemo = String(formData.get('adminMemo') ?? '').trim()
  if (!id) return

  await prisma.consultationRequest.update({
    where: { id },
    data: { adminMemo: adminMemo || null },
  })

  revalidatePath('/admin')
}

/** F-A-17: 물리 삭제 대신 논리 삭제. */
export async function deleteConsultation(formData: FormData) {
  await requireAdmin()

  const id = String(formData.get('id') ?? '')
  if (!id) return

  await prisma.consultationRequest.update({ where: { id }, data: { isDeleted: true } })
  revalidatePath('/admin')
  redirect('/admin')
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
