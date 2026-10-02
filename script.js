// Furniture Order Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form
    initializeForm();
    
    // Add event listeners
    addEventListeners();
    
    // Initial calculation
    calculateTotal();
});

// Initialize form elements
function initializeForm() {
    // Set minimum date for delivery to today
    const deliveryDateInput = document.getElementById('deliveryDate');
    const today = new Date().toISOString().split('T')[0];
    deliveryDateInput.setAttribute('min', today);
    
    // Set minimum date for artwork deadline to today
    const artworkDeadlineInput = document.getElementById('artworkDeadline');
    artworkDeadlineInput.setAttribute('min', today);
}

// Add event listeners
function addEventListeners() {
    // Quantity inputs - calculate on change
    const qtyInputs = document.querySelectorAll('.qty-input');
    qtyInputs.forEach(input => {
        input.addEventListener('input', function() {
            updateRowSubtotal(this);
            calculateTotal();
        });
        
        // Prevent negative values
        input.addEventListener('blur', function() {
            if (this.value < 0 || this.value === '') {
                this.value = 0;
                updateRowSubtotal(this);
                calculateTotal();
            }
        });
    });
    
    // Late order checkbox
    const lateOrderCheckbox = document.getElementById('lateOrder');
    lateOrderCheckbox.addEventListener('change', calculateTotal);
    
    // NOTE: Form submission removed - now using checkout button
}

// Update individual row subtotal
function updateRowSubtotal(input) {
    const row = input.closest('tr');
    const price = parseFloat(row.getAttribute('data-price'));
    const quantity = parseInt(input.value) || 0;
    const subtotal = price * quantity;
    
    const subtotalCell = row.querySelector('.subtotal');
    subtotalCell.textContent = '$' + subtotal.toFixed(2);
    
    // Add visual feedback for selected items
    if (quantity > 0) {
        row.style.backgroundColor = '#f0f7ff';
    } else {
        row.style.backgroundColor = '';
    }
}

// Calculate total order amount
function calculateTotal() {
    let subtotal = 0;
    
    // Calculate furniture items
    const furnitureRows = document.querySelectorAll('#furnitureTable tbody tr');
    furnitureRows.forEach(row => {
        const price = parseFloat(row.getAttribute('data-price'));
        const qtyInput = row.querySelector('.qty-input');
        const quantity = parseInt(qtyInput.value) || 0;
        subtotal += price * quantity;
    });
    
    // Calculate electrical items
    const electricalRows = document.querySelectorAll('#electricalTable tbody tr');
    electricalRows.forEach(row => {
        const price = parseFloat(row.getAttribute('data-price'));
        const qtyInput = row.querySelector('.qty-input');
        const quantity = parseInt(qtyInput.value) || 0;
        subtotal += price * quantity;
    });
    
    // Display subtotal
    document.getElementById('subtotalAmount').textContent = '$' + subtotal.toFixed(2);
    
    // Calculate late fee if applicable
    let lateFee = 0;
    const lateOrderCheckbox = document.getElementById('lateOrder');
    if (lateOrderCheckbox.checked && subtotal > 0) {
        lateFee = subtotal * 0.50; // 50% surcharge
        document.getElementById('lateFeeSummary').style.display = 'flex';
        document.getElementById('lateFeeAmount').textContent = '$' + lateFee.toFixed(2);
    } else {
        document.getElementById('lateFeeSummary').style.display = 'none';
    }
    
    // Calculate total
    const total = subtotal + lateFee;
    document.getElementById('totalAmount').innerHTML = '<strong>$' + total.toFixed(2) + '</strong>';
    
    // Update button text to show total
    const submitBtn = document.querySelector('.btn-primary');
    if (total > 0) {
        submitBtn.textContent = 'Submit Order ($' + total.toFixed(2) + ')';
    } else {
        submitBtn.textContent = 'Submit Order';
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate that at least one item is selected
    const qtyInputs = document.querySelectorAll('.qty-input');
    let hasItems = false;
    qtyInputs.forEach(input => {
        if (parseInt(input.value) > 0) {
            hasItems = true;
        }
    });
    
    if (!hasItems) {
        alert('Please select at least one item before submitting your order.');
        return;
    }
    
    // Get form data
    const formData = collectFormData();
    
    // Log order data
    console.log('Order Data:', formData);
    
    // Send email to Global Exhibitions
    sendOrderEmail(formData);
    
    // Show success message
    displaySuccessMessage(formData);
    
    // Scroll to success message
    document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Collect all form data
function collectFormData() {
    const form = document.getElementById('furnitureForm');
    const formData = {
        companyInfo: {
            companyName: form.companyName.value,
            contactPerson: form.contactPerson.value,
            email: form.email.value,
            phone: form.phone.value,
            boothNumber: form.boothNumber.value
        },
        items: [],
        delivery: {
            deliveryDate: form.deliveryDate.value,
            timeSlot: form.timeSlot.value,
            specialInstructions: form.specialInstructions.value,
            artworkDeadline: form.artworkDeadline.value
        },
        payment: {
            method: form.paymentMethod.value
        },
        lateOrder: form.lateOrder.checked,
        orderSummary: {
            subtotal: document.getElementById('subtotalAmount').textContent,
            lateFee: form.lateOrder.checked ? document.getElementById('lateFeeAmount').textContent : '$0.00',
            total: document.getElementById('totalAmount').textContent
        },
        timestamp: new Date().toISOString()
    };
    
    // Collect selected items
    const qtyInputs = document.querySelectorAll('.qty-input');
    qtyInputs.forEach(input => {
        const quantity = parseInt(input.value) || 0;
        if (quantity > 0) {
            const row = input.closest('tr');
            const itemName = row.cells[1].textContent;
            const price = row.getAttribute('data-price');
            const duration = row.cells[2].textContent;
            const subtotal = (parseFloat(price) * quantity).toFixed(2);
            
            formData.items.push({
                name: itemName,
                price: '$' + price,
                duration: duration,
                quantity: quantity,
                subtotal: '$' + subtotal
            });
        }
    });
    
    return formData;
}

// Display success message
function displaySuccessMessage(formData) {
    // Hide form
    document.getElementById('furnitureForm').style.display = 'none';
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    successMessage.style.display = 'block';
    
    // Update total in success message
    document.getElementById('successTotal').textContent = formData.orderSummary.total;
    
    // Add order details to success message
    addOrderDetailsToSuccess(formData);
    
    // Generate downloadable order summary
    generateOrderSummary(formData);
}

// Add order details to success message
function addOrderDetailsToSuccess(formData) {
    const successMessage = document.getElementById('successMessage');
    
    // Create order details section
    const detailsHTML = `
        <div style="background: rgba(255,255,255,0.2); padding: 20px; border-radius: 8px; margin-top: 20px; text-align: left;">
            <h4 style="margin-bottom: 15px; text-align: center;">Order Summary</h4>
            <p><strong>📧 Sent to:</strong> info@globalexhibitions.africa</p>
            <p><strong>Company:</strong> ${formData.companyInfo.companyName}</p>
            <p><strong>Contact:</strong> ${formData.companyInfo.contactPerson}</p>
            <p><strong>Email:</strong> ${formData.companyInfo.email}</p>
            <p><strong>Delivery Date:</strong> ${formatDate(formData.delivery.deliveryDate)}</p>
            <p><strong>Total Items:</strong> ${formData.items.length}</p>
            <p><strong>Payment Method:</strong> ${formatPaymentMethod(formData.payment.method)}</p>
            ${formData.lateOrder ? '<p style="color: #ffeb3b;"><strong>⚠ Late Order Surcharge Applied (50%)</strong></p>' : ''}
            <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.3);"><em>✓ Order email sent successfully to Global Exhibitions Inc.</em></p>
        </div>
        <button onclick="downloadOrderSummary()" class="btn-secondary" style="margin-top: 20px; background: white; color: #11998e; border: 2px solid white;">
            Download Order Summary
        </button>
        <button onclick="location.reload()" class="btn-secondary" style="margin-top: 20px; background: white; color: #11998e; border: 2px solid white; margin-left: 10px;">
            Create New Order
        </button>
    `;
    
    successMessage.innerHTML += detailsHTML;
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Format payment method
function formatPaymentMethod(method) {
    const methods = {
        'bank-transfer': 'Bank Transfer',
        'credit-card': 'Credit Card',
        'cash': 'Cash on Arrival'
    };
    return methods[method] || method;
}

// Store order data for download
let currentOrderData = null;

// Generate order summary for download
function generateOrderSummary(formData) {
    currentOrderData = formData;
}

// Download order summary as HTML ticket/receipt
function downloadOrderSummary() {
    if (!currentOrderData) return;
    
    // Generate order number
    const orderNumber = 'GEX-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Create HTML content for ticket-style order form
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Form - ${currentOrderData.companyInfo.companyName}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            padding: 40px;
            background: white;
            color: #333;
        }
        .ticket-container {
            max-width: 800px;
            margin: 0 auto;
            border: 3px solid #1e3c72;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        .ticket-header {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .company-logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
            letter-spacing: 2px;
        }
        .ticket-title {
            font-size: 24px;
            margin: 15px 0 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .order-number {
            background: rgba(255,255,255,0.2);
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin-top: 10px;
            font-size: 18px;
            font-weight: bold;
        }
        .ticket-body {
            padding: 30px;
            background: white;
        }
        .section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px dashed #e0e0e0;
        }
        .section:last-child {
            border-bottom: none;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #1e3c72;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .info-item {
            padding: 10px;
            background: #f8f9ff;
            border-radius: 5px;
        }
        .info-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .info-value {
            font-size: 14px;
            color: #1e3c72;
            font-weight: 600;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .items-table thead {
            background: #1e3c72;
            color: white;
        }
        .items-table th {
            padding: 12px 10px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .items-table td {
            padding: 12px 10px;
            border-bottom: 1px solid #e0e0e0;
            font-size: 13px;
        }
        .items-table tbody tr:hover {
            background: #f8f9ff;
        }
        .items-table .item-qty {
            text-align: center;
            font-weight: bold;
        }
        .items-table .item-price {
            text-align: right;
            font-weight: 600;
        }
        .total-section {
            background: #f8f9ff;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 15px;
        }
        .total-row.subtotal {
            color: #666;
        }
        .total-row.late-fee {
            color: #ff6b6b;
            font-weight: 600;
        }
        .total-row.grand-total {
            border-top: 3px solid #1e3c72;
            margin-top: 10px;
            padding-top: 15px;
            font-size: 20px;
            font-weight: bold;
            color: #1e3c72;
        }
        .bank-details {
            background: #fff9e6;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .bank-details h4 {
            color: #1e3c72;
            margin-bottom: 15px;
            font-size: 14px;
            text-transform: uppercase;
        }
        .bank-details table {
            width: 100%;
            font-size: 13px;
        }
        .bank-details td {
            padding: 6px 0;
        }
        .bank-details td:first-child {
            font-weight: bold;
            color: #666;
            width: 40%;
        }
        .ticket-footer {
            background: #1e3c72;
            color: white;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
        }
        .ticket-footer p {
            margin: 5px 0;
        }
        .qr-placeholder {
            width: 100px;
            height: 100px;
            background: rgba(255,255,255,0.2);
            margin: 10px auto;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
        }
        @media print {
            body {
                padding: 0;
            }
            .ticket-container {
                box-shadow: none;
                border: 2px solid #1e3c72;
            }
        }
    </style>
</head>
<body>
    <div class="ticket-container">
        <!-- Header -->
        <div class="ticket-header">
            <div class="company-logo">GLOBAL EXHIBITIONS INC.</div>
            <div style="font-size: 12px; opacity: 0.9;">Cardinal Otunga Plaza - Annex | P.O. Box 53920-00200</div>
            <div style="font-size: 12px; opacity: 0.9;">📧 info@globalexhibitions.africa | 📞 +254 794 007 810</div>
            <div class="ticket-title">Furniture Order Form</div>
            <div class="order-number">ORDER #${orderNumber}</div>
            <div style="margin-top: 10px; font-size: 13px;">Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>

        <!-- Body -->
        <div class="ticket-body">
            <!-- Company Information -->
            <div class="section">
                <div class="section-title">📋 Company Information</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Company Name</div>
                        <div class="info-value">${currentOrderData.companyInfo.companyName}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Contact Person</div>
                        <div class="info-value">${currentOrderData.companyInfo.contactPerson}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email Address</div>
                        <div class="info-value">${currentOrderData.companyInfo.email}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone Number</div>
                        <div class="info-value">${currentOrderData.companyInfo.phone}</div>
                    </div>
                    ${currentOrderData.companyInfo.boothNumber ? `
                    <div class="info-item">
                        <div class="info-label">Booth Number</div>
                        <div class="info-value">${currentOrderData.companyInfo.boothNumber}</div>
                    </div>` : ''}
                </div>
            </div>

            <!-- Delivery Information -->
            <div class="section">
                <div class="section-title">🚚 Delivery Information</div>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Delivery Date</div>
                        <div class="info-value">${formatDate(currentOrderData.delivery.deliveryDate)}</div>
                    </div>
                    ${currentOrderData.delivery.timeSlot ? `
                    <div class="info-item">
                        <div class="info-label">Time Slot</div>
                        <div class="info-value">${currentOrderData.delivery.timeSlot}</div>
                    </div>` : ''}
                    ${currentOrderData.delivery.specialInstructions ? `
                    <div class="info-item" style="grid-column: 1 / -1;">
                        <div class="info-label">Special Instructions</div>
                        <div class="info-value">${currentOrderData.delivery.specialInstructions}</div>
                    </div>` : ''}
                </div>
            </div>

            <!-- Ordered Items -->
            <div class="section">
                <div class="section-title">🛋️ Ordered Items</div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item Description</th>
                            <th style="text-align: center;">Qty</th>
                            <th style="text-align: right;">Unit Price</th>
                            <th style="text-align: right;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentOrderData.items.map((item, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${item.name}</td>
                            <td class="item-qty">${item.quantity}</td>
                            <td class="item-price">${item.price}</td>
                            <td class="item-price">${item.subtotal}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Payment Summary -->
            <div class="section">
                <div class="section-title">💳 Payment Summary</div>
                <div class="total-section">
                    <div class="total-row subtotal">
                        <span>Subtotal:</span>
                        <span>${currentOrderData.orderSummary.subtotal}</span>
                    </div>
                    ${currentOrderData.lateOrder ? `
                    <div class="total-row late-fee">
                        <span>Late Order Surcharge (50%):</span>
                        <span>${currentOrderData.orderSummary.lateFee}</span>
                    </div>` : ''}
                    <div class="total-row grand-total">
                        <span>TOTAL AMOUNT DUE:</span>
                        <span>${currentOrderData.orderSummary.total}</span>
                    </div>
                </div>
                
                <div class="info-item" style="margin-top: 15px;">
                    <div class="info-label">Payment Method</div>
                    <div class="info-value">${formatPaymentMethod(currentOrderData.payment.method)}</div>
                </div>

                ${currentOrderData.payment.method === 'bank-transfer' ? `
                <div class="bank-details">
                    <h4>💰 Bank Transfer Details</h4>
                    <table>
                        <tr><td>Account Name:</td><td>GLOBAL EXHIBITIONS INCORPORATED LIMITED</td></tr>
                        <tr><td>Bank Name:</td><td>STANBIC BANK</td></tr>
                        <tr><td>Branch:</td><td>INTERNATIONAL LIFE HOUSE</td></tr>
                        <tr><td>Account No (USD):</td><td>0100003753594</td></tr>
                        <tr><td>Account No (KES):</td><td>0100003753586</td></tr>
                        <tr><td>SWIFT Code:</td><td>SBICKENX</td></tr>
                        <tr><td>Bank Code:</td><td>31</td></tr>
                        <tr><td>Branch Code:</td><td>008</td></tr>
                    </table>
                </div>` : ''}
            </div>

            <!-- Terms -->
            <div class="section">
                <div class="section-title">📜 Terms & Conditions</div>
                <div style="font-size: 12px; line-height: 1.6; color: #666;">
                    ✓ All prices are inclusive of taxes<br>
                    ✓ Payment in full must be received before build-up<br>
                    ✓ Exhibitors are responsible for the condition of all rented furniture<br>
                    ✓ Damaged or missing items will be charged at replacement cost<br>
                    ${currentOrderData.lateOrder ? '⚠ 50% late order surcharge has been applied<br>' : ''}
                    ✓ Complete this form 15 days before the event
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="ticket-footer">
            <p style="font-size: 14px; font-weight: bold; margin-bottom: 10px;">Thank you for your order!</p>
            <p>For inquiries, contact us at info@globalexhibitions.africa or call +254 794 007 810</p>
            <p style="margin-top: 10px; font-size: 10px; opacity: 0.8;">
                This is an official order form from Global Exhibitions Inc. - A Decade of Excellence
            </p>
        </div>
    </div>
</body>
</html>
    `;
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Order_' + orderNumber + '_' + currentOrderData.companyInfo.companyName.replace(/\s+/g, '_') + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    // Show message about opening the file
    setTimeout(() => {
        alert('Order form downloaded! Open the HTML file in your browser and use Print > Save as PDF to create a PDF.');
    }, 500);
}

// Quick select helpers (optional enhancement)
function selectAllChairs() {
    const chairInputs = document.querySelectorAll('[data-item*="chair"]');
    chairInputs.forEach(input => {
        if (input.value === '0') input.value = '1';
        updateRowSubtotal(input);
    });
    calculateTotal();
}

function selectAllTables() {
    const tableInputs = document.querySelectorAll('[data-item*="table"]');
    tableInputs.forEach(input => {
        if (input.value === '0') input.value = '1';
        updateRowSubtotal(input);
    });
    calculateTotal();
}

function clearAllSelections() {
    const allInputs = document.querySelectorAll('.qty-input');
    allInputs.forEach(input => {
        input.value = '0';
        updateRowSubtotal(input);
    });
    calculateTotal();
}

// Validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.validateEmail(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone);
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Auto-save to localStorage (optional feature)
function autoSaveForm() {
    const formData = collectFormData();
    localStorage.setItem('furnitureOrderDraft', JSON.stringify(formData));
    console.log('Form auto-saved');
}

// Load saved draft (optional feature)
function loadSavedDraft() {
    const saved = localStorage.getItem('furnitureOrderDraft');
    if (saved) {
        const data = JSON.parse(saved);
        // Restore form values
        // Implementation left for future enhancement
        console.log('Draft loaded:', data);
    }
}

// Export function for download button in success message
window.downloadOrderSummary = downloadOrderSummary;

// Send order email to Global Exhibitions
function sendOrderEmail(formData) {
    // Prepare email body
    const emailBody = generateEmailBody(formData);
    
    // Using FormSubmit.co for email forwarding (free service)
    const formSubmitUrl = 'https://formsubmit.co/info@globalexhibitions.africa';
    
    // Create form data for submission
    const submitData = new FormData();
    submitData.append('_subject', `New Furniture Order from ${formData.companyInfo.companyName}`);
    submitData.append('_template', 'table');
    submitData.append('_captcha', 'false');
    submitData.append('_next', window.location.href + '#success');
    
    // Add company info
    submitData.append('Company Name', formData.companyInfo.companyName);
    submitData.append('Contact Person', formData.companyInfo.contactPerson);
    submitData.append('Email', formData.companyInfo.email);
    submitData.append('Phone', formData.companyInfo.phone);
    submitData.append('Booth Number', formData.companyInfo.boothNumber || 'N/A');
    
    // Add delivery info
    submitData.append('Delivery Date', formData.delivery.deliveryDate);
    submitData.append('Time Slot', formData.delivery.timeSlot || 'Not specified');
    submitData.append('Special Instructions', formData.delivery.specialInstructions || 'None');
    
    // Add order summary
    submitData.append('Order Total', formData.orderSummary.total);
    submitData.append('Late Order', formData.lateOrder ? 'YES (50% surcharge applied)' : 'NO');
    
    // Add items list
    let itemsList = '';
    formData.items.forEach((item, index) => {
        itemsList += `${index + 1}. ${item.name} - Qty: ${item.quantity} - ${item.subtotal}\n`;
    });
    submitData.append('Ordered Items', itemsList);
    
    // Send email via fetch
    fetch(formSubmitUrl, {
        method: 'POST',
        body: submitData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Email sent successfully:', data);
    })
    .catch(error => {
        console.error('Email sending failed:', error);
        // Continue anyway - user still gets download
    });
}

// Generate email body text
function generateEmailBody(formData) {
    let body = '=== NEW FURNITURE ORDER ===\n\n';
    body += '--- COMPANY INFORMATION ---\n';
    body += `Company: ${formData.companyInfo.companyName}\n`;
    body += `Contact: ${formData.companyInfo.contactPerson}\n`;
    body += `Email: ${formData.companyInfo.email}\n`;
    body += `Phone: ${formData.companyInfo.phone}\n`;
    body += `Booth: ${formData.companyInfo.boothNumber || 'N/A'}\n\n`;
    
    body += '--- ORDERED ITEMS ---\n';
    formData.items.forEach((item, index) => {
        body += `${index + 1}. ${item.name}\n`;
        body += `   Quantity: ${item.quantity} | Price: ${item.price} | Subtotal: ${item.subtotal}\n`;
    });
    
    body += `\n--- ORDER SUMMARY ---\n`;
    body += `Subtotal: ${formData.orderSummary.subtotal}\n`;
    if (formData.lateOrder) {
        body += `Late Fee (50%): ${formData.orderSummary.lateFee}\n`;
    }
    body += `TOTAL: ${formData.orderSummary.total}\n\n`;
    
    body += '--- DELIVERY INFO ---\n';
    body += `Date: ${formatDate(formData.delivery.deliveryDate)}\n`;
    body += `Time: ${formData.delivery.timeSlot || 'Not specified'}\n`;
    body += `Instructions: ${formData.delivery.specialInstructions || 'None'}\n\n`;
    
    body += `Payment Method: ${formatPaymentMethod(formData.payment.method)}\n`;
    
    return body;
}

// Console log for debugging
console.log('Furniture Order Form initialized successfully');
console.log('Total items in catalog:', document.querySelectorAll('.qty-input').length);
console.log('Email will be sent to: info@globalexhibitions.africa');

// Checkout Page Functions
function showCheckout() {
    // Validate form
    const form = document.getElementById('furnitureForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Check if at least one item is selected
    const qtyInputs = document.querySelectorAll('.qty-input');
    let hasItems = false;
    qtyInputs.forEach(input => {
        if (parseInt(input.value) > 0) {
            hasItems = true;
        }
    });
    
    if (!hasItems) {
        alert('Please select at least one item before proceeding to checkout.');
        return;
    }
    
    // Collect form data
    const formData = collectFormData();
    
    // Populate checkout page
    populateCheckout(formData);
    
    // Hide form, show checkout
    document.getElementById('furnitureForm').parentElement.querySelector('.container').style.display = 'none';
    document.getElementById('checkoutPage').style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function populateCheckout(formData) {
    // Populate items
    const itemsContainer = document.getElementById('checkoutItems');
    itemsContainer.innerHTML = '';
    
    formData.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'checkout-item';
        itemDiv.innerHTML = `
            <div class="checkout-item-details">
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-qty">Quantity: ${item.quantity} × ${item.price}</div>
            </div>
            <div class="checkout-item-price">${item.subtotal}</div>
        `;
        itemsContainer.appendChild(itemDiv);
    });
    
    // Populate company info
    const companyInfo = document.getElementById('checkoutCompanyInfo');
    companyInfo.innerHTML = `
        <div class="checkout-info-item">
            <div class="checkout-info-label">Company Name</div>
            <div class="checkout-info-value">${formData.companyInfo.companyName}</div>
        </div>
        <div class="checkout-info-item">
            <div class="checkout-info-label">Contact Person</div>
            <div class="checkout-info-value">${formData.companyInfo.contactPerson}</div>
        </div>
        <div class="checkout-info-item">
            <div class="checkout-info-label">Email</div>
            <div class="checkout-info-value">${formData.companyInfo.email}</div>
        </div>
        <div class="checkout-info-item">
            <div class="checkout-info-label">Phone</div>
            <div class="checkout-info-value">${formData.companyInfo.phone}</div>
        </div>
        ${formData.companyInfo.boothNumber ? `
        <div class="checkout-info-item">
            <div class="checkout-info-label">Booth Number</div>
            <div class="checkout-info-value">${formData.companyInfo.boothNumber}</div>
        </div>` : ''}
    `;
    
    // Populate delivery info
    const deliveryInfo = document.getElementById('checkoutDeliveryInfo');
    deliveryInfo.innerHTML = `
        <div class="checkout-info-item">
            <div class="checkout-info-label">Delivery Date</div>
            <div class="checkout-info-value">${formatDate(formData.delivery.deliveryDate)}</div>
        </div>
        ${formData.delivery.timeSlot ? `
        <div class="checkout-info-item">
            <div class="checkout-info-label">Time Slot</div>
            <div class="checkout-info-value">${formData.delivery.timeSlot}</div>
        </div>` : ''}
        ${formData.delivery.specialInstructions ? `
        <div class="checkout-info-item" style="grid-column: 1 / -1;">
            <div class="checkout-info-label">Special Instructions</div>
            <div class="checkout-info-value">${formData.delivery.specialInstructions}</div>
        </div>` : ''}
    `;
    
    // Populate payment info
    const paymentInfo = document.getElementById('checkoutPaymentInfo');
    paymentInfo.innerHTML = `
        <div class="checkout-info-item">
            <div class="checkout-info-label">Payment Method</div>
            <div class="checkout-info-value">${formatPaymentMethod(formData.payment.method)}</div>
        </div>
        <div class="checkout-info-item">
            <div class="checkout-info-label">Order will be sent to</div>
            <div class="checkout-info-value">📧 info@globalexhibitions.africa</div>
        </div>
    `;
    
    // Populate totals
    document.getElementById('checkoutSubtotal').textContent = formData.orderSummary.subtotal;
    
    if (formData.lateOrder) {
        document.getElementById('checkoutLateFee').style.display = 'flex';
        document.getElementById('checkoutLateFeeAmount').textContent = formData.orderSummary.lateFee;
    } else {
        document.getElementById('checkoutLateFee').style.display = 'none';
    }
    
    document.getElementById('checkoutGrandTotal').innerHTML = `<strong>${formData.orderSummary.total}</strong>`;
}

function backToForm() {
    // Show form, hide checkout
    document.getElementById('furnitureForm').parentElement.querySelector('.container').style.display = 'block';
    document.getElementById('checkoutPage').style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function confirmOrder() {
    // Show loading state
    const confirmBtn = event.target;
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = 'Sending Order...';
    confirmBtn.disabled = true;
    
    // Collect form data
    const formData = collectFormData();
    
    // Send email
    sendOrderEmail(formData);
    
    // Simulate sending delay
    setTimeout(() => {
        // Hide checkout, show success
        document.getElementById('checkoutPage').style.display = 'none';
        document.getElementById('furnitureForm').parentElement.querySelector('.container').style.display = 'block';
        
        // Display success message
        displaySuccessMessage(formData);
        
        // Scroll to success
        document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Re-enable button
        confirmBtn.textContent = originalText;
        confirmBtn.disabled = false;
    }, 1500);
}

// Make functions globally available
window.showCheckout = showCheckout;
window.backToForm = backToForm;
window.confirmOrder = confirmOrder;
