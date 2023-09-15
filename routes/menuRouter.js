const { Router } = require("express");
const menuController = require("../controllers/menuController");

const menuRouter = Router();

menuRouter.get("/", menuController.getAll);
menuRouter.get("/:id", menuController.getOne);
menuRouter.post("/", menuController.create);
menuRouter.put("/:id", menuController.update);
menuRouter.delete("/:id", menuController.deleteById);
// menuRouter.get("/search?q=:query", menuController.search);

module.exports = menuRouter;
