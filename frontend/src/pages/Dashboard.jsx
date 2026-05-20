import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import Toast from '../components/Toast';
import api from '../utils/api';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [loading, setLoading] = useState(true);

  // Core Data Lists
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [records, setRecords] = useState([]);
  const [payments, setPayments] = useState([]);

  // Search filter
  const [carSearch, setCarSearch] = useState('');

  // Modals & Form states
  const [carModal, setCarModal] = useState({ show: false, mode: 'create' });
  const [carForm, setCarForm] = useState({
    platenumber: '',
    type: '',
    model: '',
    manufacturing_year: '',
    mechanicName: '',
    driverPhone: ''
  });

  const [serviceModal, setServiceModal] = useState({ show: false, mode: 'create' });
  const [serviceForm, setServiceForm] = useState({
    serviceCode: '',
    servicename: '',
    servicePrice: ''
  });

  const [recordModal, setRecordModal] = useState(false);
  const [recordForm, setRecordForm] = useState({
    platenumber: '',
    serviceCode: ''
  });

  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amountPaid: '',
    platenumber: '',
    serviceCode: ''
  });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [carsRes, servicesRes, recordsRes, paymentsRes] = await Promise.all([
        api.get('/cars'),
        api.get('/services'),
        api.get('/service-records'),
        api.get('/payments')
      ]);

      setCars(carsRes.data);
      setServices(servicesRes.data);
      setRecords(recordsRes.data);
      setPayments(paymentsRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      showToast('Failed to load dashboard data. Check database server.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAllData();
  }, [loadAllData]);

  // ---------------- CAR CRUD HANDLERS ----------------
  const handleCarSubmit = async (e) => {
    e.preventDefault();
    try {
      if (carModal.mode === 'create') {
        await api.post('/cars/create', {
          platenumber: carForm.platenumber,
          type: carForm.type,
          model: carForm.model,
          manufacturing_year: carForm.manufacturing_year,
          mechanicName: carForm.mechanicName
        });
        showToast('Car registered successfully');
      } else {
        await api.put(`/cars/${carForm.platenumber}`, {
          type: carForm.type,
          model: carForm.model,
          manufacturing_year: carForm.manufacturing_year,
          mechanicName: carForm.mechanicName,
          driverPhone: carForm.driverPhone || ''
        });
        showToast('Car details updated successfully');
      }
      setCarModal({ show: false, mode: 'create' });
      // Clear Form
      setCarForm({ platenumber: '', type: '', model: '', manufacturing_year: '', mechanicName: '', driverPhone: '' });
      loadAllData();
    } catch (err) {
      console.error('Car submit error:', err);
      showToast(err.response?.data?.message || 'Error saving vehicle details.', 'error');
    }
  };

  const openEditCar = (car) => {
    setCarForm({
      platenumber: car.platenumber,
      type: car.type || '',
      model: car.model || '',
      manufacturing_year: car.manufacturing_year || '',
      mechanicName: car.mechanicName || '',
      driverPhone: car.driverPhone || ''
    });
    setCarModal({ show: true, mode: 'edit' });
  };

  const handleCarDelete = async (platenumber) => {
    if (!window.confirm(`Are you sure you want to remove vehicle ${platenumber}?`)) return;
    try {
      await api.delete(`/cars/${platenumber}`);
      showToast('Vehicle deleted successfully');
      loadAllData();
    } catch (err) {
      console.error('Car delete error:', err);
      showToast(err.response?.data?.message || 'Unauthorized or failed to delete vehicle.', 'error');
    }
  };

  // ---------------- SERVICE CRUD HANDLERS ----------------
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (serviceModal.mode === 'create') {
        await api.post('/services/create', serviceForm);
        showToast('New service added successfully');
      } else {
        await api.put(`/services/${serviceForm.serviceCode}`, {
          servicename: serviceForm.servicename,
          servicePrice: serviceForm.servicePrice
        });
        showToast('Service catalog updated successfully');
      }
      setServiceModal({ show: false, mode: 'create' });
      setServiceForm({ serviceCode: '', servicename: '', servicePrice: '' });
      loadAllData();
    } catch (err) {
      console.error('Service submit error:', err);
      showToast(err.response?.data?.message || 'Failed to update service catalog.', 'error');
    }
  };

  const openEditService = (srv) => {
    setServiceForm({
      serviceCode: srv.serviceCode,
      servicename: srv.servicename || '',
      servicePrice: srv.servicePrice || ''
    });
    setServiceModal({ show: true, mode: 'edit' });
  };

  const handleServiceDelete = async (code) => {
    if (!window.confirm(`Are you sure you want to remove service ${code}?`)) return;
    try {
      await api.delete(`/services/${code}`);
      showToast('Service deleted successfully');
      loadAllData();
    } catch (err) {
      console.error('Service delete error:', err);
      showToast(err.response?.data?.message || 'Only Admin users can delete service catalog.', 'error');
    }
  };

  // ---------------- SERVICE RECORD HANDLERS ----------------
  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    if (!recordForm.platenumber || !recordForm.serviceCode) {
      showToast('Please select both a car and a service.', 'warning');
      return;
    }
    try {
      await api.post('/service-records/create', recordForm);
      showToast('Service record logged successfully');
      setRecordModal(false);
      setRecordForm({ platenumber: '', serviceCode: '' });
      loadAllData();
    } catch (err) {
      console.error('Record log error:', err);
      showToast(err.response?.data?.message || 'Failed to create service record.', 'error');
    }
  };

  const handleRecordDelete = async (id) => {
    if (!window.confirm('Delete this service record?')) return;
    try {
      await api.delete(`/service-records/${id}`);
      showToast('Service record deleted');
      loadAllData();
    } catch (err) {
      console.error('Record delete error:', err);
      showToast(err.response?.data?.message || 'Only Admin users can delete service records.', 'error');
    }
  };

  // ---------------- PAYMENT HANDLERS ----------------
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.amountPaid || !paymentForm.platenumber || !paymentForm.serviceCode) {
      showToast('All payment fields are required.', 'warning');
      return;
    }
    try {
      await api.post('/payments/create', {
        amountPaid: parseInt(paymentForm.amountPaid),
        platenumber: paymentForm.platenumber,
        serviceCode: paymentForm.serviceCode
      });
      showToast('Payment receipt recorded successfully');
      setPaymentModal(false);
      setPaymentForm({ amountPaid: '', platenumber: '', serviceCode: '' });
      loadAllData();
    } catch (err) {
      console.error('Payment error:', err);
      showToast(err.response?.data?.message || 'Failed to register payment receipt.', 'error');
    }
  };

  const handlePaymentDelete = async (id) => {
    if (!window.confirm('Void this payment receipt?')) return;
    try {
      await api.delete(`/payments/${id}`);
      showToast('Payment voided and deleted');
      loadAllData();
    } catch (err) {
      console.error('Payment void error:', err);
      showToast(err.response?.data?.message || 'Only Admin users can delete payment files.', 'error');
    }
  };

  // Filter cars based on search query
  const filteredCars = cars.filter(car => 
    car.platenumber?.toLowerCase().includes(carSearch.toLowerCase()) ||
    car.model?.toLowerCase().includes(carSearch.toLowerCase()) ||
    car.type?.toLowerCase().includes(carSearch.toLowerCase()) ||
    car.mechanicName?.toLowerCase().includes(carSearch.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#090d16] text-[#f1f5f9] font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="border-b border-slate-900 bg-[#0c1220]/60 backdrop-blur-md px-8 py-5 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white capitalize">
              {activeTab === 'overview' ? 'Dashboard Overview' : `${activeTab} Management`}
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">
              Current local session: {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={loadAllData} 
              className="p-2 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/80 text-slate-400 hover:text-white transition-all"
              title="Refresh Dashboard Tables"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 19l-2.47-2.47" />
              </svg>
            </button>
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-300">Live API Gate Connected</span>
            </div>
          </div>
        </header>

        {/* Dashboard Workspace View switcher */}
        <main className="p-8 flex-1 overflow-y-auto max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
              <svg className="animate-spin h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-slate-400 font-semibold animate-pulse">Synchronizing database tables...</p>
            </div>
          ) : (
            <div className="animate-fade-in">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'cars' && renderCars()}
              {activeTab === 'services' && renderServices()}
              {activeTab === 'records' && renderRecords()}
              {activeTab === 'payments' && renderPayments()}
            </div>
          )}
        </main>
      </div>

      {/* Dynamic Notifications */}
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      {/* ---------------- MODALS CODE ---------------- */}
      {carModal.show && renderCarModal()}
      {serviceModal.show && renderServiceModal()}
      {recordModal && renderRecordModal()}
      {paymentModal && renderPaymentModal()}
    </div>
  );

  // ==================== WORKSPACE TAB VIEWS ====================

  // Tab 1: Overview Dashboard
  function renderOverview() {
    // Math aggregators
    const totalCars = cars.length;
    const totalServices = services.length;
    const totalRecords = records.length;
    const totalRevenue = payments.reduce((acc, p) => acc + (p.amountPaid || 0), 0);

    return (
      <div className="space-y-8 text-left">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fleet Registered</p>
              <h3 className="text-2xl font-black mt-1 text-white">{totalCars} Vehicles</h3>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Services Cataloged</p>
              <h3 className="text-2xl font-black mt-1 text-white">{totalServices} Standard Jobs</h3>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Service Jobs Completed</p>
              <h3 className="text-2xl font-black mt-1 text-white">{totalRecords} Completed</h3>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Revenue Collected</p>
              <h3 className="text-2xl font-black mt-1 text-white">${totalRevenue.toLocaleString()} Paid</h3>
            </div>
          </div>
        </div>

        {/* Quick Operations panel */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold mb-4 text-white">Quick System Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => {
                setCarForm({ platenumber: '', type: '', model: '', manufacturing_year: '', mechanicName: '', driverPhone: '' });
                setCarModal({ show: true, mode: 'create' });
              }}
              className="px-5 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-sm flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Register New Car
            </button>

            <button
              onClick={() => {
                setRecordForm({ platenumber: '', serviceCode: '' });
                setRecordModal(true);
              }}
              className="px-5 py-3 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 text-white text-sm flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Log Service Job
            </button>

            <button
              onClick={() => {
                setPaymentForm({ amountPaid: '', platenumber: '', serviceCode: '' });
                setPaymentModal(true);
              }}
              className="px-5 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white text-sm flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Record Payment Receipt
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => {
                  setServiceForm({ serviceCode: '', servicename: '', servicePrice: '' });
                  setServiceModal({ show: true, mode: 'create' });
                }}
                className="px-5 py-3 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]"
              >
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Create Service Catalog
              </button>
            )}
          </div>
        </div>

        {/* Dashboard split grid for recent updates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Cars table */}
          <div className="glass-card rounded-2xl p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-white">Recent Fleet Additions</h3>
              <button onClick={() => setActiveTab('cars')} className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs transition-all hover:underline">
                View All Cars
              </button>
            </div>
            {cars.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No vehicles registered yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-slate-400 font-semibold">
                      <th className="pb-3 text-xs uppercase tracking-wider">Plate</th>
                      <th className="pb-3 text-xs uppercase tracking-wider">Vehicle</th>
                      <th className="pb-3 text-xs uppercase tracking-wider">Mechanic Assigned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cars.slice(-4).reverse().map((car) => (
                      <tr key={car.platenumber} className="border-b border-slate-900/60 hover:bg-slate-900/10 text-slate-300">
                        <td className="py-3.5 font-mono text-xs font-bold text-indigo-300 uppercase">{car.platenumber}</td>
                        <td className="py-3.5">
                          <div>
                            <p className="font-bold text-slate-200">{car.type}</p>
                            <p className="text-xs text-slate-500">{car.model} ({car.manufacturing_year})</p>
                          </div>
                        </td>
                        <td className="py-3.5 text-xs font-semibold text-slate-400 capitalize">{car.mechanicName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Payments table */}
          <div className="glass-card rounded-2xl p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-white">Recent Payments Log</h3>
              <button onClick={() => setActiveTab('payments')} className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs transition-all hover:underline">
                View Payments
              </button>
            </div>
            {payments.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">No payment entries registered.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800/80 text-slate-400 font-semibold">
                      <th className="pb-3 text-xs uppercase tracking-wider">Receipt No</th>
                      <th className="pb-3 text-xs uppercase tracking-wider">Plate</th>
                      <th className="pb-3 text-xs uppercase tracking-wider">Service</th>
                      <th className="pb-3 text-xs uppercase tracking-wider">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(-4).reverse().map((pay) => (
                      <tr key={pay.paymentnumber} className="border-b border-slate-900/60 hover:bg-slate-900/10 text-slate-300">
                        <td className="py-3.5 font-mono text-xs font-bold text-slate-500">#{pay.paymentnumber}</td>
                        <td className="py-3.5 font-mono text-xs text-slate-300 uppercase">{pay.platenumber}</td>
                        <td className="py-3.5 truncate max-w-[120px] text-xs text-slate-400" title={pay.servicename}>{pay.servicename}</td>
                        <td className="py-3.5 font-extrabold text-emerald-400">${pay.amountPaid}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Tab 2: Cars Management View
  function renderCars() {
    return (
      <div className="space-y-6 text-left">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by plate number, model, brand, or mechanic..."
              value={carSearch}
              onChange={(e) => setCarSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-sm"
            />
          </div>

          {/* Add button */}
          <button
            onClick={() => {
              setCarForm({ platenumber: '', type: '', model: '', manufacturing_year: '', mechanicName: '', driverPhone: '' });
              setCarModal({ show: true, mode: 'create' });
            }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 shrink-0 hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Register Vehicle
          </button>
        </div>

        {/* Cars Fleet Table Grid */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {filteredCars.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold text-slate-400">No matching vehicles found</p>
              <p className="text-xs text-slate-600 mt-1">Try refining your search filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-950/20 text-slate-400 font-semibold">
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Plate Number</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Brand & Model</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Mfg Year</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Mechanic Assigned</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Driver Contact</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => (
                    <tr key={car.platenumber} className="border-b border-slate-900/60 hover:bg-slate-900/10 text-slate-300 transition-colors">
                      <td className="px-6 py-4 font-mono font-extrabold text-indigo-300 uppercase tracking-wide">{car.platenumber}</td>
                      <td className="px-6 py-4 font-bold text-slate-200">
                        {car.type} <span className="font-normal text-slate-400 ml-1">{car.model}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs font-mono">{car.manufacturing_year || 'N/A'}</td>
                      <td className="px-6 py-4 font-semibold text-slate-300 capitalize">{car.mechanicName}</td>
                      <td className="px-6 py-4 font-mono text-slate-400 text-xs">{car.driverPhone || 'Not logged'}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => openEditCar(car)}
                            className="p-2 rounded-lg bg-slate-900/50 hover:bg-indigo-500/10 border border-slate-800 hover:border-indigo-500/25 text-slate-400 hover:text-indigo-400 transition-all"
                            title="Edit Vehicle Details"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          
                          {user.role === 'admin' ? (
                            <button
                              onClick={() => handleCarDelete(car.platenumber)}
                              className="p-2 rounded-lg bg-slate-900/50 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/25 text-slate-400 hover:text-rose-400 transition-all"
                              title="Delete Vehicle"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          ) : (
                            <span className="p-2 text-slate-600 cursor-not-allowed" title="Admin access only">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tab 3: Services Catalog View
  function renderServices() {
    return (
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">System Service Catalog</h2>
          {user.role === 'admin' && (
            <button
              onClick={() => {
                setServiceForm({ serviceCode: '', servicename: '', servicePrice: '' });
                setServiceModal({ show: true, mode: 'create' });
              }}
              className="px-5 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-sm flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Service Class
            </button>
          )}
        </div>

        {/* Services Cards Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div key={srv.serviceCode} className="glass-card p-6 rounded-2xl flex flex-col justify-between glass-card-hover relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-xs font-bold text-indigo-400 uppercase bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                    {srv.serviceCode}
                  </span>
                  
                  {user.role === 'admin' && (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openEditService(srv)}
                        className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-slate-400 hover:text-indigo-400 transition-colors"
                        title="Edit Catalog Spec"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleServiceDelete(srv.serviceCode)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete Service Class"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 max-w-[85%]">{srv.servicename}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  This standard job catalog code is used to log repairs, run invoice balances, and bind diagnostics.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-semibold uppercase">Pricing standard</span>
                <span className="text-2xl font-black text-emerald-400">${srv.servicePrice}</span>
              </div>
            </div>
          ))}
          
          {services.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500 glass-card rounded-2xl">
              <p className="font-semibold text-slate-400">Service catalog is empty</p>
              <p className="text-xs text-slate-600 mt-1">Please register new service classes.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tab 4: Service Records View
  function renderRecords() {
    return (
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Maintenance Log Sheets</h2>
          <button
            onClick={() => {
              setRecordForm({ platenumber: '', serviceCode: '' });
              setRecordModal(true);
            }}
            className="px-5 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-sm flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Service Record
          </button>
        </div>

        {/* Service Records Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {records.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="font-semibold text-slate-400">No service records registered</p>
              <p className="text-xs text-slate-600 mt-1">Click above to log service records for registered cars.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-950/20 text-slate-400 font-semibold">
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Record ID</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Plate Number</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Vehicle Profile</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Service Task</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Service Date</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Price Base</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec.recordnumber} className="border-b border-slate-900/60 hover:bg-slate-900/10 text-slate-300 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">#{rec.recordnumber}</td>
                      <td className="px-6 py-4 font-mono font-bold text-indigo-300 uppercase">{rec.platenumber}</td>
                      <td className="px-6 py-4 font-bold text-slate-200">
                        {rec.type} <span className="font-normal text-slate-400 ml-1">{rec.model}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-200 font-semibold truncate max-w-[200px]" title={rec.servicename}>{rec.servicename}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(rec.service_date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-extrabold text-emerald-400">${rec.servicePrice || 0}</td>
                      <td className="px-6 py-4 text-right">
                        {user.role === 'admin' ? (
                          <button
                            onClick={() => handleRecordDelete(rec.recordnumber)}
                            className="p-2 rounded-lg bg-slate-900/50 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/25 text-slate-400 hover:text-rose-400 transition-all"
                            title="Void Service Record"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        ) : (
                          <span className="text-slate-600 text-xs font-semibold px-2 py-1 bg-slate-900/20 border border-slate-800/80 rounded-md">
                            Read Only
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tab 5: Payments Log View
  function renderPayments() {
    return (
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">System Billing Logs</h2>
          <button
            onClick={() => {
              setPaymentForm({ amountPaid: '', platenumber: '', serviceCode: '' });
              setPaymentModal(true);
            }}
            className="px-5 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-sm flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Record Payment Receipt
          </button>
        </div>

        {/* Payments Table */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {payments.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="font-semibold text-slate-400">No payment receipts found</p>
              <p className="text-xs text-slate-600 mt-1">Receipt entries will pop up here once registered.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-950/20 text-slate-400 font-semibold">
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Receipt No</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Payment Date</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Plate Number</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Service Task Bind</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Catalog Price</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider">Amount Paid</th>
                    <th className="px-6 py-4 text-xs uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((pay) => (
                    <tr key={pay.paymentnumber} className="border-b border-slate-900/60 hover:bg-slate-900/10 text-slate-300 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">#{pay.paymentnumber}</td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {new Date(pay.payment_date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-indigo-300 uppercase">{pay.platenumber}</td>
                      <td className="px-6 py-4 font-semibold text-slate-300 truncate max-w-[200px]" title={pay.servicename}>{pay.servicename}</td>
                      <td className="px-6 py-4 font-semibold text-slate-500">${pay.servicePrice || 0}</td>
                      <td className="px-6 py-4 font-extrabold text-emerald-400">${pay.amountPaid}</td>
                      <td className="px-6 py-4 text-right">
                        {user.role === 'admin' ? (
                          <button
                            onClick={() => handlePaymentDelete(pay.paymentnumber)}
                            className="p-2 rounded-lg bg-slate-900/50 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/25 text-slate-400 hover:text-rose-400 transition-all"
                            title="Void Payment Receipt"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        ) : (
                          <span className="text-slate-600 text-xs font-semibold px-2 py-1 bg-slate-900/20 border border-slate-800/80 rounded-md">
                            Read Only
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==================== SYSTEM INTERACTIVE MODALS ====================

  // Modal 1: Car Add/Edit Modal
  function renderCarModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-lg glass-card rounded-2xl p-6 text-left relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">
              {carModal.mode === 'create' ? 'Register New Vehicle' : 'Modify Vehicle Specs'}
            </h3>
            <button
              onClick={() => setCarModal({ show: false, mode: 'create' })}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleCarSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Plate Number</label>
                <input
                  type="text"
                  placeholder="e.g. RAD123X"
                  value={carForm.platenumber}
                  onChange={(e) => setCarForm({ ...carForm, platenumber: e.target.value })}
                  disabled={carModal.mode === 'edit'}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Manufacture Year</label>
                <input
                  type="text"
                  placeholder="e.g. 2024"
                  maxLength={4}
                  value={carForm.manufacturing_year}
                  onChange={(e) => setCarForm({ ...carForm, manufacturing_year: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Brand / Make</label>
                <input
                  type="text"
                  placeholder="e.g. Toyota"
                  value={carForm.type}
                  onChange={(e) => setCarForm({ ...carForm, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Model Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rav4"
                  value={carForm.model}
                  onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Mechanic Assigned</label>
              <input
                type="text"
                placeholder="e.g. KARISA"
                value={carForm.mechanicName}
                onChange={(e) => setCarForm({ ...carForm, mechanicName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm capitalize"
                required
              />
            </div>

            {carModal.mode === 'edit' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Driver Contact Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +2507888..."
                  value={carForm.driverPhone}
                  onChange={(e) => setCarForm({ ...carForm, driverPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-sm shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 mt-4"
            >
              {carModal.mode === 'create' ? 'Register Car Profile' : 'Save Modifications'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Modal 2: Service Class Modal (Add/Edit)
  function renderServiceModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-md glass-card rounded-2xl p-6 text-left relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">
              {serviceModal.mode === 'create' ? 'Add Service Class' : 'Edit Service details'}
            </h3>
            <button
              onClick={() => setServiceModal({ show: false, mode: 'create' })}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleServiceSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Service Code</label>
              <input
                type="text"
                placeholder="e.g. SRV-105"
                value={serviceForm.serviceCode}
                onChange={(e) => setServiceForm({ ...serviceForm, serviceCode: e.target.value })}
                disabled={serviceModal.mode === 'edit'}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Service Task Name</label>
              <input
                type="text"
                placeholder="e.g. Engine Tune Up & Filter change"
                value={serviceForm.servicename}
                onChange={(e) => setServiceForm({ ...serviceForm, servicename: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Pricing Standard ($)</label>
              <input
                type="number"
                placeholder="e.g. 150"
                min="1"
                value={serviceForm.servicePrice}
                onChange={(e) => setServiceForm({ ...serviceForm, servicePrice: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-sm shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 mt-4"
            >
              {serviceModal.mode === 'create' ? 'Publish Service Class' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Modal 3: Create Service Record Modal
  function renderRecordModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-md glass-card rounded-2xl p-6 text-left relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Log Vehicle Service Job</h3>
            <button
              onClick={() => setRecordModal(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleRecordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Vehicle (Plate)</label>
              <select
                value={recordForm.platenumber}
                onChange={(e) => setRecordForm({ ...recordForm, platenumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                required
              >
                <option value="" className="bg-[#0c1220]">-- Choose registered car --</option>
                {cars.map(car => (
                  <option key={car.platenumber} value={car.platenumber} className="bg-[#0c1220]">
                    {car.platenumber} - {car.type} {car.model} ({car.mechanicName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Service Class</label>
              <select
                value={recordForm.serviceCode}
                onChange={(e) => setRecordForm({ ...recordForm, serviceCode: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                required
              >
                <option value="" className="bg-[#0c1220]">-- Choose catalog service --</option>
                {services.map(srv => (
                  <option key={srv.serviceCode} value={srv.serviceCode} className="bg-[#0c1220]">
                    {srv.serviceCode} - {srv.servicename} (${srv.servicePrice})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-sm shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 mt-4"
            >
              Commit Maintenance Log
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Modal 4: Create Payment Modal
  function renderPaymentModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-md glass-card rounded-2xl p-6 text-left relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Record Invoice Payment</h3>
            <button
              onClick={() => setPaymentModal(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Vehicle (Plate)</label>
              <select
                value={paymentForm.platenumber}
                onChange={(e) => setPaymentForm({ ...paymentForm, platenumber: e.target.value })}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                required
              >
                <option value="" className="bg-[#0c1220]">-- Choose registered car --</option>
                {cars.map(car => (
                  <option key={car.platenumber} value={car.platenumber} className="bg-[#0c1220]">
                    {car.platenumber} - {car.type} {car.model}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Select Service Class</label>
              <select
                value={paymentForm.serviceCode}
                onChange={(e) => {
                  const srv = services.find(s => s.serviceCode === e.target.value);
                  setPaymentForm({
                    ...paymentForm,
                    serviceCode: e.target.value,
                    amountPaid: srv ? srv.servicePrice.toString() : ''
                  });
                }}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm"
                required
              >
                <option value="" className="bg-[#0c1220]">-- Choose catalog service --</option>
                {services.map(srv => (
                  <option key={srv.serviceCode} value={srv.serviceCode} className="bg-[#0c1220]">
                    {srv.serviceCode} - {srv.servicename} (${srv.servicePrice})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Amount Paid ($)</label>
              <input
                type="number"
                placeholder="e.g. 150"
                min="1"
                value={paymentForm.amountPaid}
                onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-sm shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.98] transition-all duration-200 mt-4"
            >
              Record Payment Receipt
            </button>
          </form>
        </div>
      </div>
    );
  }
}
