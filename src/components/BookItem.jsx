import { Link } from 'react-router-dom';

const DEFAULT_POSTER = "/default-book-cover.png";

function BookItem({
  id,
  title,
  author,
  description,
  releaseDate,
  modifiedDate,
  genre,
  poster,
  likes = 0,
  averageRating = 0,
  reviewCount = 0,
  isFavorite = false,
  onLike,
  onDelete,
  onFavorite
}) {
  return (
    <li className="book-card">
      <Link to={`/books/${id}`} className="book-link">
        <img
          src={poster || DEFAULT_POSTER}
          alt={title}
          className="book-poster"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_POSTER;
          }}
        />

        <div className="book-info">
          <h3>{title}</h3>

          <div className="book-meta-row">
            {author && <p className="author">작가: {author}</p>}
            {genre && <span className="genre-badge">{genre}</span>}
          </div>

          <div className="book-rating-summary">
            {reviewCount > 0 ? (
              <>
                <span>⭐ {averageRating}</span>
                <small>리뷰 {reviewCount}개</small>
              </>
            ) : (
              <small>⭐ 리뷰 없음</small>
            )}
          </div>

          {description && <p className="description">{description}</p>}
          {releaseDate && <p className="date">출판일: {releaseDate}</p>}
          {modifiedDate && <p className="date">수정일: {modifiedDate}</p>}
        </div>
      </Link>

      <div className="book-actions">
        <button onClick={() => onLike?.(id)} className="like-btn">
          👍 {likes}
        </button>

        <button
          onClick={() => onFavorite?.(id)}
          className={`favorite-btn ${isFavorite ? 'active' : ''}`}
        >
          {isFavorite ? '🔖 해제' : '🔖 북마크'}
        </button>

        <button
          onClick={() => {
            const isConfirmed = window.confirm("정말 이 도서를 휴지통으로 이동하시겠습니까?");
            if (isConfirmed) {
              onDelete?.(id);
            }
          }}
          className="delete-btn"
        >
          삭제
        </button>
      </div>
    </li>
  );
}

export default BookItem;