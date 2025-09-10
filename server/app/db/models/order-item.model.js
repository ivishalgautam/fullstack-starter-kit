// models/orderItem.js
import { DataTypes } from "sequelize";
import constants from "../../lib/constants/index.js";

let OrderItemModel;

export const init = async (sequelize) => {
  OrderItemModel = sequelize.define(
    constants.models.ORDER_ITEM_TABLE,
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: constants.models.ORDER_TABLE,
          key: "id",
        },
        onDelete: "CASCADE",
      },
      item_id: {
        type: DataTypes.UUID,
        allowNull: false, // can be product_id OR book_id
      },
      item_type: {
        type: DataTypes.ENUM("book", "product"),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      discount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      total: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      metadata: {
        type: DataTypes.JSONB, // extra details like edition, format, color, size
        allowNull: true,
      },
    },
    {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  await OrderItemModel.sync({ alter: true });
};

const create = async (req, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  const data = await OrderItemModel.create(
    {
      order_id: req.body.order_id,
      item_id: req.body.item_id,
      item_type: req.body.item_type,
      quantity: req.body.quantity,
      price: req.body.price,
      total: req.body.total,
    },
    options
  );

  return data.dataValues;
};
const bulkCreate = async (data, transaction) => {
  const options = {};
  if (transaction) options.transaction = transaction;

  return await OrderItemModel.create(data, options);
};

export default {
  init: init,
  create: create,
  bulkCreate: bulkCreate,
};
