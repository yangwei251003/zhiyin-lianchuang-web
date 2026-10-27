import Link from 'next/link'
import { Container } from '@/components/layout/Container'

export default function PracticeCasesPage() {
  return <main className="pb-20"><Container size="md" className="pt-10"><Link href="/startup" className="text-sm text-primary">← 返回产教实践中心</Link><p className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-[#c84f20]">Reviewed practice records</p><h1 className="mt-3 text-3xl font-bold text-[#14263d]">实践成果档案</h1><div className="mt-8 border-l-4 border-[#c84f20] bg-[#f4f2ec] p-6"><h2 className="font-bold text-[#14263d]">公开档案正在按审核流程准备</h2><p className="mt-3 text-sm leading-7 text-[#5c6672]">只有取得案例主体授权、完成来源与事实审核，并移除无法核验的投入、营收、客户等信息后，档案才会公开。当前不展示示例成功案例或估算经营成绩。</p><Link href="/feedback" className="mt-5 inline-flex bg-[#14263d] px-4 py-3 text-sm font-bold text-white">提交实践成果审核申请</Link></div></Container></main>
}
