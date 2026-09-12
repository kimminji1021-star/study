import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, PreferredTime, DeviceType } from '../src/generated/prisma'

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
})

/** 시안 화면의 더미 리드와 같은 구성. 상태·이력·UTM 까지 재현한다. */
const SAMPLES = [
  {
    name: '정민서',
    phone: '01033827741',
    course: 'AI 업무 활용 실무 (12기)',
    preferredTime: PreferredTime.EVENING,
    message: '마케팅 콘텐츠 제작에 쓰고 싶습니다. 국비 지원 되나요?',
    agreeMarketing: true,
    deviceType: DeviceType.MOBILE,
    utmSource: 'instagram',
    utmMedium: 'paid_social',
    utmCampaign: 'ai_work_12th_carousel',
    referrer: 'l.instagram.com',
    status: 'NEW' as const,
    transitions: [] as { to: 'IN_PROGRESS' | 'NO_ANSWER' | 'DONE' | 'CONVERTED' | 'HOLD'; by: string }[],
    adminMemo: null as string | null,
  },
  {
    name: '박현우',
    phone: '01099201184',
    course: 'PM·서비스 기획 실무',
    preferredTime: PreferredTime.AFTERNOON,
    message: null,
    agreeMarketing: false,
    deviceType: DeviceType.MOBILE,
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'brand_keyword',
    referrer: 'google.com',
    status: 'NEW' as const,
    transitions: [],
    adminMemo: null,
  },
  {
    name: '김다인',
    phone: '01022775530',
    course: 'AI 업무 활용 실무 (12기)',
    preferredTime: PreferredTime.MORNING,
    message: '회사에서 AI 도입 검토 중인데 실무 적용 사례가 궁금합니다.',
    agreeMarketing: true,
    deviceType: DeviceType.PC,
    utmSource: 'youtube',
    utmMedium: 'paid_video',
    utmCampaign: 'ai_work_12th_15s',
    referrer: 'youtube.com',
    status: 'IN_PROGRESS' as const,
    transitions: [{ to: 'IN_PROGRESS' as const, by: '이수진' }],
    adminMemo: '1차 통화 완료. 지원금 자격 확인 필요, 목요일 재통화 약속.',
  },
  {
    name: '이가온',
    phone: '01044519086',
    course: '데이터 분석 실무',
    preferredTime: PreferredTime.ANY,
    message: null,
    agreeMarketing: false,
    deviceType: DeviceType.MOBILE,
    utmSource: 'naver',
    utmMedium: 'cpc',
    utmCampaign: 'data_course_search',
    referrer: 'search.naver.com',
    status: 'NO_ANSWER' as const,
    transitions: [{ to: 'NO_ANSWER' as const, by: '이수진' }],
    adminMemo: '2회 부재. 문자 남김.',
  },
  {
    name: '최유리',
    phone: '01077123369',
    course: 'AI 업무 활용 실무 (12기)',
    preferredTime: PreferredTime.AFTERNOON,
    message: '이직 준비 중입니다.',
    agreeMarketing: true,
    deviceType: DeviceType.MOBILE,
    utmSource: 'instagram',
    utmMedium: 'paid_social',
    utmCampaign: 'ai_work_12th_reels',
    referrer: 'l.instagram.com',
    status: 'CONVERTED' as const,
    transitions: [
      { to: 'DONE' as const, by: '이수진' },
      { to: 'CONVERTED' as const, by: '이수진' },
    ],
    adminMemo: '12기 등록 완료. 카드 3개월.',
  },
  {
    name: '한지훈',
    phone: '01066342201',
    course: '생성형 AI 개발 심화',
    preferredTime: PreferredTime.EVENING,
    message: '개발 경력 3년입니다.',
    agreeMarketing: false,
    deviceType: DeviceType.PC,
    utmSource: 'community',
    utmMedium: 'referral',
    utmCampaign: null,
    referrer: 'okky.kr',
    status: 'DONE' as const,
    transitions: [{ to: 'DONE' as const, by: '이수진' }],
    adminMemo: '커리큘럼 난이도 안내. 다음 기수 고려.',
  },
  {
    name: '오세린',
    phone: '01011884426',
    course: 'AI 업무 활용 실무 (12기)',
    preferredTime: PreferredTime.MORNING,
    message: null,
    agreeMarketing: true,
    deviceType: DeviceType.MOBILE,
    utmSource: 'google',
    utmMedium: 'cpc',
    utmCampaign: 'ai_work_12th_search',
    referrer: 'google.com',
    status: 'HOLD' as const,
    transitions: [{ to: 'HOLD' as const, by: '이수진' }],
    adminMemo: '출산 휴가 후 재연락 희망 (11월).',
  },
]

async function main() {
  const existing = await prisma.consultationRequest.count()
  if (existing > 0) {
    console.log(`상담 신청 ${existing}건이 이미 있어 시드를 건너뜁니다.`)
    return
  }

  // 목록이 최신순으로 보이도록 하루씩 과거로 밀어 넣는다.
  let offsetHours = SAMPLES.length * 6

  for (const { transitions, ...sample } of SAMPLES) {
    const createdAt = new Date(Date.now() - offsetHours * 3_600_000)
    offsetHours -= 6

    let prev: (typeof transitions)[number]['to'] | 'NEW' = 'NEW'
    const histories = [
      { nextStatus: 'NEW' as const, changedBy: '시스템', changedAt: createdAt },
      ...transitions.map((t, i) => {
        const entry = {
          prevStatus: prev,
          nextStatus: t.to,
          changedBy: t.by,
          changedAt: new Date(createdAt.getTime() + (i + 1) * 3_600_000),
        }
        prev = t.to
        return entry
      }),
    ]

    await prisma.consultationRequest.create({
      data: { ...sample, createdAt, histories: { create: histories } },
    })
  }

  console.log(`샘플 상담 신청 ${SAMPLES.length}건을 생성했습니다.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
