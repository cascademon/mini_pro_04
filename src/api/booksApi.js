const API_URL = "http://localhost:3000/books";

export async function getBooks() {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("도서 목록을 불러오지 못했습니다.");
  }

  return await res.json();
}

export async function getBookById(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("도서를 불러오지 못했습니다.");
  }

  return await res.json();
}

export async function addBook(book) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  if (!res.ok) {
    throw new Error("도서 등록에 실패했습니다.");
  }

  return await res.json();
}

export async function updateBook(id, book) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  if (!res.ok) {
    throw new Error("도서 수정에 실패했습니다.");
  }

  return await res.json();
}

export async function replaceBook(id, book) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(book),
  });

  if (!res.ok) {
    throw new Error("도서 저장에 실패했습니다.");
  }

  return await res.json();
}

export async function deleteBook(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("도서 삭제에 실패했습니다.");
  }

  return true;
}

export async function moveBookToTrash(id) {
  return await updateBook(id, {
    isDeleted: true,
    deletedAt: new Date().toISOString(),
  });
}

export async function restoreBook(id) {
  return await updateBook(id, {
    isDeleted: false,
    deletedAt: null,
  });
}

export async function increaseBookLike(id, currentLikes) {
  return await updateBook(id, {
    likes: (currentLikes || 0) + 1,
  });
}

export async function toggleBookFavorite(id, currentFavorite) {
  return await updateBook(id, {
    isFavorite: !currentFavorite,
  });
}