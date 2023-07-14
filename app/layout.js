import './globals.css'

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'LAS POINT CLOUDS',
  description: 'Este proyecto proporciona una forma sencilla de visualizar archivos .las (LiDAR) en formato de nube de puntos 3D en el navegador web',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
