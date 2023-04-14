var express = require('express');
var router = express.Router();

const { getConnection } = require('../sql/getConnection');

async function getBooks() {
  const sql = 'SELECT * FROM books';

  try {
    const connection = await getConnection();

    const [result] = await connection.query(sql);

    connection.release();

    return result;
  } catch (err) {
    throw err;
  }
}
/**
 * 获取书籍列表
 */
router.get('/books', async (req, res) => {
  let title = req.query.title;
  let author = req.query.author;

  if (!title && !author) {
    return res
      .status(400)
      .json({ message: 'Title or Author query parameter is required' });
  }

  if (title && title.trim().length > 256) {
    return res
      .status(400)
      .json({ message: 'Title length cannot exceed 256 characters' });
  }

  if (author && author.trim().length === 0) {
    return res.status(400).json({ message: 'Author cannot be blank' });
  }

  let sql = 'SELECT * FROM books';

  if (title || author) {
    sql += ' WHERE';
  }

  if (title) {
    sql += ' title LIKE ?';
  }

  if (author) {
    if (title) {
      sql += ' AND';
    }

    sql += ' author LIKE ?';
  }

  try {
    const connection = await getConnection();

    let result;

    if (title && author) {
      result = await connection.query(sql, [`%${title}%`, `%${author}%`]);
    } else if (title) {
      result = await connection.query(sql, [`%${title}%`]);
    } else if (author) {
      result = await connection.query(sql, [`%${author}%`]);
    }

    connection.release();

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

router.get('/books/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  const sql = 'SELECT * FROM books WHERE id = ?';

  try {
    const connection = await getConnection();

    const [result] = await connection.query(sql, [id]);

    connection.release();

    if (result.length === 0) {
      return res.status(404).json({ message: `Book with id ${id} not found` });
    }

    res.json(result[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving book' });
  }
});
