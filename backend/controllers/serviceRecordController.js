import db from "../db/db.js";

//get all service records
export const getAllServiceRecords = (req, res) => {
    //select services by joining service_record and service and car tables to get the service name and car model
    const query = `SELECT service_record.*,car.model,car.type,service.servicename,service.servicePrice FROM service_record 
    JOIN car ON service_record.platenumber = car.platenumber 
    JOIN service ON service_record.serviceCode = service.serviceCode`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Get All Service Records DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        res.status(200).json(results);
    });
};

//insert a new service record
export const createServiceRecord = (req, res) => {
    const { platenumber, serviceCode } = req.body;
    if (!platenumber || !serviceCode) {
        return res.status(400).json({ 
            message: 'All fields are required',
            received: { platenumber, serviceCode }
         });
    }

    const query = 'INSERT INTO service_record (platenumber, serviceCode) VALUES (?, ?)';
    db.query(query, [platenumber, serviceCode], (err, results) => {
        if (err) {
            console.error('Create Service Record DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        res.status(201).json({ message: 'Service record created successfully' });
    });
};

//delete a service record by record number
export const deleteServiceRecord = (req, res) => {
    const { recordnumber } = req.params;    

    const query = 'DELETE FROM service_record WHERE recordnumber = ?';
    db.query(query, [recordnumber], (err, results) => {
        if (err) {
            console.error('Delete Service Record DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        res.status(200).json({ message: 'Service record deleted successfully' });
    });
};


//get a service record by record number
export const getServiceRecordByNumber = (req, res) => {
    const { recordnumber } = req.params;
    const query = 'SELECT * FROM service_record WHERE recordnumber = ?';
    db.query(query, [recordnumber], (err, results) => {
        if (err) {
            console.error('Get Service Record DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Service record not found' });
        }
        res.status(200).json(results[0]);
    });
};
