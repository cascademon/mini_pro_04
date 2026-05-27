import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../api/booksApi';
import '../styles/Home.css';

const DEFAULT_POSTER = "/default-book-cover.png";

function Home() {
  const [stats, setStats] = useState({
    total: 0,
    recent: [],
    popular: [],
    favorites: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const books = await getBooks();

        const activeBooks = books.filter((book) => !book.isDeleted);

        const recentBooks = [...activeBooks]
          .sort((a, b) => Number(b.id) - Number(a.id))
          .slice(0, 3);

        const popularBooks = [...activeBooks]
          .filter((book) => (book.likes || 0) > 0)
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
          .slice(0, 3);

        const favoriteBooks = [...activeBooks]
          .filter((book) => book.isFavorite)
          .slice(0, 3);

        setStats({
          total: activeBooks.length,
          recent: recentBooks,
          popular: popularBooks,
          favorites: favoriteBooks
        });
      } catch (err) {
        console.error('홈 데이터 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const renderBookCard = (book) => (
    <Link
      key={book.id}
      to={`/books/${book.id}`}
      className="recent-book-item"
    >
      <img
        src={book.poster || DEFAULT_POSTER}
        alt={book.title}
        onError={(e) => {
          e.currentTarget.src = DEFAULT_POSTER;
        }}
      />

      <div className="book-details">
        <h4>{book.title}</h4>
        <p>{book.author || '작가 미상'}</p>
        <span className="like-count">👍 {book.likes || 0}</span>
      </div>
    </Link>
  );

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>
          당신의 이야기가 머무는 곳,
          <br />
          AI와 함께 완성하는 나만의 서재
        </h1>
        <p>
          책 정보를 기록하고, 어울리는 표지를 생성해 나만의 창작 서재를 만들어보세요.
        </p>
      </div>

      <div className="quick-actions">
        <Link to="/books" className="action-card action-list">
          <div className="icon">📚</div>
          <h3>도서 목록</h3>
          <p>등록된 모든 도서를 확인하세요</p>
        </Link>

        <Link to="/add-book" className="action-card action-add">
          <div className="icon">➕</div>
          <h3>새 도서 등록</h3>
          <p>새로운 도서를 추가하세요</p>
        </Link>
      </div>

      {!loading && (
        <div className="stats-section">
          <h2>📊 도서 통계</h2>
          <div className="stats-info">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">등록된 도서</span>
            </div>
          </div>
        </div>
      )}

      {!loading && stats.popular.length > 0 && (
        <div className="popular-section">
          <div className="section-title-row">
            <div>
              <h2>🔥 인기 도서 추천</h2>
              <p>좋아요를 많이 받은 도서를 추천합니다.</p>
            </div>
          </div>

          <div className="popular-books">
            {stats.popular.map((book, index) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="popular-book-card"
              >
                <div className="popular-rank">TOP {index + 1}</div>

                <img
                  src={book.poster || DEFAULT_POSTER}
                  alt={book.title}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_POSTER;
                  }}
                />

                <div className="popular-book-info">
                  <h3>{book.title}</h3>
                  <p>{book.author || '작가 미상'}</p>
                  <span>👍 {book.likes || 0}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!loading && stats.favorites.length > 0 && (
        <div className="favorite-section">
          <div className="section-title-row">
            <div>
              <h2>🔖 북마크 도서</h2>
              <p>나중에 다시 보고 싶은 도서를 모아봤어요.</p>
            </div>
          </div>

          <div className="recent-books">
            {stats.favorites.map((book) => renderBookCard(book))}
          </div>
        </div>
      )}

      {!loading && stats.recent.length > 0 && (
        <div className="recent-section">
          <h2>🆕 최신 등록 도서</h2>

          <div className="recent-books">
            {stats.recent.map((book) => renderBookCard(book))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;