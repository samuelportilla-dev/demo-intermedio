// Archivo estructurado para configuración (Este será el que edite el dueño o será reemplazado por la lectura de Google Sheets)

const RESTAURANT_CONFIG = {
    // === DATOS DEL RESTAURANTE ===
    id: "lanonna", // ID Único para sincronizar con Google Sheets (SaaS)
    nombre: "LA NONNA RÚSTICA",
    slogan: "La verdadera esencia de la cocina rústica italiana, en tu mesa.",
    logo: "img/logo.png", 
    googleSheetUrl: "https://docs.google.com/spreadsheets/d/1-zMzrxFpWAkU2u0eqFW1LnlG_a0a3VCze5EWchjkQQ0/export?format=csv", // Link configurado correctamente
    telefonoWP: "573112518913",
    mensajeWP: "¡Hola La Nonna! Quiero hacer el siguiente pedido:\n",
    moneda: "$",
    horarios: {
        apertura: "11:00",
        cierre: "22:00"
    },

    // === COLORES DE LA MARCA ===
    colores: {
        principal: "#c1121f",
        secundario: "#003049",
        fondo: "#fdf8f5"
    },

    // === BANNERS PROMOCIONALES ===
    promociones: [
        {
            titulo: "Il Martedì di Pizza",
            descripcion: "Disfruta de un 2x1 en nuestras Pizzas Clásicas todos los martes.",
            fondo: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop"
        },
        {
            titulo: "Speciale Trufa Oscura",
            descripcion: "Prueba la obra maestra Rústica Trufada con 15% de cortesía.",
            fondo: "https://images.unsplash.com/photo-1552539618-7eec9b4d1796?q=80&w=800&auto=format&fit=crop"
        },
        {
            titulo: "Serata di Vino",
            descripcion: "Copa de vino italiano de la casa como cortesía por la compra de una Pasta Fresca.",
            fondo: "https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?q=80&w=800&auto=format&fit=crop"
        }
    ],

    // === CATEGORÍAS DEL MENÚ ===
    categorias: ["Entradas", "Pizzas Clásicas", "Pizzas Especiales", "Pastas Frescas", "Bebidas", "Postres"],

    // === PRODUCTOS ===
    productos: [
        // ENTRADAS
        {
            id: 101,
            categoria: "Entradas",
            nombre: "Pan con Ajo Supremo",
            descripcion: "Rodajas de pan artesanal al horno de leña, topeadas con mantequilla de ajo asado, crema y costra de parmesano.",
            precioOriginal: 20000,
            precio: 15000,
            imagen: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?q=80&w=600&auto=format&fit=crop", 
            disponible: true
        },
        {
            id: 102,
            categoria: "Entradas",
            nombre: "Palitos de Queso Rústicos",
            descripcion: "Nuestra versión de los tequeños, rellenos de mozzarella hilada, horneados y servidos con dip de pomodoro fresco.",
            precio: 18000,
            imagen: "https://bistrobadia.de/wp-content/uploads/2025/02/blaetterteig-kaesestangen-1024x576.jpg", // Imagen rústica y premium de palitos de pan/queso
            disponible: true
        },
        {
            id: 103,
            categoria: "Entradas",
            nombre: "Ensalada Caprese",
            descripcion: "Tomates reliquia en rodajas, burrata fresca, hojas de albahaca recién cortadas, aceite de oliva virgen extra y aceto balsámico.",
            precio: 25000,
            imagen: "https://images.unsplash.com/photo-1529312266912-b33cfce2eefd?q=80&w=600&auto=format&fit=crop",
            disponible: true
        },
        {
            id: 104,
            categoria: "Entradas",
            nombre: "Burrata Cremosa",
            descripcion: "Esfera de mozzarella rellena de crema, recostada sobre pesto rústico y tomates deshidratados.",
            precio: 32000,
            imagen: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=600&auto=format&fit=crop", // Safe salad/cheese dish
            disponible: true
        },

        // PIZZAS CLÁSICAS
        {
            id: 201,
            categoria: "Pizzas Clásicas",
            nombre: "Margherita Tradicional",
            descripcion: "Salsa de tomate pomodoro, mozzarella de búfala fresca, albahaca y un toque de aceite de oliva.",
            precio: 32000,
            imagen: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=600&auto=format&fit=crop",
            disponible: true,
            modificadores: [
                { nombre: "Borde de Queso", precio: 5000 },
                { nombre: "Extra Queso", precio: 3000 },
                { nombre: "Sin albahaca", precio: 0 }
            ]
        },
        {
            id: 202,
            categoria: "Pizzas Clásicas",
            nombre: "Pepperoni NYC",
            descripcion: "Doble porción de pepperoni madurado, queso mozzarella fundido y nuestra salsa de la casa.",
            precio: 35000,
            imagen: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=600&auto=format&fit=crop",
            disponible: true,
            modificadores: [
                { nombre: "Borde de Queso", precio: 5000 },
                { nombre: "Extra Pepperoni", precio: 4000 },
                { nombre: "Miel Picante", precio: 2000 }
            ]
        },
        {
            id: 203,
            categoria: "Pizzas Clásicas",
            nombre: "Hawaiana Premium",
            descripcion: "Jamón ahumado artesanal, trozos de piña asada al barril, y extra queso mozzarella.",
            precio: 34000,
            imagen: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop",
            disponible: true
        },
        {
            id: 204,
            categoria: "Pizzas Clásicas",
            nombre: "Pizza Vegetariana",
            descripcion: "Champiñones frescos, aceitunas negras, pimientos asados, cebollas caramelizadas y rúcula.",
            precioOriginal: 38000,
            precio: 33000,
            imagen: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=600&auto=format&fit=crop",
            disponible: true
        },
        {
            id: 205,
            categoria: "Pizzas Clásicas",
            nombre: "Calzone Napolitano",
            descripcion: "Masa de pizza cerrada en horno de piedra, rellena de ricotta, salami, mozzarella y salsa roja.",
            precio: 38000,
            imagen: "https://images.unsplash.com/photo-1613564834361-9436948817d1?q=80&w=800&auto=format&fit=crop", // Foto profesional de calzone rústico horneado en piedra
            disponible: true
        },

        // PIZZAS ESPECIALES
        {
            id: 301,
            categoria: "Pizzas Especiales",
            nombre: "La Carnívora",
            descripcion: "Pepperoni, salami italiano, tocineta ahumada, jamón y trozos de salchicha de la casa.",
            precio: 45000,
            imagen: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=600&auto=format&fit=crop",
            disponible: true
        },
        {
            id: 302,
            categoria: "Pizzas Especiales",
            nombre: "Prosciutto y Rúcula",
            descripcion: "Mozzarella, prosciutto di Parma fresco, rúcula y queso parmesano rallado grueso.",
            precio: 48000,
            imagen: "https://images.unsplash.com/photo-1555072956-7758afb20e8f?q=80&w=600&auto=format&fit=crop",
            disponible: true
        },
        {
            id: 303,
            categoria: "Pizzas Especiales",
            nombre: "Cuatro Quesos Blend",
            descripcion: "Mix de mozzarella, gorgonzola (queso azul), provolone y parmesano crujiente. Sin salsa roja.",
            precio: 42000,
            imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop",
            disponible: true
        },
        {
            id: 304,
            categoria: "Pizzas Especiales",
            nombre: "Pizza Trufa y Setas",
            descripcion: "Salsa madre blanca, setas silvestres confitadas, crema fresca y aceite de trufa blanca importado.",
            precio: 55000,
            imagen: "https://images.unsplash.com/photo-1552539618-7eec9b4d1796?q=80&w=600&auto=format&fit=crop",
            disponible: true
        },

        // PASTAS FRESCAS
        {
            id: 401,
            categoria: "Pastas Frescas",
            nombre: "Fettuccine Alfredo",
            descripcion: "Pasta fresca en sedosa salsa de crema gruesa, mantequilla y muchísimo parmesano.",
            precio: 30000,
            imagen: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=600&auto=format&fit=crop",
            disponible: true
        },
        {
            id: 402,
            categoria: "Pastas Frescas",
            nombre: "Spaghetti Bolognesa",
            descripcion: "Receta secreta: salsa de carne de res y cerdo molida a fuego lento cocinada por 6 horas.",
            precio: 32000,
            imagen: "https://images.unsplash.com/photo-1622973536968-3ead9e780960?q=80&w=600&auto=format&fit=crop",
            disponible: true
        },
        {
            id: 403,
            categoria: "Pastas Frescas",
            nombre: "Lasaña Clásica al Horno",
            descripcion: "Capas de pasta gratinadas, salsa bechamel sedosa, mozzarella y boloñesa rica.",
            precio: 35000,
            imagen: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=600&auto=format&fit=crop",
            disponible: true
        },
        {
            id: 404,
            categoria: "Pastas Frescas",
            nombre: "Gnocchi al Pesto Siciliano",
            descripcion: "Suaves bolitas de papa en una crema esmeralda de albahaca y piñones tostados.",
            precio: 34000,
            imagen: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=600&auto=format&fit=crop", // Green pesto pasta
            disponible: true
        },
        {
            id: 405,
            categoria: "Pastas Frescas",
            nombre: "Raviolis de Ternera",
            descripcion: "Pasta fresca rellena de suave ternera estofada, bañada en mantequilla tostada y salvia.",
            precio: 38000,
            imagen: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=600&auto=format&fit=crop", // Raviolis
            disponible: true
        },

        // POSTRES
        {
            id: 501,
            categoria: "Postres",
            nombre: "Tiramisú della Nonna",
            descripcion: "Cremoso postre de espresso con mascarpone frío, capas de soletilla y cacao puro.",
            precio: 16000,
            imagen: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?q=80&w=600&auto=format&fit=crop",
            disponible: true
        },
        {
            id: 502,
            categoria: "Postres",
            nombre: "Panna Cotta de Frutos Rojos",
            descripcion: "Suave textura de crema montada, con glaseado y puré fresco de frutas silvestres.",
            precio: 14000,
            imagen: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600&auto=format&fit=crop", // Panna cotta / berry dessert
            disponible: true
        },
        {
            id: 503,
            categoria: "Postres",
            nombre: "Gelato Italiano Piccola (2 Sabores)",
            descripcion: "Helado artesanal compacto: opciones Stracciatella, Pistacho o Chocolate Suizo.",
            precio: 12000,
            imagen: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?q=80&w=600&auto=format&fit=crop", // Icecream
            disponible: true
        },

        // BEBIDAS
        {
            id: 601,
            categoria: "Bebidas",
            nombre: "Coca-Cola 1.5L",
            descripcion: "Familiar bien fría.",
            precio: 10000,
            imagen: "https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=600&auto=format&fit=crop", // Bottle
            disponible: true
        },
        {
            id: 602,
            categoria: "Bebidas",
            nombre: "Coca-Cola Zero Lata",
            descripcion: "En lata para máximo frío.",
            precio: 5000,
            imagen: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop", // Can
            disponible: true
        },
        {
            id: 603,
            categoria: "Bebidas",
            nombre: "Limonada Natural",
            descripcion: "Limonada frappé hecha al momento.",
            precio: 6000,
            imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
            disponible: true
        },
        {
            id: 604,
            categoria: "Bebidas",
            nombre: "Cerveza Peroni Premium",
            descripcion: "Clásica rubia italiana en botella, perfectamente balanceada.",
            precio: 14000,
            imagen: "https://images.unsplash.com/photo-1608270586620-248524c67de9?q=80&w=600&auto=format&fit=crop",
            disponible: true
        }
    ]
};
