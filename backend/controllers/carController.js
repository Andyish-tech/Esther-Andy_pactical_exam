import db from '../db/db.js';

//create a new car
export const createCar = (req, res) => {
    const { platenumber,type,model,manufacturing_year,mechanicName} = req.body;
    if (!platenumber || !type || !model || !manufacturing_year || !mechanicName) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const query = 'INSERT INTO car (platenumber, type, model, manufacturing_year, mechanicName) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [platenumber, type, model, manufacturing_year, mechanicName], (err, results) => {
        if (err) {
            console.error('Create Car DB error:', err);
            return res.status(500).json({ message: 'Database error', error: err.code, details: err.sqlMessage });
        }
        res.status(201).json({ message: 'Car created successfully' });
    });
};

//get all cars
export const getAllCars = (req, res) => {
    const query = 'SELECT * FROM car';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Get All Cars DB error:', err);
            return res.status(500).json({ message: 'Database error', error: err.code, details: err.sqlMessage });
        }
        res.status(200).json(results);
    });
};

//delete a car by plate number
export const deleteCar = (req, res) => {
    const { platenumber } = req.params;
    const query = 'DELETE FROM car WHERE platenumber = ?';
    db.query(query, [platenumber], (err, results) => {
        if (err) {
            console.error('Delete Car DB error:', err);
            return res.status(500).json({ message: 'Database error', error: err.code, details: err.sqlMessage });
        }
        res.status(200).json({ message: 'Car deleted successfully' });
    });
};

//get a car by plate number
export const getCarByPlateNumber = (req, res) => {
    const { platenumber } = req.params;
    const query = 'SELECT * FROM car WHERE platenumber = ?';
    db.query(query, [platenumber], (err, results) => {
        if (err) {
            console.error('Get Car by Plate Number DB error:', err);
            return res.status(500).json({ message: 'Database error', error: err.code, details: err.sqlMessage });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json(results[0]);
    });
};
