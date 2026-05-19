import router from "express";
const myRouter = router.Router();
import { createServiceRecord, getAllServiceRecords, getServiceRecordByNumber, deleteServiceRecord} from "../controllers/serviceRecordController.js";
myRouter.post('/create', createServiceRecord);
myRouter.get('/', getAllServiceRecords);
myRouter.get('/:recordnumber', getServiceRecordByNumber);
myRouter.delete('/:recordnumber', deleteServiceRecord);
export default myRouter;