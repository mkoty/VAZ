"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Step = 'choose' | 'code' | 'register' | 'registerCode'

export default function AuthPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('choose')
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('phone')
  const [contact, setContact] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Данные регистрации
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock: 70% шанс что пользователь существует
    const userExists = Math.random() > 0.3

    if (userExists) {
      setStep('code')
    } else {
      // Пользователь не найден - на регистрацию
      setStep('register')
      if (authMethod === 'phone') setPhone(contact)
      if (authMethod === 'email') setEmail(contact)
    }

    setLoading(false)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 600))

    // Mock: проверка кода (код 1234)
    if (code === '1234') {
      const user = {
        id: 'user-' + Date.now(),
        name: 'Иван Иванов',
        phone: authMethod === 'phone' ? contact : '',
        email: authMethod === 'email' ? contact : ''
      }
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/')
    } else {
      setError('Неверный код. Используйте 1234')
    }

    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock: отправка кода верификации
    setStep('registerCode')
    setLoading(false)
  }

  const handleConfirmRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 600))

    // Mock: проверка кода и создание пользователя
    if (code === '1234') {
      const user = {
        id: 'user-' + Date.now(),
        firstName,
        lastName,
        name: firstName + ' ' + lastName,
        email,
        phone
      }
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/')
    } else {
      setError('Неверный код. Используйте 1234')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-avtovaz-blue-light/10 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        {step === 'choose' && (
          <>
            <CardHeader className="bg-avtovaz-blue-light/5">
              <CardTitle className="text-2xl text-avtovaz-blue">Вход</CardTitle>
              <CardDescription>
                Авторизация через Lecar ID
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleRequestCode} className="space-y-4">
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={authMethod === 'phone' ? 'default' : 'outline'}
                    onClick={() => setAuthMethod('phone')}
                    className="flex-1"
                  >
                    Телефон
                  </Button>
                  <Button
                    type="button"
                    variant={authMethod === 'email' ? 'default' : 'outline'}
                    onClick={() => setAuthMethod('email')}
                    className="flex-1"
                  >
                    Email
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact">
                    {authMethod === 'phone' ? 'Номер телефона' : 'Email'}
                  </Label>
                  <Input
                    id="contact"
                    type={authMethod === 'phone' ? 'tel' : 'email'}
                    placeholder={authMethod === 'phone' ? '+7 (___) ___-__-__' : 'example@mail.ru'}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Отправка...' : 'Получить код'}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Демо: код 1234, 70% найдёт пользователя
                </p>
              </form>
            </CardContent>
          </>
        )}

        {step === 'code' && (
          <>
            <CardHeader>
              <CardTitle>Введите код</CardTitle>
              <CardDescription>
                Код отправлен на {authMethod === 'phone' ? 'телефон' : 'почту'}: {contact}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Код подтверждения</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="____"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Проверка...' : 'Войти'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setStep('choose')} className="w-full">
                  Назад
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {step === 'register' && (
          <>
            <CardHeader>
              <CardTitle>Регистрация</CardTitle>
              <CardDescription>
                Пользователь не найден. Заполните данные для регистрации
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Имя *</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Фамилия *</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regPhone">Телефон *</Label>
                  <Input
                    id="regPhone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (___) ___-__-__"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="regEmail">Email *</Label>
                  <Input
                    id="regEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.ru"
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Отправка...' : 'Зарегистрироваться'}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setStep('choose')} className="w-full">
                  Назад
                </Button>
              </form>
            </CardContent>
          </>
        )}

        {step === 'registerCode' && (
          <>
            <CardHeader>
              <CardTitle>Подтверждение регистрации</CardTitle>
              <CardDescription>
                Код отправлен на {phone || email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConfirmRegistration} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="regCode">Код подтверждения</Label>
                  <Input
                    id="regCode"
                    type="text"
                    placeholder="____"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={4}
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Проверка...' : 'Завершить регистрацию'}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}
