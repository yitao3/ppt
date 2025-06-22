import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
  ]

  return (
    <header className="header">
      <nav className="nav">
        <Link href="/" className="logo">
          <Image 
            src="/logo-brand.png" 
            alt="Templates Logo" 
            width={120} 
            height={32} 
            priority
          />
        </Link>
        <ul className="nav-links">
          {/* Navigation links removed */}
        </ul>
      </nav>
    </header>
  )
} 