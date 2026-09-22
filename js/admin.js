/**
 * Lógica del Panel de Administración (admin.html)
 * Autenticación por PIN, gestión de citas, especialistas/trabajadoras, horarios y sistema de notificaciones en tiempo real
 */

document.addEventListener("DOMContentLoaded", async () => {
    let data = await window.appStore.getData();
    let currentFilter = "all";
    let knownAppointmentIds = new Set((data.appointments || []).map(a => a.id));
    let notificationsEnabled = false;

    // 1. Verificación de Autenticación por PIN
    const authOverlay = document.getElementById("auth-overlay");
    const dashboardLayout = document.getElementById("admin-dashboard-layout");
    const pinForm = document.getElementById("auth-pin-form");
    const pinInput = document.getElementById("auth-pin-input");
    const errorMsg = document.getElementById("auth-error-msg");
    const logoutBtn = document.getElementById("btn-logout");

    const isAuthed = sessionStorage.getItem("admin_authenticated") === "true";
    if (isAuthed) {
        unlockDashboard();
    }

    pinForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const enteredPin = pinInput.value.trim();
        const realPin = data.business.adminPin || "1234";

        if (enteredPin === realPin) {
            sessionStorage.setItem("admin_authenticated", "true");
            unlockDashboard();
        } else {
            errorMsg.textContent = "PIN incorrecto. Intenta de nuevo.";
            pinInput.value = "";
            pinInput.focus();
        }
    });

    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("admin_authenticated");
        window.location.reload();
    });

    function unlockDashboard() {
        authOverlay.style.display = "none";
        dashboardLayout.style.display = "flex";
        initDashboard();
    }

    // 2. Inicialización del Dashboard
    async function initDashboard() {
        data = await window.appStore.getData();
        knownAppointmentIds = new Set((data.appointments || []).map(a => a.id));

        setupSidebarNavigation();
        renderAppointments();
        renderSpecialistsAdmin();
        renderServicesTable();
        renderScheduleForm();
        renderReviewsTable();
        renderBusinessForm();
        renderReportsSection();
        setupServiceModal();
        setupSpecialistModal();
        setupRealtimeNotifications();
    }

    // --- NAVEGACIÓN ENTRE SECCIONES ---
    function setupSidebarNavigation() {
        const navItems = document.querySelectorAll(".sidebar-nav li");
        const sections = document.querySelectorAll(".admin-section");
        const titleEl = document.getElementById("admin-page-title");

        const titlesMap = {
            appointments: "Citas Agendadas",
            specialists: "Equipo / Trabajadoras",
            services: "Servicios & Precios",
            schedule: "Horarios de Atención",
            reviews: "Gestión de Reseñas",
            business: "Datos del Negocio",
            reports: "📊 Reporte Mensual & Ganancias"
        };

        navItems.forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                const targetSec = item.getAttribute("data-section");

                navItems.forEach(i => i.classList.remove("active"));
                item.classList.add("active");

                sections.forEach(s => s.style.display = "none");
                const activeSec = document.getElementById(`section-${targetSec}`);
                if (activeSec) activeSec.style.display = "block";

                if (titleEl) titleEl.textContent = titlesMap[targetSec] || "Administración";
            });
        });

        // Filtros de Citas
        const filterBtns = document.querySelectorAll(".filter-tab-btn");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                currentFilter = btn.getAttribute("data-filter");
                renderAppointments();
            });
        });
    }

    // --- SECCIÓN 1: CITAS ---
    function renderAppointments() {
        const tbody = document.getElementById("appts-table-body");
        const totalMetric = document.getElementById("metric-total-appts");
        const pendingMetric = document.getElementById("metric-pending-appts");
        const revenueMetric = document.getElementById("metric-total-revenue");

        const appts = data.appointments || [];

        // Calcular métricas
        const totalCount = appts.length;
        const pendingCount = appts.filter(a => a.status === "pendiente").length;
        const revenue = appts
            .filter(a => a.status === "confirmada" || a.status === "completada")
            .reduce((sum, a) => sum + (a.totalPrice || 0), 0);

        if (totalMetric) totalMetric.textContent = totalCount;
        if (pendingMetric) pendingMetric.textContent = pendingCount;
        if (revenueMetric) revenueMetric.textContent = `$${revenue} MXN`;

        // Filtrar citas
        let filtered = appts;
        if (currentFilter !== "all") {
            filtered = appts.filter(a => (a.status || "confirmada").toLowerCase() === currentFilter);
        }

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding: 25px; color:#888;">No hay citas con este filtro.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(a => {
            const cleanPhone = (a.clientPhone || "").replace(/\D/g, "");
            const waMsg = encodeURIComponent(`Hola ${a.clientName}, te escribimos de ${data.business.name} respecto a tu cita agendada para el ${a.date} a las ${a.time}.`);
            const waLink = `https://wa.me/${cleanPhone}?text=${waMsg}`;
            const servicesText = (a.services || []).map(s => s.name).join(", ") || "-";

            return `
                <tr>
                    <td><strong>#${a.id}</strong></td>
                    <td>
                        <div style="font-weight: 600;">${escapeHtml(a.clientName)}</div>
                        <div style="font-size: 12px; color: #777;">📞 ${escapeHtml(a.clientPhone)}</div>
                    </td>
                    <td style="max-width: 180px;">${escapeHtml(servicesText)}</td>
                    <td><strong>${escapeHtml(a.specialistName || 'Cualquiera')}</strong></td>
                    <td>
                        <div>📅 ${a.date}</div>
                        <div style="font-size: 12px; color: #777;">⏰ ${a.time} - ${a.endTime || ''}</div>
                    </td>
                    <td><strong style="color: var(--admin-primary);">$${a.totalPrice || 0}</strong></td>
                    <td>
                        <span class="status-badge status-${a.status || 'confirmada'}">
                            ${a.status || 'confirmada'}
                        </span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <a href="${waLink}" target="_blank" class="btn-table-action btn-action-wa" title="Escribir al cliente por WhatsApp">
                                WA
                            </a>
                            <select class="btn-table-action btn-action-status" data-id="${a.id}">
                                <option value="confirmada" ${a.status === 'confirmada' ? 'selected' : ''}>Confirmada</option>
                                <option value="pendiente" ${a.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                                <option value="completada" ${a.status === 'completada' ? 'selected' : ''}>Completada</option>
                                <option value="cancelada" ${a.status === 'cancelada' ? 'selected' : ''}>Cancelada</option>
                            </select>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        // Eventos cambio de estado
        tbody.querySelectorAll(".btn-action-status").forEach(select => {
            select.addEventListener("change", async () => {
                const apptId = select.getAttribute("data-id");
                const newStatus = select.value;
                await window.appStore.updateAppointmentStatus(apptId, newStatus);
                data = await window.appStore.getData();
                renderAppointments();
            });
        });
    }

    // --- SECCIÓN: TRABAJADORAS / ESPECIALISTAS ---
    function renderSpecialistsAdmin() {
        const grid = document.getElementById("specialists-admin-grid");
        if (!grid) return;

        const specs = data.specialists || [];
        const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

        grid.innerHTML = specs.map(spec => {
            const isDefault = (spec.id === "any");
            const daysText = spec.workDays && spec.workDays.length > 0
                ? spec.workDays.map(d => dayNames[d]).join(", ")
                : "Sin días asignados";

            return `
                <div class="specialist-admin-card">
                    <div>
                        <div class="spec-card-top">
                            <img src="${spec.avatarUrl || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80'}" alt="${escapeHtml(spec.name)}" class="spec-admin-avatar">
                            <div class="spec-admin-info">
                                <h3>${escapeHtml(spec.name)}</h3>
                                <div class="spec-admin-role">${escapeHtml(spec.title || '')}</div>
                                <div class="spec-admin-days">🗓 ${escapeHtml(daysText)}</div>
                            </div>
                        </div>
                        <p class="spec-admin-bio">${escapeHtml(spec.bio || 'Sin descripción.')}</p>
                        ${spec.phone ? `<div style="font-size:12px; color:#555; margin-bottom:8px;">📱 WhatsApp citas: <strong>${escapeHtml(spec.phone)}</strong></div>` : ''}
                        ${spec.blockedDates && spec.blockedDates.length > 0 ? `<div style="font-size:11.5px; color:#d9534f; margin-bottom:6px;">🚫 Fechas bloqueadas: ${spec.blockedDates.join(", ")}</div>` : ''}
                    </div>
                    <div class="spec-card-actions">
                        <button class="btn-table-action btn-edit-spec" data-id="${spec.id}" style="background:#eef1f6; flex:1;">
                            Editar Perfil
                        </button>
                        ${!isDefault ? `
                            <button class="btn-table-action btn-delete-spec" data-id="${spec.id}" style="background:#dc3545; color:#fff;">
                                ✕
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join("");

        // Eventos
        grid.querySelectorAll(".btn-edit-spec").forEach(btn => {
            btn.addEventListener("click", () => {
                const specId = btn.getAttribute("data-id");
                openSpecialistModal(specId);
            });
        });

        grid.querySelectorAll(".btn-delete-spec").forEach(btn => {
            btn.addEventListener("click", async () => {
                const specId = btn.getAttribute("data-id");
                if (confirm("¿Estás seguro de eliminar a esta trabajadora?")) {
                    await window.appStore.deleteSpecialist(specId);
                    data = await window.appStore.getData();
                    renderSpecialistsAdmin();
                }
            });
        });
    }

    function setupSpecialistModal() {
        const modal = document.getElementById("specialist-modal");
        const openBtn = document.getElementById("btn-add-specialist");
        const closeBtn = document.getElementById("btn-close-spec-modal");
        const form = document.getElementById("specialist-form");

        if (!modal) return;

        openBtn.addEventListener("click", () => openSpecialistModal(null));
        closeBtn.addEventListener("click", () => modal.style.display = "none");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const idInput = document.getElementById("modal-spec-id").value;
            const nameInput = document.getElementById("modal-spec-name").value.trim();
            const titleInput = document.getElementById("modal-spec-title").value.trim();
            const phoneInput = document.getElementById("modal-spec-phone").value.trim();
            const avatarInput = document.getElementById("modal-spec-avatar").value.trim();
            const bioInput = document.getElementById("modal-spec-bio").value.trim();
            const blockedInput = document.getElementById("modal-spec-blocked").value.trim();

            const selectedDays = Array.from(document.querySelectorAll(".spec-workday-cb:checked"))
                .map(cb => parseInt(cb.value, 10));

            const blockedDates = blockedInput ? blockedInput.split(",").map(d => d.trim()).filter(Boolean) : [];

            const specId = idInput || "spec-" + Date.now();
            const specialistObj = {
                id: specId,
                name: nameInput,
                title: titleInput,
                phone: phoneInput || data.business.whatsapp,
                avatarUrl: avatarInput || "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80",
                bio: bioInput,
                workDays: selectedDays.length > 0 ? selectedDays : [0, 1, 2, 3, 4, 5, 6],
                blockedDates: blockedDates,
                active: true
            };

            await window.appStore.saveSpecialist(specialistObj);
            data = await window.appStore.getData();
            renderSpecialistsAdmin();
            modal.style.display = "none";
        });
    }

    function openSpecialistModal(specId) {
        const modal = document.getElementById("specialist-modal");
        const titleEl = document.getElementById("specialist-modal-title");
        const idInput = document.getElementById("modal-spec-id");
        const nameInput = document.getElementById("modal-spec-name");
        const roleInput = document.getElementById("modal-spec-title");
        const phoneInput = document.getElementById("modal-spec-phone");
        const avatarInput = document.getElementById("modal-spec-avatar");
        const bioInput = document.getElementById("modal-spec-bio");
        const blockedInput = document.getElementById("modal-spec-blocked");

        // Limpiar checkboxes
        document.querySelectorAll(".spec-workday-cb").forEach(cb => cb.checked = false);

        if (specId) {
            const spec = (data.specialists || []).find(s => s.id === specId);
            if (!spec) return;
            titleEl.textContent = "Editar Perfil de Trabajadora";
            idInput.value = spec.id;
            nameInput.value = spec.name;
            roleInput.value = spec.title || "";
            phoneInput.value = spec.phone || "";
            avatarInput.value = spec.avatarUrl || "";
            bioInput.value = spec.bio || "";
            blockedInput.value = (spec.blockedDates || []).join(", ");

            (spec.workDays || []).forEach(dayNum => {
                const cb = document.querySelector(`.spec-workday-cb[value="${dayNum}"]`);
                if (cb) cb.checked = true;
            });
        } else {
            titleEl.textContent = "Nueva Trabajadora";
            idInput.value = "";
            nameInput.value = "";
            roleInput.value = "";
            phoneInput.value = data.business.whatsapp;
            avatarInput.value = "";
            bioInput.value = "";
            blockedInput.value = "";
            [1, 2, 3, 4, 5].forEach(dayNum => {
                const cb = document.querySelector(`.spec-workday-cb[value="${dayNum}"]`);
                if (cb) cb.checked = true;
            });
        }

        modal.style.display = "flex";
    }

    // --- SECCIÓN 2: SERVICIOS ---
    function renderServicesTable() {
        const tbody = document.getElementById("services-table-body");
        if (!tbody) return;

        const services = data.services || [];
        const categories = data.categories || [];

        tbody.innerHTML = services.map(s => {
            const cat = categories.find(c => c.id === s.categoryId);
            const catName = cat ? cat.name : "General";

            return `
                <tr>
                    <td>
                        <div style="font-weight:600;">${escapeHtml(s.name)}</div>
                        <div style="font-size:11.5px; color:#777; max-width:260px;">${escapeHtml(s.description || '')}</div>
                    </td>
                    <td><span style="font-size:12px; background:#eee; padding:2px 8px; border-radius:4px;">${escapeHtml(catName)}</span></td>
                    <td><strong>$${s.price}</strong></td>
                    <td>${s.durationText || s.duration + ' min'}</td>
                    <td>
                        <span style="font-size:12px; color:${s.active !== false ? '#28a745' : '#dc3545'}; font-weight:600;">
                            ${s.active !== false ? 'Activo' : 'Pausado'}
                        </span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="btn-table-action btn-edit-service" data-id="${s.id}" style="background:#eef1f6; color:#333;">
                                Editar
                            </button>
                            <button class="btn-table-action btn-toggle-service" data-id="${s.id}" style="background:${s.active !== false ? '#ffc107' : '#28a745'}; color:#000;">
                                ${s.active !== false ? 'Pausar' : 'Activar'}
                            </button>
                            <button class="btn-table-action btn-delete-service" data-id="${s.id}" style="background:#dc3545; color:#fff;">
                                ✕
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join("");

        // Eventos botones
        tbody.querySelectorAll(".btn-edit-service").forEach(btn => {
            btn.addEventListener("click", () => {
                const srvId = btn.getAttribute("data-id");
                openServiceModal(srvId);
            });
        });

        tbody.querySelectorAll(".btn-toggle-service").forEach(btn => {
            btn.addEventListener("click", async () => {
                const srvId = btn.getAttribute("data-id");
                const srv = data.services.find(s => s.id === srvId);
                if (srv) {
                    srv.active = (srv.active === false);
                    await window.appStore.saveServices(data.services);
                    renderServicesTable();
                }
            });
        });

        tbody.querySelectorAll(".btn-delete-service").forEach(btn => {
            btn.addEventListener("click", async () => {
                const srvId = btn.getAttribute("data-id");
                if (confirm("¿Estás seguro de eliminar este servicio?")) {
                    data.services = data.services.filter(s => s.id !== srvId);
                    await window.appStore.saveServices(data.services);
                    renderServicesTable();
                }
            });
        });
    }

    function setupServiceModal() {
        const modal = document.getElementById("service-modal");
        const openBtn = document.getElementById("btn-add-service");
        const closeBtn = document.getElementById("btn-close-service-modal");
        const form = document.getElementById("service-form");
        const catSelect = document.getElementById("modal-service-category");

        catSelect.innerHTML = (data.categories || []).map(c => `
            <option value="${c.id}">${escapeHtml(c.name)}</option>
        `).join("");

        openBtn.addEventListener("click", () => openServiceModal(null));
        closeBtn.addEventListener("click", () => modal.style.display = "none");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const idInput = document.getElementById("modal-service-id").value;
            const nameInput = document.getElementById("modal-service-name").value.trim();
            const catInput = document.getElementById("modal-service-category").value;
            const priceInput = parseFloat(document.getElementById("modal-service-price").value) || 0;
            const durationInput = parseInt(document.getElementById("modal-service-duration").value, 10) || 60;
            const descInput = document.getElementById("modal-service-desc").value.trim();

            if (idInput) {
                const srv = data.services.find(s => s.id === idInput);
                if (srv) {
                    srv.name = nameInput;
                    srv.categoryId = catInput;
                    srv.price = priceInput;
                    srv.duration = durationInput;
                    srv.durationText = durationInput >= 60 ? `${durationInput / 60} h` : `${durationInput} min`;
                    srv.description = descInput;
                }
            } else {
                const newSrv = {
                    id: "srv-" + Date.now(),
                    name: nameInput,
                    categoryId: catInput,
                    price: priceInput,
                    duration: durationInput,
                    durationText: durationInput >= 60 ? `${durationInput / 60} h` : `${durationInput} min`,
                    description: descInput,
                    active: true
                };
                data.services.push(newSrv);
            }

            await window.appStore.saveServices(data.services);
            renderServicesTable();
            modal.style.display = "none";
        });
    }

    function openServiceModal(serviceId) {
        const modal = document.getElementById("service-modal");
        const titleEl = document.getElementById("service-modal-title");
        const idInput = document.getElementById("modal-service-id");
        const nameInput = document.getElementById("modal-service-name");
        const catSelect = document.getElementById("modal-service-category");
        const priceInput = document.getElementById("modal-service-price");
        const durationInput = document.getElementById("modal-service-duration");
        const descInput = document.getElementById("modal-service-desc");

        if (serviceId) {
            const srv = data.services.find(s => s.id === serviceId);
            if (!srv) return;
            titleEl.textContent = "Editar Tratamiento";
            idInput.value = srv.id;
            nameInput.value = srv.name;
            catSelect.value = srv.categoryId;
            priceInput.value = srv.price;
            durationInput.value = srv.duration;
            descInput.value = srv.description || "";
        } else {
            titleEl.textContent = "Nuevo Tratamiento";
            idInput.value = "";
            nameInput.value = "";
            priceInput.value = "";
            durationInput.value = "60";
            descInput.value = "";
        }

        modal.style.display = "flex";
    }

    // --- SECCIÓN 3: HORARIOS ---
    function renderScheduleForm() {
        const container = document.getElementById("schedule-days-container");
        const intervalSelect = document.getElementById("schedule-interval-select");
        const form = document.getElementById("schedule-config-form");
        if (!container || !data.schedule) return;

        if (intervalSelect) {
            intervalSelect.value = data.business.bookingIntervalMinutes || 30;
        }

        const days = [0, 1, 2, 3, 4, 5, 6];
        container.innerHTML = days.map(dayNum => {
            const s = data.schedule[dayNum] || { dayName: `Día ${dayNum}`, open: "11:00", close: "19:00", active: true };
            return `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f0f0f0;">
                    <div style="width:130px; font-weight:600;">
                        <label style="cursor:pointer;">
                            <input type="checkbox" class="sched-day-active" data-day="${dayNum}" ${s.active ? 'checked' : ''}>
                            <span style="margin-left:6px;">${s.dayName}</span>
                        </label>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <input type="time" class="sched-day-open" data-day="${dayNum}" value="${s.open}" style="padding:6px; border:1px solid #ccc; border-radius:4px;">
                        <span>a</span>
                        <input type="time" class="sched-day-close" data-day="${dayNum}" value="${s.close}" style="padding:6px; border:1px solid #ccc; border-radius:4px;">
                    </div>
                </div>
            `;
        }).join("");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const newSched = {};
            days.forEach(dayNum => {
                const activeBox = container.querySelector(`.sched-day-active[data-day="${dayNum}"]`);
                const openInput = container.querySelector(`.sched-day-open[data-day="${dayNum}"]`);
                const closeInput = container.querySelector(`.sched-day-close[data-day="${dayNum}"]`);

                newSched[dayNum] = {
                    dayName: data.schedule[dayNum].dayName,
                    open: openInput.value,
                    close: closeInput.value,
                    active: activeBox.checked
                };
            });

            const interval = parseInt(intervalSelect.value, 10);
            data.business.bookingIntervalMinutes = interval;
            await window.appStore.updateBusinessInfo({ bookingIntervalMinutes: interval });
            await window.appStore.saveSchedule(newSched);

            data = await window.appStore.getData();
            alert("¡Horarios actualizados exitosamente!");
        });
    }

    // --- SECCIÓN 4: RESEÑAS ---
    function renderReviewsTable() {
        const tbody = document.getElementById("reviews-table-body");
        if (!tbody) return;

        const revs = data.reviews || [];
        if (revs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px; color:#888;">No hay reseñas registradas.</td></tr>`;
            return;
        }

        tbody.innerHTML = revs.map(r => `
            <tr>
                <td><strong>${escapeHtml(r.author)}</strong></td>
                <td><span style="color:#f5a623;">${"★".repeat(r.rating || 5)}</span> (${r.rating}/5)</td>
                <td>${escapeHtml(r.date || '')}</td>
                <td style="max-width: 300px;">${escapeHtml(r.comment)}</td>
                <td>
                    <button class="btn-table-action btn-delete-review" data-id="${r.id}" style="background:#dc3545; color:#fff;">
                        Eliminar
                    </button>
                </td>
            </tr>
        `).join("");

        tbody.querySelectorAll(".btn-delete-review").forEach(btn => {
            btn.addEventListener("click", async () => {
                const revId = btn.getAttribute("data-id");
                if (confirm("¿Deseas eliminar esta reseña?")) {
                    data.reviews = data.reviews.filter(r => r.id !== revId);
                    await window.appStore.saveLocal(data);
                    renderReviewsTable();
                }
            });
        });
    }

    // --- SECCIÓN 5: NEGOCIO & PERFIL ---
    function renderBusinessForm() {
        const b = data.business || {};
        document.getElementById("biz-input-name").value = b.name || "";
        document.getElementById("biz-input-spec").value = b.specialty || "";
        document.getElementById("biz-input-address").value = b.address || "";
        document.getElementById("biz-input-whatsapp").value = b.whatsapp || "";
        document.getElementById("biz-input-phone").value = b.phone || "";
        document.getElementById("biz-input-instagram").value = b.instagram || "";
        document.getElementById("biz-input-pin").value = b.adminPin || "1234";
        document.getElementById("biz-input-cabin").value = b.cabinNotes || "";

        if (b.bannerPromo) {
            document.getElementById("biz-input-promo-title").value = b.bannerPromo.title || "";
            document.getElementById("biz-input-promo-desc").value = b.bannerPromo.desc || "";
        }

        const form = document.getElementById("business-config-form");
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const updatedBiz = {
                name: document.getElementById("biz-input-name").value.trim(),
                specialty: document.getElementById("biz-input-spec").value.trim(),
                address: document.getElementById("biz-input-address").value.trim(),
                whatsapp: document.getElementById("biz-input-whatsapp").value.trim(),
                phone: document.getElementById("biz-input-phone").value.trim(),
                instagram: document.getElementById("biz-input-instagram").value.trim(),
                adminPin: document.getElementById("biz-input-pin").value.trim(),
                cabinNotes: document.getElementById("biz-input-cabin").value.trim(),
                bannerPromo: {
                    title: document.getElementById("biz-input-promo-title").value.trim(),
                    desc: document.getElementById("biz-input-promo-desc").value.trim()
                }
            };

            await window.appStore.updateBusinessInfo(updatedBiz);
            data = await window.appStore.getData();
            alert("¡Datos del negocio guardados exitosamente!");
        });
    }

    // ==========================================================================
    // SISTEMA DE NOTIFICACIONES EN TIEMPO REAL (SONIDO, PUSH Y TOAST)
    // ==========================================================================

    function setupRealtimeNotifications() {
        const notifBtn = document.getElementById("btn-request-notif");
        const notifText = document.getElementById("notif-btn-text");

        // Comprobar permiso actual de notificaciones
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            notificationsEnabled = true;
            if (notifBtn) {
                notifBtn.classList.add("enabled");
                notifText.textContent = "Alertas Activadas ✓";
            }
        }

        if (notifBtn) {
            notifBtn.addEventListener("click", async () => {
                // Desbloquear audio contexto con clic del usuario
                playNotificationSound();

                if (typeof Notification !== "undefined") {
                    const perm = await Notification.requestPermission();
                    if (perm === "granted") {
                        notificationsEnabled = true;
                        notifBtn.classList.add("enabled");
                        notifText.textContent = "Alertas Activadas ✓";
                        showToastNotification({
                            clientName: "Sistema de Alertas",
                            services: [{ name: "Alertas sonoras y de escritorio activadas con éxito." }],
                            date: "Hoy",
                            time: "Ahora",
                            id: "OK"
                        });
                    }
                } else {
                    notifBtn.classList.add("enabled");
                    notifText.textContent = "Sonido Activado ✓";
                }
            });
        }

        // 1. Escuchar señal por BroadcastChannel
        try {
            if (window.BroadcastChannel) {
                const bc = new BroadcastChannel("cleanface_events");
                bc.onmessage = (event) => {
                    if (event.data && event.data.type === "NEW_APPOINTMENT") {
                        handleIncomingNewAppointment(event.data.appointment);
                    }
                };
            }
        } catch (e) {}

        // 2. Escuchar cambios de localStorage entre pestañas
        window.addEventListener("storage", (e) => {
            if (e.key === "cleanface_latest_appointment" && e.newValue) {
                try {
                    const parsed = JSON.parse(e.newValue);
                    if (parsed && parsed.appointment) {
                        handleIncomingNewAppointment(parsed.appointment);
                    }
                } catch (err) {}
            }
        });

        // 3. Sondeo periódico automático (Polling cada 5 segundos)
        setInterval(async () => {
            try {
                const freshData = await window.appStore.getData();
                const freshAppts = freshData.appointments || [];

                freshAppts.forEach(appt => {
                    if (!knownAppointmentIds.has(appt.id)) {
                        knownAppointmentIds.add(appt.id);
                        handleIncomingNewAppointment(appt);
                    }
                });
            } catch (err) {}
        }, 5000);
    }

    function handleIncomingNewAppointment(appt) {
        if (!appt || !appt.id) return;
        if (knownAppointmentIds.has(appt.id)) return;
        knownAppointmentIds.add(appt.id);

        // 1. Reproducir campanilla sonora (Web Audio API)
        playNotificationSound();

        // 2. Mostrar banner Toast en pantalla
        showToastNotification(appt);

        // 3. Notificación de escritorio si está permitida
        showDesktopNotification(appt);

        // 4. Actualizar tabla y métricas en vivo sin recargar
        window.appStore.getData().then(freshData => {
            data = freshData;
            renderAppointments();
        });
    }

    // Sintetizador de audio nativo Web Audio API (campanilla de 2 tonos)
    function playNotificationSound() {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const now = ctx.currentTime;

            // Tono 1 (D5 - 587.33 Hz)
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = "sine";
            osc1.frequency.setValueAtTime(587.33, now);
            gain1.gain.setValueAtTime(0.3, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.start(now);
            osc1.stop(now + 0.4);

            // Tono 2 más agudo y brillante (A5 - 880 Hz)
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(880, now + 0.15);
            gain2.gain.setValueAtTime(0.35, now + 0.15);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(now + 0.15);
            osc2.stop(now + 0.85);
        } catch (e) {
            console.log("Audio de alerta no reproducido", e);
        }
    }

    function showToastNotification(appt) {
        const toastContainer = document.getElementById("admin-toast-container");
        if (!toastContainer) return;

        const srvNames = (appt.services || []).map(s => s.name).join(", ");
        const toast = document.createElement("div");
        toast.className = "notification-toast";
        toast.innerHTML = `
            <div class="toast-icon">🔔</div>
            <div class="toast-body">
                <div class="toast-title">¡Nueva Cita Agendada Automáticamente!</div>
                <div class="toast-desc">
                    <strong>${escapeHtml(appt.clientName)}</strong> agendó <strong>${escapeHtml(srvNames)}</strong> con ${escapeHtml(appt.specialistName || 'Especialista')} para el <strong>${appt.date}</strong> a las <strong>${appt.time}</strong>. (Folio: #${appt.id})
                </div>
            </div>
            <button class="toast-close">&times;</button>
        `;

        toast.querySelector(".toast-close").addEventListener("click", () => {
            toast.remove();
        });

        toastContainer.appendChild(toast);

        // Auto remover después de 8 segundos
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = "0";
                toast.style.transform = "translateX(50px)";
                setTimeout(() => toast.remove(), 300);
            }
        }, 8000);
    }

    function showDesktopNotification(appt) {
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            const srvNames = (appt.services || []).map(s => s.name).join(", ");
            try {
                new Notification(`¡Nueva Cita en ${data.business.name}!`, {
                    body: `${appt.clientName} agendó ${srvNames} para el ${appt.date} a las ${appt.time}. Folio #${appt.id}`,
                    icon: data.business.avatarUrl
                });
            } catch (e) {}
        }
    }

    function escapeHtml(text) {
        if (!text) return "";
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    // =====================================================
    // SECCIÓN: REPORTE MENSUAL & GANANCIAS CON EXCEL
    // =====================================================
    function renderReportsSection() {
        const monthSelect = document.getElementById("report-month-select");
        const yearSelect = document.getElementById("report-year-select");
        const btnGenerate = document.getElementById("btn-generate-report");
        const btnExport = document.getElementById("btn-export-excel");
        if (!monthSelect || !yearSelect || !btnGenerate || !btnExport) return;

        // Poblar selector de años (últimos 3 años + año actual + siguiente)
        const currentYear = new Date().getFullYear();
        yearSelect.innerHTML = "";
        for (let y = currentYear + 1; y >= currentYear - 2; y--) {
            const opt = document.createElement("option");
            opt.value = y;
            opt.textContent = y;
            if (y === currentYear) opt.selected = true;
            yearSelect.appendChild(opt);
        }

        // Seleccionar mes actual por defecto
        monthSelect.value = new Date().getMonth();

        // Almacenar las citas filtradas para exportar
        let currentReportData = [];

        btnGenerate.addEventListener("click", () => {
            const selectedMonth = parseInt(monthSelect.value);
            const selectedYear = parseInt(yearSelect.value);
            generateReport(selectedMonth, selectedYear);
        });

        btnExport.addEventListener("click", () => {
            exportToExcel(currentReportData);
        });

        function generateReport(month, year) {
            const allAppts = data.appointments || [];
            const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

            // Filtrar citas del mes/año seleccionado
            const filtered = allAppts.filter(a => {
                if (!a.date) return false;
                const d = new Date(a.date + "T00:00:00");
                return d.getMonth() === month && d.getFullYear() === year;
            });

            currentReportData = filtered;

            // Ocultar/mostrar elementos
            document.getElementById("report-placeholder").style.display = "none";
            document.getElementById("report-empty").style.display = "none";
            document.getElementById("report-metrics").style.display = "none";
            document.getElementById("report-table-wrap").style.display = "none";
            btnExport.style.display = "none";

            if (filtered.length === 0) {
                document.getElementById("report-empty").style.display = "block";
                return;
            }

            // Calcular métricas
            const totalCitas = filtered.length;
            const totalIngresos = filtered.reduce((sum, a) => sum + (a.totalPrice || 0), 0);
            const promedio = totalCitas > 0 ? Math.round(totalIngresos / totalCitas) : 0;
            const totalServicios = filtered.reduce((sum, a) => sum + (a.services || []).length, 0);

            document.getElementById("rpt-metric-citas").textContent = totalCitas;
            document.getElementById("rpt-metric-ingresos").textContent = `$${totalIngresos.toLocaleString('es-MX')}`;
            document.getElementById("rpt-metric-promedio").textContent = `$${promedio.toLocaleString('es-MX')}`;
            document.getElementById("rpt-metric-servicios").textContent = totalServicios;
            document.getElementById("rpt-metric-ingresos").parentElement.previousElementSibling && null;

            document.getElementById("report-metrics").style.display = "grid";
            document.getElementById("report-period-title").textContent = `Detalle de Citas — ${monthNames[month]} ${year}`;
            document.getElementById("rpt-total-row").textContent = `$${totalIngresos.toLocaleString('es-MX')} MXN`;

            // Llenar tabla
            const tbody = document.getElementById("report-table-body");
            const statusLabels = { confirmada: "✅ Confirmada", completada: "🏁 Completada", pendiente: "⏳ Pendiente", cancelada: "❌ Cancelada" };

            tbody.innerHTML = filtered.map(a => {
                const srvNames = (a.services || []).map(s => s.name).join(", ") || "-";
                const status = statusLabels[a.status] || a.status || "Confirmada";
                return `
                    <tr style="border-bottom: 1px solid #f0f0f0;">
                        <td style="padding: 9px 12px; white-space: nowrap; font-weight: 600; color: var(--admin-primary);">#${escapeHtml(a.id)}</td>
                        <td style="padding: 9px 12px;">
                            <div style="font-weight: 600;">${escapeHtml(a.clientName)}</div>
                            <div style="font-size: 11px; color: #888;">${escapeHtml(a.clientPhone || "")}</div>
                        </td>
                        <td style="padding: 9px 12px; white-space: nowrap;">${escapeHtml(a.date)}</td>
                        <td style="padding: 9px 12px; white-space: nowrap;">${escapeHtml(a.time || "")}</td>
                        <td style="padding: 9px 12px;">${escapeHtml(a.specialistName || "-")}</td>
                        <td style="padding: 9px 12px; max-width: 200px; font-size: 12px;">${escapeHtml(srvNames)}</td>
                        <td style="padding: 9px 12px; text-align: right; font-weight: 700; color: #1d6f42;">$${(a.totalPrice || 0).toLocaleString('es-MX')}</td>
                        <td style="padding: 9px 12px; font-size: 12px; white-space: nowrap;">${status}</td>
                    </tr>
                `;
            }).join("");

            // Desglose por servicio
            const serviceCounts = {};
            filtered.forEach(a => {
                (a.services || []).forEach(s => {
                    const key = s.name || "Sin nombre";
                    if (!serviceCounts[key]) serviceCounts[key] = { count: 0, revenue: 0 };
                    serviceCounts[key].count++;
                    serviceCounts[key].revenue += s.price || 0;
                });
            });

            const sortedServices = Object.entries(serviceCounts).sort((a, b) => b[1].count - a[1].count);
            const breakdown = document.getElementById("report-services-breakdown");
            breakdown.innerHTML = sortedServices.map(([name, info], i) => `
                <div style="background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 10px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-size: 12px; color: #999; font-weight: 600;">#${i + 1}</div>
                        <div style="font-weight: 700; font-size: 13.5px; margin-top: 2px;">${escapeHtml(name)}</div>
                        <div style="font-size: 12px; color: #777; margin-top: 2px;">${info.count} veces realizad${info.count === 1 ? 'o' : 'os'}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 15px; font-weight: 800; color: #1d6f42;">$${info.revenue.toLocaleString('es-MX')}</div>
                        <div style="font-size: 11px; color: #999;">ingresos</div>
                    </div>
                </div>
            `).join("");

            document.getElementById("report-table-wrap").style.display = "block";
            btnExport.style.display = "inline-block";
        }

        function exportToExcel(appts) {
            if (!appts || appts.length === 0) {
                alert("No hay datos para exportar.");
                return;
            }

            const monthNames = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
            const month = parseInt(monthSelect.value);
            const year = parseInt(yearSelect.value);
            const periodName = `${monthNames[month]} ${year}`;

            // ---- HOJA 1: DETALLE DE CITAS ----
            const citasRows = [
                [`REPORTE MENSUAL DE CITAS — ${data.business.name}`],
                [`Período: ${periodName}`],
                [`Generado: ${new Date().toLocaleDateString('es-MX', { day:'2-digit', month:'long', year:'numeric', hour:'2-digit', minute:'2-digit' })}`],
                [],
                ["Folio", "Cliente", "Teléfono", "Fecha", "Hora", "Hora Fin", "Especialista", "Servicios", "Notas", "Total (MXN)", "Estado"]
            ];

            appts.forEach(a => {
                const srvNames = (a.services || []).map(s => s.name).join(", ") || "-";
                citasRows.push([
                    a.id,
                    a.clientName || "-",
                    a.clientPhone || "-",
                    a.date || "-",
                    a.time || "-",
                    a.endTime || "-",
                    a.specialistName || "-",
                    srvNames,
                    a.notes || "-",
                    a.totalPrice || 0,
                    a.status || "confirmada"
                ]);
            });

            // Fila totales
            const totalIngresos = appts.reduce((s, a) => s + (a.totalPrice || 0), 0);
            citasRows.push([]);
            citasRows.push(["", "", "", "", "", "", "", "", "TOTAL DEL MES:", totalIngresos, ""]);

            // ---- HOJA 2: DESGLOSE POR SERVICIO ----
            const serviceCounts = {};
            appts.forEach(a => {
                (a.services || []).forEach(s => {
                    const key = s.name || "Sin nombre";
                    if (!serviceCounts[key]) serviceCounts[key] = { count: 0, revenue: 0 };
                    serviceCounts[key].count++;
                    serviceCounts[key].revenue += s.price || 0;
                });
            });

            const serviciosRows = [
                [`SERVICIOS REALIZADOS — ${periodName}`],
                [],
                ["#", "Servicio / Tratamiento", "Veces Realizado", "Ingresos Generados (MXN)"]
            ];

            Object.entries(serviceCounts)
                .sort((a, b) => b[1].count - a[1].count)
                .forEach(([name, info], i) => {
                    serviciosRows.push([i + 1, name, info.count, info.revenue]);
                });

            serviciosRows.push([]);
            serviciosRows.push(["", "TOTAL", appts.length, totalIngresos]);

            // ---- CREAR LIBRO EXCEL ----
            const wb = XLSX.utils.book_new();

            const ws1 = XLSX.utils.aoa_to_sheet(citasRows);
            // Estilos de ancho de columnas
            ws1["!cols"] = [
                { wch: 12 }, { wch: 22 }, { wch: 16 }, { wch: 12 }, { wch: 8 },
                { wch: 8 }, { wch: 24 }, { wch: 40 }, { wch: 30 }, { wch: 14 }, { wch: 12 }
            ];

            const ws2 = XLSX.utils.aoa_to_sheet(serviciosRows);
            ws2["!cols"] = [{ wch: 5 }, { wch: 36 }, { wch: 18 }, { wch: 22 }];

            XLSX.utils.book_append_sheet(wb, ws1, "Citas del Mes");
            XLSX.utils.book_append_sheet(wb, ws2, "Servicios Realizados");

            const fileName = `Reporte_CleanFace_${monthNames[month]}_${year}.xlsx`;
            XLSX.writeFile(wb, fileName);
        }
    }

});
