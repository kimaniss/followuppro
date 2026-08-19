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
const settingsForm = document.getElementById('settingsForm');
const modalTitle = document.getElementById('modalTitle');
const saveBtnText = document.getElementById('saveBtnText');
const editDocIdInput = document.getElementById('editDocId'); // Menggunakan ID Firestore

// Table Bodies
const customerTableBody = document.getElementById('customerTableBody');
const allCustomersTableBody = document.getElementById('allCustomersTableBody');
const followupTableBody = document.getElementById('followupTableBody');
const salesTableBody = document.getElementById('salesTableBody');

// Metrics & Header Elements
const totalCustomersElem = document.getElementById('totalCustomers');
const needFollowupCountElem = document.getElementById('needFollowupCount');
const followupCountBadge = document.getElementById('followupCountBadge');
const totalSalesDisplay = document.getElementById('totalSalesDisplay');
const totalPurchasedCount = document.getElementById('totalPurchasedCount');
const salesTotalRevenue = document.getElementById('salesTotalRevenue');
const salesTotalCount = document.getElementById('salesTotalCount');
const pageTitle = document.getElementById('pageTitle');
const headerUserName = document.getElementById('headerUserName');
const greetingName = document.getElementById('greetingName');

// Setting Input Elements
const settingOwnerName = document.getElementById('settingOwnerName');
const settingBusinessName = document.getElementById('settingBusinessName');
const settingDefaultMessage = document.getElementById('settingDefaultMessage');

// View Sections
const viewDashboard = document.getElementById('viewDashboard');
const viewCustomers = document.getElementById('viewCustomers');
const viewFollowups = document.getElementById('viewFollowups');
const viewSales = document.getElementById('viewSales');
const viewSettings = document.getElementById('viewSettings');

// Menu Elements
const menuDashboard = document.getElementById('menuDashboard');
const menuCustomers = document.getElementById('menuCustomers');
const menuFollowups = document.getElementById('menuFollowups');
const menuSales = document.getElementById('menuSales');
const menuSettings = document.getElementById('menuSettings');

// Buka Modal untuk Tambah Baru (Dengan perlindungan ralat)
if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        if (modalTitle) modalTitle.innerText = "Tambah Customer Baru";
        if (saveBtnText) saveBtnText.innerText = "Simpan Customer";
        if (editDocIdInput) editDocIdInput.value = "";
        if (addCustomerForm) addCustomerForm.reset();
        if (modal) modal.style.display = 'flex';
    });
}

// Tutup Modal
closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
cancelModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });

// Fungsi Pertukaran Paparan Halaman (Switch View)
function switchView(viewName) {
    viewDashboard.style.display = 'none';
    viewCustomers.style.display = 'none';
    viewFollowups.style.display = 'none';
    viewSales.style.display = 'none';
    viewSettings.style.display = 'none';

    menuDashboard.classList.remove('active');
    menuCustomers.classList.remove('active');
    menuFollowups.classList.remove('active');
    menuSales.classList.remove('active');
    menuSettings.classList.remove('active');

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
    } else if (viewName === 'settings') {
        viewSettings.style.display = 'block';
        menuSettings.classList.add('active');
        pageTitle.innerText = 'Settings';
    }

    sidebar.classList.remove('active');
}

// Senarai Data Global dari Firebase
let customers = [];

// Muat Tetapan Profil dari LocalStorage (Fallback jika tiada)
let appSettings = JSON.parse(localStorage.getItem('followuppro_settings')) || {
    owner: "Ahmad Bisnes",
    business: "FOLLOWUPPRO Agency",
    message: "Hi [Nama] 👋 Saya nak follow up berkenaan [Produk] yang kita bincangkan hari tu. Ada apa-apa yang saya boleh bantu?"
};

// Tetapkan nilai hanya jika elemen wujud di dalam HTML untuk elak ralat null
if (settingOwnerName) settingOwnerName.value = appSettings.owner;
if (settingBusinessName) settingBusinessName.value = appSettings.business;
if (settingDefaultMessage) settingDefaultMessage.value = appSettings.message;

if (headerUserName) headerUserName.innerText = appSettings.owner;
if (greetingName) greetingName.innerHTML = `GOOD MORNING, ${appSettings.owner.toUpperCase()} 👋`;

// --- FUNGSI FIREBASE CLOUD FIRESTORE ---
async function fetchCustomersFromCloud() {
    try {
        const querySnapshot = await window.getDocs(window.collection(window.db, "customers"));
        customers = [];
        querySnapshot.forEach((docSnap) => {
            customers.push({ id: docSnap.id, ...docSnap.data() });
        });
        renderAllData();
    } catch (error) {
        console.error("Ralat memuatkan data dari Firebase: ", error);
    }
}

function formatDateDisplay(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
}

function openWhatsApp(name, phone, product) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    let template = settingDefaultMessage.value || appSettings.message;
    const message = template.replace('[Nama]', name).replace('[Produk]', product);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// Fungsi Buka Borang untuk Edit Customer berdasarkan ID Firebase
function editCustomer(id) {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;
    
    document.getElementById('custName').value = cust.name;
    document.getElementById('custPhone').value = cust.phone;
    document.getElementById('custProduct').value = cust.product;
    document.getElementById('custValue').value = cust.value;
    document.getElementById('custStatus').value = cust.status;
    document.getElementById('custDate').value = cust.date;
    
    editDocIdInput.value = cust.id;
    modalTitle.innerText = "Edit Customer";
    saveBtnText.innerText = "Kemas Kini Customer";
    modal.style.display = 'flex';
}

// Fungsi Pembantu untuk Membina Baris Jadual
function createCustomerRow(cust, showEditButton = false) {
    let badgeClass = 'yellow';
    if(cust.status === 'Follow-up') badgeClass = 'orange';
    if(cust.status === 'Purchased') badgeClass = 'green';
    if(cust.status === 'Lost') badgeClass = 'red';

    const todayStr = new Date().toISOString().split('T')[0];
    let followUpBadge = '';

    if (cust.date < todayStr && cust.status !== 'Purchased' && cust.status !== 'Lost') {
        followUpBadge = `<span class="status-badge red" style="margin-left: 6px; font-size: 10px; padding: 2px 6px;">Overdue</span>`;
    } else if (cust.date === todayStr && cust.status !== 'Purchased' && cust.status !== 'Lost') {
        followUpBadge = `<span class="status-badge orange" style="margin-left: 6px; font-size: 10px; padding: 2px 6px;">Hari Ini</span>`;
    } else {
        followUpBadge = `<span class="status-badge green" style="margin-left: 6px; font-size: 10px; padding: 2px 6px;">Akan Datang</span>`;
    }

    const formattedDate = formatDateDisplay(cust.date);

    let actionButtonsHTML = '';
    if (showEditButton) {
        actionButtonsHTML = `
            <div class="action-btns">
                <button class="btn-edit" onclick="editCustomer('${cust.id}')">
                    <i class="fa-solid fa-pen-to-square"></i> Edit
                </button>
                <button class="btn-whatsapp" onclick="openWhatsApp('${cust.name}', '${cust.phone}', '${cust.product}')">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                </button>
            </div>
        `;
    } else {
        actionButtonsHTML = `
            <button class="btn-whatsapp" onclick="openWhatsApp('${cust.name}', '${cust.phone}', '${cust.product}')">
                <i class="fa-brands fa-whatsapp"></i> WhatsApp
            </button>
        `;
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <strong>${cust.name}</strong>
            <span class="sub-text">${cust.phone}</span>
        </td>
        <td>${cust.product}</td>
        <td>RM${Number(cust.value).toLocaleString()}</td>
        <td><span class="status-badge ${badgeClass}">${cust.status}</span></td>
        <td>${formattedDate} ${followUpBadge}</td>
        <td>${actionButtonsHTML}</td>
    `;
    return row;
}

// Fungsi Render Utama untuk Semua Jadual & Metrik
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
        if (cust.status === 'Purchased') {
            totalRevenue += Number(cust.value);
            purchasedCount++;

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

        let isNeedsAttention = false;
        if (cust.date < todayStr && cust.status !== 'Purchased' && cust.status !== 'Lost') {
            isNeedsAttention = true;
        } else if (cust.date === todayStr && cust.status !== 'Purchased' && cust.status !== 'Lost') {
            isNeedsAttention = true;
        }

        // 1. Dashboard: Tanpa butang edit
        customerTableBody.appendChild(createCustomerRow(cust, false));

        // 2. Menu Customers: Dengan butang edit
        allCustomersTableBody.appendChild(createCustomerRow(cust, true));

        // 3. Menu Follow-ups
        if (isNeedsAttention) {
            followupCount++;
            let badgeClass = cust.status === 'Follow-up' ? 'orange' : 'yellow';
            const followupRow = document.createElement('tr');
            followupRow.innerHTML = `
                <td>
                    <strong>${cust.name}</strong>
                    <span class="sub-text">${cust.phone}</span>
                </td>
                <td>${cust.product}</td>
                <td><span class="status-badge ${badgeClass}">${cust.status}</span></td>
                <td>${formatDateDisplay(cust.date)}</td>
                <td>
                    <button class="btn-whatsapp" onclick="openWhatsApp('${cust.name}', '${cust.phone}', '${cust.product}')">
                        <i class="fa-brands fa-whatsapp"></i> WhatsApp Sekarang
                    </button>
                </td>
            `;
            followupTableBody.appendChild(followupRow);
        }
    });

    totalCustomersElem.innerText = customers.length;
    needFollowupCountElem.innerText = followupCount;
    followupCountBadge.innerText = `${followupCount} Pending`;
    
    totalSalesDisplay.innerText = `RM${totalRevenue.toLocaleString()}`;
    totalPurchasedCount.innerText = purchasedCount;
    salesTotalRevenue.innerText = `RM${totalRevenue.toLocaleString()}`;
    salesTotalCount.innerText = purchasedCount;
}

// Submit Borang: Simpan ke Firebase ATAU Kemas Kini Firebase
addCustomerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const editDocId = editDocIdInput.value;
    const custData = {
        name: document.getElementById('custName').value,
        phone: document.getElementById('custPhone').value,
        product: document.getElementById('custProduct').value,
        value: Number(document.getElementById('custValue').value),
        status: document.getElementById('custStatus').value,
        date: document.getElementById('custDate').value
    };

    try {
        if (!editDocId) {
            // Tambah data baharu ke Cloud Firestore
            await window.addDoc(window.collection(window.db, "customers"), custData);
        } else {
            // Kemas kini data sedia ada dalam Cloud Firestore
            const docRef = window.doc(window.db, "customers", editDocId);
            await window.updateDoc(docRef, custData);
        }

        // Ambil data terkini dari cloud dan render semula
        await fetchCustomersFromCloud();

        addCustomerForm.reset();
        modal.style.display = 'none';
    } catch (error) {
        console.error("Ralat menyimpan data ke Firebase: ", error);
        alert("Gagal menyimpan data ke pangkalan data awan.");
    }
});

// Simpan Tetapan Profil
settingsForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    appSettings.owner = settingOwnerName.value;
    appSettings.business = settingBusinessName.value;
    appSettings.message = settingDefaultMessage.value;

    localStorage.setItem('followuppro_settings', JSON.stringify(appSettings));
    
    headerUserName.innerText = appSettings.owner;
    greetingName.innerHTML = `GOOD MORNING, ${appSettings.owner.toUpperCase()} 👋`;
    
    alert('Tetapan dan profil perniagaan berjaya disimpan!');
    switchView('dashboard');
});

// Jalankan pengambilan data dari Firebase apabila aplikasi mula dibuka
window.addEventListener('DOMContentLoaded', () => {
    // Pastikan Firebase sudah sedia sebelum fetch
    const checkInterval = setInterval(() => {
        if (window.db && window.getDocs) {
            clearInterval(checkInterval);
            fetchCustomersFromCloud();
        }
    }, 200);
});
