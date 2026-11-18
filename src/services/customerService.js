import API from './api';

const DEFAULT_CUSTOMERS = [
    {
        id: 1,
        name: 'Radhika Sharma',
        email: 'radhika.sharma@example.com',
        phone: '+91 98765 43210',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        totalOrders: 3,
        totalSpent: 18499
    },
    {
        id: 2,
        name: 'Ananya Reddy',
        email: 'ananya.reddy@example.com',
        phone: '+91 91234 56789',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500034',
        totalOrders: 2,
        totalSpent: 12299
    },
    {
        id: 3,
        name: 'Priyanka Desai',
        email: 'priyanka.desai@example.com',
        phone: '+91 99887 76655',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380015',
        totalOrders: 4,
        totalSpent: 26800
    }
];

export const customerService = {
    getCustomers: async () => {
        try {
            const response = await API.get('/customers');
            if (Array.isArray(response.data) && response.data.length > 0) {
                return response.data;
            }
            return DEFAULT_CUSTOMERS;
        } catch (err) {
            console.warn('Customer API unavailable, using fallback client directory:', err.message);
            return DEFAULT_CUSTOMERS;
        }
    },

    getCustomerById: async (id) => {
        const response = await API.get(`/customers/${id}`);
        return response.data;
    },

    createCustomer: async (customerData) => {
        const response = await API.post('/customers', customerData);
        return response.data;
    },

    updateCustomer: async (id, customerData) => {
        const response = await API.put(`/customers/${id}`, customerData);
        return response.data;
    },

    deleteCustomer: async (id) => {
        await API.delete(`/customers/${id}`);
        return { success: true, id };
    }
};

export default customerService;