const API_URL = "http://localhost:3000/reviews";

export async function getReviews() {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("리뷰 목록을 불러오지 못했습니다.");
  }

  return await res.json();
}

export async function getReviewsByBookId(bookId) {
  const res = await fetch(`${API_URL}?bookId=${bookId}`);

  if (!res.ok) {
    throw new Error("리뷰 목록을 불러오지 못했습니다.");
  }

  return await res.json();
}

export async function addReview(review) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  if (!res.ok) {
    throw new Error("리뷰 등록에 실패했습니다.");
  }

  return await res.json();
}

export async function updateReview(reviewId, review) {
  const res = await fetch(`${API_URL}/${reviewId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(review),
  });

  if (!res.ok) {
    throw new Error("리뷰 수정에 실패했습니다.");
  }

  return await res.json();
}

export async function deleteReview(reviewId) {
  const res = await fetch(`${API_URL}/${reviewId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("리뷰 삭제에 실패했습니다.");
  }

  return true;
}