import React, { useEffect, useState } from 'react';
import { Crown, PhoneCall, Mail, MapPin, MessageCircle } from 'lucide-react';
import customerService from '../../services/customerService';

export const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  console.log('CUSTOMERS PAGE MOUNTED');

  useEffect(() => {
    const loadCustomers = async () => {
      console.log('LOADING CUSTOMERS FROM API');
      try {
        setLoading(true);
        setError('');

        const data = await customerService.getCustomers();

        setCustomers(data);
        console.log('CUSTOMERS STATE DATA:', data);
      } catch (err) {
        console.error('Failed to load customers:', err);
        setError('Failed to load customers.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  return (
    <div className="space-y-6 text-[#2C2E2B]">

      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-[#E8DFD1]">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-[#C5A059]" />

            <h1 className="text-2xl font-bold font-royal gold-text-gradient">
              Customer Directory & VIP Leads
            </h1>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            Directory of Sushma Jewels buyers, lifetime purchase values, and re-plating records.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading customers...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="text-center py-10 text-red-500">
          {error}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && customers.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No customers found.
        </div>
      )}

      {/* Customers */}
      {console.log('RENDER CHECK:', {
        loading,
        error,
        customers
      })}
      {!loading && !error && customers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">

          {customers.map((c) => (

            <div
              key={c.id}
              className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#E8DFD1] space-y-4 shadow-xs"
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-full bg-[#FAF0E4] border border-[#C5A059]/40 flex items-center justify-center font-bold text-[#8C6D31]">
                    {c.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>

                  <div>
                    <h3 className="font-bold text-[#2C2E2B] text-sm">
                      {c.name}
                    </h3>

                    <span className="text-[10px] text-[#8C6D31] font-bold">
                      VIP Club Member
                    </span>
                  </div>

                </div>

                <span className="text-xs bg-[#FAF6F0] px-2.5 py-1 rounded-full border border-[#E8DFD1] text-[#8C6D31] font-bold">
                  {c.totalOrders || 0} Orders
                </span>

              </div>

              <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-[#E8DFD1]">

                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{c.phone || 'Not provided'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="truncate">
                    {c.email}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">
                    {c.address || 'Address not provided'}
                  </span>
                </div>

              </div>

              <div className="pt-3 border-t border-[#E8DFD1] flex items-center justify-between">

                <div>
                  <span className="text-[10px] text-gray-400 block">
                    Lifetime Spending:
                  </span>

                  <span className="text-base font-extrabold text-[#8C6D31]">
                    ₹{Number(c.totalSpent || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                {c.phone && (
                  <a
                    href={`https://wa.me/91${c.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="gold-outline-button px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#C5A059]" />

                    <span>WhatsApp</span>
                  </a>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
};

export default Customers;