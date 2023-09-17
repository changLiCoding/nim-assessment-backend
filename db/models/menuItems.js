const mongoose = require("../db.js");

const menuItemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
menuItemsSchema.set("toJSON", {
  virtuals: true
});
// menu model
const MenuItems = mongoose.model("MenuItems", menuItemsSchema);

const getAll = async () => {
  try {
    const menuItems = await MenuItems.find();
    return menuItems;
  } catch (error) {
    return error;
  }
};

const getOne = async (id) => {
  try {
    const menuItem = await MenuItems.findById(id);
    return menuItem;
  } catch (error) {
    return error;
  }
};

const deleteOne = async (id) => {
  try {
    await MenuItems.findByIdAndDelete(id);
    return id;
  } catch (error) {
    return error;
  }
};

const updateOne = async (id, body) => {
  try {
    const updatedMenu = await MenuItems.findByIdAndUpdate({ _id: id }, body, {
      new: true
    });
    return updatedMenu;
  } catch (error) {
    return error;
  }
};

const create = async (body) => {
  try {
    const menuItem = await MenuItems.create(body);
    return menuItem;
  } catch (error) {
    return error;
  }
};

const searchNameAndDescription = async (q) => {
  try {
    const menuItems = await MenuItems.find({
      $or: [
        { name: { $regex: new RegExp(q, "i") } },
        { description: { $regex: new RegExp(q, "i") } }
      ]
    });

    return menuItems;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  MenuItems,
  updateOne,
  deleteOne,
  searchNameAndDescription
};
