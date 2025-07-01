import "./globals.css";
import AuthProvider from "../providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}