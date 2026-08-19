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

// Senarai Data Awal (Array Storage untuk MVP)
let customers = [
    {
        name: "Ahmad Rahman",
        phone: "60123456789",
        product: "Website Package",
        value: "850",
        status: "Follow-up",
        date: "2026-08-19" // Hari ini (Today)
    },
    {
        name: "Siti Aminah",
        phone: "60198765432",
        product: "Landing Page",
        value: "350",
        status: "Interested",
        date: "2026-08-18" // Lepas (Overdue)
    }
];

// Fungsi untuk render semula jadual berdasarkan data
function renderCustomers() {
    customerTableBody.innerHTML = '';
    
    // Tarikh Semasa (19 Ogos 2026)
    const todayStr = "2026-08-19";

    customers.forEach(cust => {
        // Tentukan warna badge status
        let badgeClass = 'yellow';
        if(cust.status === 'Follow-up') badgeClass = 'orange';
        if(cust.status === 'Purchased') badgeClass = 'green';
        if(cust.status === 'Lost') badgeClass = 'red';

        // Logik Follow-up Tag (Overdue / Today / Upcoming)
        let followUpBadge = '';
        if (cust.date < todayStr) {
            followUpBadge = `<span class="status-badge red" style="margin-left: 6px;">Overdue</span>`;
        } else if (cust.date === todayStr) {
            followUpBadge = `<span class="status-badge orange" style="margin-left: 6px;">Hari Ini</span>`;
        } else {
            followUpBadge = `<span class="status-badge green" style="margin-left: 6px;">Akan Datang</span>`;
        }

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>
                <strong>${cust.name}</strong>
                <span class="sub-text">${cust.phone}</span>
            </td>
            <td>${cust.product}</td>
            <td>RM${cust.value}</td>
            <td><span class="status-badge ${badgeClass}">${cust.status}</span></td>
            <td>${cust.date} ${followUpBadge}</td>
            <td>
                <button class="btn-whatsapp">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </button>
            </td>
        `;
        customerTableBody.appendChild(newRow);
    });

    // Kemaskini Total Customers
    totalCustomersElem.innerText = customers.length;
}

// Tambah Customer Baru ke dalam Array & Paparan
addCustomerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newCust = {
        name: document.getElementById('custName').value,
        phone: document.getElementById('custPhone').value,
        product: document.getElementById('custProduct').value,
        value: document.getElementById('custValue').value,
        status: document.getElementById('custStatus').value,
        date: document.getElementById('custDate').value
    };

    // Masukkan ke dalam senarai teratas
    customers.unshift(newCust);

    // Refresh paparan jadual
    renderCustomers();

    // Reset form dan tutup modal
    addCustomerForm.reset();
    modal.style.display = 'none';
});

// Jalankan render kali pertama apabila laman web dibuka
renderCustomers();
