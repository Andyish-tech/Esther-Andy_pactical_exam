import db from '../db/db.js';
export const createPayment = (req, res) => {
    const {amountPaid,platenumber,serviceCode } = req.body;
    if (!amountPaid || !platenumber || !serviceCode) {
        return res.status(400).json({ 
            message: 'All fields are required',
            received: {amountPaid, platenumber, serviceCode }
         });
    }

    const query = 'INSERT INTO payment (amountPaid, platenumber, serviceCode) VALUES (?, ?, ?)';
    db.query(query, [amountPaid, platenumber, serviceCode], (err, results) => {
        if (err) {
            console.error('Create Payment DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        res.status(201).json({ message: 'Payment created successfully' });
    })};

export const getAllPayments = (req, res) => {
    //select all payment paymentnumber	payment_date	amountPaid	platenumber	serviceCode

    const query = `SELECT payment.*, service.servicename, service.servicePrice
                   FROM payment
                   JOIN service ON payment.serviceCode = service.serviceCode`;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Get All Payments DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        res.status(200).json(results);
    });
};

export const deletePayment = (req, res) => {
    const { paymentnumber } = req.params;
    const query = 'DELETE FROM payment WHERE paymentnumber = ?';
    db.query(query, [paymentnumber], (err, results) => {
        if (err) {
            console.error('Delete Payment DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    });
};

export const getPaymentByNumber = (req, res) => {
    const { paymentnumber } = req.params;
    const query = 'SELECT * FROM payment WHERE paymentnumber = ?';
    db.query(query, [paymentnumber], (err, results) => {
        if (err) {
            console.error('Get Payment by Number DB error:', err);
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(results[0]);
    });
};
