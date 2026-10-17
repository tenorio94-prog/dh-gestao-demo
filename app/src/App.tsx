import { HashRouter, Route, Routes } from 'react-router-dom'
import { Month } from './screens/Month'
import { Stock } from './screens/Stock'
import { Today } from './screens/Today'
import { Layout } from './ui/Layout'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Today />} />
          <Route path="estoque" element={<Stock />} />
          <Route path="mes" element={<Month />} />
          <Route path="*" element={<Today />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
