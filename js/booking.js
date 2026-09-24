/**
 * Motor del Flujo de Agendamiento de Citas (booking.html)
 * Control de pasos, selección múltiple, calendario interactivo, turnos y confirmación
 */

document.addEventListener("DOMContentLoaded", async () => {
    const data = await window.appStore.getData();

    // Estado global de la reservación
    const bookingState = {
        currentStep: 1,
        selectedServices: [],
        selectedSpecialist: (data.specialists && data.specialists.length > 0) ? data.specialists[0] : { id: "larav", name: "Larav Beauty" },
        selectedDate: null,
        selectedTime: null,
        calYear: new Date().getFullYear(),
        calMonth: new Date().getMonth() // 0 = Ene, 8 = Sep, etc.
    };

    // Inicializar vistas
    initHeader();
    renderCategoriesAndServices();
    renderSpecialists();
    setupCalendar();
    setupNavigation();
    setupClientForm();
    checkUrlPreselection();

    // --- 1. CABECERA ---
    function initHeader() {
        const avatarEl = document.getElementById("booking-biz-avatar");
        const bizNameEl = document.getElementById("step-biz-name");
        if (avatarEl) avatarEl.src = data.business.avatarUrl;
        if (bizNameEl) bizNameEl.textContent = data.business.name;
    }

    // --- 2. PASO 1: SERVICIOS Y CATEGORÍAS ---
    function renderCategoriesAndServices() {
        const container = document.getElementById("services-accordions-container");
        if (!container) return;

        const categories = data.categories || [];
        const services = data.services || [];

        let html = "";
        categories.forEach(cat => {
            const catServices = services.filter(s => s.categoryId === cat.id && s.active !== false);
            if (catServices.length === 0) return;

            html += `
                <div class="category-accordion" id="cat-acc-${cat.id}">
                    <div class="category-header" data-cat="${cat.id}">
                        <div>
                            <span>${escapeHtml(cat.name)}</span>
                            <span class="cat-count" id="cat-count-${cat.id}"></span>
                        </div>
                        <span class="cat-caret">▼</span>
                    </div>
                    <div class="category-services-list">
                        ${catServices.map(srv => `
                            <div class="service-select-item" data-id="${srv.id}" id="srv-item-${srv.id}">
                                <div class="service-item-info">
                                    <div class="service-item-title">${escapeHtml(srv.name)}</div>
                                    <div class="service-item-meta">
                                        <span class="price">desde $${srv.price},</span>
                                        <span>⏱ ${srv.durationText || srv.duration + ' min'}</span>
                                    </div>
                                    ${srv.description ? `
                                        <div class="service-item-desc" id="desc-${srv.id}">
                                            <span class="desc-toggle-btn">Lee más...</span>
                                            <div class="desc-text">
                                                <p>${escapeHtml(srv.description)}</p>
                                                <span class="desc-toggle-btn">Leer menos</span>
                                            </div>
                                        </div>
                                    ` : ''}
                                </div>
                                <div class="service-select-check">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

        // Eventos acordeón
        container.querySelectorAll(".category-header").forEach(header => {
            header.addEventListener("click", () => {
                header.closest(".category-accordion").classList.toggle("collapsed");
            });
        });

        // Eventos toggle descripción "Lee más..."
        container.querySelectorAll(".desc-toggle-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const descWrap = btn.closest(".service-item-desc");
                descWrap.classList.toggle("expanded");
            });
        });

        // Eventos selección de servicio
        container.querySelectorAll(".service-select-item").forEach(item => {
            item.addEventListener("click", () => {
                const srvId = item.getAttribute("data-id");
                toggleServiceSelection(srvId);
            });
        });
    }

    function toggleServiceSelection(serviceId) {
        const service = (data.services || []).find(s => s.id === serviceId);
        if (!service) return;

        const idx = bookingState.selectedServices.findIndex(s => s.id === serviceId);
        const itemEl = document.getElementById(`srv-item-${serviceId}`);

        if (idx >= 0) {
            bookingState.selectedServices.splice(idx, 1);
            if (itemEl) itemEl.classList.remove("selected");
        } else {
            bookingState.selectedServices.push(service);
            if (itemEl) itemEl.classList.add("selected");
        }

        updateCategoryBadges();
        updateFloatingFooter();
    }

    function updateCategoryBadges() {
        (data.categories || []).forEach(cat => {
            const countInCat = bookingState.selectedServices.filter(s => s.categoryId === cat.id).length;
            const badgeEl = document.getElementById(`cat-count-${cat.id}`);
            if (badgeEl) {
                badgeEl.textContent = countInCat > 0 ? `(seleccionado: ${countInCat})` : "";
            }
        });
    }

    function updateFloatingFooter() {
        const footer = document.getElementById("booking-floating-footer");
        const countLabel = document.getElementById("footer-count-label");
        const priceLabel = document.getElementById("footer-price-label");
        const nextBtn = document.getElementById("btn-floating-next");

        if (bookingState.currentStep === 1) {
            const count = bookingState.selectedServices.length;
            if (count > 0) {
                footer.style.display = "flex";
                const total = bookingState.selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
                countLabel.textContent = `${count} ${count === 1 ? 'servicio' : 'servicios'} seleccionado${count > 1 ? 's' : ''}`;
                priceLabel.textContent = `Total estimado: $${total}`;
                nextBtn.disabled = false;
            } else {
                footer.style.display = "none";
            }
        } else if (bookingState.currentStep === 2) {
            footer.style.display = "flex";
            countLabel.textContent = bookingState.selectedSpecialist.name;
            priceLabel.textContent = "Paso 2 de 4";
            nextBtn.disabled = false;
        } else if (bookingState.currentStep === 3) {
            if (bookingState.selectedDate && bookingState.selectedTime) {
                footer.style.display = "flex";
                countLabel.textContent = `${formatDateShort(bookingState.selectedDate)} a las ${formatTime12h(bookingState.selectedTime)}`;
                priceLabel.textContent = "Horario listo";
                nextBtn.disabled = false;
            } else {
                footer.style.display = "none";
            }
        } else {
            footer.style.display = "none";
        }
    }

    function checkUrlPreselection() {
        const params = new URLSearchParams(window.location.search);
        const srvId = params.get("service");
        if (srvId) {
            toggleServiceSelection(srvId);
            const el = document.getElementById(`srv-item-${srvId}`);
            if (el) {
                setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
            }
        }
    }

    // --- 3. PASO 2: ESPECIALISTAS ---
    function renderSpecialists() {
        const container = document.getElementById("specialists-container");
        if (!container) return;

        const specs = (data.specialists || []).filter(s => s.active !== false);
        const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

        container.innerHTML = specs.map(spec => {
            const isSelected = (spec.id === bookingState.selectedSpecialist.id);
            let scheduleBadge = "";
            if (spec.id === "any") {
                scheduleBadge = "Todos los días hábiles";
            } else if (spec.workDays && spec.workDays.length > 0) {
                scheduleBadge = "Atiende: " + spec.workDays.map(d => dayNames[d]).join(", ");
            }

            return `
                <div class="specialist-card ${isSelected ? 'selected' : ''}" data-id="${spec.id}">
                    <img src="${spec.avatarUrl || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80'}" alt="${escapeHtml(spec.name)}" class="specialist-avatar-img">
                    <div class="specialist-details">
                        <div class="specialist-name">${escapeHtml(spec.name)}</div>
                        <div class="specialist-role">${escapeHtml(spec.title || 'Cosmetóloga')}</div>
                        ${scheduleBadge ? `<div class="specialist-schedule-badge">🗓 ${escapeHtml(scheduleBadge)}</div>` : ''}
                        ${spec.bio ? `<div class="specialist-bio">${escapeHtml(spec.bio)}</div>` : ''}
                    </div>
                    <div class="service-select-check">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                </div>
            `;
        }).join("");

        container.querySelectorAll(".specialist-card").forEach(card => {
            card.addEventListener("click", () => {
                const specId = card.getAttribute("data-id");
                bookingState.selectedSpecialist = specs.find(s => s.id === specId) || specs[0];
                container.querySelectorAll(".specialist-card").forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");

                // Reiniciar selección de fecha si cambia de especialista
                bookingState.selectedDate = null;
                bookingState.selectedTime = null;

                updateFloatingFooter();
            });
        });
    }

    // --- 4. PASO 3: CALENDARIO Y GENERACIÓN DE TURNOS ---
    function setupCalendar() {
        const prevBtn = document.getElementById("cal-prev-month");
        const nextBtn = document.getElementById("cal-next-month");

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                bookingState.calMonth--;
                if (bookingState.calMonth < 0) {
                    bookingState.calMonth = 11;
                    bookingState.calYear--;
                }
                renderMonthCalendar();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                bookingState.calMonth++;
                if (bookingState.calMonth > 11) {
                    bookingState.calMonth = 0;
                    bookingState.calYear++;
                }
                renderMonthCalendar();
            });
        }
    }

    function renderMonthCalendar() {
        const monthLabel = document.getElementById("cal-month-label");
        const tbody = document.getElementById("calendar-days-body");
        if (!monthLabel || !tbody) return;

        const monthsNames = [
            "enero", "febrero", "marzo", "abril", "mayo", "junio",
            "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
        ];

        monthLabel.textContent = `${monthsNames[bookingState.calMonth]}, ${bookingState.calYear}`;

        const firstDayOfMonth = new Date(bookingState.calYear, bookingState.calMonth, 1);
        const daysInMonth = new Date(bookingState.calYear, bookingState.calMonth + 1, 0).getDate();
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Domingo, 1 = Lunes...

        const today = new Date();
        today.setHours(0,0,0,0);

        let html = "<tr>";
        let dayCounter = 1;

        // Días previos en blanco
        for (let i = 0; i < startDayOfWeek; i++) {
            html += `<td></td>`;
        }

        let currentDayOfWeek = startDayOfWeek;
        const spec = bookingState.selectedSpecialist;

        while (dayCounter <= daysInMonth) {
            if (currentDayOfWeek === 7) {
                html += `</tr><tr>`;
                currentDayOfWeek = 0;
            }

            const thisDate = new Date(bookingState.calYear, bookingState.calMonth, dayCounter);
            thisDate.setHours(0,0,0,0);

            const isPast = thisDate < today;
            const isToday = thisDate.getTime() === today.getTime();
            const dateStr = `${bookingState.calYear}-${(bookingState.calMonth + 1).toString().padStart(2, '0')}-${dayCounter.toString().padStart(2, '0')}`;
            const isSelected = (bookingState.selectedDate === dateStr);

            // Filtrado dinámico según la especialista seleccionada
            const dayOfWeek = thisDate.getDay();
            let isDayActive = false;

            if (!isPast) {
                if (spec && spec.id !== "any") {
                    // Trabajadora específica: verificar sus días y horas
                    const worksThisDay = spec.workDays ? spec.workDays.includes(dayOfWeek) : true;
                    const isBlocked = spec.blockedDates ? spec.blockedDates.includes(dateStr) : false;
                    const scheduleConfig = (spec.workHours && spec.workHours[dayOfWeek]) || (data.schedule ? data.schedule[dayOfWeek] : null);
                    const isOpen = scheduleConfig ? scheduleConfig.active : false;
                    isDayActive = worksThisDay && !isBlocked && isOpen;
                } else {
                    // Cualquier especialista: verificar que al menos una trabaje ese día
                    const activeSpecs = (data.specialists || []).filter(s => s.active !== false && s.id !== "any");
                    const someoneWorks = activeSpecs.some(s => {
                        const worksThisDay = s.workDays ? s.workDays.includes(dayOfWeek) : true;
                        const isBlocked = s.blockedDates ? s.blockedDates.includes(dateStr) : false;
                        return worksThisDay && !isBlocked;
                    });
                    const bizOpen = data.schedule && data.schedule[dayOfWeek] && data.schedule[dayOfWeek].active;
                    isDayActive = someoneWorks && bizOpen;
                }
            }

            let classes = ["cal-day"];
            if (isPast) classes.push("day-past");
            if (isToday) classes.push("day-today");
            if (isDayActive) classes.push("day-active");
            if (isSelected) classes.push("day-selected");

            html += `
                <td>
                    <div class="${classes.join(" ")}" data-date="${dateStr}" data-active="${isDayActive ? 'true' : 'false'}">
                        ${dayCounter}
                    </div>
                </td>
            `;

            dayCounter++;
            currentDayOfWeek++;
        }

        // Completar última semana
        while (currentDayOfWeek < 7) {
            html += `<td></td>`;
            currentDayOfWeek++;
        }
        html += `</tr>`;

        tbody.innerHTML = html;

        // Asignar clic a los días activos
        tbody.querySelectorAll(".cal-day").forEach(dayEl => {
            dayEl.addEventListener("click", () => {
                if (dayEl.getAttribute("data-active") !== "true") return;
                const chosenDate = dayEl.getAttribute("data-date");
                bookingState.selectedDate = chosenDate;
                bookingState.selectedTime = null; // Reiniciar slot

                tbody.querySelectorAll(".cal-day").forEach(d => d.classList.remove("day-selected"));
                dayEl.classList.add("day-selected");

                renderTimeSlotsForDate(chosenDate);
                updateFloatingFooter();
            });
        });

        // Si no hay día seleccionado, seleccionar automáticamente el primer día hábil
        if (!bookingState.selectedDate) {
            const firstActive = tbody.querySelector(".cal-day.day-active");
            if (firstActive) {
                firstActive.click();
            } else {
                const slotsContainer = document.getElementById("slots-container");
                if (slotsContainer) slotsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:15px; color:#888;">No hay turnos disponibles para este mes con la especialista seleccionada.</div>`;
            }
        }
    }

    function renderTimeSlotsForDate(dateStr) {
        const container = document.getElementById("slots-container");
        const titleEl = document.getElementById("selected-day-title");
        if (!container) return;

        const dateObj = new Date(dateStr + "T00:00:00");
        const dayOfWeek = dateObj.getDay();
        const sched = data.schedule ? data.schedule[dayOfWeek] : null;
        const spec = bookingState.selectedSpecialist;

        if (titleEl) {
            titleEl.textContent = `Turnos disponibles para ${formatDateFull(dateStr)}`;
        }

        let openTime = sched ? sched.open : "11:00";
        let closeTime = sched ? sched.close : "19:00";
        let isDayActive = sched ? sched.active : false;

        // Horarios individuales de la especialista si están definidos
        if (spec && spec.id !== "any" && spec.workHours && spec.workHours[dayOfWeek]) {
            openTime = spec.workHours[dayOfWeek].open;
            closeTime = spec.workHours[dayOfWeek].close;
            isDayActive = spec.workHours[dayOfWeek].active;
        }

        if (!isDayActive) {
            container.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:15px; color:#888;">Cerrado en esta fecha.</div>`;
            return;
        }

        // Generar intervalos
        const interval = data.business.bookingIntervalMinutes || 30;
        const [openH, openM] = openTime.split(":").map(Number);
        const [closeH, closeM] = closeTime.split(":").map(Number);

        let currentTotalMins = openH * 60 + openM;
        const closeTotalMins = closeH * 60 + closeM;

        const slots = [];
        while (currentTotalMins < closeTotalMins) {
            const h = Math.floor(currentTotalMins / 60);
            const m = currentTotalMins % 60;
            const timeStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            slots.push(timeStr);
            currentTotalMins += interval;
        }

        // Verificar citas ocupadas en tiempo real para bloquear duplicados
        const existingAppts = (data.appointments || []).filter(a => a.date === dateStr && a.status !== 'cancelada');

        container.innerHTML = slots.map(timeStr => {
            const isOccupied = existingAppts.some(a => {
                if (a.time !== timeStr) return false;
                if (spec.id === "any") return true;
                return (a.specialistId === spec.id || a.specialistId === "any");
            });

            const isSelected = (bookingState.selectedTime === timeStr);

            return `
                <button type="button" class="time-slot-btn ${isSelected ? 'active' : ''} ${isOccupied ? 'disabled' : ''}" 
                        data-time="${timeStr}" ${isOccupied ? 'disabled title="Turno ya ocupado"' : ''}>
                    ${formatTime12h(timeStr)}
                </button>
            `;
        }).join("");

        container.querySelectorAll(".time-slot-btn:not(.disabled)").forEach(btn => {
            btn.addEventListener("click", () => {
                bookingState.selectedTime = btn.getAttribute("data-time");
                container.querySelectorAll(".time-slot-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                updateFloatingFooter();
            });
        });
    }

    // --- 5. NAVEGACIÓN ENTRE PASOS ---
    function setupNavigation() {
        const nextBtn = document.getElementById("btn-floating-next");
        const backBtn = document.getElementById("btn-booking-back");

        nextBtn.addEventListener("click", () => {
            if (bookingState.currentStep === 1) {
                if (bookingState.selectedServices.length === 0) {
                    alert("Por favor selecciona al menos un servicio.");
                    return;
                }
                goToStep(2);
            } else if (bookingState.currentStep === 2) {
                goToStep(3);
            } else if (bookingState.currentStep === 3) {
                if (!bookingState.selectedDate || !bookingState.selectedTime) {
                    alert("Por favor selecciona una fecha y horario.");
                    return;
                }
                goToStep(4);
            }
        });

        backBtn.addEventListener("click", () => {
            if (bookingState.currentStep > 1) {
                goToStep(bookingState.currentStep - 1);
            } else {
                window.location.href = "index.html";
            }
        });
    }

    function goToStep(stepNumber) {
        bookingState.currentStep = stepNumber;

        // Ocultar todos los paneles
        document.querySelectorAll(".booking-step-pane").forEach(p => p.classList.remove("active"));

        const titleText = document.getElementById("step-title-text");

        if (stepNumber === 1) {
            document.getElementById("pane-step-services").classList.add("active");
            titleText.textContent = "Seleccionar servicio";
        } else if (stepNumber === 2) {
            document.getElementById("pane-step-specialist").classList.add("active");
            titleText.textContent = "Especialista";

            const count = bookingState.selectedServices.length;
            const totalMins = bookingState.selectedServices.reduce((sum, s) => sum + (s.duration || 60), 0);
            document.getElementById("spec-summary-services").textContent = `${count} ${count === 1 ? 'servicio' : 'servicios'}`;
            document.getElementById("spec-summary-duration").textContent = formatDuration(totalMins);

        } else if (stepNumber === 3) {
            document.getElementById("pane-step-datetime").classList.add("active");
            titleText.textContent = "Fecha y hora";

            const names = bookingState.selectedServices.map(s => s.name).join(", ");
            const total = bookingState.selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
            document.getElementById("date-summary-services").textContent = names;
            document.getElementById("date-summary-price").textContent = `$${total}`;

            renderMonthCalendar();

        } else if (stepNumber === 4) {
            document.getElementById("pane-step-client").classList.add("active");
            titleText.textContent = "Tus datos";

            const total = bookingState.selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
            const totalMins = bookingState.selectedServices.reduce((sum, s) => sum + (s.duration || 60), 0);

            document.getElementById("review-services-name").textContent = bookingState.selectedServices.map(s => s.name).join(", ");
            document.getElementById("review-specialist-name").textContent = bookingState.selectedSpecialist.name;
            document.getElementById("review-datetime").textContent = `${formatDateFull(bookingState.selectedDate)} a las ${formatTime12h(bookingState.selectedTime)}`;
            document.getElementById("review-duration").textContent = formatDuration(totalMins);
            document.getElementById("review-total-price").textContent = `$${total} ${data.business.currencyCode || 'MXN'}`;

        } else if (stepNumber === 5) {
            document.getElementById("pane-step-confirmation").classList.add("active");
            titleText.textContent = "Confirmación";
            document.getElementById("btn-booking-back").style.visibility = "hidden";
        }

        window.scrollTo({ top: 0, behavior: "smooth" });
        updateFloatingFooter();
    }

    // --- 6. PASO 4 Y 5: FORMULARIO Y AGENDAMIENTO AUTOMÁTICO ---
    function setupClientForm() {
        const form = document.getElementById("booking-client-form");
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("client-name");
            const phoneCodeSelect = document.getElementById("client-phone-code");
            const phoneInput = document.getElementById("client-phone");
            const emailInput = document.getElementById("client-email");
            const notesInput = document.getElementById("client-notes");

            const clientName = nameInput.value.trim();
            const rawPhone = phoneInput.value.trim().replace(/\D/g, "");
            const fullPhone = phoneCodeSelect.value + rawPhone;
            const clientEmail = emailInput.value.trim();
            const clientNotes = notesInput.value.trim();

            if (!clientName || !rawPhone) {
                alert("Por favor completa tu nombre y número de teléfono.");
                return;
            }

            // Generar folio único
            const folio = "CF-" + Math.floor(10000 + Math.random() * 90000);
            const total = bookingState.selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
            const totalMins = bookingState.selectedServices.reduce((sum, s) => sum + (s.duration || 60), 0);

            // Calcular hora de término
            const [h, m] = bookingState.selectedTime.split(":").map(Number);
            const endMins = h * 60 + m + totalMins;
            const endH = Math.floor(endMins / 60);
            const endM = endMins % 60;
            const endTimeStr = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

            // Cita creada con estado "confirmada" (agendamiento automático inmediato)
            const newAppointment = {
                id: folio,
                clientName: clientName,
                clientPhone: fullPhone,
                clientEmail: clientEmail,
                specialistId: bookingState.selectedSpecialist.id,
                specialistName: bookingState.selectedSpecialist.name,
                specialistPhone: bookingState.selectedSpecialist.phone || data.business.whatsapp,
                date: bookingState.selectedDate,
                time: bookingState.selectedTime,
                endTime: endTimeStr,
                durationMins: totalMins,
                services: bookingState.selectedServices.map(s => ({ id: s.id, name: s.name, price: s.price })),
                totalPrice: total,
                status: "confirmada", // Agendada automáticamente
                notes: clientNotes,
                createdAt: new Date().toISOString()
            };

            // Guardar cita y emitir señal de notificación en vivo
            await window.appStore.saveAppointment(newAppointment);

            // Preparar y mostrar pantalla de confirmación
            populateConfirmationScreen(newAppointment);
            goToStep(5);
        });
    }

    function populateConfirmationScreen(appt) {
        document.getElementById("conf-folio-code").textContent = `Folio: #${appt.id}`;
        document.getElementById("conf-client-name").textContent = appt.clientName;
        document.getElementById("conf-services-list").textContent = appt.services.map(s => s.name).join(", ");
        document.getElementById("conf-specialist-name").textContent = appt.specialistName;
        document.getElementById("conf-date").textContent = formatDateFull(appt.date);
        document.getElementById("conf-time").textContent = `${formatTime12h(appt.time)} - ${formatTime12h(appt.endTime)}`;
        document.getElementById("conf-address").textContent = data.business.address;
        document.getElementById("conf-total-price").textContent = `$${appt.totalPrice} MXN`;

        // =====================================================================
        // MENSAJE 1 — NOTIFICACIÓN AUTOMÁTICA AL NEGOCIO / DUEÑA
        // Se abre automáticamente desde el dispositivo de la clienta hacia el
        // número del negocio (o la especialista asignada).
        // =====================================================================
        const ownerNumber = (data.business.whatsapp || "").replace(/\D/g, "");
        const ownerMessage =
            `🔔 *NUEVA CITA AGENDADA EN PORTAL WEB*\n\n` +
            `📋 *Folio:* #${appt.id}\n` +
            `👤 *Cliente:* ${appt.clientName}\n` +
            `📞 *Teléfono:* ${appt.clientPhone}\n` +
            `💆‍♀️ *Tratamiento(s):* ${appt.services.map(s => `${s.name} ($${s.price})`).join(", ")}\n` +
            `👩‍⚕️ *Especialista:* ${appt.specialistName}\n` +
            `🗓 *Fecha:* ${formatDateFull(appt.date)}\n` +
            `⏰ *Hora:* ${formatTime12h(appt.time)} a ${formatTime12h(appt.endTime)}\n` +
            `💰 *Total:* $${appt.totalPrice} MXN\n` +
            (appt.notes ? `📝 *Notas:* ${appt.notes}\n` : ``) +
            `\n_Cita registrada automáticamente desde el portal de reservaciones._`;

        // ✅ Auto-abrir WhatsApp hacia el NEGOCIO después de 1.5 segundos
        if (ownerNumber) {
            setTimeout(() => {
                window.open(`https://wa.me/${ownerNumber}?text=${encodeURIComponent(ownerMessage)}`, "_blank");
            }, 1500);
        }

        // =====================================================================
        // MENSAJE 2 — CONFIRMACIÓN OPCIONAL DE LA CLIENTA (botón en pantalla)
        // El texto es en primera persona: la clienta elige enviarlo o no.
        // =====================================================================
        const clientMessage =
            `¡Hola ${data.business.name}! 💆‍♀️\n\n` +
            `Acabo de agendar mi cita en su portal web y quiero confirmar mi asistencia:\n\n` +
            `📋 *Folio:* #${appt.id}\n` +
            `💆‍♀️ *Tratamiento(s):* ${appt.services.map(s => s.name).join(", ")}\n` +
            `👩‍⚕️ *Especialista:* ${appt.specialistName}\n` +
            `🗓 *Fecha:* ${formatDateFull(appt.date)}\n` +
            `⏰ *Hora:* ${formatTime12h(appt.time)}\n\n` +
            `¡Muchas gracias! 😊`;

        const waBtn = document.getElementById("btn-conf-whatsapp");
        waBtn.href = `https://wa.me/${ownerNumber}?text=${encodeURIComponent(clientMessage)}`;

        // 3. Enlace de Google Calendar
        const gcalBtn = document.getElementById("btn-conf-gcal");
        const startDateStr = appt.date.replace(/-/g, "") + "T" + appt.time.replace(":", "") + "00";
        const endDateStr = appt.date.replace(/-/g, "") + "T" + appt.endTime.replace(":", "") + "00";
        const gcalTitle = encodeURIComponent(`Cita en ${data.business.name} - ${appt.services.map(s => s.name).join(", ")}`);
        const gcalDetails = encodeURIComponent(`Cita confirmada con ${appt.specialistName}.\nFolio: #${appt.id}\nTotal: $${appt.totalPrice}`);
        const gcalLocation = encodeURIComponent(data.business.address);

        gcalBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcalTitle}&dates=${startDateStr}/${endDateStr}&details=${gcalDetails}&location=${gcalLocation}`;
    }

    // --- UTILIDADES ---
    function formatTime12h(timeStr) {
        if (!timeStr) return "";
        const [hours, minutes] = timeStr.split(":").map(Number);
        const period = hours >= 12 ? "p. m." : "a. m.";
        const h12 = hours % 12 === 0 ? 12 : hours % 12;
        return `${h12}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    function formatDateShort(dateStr) {
        if (!dateStr) return "";
        const parts = dateStr.split("-");
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    function formatDateFull(dateStr) {
        if (!dateStr) return "";
        const dateObj = new Date(dateStr + "T00:00:00");
        const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        return `${days[dateObj.getDay()]}, ${dateObj.getDate()} de ${months[dateObj.getMonth()]} de ${dateObj.getFullYear()}`;
    }

    function formatDuration(mins) {
        if (mins < 60) return `${mins} min`;
        const hours = Math.floor(mins / 60);
        const remMins = mins % 60;
        if (remMins === 0) return `${hours} h`;
        return `${hours} h ${remMins} min`;
    }

    function escapeHtml(text) {
        if (!text) return "";
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
});
