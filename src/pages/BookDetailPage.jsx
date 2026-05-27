import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, replaceBook, moveBookToTrash } from '../api/booksApi';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import {
  getReviewsByBookId,
  addReview,
  updateReview,
  deleteReview
} from '../api/reviewsApi';
import '../styles/BookDetailPage.css';

const DEFAULT_POSTER = '/default-book-cover.png';

function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    releaseDate: '',
    genre: '소설',
    modifiedDate: '',
    createdDate: '',
    poster: '',
    likes: 0,
  });

  useEffect(() => {
    async function loadBook() {
      try {
        const data = await getBookById(id);

        setBook(data);
        setFormData({
          title: data.title || '',
          author: data.author || '',
          description: data.description || '',
          releaseDate: data.releaseDate || '',
          genre: data.genre || '소설',
          modifiedDate: data.modifiedDate || '',
          createdDate: data.createdDate || '',
          poster: data.poster || DEFAULT_POSTER,
          likes: data.likes || 0,
        });

        const reviewData = await getReviewsByBookId(id);
        setReviews(reviewData);
      } catch (err) {
        console.error('상세 도서 불러오기 실패:', err);
        setError('도서를 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    }

    loadBook();
  }, [id]);

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;

    const total = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('제목을 입력하세요.');
      return;
    }

    try {
      const today = new Date().toISOString().slice(0, 10);

      const updatedForm = {
        ...book,
        ...formData,
        poster: formData.poster || DEFAULT_POSTER,
        modifiedDate: today,
      };

      const updated = await replaceBook(id, updatedForm);

      setBook(updated);
      setFormData({
        title: updated.title || '',
        author: updated.author || '',
        description: updated.description || '',
        releaseDate: updated.releaseDate || '',
        genre: updated.genre || '소설',
        modifiedDate: updated.modifiedDate || '',
        createdDate: updated.createdDate || '',
        poster: updated.poster || DEFAULT_POSTER,
        likes: updated.likes || 0,
      });

      setIsEditing(false);
      setSaveMessage('✅ 도서 정보가 성공적으로 저장되었습니다!');

      setTimeout(() => {
        setSaveMessage('');
      }, 2000);
    } catch (err) {
      console.error('도서 저장 실패:', err);
      alert('도서 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 이 도서를 휴지통으로 이동하시겠습니까?')) return;

    try {
      await moveBookToTrash(id);

      alert('도서가 휴지통으로 이동되었습니다.');
      navigate('/books');
    } catch (err) {
      console.error('휴지통 이동 실패:', err);
      alert('도서 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      releaseDate: book.releaseDate || '',
      genre: book.genre || '소설',
      modifiedDate: book.modifiedDate || '',
      createdDate: book.createdDate || '',
      poster: book.poster || DEFAULT_POSTER,
      likes: book.likes || 0,
    });

    setIsEditing(false);
  };

  const handleAddReview = async (newReview) => {
    try {
      const saved = await addReview(newReview);

      setReviews((prevReviews) => [saved, ...prevReviews]);
    } catch (err) {
      console.error('리뷰 등록 실패:', err);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) return;

    try {
      await deleteReview(reviewId);

      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewId)
      );
    } catch (err) {
      console.error('리뷰 삭제 실패:', err);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleUpdateReview = async (reviewId, updatedData) => {
    try {
      const updated = await updateReview(reviewId, updatedData);

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? updated : review
        )
      );
    } catch (err) {
      console.error('리뷰 수정 실패:', err);
      alert('리뷰 수정 중 오류가 발생했습니다.');
    }
  };

  if (loading) return <p className="loading">불러오는 중...</p>;
  if (error) return <p className="error">에러: {error}</p>;
  if (!book) return <p className="error">도서를 찾을 수 없습니다.</p>;

  return (
    <div className="book-detail-page">
      <button className="back-btn" onClick={() => navigate('/books')}>
        ← 뒤로가기
      </button>

      {saveMessage && <div className="save-message">{saveMessage}</div>}

      <div className="detail-container">
        <div className="poster-section">
          {isEditing && (
            <div className="form-group">
              <label>표지 URL</label>
              <input
                type="text"
                name="poster"
                value={formData.poster}
                onChange={handleInputChange}
                placeholder="표지 이미지 URL"
              />
            </div>
          )}

          <img
            src={formData.poster || DEFAULT_POSTER}
            alt={formData.title}
            className="book-poster"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_POSTER;
            }}
          />
        </div>

        <div className="info-section">
          {!isEditing ? (
            <div className="view-mode">
              <h1>{book.title}</h1>

              <div className="book-meta-view">
                <p className="author">
                  작가: {book.author || '작가 미상'}
                </p>

                <span className="detail-genre-badge">
                  {book.genre || '소설'}
                </span>
              </div>

              <p className="description">
                {book.description || '등록된 설명이 없습니다.'}
              </p>

              <div className="dates">
                {book.createdDate && <p>📅 등록일: {book.createdDate}</p>}
                {book.releaseDate && <p>📅 출판일: {book.releaseDate}</p>}
                {book.modifiedDate && <p>📅 수정일: {book.modifiedDate}</p>}
              </div>

              <div className="detail-summary-row">
                <p className="likes">👍 좋아요: {book.likes || 0}</p>

                <div className="average-rating-box">
                  <span className="rating-stars">⭐</span>
                  <strong>{getAverageRating()}</strong>
                  <span> / 5.0</span>
                  <em>리뷰 {reviews.length}개 기준</em>
                </div>
              </div>
            </div>
          ) : (
            <div className="edit-mode">
              <div className="form-group">
                <label>제목 *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>작가</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="작가 이름"
                />
              </div>

              <div className="form-group">
                <label>설명</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="도서 설명"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>등록일</label>
                  <input
                    type="date"
                    name="createdDate"
                    value={formData.createdDate}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>출판일</label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>장르</label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                  >
                    <option value="소설">소설</option>
                    <option value="에세이">에세이</option>
                    <option value="시">시</option>
                    <option value="자기계발">자기계발</option>
                    <option value="경제/경영">경제/경영</option>
                    <option value="인문">인문</option>
                    <option value="사회">사회</option>
                    <option value="과학">과학</option>
                    <option value="역사">역사</option>
                    <option value="기타">기타</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>수정일</label>
                  <input
                    type="date"
                    name="modifiedDate"
                    value={formData.modifiedDate}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          <div className="actions">
            {!isEditing ? (
              <>
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  ✏️ 수정
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                  🗑️ 삭제
                </button>
              </>
            ) : (
              <>
                <button className="save-btn" onClick={handleSave}>
                  💾 저장
                </button>
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  취소
                </button>
              </>
            )}
          </div>

          <div className="review-section">
            <h2>📝 리뷰</h2>

            <ReviewForm
              bookId={id}
              onAddReview={handleAddReview}
            />

            <ReviewList
              reviews={reviews}
              onDelete={handleDeleteReview}
              onUpdate={handleUpdateReview}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetailPage;