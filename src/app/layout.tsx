// src/app/layout.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/app/store/store';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
