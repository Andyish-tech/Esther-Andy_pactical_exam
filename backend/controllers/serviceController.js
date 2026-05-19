import db from '../db/db.js';

// Get all services
export const getAllServices = (req, res) => {
    const query = 'SELECT * FROM service';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Get All Services DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        res.status(200).json(results);
    });
};

//insert a new service
export const createService = (req, res) => {
    const {serviceCode,servicename,servicePrice } = req.body;
    if (!serviceCode || !servicename || !servicePrice) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const query = 'INSERT INTO service (serviceCode, servicename, servicePrice) VALUES (?, ?, ?)';
    db.query(query, [serviceCode, servicename, servicePrice], (err, results) => {
        if (err) {
            console.error('Create Service DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        res.status(201).json({ message: 'Service created successfully' });
    });
};

//delete a service by service code
export const deleteService = (req, res) => {
    const { serviceCode } = req.params;
    const query = 'DELETE FROM service WHERE serviceCode = ?';
    db.query(query, [serviceCode], (err, results) => {
        if (err) {
            console.error('Delete Service DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        res.status(200).json({ message: 'Service deleted successfully' });
    });
};

//update a service by service code
export const updateService = (req, res) => {
    const { serviceCode } = req.params;
    const { servicename, servicePrice } = req.body;
    const query = 'UPDATE service SET servicename = ?, servicePrice = ? WHERE serviceCode = ?';
    db.query(query, [servicename, servicePrice, serviceCode], (err, results) => {
        if (err) {
            console.error('Update Service DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        res.status(200).json({ message: 'Service updated successfully' });
    });
};

//get a service by service code
export const getServiceByCode = (req, res) => {
    const { serviceCode } = req.params;
    const query = 'SELECT * FROM service WHERE serviceCode = ?';
    db.query(query, [serviceCode], (err, results) => {
        if (err) {
            console.error('Get Service by Code DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.status(200).json(results[0]);
    });
};
