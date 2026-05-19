import router from "express";
const myRouter = router.Router();
import{getAllServices, createService, deleteService, updateService, getServiceByCode} from "../controllers/serviceController.js";
import { verifyToken, requireAdmin } from "../middleware/authmiddleware.js";

myRouter.get('/',verifyToken, getAllServices);
myRouter.post('/create', verifyToken, requireAdmin, createService);
myRouter.delete('/:serviceCode', verifyToken, requireAdmin, deleteService);
myRouter.put('/:serviceCode', verifyToken, requireAdmin, updateService);
myRouter.get('/:serviceCode', verifyToken, getServiceByCode);
export default myRouter;