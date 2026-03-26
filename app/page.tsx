"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/lib/api"

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setUserName(userData.name || userData.firstName + ' ' + userData.lastName)
      setUserId(userData.id)
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setUserName("")
    setUserId("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.target as HTMLFormElement
    const formData = {
      userId,
      category: (form.elements.namedItem('category') as HTMLSelectElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
    }

    try {
      await api.createAppeal(formData)
      setSubmitted(true)
      form.reset()
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)
    } catch (err) {
      setError('Ошибка отправки обращения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-avtovaz-blue-light/10 to-white flex flex-col">
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
                  onClick={handleLogout}
                >
                  Выйти
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl flex-grow">
        {!isAuthenticated ? (
          <Card className="shadow-lg">
            <CardHeader className="bg-avtovaz-blue-light/5">
              <CardTitle className="text-2xl text-avtovaz-blue">Вход</CardTitle>
              <CardDescription>
                Для отправки обращения необходимо авторизоваться через Lecar ID
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 text-center">
              <p className="mb-6 text-muted-foreground">
                Войдите через телефон или email
              </p>
              <Button
                size="lg"
                className="w-full"
                onClick={() => router.push('/auth')}
              >
                Войти через Lecar ID
              </Button>
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

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <Button type="submit" className="w-full" size="lg" disabled={loading}>
                      {loading ? 'Отправка...' : 'Отправить обращение'}
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

      <footer className="bg-avtovaz-blue-dark text-white py-6 mt-auto">
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
