"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { Brand } from "../page";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("extreme_auth_token")) router.replace("/painel");
  }, [router]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
      });
      if (!response.ok) throw new Error("Usuário ou senha inválidos.");
      const result = await response.json();
      sessionStorage.setItem("extreme_auth_token", result.token);
      router.replace("/painel");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-grid" aria-hidden="true" />
      <header className="login-header"><Brand /><a href="/"><ArrowLeft size={15} /> Voltar ao site</a></header>
      <section className="login-shell">
        <div className="login-intro"><span className="kicker">/ ACESSO RESTRITO</span><h1>Controle sua operação.<br /><em>De um só lugar.</em></h1><p>Ambiente exclusivo da equipe Extreme para acompanhar clientes, soluções e resultados.</p><div className="login-security"><ShieldCheck size={18}/><span><strong>Ambiente protegido</strong><small>Seus dados trafegam de forma segura.</small></span></div></div>
        <div className="login-card">
          <div className="login-card-icon"><LockKeyhole size={22}/></div><span>PAINEL ADMINISTRATIVO</span><h2>Bem-vindo de volta</h2><p>Use suas credenciais de administrador.</p>
          <form onSubmit={handleLogin}>
            <label>Usuário<input name="username" required autoComplete="username" placeholder="Seu usuário" /></label>
            <label>Senha<div className="password-field"><input name="password" required type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Sua senha"/><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>
            {error && <div className="login-error" role="alert">{error}</div>}
            <button className="button primary login-submit" disabled={loading}>{loading ? "Entrando..." : <>Entrar no painel <ArrowRight size={17}/></>}</button>
          </form>
          <small className="login-help">Problemas com o acesso? Fale com o administrador.</small>
        </div>
      </section>
    </main>
  );
}
