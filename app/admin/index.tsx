// pages/admin/index.tsx
import type { NextPage } from 'next'

const Admin: NextPage = () => {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Admin</h1>
      <p>Достъпът е защитен с Basic Auth (middleware).</p>
      <ul>
        <li>Тук сложи линкове към админ функции.</li>
        <li>Пример: управление на съдържание, поръчки, конфигурации…</li>
      </ul>
    </main>
  )
}

export default Admin
