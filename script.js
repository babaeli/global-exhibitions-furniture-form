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

// Add all event listeners
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
    
    // Form submission
    const form = document.getElementById('furnitureForm');
    form.addEventListener('submit', handleFormSubmit);
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
    
    // Log order data (in production, this would be sent to a server)
    console.log('Order Data:', formData);
    
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
            <p><strong>Company:</strong> ${formData.companyInfo.companyName}</p>
            <p><strong>Contact:</strong> ${formData.companyInfo.contactPerson}</p>
            <p><strong>Email:</strong> ${formData.companyInfo.email}</p>
            <p><strong>Delivery Date:</strong> ${formatDate(formData.delivery.deliveryDate)}</p>
            <p><strong>Total Items:</strong> ${formData.items.length}</p>
            <p><strong>Payment Method:</strong> ${formatPaymentMethod(formData.payment.method)}</p>
            ${formData.lateOrder ? '<p style="color: #ffeb3b;"><strong>⚠ Late Order Surcharge Applied (50%)</strong></p>' : ''}
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

// Download order summary as text file
function downloadOrderSummary() {
    if (!currentOrderData) return;
    
    let content = '=====================================================\n';
    content += '   GLOBAL EXHIBITIONS INC. - ORDER CONFIRMATION\n';
    content += '=====================================================\n\n';
    
    content += 'ORDER DATE: ' + new Date().toLocaleString() + '\n\n';
    
    content += '--- COMPANY INFORMATION ---\n';
    content += 'Company Name: ' + currentOrderData.companyInfo.companyName + '\n';
    content += 'Contact Person: ' + currentOrderData.companyInfo.contactPerson + '\n';
    content += 'Email: ' + currentOrderData.companyInfo.email + '\n';
    content += 'Phone: ' + currentOrderData.companyInfo.phone + '\n';
    content += 'Booth Number: ' + (currentOrderData.companyInfo.boothNumber || 'N/A') + '\n\n';
    
    content += '--- DELIVERY INFORMATION ---\n';
    content += 'Delivery Date: ' + formatDate(currentOrderData.delivery.deliveryDate) + '\n';
    content += 'Time Slot: ' + (currentOrderData.delivery.timeSlot || 'Not specified') + '\n';
    content += 'Special Instructions: ' + (currentOrderData.delivery.specialInstructions || 'None') + '\n';
    content += 'Artwork Deadline: ' + (formatDate(currentOrderData.delivery.artworkDeadline) || 'N/A') + '\n\n';
    
    content += '--- ORDERED ITEMS ---\n';
    currentOrderData.items.forEach((item, index) => {
        content += `${index + 1}. ${item.name}\n`;
        content += `   Price: ${item.price} | Quantity: ${item.quantity} | Subtotal: ${item.subtotal}\n\n`;
    });
    
    content += '--- PAYMENT SUMMARY ---\n';
    content += 'Subtotal: ' + currentOrderData.orderSummary.subtotal + '\n';
    if (currentOrderData.lateOrder) {
        content += 'Late Order Surcharge (50%): ' + currentOrderData.orderSummary.lateFee + '\n';
    }
    content += 'TOTAL AMOUNT DUE: ' + currentOrderData.orderSummary.total + '\n\n';
    
    content += '--- PAYMENT INFORMATION ---\n';
    content += 'Payment Method: ' + formatPaymentMethod(currentOrderData.payment.method) + '\n\n';
    
    if (currentOrderData.payment.method === 'bank-transfer') {
        content += 'BANK DETAILS:\n';
        content += 'Account Name: GLOBAL EXHIBITIONS INCORPORATED LIMITED\n';
        content += 'Bank Name: STANBIC BANK\n';
        content += 'Branch: INTERNATIONAL LIFE HOUSE\n';
        content += 'Account No (USD): 0100003753594\n';
        content += 'Account No (KES): 0100003753586\n';
        content += 'SWIFT Code: SBICKENX\n';
        content += 'Bank Code: 31\n';
        content += 'Branch Code: 008\n\n';
    }
    
    content += '--- TERMS & CONDITIONS ---\n';
    content += '- Payment in full must be received before build-up\n';
    content += '- Exhibitors are responsible for condition of rented furniture\n';
    content += '- Damaged/missing items charged at replacement cost\n';
    if (currentOrderData.lateOrder) {
        content += '- 50% late order surcharge has been applied\n';
    }
    content += '\n';
    content += '=====================================================\n';
    content += 'Thank you for your order!\n';
    content += 'Global Exhibitions Inc.\n';
    content += 'Email: info@globalexhibitions.africa\n';
    content += 'Tel: +254 794 007 810\n';
    content += '=====================================================\n';
    
    // Create download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Furniture_Order_' + currentOrderData.companyInfo.companyName.replace(/\s+/g, '_') + '_' + new Date().getTime() + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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

// Console log for debugging
console.log('Furniture Order Form initialized successfully');
console.log('Total items in catalog:', document.querySelectorAll('.qty-input').length);
