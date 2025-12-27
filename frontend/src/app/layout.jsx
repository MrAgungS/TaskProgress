import { Toaster } from "react-hot-toast";
import "./globals.css";
import NavBar from "@/components/NavBar";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body data-theme="emerald" className="min-h-screen bg-base-200 text-base-content">
        <div className="flex min-h-screen flex-col">
        <Toaster />
        <NavBar />
        <main className="flex-1 px-4 py-6 md:px-8 lg:px-12">
          {children}
        </main>
        </div>
      </body>
    </html>
  );
}
