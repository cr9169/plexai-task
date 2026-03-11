import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/properties/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
