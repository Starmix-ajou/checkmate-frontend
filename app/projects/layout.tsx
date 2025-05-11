import Navbar from '@/components/Navbar'

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="pt-12">{children}</main>
    </>
  )
}
