import AuthContext from './AuthContext'

export interface AccountLayoutProps {
  children: React.ReactNode
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  return <AuthContext>{children}</AuthContext>
}
