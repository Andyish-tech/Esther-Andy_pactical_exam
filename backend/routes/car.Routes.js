import router from "express";
const myRouter = router.Router();
import{createCar, getAllCars, getCarByPlateNumber, deleteCar} from "../controllers/carController.js";
myRouter.post('/create', createCar);
myRouter.get('/', getAllCars);
myRouter.get('/:platenumber', getCarByPlateNumber);
myRouter.delete('/:platenumber', deleteCar);
export default myRouter;