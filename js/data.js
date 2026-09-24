/**
 * Data inicial y gestor de almacenamiento (Local & API)
 * Larav Beuty Studio | Manicura
 */

const DEFAULT_DATA = {
    business: {
        name: "Larav Beuty Studio | Manicura",
        tagline: "Estudio de Belleza & Manicura",
        about: "Especialistas en Uñas, Maquillaje, Spa de Cejas y Estilizado de cabello ✨",
        specialty: "Uñas · Maquillaje · Spa de Cejas · Cabello",
        address: "Avenida 11 #241",
        phone: "+526621819929",
        whatsapp: "526621819929",
        instagram: "https://instagram.com/larav_beutystudio",
        instagramHandle: "@larav_beutystudio",
        mapCoordinates: { lat: 29.0892, lng: -110.9613 },
        coverUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
        avatarUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80",
        cabinNotes: "Atención con previa cita en nuestras estaciones de belleza y manicura.",
        currencySymbol: "$",
        currencyCode: "MXN",
        bookingIntervalMinutes: 30,
        adminPin: "1234",
        bannerPromo: {
            title: "PROMOCIONES DEL MES",
            desc: "Manicura Rusa + Gelish $399\nSpa de Cejas Completo $450\nMaquillaje Social $550\nOndas Glam $280"
        }
    },
    specialists: [
        {
            id: "larav",
            name: "Larav Beauty",
            title: "Master en Uñas & Estilismo",
            bio: "Especialista en manicura rusa, uñas acrílicas con diseño, visagismo y estilizado.",
            avatarUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80",
            phone: "526621819929",
            workDays: [1, 2, 3, 4, 5, 6],
            workHours: {
                1: { open: "10:00", close: "19:00", active: true },
                2: { open: "10:00", close: "19:00", active: true },
                3: { open: "10:00", close: "19:00", active: true },
                4: { open: "10:00", close: "19:00", active: true },
                5: { open: "10:00", close: "19:00", active: true },
                6: { open: "10:00", close: "18:00", active: true }
            },
            blockedDates: [],
            active: true
        }
    ],
    schedule: {
        0: { dayName: "Domingo", open: "11:00", close: "16:00", active: false },
        1: { dayName: "Lunes", open: "10:00", close: "19:00", active: true },
        2: { dayName: "Martes", open: "10:00", close: "19:00", active: true },
        3: { dayName: "Miércoles", open: "10:00", close: "19:00", active: true },
        4: { dayName: "Jueves", open: "10:00", close: "19:00", active: true },
        5: { dayName: "Viernes", open: "10:00", close: "19:00", active: true },
        6: { dayName: "Sábado", open: "10:00", close: "18:00", active: true }
    },
    categories: [
        { id: "unas", name: "UÑAS" },
        { id: "maquillaje", name: "MAQUILLAJE" },
        { id: "cejas", name: "SPA DE CEJAS" },
        { id: "cabello", name: "ESTILIZADO DE CABELLO" }
    ],
    services: [
        {
            id: "srv-unas-manicura-rusa",
            categoryId: "unas",
            name: "Manicura Rusa / Combinada",
            price: 350,
            duration: 45,
            durationText: "45 min",
            description: "Limpieza profunda de cutícula con torno, nivelación de uña natural y acabado impecable.",
            active: true
        },
        {
            id: "srv-unas-gelish",
            categoryId: "unas",
            name: "Aplicación de Gelish",
            price: 280,
            duration: 45,
            durationText: "45 min",
            description: "Esmaltado semipermanente de alta durabilidad con base niveladora y amplia gama de tonos.",
            active: true
        },
        {
            id: "srv-unas-acrilicas",
            categoryId: "unas",
            name: "Uñas Acrílicas (Set Nuevo)",
            price: 550,
            duration: 90,
            durationText: "1 h 30 min",
            description: "Extensiones acrílicas esculturales o con tip, acabado natural, punta a elección y diseño.",
            active: true
        },
        {
            id: "srv-unas-retoque",
            categoryId: "unas",
            name: "Retoque de Acrílico",
            price: 380,
            duration: 60,
            durationText: "1 h",
            description: "Relleno y balance de crecimiento de acrílico con cambio de esmaltado gelish.",
            active: true
        },
        {
            id: "srv-unas-pedicura-spa",
            categoryId: "unas",
            name: "Pedicura Spa & Gelish",
            price: 420,
            duration: 60,
            durationText: "1 h",
            description: "Exfoliación hidratante, tratamiento de asperezas, masaje relajante en pies y esmalte en gel.",
            active: true
        },
        {
            id: "srv-maq-social",
            categoryId: "maquillaje",
            name: "Maquillaje Social (Día / Noche)",
            price: 650,
            duration: 60,
            durationText: "1 h",
            description: "Técnica de piel blindada anti-transferencia, contornos, sombras difuminadas y pestañas de tira.",
            active: true
        },
        {
            id: "srv-maq-glam",
            categoryId: "maquillaje",
            name: "Maquillaje Glam / Fiesta",
            price: 800,
            duration: 75,
            durationText: "1 h 15 min",
            description: "Efectos glitter, delineado gráfico o smokey eye de impacto con pestañas 3D de alta gama.",
            active: true
        },
        {
            id: "srv-maq-editorial",
            categoryId: "maquillaje",
            name: "Maquillaje para Fotografía / Graduación",
            price: 750,
            duration: 60,
            durationText: "1 h",
            description: "Piel HD de alta definición diseñada especialmente para lucir impecable bajo luces y cámaras.",
            active: true
        },
        {
            id: "srv-maq-novia",
            categoryId: "maquillaje",
            name: "Maquillaje Novia / Quinceañera",
            price: 1500,
            duration: 90,
            durationText: "1 h 30 min",
            description: "Protocolo nupcial de máxima duración a prueba de lágrimas, hidratación de lujo y pestaña mink.",
            active: true
        },
        {
            id: "srv-cejas-diseno",
            categoryId: "cejas",
            name: "Diseño y Perfilado de Cejas",
            price: 180,
            duration: 30,
            durationText: "30 min",
            description: "Visagismo personalizado según la proporción de tu rostro y depilación con cera y pinza.",
            active: true
        },
        {
            id: "srv-cejas-laminado",
            categoryId: "cejas",
            name: "Laminado de Cejas (Brow Lamination)",
            price: 400,
            duration: 45,
            durationText: "45 min",
            description: "Direccionamiento y fijación del vello para cejas con aspecto más poblado, peinado y definido.",
            active: true
        },
        {
            id: "srv-cejas-henna",
            categoryId: "cejas",
            name: "Tinte de Henna / Cejas HD",
            price: 320,
            duration: 40,
            durationText: "40 min",
            description: "Pigmentación vegetal de ceja y piel para un sombreado natural que resalta tu mirada.",
            active: true
        },
        {
            id: "srv-cejas-spa-completo",
            categoryId: "cejas",
            name: "Spa de Cejas Completo (Laminado + Henna + Perfilado)",
            price: 600,
            duration: 60,
            durationText: "1 h",
            description: "El paquete estrella: visagismo, depilación, laminado, nutrición con keratina y color henna.",
            active: true
        },
        {
            id: "srv-cab-ondas",
            categoryId: "cabello",
            name: "Ondas y Rizos Glam",
            price: 350,
            duration: 45,
            durationText: "45 min",
            description: "Ondas al agua, estilo Hollywood o playeras desenfadadas con fijación profesional anti-humedad.",
            active: true
        },
        {
            id: "srv-cab-alaciado",
            categoryId: "cabello",
            name: "Alaciado Exprés & Sellado de Puntas",
            price: 300,
            duration: 45,
            durationText: "45 min",
            description: "Planchado térmico con protectores de calor y gotas de seda para un brillo espejo.",
            active: true
        },
        {
            id: "srv-cab-peinado",
            categoryId: "cabello",
            name: "Peinado Recogido o Semirecogido",
            price: 550,
            duration: 60,
            durationText: "1 h",
            description: "Diseño de peinado para eventos sociales, coctel, bodas o graduaciones.",
            active: true
        },
        {
            id: "srv-cab-botox",
            categoryId: "cabello",
            name: "Tratamiento Botox Capilar / Cauterización",
            price: 700,
            duration: 75,
            durationText: "1 h 15 min",
            description: "Nutrición capilar intensiva anti-frizz, reconstrucción de hebra y suavidad inmediata.",
            active: true
        }
    ],
    gallery: [
        {
            id: "gal-1",
            album: "unas",
            title: "Set Acrílico y Francesa Moderna",
            src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
            thumb: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=400&q=80",
            comment: "Uñas acrílicas esculturales con terminado almendra y french blanco."
        },
        {
            id: "gal-2",
            album: "unas",
            title: "Manicura Rusa con Gelish Nude",
            src: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
            thumb: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=400&q=80",
            comment: "Limpieza de cutícula en seco y nivelación perfecta."
        },
        {
            id: "gal-3",
            album: "maquillaje",
            title: "Maquillaje Social Glam",
            src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
            thumb: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
            comment: "Piel satinada, labios nude y pestañas para evento de noche."
        },
        {
            id: "gal-4",
            album: "cejas",
            title: "Laminado y Tinte de Cejas",
            src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
            thumb: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80",
            comment: "Definición y volumen natural con efecto peinado hacia arriba."
        },
        {
            id: "gal-5",
            album: "cabello",
            title: "Ondas de Sirena y Brillo Espejo",
            src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
            thumb: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80",
            comment: "Estilizado con protección térmica para movimiento y suavidad."
        }
    ],
    reviews: [
        {
            id: "rev-1",
            author: "Fernanda López",
            rating: 5,
            date: "Hace 2 días",
            comment: "¡El mejor lugar de uñas de Hermosillo! La manicura rusa me duró intacta más de 3 semanas. Súper recomendadas.",
            avatar: "F"
        },
        {
            id: "rev-2",
            author: "Valeria Ramos",
            rating: 5,
            date: "Hace 1 semana",
            comment: "Me hice maquillaje social y ondas para una boda y me duró toda la noche intacto. La atención en el estudio es de 10.",
            avatar: "V"
        },
        {
            id: "rev-3",
            author: "Carolina Mendívil",
            rating: 5,
            date: "Hace 2 semanas",
            comment: "El spa de cejas me encantó, el laminado con henna le dio un marco hermoso a mi rostro. Ya agendé mi siguiente cita.",
            avatar: "C"
        }
    ],
    appointments: [
        {
            id: "LV-1001",
            clientName: "Ana Morales",
            clientPhone: "6621819929",
            clientEmail: "ana@ejemplo.com",
            specialistId: "larav",
            specialistName: "Larav Beauty",
            date: "2026-09-25",
            time: "11:00",
            endTime: "11:45",
            services: [
                { id: "srv-unas-manicura-rusa", name: "Manicura Rusa / Combinada", price: 350, duration: 45 }
            ],
            totalPrice: 350,
            status: "confirmada",
            notes: "Cita inicial",
            createdAt: "2026-09-24T10:00:00Z"
        }
    ]
};

/**
 * Gestor de persistencia híbrido y emisor de notificaciones en tiempo real
 */
class DataStore {
    constructor() {
        this.STORAGE_KEY = "larav_studio_data_v2";
        this.hasApi = null;
        this.broadcastChannel = null;

        try {
            if (typeof window !== "undefined" && window.BroadcastChannel) {
                this.broadcastChannel = new BroadcastChannel("larav_studio_events");
            }
        } catch (e) {
            console.log("BroadcastChannel no soportado", e);
        }

        this.init();
    }

    init() {
        // Limpieza de claves previas de versiones anteriores para actualizar automáticamente
        try {
            if (localStorage.getItem("cleanface_app_data_v2")) {
                localStorage.removeItem("cleanface_app_data_v2");
            }
            if (localStorage.getItem("cleanface_latest_appointment")) {
                localStorage.removeItem("cleanface_latest_appointment");
            }
            if (localStorage.getItem("larav_studio_data_v1")) {
                localStorage.removeItem("larav_studio_data_v1");
            }
        } catch (e) {}

        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            this.saveLocal(DEFAULT_DATA);
        } else {
            try {
                const parsed = JSON.parse(stored);
                // Si la versión guardada aún tiene especialistas anteriores
                if (!parsed.specialists || parsed.specialists.length > 1 || parsed.specialists[0].id !== "larav") {
                    parsed.specialists = DEFAULT_DATA.specialists;
                    this.saveLocal(parsed);
                }
            } catch (e) {
                this.saveLocal(DEFAULT_DATA);
            }
        }
    }

    saveLocal(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    getLocal() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : DEFAULT_DATA;
        } catch (e) {
            console.error("Error al leer localStorage", e);
            return DEFAULT_DATA;
        }
    }

    async checkApi() {
        if (this.hasApi !== null) return this.hasApi;
        try {
            const res = await fetch("api.php?action=ping", { method: "GET" });
            if (res.ok) {
                const json = await res.json();
                this.hasApi = (json.status === "ok");
                return this.hasApi;
            }
        } catch (e) {
            this.hasApi = false;
        }
        return false;
    }

    async getData() {
        const isApiAvailable = await this.checkApi();
        if (isApiAvailable) {
            try {
                const res = await fetch("api.php?action=get_all");
                if (res.ok) {
                    const json = await res.json();
                    if (json.data) {
                        this.saveLocal(json.data);
                        return json.data;
                    }
                }
            } catch (e) {
                console.warn("Fallo al conectar con api.php, usando localStorage", e);
            }
        }
        return this.getLocal();
    }

    async saveAppointment(appointment) {
        const data = await this.getData();
        if (!data.appointments) data.appointments = [];

        // Asegurar que la cita quede agendada y confirmada de inmediato
        appointment.status = appointment.status || "confirmada";
        data.appointments.unshift(appointment);
        this.saveLocal(data);

        // Notificar en tiempo real a cualquier panel abierto mediante BroadcastChannel y StorageEvent
        this.notifyNewAppointment(appointment);

        const isApiAvailable = await this.checkApi();
        if (isApiAvailable) {
            try {
                await fetch("api.php?action=save_appointment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(appointment)
                });
            } catch (e) {
                console.warn("Fallo al sincronizar cita con servidor PHP", e);
            }
        }

        return appointment;
    }

    notifyNewAppointment(appointment) {
        // 1. Emitir señal a través de localStorage (funciona entre pestañas y ventanas)
        try {
            localStorage.setItem("larav_latest_appointment", JSON.stringify({
                timestamp: Date.now(),
                appointment: appointment
            }));
        } catch (e) {}

        // 2. Emitir a través de BroadcastChannel
        try {
            if (this.broadcastChannel) {
                this.broadcastChannel.postMessage({
                    type: "NEW_APPOINTMENT",
                    appointment: appointment
                });
            }
        } catch (e) {}
    }

    async updateAppointmentStatus(appointmentId, newStatus) {
        const data = await this.getData();
        const appt = data.appointments.find(a => a.id === appointmentId);
        if (appt) {
            appt.status = newStatus;
            this.saveLocal(data);

            const isApiAvailable = await this.checkApi();
            if (isApiAvailable) {
                try {
                    await fetch("api.php?action=update_appointment_status", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ id: appointmentId, status: newStatus })
                    });
                } catch (e) {
                    console.warn("Fallo al actualizar cita en servidor PHP", e);
                }
            }
            return true;
        }
        return false;
    }

    // --- GESTIÓN DE TRABAJADORAS / ESPECIALISTAS ---
    async saveSpecialist(specialist) {
        const data = await this.getData();
        if (!data.specialists) data.specialists = [];

        const idx = data.specialists.findIndex(s => s.id === specialist.id);
        if (idx >= 0) {
            data.specialists[idx] = { ...data.specialists[idx], ...specialist };
        } else {
            data.specialists.push(specialist);
        }

        this.saveLocal(data);

        const isApiAvailable = await this.checkApi();
        if (isApiAvailable) {
            try {
                await fetch("api.php?action=save_specialist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(specialist)
                });
            } catch (e) {
                console.warn("Fallo al guardar especialista en PHP", e);
            }
        }
        return specialist;
    }

    async deleteSpecialist(specialistId) {
        if (specialistId === "any") return false; // Proteger opción default
        const data = await this.getData();
        data.specialists = (data.specialists || []).filter(s => s.id !== specialistId);
        this.saveLocal(data);

        const isApiAvailable = await this.checkApi();
        if (isApiAvailable) {
            try {
                await fetch("api.php?action=delete_specialist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: specialistId })
                });
            } catch (e) {
                console.warn("Fallo al eliminar especialista en PHP", e);
            }
        }
        return true;
    }

    async saveSpecialists(specialistsList) {
        const data = await this.getData();
        data.specialists = specialistsList;
        this.saveLocal(data);

        const isApiAvailable = await this.checkApi();
        if (isApiAvailable) {
            try {
                await fetch("api.php?action=save_specialists", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(specialistsList)
                });
            } catch (e) {
                console.warn("Fallo al guardar especialistas en PHP", e);
            }
        }
        return specialistsList;
    }

    async addReview(review) {
        const data = await this.getData();
        if (!data.reviews) data.reviews = [];
        data.reviews.unshift(review);
        this.saveLocal(data);

        const isApiAvailable = await this.checkApi();
        if (isApiAvailable) {
            try {
                await fetch("api.php?action=add_review", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(review)
                });
            } catch (e) {
                console.warn("Fallo al sincronizar reseña con servidor PHP", e);
            }
        }

        return review;
    }

    async updateBusinessInfo(business) {
        const data = await this.getData();
        data.business = { ...data.business, ...business };
        this.saveLocal(data);

        const isApiAvailable = await this.checkApi();
        if (isApiAvailable) {
            try {
                await fetch("api.php?action=update_business", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(business)
                });
            } catch (e) {
                console.warn("Fallo al actualizar negocio en servidor PHP", e);
            }
        }
        return data.business;
    }

    async saveServices(services) {
        const data = await this.getData();
        data.services = services;
        this.saveLocal(data);

        const isApiAvailable = await this.checkApi();
        if (isApiAvailable) {
            try {
                await fetch("api.php?action=save_services", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(services)
                });
            } catch (e) {
                console.warn("Fallo al guardar servicios en servidor PHP", e);
            }
        }
        return services;
    }

    async saveSchedule(schedule) {
        const data = await this.getData();
        data.schedule = schedule;
        this.saveLocal(data);

        const isApiAvailable = await this.checkApi();
        if (isApiAvailable) {
            try {
                await fetch("api.php?action=save_schedule", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(schedule)
                });
            } catch (e) {
                console.warn("Fallo al guardar horarios en servidor PHP", e);
            }
        }
        return schedule;
    }

    resetDefaults() {
        this.saveLocal(DEFAULT_DATA);
        return DEFAULT_DATA;
    }
}

window.appStore = new DataStore();
