'use strict';

const express = require(`express`);
const request = require(`supertest`);

const initDB = require(`../lib/init-db`);
const mockDB = require(`../lib/mock-db`);
const passwordUtils = require(`../lib/password`);

const search = require(`./search`);
const DataService = require(`../data-service/search`);
const {HttpCode} = require(`../../constants`);

const mockCategories = [
  `Деревья`,
  `Без рамки`,
  `Кино`,
  `Программирование`,
  `За жизнь`,
  `Железо`,
  `IT`
];

const mockUsers = [
  {
    name: `Иван Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`),
    avatar: `avatar01.jpg`
  },
  {
    name: `Пётр Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`),
    avatar: `avatar02.jpg`
  }
];

const mockData = [
  {
    "title": "Рок — это протест",
    "announce": "Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Из под его пера вышло 8 платиновых альбомов. Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов.",
    "fullText": "Из под его пера вышло 8 платиновых альбомов. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Ёлки — это не просто красивое дерево. Это прочная древесина.",
    "comments": [{
      "user": `ivanov@example.com`,
      "text": "С чем связана продажа? Почему так дешёво? А где блок питания? Почему в таком ужасном состоянии?"
    }, {
      "user": `petrov@example.com`,
      "text": "Совсем немного..."
    }, {
      "user": `ivanov@example.com`,
      "text": "А сколько игр в комплекте? Вы что?! В магазине дешевле."
    }],
    "createdDate": "2022-2-27 3:0:25",
    "user": `ivanov@example.com`,
    "categories": ["Деревья"]
  },
  {
    "title": "Самый лучший музыкальный альбом этого года",
    "announce": "Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Достичь успеха помогут ежедневные повторения. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.",
    "fullText": "Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Это прочная древесина. Из под его пера вышло 8 платиновых альбомов.",
    "comments": [{
      "user": `petrov@example.com`,
      "text": "Вы что?! В магазине дешевле. Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво?"
    }, {
      "user": `petrov@example.com`,
      "text": "Продаю в связи с переездом. Отрываю от сердца."
    }, {
      "user": `petrov@example.com`,
      "text": "Почему в таком ужасном состоянии? А сколько игр в комплекте?"
    }],
    "createdDate": "2022-2-26 22:43:20",
    "user": `ivanov@example.com`,
    "categories": ["Без рамки"]
  },
  {
    "title": "Как достигнуть успеха не вставая с кресла",
    "announce": "Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Он написал больше 30 хитов. Программировать не настолько сложно, как об этом говорят. Простые ежедневные упражнения помогут достичь успеха.`",
    "fullText": "Собрать камни бесконечности легко, если вы прирожденный герой. Простые ежедневные упражнения помогут достичь успеха.` Из под его пера вышло 8 платиновых альбомов. Программировать не настолько сложно, как об этом говорят.",
    "comments": [{
      "user": `petrov@example.com`,
      "text": "Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? А сколько игр в комплекте?"
    }, {
      "user": `petrov@example.com`,
      "text": "А сколько игр в комплекте? Неплохо, но дорого. Совсем немного..."
    }, {
      "user": `petrov@example.com`,
      "text": "Оплата наличными или перевод на карту? Почему в таком ужасном состоянии? Вы что?! В магазине дешевле."
    }],
    "createdDate": "2022-2-19 23:23:3",
    "user": `ivanov@example.com`,
    "categories": ["Без рамки"]
  }, {
    "title": "Борьба с прокрастинацией",
    "announce": "Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Простые ежедневные упражнения помогут достичь успеха.`",
    "fullText": "Он написал больше 30 хитов. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Программировать не настолько сложно, как об этом говорят.",
    "comments": [{
      "user": `ivanov@example.com`,
      "text": "Почему в таком ужасном состоянии? С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту?"
    }, {
      "user": `ivanov@example.com`,
      "text": "Оплата наличными или перевод на карту? А сколько игр в комплекте?"
    }, {
      "user": `ivanov@example.com`,
      "text": "Совсем немного... А где блок питания? Вы что?! В магазине дешевле."
    }],
    "createdDate": "2022-2-22 16:35:5",
    "user": `petrov@example.com`,
    "categories": ["Кино"]
  }, {
    "title": "Учим HTML и CSS",
    "announce": "Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Из под его пера вышло 8 платиновых альбомов. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.",
    "fullText": "Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.",
    "comments": [{
      "user": `petrov@example.com`,
      "text": "Оплата наличными или перевод на карту?"
    }],
    "createdDate": "2022-2-27 2:27:25",
    "user": `ivanov@example.com`,
    "categories": ["Деревья"]
  }, {
    "title": "Борьба с прокрастинацией",
    "announce": "Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Первая большая ёлка была установлена только в 1938 году. Достичь успеха помогут ежедневные повторения. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.",
    "fullText": "Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Ёлки — это не просто красивое дерево. Это прочная древесина. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Собрать камни бесконечности легко, если вы прирожденный герой.",
    "comments": [{
      "user": `petrov@example.com`,
      "text": "С чем связана продажа? Почему так дешёво?"
    }],
    "createdDate": "2022-2-20 6:6:27",
    "user": `ivanov@example.com`,
    "categories": ["Программирование"]
  }, {
    "title": "Ёлки. История деревьев",
    "announce": "Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Как начать действовать? Для начала просто соберитесь. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.",
    "fullText": "Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Ёлки — это не просто красивое дерево. Это прочная древесина. Достичь успеха помогут ежедневные повторения. Первая большая ёлка была установлена только в 1938 году.",
    "comments": [{
      "user": `ivanov@example.com`,
      "text": "Неплохо, но дорого. А сколько игр в комплекте? Совсем немного..."
    }, {
      "user": `ivanov@example.com`,
      "text": "С чем связана продажа? Почему так дешёво? Оплата наличными или перевод на карту? Неплохо, но дорого."
    }],
    "createdDate": "2022-2-27 0:4:7",
    "user": `petrov@example.com`,
    "categories": ["Без рамки"]
  }, {
    "title": "Как собрать камни бесконечности",
    "announce": "Первая большая ёлка была установлена только в 1938 году. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха.` Как начать действовать? Для начала просто соберитесь.",
    "fullText": "Как начать действовать? Для начала просто соберитесь. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Ёлки — это не просто красивое дерево. Это прочная древесина.",
    "comments": [{
      "user": `petrov@example.com`,
      "text": "Продаю в связи с переездом. Отрываю от сердца. С чем связана продажа? Почему так дешёво?"
    }, {
      "user": `petrov@example.com`,
      "text": "С чем связана продажа? Почему так дешёво?"
    }],
    "createdDate": "2022-2-21 21:52:11",
    "user": `ivanov@example.com`,
    "categories": ["За жизнь"]
  }, {
    "title": "Как начать программировать",
    "announce": "Золотое сечение — соотношение двух величин, гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Ёлки — это не просто красивое дерево. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха.`",
    "fullText": "Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Из под его пера вышло 8 платиновых альбомов. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Собрать камни бесконечности легко, если вы прирожденный герой.",
    "comments": [{
      "user": `ivanov@example.com`,
      "text": "А где блок питания? С чем связана продажа? Почему так дешёво? Неплохо, но дорого."
    }],
    "createdDate": "2022-2-23 23:15:35",
    "user": `petrov@example.com`,
    "categories": ["Железо"]
  }, {
    "title": "Борьба с прокрастинацией",
    "announce": "Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Программировать не настолько сложно, как об этом говорят.",
    "fullText": "Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин, гармоническая пропорция.",
    "comments": [{
      "user": `petrov@example.com`,
      "text": "Неплохо, но дорого."
    }, {
      "user": `petrov@example.com`,
      "text": "Вы что?! В магазине дешевле."
    }, {
      "user": `petrov@example.com`,
      "text": "Неплохо, но дорого. С чем связана продажа? Почему так дешёво?"
    }],
    "createdDate": "2022-2-21 20:46:10",
    "user": `ivanov@example.com`,
    "categories": ["IT"]
  }
];

const createAPI = async () => {

  await initDB(mockDB, {articles: mockData, categories: mockCategories, users: mockUsers});
  const app = express();
  app.use(express.json());

  search(app, new DataService(mockDB));
  return app;
};

describe(`API returns article based on search query`, () => {

  test(`Status code 200`, async () => {
    const app = await createAPI();
    const response = await request(app)
      .get(`/search`)
      .query({
        query: `Ёлки. История деревьев`
      });
    expect(response.statusCode).toBe(HttpCode.OK);
  });

  test(`1 articles found`, async () => {
    const app = await createAPI();
    const response = await request(app)
      .get(`/search`)
      .query({
        query: `Ёлки. История деревьев`
      });
    expect(response.body.length).toBe(1);
  });

  test(`Article has correct id`, async () => {
    const app = await createAPI();
    const response = await request(app)
      .get(`/search`)
      .query({
        query: `Борьба с прокрастинацией`
      });
    expect(response.body[0].title).toBe(`Борьба с прокрастинацией`);
  });

  test(`API returns code 404 if nothing is found`, async () => {
    const app = await createAPI();
    await request(app)
      .get(`/search`)
      .query({
        query: `Продам свою дуу`
      })
      .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns 400 when query string is absent`, async () => {
    const app = await createAPI();
    await request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST);
  });
});


