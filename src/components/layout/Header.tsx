'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  ChevronDown,
  LogOut,
  Menu,
  ShieldCheck,
  User as UserIcon,
  X,
  ArrowRight,
  Bell,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useUIStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'
import { Container } from './Container'
import { Button } from '@/components/ui/Button'

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: '首页',     href: '/' },
  { label: '订单大厅', href: '/orders' },
  { label: '集采商城', href: '/purchase' },
  { label: '创业孵化', href: '/startup' },
  { label: '技术培训', href: '/training' },
  { label: '纸价信息', href: '/prediction/铜版纸' },
  { label: '消息',     href: '/messages' },
]

interface AvatarProps {
  profile: { avatar_url: string | null; nickname: string } | null
}

function Avatar({ profile }: AvatarProps) {
  const initial = profile?.nickname?.[0] ?? 'U'
  if (profile?.avatar_url) {
    return (
      <span
        role="img"
        aria-label="用户头像"
        className="h-8 w-8 rounded-full bg-cover bg-center ring-2 ring-primary/30"
        style={{ backgroundImage: `url(${profile.avatar_url})` }}
      />
    )
  }
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
      {initial}
    </span>
  )
}

function MenuLink({
  href,
  icon,
  label,
  onNavigate,
}: {
  href: string
  icon: ReactNode
  label: string
  onNavigate?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-secondary transition-all duration-fast hover:bg-primary/5 hover:text-primary"
    >
      <span className="text-ink-tertiary">{icon}</span>
      {label}
    </Link>
  )
}

// 顶部导航：企业级玻璃拟态 Header，滚动毛玻璃，品牌Logo，CTA按钮
export function Header() {
  const pathname = usePathname()
  const router   = useRouter()
  const user     = useAuthStore((s) => s.user)
  const profile  = useAuthStore((s) => s.profile)
  const signOut  = useAuthStore((s) => s.signOut)

  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const unread              = useUIStore((s) => s.unreadCount)
  const refreshUnreadCount  = useUIStore((s) => s.refreshUnreadCount)
  const setUnreadCount      = useUIStore((s) => s.setUnreadCount)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  useEffect(() => {
    if (!user) {
      setUnreadCount(0)
      return
    }
    void refreshUnreadCount(user.id)
  }, [user, refreshUnreadCount, setUnreadCount])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const headerBg = 'bg-white border-[#D9DEE6]'

  const navTextColor = (href: string) => {
    return isActive(href)
      ? 'text-primary font-semibold'
      : 'text-ink-secondary hover:text-ink-primary'
  }

  const menuBtnColor  = 'text-ink-primary hover:bg-canvas'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b bg-white/95 transition-colors duration-fast supports-[backdrop-filter]:backdrop-blur-sm',
        headerBg,
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">

          {/* ===== Logo ===== */}
          <Link
            href="/"
            className="group flex flex-shrink-0 items-center transition-transform duration-base hover:opacity-80"
            aria-label="智印联创首页"
          >
            {/* 您的网站 Logo */}
            <Image
              src="/images/企业logo.png"
              alt="智印联创"
              width={240}
              height={48}
              className="h-9 w-auto sm:h-11 object-contain"
              priority
            />
          </Link>

          {/* ===== 桌面主菜单 ===== */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex" aria-label="主导航">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-3 py-2.5 text-sm transition-colors duration-fast',
                  navTextColor(item.href),
                )}
              >
                {item.label}
                {/* Active 底部指示线 */}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#D97706]" />
                )}
                {/* 消息红点 */}
                {item.href === '/messages' && unread > 0 && (
                  <span className="absolute right-1 top-1.5 inline-flex h-2 w-2 rounded-full bg-danger" />
                )}
              </Link>
            ))}
          </nav>

          {/* ===== 右侧操作区（桌面） ===== */}
          <div className="hidden items-center gap-2 lg:flex">
            {user ? (
              <>
                {/* 消息铃铛 */}
                <Link
                  href="/messages"
                  className="relative flex h-9 w-9 items-center justify-center rounded-sm transition-colors text-ink-secondary hover:bg-primary/5 hover:text-primary"
                  aria-label="消息"
                >
                  <Bell className="h-5 w-5" />
                  {unread > 0 && (
                    <span className="absolute right-0.5 top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-0.5 text-2xs font-bold text-white">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>

                {/* 用户头像下拉 */}
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex items-center gap-2 rounded-sm py-1 pl-1 pr-2.5 transition-colors duration-fast hover:bg-primary/5"
                    aria-label="用户菜单"
                    aria-expanded={menuOpen}
                  >
                    <Avatar profile={profile} />
                    <ChevronDown className={cn(
                      'h-4 w-4 transition-transform duration-fast text-ink-tertiary',
                      menuOpen && 'rotate-180',
                    )} />
                  </button>

                  {/* 下拉菜单 */}
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-sm border border-line bg-white">
                      {/* 用户信息头 */}
                      <div className="border-b border-line bg-primary-bg px-4 py-3">
                        <p className="truncate text-sm font-semibold text-ink-primary">
                          {profile?.nickname ?? '用户'}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-ink-tertiary">
                          {profile?.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <MenuLink
                          href="/mine"
                          icon={<UserIcon className="h-4 w-4" />}
                          label="我的中心"
                          onNavigate={() => setMenuOpen(false)}
                        />
                        <MenuLink
                          href="/mine/auth"
                          icon={<ShieldCheck className="h-4 w-4" />}
                          label="企业认证"
                          onNavigate={() => setMenuOpen(false)}
                        />
                      </div>
                      <div className="border-t border-line/60 py-1">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-ink-secondary transition-colors hover:bg-danger/5 hover:text-danger"
                        >
                          <LogOut className="h-4 w-4" />
                          退出登录
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="rounded-sm px-4 py-2 text-sm font-medium transition-colors duration-fast text-ink-secondary hover:bg-primary/5 hover:text-primary"
                >
                  登录
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="group inline-flex h-10 items-center gap-1.5 rounded-sm bg-[#D97706] px-4 text-sm font-semibold text-white transition-colors duration-fast hover:bg-[#B45309]"
                >
                  免费入驻
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-fast group-hover:translate-x-0.5" />
                </button>
              </>
            )}
          </div>

          {/* ===== 移动端汉堡按钮 ===== */}
          <button
            type="button"
            className={cn(
              'inline-flex h-11 w-11 items-center justify-center rounded-sm transition-colors duration-fast lg:hidden',
              menuBtnColor,
            )}
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label="打开菜单"
            aria-expanded={drawerOpen}
          >
            {drawerOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </Container>

      {/* ===== 移动端抽屉菜单 ===== */}
      {drawerOpen && (
        <div className="border-t border-line bg-white lg:hidden">
          <Container>
            <nav className="flex flex-col gap-0.5 py-3" aria-label="移动端导航">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={cn(
                    'flex min-h-11 items-center justify-between rounded-sm px-4 py-3 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary/8 text-primary'
                      : 'text-ink-primary hover:bg-canvas',
                  )}
                >
                  <span>{item.label}</span>
                  {item.href === '/messages' && unread > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-2xs font-bold text-white">
                      {unread}
                    </span>
                  )}
                </Link>
              ))}

              <div className="mt-2 flex flex-col gap-2 border-t border-line/50 pt-3">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-sm bg-canvas px-4 py-3">
                      <Avatar profile={profile} />
                      <div>
                        <p className="text-sm font-semibold text-ink-primary">{profile?.nickname ?? '用户'}</p>
                        <p className="text-xs text-ink-tertiary">{profile?.email}</p>
                      </div>
                    </div>
                    <Link href="/mine" onClick={() => setDrawerOpen(false)} className="rounded-sm px-4 py-2.5 text-sm text-ink-primary hover:bg-canvas">我的中心</Link>
                    <Link href="/mine/auth" onClick={() => setDrawerOpen(false)} className="rounded-sm px-4 py-2.5 text-sm text-ink-primary hover:bg-canvas">企业认证</Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="rounded-sm px-4 py-2.5 text-left text-sm text-danger hover:bg-danger/5"
                    >
                      退出登录
                    </button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => router.push('/login')} variant="outline" className="justify-center">登录</Button>
                    <Button onClick={() => router.push('/register')} className="justify-center">免费入驻</Button>
                  </>
                )}
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
