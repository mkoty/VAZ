"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/api"

type Step = 'choose' | 'code' | 'register' | 'registerCode'

export default function AuthPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('choose')
  const [authMethod, setAuthMethod] = useState<'phone' | 'email'>('email')
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

    try {
      const result = await api.requestCode(contact, authMethod)

      if (result.userExists) {
        setStep('code')
      } else {
        // Пользователь не найден - на регистрацию
        setStep('register')
        if (authMethod === 'phone') setPhone(contact)
        if (authMethod === 'email') setEmail(contact)
      }
    } catch (err) {
      setError('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await api.verifyCode(contact, code, authMethod)

      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('token', result.token)
        router.push('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный код')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.register({ firstName, lastName, phone, email })
      setStep('registerCode')
    } catch (err) {
      setError('Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await api.confirmRegistration({
        firstName,
        lastName,
        phone,
        email,
        code
      })

      if (result.success) {
        localStorage.setItem('user', JSON.stringify(result.user))
        localStorage.setItem('token', result.token)
        router.push('/')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный код')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-lada-blue-light/10 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        {step === 'choose' && (
          <>
            <CardHeader className="bg-lada-blue-light/5">
              <CardTitle className="text-2xl text-lada-blue">Вход</CardTitle>
              <CardDescription>
                Авторизация через LADA ID
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
                    disabled
                  >
                    Телефон
                    <span className="ml-2 text-xs text-muted-foreground">(скоро)</span>
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
              </form>
            </CardContent>
          </>
        )}

        {step === 'code' && (
          <>
            <CardHeader>
              <CardTitle>Введите код</CardTitle>
              <CardDescription>
                Код отправлен на email: {contact}
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
                Код отправлен на email: {email}
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
