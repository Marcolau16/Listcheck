/**
 * Data inicial y gestor de almacenamiento (Local & API)
 * Incluye gestión de trabajadoras/especialistas, horarios y sistema de notificación en vivo
 */

const DEFAULT_DATA = {
    business: {
        name: "Clean Face HMO",
        tagline: "Cosmetólogo",
        about: "Tratamientos faciales y corporales exclusivos para mujeres ✨",
        specialty: "Cosmetólogo & Cosmiatra",
        address: "Juan José Aguirre #5, Entre Gral. Piña Y Gral. Reyes, 83180, Hermosillo, Sonora",
        phone: "+526627158174",
        whatsapp: "526627158174",
        instagram: "https://instagram.com/cleanface_hmo",
        instagramHandle: "@cleanface_hmo",
        mapCoordinates: { lat: 29.14541, lng: -110.966564 },
        coverUrl: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1200&q=80",
        avatarUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
        cabinNotes: "Miércoles a lunes atiende cabina Tanya\nMartes, atiende cabina Nadia",
        currencySymbol: "$",
        currencyCode: "MXN",
        bookingIntervalMinutes: 30,
        adminPin: "1234",
        bannerPromo: {
            title: "PROMOCIÓN SEPTIEMBRE",
            desc: "Dermapen $499\nLimpieza profunda $400\nHifu $500\nHydralips $150"
        }
    },
    specialists: [
        {
            id: "any",
            name: "Cualquier especialista disponible",
            title: "Asignación automática",
            bio: "Te asignaremos a la profesional disponible en la fecha y hora seleccionada.",
            avatarUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
            phone: "526627158174",
            workDays: [0, 1, 2, 3, 4, 5, 6],
            workHours: {},
            blockedDates: [],
            active: true
        },
        {
            id: "tanya",
            name: "Cabina Tanya",
            title: "Cosmetóloga Facial y Corporal",
            bio: "Especialista en limpiezas profundas, Dermapen, hidratación celular y tratamientos corporales antiestrés.",
            avatarUrl: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80",
            phone: "526627158174",
            workDays: [0, 1, 3, 4, 5, 6], // Miércoles a Lunes
            workHours: {
                0: { open: "12:00", close: "17:00", active: true },
                1: { open: "11:00", close: "20:00", active: true },
                3: { open: "16:00", close: "20:00", active: true },
                4: { open: "14:00", close: "20:00", active: true },
                5: { open: "11:00", close: "20:00", active: true },
                6: { open: "11:00", close: "18:00", active: true }
            },
            blockedDates: [],
            active: true
        },
        {
            id: "nadia",
            name: "Lic. Cosmiatría Nadia Hernández",
            title: "Lic. en Cosmiatría & Láser",
            bio: "Especialista en Hollywoodpeel láser, reducción de poros, peeling ultrasónico y protocolos antiedad.",
            avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            phone: "526627158174",
            workDays: [2], // Solo Martes
            workHours: {
                2: { open: "11:00", close: "18:00", active: true }
            },
            blockedDates: [],
            active: true
        }
    ],
    schedule: {
        0: { dayName: "Domingo", open: "12:00", close: "17:00", active: true },
        1: { dayName: "Lunes", open: "11:00", close: "20:00", active: true },
        2: { dayName: "Martes", open: "11:00", close: "18:00", active: true },
        3: { dayName: "Miércoles", open: "16:00", close: "20:00", active: true },
        4: { dayName: "Jueves", open: "14:00", close: "20:00", active: true },
        5: { dayName: "Viernes", open: "11:00", close: "20:00", active: true },
        6: { dayName: "Sábado", open: "11:00", close: "18:00", active: true }
    },
    categories: [
        { id: "promo-mes", name: "PROMOCIÓN DEL MES" },
        { id: "promo-martes", name: "PROMOCIÓN SOLO MARTES (Lic cosmiatria Nadia Hernández)" },
        { id: "faciales", name: "FACIALES" },
        { id: "corporales", name: "CORPORALES" }
    ],
    services: [
        {
            id: "srv-dermapen-promo",
            categoryId: "promo-mes",
            name: "Dermapen",
            price: 449,
            duration: 60,
            durationText: "1 h",
            description: "Antiedad, secuela de acné y despigmentante con microneedling regenerativo.",
            active: true
        },
        {
            id: "srv-limpieza-promo",
            categoryId: "promo-mes",
            name: "Limpieza profunda",
            price: 400,
            duration: 60,
            durationText: "1 h",
            description: "Exfoliación, vaporización, extracción de impurezas, mascarilla calmante y alta frecuencia.",
            active: true
        },
        {
            id: "srv-hifu-promo",
            categoryId: "promo-mes",
            name: "Hifu",
            price: 500,
            duration: 60,
            durationText: "1 h",
            description: "Ultrasonido focalizado de alta intensidad para tensado facial y efecto lifting sin cirugía.",
            active: true
        },
        {
            id: "srv-hydralips-promo",
            categoryId: "promo-mes",
            name: "Hydralips",
            price: 150,
            duration: 30,
            durationText: "30 min",
            description: "Hidratación y revitalización profunda de labios con ácido hialurónico y exfoliación suave.",
            active: true
        },
        {
            id: "srv-hollywood-peel",
            categoryId: "promo-martes",
            name: "Hollywoodpeel",
            price: 350,
            duration: 60,
            durationText: "1 h",
            description: "Tratamiento a base de mascarilla de carbón activado y aplicación de láser. Ayuda a eliminar pigmentación, iluminar y reducir poros.",
            active: true
        },
        {
            id: "srv-limpieza-martes",
            categoryId: "promo-martes",
            name: "Limpieza profunda (Especial Martes)",
            price: 300,
            duration: 60,
            durationText: "1 h",
            description: "Incluye exfoliación química y ultrasónica así como extracción manual y terapia led fotodinámica.",
            active: true
        },
        {
            id: "srv-masaje-cuello",
            categoryId: "promo-martes",
            name: "Masaje cuello y media espalda",
            price: 350,
            duration: 30,
            durationText: "30 min",
            description: "Alivio de contracturas y tensión muscular en cuello, hombros y zona dorsal.",
            active: true
        },
        {
            id: "srv-masaje-relajante-martes",
            categoryId: "promo-martes",
            name: "Masaje relajante",
            price: 450,
            duration: 60,
            durationText: "1 h",
            description: "Masaje corporal completo con aromaterapia y aceites esenciales para aliviar el estrés.",
            active: true
        },
        {
            id: "srv-hydrafacial-martes",
            categoryId: "promo-martes",
            name: "Hydrafacial",
            price: 300,
            duration: 60,
            durationText: "1 h",
            description: "Hidrodermoabrasión con sueros nutritivos, hidratación intensiva y extracción con succión suave.",
            active: true
        },
        {
            id: "srv-anti-arrugas",
            categoryId: "faciales",
            name: "Anti arrugas",
            price: 580,
            duration: 60,
            durationText: "1 h",
            description: "Enfocado en prevenir y tratar la aparición de signos de envejecimiento prematuro con péptidos y colágeno.",
            active: true
        },
        {
            id: "srv-dermaplaning",
            categoryId: "faciales",
            name: "Dermaplaning",
            price: 450,
            duration: 60,
            durationText: "1 h",
            description: "Limpieza básica con depilación del vello facial fino y exfoliación física con bisturí dermatológico para piel ultralisa.",
            active: true
        },
        {
            id: "srv-prdn-salmon",
            categoryId: "faciales",
            name: "Facial PDRN de salmón",
            price: 650,
            duration: 60,
            durationText: "1 h",
            description: "PDRN de salmón aplicado con microneedling ideal para revitalizar e hidratar la piel logrando una apariencia luminosa al instante.",
            active: true
        },
        {
            id: "srv-reductor-poros",
            categoryId: "faciales",
            name: "Reductor de poros y textura",
            price: 600,
            duration: 60,
            durationText: "1 h",
            description: "Protocolo especializado para afinar poros dilatados, regular sebo y mejorar la textura de la piel.",
            active: true
        },
        {
            id: "srv-masaje-completo",
            categoryId: "corporales",
            name: "Masaje Relajante Corporal Completo",
            price: 550,
            duration: 60,
            durationText: "1 h",
            description: "Terapia corporal antiestrés con maniobras suaves y calor localizado.",
            active: true
        },
        {
            id: "srv-drenaje-linfatico",
            categoryId: "corporales",
            name: "Drenaje Linfático Manual",
            price: 480,
            duration: 50,
            durationText: "50 min",
            description: "Estimula la circulación linfática, reduce retención de líquidos y desinflama.",
            active: true
        }
    ],
    gallery: [
        {
            id: "gal-1",
            album: "faciales",
            title: "Tratamiento Facial Rejuvenecedor",
            src: "https://images.unsplash.com/photo-1512290900672-1f4f5a34e06d?auto=format&fit=crop&w=800&q=80",
            thumb: "https://images.unsplash.com/photo-1512290900672-1f4f5a34e06d?auto=format&fit=crop&w=400&q=80",
            comment: "Dermapen y terapia regenerativa para secuelas de acné y luminosidad."
        },
        {
            id: "gal-2",
            album: "faciales",
            title: "Limpieza Profunda con Hidrodermoabrasión",
            src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
            thumb: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80",
            comment: "Extracción profunda de poros e hidratación con mascarilla de alginato."
        },
        {
            id: "gal-3",
            album: "faciales",
            title: "Terapia LED Fotodinámica",
            src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
            thumb: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80",
            comment: "Luz roja para estimulación de colágeno y azul para control bacteriano."
        },
        {
            id: "gal-4",
            album: "faciales",
            title: "Dermaplaning & Glow",
            src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
            thumb: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
            comment: "Piel suave y libre de células muertas para una absorción óptima de cosmecéuticos."
        },
        {
            id: "gal-5",
            album: "corporales",
            title: "Masaje Descontracturante & Relajante",
            src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
            thumb: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=80",
            comment: "Sesión relajante de espalda y cuello con aceites botánicos."
        },
        {
            id: "gal-6",
            album: "corporales",
            title: "Drenaje Linfático y Moldeo",
            src: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
            thumb: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=400&q=80",
            comment: "Protocolo corporal reductor y drenante."
        },
        {
            id: "gal-7",
            album: "faciales",
            title: "Hydralips Revitalizante",
            src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
            thumb: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80",
            comment: "Labios visiblemente hidratados y con color natural saludable."
        }
    ],
    reviews: [
        {
            id: "rev-1",
            author: "Sofía Martínez",
            rating: 5,
            date: "Hace 2 días",
            comment: "¡Excelente atención! Mi piel quedó súper suave y luminosa con el Dermapen. Tanya es súper profesional y atenta.",
            avatar: "S"
        },
        {
            id: "rev-2",
            author: "Valeria Ramos",
            rating: 5,
            date: "Hace 1 semana",
            comment: "Fui en martes con la Lic. Nadia para el Hollywoodpeel y el resultado fue increíble, me cerró mucho los poros. 100% recomendado.",
            avatar: "V"
        },
        {
            id: "rev-3",
            author: "Carolina Mendívil",
            rating: 5,
            date: "Hace 2 semanas",
            comment: "Las instalaciones muy limpias, relajantes y un trato de primera. La limpieza profunda es la mejor que me han hecho en Hermosillo.",
            avatar: "C"
        }
    ],
    appointments: [
        {
            id: "CF-1002",
            clientName: "Fernanda López",
            clientPhone: "6621234567",
            clientEmail: "fernanda@ejemplo.com",
            specialistId: "tanya",
            specialistName: "Cabina Tanya",
            date: "2026-09-22",
            time: "11:00",
            endTime: "12:00",
            services: [
                { id: "srv-limpieza-promo", name: "Limpieza profunda", price: 400, duration: 60 }
            ],
            totalPrice: 400,
            status: "confirmada",
            notes: "Primera vez en el salón",
            createdAt: "2026-09-18T10:15:00Z"
        }
    ]
};

/**
 * Gestor de persistencia híbrido y emisor de notificaciones en tiempo real
 */
class DataStore {
    constructor() {
        this.STORAGE_KEY = "cleanface_app_data_v2";
        this.hasApi = null;
        this.broadcastChannel = null;

        try {
            if (typeof window !== "undefined" && window.BroadcastChannel) {
                this.broadcastChannel = new BroadcastChannel("cleanface_events");
            }
        } catch (e) {
            console.log("BroadcastChannel no soportado", e);
        }

        this.init();
    }

    init() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            this.saveLocal(DEFAULT_DATA);
        } else {
            // Asegurar que specialists contenga la nueva estructura enriquecida
            try {
                const parsed = JSON.parse(stored);
                if (!parsed.specialists || !parsed.specialists[1] || !parsed.specialists[1].workDays) {
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
            localStorage.setItem("cleanface_latest_appointment", JSON.stringify({
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
