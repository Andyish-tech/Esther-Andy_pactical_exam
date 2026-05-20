-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2026 at 09:33 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crpms`
--

-- --------------------------------------------------------

--
-- Table structure for table `car`
--

CREATE TABLE `car` (
  `platenumber` varchar(10) NOT NULL,
  `type` varchar(40) DEFAULT NULL,
  `model` varchar(40) DEFAULT NULL,
  `driverPhone` varchar(15) DEFAULT NULL,
  `manufacturing_year` varchar(5) DEFAULT NULL,
  `mechanicName` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `car`
--

INSERT INTO `car` (`platenumber`, `type`, `model`, `driverPhone`, `manufacturing_year`, `mechanicName`) VALUES
('RAB 123 A', 'Toyota', 'colora', NULL, '2001', 'karisa'),
('RAB 323 A', 'Toyota', ' Rava 4', NULL, '2014', 'Gasana'),
('RAD123X', 'Toyota', 'Rava 4', '1987654321', '2024', 'GISUBIZO'),
('RAG123A', 'Toyota', 'Rava 4', NULL, '2024', 'GISUBIZO'),
('RAG123C', 'Toyota', 'Rava 4', NULL, '2024', 'GISUBIZO'),
('RAG123D', 'Toyota', 'Rava 4', NULL, '2024', 'GISUBIZO');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `paymentnumber` int(30) NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `amountPaid` int(11) DEFAULT NULL,
  `platenumber` varchar(40) DEFAULT NULL,
  `serviceCode` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `serviceCode` varchar(10) NOT NULL,
  `servicename` varchar(40) DEFAULT NULL,
  `servicePrice` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`serviceCode`, `servicename`, `servicePrice`) VALUES
('SRV-101', 'Wheel Alignment & Balancing', 80),
('SRV-102', 'Brake Pad Replacement', 185),
('SRV-103', 'Wheel Alignment & Balancing', 90),
('SRV-201', 'Full Engine Diagnostics', 120);

-- --------------------------------------------------------

--
-- Table structure for table `service_record`
--

CREATE TABLE `service_record` (
  `recordnumber` int(40) NOT NULL,
  `platenumber` varchar(40) DEFAULT NULL,
  `serviceCode` varchar(40) DEFAULT NULL,
  `service_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_record`
--

INSERT INTO `service_record` (`recordnumber`, `platenumber`, `serviceCode`, `service_date`) VALUES
(1, 'RAD123X', 'SRV-101', '2026-05-19 13:36:11'),
(2, 'RAD123X', 'SRV-101', '2026-05-19 13:38:49'),
(3, 'RAD123X', 'SRV-101', '2026-05-19 13:41:19'),
(4, 'RAD123X', 'SRV-101', '2026-05-19 14:35:09');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `username` varchar(40) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'customer'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `username`, `email`, `password`, `role`) VALUES
(3, 'crpms_user', 'crpms@gmail.com', '$2b$10$drNOHawFsTq5HqT8.jLRB.l0uRKr7SozHTft0zdS5th4n5To6jTdm', 'customer'),
(4, 'crpms_user2', 'crpms2@gmail.com', '$2b$10$vQLj8iiWuxbvBDrVTQKu6.5fvaX7jPEOuf9NEkhgc1I/iqclQdHKK', 'customer'),
(5, 'admin_user', 'admin@crpms.com', '$2b$10$drNOHawFsTq5HqT8.jLRB.l0uRKr7SozHTft0zdS5th4n5To6jTdm', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `car`
--
ALTER TABLE `car`
  ADD PRIMARY KEY (`platenumber`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`paymentnumber`),
  ADD KEY `platenumber` (`platenumber`),
  ADD KEY `serviceCode` (`serviceCode`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`serviceCode`);

--
-- Indexes for table `service_record`
--
ALTER TABLE `service_record`
  ADD PRIMARY KEY (`recordnumber`),
  ADD KEY `platenumber` (`platenumber`),
  ADD KEY `serviceCode` (`serviceCode`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `paymentnumber` int(30) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_record`
--
ALTER TABLE `service_record`
  MODIFY `recordnumber` int(40) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`platenumber`) REFERENCES `car` (`platenumber`),
  ADD CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`serviceCode`) REFERENCES `service` (`serviceCode`);

--
-- Constraints for table `service_record`
--
ALTER TABLE `service_record`
  ADD CONSTRAINT `service_record_ibfk_1` FOREIGN KEY (`platenumber`) REFERENCES `car` (`platenumber`),
  ADD CONSTRAINT `service_record_ibfk_2` FOREIGN KEY (`serviceCode`) REFERENCES `service` (`serviceCode`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
