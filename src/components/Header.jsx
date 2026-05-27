import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

function Header({ darkMode, setDarkMode }) {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>📚 도서 관리</h1>
        </Link>

        <nav className="nav">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            홈
          </Link>

          <Link
            to="/books"
            className={`nav-link ${location.pathname.startsWith('/books') ? 'active' : ''}`}
          >
            도서 목록
          </Link>

          <Link
            to="/add-book"
            className={`nav-link ${location.pathname === '/add-book' ? 'active' : ''}`}
          >
            새 도서 등록
          </Link>

          <Link
            to="/trash"
            className={`nav-link ${location.pathname === '/trash' ? 'active' : ''}`}
          >
            휴지통
          </Link>

          <button
            type="button"
            className="dark-toggle-btn"
            onClick={() => setDarkMode((prev) => !prev)}
            title={darkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;