// Toggle Sidebar Mobile
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Modal Elements
const modal = document.getElementById('customerModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const addCustomerForm = document.getElementById('addCustomerForm');
const customerTableBody = document.getElementById('customerTableBody');
const totalCustomersElem = document.getElementById('totalCustomers');

// Buka & Tutup Modal
openModalBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
cancelModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });

// Tambah Customer Baru ke dalam Jadual
addCustomerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const product = document.getElementById('custProduct').value;
    const value = document.getElementById('custValue').value;
    const status = document.getElementById('custStatus').value;
    const date = document.getElementById('custDate').value;

    // Tentukan warna badge status
    let badgeClass = 'yellow';
    if(status === 'Follow-up') badgeClass = 'orange';
    if(status === 'Purchased') badgeClass = 'green';
    if(status === 'Lost') badgeClass = 'red';

    // Cipta baris jadual baru
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>
            <strong>${name}</strong>
            <span class="sub-text">${phone}</span>
        </td>
        <td>${product}</td>
        <td>RM${value}</td>
        <td><span class="status-badge ${badgeClass}">${status}</span></td>
        <td>${date}</td>
        <td>
            <button class="btn-whatsapp">
                <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </button>
        </td>
    `;

    // Masukkan ke dalam jadual di atas sekali
    customerTableBody.prepend(newRow);

    // Update jumlah total customer secara automatik
    let currentTotal = parseInt(totalCustomersElem.innerText);
    totalCustomersElem.innerText = currentTotal + 1;

    // Reset form dan tutup modal
    addCustomerForm.reset();
    modal.style.display = 'none';
});
