export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <main className="pt-12">{children}</main>
    </>
  )
}
