const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);

    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message:
        'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);

    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  let finished = false;

  if (pageCount === readPage) {
    finished = true;
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((item) => item.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  if (!name && !reading && !finished) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((item) => ({
          id: item.id,
          name: item.name,
          publisher: item.publisher,
        })),
      },
    });

    response.code(200);

    return response;
  }

  if (name) {
    const filteredName = books.filter((item) => {
      const regex = `/${name}/gi`;
      return regex.test(item.name);
    });

    const response = h.response({
      status: 'success',
      data: {
        books: filteredName.map((item) => ({
          id: item.id,
          name: item.name,
          publisher: item.publisher,
        })),
      },
    });

    response.code(200);

    return response;
  }

  if (reading) {
    const filteredReading = books.filter(
      (item) => Number(reading) === Number(item.reading)
    );

    const response = h.response({
      status: 'success',
      data: {
        books: filteredReading.map((item) => ({
          id: item.id,
          name: item.name,
          publisher: item.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  if (finished) {
    const filteredFinished = books.filter(
      (item) => Number(item.finished) === Number(finished)
    );

    const response = h.response({
      status: 'success',
      data: {
        books: filteredFinished.map((item) => ({
          id: item.id,
          name: item.name,
          publisher: item.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }
};

module.exports = {
  addBookHandler,
};
