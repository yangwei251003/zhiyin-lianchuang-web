import { type NextRequest, NextResponse } from 'next/server'
import { zhipuChatCompletion, type ZhipuMessage } from '@/lib/ai/zhipu'
import { getArticleSummaryFallback } from '@/lib/ai/fallback'

export const dynamic = 'force-static'
export const runtime = 'nodejs'

// 文章摘要 API
// 适配前端 AIArticleSummary 组件实际发送的字段（article_id, title, content）
// 返回 { summary, fallback }

interface ArticleSummaryRequestBody {
  article_id?: string
  title?: string
  content?: string
  // 兼容驼峰
  articleId?: string
}

export async function POST(request: NextRequest) {
  let body: ArticleSummaryRequestBody = {}
  try {
    body = (await request.json()) as ArticleSummaryRequestBody
  } catch {
    body = {}
  }

  const title = body.title || '本文'
  const content = body.content || ''
  const articleId = body.article_id ?? body.articleId ?? ''

  try {
    if (!content.trim()) {
      throw new Error('Empty content')
    }

    const messages: ZhipuMessage[] = [
      {
        role: 'system',
        content:
          '你是印刷行业内容编辑助手。请根据文章标题与正文，生成一段不超过 200 字的中文摘要，提炼核心观点与实操建议，语言简洁专业，不要使用"本文""文章"等开头。只返回摘要正文，不要附加说明。',
      },
      {
        role: 'user',
        content: `文章标题：${title}\n\n文章正文：\n${content.slice(0, 4000)}\n\n请生成 200 字以内的摘要。`,
      },
    ]

    const result = await zhipuChatCompletion({
      messages,
      temperature: 0.4,
      maxTokens: 400,
    })

    const summary = result.content?.trim()
    if (!summary) {
      throw new Error('Empty AI response')
    }

    return NextResponse.json({
      success: true,
      summary,
      fallback: false,
      article_id: articleId,
    })
  } catch {
    // 兜底：结构化摘要
    const fallback = getArticleSummaryFallback(title, content)
    return NextResponse.json({
      success: true,
      summary: fallback,
      fallback: true,
      article_id: articleId,
    })
  }
}
