import React from 'react';
import { useShop, useCart } from '../context/CartContext';
import { X, Printer, ShieldCheck, CheckCircle, Crown, Download } from 'lucide-react';

export const InvoiceModal = () => {
  const { selectedOrderForInvoice, setSelectedOrderForInvoice } = useShop();

  if (!selectedOrderForInvoice) return null;

  const order = selectedOrderForInvoice;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-[#FAF6F0] text-[#1F040A] rounded-2xl sm:rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative p-4 sm:p-8 border-2 border-[#D4AF37] max-h-[92vh] overflow-y-auto print:shadow-none print:border-none print:w-full print:max-w-none print:rounded-none">
        
        {/* Actions bar (hidden in print mode) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b border-[#D4AF37]/30 print:hidden">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CheckCircle className="w-5 h-5" />
            <span>Order Placed Successfully!</span>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
            <button
              onClick={handlePrint}
              className="bg-[#1F040A] text-[#D4AF37] border border-[#D4AF37] px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#D4AF37] hover:text-[#1F040A] transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download Tax Receipt</span>
            </button>

            <button
              onClick={() => setSelectedOrderForInvoice(null)}
              className="p-1.5 text-gray-500 hover:text-black cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Content */}
        <div className="space-y-6">
          
          {/* Header & Logo */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="w-7 h-7 text-[#D4AF37]" />
                <span className="text-2xl font-bold font-royal text-[#1F040A] tracking-wide">
                  SUSHMA JEWELS
                </span>
              </div>
              <p className="text-[10px] text-gray-600 tracking-widest uppercase font-semibold mt-0.5">
                Authentic Covering & Micro Gold Plated Jewellery
              </p>
              <p className="text-[11px] text-gray-500 mt-1 max-w-xs">
                #45 Royal Silk Market Street, T. Nagar, Chennai - 600017 | GSTIN: 33AAAAA0000A1Z5
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="bg-[#D4AF37]/20 text-[#996515] font-bold px-3 py-1 rounded-full text-xs inline-block">
                TAX INVOICE & GUARANTEE CARD
              </span>
              <p className="font-mono font-bold mt-2 text-sm text-[#1F040A]">Invoice #: {order.orderCode || order.id}</p>
              <p className="text-gray-500 text-[11px]">Date: {new Date(order.orderDate || order.date || Date.now()).toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-4 bg-[#F0E6D8] p-4 rounded-xl text-xs border border-[#D4AF37]/30">
            <div>
              <strong className="text-[#996515] block uppercase font-bold text-[10px] tracking-wider mb-1">Billed & Shipped To:</strong>
              <p className="font-bold text-[#1F040A]">{order.customer?.name || order.customerName || 'Valued Customer'}</p>
              <p className="text-gray-700">{order.customer?.address || order.shippingAddress || `${order.city || ''} ${order.state || ''} ${order.pincode || ''}`.trim() || 'Address On File'}</p>
              <p className="text-gray-700">Phone: {order.customer?.phone || order.customerPhone || 'On File'}</p>
            </div>

            <div>
              <strong className="text-[#996515] block uppercase font-bold text-[10px] tracking-wider mb-1">Order Logistics & Payment:</strong>
              <p className="text-gray-700">Payment Mode: <strong>{order.paymentMethod || 'Cash on Delivery (COD)'}</strong></p>
              <p className="text-gray-700">Transaction Ref: <code>{order.paymentId || 'N/A'}</code></p>
              <p className="text-gray-700">Courier Partner: <strong>{order.courier || 'BlueDart Express'}</strong></p>
              <p className="text-gray-700">Waybill AWB: <strong>{order.trackingNumber || `BD-${order.id}-IN`}</strong></p>
            </div>
          </div>

          {/* Items Table */}
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-[#1F040A] text-[#D4AF37]">
                <th className="p-2.5 text-left font-semibold rounded-l-lg">Item Description</th>
                <th className="p-2.5 text-center font-semibold">Qty</th>
                <th className="p-2.5 text-right font-semibold">Unit Price</th>
                <th className="p-2.5 text-right font-semibold rounded-r-lg">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/20 text-gray-800">
              {(order.items || []).map((item, idx) => {
                const itemName = item.name || item.productName || 'Jewellery Piece';
                const itemQty = Number(item.quantity) || 1;
                const itemPrice = Number(item.price) || 0;
                return (
                  <tr key={idx}>
                    <td className="py-3 px-2">
                      <p className="font-bold text-[#1F040A]">{itemName}</p>
                      <span className="text-[10px] text-[#996515]">✨ {item.platingGuarantee || '1-Year 24K Micro Gold Guarantee'}</span>
                    </td>
                    <td className="py-3 px-2 text-center">{itemQty}</td>
                    <td className="py-3 px-2 text-right">₹{itemPrice.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-2 text-right font-bold">₹{(itemPrice * itemQty).toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Totals Breakdown */}
          <div className="flex justify-between items-end border-t border-[#D4AF37]/30 pt-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs flex items-center gap-2 max-w-sm">
              <ShieldCheck className="w-6 h-6 text-[#D4AF37] flex-shrink-0" />
              <p className="text-[11px] text-amber-900 leading-tight">
                <strong>1-Year Stamped Micro Gold Plating Guarantee:</strong> Free re-polishing cover valid till {new Date(Date.now() + 365*24*60*60*1000).toLocaleDateString('en-IN')}.
              </p>
            </div>

            <div className="text-right text-xs space-y-1 w-48">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>₹{(Number(order.totalAmount) || 0).toLocaleString('en-IN')}</span>
              </div>
              {Number(order.discountAmount) > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount:</span>
                  <span>- ₹{Number(order.discountAmount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>GST (3% Included):</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1F040A] pt-2 border-t border-gray-300">
                <span>Total Paid:</span>
                <span className="text-[#996515]">₹{(Number(order.finalAmount) || Number(order.totalAmount) || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center text-[10px] text-gray-500 pt-4 border-t border-gray-200">
            Thank you for shopping at Sushma Jewels! For any assistance or re-plating inquiries, WhatsApp us at +91 98400 12345.
          </div>

        </div>
      </div>
    </div>
  );
};
