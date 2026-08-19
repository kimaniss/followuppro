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

// Senarai Data Awal
let customers = [
    {
        name: "Ahmad Rahman",
        phone: "60123456789",
        product: "Website Package",
        value: "850",
        status: "Follow-up",
        date: "2026-08-19"
    },
    {
        name: "Siti Aminah",
        phone: "60198765432",
        product: "Landing Page",
        value: "350",
        status: "Interested",
        date: "2026-08-20"
    }
];

// Fungsi untuk tukar format YYYY-MM-DD kepada DD/MM/YYYY
function formatDateDisplay(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
}

// Fungsi untuk buka WhatsApp Click-to-Chat
function openWhatsApp(name, phone, product) {
    // Buang simbol tambahan pada nombor jika ada (kekalkan nombor sahaja)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    
    // Draf mesej follow-up mesra usahawan
    const message = `Hi ${name} 👋 Saya nak follow up berkenaan ${product} yang kita bincangkan hari tu. Ada apa-apa yang saya boleh bantu?`;
    
    // Encode mesej untuk URL WhatsApp
    const encodedMessage = encodeURIComponent(message);
    
    // Buka pautan WhatsApp di tab baharu
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Fungsi untuk render semula jadual
function renderCustomers() {
    customerTableBody.innerHTML = '';
    
    const todayStr = new Date().toISOString().split('T')[0];

    customers.forEach((cust, index) => {
        let badgeClass = 'yellow';
        if(cust.status === 'Follow-up') badgeClass = 'orange';
        if(cust.status === 'Purchased') badgeClass = 'green';
        if(cust.status === 'Lost') badgeClass = 'red';

        // Logik Follow-up Pintar
        let followUpBadge = '';
        if (cust.date < todayStr) {
            followUpBadge = `<span class="status-badge red" style="margin-left: 6px; font-size: 10px; padding: 2px 6px;">Overdue</span>`;
        } else if (cust.date === todayStr) {
            followUpBadge = `<span class="status-badge orange" style="margin-left: 6px; font-size: 10px; padding: 2px 6px;">Hari Ini</span>`;
        } else {
            followUpBadge = `<span class="status-badge green" style="margin-left: 6px; font-size: 10px; padding: 2px 6px;">Akan Datang</span>`;
        }

        const formattedDate = formatDateDisplay(cust.date);

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>
                <strong>${cust.name}</strong>
                <span class="sub-text">${cust.phone}</span>
            </td>
            <td>${cust.product}</td>
            <td>RM${cust.value}</td>
            <td><span class="status-badge ${badgeClass}">${cust.status}</span></td>
            <td>${formattedDate} ${followUpBadge}</td>
            <td>
                <button class="btn-whatsapp" onclick="openWhatsApp('${cust.name}', '${cust.phone}', '${cust.product}')">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </button>
            </td>
        `;
        customerTableBody.appendChild(newRow);
    });

    totalCustomersElem.innerText = customers.length;
}

// Tambah Customer Baru
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

    customers.unshift(newCust);
    renderCustomers();

    addCustomerForm.reset();
    modal.style.display = 'none';
});

// Jalankan render kali pertama
renderCustomers();
