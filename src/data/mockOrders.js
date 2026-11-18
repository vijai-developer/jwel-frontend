export const MOCK_ORDERS = [
  {
    id: "SJ-ORD-98421",
    date: "2026-09-02T14:30:00Z",
    customer: {
      name: "Priya Sundaram",
      phone: "+91 98765 43210",
      email: "priya.sundaram@gmail.com",
      address: "Flat 402, Royal Palms Apartments, T. Nagar, Chennai - 600017",
      pincode: "600017"
    },
    items: [
      {
        id: "sj-101",
        name: "Royal 24K Micro Plated Goddess Lakshmi Temple Haram",
        price: 3499,
        quantity: 1,
        image: "/images/temple_haram.png"
      },
      {
        id: "sj-103",
        name: "Matt Finish Peacock Micro Gold Jhumka Earrings",
        price: 1299,
        quantity: 1,
        image: "/images/gold_jhumka.png"
      }
    ],
    totalAmount: 4798,
    discountAmount: 479.8,
    finalAmount: 4318.2,
    paymentMethod: "UPI (GooglePay)",
    paymentId: "UPI/6984219803/SUCCESS",
    status: "Shipped",
    trackingNumber: "BD-9842104-IN",
    courier: "BlueDart Express",
    timeline: [
      { status: "Placed", time: "Sep 2, 2:30 PM", done: true },
      { status: "Quality Checked", time: "Sep 2, 4:15 PM", done: true },
      { status: "Packed", time: "Sep 2, 6:00 PM", done: true },
      { status: "Dispatched", time: "Sep 3, 9:00 AM", done: true },
      { status: "Out for Delivery", time: "Pending", done: false },
      { status: "Delivered", time: "Pending", done: false }
    ]
  },
  {
    id: "SJ-ORD-98418",
    date: "2026-09-01T11:20:00Z",
    customer: {
      name: "Ananya Sharma",
      phone: "+91 99887 76655",
      email: "ananya.sharma@yahoo.com",
      address: "Plot 88, Jubilee Hills, Road No. 36, Hyderabad - 500033",
      pincode: "500033"
    },
    items: [
      {
        id: "sj-105",
        name: "Imperial White Gold American Diamond CZ Choker Set",
        price: 3899,
        quantity: 1,
        image: "/images/cz_choker.png"
      }
    ],
    totalAmount: 3899,
    discountAmount: 0,
    finalAmount: 3899,
    paymentMethod: "Credit Card (HDFC Visa)",
    paymentId: "TXN_88418029",
    status: "Delivered",
    trackingNumber: "BD-9841801-IN",
    courier: "BlueDart Express",
    timeline: [
      { status: "Placed", time: "Sep 1, 11:20 AM", done: true },
      { status: "Quality Checked", time: "Sep 1, 1:00 PM", done: true },
      { status: "Packed", time: "Sep 1, 3:30 PM", done: true },
      { status: "Dispatched", time: "Sep 1, 6:00 PM", done: true },
      { status: "Out for Delivery", time: "Sep 2, 10:00 AM", done: true },
      { status: "Delivered", time: "Sep 2, 2:45 PM", done: true }
    ]
  },
  {
    id: "SJ-ORD-98405",
    date: "2026-09-03T10:00:00Z",
    customer: {
      name: "Meenakshi Iyer",
      phone: "+91 97112 33445",
      email: "meenakshi.iyer@hotmail.com",
      address: "12/B, Indiranagar 100ft Road, Bengaluru - 560038",
      pincode: "560038"
    },
    items: [
      {
        id: "sj-102",
        name: "Royal Kundan & Ruby Emerald Bridal Choker Set",
        price: 4299,
        quantity: 1,
        image: "/images/kundan_cz.png"
      }
    ],
    totalAmount: 4299,
    discountAmount: 500,
    finalAmount: 3799,
    paymentMethod: "Cash on Delivery",
    paymentId: "COD_VERIFIED_OTP",
    status: "Processing",
    trackingNumber: "Awaiting Dispatch",
    courier: "Delhivery Surface",
    timeline: [
      { status: "Placed", time: "Sep 3, 10:00 AM", done: true },
      { status: "Quality Checked", time: "Sep 3, 11:30 AM", done: true },
      { status: "Packed", time: "Pending", done: false },
      { status: "Dispatched", time: "Pending", done: false },
      { status: "Out for Delivery", time: "Pending", done: false },
      { status: "Delivered", time: "Pending", done: false }
    ]
  }
];
