'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ChevronDown,
  LogOut,
  Menu,
  Printer,
  ShieldCheck,
  User as UserIcon,
  X,
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
  { label: '首页', href: '/' },
  { label: '订单大厅', href: '/orders' },
  { label: '集采商城', href: '/purchase' },
  { label: '创业孵化', href: '/startup' },
  { label: '技术培训', href: '/training' },
  { label: 'AI 预测', href: '/prediction/铜版纸' },
  { label: '消息', href: '/messages' },
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
        className="h-7 w-7 rounded-full bg-cover bg-center ring-1 ring-line"
        style={{ backgroundImage: `url(${profile.avatar_url})` }}
      />
    )
  }
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-medium text-white">
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
      className="flex items-center gap-2 px-3 py-2 text-sm text-ink-secondary transition-colors hover:bg-canvas hover:text-ink-primary"
    >
      {icon}
      {label}
    </Link>
  )
}

// 顶部导航：桌面主菜单 + 用户下拉，移动端汉堡抽屉，滚动毛玻璃背景
export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)
  const signOut = useAuthStore((s) => s.signOut)

  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const unread = useUIStore((s) => s.unreadCount)
  const refreshUnreadCount = useUIStore((s) => s.refreshUnreadCount)
  const setUnreadCount = useUIStore((s) => s.setUnreadCount)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
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

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-base ease-out-expo',
        scrolled
          ? 'border-b border-line bg-white/80 shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="智印联创首页"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary-gradient shadow-blue">
              <Printer className="h-5 w-5 text-white" />
            </span>
            <span className="text-lg font-bold text-ink-primary">智印联创</span>
          </Link>

          {/* 桌面主菜单 */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-ink-secondary hover:text-ink-primary',
                )}
              >
                {item.label}
                {item.href === '/messages' && unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 inline-flex h-2 w-2 rounded-full bg-danger" />
                )}
              </Link>
            ))}
          </nav>

          {/* 右侧操作区（桌面） */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full p-1 pr-2 transition-colors hover:bg-canvas"
                  aria-label="用户菜单"
                  aria-expanded={menuOpen}
                >
                  <Avatar profile={profile} />
                  <ChevronDown className="h-4 w-4 text-ink-tertiary" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-line bg-white shadow-lg">
                    <div className="border-b border-line px-3 py-2">
                      <p className="truncate text-sm font-medium text-ink-primary">
                        {profile?.nickname ?? '用户'}
                      </p>
                      <p className="truncate text-xs text-ink-tertiary">
                        {profile?.email}
                      </p>
                    </div>
                    <MenuLink
                      href="/mine"
                      icon={<UserIcon className="h-4 w-4" />}
                      label="我的"
                    />
                    <MenuLink
                      href="/mine/auth"
                      icon={<ShieldCheck className="h-4 w-4" />}
                      label="企业认证"
                    />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-ink-secondary transition-colors hover:bg-canvas hover:text-danger"
                    >
                      <LogOut className="h-4 w-4" />
                      退出登录
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/login')}
                >
                  登录
                </Button>
                <Button size="sm" onClick={() => router.push('/register')}>
                  注册
                </Button>
              </>
            )}
          </div>

          {/* 移动端汉堡按钮 */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink-primary hover:bg-canvas md:hidden"
            onClick={() => setDrawerOpen((v) => !v)}
            aria-label="打开菜单"
            aria-expanded={drawerOpen}
          >
            {drawerOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </Container>

      {/* 移动端抽屉菜单 */}
      {drawerOpen && (
        <div className="border-t border-line bg-white md:hidden">
          <Container>
            <nav className="flex flex-col py-2" aria-label="移动端导航">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium',
                    isActive(item.href)
                      ? 'bg-primary-bg text-primary'
                      : 'text-ink-primary hover:bg-canvas',
                  )}
                >
                  <span>{item.label}</span>
                  {item.href === '/messages' && unread > 0 && (
                    <span className="inline-flex h-2 w-2 rounded-full bg-danger" />
                  )}
                </Link>
              ))}
              <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3">
                {user ? (
                  <>
                    <Link
                      href="/mine"
                      className="rounded-md px-3 py-2 text-sm text-ink-primary hover:bg-canvas"
                    >
                      我的
                    </Link>
                    <Link
                      href="/mine/auth"
                      className="rounded-md px-3 py-2 text-sm text-ink-primary hover:bg-canvas"
                    >
                      企业认证
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-danger-bg"
                    >
                      退出登录
                    </button>
                  </>
                ) : (
                  <>
                    <Button onClick={() => router.push('/login')}>登录</Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/register')}
                    >
                      注册
                    </Button>
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
