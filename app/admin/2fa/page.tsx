'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Mail, Lock, ArrowLeft } from "lucide-react";

export default function TwoFactorPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Code
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendCode = async () => {
    setLoading(true);
    const res = await fetch('/api/2fa', {
      method: 'POST',
      body: JSON.stringify({ email, action: 'send' })
    });
    setLoading(false);
    if (res.ok) setStep(2);
    else alert('Имейлът не е в списъка с оторизирани администратори!');
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    const res = await fetch('/api/2fa', {
      method: 'POST',
      body: JSON.stringify({ code, action: 'verify' })
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin'); // Влизане в главния панел
      router.refresh(); // Опресняване на middleware състоянието
    } else {
      alert('Грешен или изтекъл код!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-2">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="text-primary w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold">2FA Защита</CardTitle>
          <CardDescription>Втора стъпка на идентификация</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 ? (
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-10" 
                  type="email"
                  placeholder="admin@gmail.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
              <Button className="w-full" onClick={handleSendCode} disabled={loading || !email}>
                {loading ? "Изпращане..." : "Прати код за достъп"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-center text-muted-foreground">Кодът е изпратен на <br/><strong>{email}</strong></p>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-10 text-center text-xl tracking-widest" 
                  placeholder="000000" 
                  value={code} 
                  onChange={(e) => setCode(e.target.value)} 
                />
              </div>
              <Button className="w-full" onClick={handleVerifyCode} disabled={loading || !code}>
                {loading ? "Проверка..." : "Потвърди и влез"}
              </Button>
              <button 
                onClick={() => setStep(1)} 
                className="w-full text-xs text-muted-foreground flex items-center justify-center gap-1 hover:text-primary"
              >
                <ArrowLeft className="w-3 h-3" /> Върни се към имейл
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}