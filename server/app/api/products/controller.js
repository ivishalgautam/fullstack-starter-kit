"use strict";
import table from "../../db/models.js";
import slugify from "slugify";
import { StatusCodes } from "http-status-codes";
import { cleanupFiles } from "../../helpers/cleanup-files.js";
import { sequelize } from "../../db/postgres.js";
import { getItemsToDelete } from "../../helpers/filter.js";

const create = async (req, res) => {
  try {
    let slug = slugify(req.body.title, { lower: true });
    req.body.slug = slug;
    await table.ProductModel.create(req);

    res
      .code(StatusCodes.CREATED)
      .send({ status: true, message: "Product created." });
  } catch (error) {
    throw error;
  }
};

const updateById = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const record = await table.ProductModel.getById(req, req.params.id);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Product not found!" });
    }

    let slug = slugify(req.body.title, { lower: true, strict: true });
    req.body.slug = slug;

    const documentsToDelete = [];

    const existingPictures = record.pictures;
    const updatedPictures = req.body.picture_urls;
    if (updatedPictures) {
      req.body.pictures = [...(req.body?.pictures ?? []), ...updatedPictures];
      documentsToDelete.push(
        ...getItemsToDelete(existingPictures, updatedPictures)
      );
    }

    const existingFeatures = record.features.map(({ image }) => image);
    const updatedFeatures = req.body.features?.map(({ image }) => image);
    documentsToDelete.push(
      ...getItemsToDelete(existingFeatures, updatedFeatures)
    );

    await table.ProductModel.update(req, 0, transaction);
    await cleanupFiles(documentsToDelete);

    await transaction.commit();
    res
      .code(StatusCodes.OK)
      .send({ status: true, message: "Product updated." });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getById = async (req, res) => {
  try {
    const record = await table.ProductModel.getById(req, req.params.id);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Product not found!" });
    }

    const data = await table.ProductModel.getById(req);

    res.code(StatusCodes.OK).send({ status: true, data: data });
  } catch (error) {
    throw error;
  }
};

const get = async (req, res) => {
  try {
    const data = await table.ProductModel.get(req);

    res.code(StatusCodes.OK).send({ status: true, data: data });
  } catch (error) {
    throw error;
  }
};

const deleteById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const record = await table.ProductModel.getById(req);
    if (!record) {
      return res
        .code(StatusCodes.NOT_FOUND)
        .send({ message: "Product not found!" });
    }

    await table.ProductModel.deleteById(req, 0, transaction);

    const documentsToDelete = [];
    record.features?.forEach(({ image }) => documentsToDelete.push(image));
    record.pictures?.forEach((image) => documentsToDelete.push(image));
    await cleanupFiles(documentsToDelete);

    await transaction.commit();
    res.status(StatusCodes.OK).send(record);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export default {
  create: create,
  updateById: updateById,
  getById: getById,
  get: get,
  deleteById: deleteById,
};
