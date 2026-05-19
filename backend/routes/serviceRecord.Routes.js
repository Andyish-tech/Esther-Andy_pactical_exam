import router from "express";
const myRouter = router.Router();
import { createServiceRecord, getAllServiceRecords, getServiceRecordByNumber, deleteServiceRecord} from "../controllers/serviceRecordController.js";
import { verifyToken, requireAdmin } from "../middleware/authmiddleware.js";

myRouter.post('/create', verifyToken, createServiceRecord);
myRouter.get('/', verifyToken, getAllServiceRecords);
myRouter.get('/:recordnumber', verifyToken, getServiceRecordByNumber);
myRouter.delete('/:recordnumber', verifyToken, requireAdmin, deleteServiceRecord);
export default myRouter;