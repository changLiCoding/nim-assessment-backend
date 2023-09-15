const { Router } = require("express");
const menuController = require("../controllers/menuController");

const menuRouter = Router();

menuRouter.get("/search", menuController.searchNameAndDescription);
menuRouter.get("/", menuController.getAll);
menuRouter.get("/:id", menuController.getOne);
menuRouter.post("/", menuController.create);
menuRouter.put("/:id", menuController.update);
menuRouter.delete("/:id", menuController.deleteById);

module.exports = menuRouter;
