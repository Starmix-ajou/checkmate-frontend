export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen grid grid-rows-[48px_1fr]">
      <div />
      {children}
    </main>
  )
}
