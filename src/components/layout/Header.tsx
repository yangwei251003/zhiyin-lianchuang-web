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
  { label: 'AI 预测',  href: '/prediction/铜版纸' },
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
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-sm font-semibold text-white shadow-blue-sm">
      {initial}
    </span>
  )
}

function MenuLink({
  href,
  icon,
  label,
}: {
  href: string
  icon: ReactNode
  label: string
}) {
  return (
    <Link
      href={href}
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

  const [scrolled,    setScrolled]    = useState(false)
  const [drawerOpen,  setDrawerOpen]  = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const unread              = useUIStore((s) => s.unreadCount)
  const refreshUnreadCount  = useUIStore((s) => s.refreshUnreadCount)
  const setUnreadCount      = useUIStore((s) => s.setUnreadCount)
  const menuRef = useRef<HTMLDivElement>(null)

  // 首页时 header 透明（需要区分是否是首页）
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
    setMenuOpen(false)
  }, [pathname])

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

  // 首页未滚动：完全透明（文字根据浅色背景改为深色）
  // 首页已滚动 / 其他页面：毛玻璃白色
  const headerBg = isHome && !scrolled
    ? 'bg-transparent border-transparent'
    : 'bg-white/88 border-white/30 shadow-sm backdrop-blur-xl'

  const navTextColor = (href: string) => {
    return isActive(href)
      ? 'text-primary font-semibold'
      : 'text-ink-secondary hover:text-ink-primary'
  }

  const logoTextColor = 'text-ink-primary'
  const menuBtnColor  = 'text-ink-primary hover:bg-canvas'

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-slow ease-out-expo',
        headerBg,
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[68px]">

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
          <nav className="hidden flex-1 items-center justify-center gap-0.5 lg:flex" aria-label="主导航">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-md px-3 py-2 text-sm transition-all duration-fast',
                  navTextColor(item.href),
                )}
              >
                {item.label}
                {/* Active 底部指示线 */}
                {isActive(item.href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
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
                  className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors text-ink-secondary hover:bg-canvas hover:text-ink-primary"
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
                    className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-all duration-fast hover:bg-canvas"
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
                    <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-line/80 bg-white shadow-xl">
                      {/* 用户信息头 */}
                      <div className="border-b border-line/60 bg-gradient-to-br from-primary-bg to-white px-4 py-3">
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
                        />
                        <MenuLink
                          href="/mine/auth"
                          icon={<ShieldCheck className="h-4 w-4" />}
                          label="企业认证"
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
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-fast text-ink-secondary hover:bg-canvas hover:text-ink-primary"
                >
                  登录
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="group inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-blue transition-all duration-fast hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-blue-lg"
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
              'inline-flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-fast lg:hidden',
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

      {/* ===== CMYK 装饰色条（首页透明时隐藏）===== */}
      {scrolled || !isHome ? (
        <div className="h-[2px] w-full cmyk-bar opacity-70" aria-hidden />
      ) : null}

      {/* ===== 移动端抽屉菜单 ===== */}
      {drawerOpen && (
        <div className="border-t border-line/50 bg-white/95 backdrop-blur-xl shadow-lg lg:hidden">
          <Container>
            <nav className="flex flex-col gap-0.5 py-3" aria-label="移动端导航">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all',
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
                    <div className="flex items-center gap-3 rounded-xl bg-canvas px-4 py-3">
                      <Avatar profile={profile} />
                      <div>
                        <p className="text-sm font-semibold text-ink-primary">{profile?.nickname ?? '用户'}</p>
                        <p className="text-xs text-ink-tertiary">{profile?.email}</p>
                      </div>
                    </div>
                    <Link href="/mine"          className="rounded-xl px-4 py-2.5 text-sm text-ink-primary hover:bg-canvas">我的中心</Link>
                    <Link href="/mine/auth"     className="rounded-xl px-4 py-2.5 text-sm text-ink-primary hover:bg-canvas">企业认证</Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="rounded-xl px-4 py-2.5 text-left text-sm text-danger hover:bg-danger/5"
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
