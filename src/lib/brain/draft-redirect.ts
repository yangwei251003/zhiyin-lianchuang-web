import type { PersistedBrainContextKind } from './workspace'

export function getDraftConfirmationTarget(
  contextKind: PersistedBrainContextKind,
  draftId: string,
): string {
  const query = new URLSearchParams({ brainDraft: draftId }).toString()
  switch (contextKind) {
    case 'order':
      return `/orders/publish?${query}`
    case 'purchase':
      return `/purchase?${query}`
    case 'price':
      return `/prediction/${encodeURIComponent('白卡纸')}?${query}`
    case 'education':
      return `/startup?${query}`
  }
}
