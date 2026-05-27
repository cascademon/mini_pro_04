import { useState } from 'react';
import '../styles/BookForm.css';

const DEFAULT_POSTER = "/default-book-cover.png";

function BookForm({ onAddBook }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [genre, setGenre] = useState('소설');
  const [poster, setPoster] = useState(DEFAULT_POSTER);
  const [candidatePosters, setCandidatePosters] = useState([]);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openaiApiKey') || '');
  const [generatingPoster, setGeneratingPoster] = useState(false);

  const handleClick = () => {
    if (!title.trim()) {
      alert('제목을 입력하세요');
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const newBook = {
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      releaseDate,
      genre,
      modifiedDate: today,
      createdDate: today,
      poster: poster || DEFAULT_POSTER,
      likes: 0,
      isDeleted: false,
      deletedAt: null,
      isFavorite: false,
    };

    onAddBook(newBook);

    setTitle('');
    setAuthor('');
    setDescription('');
    setReleaseDate('');
    setGenre('소설');
    setPoster(DEFAULT_POSTER);
    setCandidatePosters([]);
  };

  const handleApiKeyChange = (value) => {
    setApiKey(value);
    localStorage.setItem('openaiApiKey', value);
  };

  const generatePoster = async () => {
    if (!title.trim()) {
      alert('AI 표지를 생성하려면 먼저 제목을 입력해주세요.');
      return;
    }

    if (!apiKey.trim()) {
      alert('OpenAI API 키를 입력해주세요. API 키 없이도 일반 도서 등록은 가능합니다.');
      return;
    }

    const prompt = `
      책 표지 디자인 해줘.

      제목: ${title}
      장르: ${genre}
      내용: ${description || '도서 설명 없음'}

      요구사항
      - 허위 출판사 기입 금지.
      - 책의 앞표지만 정면으로 보여주시오.
      - 책 옆면과 두께는 보이지 않게 하시오.
    `;

    setGeneratingPoster(true);

    try {
      const res = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-image-2',
          prompt: prompt,
          n: 3,
          size: '1024x1536',
          quality: 'medium',
          output_format: 'png',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('OpenAI 에러 응답:', data);
        throw new Error(data.error?.message || 'OpenAI 요청 실패');
      }

      const images = data.data
        ?.map((item) => item.b64_json)
        .filter(Boolean)
        .map((b64) => `data:image/png;base64,${b64}`);

      if (!images || images.length === 0) {
        throw new Error('이미지 데이터가 없습니다.');
      }

      setCandidatePosters(images);
      setPoster(images[0]);
    } catch (err) {
      console.error('표지 생성 실패:', err);
      alert('AI 표지 생성에 실패했습니다. 일반 도서 등록은 그대로 가능합니다.');
    } finally {
      setGeneratingPoster(false);
    }
  };

  return (
    <div className="book-form">
      <div className="form-section">
        <h3>도서 정보</h3>
        <p>AI 표지 없이도 기본 이미지로 도서를 등록할 수 있습니다.</p>
      </div>

      <div className="book-form-layout">
        <div className="form-left">
          <div className="form-group">
            <label>제목 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="도서 제목을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>작가</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="작가 이름"
            />
          </div>

          <div className="form-group">
            <label>설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="도서 설명을 입력하세요"
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>출판일</label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>장르</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
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
          </div>
        </div>

        <div className="form-right">
          <div className="form-group poster-section">
            <div className="poster-title-row">
              <div>
                <label>책 표지</label>
                <p className="help-text">
                  선택 사항입니다. 생성하지 않으면 기본 표지가 사용됩니다.
                </p>
              </div>
            </div>

            {poster && (
              <div className="poster-preview">
                <img
                  src={poster || DEFAULT_POSTER}
                  alt="Book poster"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_POSTER;
                  }}
                />
              </div>
            )}

            {candidatePosters.length > 0 && (
              <div className="poster-choice-list">
                <p className="help-text">마음에 드는 표지를 선택하세요.</p>

                <div className="poster-choice-grid">
                  {candidatePosters.map((candidatePoster, index) => (
                    <button
                      key={candidatePoster}
                      type="button"
                      className={`poster-choice-card ${poster === candidatePoster ? 'selected' : ''}`}
                      onClick={() => setPoster(candidatePoster)}
                    >
                      <img
                        src={candidatePoster}
                        alt={`AI 표지 후보 ${index + 1}`}
                      />
                      <span>{index + 1}번 표지</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="ai-box">
              <div className="form-group">
                <label>OpenAI API 키</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="sk-..."
                />
              </div>

              <button
                type="button"
                onClick={generatePoster}
                disabled={generatingPoster}
                className="generate-btn"
              >
                {generatingPoster ? (
                  <span className="loading-content">
                    <span className="spinner"></span>
                    생성 중...
                  </span>
                ) : poster !== DEFAULT_POSTER ? (
                  '🔄 AI 표지 재생성'
                ) : (
                  '🤖 AI 표지 생성'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleClick} className="add-btn">
        도서 추가
      </button>
    </div>
  );
}

export default BookForm;