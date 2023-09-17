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
  // const orders = await Promise.all([
  //   getByStatus("confirmed"),
  //   getByStatus("pending"),
  //   getByStatus("delivered"),
  //   getByStatus("cancelled")
  // ]);

  // const totalSale = orders.flat().reduce(async (prevPromise, order) => {
  //   // GET SUBTOTAL FOR THE ORDER ITEMS
  //   const itemPromises = order.items.map(async (item) => {
  //     const menu = await MenuItems.findById(item.item);
  //     return menu.price * item.quantity;
  //   });
  //   // WAIT FOR ALL SUBTOTALS TO BE CALCULATED
  //   const itemTotals = await Promise.all(itemPromises);
  //   // WAIT FOR PREVIOUS TOTAL TO BE CALCULATED
  //   const prev = await prevPromise;
  //   // GET TOTAL FOR EACH ORDER
  //   return prev + itemTotals.reduce((acc, curr) => acc + curr, 0);
  // }, 0);

  // return totalSale;

  try {
    const totalSale = await Order.aggregate([
      // GET ALL ORDERS EXCEPT CANCELLED
      {
        $match: {
          status: { $in: ["confirmed", "pending", "delivered"] }
        }
      },

      // UNWIND THE ITMES ARRAY TO CREATE A SEPARATE DOCUMENT FOR EACH ITEM
      { $unwind: "$items" },
      // Lookup the corresponding MenuItems for each item
      {
        $lookup: {
          from: "menuitems",
          localField: "items.item",
          foreignField: "_id",
          as: "menuItems"
        }
      },
      // Project the fields needed for calculation
      {
        $project: {
          quantity: "$items.quantity",
          price: { $arrayElemAt: ["$menuItems.price", 0] }
        }
      },
      // Calculate the subtotal for each item in each order
      {
        $project: {
          subtotal: { $multiply: ["$quantity", "$price"] }
        }
      },
      // Group the results by order and calculate the total sale for each order
      {
        $group: {
          _id: "$_id",
          totalSale: { $sum: "$subtotal" }
        }
      },
      // Calculate the total sale for all orders
      {
        $group: {
          _id: null,
          totalSale: { $sum: "$totalSale" }
        }
      }
    ]);

    if (totalSale.length > 0) {
      return totalSale[0].totalSale;
    }
    return 0; // No orders match the specified statuses
  } catch (error) {
    return error;
  }
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
