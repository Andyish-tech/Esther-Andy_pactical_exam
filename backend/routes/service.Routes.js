import router from "express";
const myRouter = router.Router();
import{getAllServices, createService, deleteService, updateService, getServiceByCode} from "../controllers/serviceController.js";
myRouter.get('/', getAllServices);
myRouter.post('/create', createService);
myRouter.delete('/:serviceCode', deleteService);
myRouter.put('/:serviceCode', updateService);
myRouter.get('/:serviceCode', getServiceByCode);
export default myRouter;