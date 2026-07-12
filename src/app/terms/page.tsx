import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: '用户协议',
  description: '智印联创用户协议与平台服务规则。',
}

const sections = [
  {
    title: '一、适用范围',
    content: '本协议适用于您访问、注册和使用智印联创提供的订单信息、采购信息、纸价信息、创业孵化与相关协同服务。',
  },
  {
    title: '二、账户与企业资料',
    content: '用户应提供真实、准确、完整的注册和企业资料，并妥善保管账户凭证。企业认证结果仅代表平台对提交材料的审核状态，不构成对经营能力、产品质量或履约能力的保证。',
  },
  {
    title: '三、信息发布规则',
    content: '发布订单、产能、采购需求或案例信息时，应确保内容真实、合法且不侵犯他人权益。不得发布虚假交易、违法印刷品、恶意营销、侵权内容或包含他人敏感信息的资料。',
  },
  {
    title: '四、交易与采购说明',
    content: '平台当前提供信息撮合、采购意向收集和沟通辅助服务，不提供在线支付、资金监管或电子合同签署。实际交易、交付、质量验收和争议处理应由交易双方依法独立协商并留存凭证。',
  },
  {
    title: '五、价格与预测信息',
    content: '市场价格仅在标注来源、规格、地区、单位和更新时间后展示，供行业信息参考。纸价趋势与分析不构成投资、采购、库存或经营决策建议；用户应结合实际报价、合同条款和市场情况独立判断。',
  },
  {
    title: '六、知识产权与反馈',
    content: '平台内容、标识、软件和设计受法律保护。用户保留其依法拥有的内容权利，并授权平台在提供服务所必需的范围内处理其提交内容。您可通过意见反馈页面提交问题与建议。',
  },
] as const

export default function TermsPage() {
  return (
    <main className="bg-[#FAFAF8] py-12 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="border-b border-[#E5E7EB] pb-8">
          <FileText className="size-8 text-[#1E3A5F]" strokeWidth={1.7} aria-hidden />
          <h1 className="mt-4 text-3xl font-bold text-[#1F2937]">用户协议</h1>
          <p className="mt-3 text-base leading-7 text-[#4B5563]">版本 1.0，最后更新于 2026 年 7 月 12 日。</p>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {sections.map((section) => (
            <section key={section.title} className="py-7">
              <h2 className="text-lg font-bold text-[#1F2937]">{section.title}</h2>
              <p className="mt-3 text-base leading-7 text-[#4B5563]">{section.content}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 border border-[#E5E7EB] bg-white p-6">
          <p className="text-base font-semibold text-[#1F2937]">对协议内容有疑问？</p>
          <p className="mt-2 text-sm leading-6 text-[#4B5563]">请通过意见反馈页面提交问题。平台将在工作日处理与服务相关的反馈。</p>
          <Link href="/feedback" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1E3A5F] hover:text-[#D97706]">
            提交反馈
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </main>
  )
}
