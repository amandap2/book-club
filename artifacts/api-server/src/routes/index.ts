import { Router, type IRouter } from "express";
import healthRouter from "./health";
import booksRouter from "./books";
import recommendationsRouter from "./recommendations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(booksRouter);
router.use(recommendationsRouter);

export default router;
