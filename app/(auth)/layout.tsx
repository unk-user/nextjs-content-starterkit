export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full h-full flex flex-col justify-center items-center">
      {children}
    </main>
  );
}
