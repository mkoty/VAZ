"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const name = (form.elements.namedItem("name") as HTMLInputElement).value
    setUserName(name)
    setIsAuthenticated(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-avtovaz-blue-light/10 to-white">
      {/* Header */}
      <header className="bg-avtovaz-blue text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">АвтоВАЗ</h1>
              <p className="text-sm text-white/90">Интернет-приемная</p>
            </div>
            {isAuthenticated && (
              <div className="flex items-center gap-4">
                <span className="text-sm">Здравствуйте, {userName}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white text-avtovaz-blue hover:bg-white/90"
                  onClick={() => {
                    setIsAuthenticated(false)
                    setUserName("")
                  }}
                >
                  Выйти
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!isAuthenticated ? (
          <Card className="shadow-lg">
            <CardHeader className="bg-avtovaz-blue-light/5">
              <CardTitle className="text-2xl text-avtovaz-blue">Вход через ЕСИА</CardTitle>
              <CardDescription>
                Для отправки обращения необходимо авторизоваться через Госуслуги
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">ФИО</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Введите ФИО"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="snils">СНИЛС</Label>
                  <Input
                    id="snils"
                    placeholder="000-000-000 00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Пароль</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Введите пароль"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Войти через ЕСИА (Госуслуги)
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Демо-режим: введите любые данные для входа
                </p>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="shadow-lg border-avtovaz-blue/20">
              <CardHeader className="bg-avtovaz-blue-light/5">
                <CardTitle className="text-2xl text-avtovaz-blue">Отправить обращение</CardTitle>
                <CardDescription>
                  Заполните форму для отправки вашего обращения в АвтоВАЗ
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">✓</div>
                    <h3 className="text-xl font-semibold text-avtovaz-blue mb-2">
                      Обращение отправлено
                    </h3>
                    <p className="text-muted-foreground">
                      Ваше обращение принято. Регистрационный номер будет отправлен на указанный email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@mail.ru"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Телефон</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+7 (___) ___-__-__"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Категория обращения *</Label>
                      <select
                        id="category"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-avtovaz-blue focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Выберите категорию</option>
                        <option value="quality">Качество продукции</option>
                        <option value="service">Сервисное обслуживание</option>
                        <option value="guarantee">Гарантийные обязательства</option>
                        <option value="purchase">Покупка автомобиля</option>
                        <option value="parts">Запасные части</option>
                        <option value="other">Другое</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Тема обращения *</Label>
                      <Input
                        id="subject"
                        placeholder="Краткое описание проблемы"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Текст обращения *</Label>
                      <Textarea
                        id="message"
                        placeholder="Подробно опишите вашу ситуацию..."
                        className="min-h-[200px]"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Минимум 50 символов
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file">Приложить файлы</Label>
                      <Input
                        id="file"
                        type="file"
                        multiple
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground">
                        Можно прикрепить фото, документы (до 10 МБ)
                      </p>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="agreement"
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-avtovaz-blue focus:ring-avtovaz-blue"
                        required
                      />
                      <Label htmlFor="agreement" className="text-sm font-normal cursor-pointer">
                        Я согласен на обработку персональных данных и подтверждаю достоверность
                        предоставленной информации
                      </Label>
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      Отправить обращение
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-avtovaz-blue/10">
              <CardHeader>
                <CardTitle className="text-lg text-avtovaz-blue">Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  <strong>Срок рассмотрения:</strong> В течение 30 календарных дней с момента регистрации
                </p>
                <p>
                  <strong>Контактный центр:</strong> 8-800-700-55-55 (звонок бесплатный)
                </p>
                <p>
                  <strong>Email:</strong> info@avtovaz.ru
                </p>
                <p className="text-muted-foreground">
                  Обращения, содержащие нецензурную лексику, угрозы или оскорбления,
                  не рассматриваются.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="bg-avtovaz-blue-dark text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} ПАО «АвтоВАЗ». Все права защищены.
          </p>
          <p className="text-xs text-white/70 mt-2">
            445633, Россия, Самарская область, г. Тольятти, Южное шоссе, 36
          </p>
        </div>
      </footer>
    </div>
  )
}
