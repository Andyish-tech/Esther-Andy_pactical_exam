import router from "express";
const myRouter = router.Router();
import { createPayment, getAllPayments, getPaymentByNumber, deletePayment} from "../controllers/paymentController.js";
import { verifyToken, requireAdmin } from "../middleware/authmiddleware.js";

myRouter.post('/create', verifyToken, createPayment);
myRouter.get('/', verifyToken, getAllPayments);
myRouter.get('/:paymentnumber', verifyToken, getPaymentByNumber);
myRouter.delete('/:paymentnumber', verifyToken, requireAdmin, deletePayment);
export default myRouter;