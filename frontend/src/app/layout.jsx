import { Toaster } from "react-hot-toast";
import "./globals.css";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body data-theme="emerald">
        <Toaster />
        {children}
      </body>
    </html>
  );
}
