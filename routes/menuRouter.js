const { Router } = require("express");
const menuController = require("../controllers/menuController");

const menuRouter = Router();

console.log("🧛🏿‍♂️🧛🏿‍♂️🧛🏿‍♂️🧛🏿‍♂️🧛🏿‍♂️🧛🏿‍♂️", "menu");

menuRouter.get("/", menuController.getAll);
menuRouter.get("/:id", menuController.getOne);
menuRouter.post("/", menuController.create);
menuRouter.put("/:id", menuController.update);

module.exports = menuRouter;
