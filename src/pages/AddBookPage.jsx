import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookForm from '../components/BookForm';
import { addBook } from '../api/booksApi';
import '../styles/AddBookPage.css';

function AddBookPage() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddBook = async (newBook) => {
    try {
      const saved = await addBook(newBook);
      console.log('저장됨:', saved);

      setSuccessMessage('✅ 도서가 성공적으로 등록되었습니다!');

      setTimeout(() => {
        navigate('/books');
      }, 1500);
    } catch (err) {
      console.error('도서 등록 실패:', err);
      alert('도서 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="add-book-page">
      <div className="page-header">
        <h1>➕ 새 도서 등록</h1>
        <p>새로운 도서를 등록하세요</p>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="form-container">
        <BookForm onAddBook={handleAddBook} />
      </div>
    </div>
  );
}

export default AddBookPage;