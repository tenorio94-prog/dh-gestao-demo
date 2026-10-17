import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Month } from './screens/Month'
import { Stock } from './screens/Stock'
import { Today } from './screens/Today'
import { Layout } from './ui/Layout'

// A página de apresentação não pesa no primeiro carregamento do aplicativo.
const Landing = lazy(() => import('./landing/Landing'))

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <Landing />
            </Suspense>
          }
        />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Today />} />
          <Route path="estoque" element={<Stock />} />
          <Route path="mes" element={<Month />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
