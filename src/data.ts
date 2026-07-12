import { Story, Route } from './types';

// TODO: Las imágenes alojadas en lh3.googleusercontent.com/aida provienen de
// Google AI Studio y son URLs TEMPORALES que van a expirar (dejarán de cargar).
// Antes de producción, sube estos assets (logo e imágenes) a un hosting propio
// o CDN (por ejemplo S3/Cloudinary/almacenamiento estático del proyecto) y
// reemplaza estas URLs por las definitivas.
export const LOGO_URL = "https://lh3.googleusercontent.com/aida/AP1WRLt66vStL57IdxGojDNpyLfFDymD2cWdIlviXFv4uezCgquZu7ZuzIuToUMfU_07jusjbcRUO9SNf7irup-HACCpHtOQpSe9AzC_EJjhWZP0jvyAryct5M276ReE5Cu4AUDK7pUgXo1hPyoghZFlg-BYPzIIfOiJnf8q0fhuZTT9SOWpr81fJXgQ7sEYpXv5A9nPQ9J7jhbkc7FKqsXs4xzORoB7RQaaKcH4Sf1H5FFx985fgntekefyQQ";

// TODO: Ver nota anterior. Todas las URLs lh3.googleusercontent.com/aida-public
// de este objeto son temporales de Google AI Studio y deben migrarse a hosting
// propio antes de publicar; de lo contrario las imágenes dejarán de mostrarse.
export const IMAGES = {
  heroGeneral: "https://lh3.googleusercontent.com/aida-public/AB6AXuARGMg4g5G5frQiFbSFKrRXEcXwLVqK-Pi_AhagUwOpB3eyZW5kDK1DpHq-AdZuuiozYiqGyNXjR3nI82tu_Q6MC6DruAD1ZvXzuWQS7UZTKftRwOr0eTEl-VlQLg-6wuBGGUdESUBQbiqh593jIU6ppw8AYraRqnxidBXQsvEPggipQzWHpl6JClpTs6ZAuk87lUmoblj5Uh-Qhk_j-FFRVGTu8Da08HENVq44qzSs-Hs-3d2kbguFVR1gzdLDkiEwzPGZsWaCCFw",
  volunteersHero: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZEQwdN9hXGwl8FtGVyrAJr0miqgc71vz1oJcBhlW0IqcljVGnFNUzUMxl4Mw-A6JfPRxR7JVZpPBGUE36k1qxXTffsIfZWsHTlQStfY4_VNYUPxNJGkRyNP0Bt7A9_ExlvNDBwEWvdj1ZSpTfA1c2jVrN0oS1X2haokZBQsYbCXJX8oP4XCCoi6NW7CCelEXlt0SLJCChU2JqN6PdPXpjkXWOol6PdzmOkto7WojLotuoVHVs8a48U6WeX3r0SMNhOz2HTgBwd98",
  breakfastFood: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0pvk-t9pGbzj-4ujzgKl2LUUTJ3w8kXGFxfAwGTOZ9XC4kjxMMqAHk7NUxhpfQeSzZyKEP0MQMwLXqVpIcX7ZjUw62espzie5yL7ccPdvHwjSkHbci7T1fu2Qp-n80iarSqajLaKAR2Z8jLGW0FHuqMxPGwWDOhurAwLJOfPwHOdEbnstsaw533SAzNts-Ua88JE3_NHqepZeKJokJCothWtsPAwgJFSuqfSxpUyYyRcN8I2yh3QQdjZmfGWS9Eb0B0-nY_y6JB8",
  bibleReading: "https://lh3.googleusercontent.com/aida-public/AB6AXuAHvrTBr3d6omx0aI8LWBKzDGiBqTVj3Hqy00758suMLGxmUFEnyuv-f4AS1lm0MYjY5O2dzHB700pbwkZN3PQPReWPg5gvWekfAc37VJIUkzMnaBU-XMHrNqB_ZDsqnKzxEauhM-vRVch0qs43-Rlexy1hJbl4ZppST7s7mjAcJDHhAinxKip4ZB17X_sV7XEQ5G7IcwR8Szho-7O6i__smroyuzUFKSQUW4A6-hdSGpsELkxUMpp3a4EPVzVWbXoP6KxqgVj85vE",
  volunteersServing: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0jOyBTdGEhMsVjgIMxDYl3vCTjmjZK4yzH7dBit5ELslpgI-ftI10ORoH44biMbB6qBkKR_jD_of-6j2ozwDhXj4yC0BAo1pKqvnR2qV-MErpFfN0unRhvAfFhIrAdNFUglHEH-DfKQt4ZTTodEYOAcnbdv474mcBV1szziSrhQLXgl2vrazkAfRQiEdvgXGFQ2zoaYnWWhFj1RSRL3DKTOJbCECkI9_OR_rT0Ue8RIO0qxmWUFz7v3QZsyAQeALJU9slqbvERGk",
  bibleHand: "https://lh3.googleusercontent.com/aida-public/AB6AXuDr81VHVa7asRp83_uDr3x9voUsv23sTe0G-iDQeWoHSzNIVY0RaKAFIZBkyH0bLGG3bS3fXNI28460pwNWbBj1jaG3S4okYla7Ds74PZywiOaa0m3paaaiiNc4jU6Sx-hQ4JNiK2UIlfl6pRD-fRx_6uaiEzYPirnOkdxKN9mHDA4vBUyi7LaTrpCceCloLdMB6uL2Hqb_noPBom81KYMMBzzbO3V8n3jSYF2TUC_f7cTFNlwqPMWd2SISaYpLTL1wVE-RBJESTqA",
  dignityKit: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4oOZJvJCqsWA577wuBz-7tqCzNtF0ejCvsDQAdEjPb6Oy8aC09Ef5oPUPzB9lXnZH8ZcO1SBdNBWggvmQQFRj_t2M2D3P08Zg-F1OpVel6Kmad3eVPNam4j5N5h_XKf82ietlbmdfdYUXnUJZzYDGjug1eGD9PDKBdgmXbCXMG16UEssPnmuSeiUSf7Ro3wXOoO3cGvI07W0xKhgjXom0h2V8Kgw5mSiv9fVEKAs2ER5VPij_n6lzPmGs3BoA4Yk98LOZ4Yy9v1o",
  architectureBg: "https://lh3.googleusercontent.com/aida-public/AB6AXuATdPZLo3wOCmwdZhuhvcYBZB2rAcIrY2uszDuxOZ9fo0n8ErzmOjz3NveQ_7wRYTCsHCzIumo3CBuZgFAWoCfubEs1qpL8YxNWAXVWZPWxhtgILtnvQJEUGrd2Ik2Lbl1FTteEkfsv430motuSWYFHfyo47OTnOk1CJd6sgEO6ZfS-dV-UlG1cKT7yqQjQxeXItUmCaRDP3hzw3CiffOmO8i0ftTvGQJu4gaQ9uOTZJ0-6OPn7Y1c6As7gD0pNnbRc04h0_gVRDEw",
  mapBg: "https://lh3.googleusercontent.com/aida-public/AB6AXuDlvV2RjHlxX30tYqo49pPCftL2kxsKcEdnj5ZB-1zDq6ViYWVHb_AesWOLfeUeNbAB28sBm748bLVzL2M2GMnj-F7Ie-S5C-dsn2d-7cQxoFaO8OTW0kUvoso-CELVzVUls6-Y6EWbKYYVIMgG1AagcoUKk5eQDjAGm8S6mkxS7MySLWbZyXME3QAJWCom1706-1z1UNlh7rjE3d-ge1Lkmn9p1Fx5pF7kx097cAjLM5_S0F0im621IT6Tqo77TItv0NcSwNfOm14"
};

export interface ProgramDetails {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  imageUrl: string;
  iconName: string;
  stats: string;
  buttonText: string;
  scheduleDetails: string;
}

// Único conjunto de programas, enfocado en la Quinta Región de Valparaíso.
export const PROGRAMS: ProgramDetails[] = [
  {
    id: "desayunos_valpo",
    title: "Desayunos en Valparaíso",
    description: "Rutas de alimentación matutina entregando café caliente, sándwiches y apoyo emocional en el plan y los cerros de Valparaíso.",
    fullDescription: "Operamos desde nuestra base de acopio, saliendo temprano en brigadas de calle. Cubrimos puntos estratégicos como Plaza Sotomayor, Plaza Victoria, Avenida Argentina y el sector puerto, llevando consuelo espiritual, pan fresco y raciones de abrigo diarias.",
    imageUrl: IMAGES.breakfastFood,
    iconName: "Coffee",
    stats: "1.500 comidas servidas al mes",
    buttonText: "Participar",
    scheduleDetails: "Martes y Jueves a las 07:00 AM"
  },
  {
    id: "ruta_calle_valpo_vina",
    title: "Ruta Calle Valparaíso y Viña",
    description: "Acompañamiento y alimentación nocturna en los cerros y el plan de Valparaíso y Viña del Mar para personas en extrema vulnerabilidad.",
    fullDescription: "Recorremos los puntos de calle más complejos de la Quinta Región. Enfocamos nuestro esfuerzo en las personas mayores y familias con niños que pernoctan en plazas o bajo puentes, asistiéndolos con frazadas, sopa caliente, café y oración.",
    imageUrl: IMAGES.volunteersServing,
    iconName: "Map",
    stats: "80 personas refugiadas apoyadas",
    buttonText: "Participar",
    scheduleDetails: "Miércoles y Sábados a las 20:00 PM"
  },
  {
    id: "kit_invierno_valpo",
    title: "Dona un Kit de Invierno",
    description: "Campaña intensiva en la Quinta Región para proveer parkas impermeables, gorros de lana, sacos de dormir y calcetines gruesos.",
    fullDescription: "El invierno costero en Valparaíso y Viña del Mar es húmedo y frío. Proveemos sacos de dormir térmicos, calzado impermeable y buzos térmicos para disminuir el riesgo de hipotermia extrema en quienes viven en la calle.",
    imageUrl: IMAGES.dignityKit,
    iconName: "Flame",
    stats: "950 personas abrigadas",
    buttonText: "Participar",
    scheduleDetails: "Campaña Activa Mayo a Septiembre"
  },
  {
    id: "palabra_vida_valpo",
    title: "Palabra de Vida",
    description: "Acompañamiento espiritual y entrega de Biblias que fortalece la fe y la esperanza de quienes se sienten desamparados.",
    fullDescription: "Creemos firmemente que el ser humano no solo vive de pan. Ofrecemos refugio espiritual, círculos de lectura bíblica compartida, oración sincera y orientación en las rutas de Valparaíso y Viña del Mar. Respetamos la libertad de todos y acogemos con amor y fe a quienes buscan consuelo.",
    imageUrl: IMAGES.bibleReading,
    iconName: "BookOpen",
    stats: "150 encuentros grupales",
    buttonText: "Participar",
    scheduleDetails: "Martes y Sábados de 18:30 a 20:30"
  }
];

// Rutas de calle de la Quinta Región (Valparaíso y Viña del Mar).
export const CHILE_ROUTES: Route[] = [
  {
    id: "route-valpo-puerto",
    name: "Valparaíso Plan y Puerto",
    city: "Valparaíso",
    schedule: "Sábados 20:00 PM",
    volunteersCount: 12,
    mealsDelivered: 95,
    description: "Ruta nocturna partiendo de Plaza Sotomayor, recorriendo calles del puerto, Plaza Victoria y Avenida Argentina.",
    status: "activo",
    latitudePercent: 46,
    longitudePercent: 40,
    lat: -33.0360,
    lng: -71.6296
  },
  {
    id: "route-valpo-cerros",
    name: "Cerros de Valparaíso (Alegre y Concepción)",
    city: "Valparaíso",
    schedule: "Martes 07:00 AM",
    volunteersCount: 8,
    mealsDelivered: 70,
    description: "Recorrido matutino por los cerros Alegre y Concepción, entregando desayunos calientes y abrigo a personas en situación de calle.",
    status: "activo",
    latitudePercent: 40,
    longitudePercent: 55,
    lat: -33.0413,
    lng: -71.6280
  },
  {
    id: "route-vina-estero",
    name: "Viña del Mar - Estero Marga Marga",
    city: "Viña del Mar",
    schedule: "Jueves 19:30 PM",
    volunteersCount: 6,
    mealsDelivered: 50,
    description: "Acompañamiento a personas asentadas bajo los puentes del Estero Marga Marga e inmediaciones del terminal de buses de Viña del Mar.",
    status: "activo",
    latitudePercent: 60,
    longitudePercent: 62,
    lat: -33.0246,
    lng: -71.5518
  }
];

export const STORIES: Story[] = [
  {
    id: "story-1",
    title: "El milagro de Don Carlos",
    name: "Don Carlos Fuentes",
    age: 58,
    location: "Plan de Valparaíso",
    quote: "La Fundación Alzamora no solo me trajo un sándwich caliente; me trajo de vuelta las ganas de vivir y la palabra de Dios.",
    summary: "Vivió 6 años en la calle tras perder su empleo y su familia. El apoyo continuo y el afecto de los voluntarios le permitieron iniciar su rehabilitación.",
    fullStory: "Carlos llegó a las calles de Valparaíso tras una profunda depresión. Pasó inviernos durísimos durmiendo en cartones en el plan de la ciudad. Una mañana de invierno de 2024, el equipo de la Ruta de Desayunos de la Fundación Alzamora conversó con él, le entregó un abrigo y compartieron una oración. Ese fue el punto de inflexión. Sintiéndose valorado y acompañado por la fe, aceptó ayuda médica y hoy trabaja como conserje, asistiendo ahora como voluntario de la misma fundación los fines de semana.",
    imageUrl: IMAGES.volunteersServing,
    date: "Abril 2025"
  },
  {
    id: "story-2",
    title: "La fuerza de Marta en Viña del Mar",
    name: "Marta Jimeno",
    age: 44,
    location: "Estero Marga Marga, Viña del Mar",
    quote: "Cuando estás en la calle te vuelves invisible. El Kit de Dignidad y sus palabras me recordaron que sigo siendo un ser humano.",
    summary: "Se encontró sin hogar repentinamente. Encontró en los encuentros de la Fundación Alzamora un refugio emocional y espiritual.",
    fullStory: "Marta se vio en la indigencia debido a un desalojo injusto y comenzó a pernoctar cerca del Estero Marga Marga, en Viña del Mar. Describe el frío de la calle como algo que cala hasta el alma, pero destaca que el frío de la indiferencia es peor. El programa 'Palabra de Vida' le dio un espacio para desahogarse y orar. Gracias a la bolsa de empleo de una iglesia colaboradora de la fundación, Marta consiguió una pieza en arriendo y un empleo a tiempo parcial en el sector de servicios.",
    imageUrl: IMAGES.bibleHand,
    date: "Diciembre 2024"
  },
  {
    id: "story-3",
    title: "Don Alberto y las mañanas de esperanza",
    name: "Alberto Retamal",
    age: 63,
    location: "Puerto de Valparaíso",
    quote: "Llevo el Nuevo Testamento que me regalaron siempre en el bolsillo. Me ha salvado de la desesperanza en las noches más frías.",
    summary: "Pescador jubilado sin pensión que pernoctaba en los muelles de Valparaíso. Encontró una familia en las brigadas nocturnas.",
    fullStory: "Don Alberto es muy conocido en el sector pesquero, pero la vejez lo dejó sin recursos. Recibe el Desayuno Solidario y participa activamente en las lecturas bíblicas junto a los contenedores del puerto de Valparaíso. Refiere que la calidez del café y el trato respetuoso y cariñoso de los jóvenes de la Fundación es su mayor bendición semanal.",
    imageUrl: IMAGES.volunteersHero,
    date: "Mayo 2025"
  }
];
