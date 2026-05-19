import router from "express";
const myRouter = router.Router();
import{createCar, getAllCars, getCarByPlateNumber, deleteCar,updateCar} from "../controllers/carController.js";
myRouter.post('/create', createCar);
myRouter.get('/', getAllCars);
myRouter.get('/:platenumber', getCarByPlateNumber);
myRouter.delete('/:platenumber', deleteCar);
myRouter.put('/:platenumber', updateCar);
export default myRouter;