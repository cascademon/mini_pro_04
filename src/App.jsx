import './App.css';
import './styles/DarkMode.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import BookListPage from './pages/BookListPage';
import AddBookPage from './pages/AddBookPage';
import BookDetailPage from './pages/BookDetailPage';
import TrashPage from './pages/TrashPage';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  return (
    <Router>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BookListPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/add-book" element={<AddBookPage />} />
        <Route path="/trash" element={<TrashPage />} />
      </Routes>
    </Router>
  );
}

export default App;