import sanitizeHtml from 'sanitize-html'

// Articles are stored as HTML in the current schema. Keep a deliberately small
// allowlist so database content cannot introduce scripts, styles, embeds or forms.
export function sanitizeArticleHtml(content: string): string {
  return sanitizeHtml(content, {
    allowedTags: [
      'p',
      'br',
      'h2',
      'h3',
      'h4',
      'ul',
      'ol',
      'li',
      'blockquote',
      'strong',
      'em',
      'code',
      'pre',
      'a',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    disallowedTagsMode: 'discard',
  })
}
