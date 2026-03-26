Описание алгоритма по Lecar id, согласно uc пользователя

1. Аутентификация——> Авторизация
   Описание пути пользователя:
   Авторизация по номеру телефона
   1.1 Зарегистрированный пользователь переходит на https://tolyatti.lecar.ru/main нажимает кнопку "Вход" . Пользователю открывается страница аутентификации с формой, в которой необходимо ввести номер телефона или email.

Если пользователь хочет авторизоваться по номеру телефона, то ему необходимо выбрать "Телефон" и ввести номер (+7 XXX XXX XX XX). Далее нажать кнопку "Получить код".

В этот момент происходит проверка наличия данного номера в CDP ( БД):
Если номер найден, пользователю генерится код верификации и отправляется смс сообщением на номер. После получения смс пользователь вводит данный код в открывшейся форме "Код подтверждения"  и нажимает кнопку "Дальше".
В этот момент система проверяет введенный код пользователем:

если код был введен верно- авторизация успешно завершена, пользователь перенаправляется на главную стр.
если код был введен неверно- выводится ошибка - отказ в авторизации


1.2 Системный алгоритм аутентификации- авторизации по почте:
Действие
Метод
Описание
Пользователь вводит на странице аутентификации  номер телефона и нажимает кнопку "Получить код". пользователь найден
POST/api/cdp/lecar-id/v1/customer/authentication/phone
Пользователю отправляет на почту код подтверждения и пользователь перенаправляется на страницу подтверждения кода,
если ответ 200. Если 400/404, то на страницу регистрации.
1.1 Пользователь вводит код подтверждения.
POST/api/cdp/lecar-id/v1/customer/authentication/phone/code
Проверить код введенный пользователем  - при условии если код верен- залогинить пользователя. Успешный  ответ 200. Ошибка 400
2.Обновление токена пользователя
POST/api/cdp/lecar-id/v1/customer/authentication/refresh
Передача старого токена- выдача нового токена
Успешный  ответ 200. Ошибка 400
3.Получение визитор токена
GET/api/cdp/lecar-id/v1/customer/authentication/visitor
Получение визитор токен
Успешный  ответ 200. Ошибка 400



Если пользователь не был найден- он перенаправляется на страницу регистрации


Авторизация по  email
1.1 Зарегистрированный пользователь переходит на https://tolyatti.lecar.ru/main нажимает кнопку "Вход" . Пользователю открывается страница аутентификации с формой, в которой необходимо ввести номер телефона или email.
Если пользователь хочет авторизоваться по email то ему необходимо выбрать "Email" и ввести почту. Далее нажать кнопку "Получить код".

В этот момент происходит проверка наличия данной почты в CDP ( БД):
Если почта найдена, пользователю генерится код верификации и отправляется на почту. После получения письма с кодом пользователь вводит данный код в открывшейся форме "Код подтверждения"  и нажимает кнопку "Дальше".


В этот момент система проверяет введенный код пользователем:

если код был введен верно- авторизация успешно завершена- пользователь перенаправляется на главную стр.
если код был введен неверно- выводится ошибка - отказ в авторизации


1.2 Системный алгоритм аутентификации- авторизации по почте:
Действие
Метод
Описание
Пользователь вводит на странице аутентификации адрес почты и нажимает кнопку "Получить код". пользователь найден
POST/api/cdp/lecar-id/v1/customer/authentication/email
Пользователю отправляет на почту код подтверждения и пользователь перенаправляется на страницу подтверждения кода,
если ответ 200. Если 400/404, то на страницу регистрации.
1.1 Пользователь вводит код подтверждения.
POST/api/cdp/lecar-id/v1/customer/authentication/email/code
Проверить код введенный пользователем  - при условии если код верен- залогинить пользователя.  Успешный  ответ 200. Ошибка 400
2.Обновление токена пользователя
POST/api/cdp/lecar-id/v1/customer/authentication/refresh
Передача старого токена- выдача нового токена.
Успешный  ответ 200. Ошибка 400
3.Получение визитор токена
GET/api/cdp/lecar-id/v1/customer/authentication/visitor
Получение визитор токен.
Успешный  ответ 200. Ошибка 400




2. Аутентификация——> Регистрация ( создание пользователя в CDP)
   Регистрация по почте
   1.1 НЕ зарегистрированный пользователь переходит на https://tolyatti.lecar.ru/main нажимает кнопку "Вход" . Пользователю открывается страница аутентификации с формой, в которой необходимо ввести номер телефона или email.
   Если пользователь хочет зарегистрировать по email то ему необходимо выбрать "Email" и ввести почту. Далее нажать кнопку "Получить код".

В этот момент происходит проверка наличия данной почты в CDP ( БД):
Если почта НЕ найдена, пользователь перенаправляется на форму регистрации, в которой необходимо заполнить все обязательные поля. После заполнения пользователь нажимает  кнопку "Зарегистрироваться"


Система проверяет корректность данных ( в том числе проверка на дубли), генерит и отправляет код верификации пользователю на почту, указанную в форме регистрации.

ВАЖНО! На данный момент в форме подтверждения кода при регистрации по почте выводится некорректная информация, что код отправлен на номер телефона. По факту код отправляется на почту - будет исправлено в  https://kaiten.ladadigit.io/space/471532/boards/card/49459220
UPD 24.09.2025: Релиз с исправлением выпущен на прод
Пример письма с кодом

После получения письма с кодом пользователь вводит код в форме подтверждения кода и нажимает "Далее"
В этот момент система проверяет введенный код пользователем:

если код был введен верно- регистрация успешно завершена- пользователю предлагается перейти в ЛК.

если код был введен неверно- выводится ошибка - отказ в регистрации.

1.2 Системный алгоритм регистрации по почте:
Действие
Метод
Описание
Пользователь вводит на странице аутентификации адрес почты и нажимает кнопку "Получить код". пользователь найден
POST/api/cdp/lecar-id/v1/customer/authentication/email
Ошибка 400/404, пользователь перенаправлен на страницу регистрации.
1.1 Пользователь заполняет форму регистрации и нажимает кнопку "Зарегистрироваться"
POST/api/cdp/lecar-id/v1/customer/verification/email
проверяются данные пользователя . Если ошибок не обнаружено генерится код верификации и отправляется на почту пользователя.
Успешный  ответ 200. Ошибка 400,500
2.Пользователь вводит код, полученный в письме в форме подтверждения кода.
POST//api/cdp/lecar-id/v1/customer:register*

*Метод проверки OTP. NONE - не проверять OTP код. Нужно для регистрации из чекаута. PHONE - проверять по паре OTP и номера телефона. EMAIL - проверять по паре OTP и адреса электронной почты.
Если код верен, ошибок не обнаружено- регистрация успешно завершена. Пользователь создан в CDP.
Успешный  ответ 200. Ошибка 400,500



Регистрация по телефонному номеру
1.1 НЕ зарегистрированный пользователь переходит на https://tolyatti.lecar.ru/main нажимает кнопку "Вход" . Пользователю открывается страница аутентификации с формой, в которой необходимо ввести номер телефона или email.
Если пользователь хочет зарегистрировать по телефонному номеруl то ему необходимо выбрать "Телефон" и ввести его. Далее нажать кнопку "Получить код".

В этот момент происходит проверка наличия данной почты в CDP ( БД):
Если телефон НЕ найдена, пользователь перенаправляется на форму регистрации, в которой необходимо заполнить все обязательные поля. После заполнения пользователь нажимает  кнопку "Зарегистрироваться"


Система проверяет корректность данных ( в том числе проверка на дубли), генерит и отправляет код верификации пользователю на номер телефона, указанный в форме регистрации.


Пример смс с кодом


После получения письма с кодом пользователь вводит код в форме подтверждения кода и нажимает "Далее"
В этот момент система проверяет введенный код пользователем:

если код был введен верно- регистрация успешно завершена- пользователю предлагается перейти в ЛК.

если код был введен неверно- выводится ошибка - отказ в регистрации.

1.2 Системный алгоритм регистрации по почте:
Действие
Метод
Описание
Пользователь вводит на странице аутентификации адрес почты и нажимает кнопку "Получить код". пользователь найден
POST/api/cdp/lecar-id/v1/customer/authentication/phone
Ошибка 400/404, пользователь перенаправлен на страницу регистрации.
1.1 Пользователь заполняет форму регистрации и нажимает кнопку "Зарегистрироваться"
POST/api/cdp/lecar-id/v1/customer/verification/phone
Проверяются данные пользователя . Если ошибок не обнаружено генерится код верификации и отправляется на почту пользователя.
Успешный  ответ 200. Ошибка 400,500
2.Пользователь вводит код, полученный в письме в форме подтверждения кода.
POST//api/cdp/lecar-id/v1/customer:register*

*Метод проверки OTP. NONE - не проверять OTP код. Нужно для регистрации из чекаута. PHONE - проверять по паре OTP и номера телефона. EMAIL - проверять по паре OTP и адреса электронной почты.
Если код верен, ошибок не обнаружено- регистрация успешно завершена. Пользователь создан в CDP.
Успешный  ответ 200. Ошибка 400,500



3. Получение данных по пользователю др системами
   Для получения данных по пользователю др системам необходимо обратиться к методам ( на данный момент обращается OMS на форме чекаута):
   Системный алгоритм получения профиля пользователя:
   Действие
   Метод
   Описание
   Получить профиль по id
   GET/api/cdp/lecar-id/v1/customers/{id}/profile
   Ошибка 400/404, пользователь перенаправлен на страницу регистрации.
   Получить профиль по email
   GET/api/cdp/lecar-id/v1/customers/profile/by-email/{email}
   Проверяются данные пользователя . Если ошибок не обнаружено генерится код верификации и отправляется на почту пользователя
   Получить профиль по телефону
   GET/api/cdp/lecar-id/v1/customers/profile/by-phone/{phone}
   Если код верен, ошибок не обнаружено- регистрация успешно завершена. Пользователь создан в CDP






4.Создание пользователя внешней системой/сервисом
4.1 Создание пользователя на форме чекаута
Пользователь на форме чекаута оформляет и оплачивает заказ. В этот момент идет создание заказ и поиск пользователя в CDP по номеру телефона и почте, используя методы GET/api/cdp/lecar-id/v1/customers/profile/by-email/{email} и GET/api/cdp/lecar-id/v1/customers/profile/by-phone/{phone}:
-если пользователь найден, то заказ привязывается к нему.
-если пользователь не найден, то OMS обращается к методу POST//api/cdp/lecar-id/v1/customer:register.
CDP принимает данные от OMS по пользователю и создает его. Код верификации при этом не отправляется.
Важно: На данный момент пользователи, созданные через форму чекаут, не являются верифицированными, что несет риск создания пользователей с некорректными ПД и отправкой чеков и смс со статусами поставок на неактуальные номера и почты.

Системный алгоритм создания пользователя на форме чекаут :
Действие
Метод
Описание
Пользователь вводит на странице аутентификации адрес почты и нажимает кнопку "Получить код". пользователь найден
POST//api/cdp/lecar-id/v1/customer:register*

*Метод проверки OTP. NONE - не проверять OTP код. Нужно для регистрации из чекаута.
Пользователь создан в CDP.
Успешный  ответ 200. Ошибка 400,500


4.2 Создание пользователя по  Сбер id

Пользователь нажимает кнопку "Войти по Сбер id"


Пользователя редиректит на страницу аутентификации Сбер id. на даннйо странице пользователь авторизуется/регистрируется, проходя верификацию. Далее Сбер отдает данные по пользователю в CDP. В CDP проверяется наличие полученного пользователя по номеру телефона. Если номер не найден, то система обращается к методу регистрации и создает нового пользователя  на основании полученных данных по нему из Сбер.



Системный алгоритм создания пользователя по Cбер id:
Действие
Метод
Описание
Пользователь проходит регистрацию через Сбер id
POST//api/cdp/lecar-id/v1/customer:register*

*Метод проверки OTP. NONE - не проверять OTP код. Нужно для регистрации по сбер
Пользователь создан в CDP.
Успешный  ответ 200. Ошибка 400,500 .
Верификацию пользователя берет на себя сбер в момент аутентификации на странице id.sber.ru



5.Деперсонализация пользователей
Для пользователя в ЛК в разделе "Личные данные"  у пользователя доступно действие по удалению  аккаунта и всех данных.

Для удаление ЛК и отзыва согласия по ПД пользователь нажимает кнопку "Удалить аккаунт и все данные".В этот момент система обращается к методу DELETE/api/cdp/lecar-id/v1/admin/customers/{id} .

В это момент данные деперсонализируются в БД CDP, а именно:
Аналогичный сценарий происходит



При вызове деперсонализации по всем полям  CDP таблицы Customer, в которых хранятся персональные данные клиента,   значений полей  обновляются на новые значения деперсонализации:
По полям Фамилия (lastName), Имя( firstName) значения заменить на Depersonalized
По полю email (email) на  UIUD@deleted.d
По полю телефон (Phone) на 7XXXXXXXXXXX  
По полю city на на depersonolized
По полю birthday на DD.DD.DDDD

Аналогичный сценарий происходит при деперсонализации через Админку . Деперсонализация через админку доступна только сотрудникам с ролью "Управление" актами”

6. Обновление пользователя.
   На данный момент обновление пользователя происходит только в ЛК , если пользователь решил изменить свои данные.
   Пример обновления данных в ЛК

Важно: изменение телефонного номера и почты на новое значение производится только после верификации пользователя ( на новый номер ли почту отправляется код подтверждения).
Системный алгоритм оновления профиля пользователя:
Действие
Метод
Описание
Пользователь обновляет значение в выбранном поле
PUT/api/cdp/lecar-id/v1/customers/{id}/profile
200- успешно
Ошибка 400,404, 500
Обновляется только поле, в котором были внесены изменения.
Полностью обноление профиля  
GET/api/cdp/lecar-id/v1/customers/profile/by-email/{email}
200- успешно
Ошибка 400,404, 500



7.Добавление Адреса
На данный момент в ЛК пользователя нет раздела "Адреса". В дальнейшем данный размер предусмотрен.
Методы по работе с адресами (использование др системами, на данный момент OMS  только )
Действие
Метод
Описание
Получить весь  список адресов
GET/api/cdp/lecar-id/v1/customer/{id}/addresses
200- успешный ответ
Ошибка 400-Ошибка в данных
Ошибка 404 -Пользователь не найден.
Получить информацию по конкретному адресу
GET/api/cdp/lecar-id/v1/customer/addresses/{id}
200- успешный ответ
Ошибка 400-Ошибка в данных
Ошибка 404 -Адрес не найден.
Ошибка 500 -Ошибка сервера


Добавить новый адрес.
POST/api/cdp/lecar-id/v1/customer/addresses



200- успешный ответ
Ошибка 400-Ошибка в данных
Ошибка 500 -Ошибка добавления адреса
Обновить адрес
PUT/api/cdp/lecar-id/v1/customer/addresses/{id}
200- успешный ответ
Ошибка 404 -Адрес не найден.
Ошибка 500 -Ошибка добавления адреса


Удалить адрес
DELETE/api/cdp/lecar-id/v1/customer/addresses/{id}


204- успешный ответ
Ошибка 400-Ошибка в данных
Ошибка 404 -Адрес не найден.
Ошибка 500 -Ошибка сервера



Артефакты:
ссылка на сваггер https://cdp-iskra-lecar-id.k8s-stage.ladadigit.io/swagger-ui
Ссылка на постановку по разработке сервиса Lecar id https://cdp-iskra-lecar-id.k8s-stage.ladadigit.io/swagger-ui
Ссылка на архитектуру https://arch.ladadigit.io/share/6/diagrams#Container-017
Схема uml sequence
https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=lecar-id-sequence.drawio&dark=auto#R%3Cmxfile%3E%3Cdiagram%20name%3D%22Page-1%22%20id%3D%222YBvvXClWsGukQMizWep%22%3E7V3ZcuM4lv0aR1Q%2ByMGd1KNt2d1dk9mVU9nR0%2FVUQUu0rUlJVFF0LvP1wwWgQCwUKAEgRCIqKi1RXCTy4Nz93hv3Yfvjb1m8f%2FuUrpLNjWOtfty4ixvHcfzQL%2F6UW37WW2a2a9VbXrP1qt5mHzd8Wf9fAjbC3d7Xq%2BTQ2jFP002%2B3rc3LtPdLlnmrW1xlqXf27u9pJv2Vffxa0Js%2BLKMN%2BTW%2F1mv8rd6a%2BRbx%2B1%2FT9avb%2FDKtgU%2B2cZwZ7Dh8Bav0u%2FIJvfxxn3I0jSvX21%2FPCSb8u7B%2B1If98T4tPliWbLLeQ6IP82zn9%2FcH99CZ%2F9X%2BuO%2FF7%2F%2F%2FXEGzvIt3ryDH7x8P%2BTpNslm72vwvfOf8GYUP2Ffvnzfbj6uX5LNele8u98n2Xqb5ElWfLIBmz8ft91%2Ff1vnyZd9vCwP%2FV7gpNj2lm83xTu7eFk8uTwuDikPt4r3qyzd%2FyvOXpMcbFimm028P6yfq69RbsmS5Xt2WH9Lfk8ONWLKrel7Xl76oUFCuXGfZnmx5ZBnxTXKjUl8yL8nh%2BLl%2FS75%2Frgqnjb8geH9jRP89V4%2BkPuk%2BaDZdOPeIZ9vnlPk6ONOzgO2E%2BME35IsXxc4Yxxa%2FMBvyap1rNXaIUvfdytij3BRnQhHBnzMxTWTH8gmgJS%2FJcUTz7OfxS7g01kQAtiChWs7ENjfj8ugAfsbsgT8AGyMwdJ7bc5%2BRGfxAgCUDtb919%2F%2BDH%2F7%2Bbvz778efr3Pv%2F%2FhLg8zNyQQmSDPD3skx1sE4JHlb%2Blruos3H9N0D8D3v0me%2FwSsE7%2FnaRua9fNzF82zap5LfUryRnctskP6ni2Tjv0cwG8Q%2FMz74NY7lj%2B%2B82FmySbOi2XSZkXKY6kOvcuy%2BCeywz4tVswBOfPncsMREk5kYY%2B0PsPxATdfheuZd90ThKAIDCAPDHzlYrN%2Ff%2BMvMHI6IgClJypt1M%2FgS8l3B5LwJsgpq3VBuvk63ZUcXv%2FUfujn5x7PbzFPSOMdknbsSBrtuAaDE8egE3CC0BEAQuov8AkMbpJlnM2Kg4yWdpVoFqGlNXjTSEsLowvo8r68fej%2FfkmhxR2tP7GRT2bHj2zmQTb1IO1YWSyOOgnkXAqMOBkwFICrQ7T7mn7%2BW3z4z%2B7h8fPq%2Fe3X%2F3qlmKoGVtcPK171bi6Lrjo8IFmyT410nax0DTV0gUSkHmhYUCkLdpLIuSw497lIUIR18Zxvl9Hiz78eXzbfl%2F%2F4uP60%2BvLP2SUWrkHVmagi0MILNNGy1ZUFK48Cq2BT3ouXtPIkHvEFb1L5wawWaIWgsIL9j%2Bp%2BHeVD8Fr9LR7s%2FKn89%2F6x%2Bje6KaAZ2dXr8sDqBbrDfbXDQ%2FU6RLY71b9W9Wn92kf2f4KncsCLeXWJuYdfArxdIGd%2BgGcrzlOf3612Iy%2FU7OYhhy%2FAFwN3rHgA9U0DN6BjfUKxerdZv5a%2Bkuc0LxSaUhbvVndlTKzctkmXX28wf3bbYV4gMfv5H%2FTNH%2BibxY%2FWuxJzfvPFMNd026ndRUHnroB%2Bru6jLxta0r4XYmvHb5%2Bj9t6Dw7B10c%2FPTXcystXQbbyLXwt2M5roVDVRD4abOzVR11epiZKKaAPY%2BL34TgatU0WrrSFaoSZkNFyt7Kbe3qPAudXMfxRdEqE2yNIXWXM%2BYNkiOIuqEcOrGWTpbpX73ciKWrhyXT5gSXP22LRIijiz%2FK42wl3ExF20LeHGXLfYdnhlq7es5Udg27dOW3x6f4aFHAPLeJO8lLseCgVzvXv9WL1bOHRLGTOOEQQeQY9mn3VY1ufayBAmFwLSurUsG4DyQrs5dNvYtjHQMqxm7lQzuBAt7DqehS0DJPXseDQ8ffryckguNdvpT8RQ9Agpmh7oISnak0XRNJ2yJrmCqnYXO04fEVp9QpjYQpg4Ipi4Yd%2BaiT1IzyHB7j7wsjrWl09f4G4R4lZ9hDs0zF3%2FrvEy92UwvZSlcd3Wjvi8m715Gq4S7DpPnPs7dsjmdWGcbSy2MZK27Q1M2jYlinrUh2vO9Qm2XfRhWxCIypLV%2BjBGlnSGpcm2kkkk80pSZqG%2FVBTpUe8YDA0zamfoj%2FjyApof67yKIN764N0frXfHGGL55ifyBqE5RqkNpaqG7volwddVaSK4qIaMNIYWJiOduXUbOsf%2FMNFcf%2FGLUTcLAvK6ncL55BGSkBpQaXQOQ%2Bh4%2FHyBbImQKHqEcGh9bIDs80RdDh%2Fj52TThjCk0mUBvEro4tH17Xq1qldLGVCKj5EmshCEk908lvOyKXMFV7lBK0mpCeKFqW%2Fb85uLTH2hVnTXEsWf%2BOXpGw%2FEU0bCkHfLPEUfaPXwP6eHNSgxadIm8Ceep1gYkqqHMRmrR35%2FRHAFpRDFpSg58mow2Tk9TNO0%2BLX5rAzezrbpCtinuxREcxlORA9RmiwkncaCetA9AgIXWfCL9m5ofg5%2F4k2dq8NnnJa%2F7lzKoIW320I3S%2FMY4HE2t4CdD%2BRtKAhlBM%2B7FJRFNFVaFsgoImAQkKEM5CEAchDo1HsGcB%2FM6d1IG5pKjyd4TQ1nvjMszkJ2JESIn024ynI5p8HwCx2P7X1aTrzenjoNshBPmAtdZUYni%2FBh3oF0e8EOQnzVqE1NDNne6EvjhZWj3WJQ6qK9euRGBHnQmu6T4qP7VXx4q%2BBp1x8DloxO4BiawoghDE1k0gyecYO4E5woirvQfhLESOQQei%2FE43rOZ%2FkqtUzmF0uI8NJIDJQHXSqE4mT05%2By4phiC4cRNWqab0vgqb1D2%2BvyL7duVO9kqMVD%2BDcIP1Wms6m6%2BxNv15me9e3GOeFsqMOBMvyb5fenNPhSffUp3Kf55fb5t8cmhVoCasx6fkQ%2BekfUcL7%2B%2BVgt3hn3D4qvVZ6qcyvUL5wP1yX7%2B7cu%2Fqi%2F6FO%2FXxb%2FL1b7491iv%2F%2FTNLreCdNlyt%2Ff8rVjjBf9UKpjztH9Ld8loZO5pWRopkqUuViFjO5yBMJWcAzVgCVopIm%2BpwQUeOrpvyVs5GL0iSUuHLo%2FodU%2BKWkFJOiTsXU4ns1LY04oQBVaLXamova66r0uW0EkxAVOt1ZtcLmc1mNL1Iq%2B6UqaYmKZBBqGrjypEYNzz%2BGSCMPyynbyiqoOpKcaoiwHl%2BzqTDXEuCCsibtwWNnzhth19zdlQYQJ9GbVI6S1AHpEDUY8fzMU%2B%2FrrGyWITvpU53M0jfqDV3oG8t5yOzea79RWPFvKd6%2B8%2FRw5Bf4uD3HMfbJ%2BMdOVmHmgJyWae0MdtMLxllGR%2FZkQJNwsXnGKC11OXmr5ozRDJi7CcUIh1ReDZxTMMe2fwSFYnqebo5U5%2BpqPThNR6hdQ6XKxtGujpYvWAa9W2vPpF5GjmY7WjCHzF5sXckuxjfVqW6QJjcbWeDm8GJKWKiAxVjGpdmGnG9Fd5w9rf1BvEdlcJ9NJKioqO3lfLG9rvXCPqwxHesCFQ6t0gteWm0cvzywuBHtPnZSp9XmYekZ2qtEFmR1TFFHcN146jk0Sut%2Fs0zVtpcHXtuFLZPoiOK1pDXxPs11SBdEkNctBaMs%2FBfU%2B%2BtCAO%2FY6cUQ4ygfy4UfkReGeVdS4Z9UuBN7VL2FKgzT0xDgGt%2BZziDFM5cY8Dxb5qQmcHx4z%2FfvwlMZ3o18dxRiwTb9g8XrptQtGNwBJokhIahkbTJiwkHYQH8JJUmQf8WotLQtkXpmtgi0puMSRzqfRwjoXQZIQQtWml27RqRxHjGOiApNiaAgBZweMO7fzlIjs0TxbV3U%2BjOtnG603tLOgWPvRoYp7FuwN8gGXQEflsU97q2SrOvv5SBh0B0uGfD%2FXfquTDBxFT9MUHejyyiYjung97IOyELRyrnbYlJO1pwFpjKcsrorR%2FUry8SBehGaZuAiWUYepOMHygJNR%2FmHrnKjtp3NHKCug7zqVorUOPU%2B%2B8KWaW9cC0wjXLulvMXMNA9c4FZ0A4XRDyTlR3fFkopJTZmpHq141nEboaPlJdB10tMm3mdUw%2BaBjkXBJ0Kf2v1Ka1mOlFI0EWNnPNU9gMm%2F4L5FbzmyEznE24uaF20kxWVX2PlVN5krpwR9hlBDfhpt9CWraMYdvrY9vzslPlmTK0JEKDqyvEFWZ7KBzgTv8FHSGNLNmnxlCerKEcahjToFb2Gx4cnAcvdRbCqjgFEzPpP%2BCSqInBlba4cjkVN3nylYyENPJ1G%2B%2Fi17J03YjYiYpYD3Pq0EWs66sUsTDtxlChXlQ47wuuAJuoOzQVzskYR0OFZe8Ow4OT5UFbRx40gRMdeXDeG1w4D7pD86BpYDASYOFDl%2BdDI8tEH0aKrMH9xNBBM%2BrpsvRfThkv25l5q3y%2BrBMMM1%2B2vC56wv5HyAnCzqc0X7ZztY5xvmznIjUDZvHnhw%2BYdQKFA2bpz%2BqMNgpmwOx1Df50QnUDZukgO2OsmxSQ2bDJP7VSFm3C32w8o8S2bm8wWbTNKTa9SrQ1UXC5yZCPiOzC5jWglcSXC72nM5Ih9W990Zl5f1K9h8a9bPXes1wM3KrbHFm0YgRR4xNscShFe06wVoc1sdlEndA9nQHM2xNcMMZdS3UTJIvm3R9wNpHV2daO1ZbIcHM7VqN8ppYzlzeqmwFceWUXp9qJkgie4PC3TvyJI1hkRqiscdzOXMNe9NXokr6Gm8whoahlj9p4dcmQELOtuz0dXQ4ctoeTt6VrDMsNmMIC%2FzJ7HvWbBs7Y3PMrYv2b3DogY7k2%2BOuhLZyoU7vB2Bv2OR0rBD%2Fdc8ALa46cljauXOUsHRaGe07Fce%2By5HVdBsXqmTgjbGhIpxHuIc3nMLKsqc3c2oRaRmY3MBdnDorx1HOag9YvyOnQ%2FUiqniNH%2BoD7%2BepJP0xeK%2BJW35vVqnwej2vhzhXphid7KO6U%2B6lzaxjcw%2FAoAlyh%2FOaYhUfXXERIffYsvJHI%2F9NS3RuIUJxAwz7FtiVvIK5nQf%2BAMBFuETOsFwiFzRGeMv6HnnBXocTy5h%2BpXQHspAMh%2Ft4rFbsT8CF7nCJjrmoCBOGHCzWcfWpb7AQKIzJGIDLmvCMflKlSxLqIPMW2mS03i6OF9ghxVdzhvH%2F%2Bcmga7TtwiVWXmHv4JYxouVi08C%2BhUM0SCn3cGMHbCsqOTtryUkeM1NBAakS8xRDc2hSSZ245oRCThFgGId4EsXdFxCAqmC03R8UkFcqTDNwJV4pqhoglMVcuGWTmrQwSRZq6KOCdvsGdOIuKgkCMdwrHvWtxigK1RM%2FOeeFdGwPEhMBH6DQqq50eFlA0qKPt8wRXmpD0mWEjVW0KmHykCpuUxh22aierjCxoxZG0wq02%2BGdQKvToCXf4Rzr6L20VWSuUPNmmwthGaKkmlajFTA6aHM5i5XuEn4zKAWHPkVByjs4hb4HomGhrsxNRzAK50gUCG8AIFyBVwFhaHrql4%2FKQlzIhVCefikuFm%2FvhGtAC2pGro2pE5kI0jRifX14I8Jg%2BjFPpwzjziG4hw%2Fd8b9rPmLZm%2FEBW0NbsyCPXOlWlMRMMskaGrMH75TUlDQZaI4PW8CMdbQglCTWymmVZiPT4Xo8Z32g8%2BvSc9BycYFV37HDYAeQpF06NPywS8gaam2WjfjXwVv2IWw3y2iRo4L2dKO1zx%2F%2FCwYA%2BV0777DiexrQPPppabsQEhBGvZsYfghS%2BRiPlwujymnbNcvuUd4iYqsTjLegeUOLpGLx32NFJ0yWL2iXLiKYB2q2Qi0l1u0SnI9b5viZQYEKdkwl1Bth4a5cejlIb6nTmBCTRMTvYMxExYad6gO6ieVgYpZF3unudnRb5Lq%2BRa7tyaIp77k2jTyuYWdPclrPiRboFcq6ZW1brgnzBBAPwU%2FsugrNjS5xRSzuSRkBwzRkYThiGDmV4Cw2HEjMzXDLEeawbMUrbNSJahNLWeNV0UtpcM9BVy1SPhkOuONXDpcX5DLauEFvYiHPP48MWXq8sEFryKuRKBxxoL%2BESES40ChYhr6kefNRrf8KdfkYtBBx8tklegOt0ud69fqzeLZwbqscPc%2FKdHILb4SHsCzYOk1lRsy6srN5zMJQy3Hp9R85G2GV8JZY4LZplKPcKKVe3dHOXFrUxyLpGZLWF%2BfDp5m5HnCNL9qkxmidrNIc6BjpcU9OlJxVe6juE2RKnXIfSkAWp2SBrZMhyOfU3eULWI4MjjZDdxrv4tWxiZOTsROWsh3l46HIWel0UyVmPjKMYNtSADb3e8AqwkcnDsyEZ9mjYsJw%2FZKhwslRoa0mFJpSiJxW6feGFU6E7OBXSQikGWtcILecWs2cHx5YJR4wVW8O7jb2QwNLpiOblScewxujWvzlWGR3fkXVG8A0CJ0YElbv0yOMul4C3X3q5RIh133Ld0LoNneN%2FfJVIfaOssyAgr4uesP8RkkKzHmWKX1muhBamO0RmgIOkGnhIhdAdrdioLr6lrImP8XOyaeMYpg8sC%2FRVDIdXDm3Xq1W9ZEpLIz6aIGTeLDftwBgiTjvltPuKWMFlboCPlZ1MZ91aTcuEc6GroNbNo4QKhNWDsk3Uu2Weos%2B0ev6f08MaJOU2VWH4Q89TzESlyj0mc%2FXIhowIvqAkFbkUgSLPyIKGX5%2FCxOLn5rPSsp9t01VSZxbtUmDqM5KLqNWGaBHgPYICF1n0i%2FZux9L4ZBuvNzec1YLlVz6XC2gOjbZIzdI8Bigrp2fUaVdAmoaCsEMwOC0hLaJgx5MGHVrpwRDQsUE%2BGb04tYbU%2FEZMVetk4RbYQ8ON5hk307WuoNC5Sbg%2FrbrD8Ids1d2zMJdUECgudPZVzNcSgFMzX4sX5RC7HAaqotHVBMpDvL257G5Q%2FuWTsk5N6KXmo6M56%2FzdoI6NKHDl0jA0HpVRPl7aDfCxE9IpWuZIIgYem2nQOIrNyBQMgAJpFpksYUmaLOEG%2BNAtHdoS%2BfIagY2pLVFLGjBvDHseX9nDutSjjn%2Fpw%2FjgJagjC9sGZ%2BfmK5lkCKEjcpJhsRff8EL3rj28cCpdp%2ByQW9Sfw5%2B2mDmwxEw2bumvlj%2FlDZ2aSiPFiWox%2FAp3qMhYJJdciPtEpFuLlHCh%2Fr2DMf2AW3hfiZSWMW%2BYW0oXu73nb8XyKpY%2BGDLcK%2B6jvbzmkMLBUOvf5fSJqhW5tEI0MSJXs1kqU5WMvHhXoXV6Oo46Ddgxe61GnZ6K2I%2FeqRrwcjyEnXqnqofPh9CB4wN2ZoHh%2BDFwPMS7RtoPsTJ8zuxNcaiXm%2BDQwnuEeAPucKY%2Bf0E83TTxC7DIqkvMPfwSKiabjF289FhEioYxhD5uQeC9eWSH7AJ5WRVGcuggOSCUBepUSHq1Bed0iF4IRMO13qUAwyhictM3TM6dROngcC8UReUyxKIIlEsHmQkdg4Rrpi4OIHb1ySwlUB5yUr84lLOTOnhRbiYw0p1W1NhOe%2BlNPrYDvsXu%2BVDXdPAGetrpGCML83CkZXDLa9iVtJdia11YN8j0kPtaOhBV5GUMNm15orIe4p4jZYJX1qtZITpmfgbsVAuzQq51hXjcAae%2BMqQKsspKjfbx%2BcdaLBB5eQZCtejJODT46d87J4NAGrhtDfWjkMwgaFoBPr%2B8EPAxnQCn0glw5uE9KnToPh7SEgLYFGd6agkH0gkeudoRH9BUMMgaGbKG79UWmjGD44SWBmMGQ3Zg9tLCTc3yHET6fa%2FIlIcaj0bdDj0HT2pQ3U0iZMdvr6c%2BaAKxDAhJDk%2BtPRR4eYtbxIFXXq29Bh7XqdI0f9RuMKQHymmaHX3TmKYX15CAMAXhwa35cIf5hC8pX7nwuLwyWrPMNeWNBqYqofjbfQwnoXSMkIfsAKDpjcTulGfEk%2FLGHeR6Ut0pD7rxKX3%2BG0Z3CPBCEFHwWOtTlTy6OxvUaEGagsIzgYUKVLdZ85NdRCr67VvR3G0X%2BZR0O8vtT81cXT3CkCGc4wPd%2BU10EW2VT2tALc%2BhH1GikLqiHNDyw0mRRc%2F8zbN4d4BPsBQvyGeb8l7PVnH29ZcyQRggH%2F75UP%2BtUod9kNSMvvjAbH3XzhvWdCHp0P9dxvpyHdooClnr6znfLqPFn389vmy%2BL%2F%2Fxcf1p9eWfMxXdVsWYOCPKM8SUk7YGRH1MLhN%2BqEq0%2F%2Frbn%2BFvP393%2Fv3Xw6%2F3%2Bfc%2F3OVhFp4ecCOqArPAaQvftseZZDhYBSb1ZttknK9J1HpfE5AzeVpXlKdFmQhFLCr2WgnCNoHbEXXyoaw8LTpafQKR6HQ67JGIGExXPT930TwrjCQZHIfe5s5ld5IMbUrGNX3HUITtxz0pDmrNQICLmvLWeQ%2FOynPRLQHlmmlltS54FwwGAj%2BVi2k6lgBvSgxnslXjKBBPPbSYkwHhpEDoUFwEVBTiFdniUEiGaY4Vr0ZXu0Y8i9DVGsDppKvRwhu8hGmyU%2BXgqINUBGfUC8lNpX5diHUDrHEBi1fHm0sDFul%2Bb3whWbJPjYSdrIQNNXSGQNozPKg7D%2Far%2Fpj7XDQozcZwTFnRKHGlsmCN%2FnXlz%2BpsQmzD9x%2B%2B4mb0%2Ff3ZtAhdB7mIT1HyvRADu7QMJfrvIoPLje64jXfxa9mCzKiPE1UfPVhf3qk%2BwjIKReojGVVpEFvORDJwnSxcbR3hekn8xWilKrXSoBNcgXOrm9%2BHVvtioDUCaFGdNCSybHmsZYIgI4FW1AKW6%2FIhS5qTBl5f7uAEFzGAF0iesoXY2BbbeEbr9U4U0p1hKMOM503yUu5aNqFe714%2FVu8WDt1gxmxkBIJH1KMJZB0G9tmmMm9GV80dTEQKHEsYtlNZXRtDLcN25k4Wg0vRwq4DMsKpyWMqk2BhyZVh6XGxtGPxsbQnjaVpIRrFJZ4RbdQNtYtHSDC831Rh1s5MC%2BnqUTtEYWF1%2F%2FrMsdO3K6cYM8R1XBuvOxDF1nClYNchihQY%2BzsgY1JqarBrYlWjZG6bUiymlrlVDSYrONQnmHvRh7lBNCpLVuuDUaMZFCGeh7HyL9zSk6QzQ9esXFbtLrOhP%2BPLa21gieGtf3MsMjy%2BI8sM4RuER7swdbrykNIBvrMihcOlfmlgM8TaZdvzyLoNneN%2Fl1YdMq4bBOR1O%2BX%2FySMkYZVSHLSoa%2BabAmyH8DegqrGHVNHDfiiUAnjKgvgYPyebmzPLsLMyehUfw1pkxQhT2C5rJQEcfNN4mU6SZr2w2Xnk1q1lw7ztc4GrwFynhILw%2FI%2BzS6%2FZQc%2B7ZZ6iT7R6%2Bp%2FTwxoUozSJGvgjz1Ms6EnV9bhUqxN1ABFBFj6pR7kUPUqaA9w9o69Y2dxgVoaKZ9t0BZSpXQpixwx9itq5yEIaCt0jIHCRFb9o74a2ceHvz1K3dNGhdUOW5jHA42xuAaUUiNxQEMpwoncsCsponR08WSA7o5OWFJCJbfVIaPvgWpPFWWMCDoQzaG3KcucJ11kYOYndbdj6kJnmeYsnNX6oOZ0OxoR94VvoUjABV%2FTMp9IMbJ9E7cwn%2BuKgBVFEt9ehMOmivWjkxhzH1GfH4bV2aebFSexblqSBZwXlD9rMkw7%2BywM9ww8OoA6fbtP%2F5IdPF3vxzpsuk2iL9VLQxfVPnCbY5bSLbM5NGqIH4tpzzuR%2FpQxBi1SJarDNWPTHgQsnyWO8Yxf6C0YI3ZMY93vbNAKTdgjYOxauFeogGCXXfKmaqHPN1VviAA8zpRWQOqH2WZwjEZSiW0VLUfGkPklrJ9JPcSEwbsubpEPHL3tklKiKXGqGMGq%2FYyMIwpblLrjheVUSfJxZhTrPLKSFduONhY6ChVWPBKH7z7DRg0%2BIQ8Im%2FBBzuJtHfF9sB%2FJWcfr%2BwHdL0Jy9y%2FtRj1oCcrOD46hih9DHrRo8SCe5pNljT9ky%2FbJ1kmyOeO1NQsNsHM%2BOhTeauIqG2R47oM27KpievtHGktqTF7qdi1QvZHtd9%2FRCesD7aJeDh8sXkaOZG9KOIvAVmxdzS7Ib8mlZxr3H4Y08yZE%2BN0f2jnVUHGnbQjiS9OnYOlq98gaXyY%2F0TdGhyR3lhstkAKc9WceigffSJxM%2Bmh4pzy8vBH5Mi5SptEiZeXiqpQYdIWE8wlRD8eN4mGqomliY6NKt5TKUCwZY4wLW4K13fBMVvxYlEgoXnYqj8MG0TpNyqSiA4rPD29eT9zV24597hlaPfA7RyOXOWRKGXHbo2hjxWvIvrwvL5k9VF86%2Fjmr%2BZQewx%2BdFnwZZ82alK%2FRVETC3NUww9U249ip4HI5XkFByJHO%2BMYn5gcO1xdssLWF63D2L92%2Bf0lVZk%2F%2F4%2Fw%3D%3D%3C%2Fdiagram%3E%3C%2Fmxfile%3E







