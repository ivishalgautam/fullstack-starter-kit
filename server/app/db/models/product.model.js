"use strict";
import moment from "moment";
import constants from "../../lib/constants/index.js";
import { DataTypes, QueryTypes } from "sequelize";

let ProductModel = null;

const init = async (sequelize) => {
  ProductModel = sequelize.define(
    constants.models.PRODUCT_TABLE,
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
          slug: "Product exist with this title.",
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
      min_age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      features: {
        type: DataTypes.JSONB, // [{ image:"", title:"", description:"" }]
        defaultValue: [],
      },
      youtube_urls: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      specifications: {
        type: DataTypes.JSONB, // [{ title:"", description:"" }]
        defaultValue: [],
      },
      meta_title: { type: DataTypes.TEXT },
      meta_description: { type: DataTypes.TEXT },
      meta_keywords: { type: DataTypes.TEXT },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
      //   paranoid: true,
      //   deletedAt: "deleted_at",
      indexes: [
        { fields: ["title"] },
        { fields: ["price"] },
        { fields: ["description"] },
        { fields: ["min_age"] },
        // {
        //   fields: ["features"],
        //   using: "gin",
        //   operator: "jsonb_path_ops",
        // },
        // {
        //   fields: ["specifications"],
        //   using: "gin",
        //   operator: "jsonb_path_ops",
        // },
      ],
    }
  );

  await ProductModel.sync({ alter: true });
};

const create = async (req, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  const data = await ProductModel.create(
    {
      slug: req.body.slug,
      pictures: req.body.pictures,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      min_age: req.body.min_age,
      features: req.body.features,
      youtube_urls: req.body.youtube_urls,
      specifications: req.body.specifications,
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

  return await ProductModel.update(
    {
      slug: req.body.slug,
      pictures: req.body.pictures,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      min_age: req.body.min_age,
      features: req.body.features,
      youtube_urls: req.body.youtube_urls,
      specifications: req.body.specifications,
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
      `(prd.title ILIKE :query OR prd.description ILIKE :query)`
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
        prd.*
    FROM ${constants.models.PRODUCT_TABLE} prd
    ${whereClause}
    ORDER BY prd.created_at DESC
    LIMIT :limit OFFSET :offset
  `;

  const countQuery = `
  SELECT 
     COUNT(prd.id) OVER()::integer as total
    FROM ${constants.models.PRODUCT_TABLE} prd
    ${whereClause}
    LIMIT :limit OFFSET :offset
  `;

  const products = await ProductModel.sequelize.query(query, {
    replacements: { ...queryParams, limit, offset },
    type: QueryTypes.SELECT,
    raw: true,
  });

  const count = await ProductModel.sequelize.query(countQuery, {
    replacements: { ...queryParams, limit, offset },
    type: QueryTypes.SELECT,
    raw: true,
    plain: true,
  });

  return { products, total: count?.total ?? 0 };
};

const getById = async (req, id) => {
  return await ProductModel.findOne({
    where: {
      id: req.params?.id || id,
    },
    order: [["created_at", "DESC"]],
    limit: 1,
    raw: true,
    plain: true,
  });
};

const deleteById = async (req, id, transaction) => {
  const options = { where: { id: req.params?.id || id } };
  if (transaction) options.transaction = transaction;

  return await ProductModel.destroy(options);
};

export default {
  init: init,
  create: create,
  update: update,
  getById: getById,
  get: get,
  deleteById: deleteById,
};
