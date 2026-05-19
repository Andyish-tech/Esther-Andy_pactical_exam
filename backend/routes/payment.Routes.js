import router from "express";
const myRouter = router.Router();
import { createPayment, getAllPayments, getPaymentByNumber, deletePayment} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authmiddleware.js";
myRouter.post('/create', verifyToken, createPayment);
myRouter.get('/', verifyToken, getAllPayments);
myRouter.get('/:paymentnumber', verifyToken, getPaymentByNumber);
myRouter.delete('/:paymentnumber', verifyToken, deletePayment);
export default myRouter;