// Toggle Sidebar Mobile
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

function logoutUser() {
    if (confirm("Adakah anda pasti mahu log keluar?")) {
        if (window.auth && window.signOut) {
            window.signOut(window.auth).then(() => {
                window.location.reload();
            }).catch((error) => {
                console.error("Ralat logout: ", error);
                alert("Gagal log keluar.");
            });
        }
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

// AI Modal Elements
const aiModal = document.getElementById('aiModal');
const aiMessageOutput = document.getElementById('aiMessageOutput');
const sendAIWhatsAppBtn = document.getElementById('sendAIWhatsAppBtn');
const upgradeModal = document.getElementById('upgradeModal');

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

const menuDashboard = document.getElementById('menuDashboard');
const menuCustomers = document.getElementById('menuCustomers');
const menuFollowups = document.getElementById('menuFollowups');
const menuSales = document.getElementById('menuSales');
const menuSettings = document.getElementById('menuSettings');

let isUserPro = false;
let customers = [];

async function checkUserPlanStatus(userId) {
    try {
        if (!window.db || !window.doc || !window.getDoc) return;
        const userDocRef = window.doc(window.db, "users", userId);
        const docSnap = await window.getDoc(userDocRef);
        
        if (docSnap && docSnap.exists()) {
            const userData = docSnap.data();
            isUserPro = (userData.plan === "pro");
        } else if (window.setDoc) {
            await window.setDoc(userDocRef, {
                email: window.auth.currentUser.email,
                plan: "free",
                createdAt: new Date().toISOString()
            });
            isUserPro = false;
        }
    } catch (error) {
        console.error("Ralat semak pelan: ", error);
        isUserPro = false;
    }
}

// Buka Modal Tambah Customer
if (openModalBtn) {
    openModalBtn.addEventListener('click', () => {
        const MAX_FREE_LIMIT = 10; 
        if (!isUserPro && customers.length >= MAX_FREE_LIMIT) {
            alert(`⚠️ Had Akaun Percuma telah penuh (${MAX_FREE_LIMIT} Customer).\n\nSila klik 'Upgrade to Pro' untuk menambah lebih ramai pelanggan!`);
            return; 
        }

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
    [viewDashboard, viewCustomers, viewFollowups, viewSales, viewSettings].forEach(v => { if(v) v.style.display = 'none'; });
    [menuDashboard, menuCustomers, menuFollowups, menuSales, menuSettings].forEach(m => { if(m) m.classList.remove('active'); });

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

let appSettings = JSON.parse(localStorage.getItem('followuppro_settings')) || {
    owner: "Pengguna Biasa",
    business: "FOLLOWUPPRO Agency",
    message: "Hi [Nama] 👋 Saya nak follow up berkenaan [Produk] yang kita bincangkan hari tu. Ada apa-apa yang saya boleh bantu?"
};

if (settingOwnerName) settingOwnerName.value = appSettings.owner;
if (settingBusinessName) settingBusinessName.value = appSettings.business;
if (settingDefaultMessage) settingDefaultMessage.value = appSettings.message;
if (headerUserName) headerUserName.innerText = appSettings.owner;
if (greetingName) greetingName.innerHTML = `WELCOME, ${appSettings.owner.toUpperCase()} 👋`;

async function fetchCustomersFromCloud() {
    const user = window.auth ? window.auth.currentUser : null;
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
        console.error("Ralat muat data: ", error);
    }
}

function formatDateDisplay(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateString;
}

async function openWhatsApp(id, name, phone, product) {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    let template = settingDefaultMessage ? settingDefaultMessage.value : appSettings.message;
    let message = template.replace('[Nama]', name).replace('[Produk]', product);
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');

    try {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextDateStr = nextWeek.toISOString().split('T')[0];

        await window.updateDoc(window.doc(window.db, "customers", id), {
            date: nextDateStr,
            status: "Follow-up"
        });
        await fetchCustomersFromCloud();
    } catch (error) {
        console.error("Ralat WhatsApp update: ", error);
    }
}

function previewAIMessage(name, product, status, phone, customerId) {
    let drafMesej = status === "Purchased" ? `Hi ${name} ✨ Terima kasih mendapatkan ${product} bersama kami!` : `Hi ${name} 👋 Masih berminat dengan ${product}?`;
    if (aiMessageOutput) aiMessageOutput.value = drafMesej;
    if (aiModal) aiModal.style.display = 'flex';

    if (sendAIWhatsAppBtn) {
        sendAIWhatsAppBtn.onclick = async function() {
            closeAIModal();
            await sendCustomWhatsApp(customerId, name, phone, aiMessageOutput.value);
        };
    }
}

function closeAIModal() { if (aiModal) aiModal.style.display = 'none'; }

async function sendCustomWhatsApp(id, name, phone, customMessage) {
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(customMessage)}`, '_blank');
    try {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        await window.updateDoc(window.doc(window.db, "customers", id), {
            date: nextWeek.toISOString().split('T')[0],
            status: "Follow-up"
        });
        await fetchCustomersFromCloud();
    } catch (error) { console.error(error); }
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
    let badgeClass = cust.status === 'Purchased' ? 'green' : (cust.status === 'Follow-up' ? 'orange' : 'yellow');
    const actionBtns = `
        <div class="action-btns" style="display: flex; gap: 6px;">
            ${showEditButton ? `<button class="btn-edit" onclick="editCustomer('${cust.id}')"><i class="fa-solid fa-pen-to-square"></i></button>` : ''}
            <button class="btn-whatsapp" onclick="openWhatsApp('${cust.id}', '${cust.name}', '${cust.phone}', '${cust.product}')"><i class="fa-brands fa-whatsapp"></i></button>
            <button onclick="previewAIMessage('${cust.name}', '${cust.product}', '${cust.status}', '${cust.phone}', '${cust.id}')" style="background: #7C3AED; color: white; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer;"><i class="fa-solid fa-wand-magic-sparkles"></i></button>
        </div>`;
    const row = document.createElement('tr');
    row.innerHTML = `<td><strong>${cust.name}</strong><br>${cust.phone}</td><td>${cust.product}</td><td>RM${Number(cust.value).toLocaleString()}</td><td><span class="status-badge ${badgeClass}">${cust.status}</span></td><td>${formatDateDisplay(cust.date)}</td><td>${actionBtns}</td>`;
    return row;
}

function renderAllData() {
    [customerTableBody, allCustomersTableBody, followupTableBody, salesTableBody].forEach(b => { if(b) b.innerHTML = ''; });
    let totalRev = 0, purchasedCount = 0, followupCount = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    customers.forEach(cust => {
        if (cust.status === 'Purchased') {
            totalRev += Number(cust.value);
            purchasedCount++;
            if(salesTableBody) {
                const sRow = document.createElement('tr');
                sRow.innerHTML = `<td><strong>${cust.name}</strong><br>${cust.phone}</td><td>${cust.product}</td><td><strong>RM${Number(cust.value).toLocaleString()}</strong></td><td>${formatDateDisplay(cust.date)}</td>`;
                salesTableBody.appendChild(sRow);
            }
        }

        if(customerTableBody) customerTableBody.appendChild(createCustomerRow(cust, false));
        if(allCustomersTableBody) allCustomersTableBody.appendChild(createCustomerRow(cust, true));

        if (cust.date <= todayStr && cust.status !== 'Purchased' && cust.status !== 'Lost') {
            followupCount++;
            if(followupTableBody) {
                const fRow = document.createElement('tr');
                fRow.innerHTML = `<td><strong>${cust.name}</strong><br>${cust.phone}</td><td>${cust.product}</td><td><span class="status-badge orange">${cust.status}</span></td><td>${formatDateDisplay(cust.date)}</td><td><button class="btn-whatsapp" onclick="openWhatsApp('${cust.id}', '${cust.name}', '${cust.phone}', '${cust.product}')"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button></td>`;
                followupTableBody.appendChild(fRow);
            }
        }
    });

    if(totalCustomersElem) totalCustomersElem.innerText = customers.length;
    if(needFollowupCountElem) needFollowupCountElem.innerText = followupCount;
    if(followupCountBadge) followupCountBadge.innerText = `${followupCount} Pending`;
    if(totalSalesDisplay) totalSalesDisplay.innerText = `RM${totalRev.toLocaleString()}`;
    if(totalPurchasedCount) totalPurchasedCount.innerText = purchasedCount;
    if(salesTotalRevenue) salesTotalRevenue.innerText = `RM${totalRev.toLocaleString()}`;
    if(salesTotalCount) salesTotalCount.innerText = purchasedCount;
}

if(addCustomerForm) {
    addCustomerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = window.auth ? window.auth.currentUser : null;
        if (!user) { alert("Sila log masuk semula."); return; }

        const editDocId = editDocIdInput ? editDocIdInput.value : "";
        const custData = {
            name: document.getElementById('custName').value,
            phone: document.getElementById('custPhone').value,
            product: document.getElementById('custProduct').value,
            value: Number(document.getElementById('custValue').value),
            status: document.getElementById('custStatus').value,
            date: document.getElementById('custDate').value,
            ownerId: user.uid
        };

        try {
            if (!editDocId) await window.addDoc(window.collection(window.db, "customers"), custData);
            else await window.updateDoc(window.doc(window.db, "customers", editDocId), custData);

            await fetchCustomersFromCloud();
            addCustomerForm.reset();
            if(modal) modal.style.display = 'none';
        } catch (err) { alert("Gagal menyimpan data."); }
    });
}

if(settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        appSettings.owner = settingOwnerName.value;
        appSettings.business = settingBusinessName.value;
        appSettings.message = settingDefaultMessage.value;
        localStorage.setItem('followuppro_settings', JSON.stringify(appSettings));
        if(headerUserName) headerUserName.innerText = appSettings.owner;
        if(greetingName) greetingName.innerHTML = `WELCOME, ${appSettings.owner.toUpperCase()} 👋`;
        alert('Tetapan disimpan!');
        switchView('dashboard');
    });
}

// Pantau Sesi Pengguna Melalui Event Firebase Siap Sedia
window.addEventListener('firebase-ready', () => {
    if (window.auth && window.onAuthStateChanged) {
        window.onAuthStateChanged(window.auth, async (user) => {
            if (user) {
                if(authScreen) authScreen.style.display = 'none';
                await checkUserPlanStatus(user.uid);
                fetchCustomersFromCloud();
            } else {
                if(authScreen) authScreen.style.display = 'flex';
            }
        });
    }
});

if(authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = authEmail.value;
        const password = authPassword.value;
        try {
            if (isRegisterMode) {
                await window.createUserWithEmailAndPassword(window.auth, email, password);
                alert("Pendaftaran berjaya!");
            } else {
                await window.signInWithEmailAndPassword(window.auth, email, password);
            }
        } catch (error) {
            alert("Gagal: " + error.message);
        }
    });
}

// Upgrade & Pembayaran Razorpay
function openUpgradeModal() { if(upgradeModal) upgradeModal.style.display = 'flex'; if(sidebar) sidebar.classList.remove('active'); }
function closeUpgradeModal() { if(upgradeModal) upgradeModal.style.display = 'none'; }

function startRazorpayCheckout() {
    const user = window.auth ? window.auth.currentUser : null;
    if (!user) { alert("Sila log masuk dahulu."); return; }

    const options = {
        "key": "rzp_test_TRwCILaQmGidqj",
        "subscription_id": "sub_TRtaj04yS2uNrA",
        "name": "FOLLOWUPPRO",
        "description": "Langganan Bulanan Usahawan Pro",
        "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150",
        "handler": async function (response){
            try {
                await window.setDoc(window.doc(window.db, "users", user.uid), {
                    plan: "pro",
                    paymentId: response.razorpay_payment_id,
                    updatedAt: new Date().toISOString()
                }, { merge: true });

                isUserPro = true;
                alert("🎉 Pembayaran Berjaya! Akaun anda kini Pro.");
                closeUpgradeModal();
                fetchCustomersFromCloud();
            } catch (error) {
                alert("Pembayaran berjaya, tetapi gagal kemas kini akaun.");
            }
        },
        "prefill": { "email": user.email, "contact": "60123456789" },
        "theme": { "color": "#2563EB" }
    };

    closeUpgradeModal();
    const rzp = new Razorpay(options);
    rzp.open();
}
