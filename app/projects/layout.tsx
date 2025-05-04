import Navbar from '@/components/Navbar'

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="h-full pt-16">{children}</main>
    </>
  )
}
