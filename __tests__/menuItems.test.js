require("dotenv").config();
const { getAll, getOne, create, MenuItems } = require("../db/models/menuItems");
const preload = require("../db/preload-db");
const mongoose = require("../db/db");

describe("menuItems", () => {
  // setup
  const testMenuItem = {
    name: "test",
    price: 1.99,
    description: "test description",
    image_url: "test url"
  };

  // teardown
  afterEach(async () => {
    await MenuItems.deleteMany({});
  });

  describe("getAll", () => {
    it("should return an array of menu items", async () => {
      const menuItems = await getAll();
      expect(menuItems).toBeInstanceOf(Array);
    });
  });

  describe("getOne", () => {
    it("should return a menu item", async () => {
      const menuItem = await create(testMenuItem);
      const foundMenuItem = await getOne(menuItem._id);
      expect(foundMenuItem).toBeInstanceOf(Object);
    });
  });

  describe("create", () => {
    it("should create a menu item", async () => {
      const menuItem = await create(testMenuItem);
      expect(menuItem).toBeInstanceOf(Object);
    });
  });

  afterAll(async () => {
    await preload();
    await mongoose.connection.close();
  });
});
