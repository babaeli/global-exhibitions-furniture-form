# Global Exhibitions Inc. - Extra Furniture Order Form

A modern, responsive online order form for Global Exhibitions Inc.'s furniture rental catalog for exhibitions and events.

## Features

### 📋 Complete Catalog
- **50+ furniture items** including chairs, tables, sofas, bar stools
- **Electronics** - TVs, fridges, water dispensers, coffee makers
- **Services** - hostess services, booth cleaning
- **Decorations** - potted plants, fresh flowers, carpeting
- **Electrical services** - power supplies, distribution boards, lighting

### 💰 Automatic Calculations
- Real-time subtotal calculations per item
- Automatic total calculation
- 50% late order surcharge (when applicable)
- Visual feedback for selected items

### ✅ Form Validation
- Required fields validation
- Email format validation
- Date restrictions (no past dates)
- Minimum of one item required

### 📱 Responsive Design
- Works perfectly on desktop, tablet, and mobile devices
- Print-friendly layout
- Modern gradient interface
- Smooth animations and transitions

### 📄 Order Summary
- Detailed order confirmation screen
- Downloadable order summary (.txt file)
- Complete order details including:
  - Company information
  - Selected items with quantities
  - Delivery information
  - Payment details
  - Bank transfer information

## How to Use

### For Users:

1. **Open the Form**
   - Double-click `index.html` to open in your web browser
   - Or drag and drop the file into any browser

2. **Fill Company Information**
   - Enter company name, contact person, email, and phone
   - Optionally provide booth/stand number

3. **Select Furniture Items**
   - Browse through the catalog tables
   - Enter quantities for items you need
   - Watch subtotals update automatically

4. **Select Electrical Services** (if needed)
   - Choose power supplies and electrical equipment
   - Enter quantities as needed

5. **Delivery Information**
   - Select preferred delivery date
   - Choose time slot (9AM - 5PM)
   - Add any special instructions

6. **Late Order Option**
   - Check the box if ordering within 7 days of event
   - 50% surcharge will be automatically applied

7. **Payment Method**
   - Choose: Bank Transfer, Credit Card, or Cash on Arrival
   - Bank details are displayed for reference

8. **Review & Submit**
   - Check the order summary at the bottom
   - Review terms and conditions
   - Click "Submit Order"

9. **Download Confirmation**
   - After submission, download your order summary
   - Keep for your records

### For Developers:

**File Structure:**
```
├── index.html    # Main HTML structure
├── styles.css    # All styling and responsive design
├── script.js     # Form logic and calculations
└── README.md     # This file
```

**Technologies Used:**
- Pure HTML5
- CSS3 with Flexbox and Grid
- Vanilla JavaScript (no dependencies)

**Customization:**
- Modify prices in HTML `data-price` attributes
- Add/remove items by editing table rows
- Adjust colors in CSS gradient definitions
- Customize email/server integration in `script.js`

## Key Features Explained

### Automatic Calculations
The form automatically calculates:
- Individual item subtotals (price × quantity)
- Order subtotal (all items)
- Late fee (50% if applicable)
- Final total

### Late Order Surcharge
- Applies 50% surcharge when checkbox is selected
- Clearly displays in order summary
- Noted in downloaded order confirmation

### Visual Feedback
- Selected rows highlight in light blue
- Hover effects on all interactive elements
- Real-time updates as you type

### Print Functionality
- Click "Print Order Form" to print
- Optimized print layout
- Removes unnecessary elements for printing

### Data Collection
Order data includes:
- Company and contact information
- All selected items with quantities
- Delivery preferences
- Payment method
- Timestamp

## Browser Compatibility

✅ Chrome (recommended)
✅ Firefox
✅ Safari
✅ Edge
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Pricing (2026)

All prices in USD, inclusive of taxes:

**Furniture:** $30 - $360 per item
**Electronics:** $135 - $900 per event
**Services:** $200 - $240 per event
**Electrical:** $36 - $343 per service

## Important Terms

- Orders confirmed upon full payment
- Late requests subject to 20% surcharge
- Orders within 7 days: 50% surcharge
- Exhibitors responsible for furniture condition
- Damaged items charged at replacement cost
- Complete form 15 days before event

## Contact Information

**Global Exhibitions Inc.**
- Address: Cardinal Otunga Plaza – Annex, P.O. Box 53920 – 00200
- Email: info@globalexhibitions.africa
- Phone: +254 794 007 810

## Bank Details

**GLOBAL EXHIBITIONS INCORPORATED LIMITED**
- Bank: STANBIC BANK
- Branch: INTERNATIONAL LIFE HOUSE
- Account (USD): 0100003753594
- Account (KES): 0100003753586
- SWIFT Code: SBICKENX
- Bank Code: 31
- Branch Code: 008

## Future Enhancements

Potential additions:
- Backend integration for email notifications
- Database storage for orders
- Admin dashboard for order management
- Image gallery for furniture items
- Multi-language support
- Auto-save draft feature
- Payment gateway integration

## License

© 2026 Global Exhibitions Inc. All rights reserved.

## Support

For technical issues or questions about the form, contact the development team.
For order inquiries, contact Global Exhibitions Inc. directly.

---

**Version:** 1.0.0  
**Last Updated:** 2026  
**Status:** Production Ready ✅
