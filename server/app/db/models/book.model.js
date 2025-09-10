"use strict";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes } from "sequelize";

let BookModel = null;

const init = async (sequelize) => {
  BookModel = sequelize.define(
    constants.models.BOOK_TABLE,
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      slug: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: {
          args: true,
          slug: "Book exist with this title.",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      pictures: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      related_books: {
        type: DataTypes.ARRAY(DataTypes.UUID),
        defaultValue: [],
      },
      meta_title: { type: DataTypes.TEXT },
      meta_description: { type: DataTypes.TEXT },
      meta_keywords: { type: DataTypes.TEXT },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
      indexes: [
        { fields: ["title"] },
        { fields: ["price"] },
        { fields: ["description"] },
      ],
    }
  );

  await BookModel.sync({ alter: true });
};

const create = async (req, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  const data = await BookModel.create(
    {
      slug: req.body.slug,
      pictures: req.body.pictures,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      related_books: req.body.related_books,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
    },
    options
  );

  return data.dataValues;
};

const update = async (req, id, transaction) => {
  const options = {
    where: { id: req?.params?.id || id },
    returning: true,
    raw: true,
  };

  if (transaction) options.transaction = transaction;

  return await BookModel.update(
    {
      slug: req.body.slug,
      pictures: req.body.pictures,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      related_books: req.body.related_books,
      meta_title: req.body.meta_title,
      meta_description: req.body.meta_description,
      meta_keywords: req.body.meta_keywords,
    },
    options
  );
};

const get = async (req) => {
  const whereConditions = [];
  const queryParams = {};
  const q = req.query.q ? req.query.q : null;

  if (q) {
    whereConditions.push(
      `(bk.title ILIKE :query OR bk.description ILIKE :query)`
    );
    queryParams.query = `%${q}%`;
  }

  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : null;
  const offset = (page - 1) * limit;

  let whereClause = "";
  if (whereConditions.length) {
    whereClause = `WHERE ${whereConditions.join(" AND ")}`;
  }

  const query = `
  SELECT 
        bk.*
    FROM ${constants.models.BOOK_TABLE} bk
    ${whereClause}
    ORDER BY bk.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const countQuery = `
  SELECT 
     COUNT(bk.id) OVER()::integer as total
    FROM ${constants.models.BOOK_TABLE} bk
    ${whereClause}
    LIMIT :limit OFFSET :offset
  `;

  const books = await BookModel.sequelize.query(query, {
    replacements: { ...queryParams, limit, offset },
    type: QueryTypes.SELECT,
    raw: true,
  });

  const count = await BookModel.sequelize.query(countQuery, {
    replacements: { ...queryParams, limit, offset },
    type: QueryTypes.SELECT,
    raw: true,
    plain: true,
  });

  return { books, total: count?.total ?? 0 };
};

const getById = async (req, id) => {
  return await BookModel.findOne({
    where: { id: req.params?.id || id },
    order: [["created_at", "DESC"]],
    limit: 1,
    raw: true,
    plain: true,
  });
};

const deleteById = async (req, id, transaction) => {
  const options = { where: { id: req.params?.id || id } };
  if (transaction) options.transaction = transaction;

  return await BookModel.destroy(options);
};

export default {
  init: init,
  create: create,
  update: update,
  getById: getById,
  get: get,
  deleteById: deleteById,
};
