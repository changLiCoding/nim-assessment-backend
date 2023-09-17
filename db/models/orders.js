const mongoose = require("../db.js");
const { MenuItems } = require("./menuItems.js");

const orderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  items: [
    {
      item: {
        type: mongoose.Schema.ObjectId,
        ref: "MenuItems"
      },

      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  status: {
    type: String,
    required: true,
    enum: ["pending", "confirmed", "delivered", "cancelled"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
orderSchema.set("toJSON", {
  virtuals: true
});
orderSchema.statics.calcTotal = (items) =>
  items.reduce((total, item) => total + item.price * item.quantity, 0);

// order model
const Order = mongoose.model("Order", orderSchema);

const getAll = async () => {
  // populate each item
  const orders = await Order.find().populate("items.item");

  return orders;
};

const getOne = async (id) => {
  const order = await Order.findById(id).populate("items.item");
  return order;
};

const create = async (body) => {
  const order = await Order.create(body);
  return order;
};

const update = async (id, body) => {
  const order = await Order.findByIdAndUpdate(id, body, { new: true });
  return order;
};

const remove = async (id) => {
  const order = await Order.findByIdAndDelete(id);
  return order.id;
};

const getByStatus = async (status) => {
  const orders = await Order.find({ status }).populate("items");
  return orders;
};

const getTotalSale = async () => {
  const orders = await Promise.all([
    getByStatus("confirmed"),
    getByStatus("pending"),
    getByStatus("delivered"),
    getByStatus("cancelled")
  ]);

  const totalSale = orders.flat().reduce(async (prevPromise, order) => {
    // GET TOTAL FOR EACH ORDER ITEM
    const itemPromises = order.items.map(async (item) => {
      const menu = await MenuItems.findById(item.item);
      return menu.price * item.quantity;
    });

    const itemTotals = await Promise.all(itemPromises);
    const prev = await prevPromise;
    // GET TOTAL FOR EACH ORDER
    return prev + itemTotals.reduce((acc, curr) => acc + curr, 0);
  }, Promise.resolve(0));

  return totalSale;
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  getByStatus,
  getTotalSale,
  Order
};
