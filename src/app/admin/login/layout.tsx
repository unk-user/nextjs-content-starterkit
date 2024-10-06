export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex min-h-screen flex-col">{children}</main>;
}
