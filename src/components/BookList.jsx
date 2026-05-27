import BookItem from './BookItem';
import '../styles/BookList.css';

function BookList({ books = [], onDelete, onLike, onFavorite }) {
  return (
    <div className="book-list">
      {books.length === 0 ? (
        <p className="empty-message">등록된 도서가 없습니다.</p>
      ) : (
        <ul className="books-grid">
          {books.map((book) => (
            <BookItem
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              description={book.description}
              releaseDate={book.releaseDate}
              modifiedDate={book.modifiedDate}
              genre={book.genre}
              poster={book.poster}
              likes={book.likes}
              averageRating={book.averageRating}
              reviewCount={book.reviewCount}
              isFavorite={book.isFavorite}
              onDelete={onDelete}
              onLike={onLike}
              onFavorite={onFavorite}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default BookList;