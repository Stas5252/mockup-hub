'use strict';
(() => {
  const forest = document.querySelector('.forest-scene');
  if (!forest) return;
  const seasons = {
    winter: {
      name: 'Зима', title: 'Новогодье в Заповеднике сказок',
      description: 'Три часа в зимней сказке: встречи с героями, игры и чаепитие в тёплых домиках.',
      facts: ['Программа 2026–2027: 3 декабря — 17 января.', 'Рекомендованный возраст — от 5 до 12 лет.', 'В программе — сказочные герои, чаепитие и сладкий подарок.', 'Доставка оплачивается отдельно. Стоимость зависит от даты.'],
      url: '/dlya_shkolnikov_i_doshkolnikov/novyj_god_dlya_shkolnikov'
    },
    spring: {
      name: 'Весна', title: 'Встреча весны — Масленица',
      description: 'Сказочные герои, командные игры, народные забавы и чаепитие с блинами.',
      facts: ['Интерактивная программа в Заповеднике сказок.', 'Масленичные забавы и знакомство с русскими традициями.', 'Мастер-класс и чаепитие с блинами.', 'На старом сайте указан сезон 2026. Даты следующего сезона уточняйте у команды.'],
      url: '/dlya_shkolnikov_i_doshkolnikov/vstrecha-vesny'
    },
    summer: {
      name: 'Лето', title: 'Летние приключения для лагерей',
      description: 'Поиск сокровищ, сказочные путешествия и командные игры для детских групп.',
      facts: ['Программы для пришкольных лагерей и детских групп.', 'В каталоге есть «Затерянный остров» и «Вокруг света за 80 дней».', 'Также доступны командные игры «Разрушители мифов».', 'Программу, возраст участников и дату согласуйте с менеджером.'],
      url: '/dlya_shkolnikov_i_doshkolnikov/prishkolnye_lagerya'
    },
    autumn: {
      name: 'Осень', title: 'Осенние праздники для школьников',
      description: 'Соберите класс и отправьтесь за новыми впечатлениями в Заповедник сказок.',
      facts: ['Отдельное направление в каталоге «Летучего корабля».', 'Подходящий сценарий подберёт команда центра.', 'Расскажите менеджеру о возрасте детей, составе группы и желаемой дате.', 'Стоимость и наличие программы уточняются перед бронированием.'],
      url: '/dlya_shkolnikov_i_doshkolnikov/osennie-prazdniki-dlya-shkolnikov'
    }
  };
  const buttons = [...forest.querySelectorAll('[data-season]')];
  const title = forest.querySelector('.season-program-title');
  const description = forest.querySelector('.season-program-description');
  const status = forest.querySelector('.season-status');
  const programDialog = document.getElementById('season-program-dialog');
  const programTitle = programDialog.querySelector('h2');
  const facts = programDialog.querySelector('.season-facts');
  const sourceLink = programDialog.querySelector('.season-source');
  let current = 'autumn';

  function selectSeason(key) {
    const season = seasons[key];
    if (!season) return;
    current = key;
    forest.dataset.season = key;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.season === key)));
    title.textContent = season.title;
    description.textContent = season.description;
    status.textContent = `${season.name}. Лес меняется — сказка остаётся.`;
  }
  buttons.forEach(button => button.addEventListener('click', () => selectSeason(button.dataset.season)));
  selectSeason(current);

  forest.querySelector('[data-season-program]').addEventListener('click', () => {
    const season = seasons[current];
    programTitle.textContent = season.title;
    facts.replaceChildren(...season.facts.map(text => {
      const item = document.createElement('li');
      item.textContent = text;
      return item;
    }));
    sourceLink.href = 'https://www.korabl-kirov.ru' + season.url;
    programDialog.showModal();
  });
  programDialog.querySelector('.season-dialog-close').addEventListener('click', () => programDialog.close());
  programDialog.addEventListener('click', event => {
    if (event.target !== programDialog) return;
    const rect = programDialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) programDialog.close();
  });
  programDialog.querySelector('[data-season-enquiry]').addEventListener('click', () => {
    const contact = document.getElementById('contact-dialog');
    contact.querySelector('[name="direction"]').value = 'Заповедник сказок';
    const message = contact.querySelector('[name="message"]');
    if (!message.value.trim()) message.value = `Интересует программа «${seasons[current].title}».`;
    programDialog.close();
    contact.showModal();
  });

  // Reserve the original photograph as a fallback if the illustration cannot load.
  const artwork = new Image();
  artwork.onload = () => {
    forest.style.setProperty('--season-ratio', String(artwork.naturalWidth / artwork.naturalHeight));
    forest.classList.add('season-art-ready');
  };
  artwork.src = new URL('assets/forest-seasons.webp', document.baseURI).href;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      forest.classList.toggle('season-visible', entries[0].isIntersecting);
    });
    observer.observe(forest);
  } else forest.classList.add('season-visible');
})();
