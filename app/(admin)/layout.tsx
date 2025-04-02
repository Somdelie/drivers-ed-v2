import Header from "@/components/dash/Header";
import Sidebar from "@/components/dash/Sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1">
        {" "}
        <Header />
        <div className="p-4 overflow-auto"> {children}</div>
      </main>
    </div>
  );
}
