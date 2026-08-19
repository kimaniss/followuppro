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

// Table Bodies
const customerTableBody = document.getElementById('customerTableBody');
const allCustomersTableBody = document.getElementById('allCustomersTableBody');
const followupTableBody = document.getElementById('followupTableBody');
const salesTableBody = document.getElementById('salesTableBody');

// Metrics Elements
const totalCustomersElem = document.getElementById('totalCustomers');
const needFollowupCountElem = document.getElementById('needFollowupCount');
const followupCountBadge = document.getElementById('followupCountBadge');
const totalSalesDisplay = document.getElementById('totalSalesDisplay');
const totalPurchasedCount = document.getElementById('totalPurchasedCount');
const salesTotalRevenue = document.getElementById('salesTotalRevenue');
const salesTotalCount = document.getElementById('salesTotalCount');
const pageTitle = document.getElementById('pageTitle');

// View Sections
const viewDashboard = document.getElementById('viewDashboard');
const viewCustomers = document.getElementById('viewCustomers');
const viewFollowups = document.getElementById('viewFollowups');
const viewSales = document.getElementById('viewSales');

// Menu Elements
const menuDashboard = document.getElementById('menuDashboard');
const menuCustomers = document.getElementById('menuCustomers');
const menuFollowups = document.getElementById('menuFollowups');
const menuSales = document.getElementById('menuSales');

// Buka & Tutup Modal
openModalBtn.addEventListener('click', () => { modal.style.display = 'flex'; });
closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
cancelModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });

// Fungsi Pertukaran Paparan Halaman (Switch View)
function switchView(viewName) {
    viewDashboard.style.display = 'none';
    viewCustomers.style.display = 'none';
    viewFollowups.style.display = 'none';
    viewSales.style.display = 'none';

    menuDashboard.classList.remove('active');
    menuCustomers.classList.remove('active');
    menuFollowups.classList.remove('active');
    menuSales.classList.remove('active');

    if (viewName === 'dashboard') {
        viewDashboard.style.display = 'block';
        menuDashboard.classList.add('active');
        pageTitle.innerText = 'Dashboard';
    } else if (viewName === 'customers') {
        viewCustomers.style.display = 'block';
        menuCustomers.classList.add('active');
        pageTitle.innerText = 'Customers Management';
    } else if (viewName === 'followups') {
        viewFollowups.style.display = 'block';
        menuFollowups.classList.add('active');
        pageTitle.innerText = 'Follow-up System';
    } else if (viewName === 'sales') {
        viewSales.style.display = 'block';
        menuSales.classList.add('active');
        pageTitle.innerText = 'Sales & Revenue';
    }

    sidebar.classList.remove('active');
}

// Senarai Data Awal
let customers = [
    {
        name: "Ahmad Rahman",
        phone: "60123456789",
        product: "Website Package",
        value: 850,
        status: "Follow-up",
        date: "2026-08-19"
    },
    {
        name: "Siti Aminah",
        phone: "60198765432",
        product: "Landing Page",
        value: 350,
        status: "Purchased",
        date: "2026-08-18"
    },
    {
        name: "Ali Hassan",
        phone: "60112233445",
        product: "E-Commerce Setup",
        value: 1200,
        status: "Purchased",
        date: "2026-08-15"
    }
];

// Tukar format YYYY-MM-DD kepada DD/MM/YYYY
function formatDateDisplay(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
}

// Fungsi Buka WhatsApp Click-to-Chat
function openWhatsApp(name, phone, product) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = `Hi ${name} 👋 Saya nak follow up berkenaan ${product} yang kita bincangkan hari tu. Ada apa-apa yang saya boleh bantu?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Fungsi Render Utama untuk Semua Jadual & Metrik Sales
function renderAllData() {
    customerTableBody.innerHTML = '';
    allCustomersTableBody.innerHTML = '';
    followupTableBody.innerHTML = '';
    salesTableBody.innerHTML = '';

    const todayStr = new Date().toISOString().split('T')[0];
    let followupCount = 0;
    let totalRevenue = 0;
    let purchasedCount = 0;

    customers.forEach((cust) => {
        let badgeClass = 'yellow';
        if(cust.status === 'Follow-up') badgeClass = 'orange';
        if(cust.status === 'Purchased') badgeClass = 'green';
        if(cust.status === 'Lost') badgeClass = 'red';

        // Kira Statistik Sales jika status Purchased
        if (cust.status === 'Purchased') {
            totalRevenue += Number(cust.value);
            purchasedCount++;

            // Masukkan ke Jadual Sales
            const salesRow = document.createElement('tr');
            salesRow.innerHTML = `
                <td>
                    <strong>${cust.name}</strong>
                    <span class="sub-text">${cust.phone}</span>
                </td>
                <td>${cust.product}</td>
                <td><strong>RM${Number(cust.value).toLocaleString()}</strong></td>
                <td>${formatDateDisplay(cust.date)}</td>
            `;
            salesTableBody.appendChild(salesRow);
        }

        // Logik Follow-up Pintar
        let followUpBadge = '';
        let isNeedsAttention = false;

        if (cust.date < todayStr && cust.status !== 'Purchased' && cust.status !== 'Lost') {
            followUpBadge = `<span class="status-badge red" style="margin-left: 6px; font-size: 10px; padding: 2px 6px;">Overdue</span>`;
            isNeedsAttention = true;
        } else if (cust.date === todayStr && cust.status !== 'Purchased' && cust.status !== 'Lost') {
            followUpBadge = `<span class="status-badge orange" style="margin-left: 6px; font-size: 10px; padding: 2px 6px;">Hari Ini</span>`;
            isNeedsAttention = true;
        } else {
            followUpBadge = `<span class="status-badge green" style="margin-left: 6px; font-size: 10px; padding: 2px 6px;">Akan Datang</span>`;
        }

        const formattedDate = formatDateDisplay(cust.date);

        const rowHTML = `
            <td>
                <strong>${cust.name}</strong>
                <span class="sub-text">${cust.phone}</span>
            </td>
            <td>${cust.product}</td>
            <td>RM${Number(cust.value).toLocaleString()}</td>
            <td><span class="status-badge ${badgeClass}">${cust.status}</span></td>
            <td>${formattedDate} ${followUpBadge}</td>
            <td>
                <button class="btn-whatsapp" onclick="openWhatsApp('${cust.name}', '${cust.phone}', '${cust.product}')">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </button>
            </td>
        `;

        const row1 = document.createElement('tr');
        row1.innerHTML = rowHTML;
        customerTableBody.appendChild(row1);

        const row2 = document.createElement('tr');
        row2.innerHTML = rowHTML;
        allCustomersTableBody.appendChild(row2);

        if (isNeedsAttention) {
            followupCount++;
            const followupRow = document.createElement('tr');
            followupRow.innerHTML = `
                <td>
                    <strong>${cust.name}</strong>
                    <span class="sub-text">${cust.phone}</span>
                </td>
                <td>${cust.product}</td>
                <td><span class="status-badge ${badgeClass}">${cust.status}</span></td>
                <td>${formattedDate} ${followUpBadge}</td>
                <td>
                    <button class="btn-whatsapp" onclick="openWhatsApp('${cust.name}', '${cust.phone}', '${cust.product}')">
                        <i class="fa-brands fa-whatsapp"></i> WhatsApp Sekarang
                    </button>
                </td>
            `;
            followupTableBody.appendChild(followupRow);
        }
    });

    // Kemaskini Metrik Paparan Dashboard & Sales
    totalCustomersElem.innerText = customers.length;
    needFollowupCountElem.innerText = followupCount;
    followupCountBadge.innerText = `${followupCount} Pending`;
    
    totalSalesDisplay.innerText = `RM${totalRevenue.toLocaleString()}`;
    totalPurchasedCount.innerText = purchasedCount;
    salesTotalRevenue.innerText = `RM${totalRevenue.toLocaleString()}`;
    salesTotalCount.innerText = purchasedCount;
}

// Tambah Customer Baru
addCustomerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newCust = {
        name: document.getElementById('custName').value,
        phone: document.getElementById('custPhone').value,
        product: document.getElementById('custProduct').value,
        value: Number(document.getElementById('custValue').value),
        status: document.getElementById('custStatus').value,
        date: document.getElementById('custDate').value
    };

    customers.unshift(newCust);
    renderAllData();

    addCustomerForm.reset();
    modal.style.display = 'none';
});

// Jalankan paparan kali pertama
renderAllData();
