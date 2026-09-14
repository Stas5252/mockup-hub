/**
 * БАЗА ДАННЫХ МАКЕТОВ САЙТОВ
 * Чтобы добавить новый сайт:
 * 1. Создайте папку в mockups/<ваша-папка>/ с файлом index.html
 * 2. Добавьте объект ниже в массив MOCKUPS_DATA
 * 3. Готово! Ссылка автоматически сформируется для клиентов.
 */

const MOCKUPS_DATA = [
  {
    id: "furniture-modern",
    title: "Nordic Wood — Студия дизайнерской мебели",
    category: "Мебель",
    folder: "furniture-modern",
    description: "Премиальный лендинг фабрики авторской мебели из массива дуба и бука. Стильный минимализм, каталог коллекций, калькулятор и форма заявки.",
    tags: ["Мебель", "Интерьер", "Каталог", "Премиум", "Лендинг"],
    preview: "assets/previews/furniture-modern.jpg",
    featured: true,
    emoji: "🛋️"
  },
  {
    id: "realty-luxury",
    title: "Aura Residence — Клубный дом & Недвижимость",
    category: "Недвижимость",
    folder: "realty-luxury",
    description: "Элитный жилой комплекс премиум-класса. Интерактивные планировки, 3D-панорамы, преимущества локации и бронирование приватного просмотра.",
    tags: ["Недвижимость", "Архитектура", "Премиум", "Инвестиции"],
    preview: "assets/previews/realty-luxury.jpg",
    featured: true,
    emoji: "🏢"
  },
  {
    id: "auto-detailing",
    title: "Apex Detailing — Премиальный автоуход",
    category: "Авто",
    folder: "auto-detailing",
    description: "Студия детейлинга и защиты кузова. Оклейка полиуретаном, керамика, полировка и прайс-лист комплексов для бизнес и премиум-сегмента.",
    tags: ["Авто", "Детейлинг", "Услуги", "Прайс"],
    preview: "assets/previews/auto-detailing.jpg",
    featured: false,
    emoji: "🏎️"
  },
  {
    id: "coffee-roastery",
    title: "Black Roast — Крафтовая обжарка кофе",
    category: "Рестораны & Кафе",
    folder: "coffee-roastery",
    description: "Атмосферный сайт кофейни и интернет-магазин свежеобжаренного зерна со всего мира с возможностью быстрой доставки.",
    tags: ["Кафе", "Кофе", "E-commerce", "Доставка"],
    preview: "assets/previews/coffee-roastery.jpg",
    featured: false,
    emoji: "☕"
  }
];

// Список всех доступных категорий (формируется динамически или задается здесь)
const CATEGORIES_LIST = [
  "Все",
  "Мебель",
  "Недвижимость",
  "Авто",
  "Рестораны & Кафе",
  "Услуги",
  "Интернет-магазины"
];
