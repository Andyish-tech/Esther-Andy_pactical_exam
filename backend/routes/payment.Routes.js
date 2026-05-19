import router from "express";
const myRouter = router.Router();
import { createPayment, getAllPayments, getPaymentByNumber, deletePayment} from "../controllers/paymentController.js";
myRouter.post('/create', createPayment);
myRouter.get('/', getAllPayments);
myRouter.get('/:paymentnumber', getPaymentByNumber);
myRouter.delete('/:paymentnumber', deletePayment);
export default myRouter;