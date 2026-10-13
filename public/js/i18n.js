// ============================================
// ТІЛ ЖҮЙЕСІ (i18n)
// Қазақша + Орысша
// ============================================

const translations = {
  kz: {
    // ===== Жалпы =====
    app_name: "Мектеп Рекордтары",
    app_subtitle: "Бастауыш сынып оқушыларының жетістіктері",
    loading: "Жүктелуде...",
    error: "Қате",
    success: "Сәтті",
    save: "Сақтау",
    cancel: "Болдырмау",
    delete: "Өшіру",
    edit: "Өңдеу",
    add: "Қосу",
    close: "Жабу",
    back: "Артқа",
    next: "Келесі",
    yes: "Иә",
    no: "Жоқ",
    ok: "Жарайды",
    actions: "Әрекет",
    status: "Мәртебе",
    video: "Видео",

    // ===== Тіл =====
    language: "Тіл",
    kazakh: "Қазақша",
    russian: "Орысша",

    // ===== Кіру / Тіркелу =====
    login: "Кіру",
    register: "Тіркелу",
    logout: "Шығу",
    login_title: "Жүйеге кіру",
    register_title: "Тіркелу",
    login_placeholder: "Логин",
    password_placeholder: "Құпиясөз",
    login_button: "Кіру",
    register_button: "Тіркелу",
    no_account: "Аккаунтыңыз жоқ па?",
    have_account: "Аккаунтыңыз бар ма?",
    register_link: "Тіркелу",
    login_link: "Кіру",

    // ===== Тіркелу формасы =====
    full_name: "Аты-жөні",
    full_name_placeholder: "Мысалы: Айдар Сериков",
    class: "Сыныбы",
    class_placeholder: "Мысалы: 3А",
    phone: "Телефон нөмірі",
    phone_placeholder: "87001234567",
    weight: "Салмағы (кг)",
    height: "Бойы (см)",
    login_field: "Логин",
    login_field_placeholder: "Логин (ағылшын әріптері)",
    password_field: "Құпиясөз",
    password_field_placeholder: "Кемінде 4 таңба",

    // ===== Хабарламалар =====
    msg_register_success: "Сәтті тіркелдіңіз!",
    msg_login_success: "Сәтті кірдіңіз!",
    msg_login_error: "Логин немесе құпиясөз қате",
    msg_field_required: "Барлық өрісті толтырыңыз",
    msg_password_short: "Құпиясөз кемінде 4 таңба",
    msg_login_taken: "Бұл логин бос емес",
    msg_network_error: "Желі қатесі. Интернетті тексеріңіз.",
    msg_server_error: "Сервер қатесі",

    // ===== Басты бет =====
    welcome: "Қош келдіңіз",
    welcome_message: "Мектеп рекордтарына қош келдіңіз!",
    start: "Бастау",

    // ===== Оқушы панелі =====
    student_panel: "Оқушы панелі",
    my_results: "Нәтижелер",
    categories: "Жарыс бағыттары",
    ranking: "Рейтинг кестесі",
    profile: "Профиль",
    submit_result: "Нәтиже жіберу",
    choose_category: "Бағытты таңдаңыз",
    enter_result: "Нәтижені енгізіңіз",
    video_link: "Видео сілтемесі (Google Drive)",
    video_link_help: "Видеоны Google Drive-ке жүктеп, сілтемесін осында қойыңыз",
    submit: "Жіберу",
    status_pending: "Тексерілуде",
    status_approved: "Расталды",
    status_rejected: "Қабылданбады",
    no_results: "Әзірге нәтижелеріңіз жоқ",

    // ===== Админ панелі =====
    admin_panel: "Мұғалім панелі",
    dashboard: "Басты бет",
    manage_categories: "Бағыттар",
    check_results: "Тексеру кезегі",
    students: "Оқушылар",
    statistics: "Статистика",
    total_students: "Барлық оқушылар",
    total_categories: "Барлық бағыттар",
    pending_results: "Тексеруді күтуде",
    approved_results: "Расталған",
    rejected_results: "Қабылданбаған",

    // ===== Бағыттар =====
    category_name: "Бағыт атауы",
    category_unit: "Өлшем бірлігі",
    category_sort: "Реттілік",
    sort_desc: "Көп = жақсы (рет)",
    sort_asc: "Аз = жақсы (уақыт)",
    add_category: "Жаңа бағыт қосу",
    edit_category: "Бағытты өңдеу",
    delete_category: "Бағытты өшіру",
    confirm_delete: "Өшіруге сенімдісіз бе?",

    // ===== Нәтижелер =====
    student_name: "Оқушы аты-жөні",
    result_value: "Нәтиже",
    video: "Видео",
    watch_video: "Видеоны ашу",
    approve: "Растау",
    reject: "Қабылдамау",
    reject_reason: "Қабылдамау себебі",
    approve_confirm: "Осы нәтижені растайсыз ба?",
    reject_confirm: "Осы нәтижені қабылдамайсыз ба?",

    // ===== Рейтинг =====
    rank: "Орын",
    place: "Орын",
    no_data: "Деректер жоқ",

    // ===== Бағыттар (мысал) =====
    cat_jump_rope: "Скакалка секіру",
    cat_pushups: "Отжимание",
    cat_pullups: "Турникке тартылу",
    cat_squats: "Приседание",
    cat_running: "Жүгіру"
  },

  ru: {
    // ===== Общее =====
    app_name: "Школьные Рекорды",
    app_subtitle: "Достижения учеников начальных классов",
    loading: "Загрузка...",
    error: "Ошибка",
    success: "Успешно",
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    edit: "Редактировать",
    add: "Добавить",
    close: "Закрыть",
    back: "Назад",
    next: "Далее",
    yes: "Да",
    no: "Нет",
    ok: "Хорошо",
    actions: "Действия",
    status: "Статус",
    video: "Видео",

    // ===== Язык =====
    language: "Язык",
    kazakh: "Казахский",
    russian: "Русский",

    // ===== Вход / Регистрация =====
    login: "Войти",
    register: "Регистрация",
    logout: "Выйти",
    login_title: "Вход в систему",
    register_title: "Регистрация",
    login_placeholder: "Логин",
    password_placeholder: "Пароль",
    login_button: "Войти",
    register_button: "Зарегистрироваться",
    no_account: "Нет аккаунта?",
    have_account: "Уже есть аккаунт?",
    register_link: "Регистрация",
    login_link: "Войти",

    // ===== Форма регистрации =====
    full_name: "ФИО",
    full_name_placeholder: "Например: Айдар Сериков",
    class: "Класс",
    class_placeholder: "Например: 3А",
    phone: "Номер телефона",
    phone_placeholder: "87001234567",
    weight: "Вес (кг)",
    height: "Рост (см)",
    login_field: "Логин",
    login_field_placeholder: "Логин (латинские буквы)",
    password_field: "Пароль",
    password_field_placeholder: "Минимум 4 символа",

    // ===== Сообщения =====
    msg_register_success: "Успешно зарегистрированы!",
    msg_login_success: "Успешно вошли!",
    msg_login_error: "Неверный логин или пароль",
    msg_field_required: "Заполните все поля",
    msg_password_short: "Пароль минимум 4 символа",
    msg_login_taken: "Этот логин занят",
    msg_network_error: "Ошибка сети. Проверьте интернет.",
    msg_server_error: "Ошибка сервера",

    // ===== Главная =====
    welcome: "Добро пожаловать",
    welcome_message: "Добро пожаловать в Школьные Рекорды!",
    start: "Начать",

    // ===== Панель ученика =====
    student_panel: "Панель ученика",
    my_results: "Результаты",
    categories: "Направления соревнований",
    ranking: "Таблица рейтинга",
    profile: "Профиль",
    submit_result: "Отправить результат",
    choose_category: "Выберите направление",
    enter_result: "Введите результат",
    video_link: "Ссылка на видео (Google Drive)",
    video_link_help: "Загрузите видео на Google Drive и вставьте ссылку сюда",
    submit: "Отправить",
    status_pending: "На проверке",
    status_approved: "Одобрено",
    status_rejected: "Отклонено",
    no_results: "У вас пока нет результатов",

    // ===== Панель админа =====
    admin_panel: "Панель учителя",
    dashboard: "Главная",
    manage_categories: "Направления",
    check_results: "Проверка результатов",
    students: "Ученики",
    statistics: "Статистика",
    total_students: "Всего учеников",
    total_categories: "Всего направлений",
    pending_results: "Ожидают проверки",
    approved_results: "Одобренные",
    rejected_results: "Отклонённые",

    // ===== Направления =====
    category_name: "Название направления",
    category_unit: "Единица измерения",
    category_sort: "Порядок",
    sort_desc: "Больше = лучше (разы)",
    sort_asc: "Меньше = лучше (время)",
    add_category: "Добавить направление",
    edit_category: "Редактировать направление",
    delete_category: "Удалить направление",
    confirm_delete: "Вы уверены, что хотите удалить?",

    // ===== Результаты =====
    student_name: "ФИО ученика",
    result_value: "Результат",
    video: "Видео",
    watch_video: "Открыть видео",
    approve: "Одобрить",
    reject: "Отклонить",
    reject_reason: "Причина отклонения",
    approve_confirm: "Одобрить этот результат?",
    reject_confirm: "Отклонить этот результат?",

    // ===== Рейтинг =====
    rank: "Место",
    place: "Место",
    no_data: "Нет данных",

    // ===== Направления (пример) =====
    cat_jump_rope: "Прыжки на скакалке",
    cat_pushups: "Отжимания",
    cat_pullups: "Подтягивания",
    cat_squats: "Приседания",
    cat_running: "Бег"
  }
};

// ============================================
// ТІЛ ЖҮЙЕСІНІҢ ФУНКЦИЯЛАРЫ
// ============================================

// Ағымдағы тілді алу
function getLang() {
  return localStorage.getItem('lang') || 'kz';
}

// Тілді орнату
function setLang(lang) {
  if (lang !== 'kz' && lang !== 'ru') lang = 'kz';
  localStorage.setItem('lang', lang);
  applyTranslations();
  updateLangButtons();
}

// Аудару функциясы
function t(key) {
  const lang = getLang();
  return translations[lang][key] || translations.kz[key] || key;
}

// HTML-дегі барлық data-i18n элементтерін ауыстыру
function applyTranslations() {
  // Мәтіндер (textContent)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Placeholder-лар
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Title атрибуттары (tooltip)
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    el.title = t(key);
  });

  // HTML-мазмұны
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = t(key);
  });

  // Бет тақырыбы (title)
  const titleKey = document.body.getAttribute('data-title');
  if (titleKey) {
    document.title = t(titleKey);
  }
}

// Тіл батырмаларын белсендіру
function updateLangButtons() {
  const currentLang = getLang();
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    const btnLang = btn.getAttribute('data-lang-btn');
    if (btnLang === currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Бет жүктелгенде автоматты іске қосу
document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();
  updateLangButtons();
});