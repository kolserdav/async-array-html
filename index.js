// @ts-check
/**
 * Демонстрация двух способов работы с массивами в ассинхронной функции
 * для создания HTML элементов
 * 
 * "Раз функция асинк, значит и далее так понимаю асинк должен быть."
 * если вызывать в async функции другие функции без await это нормально,
 * не должны быть ассинхронными все функции которые вызваются в async.
 * Но если функция имеет ассинхронную операцию, например ассинхронный запрос на сервер (не ассинхронный запрос давно deprecated)
 * или как здесь в примере намерено используются нативные JS ассинхронные функции (setTimeout). То вот такая функция
 * хоть она запущена в обычной хоть в ассинхронной, всегда будет возвращать Promise а не результаты,
 * вот для того чтобы поток процессора не хватал промисы и шел дальше, а дожидался когда получится готовый результат
 * и служит await.
 */

const INDEXES = [1,2,3,4,5];

 /**
  * 1 способ работы с async, через Promise.All - рекомендуется использовать именного его, второй способ лишь для понимания 
  * Также содержит два способа добавления HTML элементов.
   * @typedef {(array: any[]) => Promise<1 | 0>} Handler
   * @type {Handler}
   */
const createListFromArray = async (array) => {
  const container = document.querySelector('#container');
  const container2 = document.querySelector('#container__2');

  // // Первый способ создания элементов: передаем строку в innerHTML (более простой и наглядный)
  // Проходит по каждому элементу массива через map, внутри map await не будет работать
  const resultPromises = array.map((item) => {
    // Оформление ассинхронной операции в Promise позволяет выдергивать результат из действия ассинхронной операции через колбек resolve
    //
    return new Promise((resolve) => {
      // setTimeout это запуск ассинхронной операции, ради которой создан каждый Promise
      setTimeout(() => {
        // Строка в ё кавычках с переданными значениями полученными ассинхронно
        resolve(`<a href="/punk/${item}" class="art-name heading-MB-Mon">Punk ${item}</a>`);
      }, 100)
    })
  })
  // Promise.all ассинхронно выполняет все промисы и в результате возваращает массив результатов
  const result = await Promise.all(resultPromises);
  // Объедитяем массив строк через пустой разделитель и присваеваем значения внутреннему HTML контейнера
  container.innerHTML = result.join('')

  // // Второй способ создания элементов: через document.createElement (безопаснее чем первый, так как строка хуже обрабатывается IDE на предмет возможных ошибок)
  // Проходит по каждому элементу массива и возвращает массив промисов, которые когда выполнятся должны будут вернуть HTML элементы 
  const resultPromises2 = array.map((item) => {
    return new Promise((resolve) => {
      // setTimeout это запуск ассинхронной операции, ради которой создан каждый Promise
      setTimeout(() => {
        // Создаем элемент DOM a
        const listItemA = document.createElement('a');
        // Добавляем аттрибут href
        listItemA.href = `/punk/${item}`;
        // Добавляем классы
        listItemA.classList.add('art-name', 'heading-MB-Mon');
        // Добавляем текст элемента если бы добавляли другой элемент, то было бы innerHTML
        listItemA.innerText = `Punk ${item}`;
        resolve(listItemA);
      }, 100)
    })
  })
  // Promise.all ассинхронно выполняет все промисы и в результате возваращает массив результатов
  const result2 = await Promise.all(resultPromises2);
  result2.map((item) => {
    // appendChild не очищает содержимое innerHTML контейнера
    container2.appendChild(item);
  })

  return 0;
}

/**
 * 2 способ через обычный цикл вместе с await
 *  не рекомендуется его использовать!, так как он блокирует
 *  поток процессора на себе
  * @type {Handler}
 */
const createListFromArray2 = async (array) => {
  let i = 0;
  // Проходим по каждому элементу, также можно использовать цикл for. Внутри цикла - await будет работать
  while (INDEXES[i]) {
    await createListFromArray(array);
    i++;
  } 
  return 0;
}

window.onload = async () => {
  await createListFromArray(INDEXES);
  await createListFromArray2(INDEXES);
}