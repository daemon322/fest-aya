// Configuración central de entradas — sin JSX para compatibilidad con localStorage

export const PHASES = [
  { id: 0, label: "Pre-venta",     status: "del 17", date: "22 de marzo" },
  { id: 1, label: "Venta General", status: "del 23", date: "28 de marzo" },
];

export const TICKET_TYPES = {
  "zona-vip": {
    id: "zona-vip",
    title: "Zona Vip",
    subtitle: "Acceso dinámico",
    prices: [40.0, 45.0],
    zone: "Silla Preferencial — Zona Baja",
    description:
      "La experiencia premium del evento. Visibilidad privilegiada y comodidades exclusivas para que disfrutes cada punto del partido.",
    includes: [
      "Pase rápido de acceso preferencial",
      "Zona baja con excelente vista al campo",
      "1/4 de pollo incluido",
      "Silla personal asignada",
      "Entrada nominativa e intransferible",
    ],
    restrictions: [
      "Mayores de 5 años pagan entrada",
      "Documento de identidad obligatorio en puerta",
      "Máximo 4 entradas por DNI",
    ],
    badge: "Más Solicitado",
    availability: 200,
    maxAvailability: 200,
  },
  "general-latido": {
    id: "general-latido",
    title: "General",
    subtitle: "Acceso regular",
    prices: [25.0, 30.0],
    zone: "Gradas Norte y Occidente",
    description:
      "Vive el evento desde las gradas con la energía de la hinchada. Incluye consumición y acceso al recinto.",
    includes: [
      "Pase de acceso regular al estadio",
      "Gradas Norte y Occidente",
      "1 lata de cerveza o gaseosa personal Inca-kola o Coca-Cola",
      "Acceso general al estadio",
      "Entrada nominativa e intransferible",
    ],
    restrictions: [
      "Mayores de 5 años pagan entrada",
      "Documento de identidad obligatorio en puerta",
      "Máximo 4 entradas por DNI",
    ],
    badge: null,
    availability: 500,
    maxAvailability: 500,
  },
};

export const EVENT_INFO = {
  name: "Voley al Límite 2026",
  shortName: "Voley al Límite",
  date: "Próximamente — 2026",
  venue: "Estadio Ciudad de Ayacucho",
  city: "Ayacucho, Perú",
  organizer: "Ayacucho Vóley Club",
};
