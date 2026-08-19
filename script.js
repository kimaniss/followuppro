const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Auth Elements
const authScreen = document.getElementById('authScreen');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authSubtitle = document.getElementById('authSubtitle');
const toggleAuthModeBtn = document.getElementById('toggleAuthModeBtn');

let isRegisterMode = false;

if (toggleAuthModeBtn) {
    toggleAuthModeBtn.addEventListener('click', () => {
        isRegisterMode = !isRegisterMode;
        if (isRegisterMode) {
            authSubtitle.innerText = "Daftar akaun CRM baharu";
            authSubmitBtn.innerText = "Daftar Akaun";
            toggleAuthModeBtn.innerText = "Sudah ada akaun? Log masuk";
        } else {
            authSubtitle.innerText = "Log masuk ke akaun CRM anda";
            authSubmitBtn.innerText = "Log Masuk";
            toggleAuthModeBtn.innerText = "Belum ada akaun? Daftar sekarang";
        }
    });
}

// Fungsi Log Keluar (Logout)
function logoutUser() {
    if (window.auth) {
        window.signOut(window.auth).then(() => {
            window.location.reload();
        }).catch((error) => {
            console.error("Ralat logout: ", error);
        });
    }
}

// Modal Elements
const modal = document.getElementById('customerModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const addCustomerForm = document.getElementById('addCustomerForm');
const settingsForm = document.getElementById('settingsForm');
const modalTitle = document.getElementById('modalTitle');
const saveBtnText = document.getElementById('saveBtnText');
const editDocIdInput = document.getElementById('editDocId');

const customerTableBody = document.getElementById('customerTableBody');
const allCustomersTableBody = document.getElementById('allCustomersTableBody');
const followupTableBody = document.getElementById('followupTableBody');
const salesTableBody = document.getElementById('salesTableBody');

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

const settingOwnerName = document.getElementById('settingOwnerName');
const settingBusinessName = document.getElementById('settingBusinessName');
const settingDefaultMessage = document.getElementById('settingDefaultMessage');

const viewDashboard = document.getElementById('viewDashboard');
const viewCustomers = document.getElementById('viewCustomers');
const viewFollowups = document.getElementById('viewFollowups');
const viewSales = document.getElementById('viewSales');
const viewSettings = document.getElementById('viewSettings');

const menuDashboard = document.getElementById('menuDashboard');
const menuCustomers = document.getElementById('menuCustomers');
const menuFollowups = document.getElementById('menuFollowups');
const menuSales = document.getElementById('menuSales');
const menuSettings = document.getElementById('menuSettings');

if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        if (modalTitle) modalTitle.innerText = "Tambah Customer Baru";
        if (saveBtnText) saveBtnText.innerText = "Simpan Customer";
        if (editDocIdInput) editDocIdInput.value = "";
        if (addCustomerForm) addCustomerForm.reset();
        if (modal) modal.style.display = 'flex';
    });
}

if (closeModalBtn) closeModalBtn.addEventListener('click', () => { if(modal) modal.style.display = 'none'; });
if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => { if(modal) modal.style.display = 'none'; });

function switchView(viewName) {
    if(viewDashboard) viewDashboard.style.display = 'none';
    if(viewCustomers) viewCustomers.style.display = 'none';
    if(viewFollowups) viewFollowups.style.display = 'none';
    if(viewSales) viewSales.style.display = 'none';
    if(viewSettings) viewSettings.style.display = 'none';

    if(menuDashboard) menuDashboard.classList.remove('active');
    if(menuCustomers) menuCustomers.classList.remove('active');
    if(menuFollowups) menuFollowups.classList.remove('active');
    if(menuSales) menuSales.classList.remove('active');
    if(menuSettings) menuSettings.classList.remove('active');

    if (viewName === 'dashboard') {
        if(viewDashboard) viewDashboard.style.display = 'block';
        if(menuDashboard) menuDashboard.classList.add('active');
        if(pageTitle) pageTitle.innerText = 'Dashboard';
    } else if (viewName === 'customers') {
        if(viewCustomers) viewCustomers.style.display = 'block';
        if(menuCustomers) menuCustomers.classList.add('active');
        if(pageTitle) pageTitle.innerText = 'Customers Management';
    } else if (viewName === 'followups') {
        if(viewFollowups) viewFollowups.style.display = 'block';
        if(menuFollowups) menuFollowups.classList.add('active');
        if(pageTitle) pageTitle.innerText = 'Follow-up System';
    } else if (viewName === 'sales') {
        if(viewSales) viewSales.style.display = 'block';
        if(menuSales) menuSales.classList.add('active');
        if(pageTitle) pageTitle.innerText = 'Sales & Revenue';
    } else if (viewName === 'settings') {
        if(viewSettings) viewSettings.style.display = 'block';
        if(menuSettings) menuSettings.classList.add('active');
        if(pageTitle) pageTitle.innerText = 'Settings';
    }

    if(sidebar) sidebar.classList.remove('active');
}

let customers = [];

let appSettings = JSON.parse(localStorage.getItem('followuppro_settings')) || {
    owner: "Ahmad Bisnes",
    business: "FOLLOWUPPRO Agency",
    message: "Hi [Nama] 👋 Saya nak follow up berkenaan [Produk] yang kita bincangkan hari tu. Ada apa-apa yang saya boleh bantu?"
};

if (settingOwnerName) settingOwnerName.value = appSettings.owner;
if (settingBusinessName) settingBusinessName.value = appSettings.business;
if (settingDefaultMessage) settingDefaultMessage.value = appSettings.message;
if (headerUserName) headerUserName.innerText = appSettings.owner;
if (greetingName) greetingName.innerHTML = `GOOD MORNING, ${appSettings.owner.toUpperCase()} 👋`;

// AMBIL DATA BERDASARKAN USER UID SAHAJA
async function fetchCustomersFromCloud() {
    const user = window.auth.currentUser;
    if (!user) return;

    try {
        const q = window.query(
            window.collection(window.db, "customers"), 
            window.where("ownerId", "==", user.uid)
        );
        const querySnapshot = await window.getDocs(q);
        customers = [];
        querySnapshot.forEach((docSnap) => {
            customers.push({ id: docSnap.id, ...docSnap.data() });
        });
        renderAllData();
    } catch (error) {
        console.error("Ralat memuatkan data: ", error);
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
    let template = settingDefaultMessage ? settingDefaultMessage.value : appSettings.message;
    const message = template.replace('[Nama]', name).replace('[Produk]', product);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

function editCustomer(id) {
    const cust = customers.find(c => c.id === id);
    if (!cust) return;
    
    document.getElementById('custName').value = cust.name;
    document.getElementById('custPhone').value = cust.phone;
    document.getElementById('custProduct').value = cust.product;
    document.getElementById('custValue').value = cust.value;
    document.getElementById('custStatus').value = cust.status;
    document.getElementById('custDate').value = cust.date;
    
    if(editDocIdInput) editDocIdInput.value = cust.id;
    if(modalTitle) modalTitle.innerText = "Edit Customer";
    if(saveBtnText) saveBtnText.innerText = "Kemas Kini Customer";
    if(modal) modal.style.display = 'flex';
}

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

    let actionButtonsHTML = showEditButton ? `
        <div class="action-btns">
            <button class="btn-edit" onclick="editCustomer('${cust.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
            <button class="btn-whatsapp" onclick="openWhatsApp('${cust.name}', '${cust.phone}', '${cust.product}')"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
        </div>
    ` : `
        <button class="btn-whatsapp" onclick="openWhatsApp('${cust.name}', '${cust.phone}', '${cust.product}')"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>
    `;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td><strong>${cust.name}</strong><span class="sub-text">${cust.phone}</span></td>
        <td>${cust.product}</td>
        <td>RM${Number(cust.value).toLocaleString()}</td>
        <td><span class="status-badge ${badgeClass}">${cust.status}</span></td>
        <td>${formattedDate} ${followUpBadge}</td>
        <td>${actionButtonsHTML}</td>
    `;
    return row;
}

function renderAllData() {
    if(customerTableBody) customerTableBody.innerHTML = '';
    if(allCustomersTableBody) allCustomersTableBody.innerHTML = '';
    if(followupTableBody) followupTableBody.innerHTML = '';
    if(salesTableBody) salesTableBody.innerHTML = '';

    const todayStr = new Date().toISOString().split('T')[0];
    let followupCount = 0;
    let totalRevenue = 0;
    let purchasedCount = 0;

    customers.forEach((cust) => {
        if (cust.status === 'Purchased') {
            totalRevenue += Number(cust.value);
            purchasedCount++;

            if(salesTableBody) {
                const salesRow = document.createElement('tr');
                salesRow.innerHTML = `
                    <td><strong>${cust.name}</strong><span class="sub-text">${cust.phone}</span></td>
                    <td>${cust.product}</td>
                    <td><strong>RM${Number(cust.value).toLocaleString()}</strong></td>
                    <td>${formatDateDisplay(cust.date)}</td>
                `;
                salesTableBody.appendChild(salesRow);
            }
        }

        let isNeedsAttention = (cust.date <= todayStr && cust.status !== 'Purchased' && cust.status !== 'Lost');

        if(customerTableBody) customerTableBody.appendChild(createCustomerRow(cust, false));
        if(allCustomersTableBody) allCustomersTableBody.appendChild(createCustomerRow(cust, true));

        if (isNeedsAttention && followupTableBody) {
            followupCount++;
            let badgeClass = cust.status === 'Follow-up' ? 'orange' : 'yellow';
            const followupRow = document.createElement('tr');
            followupRow.innerHTML = `
                <td><strong>${cust.name}</strong><span class="sub-text">${cust.phone}</span></td>
                <td>${cust.product}</td>
                <td><span class="status-badge ${badgeClass}">${cust.status}</span></td>
                <td>${formatDateDisplay(cust.date)}</td>
                <td><button class="btn-whatsapp" onclick="openWhatsApp('${cust.name}', '${cust.phone}', '${cust.product}')"><i class="fa-brands fa-whatsapp"></i> WhatsApp Sekarang</button></td>
            `;
            followupTableBody.appendChild(followupRow);
        }
    });

    if(totalCustomersElem) totalCustomersElem.innerText = customers.length;
    if(needFollowupCountElem) needFollowupCountElem.innerText = followupCount;
    if(followupCountBadge) followupCountBadge.innerText = `${followupCount} Pending`;
    
    if(totalSalesDisplay) totalSalesDisplay.innerText = `RM${totalRevenue.toLocaleString()}`;
    if(totalPurchasedCount) totalPurchasedCount.innerText = purchasedCount;
    if(salesTotalRevenue) salesTotalRevenue.innerText = `RM${totalRevenue.toLocaleString()}`;
    if(salesTotalCount) salesTotalCount.innerText = purchasedCount;
}

// SIMPAN DENGAN SERTAKAN ownerId PENGGUNA YANG LOGIN
if(addCustomerForm) {
    addCustomerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const user = window.auth.currentUser;
        if (!user) {
            alert("Sila log masuk semula.");
            return;
        }

        const editDocId = editDocIdInput ? editDocIdInput.value : "";
        const custData = {
            name: document.getElementById('custName').value,
            phone: document.getElementById('custPhone').value,
            product: document.getElementById('custProduct').value,
            value: Number(document.getElementById('custValue').value),
            status: document.getElementById('custStatus').value,
            date: document.getElementById('custDate').value,
            ownerId: user.uid // IKAT DATA PADA AKAUN INI
        };

        try {
            if (!editDocId) {
                await window.addDoc(window.collection(window.db, "customers"), custData);
            } else {
                const docRef = window.doc(window.db, "customers", editDocId);
                await window.updateDoc(docRef, custData);
            }

            await fetchCustomersFromCloud();
            addCustomerForm.reset();
            if(modal) modal.style.display = 'none';
        } catch (error) {
            console.error("Ralat menyimpan data: ", error);
            alert("Gagal menyimpan data.");
        }
    });
}

if(settingsForm) {
    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        appSettings.owner = settingOwnerName.value;
        appSettings.business = settingBusinessName.value;
        appSettings.message = settingDefaultMessage.value;

        localStorage.setItem('followuppro_settings', JSON.stringify(appSettings));
        
        if(headerUserName) headerUserName.innerText = appSettings.owner;
        if(greetingName) greetingName.innerHTML = `GOOD MORNING, ${appSettings.owner.toUpperCase()} 👋`;
        
        alert('Tetapan berjaya disimpan!');
        switchView('dashboard');
    });
}

window.addEventListener('DOMContentLoaded', () => {
    const checkInterval = setInterval(() => {
        if (window.auth && window.onAuthStateChanged) {
            clearInterval(checkInterval);
            
            window.onAuthStateChanged(window.auth, (user) => {
                if (user) {
                    if(authScreen) authScreen.style.display = 'none';
                    fetchCustomersFromCloud();
                } else {
                    if(authScreen) authScreen.style.display = 'flex';
                }
            });
        }
    }, 200);
});

if(authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = authEmail.value;
        const password = authPassword.value;

        try {
            if (isRegisterMode) {
                await window.createUserWithEmailAndPassword(window.auth, email, password);
                alert("Pendaftaran akaun berjaya!");
            } else {
                await window.signInWithEmailAndPassword(window.auth, email, password);
            }
        } catch (error) {
            console.error("Ralat Auth: ", error.message);
            alert("Gagal: " + error.message);
        }
    });
}
