import { useEffect, useState } from 'react';
import BookList from '../components/BookList';
import {
  getBooks,
  moveBookToTrash,
  increaseBookLike,
  toggleBookFavorite
} from '../api/booksApi';
import { getReviews } from '../api/reviewsApi';
import '../styles/BookListPage.css';

function BookListPage() {
  const [books, setBooks] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortType, setSortType] = useState('latest');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterType, setFilterType] = useState('all');
  const [genreFilter, setGenreFilter] = useState('all');

  const genres = [
    { value: 'all', label: '#전체' },
    { value: '소설', label: '#소설' },
    { value: '에세이', label: '#에세이' },
    { value: '시', label: '#시' },
    { value: '자기계발', label: '#자기계발' },
    { value: '경제/경영', label: '#경제·경영' },
    { value: '인문', label: '#인문' },
    { value: '사회', label: '#사회' },
    { value: '과학', label: '#과학' },
    { value: '역사', label: '#역사' },
    { value: '기타', label: '#기타' },
  ];

  useEffect(() => {
    async function loadBooks() {
      try {
        const [data, reviewData] = await Promise.all([
          getBooks(),
          getReviews()
        ]);

        if (!Array.isArray(data)) {
          throw new Error('books 데이터가 배열 형식이 아닙니다.');
        }

        const activeBooks = data.filter((book) => !book.isDeleted);

        setBooks(activeBooks);
        setReviews(reviewData);
      } catch (err) {
        console.error('도서 목록 불러오기 실패:', err);
        setError('도서를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await moveBookToTrash(id);

      setBooks((prevBooks) => prevBooks.filter((b) => b.id !== id));
      alert('도서가 휴지통으로 이동되었습니다.');
    } catch (err) {
      console.error('휴지통 이동 실패:', err);
      alert('도서 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleLike = async (id) => {
    try {
      const book = books.find((b) => b.id === id);

      if (!book) {
        throw new Error('해당 도서를 찾을 수 없습니다.');
      }

      const updated = await increaseBookLike(id, book.likes);

      setBooks((prevBooks) =>
        prevBooks.map((b) => (b.id === id ? updated : b))
      );
    } catch (err) {
      console.error('좋아요 실패:', err);
      alert('좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const handleFavorite = async (id) => {
    try {
      const book = books.find((b) => b.id === id);

      if (!book) {
        throw new Error('해당 도서를 찾을 수 없습니다.');
      }

      const updated = await toggleBookFavorite(id, book.isFavorite);

      setBooks((prevBooks) =>
        prevBooks.map((b) => (b.id === id ? updated : b))
      );
    } catch (err) {
      console.error('북마크 실패:', err);
      alert('북마크 처리 중 오류가 발생했습니다.');
    }
  };

  const handleToggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'desc' ? 'asc' : 'desc'));
  };

  const getAverageRatingInfo = (bookId) => {
    const bookReviews = reviews.filter(
      (review) => String(review.bookId) === String(bookId)
    );

    if (bookReviews.length === 0) {
      return {
        averageRating: 0,
        reviewCount: 0,
      };
    }

    const total = bookReviews.reduce(
      (sum, review) => sum + (review.rating || 0),
      0
    );

    return {
      averageRating: (total / bookReviews.length).toFixed(1),
      reviewCount: bookReviews.length,
    };
  };

  const filteredBooks = books
    .filter((book) => {
      const keyword = searchKeyword.trim().toLowerCase();

      const title = book.title || '';
      const author = book.author || '';
      const description = book.description || '';

      const matchesSearch =
        keyword === '' ||
        title.toLowerCase().includes(keyword) ||
        author.toLowerCase().includes(keyword) ||
        description.toLowerCase().includes(keyword);

      const matchesFilter =
        filterType === 'all' ||
        (filterType === 'liked' && (book.likes || 0) > 0) ||
        (filterType === 'favorite' && book.isFavorite);

      const matchesGenre =
        genreFilter === 'all' || book.genre === genreFilter;

      return matchesSearch && matchesFilter && matchesGenre;
    })
    .sort((a, b) => {
      let result = 0;

      if (sortType === 'latest') {
        result = Number(b.id) - Number(a.id);
      }

      if (sortType === 'releaseDate') {
        const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
        const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;

        result = dateB - dateA;
      }

      if (sortType === 'title') {
        result = (a.title || '').localeCompare(b.title || '', 'ko');
      }

      if (sortType === 'likes') {
        result = (b.likes || 0) - (a.likes || 0);
      }

      return sortOrder === 'asc' ? -result : result;
    })
    .map((book) => {
      const ratingInfo = getAverageRatingInfo(book.id);

      return {
        ...book,
        averageRating: ratingInfo.averageRating,
        reviewCount: ratingInfo.reviewCount,
      };
    });

  if (loading) return <p className="loading">불러오는 중...</p>;
  if (error) return <p className="error">에러: {error}</p>;

  return (
    <div className="book-list-page">
      <div className="page-header">
        <h1>📚 도서 목록</h1>
        <p>등록된 모든 도서를 확인하세요</p>
      </div>

      <div className="list-control-panel">
        <div className="search-box">
          <label>도서 검색</label>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="제목, 작가, 설명으로 검색하세요"
          />
        </div>

        <div className="control-row">
          <div className="select-box">
            <label>분류</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">전체 도서</option>
              <option value="liked">인기 도서</option>
              <option value="favorite">북마크</option>
            </select>
          </div>

          <div className="select-box">
            <label>정렬 기준</label>

            <div className="sort-control">
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >
                <option value="latest">등록일</option>
                <option value="releaseDate">출간일</option>
                <option value="title">제목</option>
                <option value="likes">좋아요</option>
              </select>

              <button
                type="button"
                className="sort-order-toggle"
                onClick={handleToggleSortOrder}
                title={sortOrder === 'desc' ? '내림차순' : '오름차순'}
              >
                {sortOrder === 'desc' ? '↓' : '↑'}
              </button>
            </div>
          </div>
        </div>

        <div className="genre-filter-box">
          <label>장르</label>

          <div className="genre-tags">
            {genres.map((genre) => (
              <button
                key={genre.value}
                type="button"
                className={`genre-tag ${genreFilter === genre.value ? 'active' : ''}`}
                onClick={() => setGenreFilter(genre.value)}
              >
                {genre.label}
              </button>
            ))}
          </div>
        </div>

        <div className="result-summary">
          총 <strong>{filteredBooks.length}</strong>권의 도서가 표시됩니다.
        </div>
      </div>

      <BookList
        books={filteredBooks}
        onDelete={handleDelete}
        onLike={handleLike}
        onFavorite={handleFavorite}
      />
    </div>
  );
}

export default BookListPage;