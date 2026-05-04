// Archivo estructurado para configuración (Este será el que edite el dueño o será reemplazado por la lectura de Google Sheets)

const RESTAURANT_CONFIG = {
    // === DATOS DEL RESTAURANTE ===
    id: "oldwest", // ID Único para sincronizar con Google Sheets (SaaS)
    nombre: "OLDWEST",
    slogan: "El auténtico sabor del viejo oeste en tu paladar.",
    logo: "img/logo.webp", 
    googleSheetUrl: "https://docs.google.com/spreadsheets/d/1-zMzrxFpWAkU2u0eqFW1LnlG_a0a3VCze5EWchjkQQ0/export?format=csv", // Link configurado correctamente
    telefonoWP: "573117785015",
    mensajeWP: "¡Hola Oldwest! Quiero hacer el siguiente pedido:\n",
    moneda: "$",
    horarios: {
        apertura: "11:00",
        cierre: "23:00"
    },

    // === COLORES DE LA MARCA ===
    colores: {
        principal: "#d9534f",
        secundario: "#2b2b2b",
        fondo: "#fdf8f5"
    },

    // === BANNERS PROMOCIONALES ===
    promociones: [
        {
            titulo: "¡2x1 Solo por Hoy!",
            descripcion: "Disfruta de un 2x1 en nuestras Hamburguesas. ¡Oferta exclusiva para hoy!",
            fondo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop"
        },
        {
            titulo: "Especial Carnívoros Hoy",
            descripcion: "La mejor selección de cortes con un 15% de descuento.",
            fondo: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop"
        },
        {
            titulo: "Alitas Hoy",
            descripcion: "Combos de alitas bañadas en nuestras salsas artesanales.",
            fondo: "https://images.unsplash.com/photo-1524114664604-cd8133cd67ad?q=80&w=1200&auto=format&fit=crop"
        }
    ],

    // === CATEGORÍAS DEL MENÚ ===
    categorias: ["Hamburguesas (Oferta Exclusiva)", "Cortes Premium", "Aves y BBQ", "Para Compartir", "Bebidas"],

    // === PRODUCTOS ===
    productos: [
        // HAMBURGUESAS
        {
            id: 101,
            categoria: "Hamburguesas (Oferta Exclusiva)",
            nombre: "Smash Burger",
            descripcion: "Pan bretzel, tres croquetas de carne de res tipo smash, queso cheddar kraft, tocineta, pepinillo y vegetales frescos.",
            precio: 37000,
            imagen: "img/SMASH BURGER.webp",
            disponible: true,
            popularidad: 95,
            prepTime: "15 min",
            porciones: "1 pers.",
            etiquetas: ["🍔 Smash", "🔥 2x1 Martes"],
            modificadores: [
                {
                    grupo: "Extras de Queso",
                    opciones: [
                        { nombre: "Extra Cheddar", precio: 3000 },
                        { nombre: "Bañado en Queso", precio: 4500 }
                    ]
                },
                {
                    grupo: "Tocineta Extra",
                    opciones: [
                        { nombre: "Doble Tocineta", precio: 4000 }
                    ]
                }
            ]
        },
        {
            id: 102,
            categoria: "Hamburguesas (Oferta Exclusiva)",
            nombre: "Dallas Burger",
            descripcion: "Pan de parmesano, 100 gr de jugosa croqueta de carne, delicioso pulled pork, chicharrón de queso , salsa baiconesa, bbq de café y lechuga en julianas.",
            precioOriginal: 42000,
            precio: 39000,
            imagen: "img/DALLAS BURGER.webp",
            disponible: true,
            popularidad: 88,
            prepTime: "18 min",
            porciones: "1 pers.",
            etiquetas: ["🥩 Pulled Pork", "🔥 2x1 Martes"],
            modificadores: [
                {
                    grupo: "Opciones Adicionales",
                    opciones: [
                        { nombre: "Extra Pulled Pork", precio: 6000 },
                        { nombre: "Extra Salsa BBQ de Café", precio: 2000 }
                    ]
                }
            ]
        },
        {
            id: 103,
            categoria: "Hamburguesas (Oferta Exclusiva)",
            nombre: "Oklahoma Burger",
            descripcion: "La hamburguesa nacida del fuego y el humo. Pan artesanal, blend de carne madurada, cheddar y brisket ahumado por 12 horas en la boca del dragón.",
            precio: 20000,
            imagen: "img/Oklahoma Burger .png",
            disponible: true,
            popularidad: 90,
            prepTime: "15 min",
            porciones: "1 pers.",
            etiquetas: ["🔥 Ahumada", "🔥 2x1 Martes"],
            modificadores: [
                {
                    grupo: "Personalización",
                    opciones: [
                        { nombre: "Extra Brisket Ahumado", precio: 8000 },
                        { nombre: "Sin Cheddar", precio: 0 }
                    ]
                }
            ]
        },

        // CORTES PREMIUM
        {
            id: 201,
            categoria: "Cortes Premium",
            nombre: "Tomahawk Angus Beef",
            descripcion: "1.000 gr del corte insignia de la casa, con alto contenido de grasa intramuscular (marmoleo). Guarnición de papa al vapor, cascos o a la francesa y ensalada.",
            precioOriginal: 450000,
            precio: 420000,
            imagen: "img/TOMAHAWK ANGUS BEEF.webp",
            disponible: true,
            popularidad: 100,
            prepTime: "40 min",
            porciones: "2-3 pers.",
            etiquetas: ["👑 Insignia", "💎 Premium"],
            modificadores: [
                {
                    grupo: "Término de la Carne",
                    seleccion: "unica",
                    opciones: [
                        { nombre: "Medio", precio: 0 },
                        { nombre: "Tres Cuartos", precio: 0 },
                        { nombre: "Bien Asado", precio: 0 }
                    ]
                },
                {
                    grupo: "Elige tu Guarnición",
                    seleccion: "unica",
                    opciones: [
                        { nombre: "Papa al Vapor", precio: 0 },
                        { nombre: "Cascos de Papa", precio: 0 },
                        { nombre: "Papa a la Francesa", precio: 0 }
                    ]
                }
            ]
        },
        {
            id: 202,
            categoria: "Cortes Premium",
            nombre: "New York Steak Beef",
            descripcion: "400 gr de lomo ancho con marmoleo medio y textura firme, valorado por su terneza. Guarnición papa o yuca al vapor o cascos de papa y ensalada.",
            precio: 189000,
            imagen: "img/NEW YORK STEAK BEEF.webp",
            disponible: true,
            prepTime: "30 min",
            porciones: "1-2 pers.",
            etiquetas: ["🥩 Terneza"],
            modificadores: [
                {
                    grupo: "Término de la Carne",
                    seleccion: "unica",
                    opciones: [
                        { nombre: "Medio", precio: 0 },
                        { nombre: "Tres Cuartos", precio: 0 },
                        { nombre: "Bien Asado", precio: 0 }
                    ]
                },
                {
                    grupo: "Elige tu Guarnición",
                    seleccion: "unica",
                    opciones: [
                        { nombre: "Papa al Vapor", precio: 0 },
                        { nombre: "Yuca al Vapor", precio: 0 },
                        { nombre: "Cascos de Papa", precio: 0 }
                    ]
                }
            ]
        },
        {
            id: 203,
            categoria: "Cortes Premium",
            nombre: "Lomo de Cerdo",
            descripcion: "300 gramos de lomo de cerdo al grill en salsa de ciruelas guarnición papa a la francesa y mix de lechugas.",
            precio: 46000,
            imagen: "img/LOMO DE CERDO.webp",
            disponible: true,
            prepTime: "25 min",
            porciones: "1 pers.",
            etiquetas: ["🐖 Grill"]
        },

        // AVES Y BBQ
        {
            id: 301,
            categoria: "Aves y BBQ",
            nombre: "Texas Chicken",
            descripcion: "Pan parmesano, croqueta de carne, queso cheddar, tartar de pollo desmechado, papá bucarita, mermelada de piña, vegetales frescos.",
            precio: 35000,
            imagen: "img/TEXAS CHICKEN.webp",
            disponible: true,
            prepTime: "15 min",
            porciones: "1 pers.",
            etiquetas: ["🍗 Pollo"]
        },
        {
            id: 302,
            categoria: "Aves y BBQ",
            nombre: "Grilled Chicken",
            descripcion: "300 gr de pechuga al grill, guarnición cascos de papa o papa a la francesa o papa al vapor y mix de lechugas.",
            precio: 44000,
            imagen: "img/GRILLED CHICKEN.webp",
            disponible: true,
            prepTime: "20 min",
            porciones: "1 pers.",
            etiquetas: ["🔥 Grill", "🥗 Ligero"],
            modificadores: [
                {
                    grupo: "Guarnición",
                    seleccion: "unica",
                    opciones: [
                        { nombre: "Cascos de Papa", precio: 0 },
                        { nombre: "Papa a la Francesa", precio: 0 },
                        { nombre: "Papa al Vapor", precio: 0 }
                    ]
                }
            ]
        },
        {
            id: 303,
            categoria: "Aves y BBQ",
            nombre: "Alitas Ranger",
            descripcion: "6 piezas de alitas crispy, en salsa buffalo, bbq , con papa rustica y papa a la francesa.",
            precio: 38000,
            imagen: "img/ALITAS RANGER.webp",
            disponible: true,
            prepTime: "20 min",
            porciones: "1 pers.",
            etiquetas: ["🌶️ Crispy"]
        },

        // PARA COMPARTIR
        {
            id: 401,
            categoria: "Para Compartir",
            nombre: "Picada Wild West",
            descripcion: "250 gr de brisket, 6 alitas crispy bbq, mac and chees, burger smash, chorizos de ternera, costilla ahumada y más.",
            precioOriginal: 200000,
            precio: 189000,
            imagen: "img/Picada Wild West.png",
            disponible: true,
            prepTime: "35 min",
            porciones: "3-4 pers.",
            etiquetas: ["🔥 Ahumados", "🥩 Para 4"]
        },
        {
            id: 402,
            categoria: "Para Compartir",
            nombre: "Pulled Pork Sand",
            descripcion: "Pan francés 180 gr de pulled pork, salsa Showy, pepinillos, queso colby jack, tocineta, vegetales frescos.",
            precio: 54000,
            imagen: "img/PULLED PORK SAND.webp",
            disponible: true,
            prepTime: "20 min",
            porciones: "1-2 pers.",
            etiquetas: ["🥖 Sándwich"]
        },

        // BEBIDAS
        {
            id: 601,
            categoria: "Bebidas",
            nombre: "Coca-Cola Lata 300ml",
            descripcion: "Refrescante y clásica.",
            precio: 5000,
            imagen: "img/Bebidas/Coca-Cola Lata 300ml.avif",
            disponible: true,
            prepTime: "1 min",
            porciones: "1 pers.",
            etiquetas: ["🥤 Fría"]
        },
        {
            id: 602,
            categoria: "Bebidas",
            nombre: "Cerveza Poker Lata 300ml",
            descripcion: "Cerveza nacional para acompañar tu comida.",
            precio: 6000,
            imagen: "img/Bebidas/Cerveza POKER LATA 300ML.webp",
            disponible: true,
            prepTime: "1 min",
            porciones: "1 pers.",
            etiquetas: ["🍺 Refrescante"]
        },
        {
            id: 603,
            categoria: "Bebidas",
            nombre: "Limonada Natural",
            descripcion: "Limonada fresca y natural.",
            precio: 8000,
            imagen: "img/Bebidas/LIMONADA NATURAL.avif",
            disponible: true,
            prepTime: "5 min",
            porciones: "1 pers.",
            etiquetas: ["🍋 Natural"]
        },
        {
            id: 604,
            categoria: "Bebidas",
            nombre: "Jugo de Mango",
            descripcion: "Delicioso jugo de fruta natural.",
            precio: 9000,
            imagen: "img/Bebidas/Jugo de Mango.jpg",
            disponible: true,
            prepTime: "5 min",
            porciones: "1 pers.",
            etiquetas: ["🥭 Fruta"]
        },
        {
            id: 605,
            categoria: "Bebidas",
            nombre: "Tinto o Café Americano",
            descripcion: "Para cerrar con broche de oro.",
            precio: 4000,
            imagen: "img/Bebidas/Tinto o Café americanino.png",
            disponible: true,
            prepTime: "5 min",
            porciones: "1 pers.",
            etiquetas: ["☕ Caliente"]
        }
    ]
};
