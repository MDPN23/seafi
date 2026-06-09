<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

> **Warning**: Next.js 16 introduces significant changes. Agents must **always** follow these rules instead of relying on potentially outdated training data.

## 1. App Router is Default

- **No `pages/` directory**: Do not assume the `pages/` directory exists. The App Router (`app/`) is the default and recommended way to build apps since Next.js 13.
- **Segment-based routing**: Routing is now based on file segments inside `app/` (e.g., `app/dashboard/page.tsx`).
- **Server components by default**: All components in `app/` are Server Components by default.

## 2. Component Type System

- **`"use client"` directive**: Must be added to the top of any file that needs interactivity, state, or browser APIs (e.g., `import { useState } from 'react'`).
- **Server Components** (default): Do not use `"use client"` unless necessary. They are great for data fetching and rendering static content.
- **File naming**: `page.tsx` denotes a route segment, while `layout.tsx` denotes a layout.

## 3. Data Fetching Changes

- **Native `fetch()`**: Use the built-in `fetch()` API with Next.js 16-specific options:
  ```typescript
  // Server Component
  export default async function Page() {
    const res = await fetch('https://api.example.com/data', {
      cache: 'force-cache' // or 'no-store' or 'reload'
    })
    const data = await res.json()
    return <div>...</div>
  }
  ```
- **`revalidate` option**: Use `cache: 'force-cache'` with the `revalidate` option for time-based caching:
  ```typescript
  await fetch('https://api.example.com/data', {
    cache: 'force-cache',
    next: { revalidate: 60 } // cache for 60 seconds
  })
  ```
- **Avoid deprecated methods**: Do not use `getServerSideProps`, `getStaticProps`, or `getInitialProps`. These are removed in Next.js 16.

## 4. Configuration (`next.config.js`)

- **ESM format**: Configuration files should now be in ES Module format (use `import` instead of `require`):
  ```javascript
  // next.config.js
  import { defineConfig } from 'next/config'

  export default defineConfig({
    // configuration options
  })
  ```
- **`withMDX` plugin**: If using MDX, use the new plugin system:
  ```javascript
  import withMDX from '@next/mdx'

  const withMDXConfig = withMDX({
    extension: /\.mdx$/,
  })

  export default withMDXConfig({
    // Next.js config
  })
  ```

## 5. File Structure Conventions

- **Root-level layout**: Use `app/layout.tsx` for the root layout.
- **Nested layouts**: Create layouts for feature folders: `app/dashboard/layout.tsx`.
- **Route groups**: Use parentheses for groups that don't affect the URL: `app/(marketing)/layout.tsx`.
- **Loading states**: Create `loading.tsx` for automatic loading UIs.
- **Error boundaries**: Use `error.tsx` for error boundaries.
- **Static assets**: Place public assets in the root `public/` folder.

## 6. Styling and Assets

- **CSS Modules**: Use CSS Modules with the `.module.css` extension.
- **Global CSS**: Global styles should be imported in the root layout: `import './global.css'`.
- **Tailwind CSS**: If using Tailwind, configure it in `tailwind.config.ts` and import it in the global CSS.
- **Images**: Use the `next/image` component for optimized images:
  ```typescript
  import Image from 'next/image'
  
  <Image
    src="/images/hero.png"
    alt="Hero"
    width={500}
    height={500}
    priority
  />
  ```

## 7. Environment Variables

- **Prefixes**: Public variables must start with `NEXT_PUBLIC_`:
  ```typescript
  // .env.local
  NEXT_PUBLIC_API_URL=http://localhost:3000
  ```
- **Server-only**: Private variables should **not** start with `NEXT_PUBLIC_` and should only be used in Server Components.
- **Access in code**:
  ```typescript
  // Client Component
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  
  // Server Component
  const apiUrl = process.env.API_URL
  ```

## 8. Script Handling

- **`next/script` component**: Use this component for managing third-party scripts:
  ```typescript
  import Script from 'next/script'

  export default function MyComponent() {
    return (
      <Script
        src="https://example.com/script.js"
        strategy="afterInteractive" // or 'beforeInteractive' or 'lazyOnload'
      />
    )
  }
  ```
- **Inline scripts**: For inline scripts, use the `children` prop:
  ```typescript
  <Script id="my-inline-script">
    {`console.log('Inline script executing');`}
  </Script>
  ```

## 9. Fonts and Metadata

- **`next/font`**: Use the built-in font optimization:
  ```typescript
  import { Inter } from 'next/font/google'

  const inter = Inter({ subsets: ['latin'] })

  export default function RootLayout({ children }) {
    return (
      <html lang="en" className={inter.className}>
        {/* ... */}
      </html>
    )
  }
  ```
- **Metadata API**: Use `metadata` object or `generateMetadata` function in Server Components:
  ```typescript
  // app/page.tsx
  export const metadata = {
    title: 'My App',
    description: 'Generated by Next.js 16',
  }

  export default function Page() {
    // ...
  }
  ```

## 10. Breaking API Changes

| Deprecated/Removed         | Next.js 16 Replacement                       |
| -------------------------- | ----------------------------------------------- |
| `pages/` directory         | `app/` directory                              |
| `getServerSideProps`       | Native fetch with `cache: 'no-store'`           |
| `getStaticProps`           | Native fetch with `cache: 'force-cache'`        |
| `getInitialProps`          | Removed                                         |
| `next.config.js` (require) | `next.config.js` (import/ESM)              |
| `next/image` (legacy)    | `next/image` (same, but improved)               |
| `next/head`                | Metadata API (`metadata` object)              |
| `next/router`              | `next/navigation` (in client components)        |

## 11. Agent Workflow Rules

When an agent encounters a task requiring Next.js 16:

1. **Always assume App Router** (`app/` directory)
2. **Use `"use client"`** only when client-side interactivity is needed
3. **Prefer native `fetch()`** with `cache` and `revalidate` options for data fetching
4. **Use ESM format** for `next.config.js`
5. **Follow file naming conventions** (`page.tsx`, `layout.tsx`, etc.)
6. **Check for breaking changes** in `node_modules/next/dist/docs/` if unsure
7. **Verify deprecated APIs** are not being used
8. **Use TypeScript** for type safety (default in Next.js 16)

## 12. Verification Checklist

Before completing a task,
