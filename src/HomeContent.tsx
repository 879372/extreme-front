import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleGauge,
  Database,
  Menu,
  Network,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
  WalletCards,
  Zap,
} from "lucide-react";

type Client = {
  id: number;
  full_name: string;
  company: string;
  email: string | null;
  phone: string;
  service: string;
  status: "Ativo" | "Onboarding" | "Pausado";
  monthly_value: string;
  system_url: string;
  billing_day: number | null;
  billing_messages_enabled: boolean;
  created_at: string;
  updated_at: string;
};

type Charge = { id: number; client: number; client_company: string; client_name: string; client_phone: string; due_date: string; amount: string; status: "Pendente" | "Pago"; paid_at: string | null };
type BillingSettings = { id?: number; pix_key: string; message_template: string };

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.replace(/^(\d{0,2})/, "($1");
  if (digits.length <= 6) return digits.replace(/^(\d{2})(\d+)/, "($1) $2");
  if (digits.length <= 10) return digits.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  return digits.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

function formatBRLInput(value: string) {
  const cents = Number(value.replace(/\D/g, "")) / 100;
  return cents.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseBRL(value: FormDataEntryValue | null) {
  const digits = String(value || "").replace(/\D/g, "");
  return (Number(digits) / 100).toFixed(2);
}

const services = [
  { icon: Database, number: "01", title: "Sistema sob medida", text: "Um sistema feito para o jeito que sua empresa trabalha: clientes, vendas, estoque, serviços e financeiro em um só lugar." },
  { icon: CircleGauge, number: "02", title: "Controle do negócio", text: "Painéis simples para você saber quanto vendeu, quanto gastou, o que tem a receber e qual foi o lucro de verdade." },
  { icon: Workflow, number: "03", title: "Automação inteligente", text: "Tarefas repetitivas passam a acontecer sozinhas, reduzindo erros e devolvendo tempo para você cuidar do crescimento." },
];

const clientLogos = [
  { name: "JR Sacolões", logo: "/clients/jr-sacoloes.png", sector: "Varejo & embalagens" },
  { name: "Orizon Construtora", logo: "/clients/orizon-construtora.png", sector: "Construção civil" },
  { name: "Richardson Barber", logo: "/clients/richardson-barber.png", sector: "Beleza & cuidado" },
  { name: "Ravi Salgados", logo: "/clients/ravi-salgados.png", sector: "Alimentação" },
  { name: "Online Multicompras", logo: "/clients/online-multicompras.png", sector: "Comércio digital" },
  { name: "Lukinha Cell", logo: "/clients/lukinha-cell.png", sector: "Tecnologia & mobile" },
];

const whatsappUrl = "https://wa.me/5584986276144?text=Ol%C3%A1%2C%20Kaio!%20Vim%20pelo%20site%20Kaibez%20e%20quero%20conversar%20sobre%20uma%20solu%C3%A7%C3%A3o.";

function OrbitalScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mount.current) return;
    const root = mount.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, root.clientWidth / root.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8.5);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(root.clientWidth, root.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    root.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.32, 3),
      new THREE.MeshPhysicalMaterial({ color: 0x111d22, metalness: 0.72, roughness: 0.18, transmission: 0.14, emissive: 0x063a36, emissiveIntensity: 0.55, wireframe: false })
    );
    group.add(core);
    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.42, 2),
      new THREE.MeshBasicMaterial({ color: 0x58f7ce, wireframe: true, transparent: true, opacity: 0.22 })
    );
    group.add(wire);

    const rings = [2.05, 2.55, 3.05].map((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.012 + index * 0.004, 8, 160),
        new THREE.MeshBasicMaterial({ color: index === 1 ? 0x8174ff : 0x4eeec3, transparent: true, opacity: 0.45 - index * 0.08 })
      );
      ring.rotation.x = 0.9 + index * 0.5;
      ring.rotation.y = 0.25 + index * 0.7;
      group.add(ring);
      return ring;
    });

    const particlesGeometry = new THREE.BufferGeometry();
    const particles = new Float32Array(360 * 3);
    for (let i = 0; i < 360; i++) {
      const r = 2.2 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particles[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particles[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particles[i * 3 + 2] = r * Math.cos(phi);
    }
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particles, 3));
    const cloud = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({ color: 0xb8fff0, size: 0.026, transparent: true, opacity: 0.65 }));
    group.add(cloud);

    scene.add(new THREE.AmbientLight(0x7be9d0, 1.2));
    const light = new THREE.PointLight(0x72f5d3, 18, 16);
    light.position.set(3, 2, 4);
    scene.add(light);
    const purple = new THREE.PointLight(0x7568ff, 14, 14);
    purple.position.set(-3, -2, 2);
    scene.add(purple);

    let frame = 0;
    let mx = 0;
    let my = 0;
    const onPointer = (event: PointerEvent) => {
      mx = (event.clientX / window.innerWidth - 0.5) * 0.45;
      my = (event.clientY / window.innerHeight - 0.5) * 0.3;
    };
    const onResize = () => {
      if (!root.clientWidth || !root.clientHeight) return;
      camera.aspect = root.clientWidth / root.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(root.clientWidth, root.clientHeight);
    };
    const tick = () => {
      frame = requestAnimationFrame(tick);
      group.rotation.y += 0.0022;
      group.rotation.x += (my - group.rotation.x) * 0.025;
      group.position.x += (mx - group.position.x) * 0.025;
      rings[0].rotation.z += 0.003;
      rings[1].rotation.z -= 0.002;
      rings[2].rotation.z += 0.0015;
      cloud.rotation.y -= 0.0007;
      renderer.render(scene, camera);
    };
    window.addEventListener("pointermove", onPointer);
    window.addEventListener("resize", onResize);
    tick();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      particlesGeometry.dispose();
      root.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="orbital-scene" ref={mount} aria-hidden="true" />;
}

export function Brand() {
  return <a className="brand" href="#top" aria-label="Kaibez, início"><span className="brand-mark">K</span><span>KAIBEZ<small>BY JOSÉ KAIO</small></span></a>;
}

function PublicSite() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.from(".hero-copy > *", { opacity: 0, y: 32, stagger: 0.1, duration: 0.9, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, { opacity: 0, y: 42, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 86%" } });
      });
    });
    return () => context.revert();
  }, []);

  return (
    <main id="top" className="public-site">
      <nav className="nav shell">
        <Brand />
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#solucoes" onClick={() => setMenuOpen(false)}>Soluções</a>
          <a href="#clientes" onClick={() => setMenuOpen(false)}>Clientes</a>
          <a href="#metodo" onClick={() => setMenuOpen(false)}>Método</a>
          <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen ? <X /> : <Menu />}</button>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><span /> José Kaio · Software, automação e IA</div>
          <h1>Eu transformo ideias<br />e processos em<br /><em>tecnologia útil.</em></h1>
          <p>Sou José Kaio, desenvolvedor por trás da Kaibez. Crio sistemas personalizados, automações e soluções com IA para negócios que querem trabalhar melhor e crescer com mais controle.</p>
          <div className="hero-actions">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="button primary">Vamos criar algo juntos <ArrowUpRight size={18} /></a>
            <a href="#solucoes" className="text-link">Conhecer meu trabalho <ChevronRight size={17} /></a>
          </div>
        </div>
        <div className="hero-visual">
          <OrbitalScene />
          <div className="profile-frame"><img src="/kaio-profile.png" alt="José Kaio, desenvolvedor da Kaibez"/></div>
          <div className="telemetry t-one"><span>DESENVOLVIMENTO</span><strong>SOB MEDIDA</strong><small>SOFTWARE · AUTOMAÇÃO · IA</small></div>
          <div className="telemetry t-two"><Zap size={15} /><span>DO PROBLEMA</span><strong>À SOLUÇÃO</strong></div>
          <div className="orbit-label">KAIBEZ / TECNOLOGIA COM PROPÓSITO</div>
        </div>
        <div className="hero-index"><span>01</span><i /><small>04</small></div>
      </section>

      <section className="proof-strip">
        <div className="shell proof-inner">
          <span>SIMPLES DE USAR</span><i />
          <span>FEITO PARA O SEU NEGÓCIO</span><i />
          <span>PREÇO QUE CABE NA REALIDADE</span><i />
          <span>SUPORTE DE VERDADE</span>
        </div>
      </section>

      <section id="clientes" className="clients-section section">
        <div className="shell clients-heading" data-reveal>
          <div><span className="kicker">/ Projetos e parcerias</span><h2>Pessoas reais.<br /><em>Soluções que fazem diferença.</em></h2></div>
          <p>Negócios de diferentes segmentos que confiaram no meu trabalho para simplificar a rotina com tecnologia.</p>
        </div>
        <div className="client-marquee" aria-label="Clientes e parceiros da Kaibez">
          <div className="marquee-fade fade-left" /><div className="marquee-fade fade-right" />
          <div className="client-track">
            {[...clientLogos, ...clientLogos].map((client, index) => (
              <article className="logo-card" key={`${client.name}-${index}`} aria-hidden={index >= clientLogos.length}>
                <div className="logo-frame"><img src={client.logo} alt={index < clientLogos.length ? `Logo ${client.name}` : ""} loading="lazy" /></div>
                <div className="logo-meta"><span>{String((index % clientLogos.length) + 1).padStart(2, "0")}</span><div><strong>{client.name}</strong><small>{client.sector}</small></div><ArrowUpRight size={15} /></div>
              </article>
            ))}
          </div>
        </div>
        <div className="shell clients-caption"><span><i /> PARCERIAS EM EVOLUÇÃO CONTÍNUA</span><small>Passe o cursor para pausar</small></div>
      </section>

      <section id="solucoes" className="solutions shell section">
        <div className="section-head" data-reveal>
          <div><span className="kicker">/ O que eu desenvolvo</span><h2>Tecnologia feita para você.<br /><em>Do seu jeito.</em></h2></div>
          <p>Você não precisa se adaptar a um sistema complicado. Eu entendo sua rotina e construo uma solução direta para os seus problemas reais.</p>
        </div>
        <div className="service-grid">
          {services.map(({ icon: Icon, number, title, text }) => (
            <article className="service-card" key={number} data-reveal>
              <div className="service-top"><span>{number}</span><Icon size={25} /></div>
              <h3>{title}</h3><p>{text}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label={`Conversar no WhatsApp sobre ${title}`}>Conhecer solução <ArrowUpRight size={16} /></a>
            </article>
          ))}
        </div>
      </section>

      <section id="metodo" className="method section">
        <div className="shell method-grid">
          <div className="method-copy" data-reveal><span className="kicker">/ Trabalho de perto</span><h2>Você conhece o negócio.<br /><em>Eu construo a tecnologia.</em></h2><p>Você me conta como trabalha e onde estão as dificuldades. Eu transformo isso em uma solução simples, útil e pensada para sua realidade.</p></div>
          <div className="pipeline" data-reveal>
            {[['01','CONVERSA','Eu entendo sua rotina, suas dificuldades e o resultado que você busca.'],['02','PLANO SOB MEDIDA','Defino o que realmente faz sentido, sem funções desnecessárias.'],['03','DESENVOLVIMENTO','Você acompanha cada etapa enquanto a solução ganha forma.'],['04','EVOLUÇÃO CONTÍNUA','Continuo por perto para melhorar o sistema junto com seu negócio.']].map(([n,t,d]) => <div className="pipeline-row" key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div><Check size={17}/></div>)}
          </div>
        </div>
      </section>

      <section className="metrics shell section" data-reveal>
        <div><strong>1<span> lugar</span></strong><p>para acompanhar todo o negócio</p></div>
        <div><strong>−<span> papel</span></strong><p>informações organizadas e seguras</p></div>
        <div><strong>+<span> tempo</span></strong><p>para atender e fazer a empresa crescer</p></div>
        <div><strong>100<span>% seu</span></strong><p>feito para sua rotina e seu orçamento</p></div>
      </section>

      <section id="contato" className="cta-section shell section" data-reveal>
        <div className="cta-orb"><Sparkles /></div>
        <span className="kicker">/ Vamos conversar?</span>
        <h2>Tem uma ideia ou um processo<br /><em>que precisa evoluir?</em></h2>
        <p>Me conte o que você quer construir ou melhorar. A primeira conversa é direta, sem compromisso e sem linguagem complicada.</p>
        <a className="button primary large" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Falar com o Kaio <ArrowUpRight size={19}/></a>
      </section>

      <footer className="footer shell">
        <Brand /><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Conversar com José Kaio pelo WhatsApp">WhatsApp · (84) 98627-6144</a><span>© 2026 Kaibez · José Kaio</span>
      </footer>
    </main>
  );
}

export function Dashboard({ onExit }: { onExit: () => void }) {
  const [activeSection, setActiveSection] = useState<"overview" | "clients" | "charges" | "settings">("overview");
  const [clients, setClients] = useState<Client[]>([]);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [billingSettings, setBillingSettings] = useState<BillingSettings>({ pix_key: "", message_template: "Olá, {name}! A mensalidade de {value} da {company} está pendente. Chave PIX: {pix_key}. Obrigado! — Kaibez" });
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [notice, setNotice] = useState("");
  const [loadingClients, setLoadingClients] = useState(true);
  const [savingClient, setSavingClient] = useState(false);
  const [clientsError, setClientsError] = useState("");
  const filtered = useMemo(() => clients.filter(c => `${c.full_name} ${c.company} ${c.email}`.toLowerCase().includes(query.toLowerCase())), [clients, query]);
  const revenue = clients.filter(c => c.status !== "Pausado").reduce((sum, c) => sum + Number(c.monthly_value), 0);
  const activeClients = clients.filter(c => c.status === "Ativo").length;
  const onboardingClients = clients.filter(c => c.status === "Onboarding").length;
  const pausedClients = clients.filter(c => c.status === "Pausado").length;
  const pendingCharges = charges.filter(charge => charge.status === "Pendente");

  const loadClients = async () => {
    const token = sessionStorage.getItem("extreme_auth_token");
    setLoadingClients(true);
    setClientsError("");
    try {
      const response = await fetch(`${apiUrl}/api/clients/`, { headers: { Authorization: `Token ${token}` } });
      if (response.status === 401 || response.status === 403) { onExit(); return; }
      if (!response.ok) throw new Error("Não foi possível carregar os clientes.");
      const data: Client[] | { results: Client[] } = await response.json();
      setClients(Array.isArray(data) ? data : data.results);
    } catch (requestError) {
      setClientsError(requestError instanceof Error ? requestError.message : "Erro ao acessar a API.");
    } finally {
      setLoadingClients(false);
    }
  };

  // A primeira carga sincroniza o painel com a API protegida.
  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { void loadClients(); }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("extreme_auth_token");
    Promise.all([
      fetch(`${apiUrl}/api/charges/`, { headers: { Authorization: `Token ${token}` } }),
      fetch(`${apiUrl}/api/billing-settings/`, { headers: { Authorization: `Token ${token}` } }),
    ]).then(async ([chargesResponse, settingsResponse]) => {
      if (chargesResponse.ok) setCharges(await chargesResponse.json());
      if (settingsResponse.ok) {
        const settings: BillingSettings[] = await settingsResponse.json();
        if (settings[0]) setBillingSettings(settings[0]);
      }
    }).catch(() => setClientsError("Não foi possível carregar os dados financeiros."));
  }, []);

  const createCharge = async (client: Client) => {
    const token = sessionStorage.getItem("extreme_auth_token");
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const dueDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(Math.min(client.billing_day || 1, lastDay)).padStart(2, "0")}`;
    const response = await fetch(`${apiUrl}/api/charges/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Token ${token}` }, body: JSON.stringify({ client: client.id, due_date: dueDate, amount: client.monthly_value, status: "Pendente" }) });
    if (!response.ok) { setNotice("Essa cobrança já existe ou não pôde ser criada."); return; }
    const charge: Charge = await response.json();
    setCharges(previous => [charge, ...previous]);
    setNotice(`Cobrança de ${client.company} criada.`);
  };

  const markAsPaid = async (charge: Charge) => {
    const token = sessionStorage.getItem("extreme_auth_token");
    const response = await fetch(`${apiUrl}/api/charges/${charge.id}/`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Token ${token}` }, body: JSON.stringify({ status: "Pago" }) });
    if (!response.ok) { setNotice("Não foi possível dar baixa."); return; }
    const updated: Charge = await response.json();
    setCharges(previous => previous.map(item => item.id === updated.id ? updated : item));
    setNotice(`Pagamento de ${charge.client_company} confirmado.`);
  };

  const saveBillingSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = sessionStorage.getItem("extreme_auth_token");
    const method = billingSettings.id ? "PATCH" : "POST";
    const endpoint = billingSettings.id ? `${apiUrl}/api/billing-settings/${billingSettings.id}/` : `${apiUrl}/api/billing-settings/`;
    const response = await fetch(endpoint, { method, headers: { "Content-Type": "application/json", Authorization: `Token ${token}` }, body: JSON.stringify(billingSettings) });
    if (!response.ok) { setNotice("Não foi possível salvar as configurações."); return; }
    setBillingSettings(await response.json());
    setNotice("Configurações de cobrança salvas.");
  };

  const saveClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSavingClient(true);
    setClientsError("");
    try {
      const token = sessionStorage.getItem("extreme_auth_token");
      const company = String(form.get("company"));
      const email = String(form.get("email") || "").trim();
      const response = await fetch(`${apiUrl}/api/clients/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Token ${token}` }, body: JSON.stringify({ full_name: form.get("name"), company, email: email || null, phone: form.get("phone"), service: form.get("service"), monthly_value: parseBRL(form.get("value")), system_url: form.get("system_url"), billing_day: Number(form.get("billing_day")), status: "Onboarding" }) });
      if (response.status === 401 || response.status === 403) { onExit(); return; }
      if (!response.ok) {
        const details = await response.json().catch(() => null);
        const firstError = details && Object.values(details).flat()[0];
        throw new Error(typeof firstError === "string" ? firstError : "Não foi possível cadastrar o cliente.");
      }
      const saved: Client = await response.json();
      setClients(prev => [saved, ...prev]);
      setModal(false);
      setNotice(`${company} foi adicionada com sucesso.`);
      setTimeout(() => setNotice(""), 3500);
    } catch (requestError) {
      setClientsError(requestError instanceof Error ? requestError.message : "Erro ao acessar a API.");
    } finally {
      setSavingClient(false);
    }
  };

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <Brand />
        <div className="side-label">OPERAÇÃO</div>
        <button className={`side-item ${activeSection === "overview" ? "active" : ""}`} onClick={() => setActiveSection("overview")}><CircleGauge size={18}/> Visão geral</button>
        <button className={`side-item ${activeSection === "clients" ? "active" : ""}`} onClick={() => setActiveSection("clients")}><Network size={18}/> Clientes <span>{clients.length}</span></button>
        <button className={`side-item ${activeSection === "charges" ? "active" : ""}`} onClick={() => setActiveSection("charges")}><WalletCards size={18}/> Cobranças <span>{pendingCharges.length}</span></button>
        <button className={`side-item ${activeSection === "settings" ? "active" : ""}`} onClick={() => setActiveSection("settings")}><Settings size={18}/> Configurações</button>
        <div className="side-spacer" />
        <div className="system-card"><span><i /> SISTEMA ONLINE</span><strong>Todos os serviços operando</strong><small>Atualizado agora</small></div>
        <button className="side-exit" onClick={onExit}>← Sair do painel</button>
      </aside>
      <section className="dash-main">
        <header className="dash-header"><div><span>PAINEL KAIBEZ</span><h1>Olá, Kaio.</h1></div><div className="operator"><div>JK</div><span><strong>José Kaio</strong><small>Administrador</small></span></div></header>
        <div className="dash-content">
          <div className="dash-title"><div><h2>{activeSection === "overview" ? "Visão geral" : activeSection === "clients" ? "Clientes" : activeSection === "charges" ? "Cobranças" : "Configurações"}</h2><p>{activeSection === "overview" ? "Acompanhe clientes e a saúde da sua operação." : activeSection === "clients" ? "Sua carteira organizada em cards." : activeSection === "charges" ? "Controle vencimentos e dê baixa nos pagamentos." : "Configure PIX e a mensagem enviada aos clientes."}</p></div>{activeSection === "clients" && <button className="button primary" onClick={() => setModal(true)}><Plus size={17}/> Novo cliente</button>}</div>
          {activeSection === "overview" && <div className="stat-grid">
            <div className="stat-card"><span>CLIENTES ATIVOS <Network/></span><strong>{activeClients}</strong><small>de {clients.length} clientes cadastrados</small></div>
            <div className="stat-card"><span>RECEITA MENSAL <CircleGauge/></span><strong>{revenue.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0})}</strong><small>valor mensal dos contratos vigentes</small></div>
            <div className="stat-card"><span>EM ONBOARDING <Zap/></span><strong>{onboardingClients}</strong><small>projetos em implantação</small></div>
            <div className="stat-card accent"><span>CLIENTES PAUSADOS <Sparkles/></span><strong>{pausedClients}</strong><small>contratos temporariamente pausados</small></div>
          </div>}
          {(activeSection === "overview" || activeSection === "clients") && <div className="client-panel card-panel">
            <div className="client-panel-head"><div><h3>{activeSection === "overview" ? "Clientes recentes" : "Todos os clientes"}</h3><span>{clients.length} registros</span></div><label className="search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar cliente..."/></label></div>
            {clientsError && <div className="panel-message error">{clientsError} <button onClick={() => void loadClients()}>Tentar novamente</button></div>}
            <div className="info-card-grid">{loadingClients ? <div className="empty-card">Carregando clientes...</div> : filtered.length === 0 ? <div className="empty-card">{query ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado ainda."}</div> : filtered.map(client => <article className="client-info-card" key={client.id}><div className="client-card-head"><span className="avatar">{client.company.slice(0,2).toUpperCase()}</span><div><h3>{client.company}</h3><p>{client.full_name}</p></div><span className={`status ${client.status.toLowerCase()}`}><i/>{client.status}</span></div><div className="client-card-value"><small>MENSALIDADE</small><strong>{Number(client.monthly_value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong></div><div className="client-card-details"><span><small>SOLUÇÃO</small>{client.service}</span><span><small>VENCIMENTO</small>Dia {client.billing_day || "—"}</span><span><small>WHATSAPP</small>{client.phone}</span><span><small>E-MAIL</small>{client.email || "Não informado"}</span></div><div className="client-card-actions">{client.system_url && <a href={client.system_url} target="_blank" rel="noreferrer">Abrir sistema <ArrowUpRight size={14}/></a>}<button onClick={() => void createCharge(client)}>Gerar cobrança</button></div></article>)}</div>
          </div>}
          {activeSection === "charges" && <div className="info-card-grid charge-grid">{charges.length === 0 ? <div className="empty-card">Nenhuma cobrança gerada.</div> : charges.map(charge => <article className={`charge-card ${charge.status.toLowerCase()}`} key={charge.id}><div className="charge-card-head"><div><small>VENCIMENTO</small><strong>{new Date(`${charge.due_date}T12:00:00`).toLocaleDateString("pt-BR")}</strong></div><span className={`status ${charge.status === "Pago" ? "ativo" : "onboarding"}`}><i/>{charge.status}</span></div><h3>{charge.client_company}</h3><p>{charge.client_name} · {charge.client_phone}</p><strong className="charge-amount">{Number(charge.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</strong>{charge.status === "Pendente" ? <button className="button primary" onClick={() => void markAsPaid(charge)}><Check size={15}/> Dar baixa</button> : <small className="paid-date">Pago em {charge.paid_at ? new Date(charge.paid_at).toLocaleDateString("pt-BR") : "—"}</small>}</article>)}</div>}
          {activeSection === "settings" && <form className="settings-card" onSubmit={saveBillingSettings}><div className="settings-icon"><Settings/></div><label>Chave PIX<input value={billingSettings.pix_key} onChange={event => setBillingSettings(current => ({ ...current, pix_key: event.target.value }))} placeholder="CPF, CNPJ, telefone, e-mail ou chave aleatória"/></label><label>Mensagem de cobrança<textarea rows={7} value={billingSettings.message_template} onChange={event => setBillingSettings(current => ({ ...current, message_template: event.target.value }))}/></label><div className="template-help">Variáveis disponíveis: <code>{`{name}`}</code> <code>{`{company}`}</code> <code>{`{value}`}</code> <code>{`{pix_key}`}</code></div><button className="button primary" type="submit">Salvar configurações</button></form>}
        </div>
      </section>
      {notice && <div className="toast"><Check size={17}/>{notice}</div>}
      {modal && <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && !savingClient && setModal(false)}><div className="modal"><div className="modal-head"><div><span>NOVO REGISTRO</span><h2>Cadastrar cliente</h2></div><button disabled={savingClient} onClick={() => setModal(false)} aria-label="Fechar"><X/></button></div><form onSubmit={saveClient}><div className="form-grid"><label>Nome completo<input required name="name" placeholder="Ex: Ana Martins"/></label><label>Empresa<input required name="company" placeholder="Ex: Acme Ltda."/></label><label>E-mail (opcional)<input type="email" name="email" placeholder="ana@empresa.com"/></label><label>Telefone / WhatsApp<input required inputMode="numeric" maxLength={15} name="phone" placeholder="(84) 99999-9999" onInput={event => { event.currentTarget.value = formatPhone(event.currentTarget.value); }}/></label><label>Solução<select name="service"><option>Agente de IA</option><option>Automação</option><option>Software sob medida</option><option>Integrações</option></select></label><label>Valor mensal<input required inputMode="numeric" type="text" name="value" defaultValue="R$ 0,00" placeholder="R$ 5.000,00" onInput={event => { event.currentTarget.value = formatBRLInput(event.currentTarget.value); }}/></label><label>Link do sistema<input type="url" name="system_url" placeholder="https://sistema.cliente.com"/></label><label>Dia da cobrança<input required min="1" max="31" type="number" name="billing_day" placeholder="10"/></label></div><div className="form-note"><ShieldCheck size={16}/> Os dados serão armazenados com segurança na API Kaibez.</div><button disabled={savingClient} className="button primary form-submit" type="submit">{savingClient ? "Salvando..." : <>Cadastrar cliente <ArrowUpRight size={17}/></>}</button></form></div></div>}
    </main>
  );
}

export default function Home() {
  return <PublicSite />;
}
