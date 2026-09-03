import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  CircleGauge,
  Database,
  Menu,
  Network,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";

type Client = {
  id: number;
  full_name: string;
  company: string;
  email: string;
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

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

const whatsappUrl = "https://wa.me/5584986276144?text=Ol%C3%A1%2C%20vim%20pelo%20site%20da%20Extreme%20Software%20e%20quero%20conhecer%20uma%20solu%C3%A7%C3%A3o%20para%20o%20meu%20neg%C3%B3cio.";

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
  return <a className="brand" href="#top" aria-label="Extreme Software, início"><span className="brand-mark">X</span><span>EXTREME<small>SOFTWARE</small></span></a>;
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
          <div className="eyebrow"><span /> Tecnologia feita para quem empreende</div>
          <h1>Menos papel.<br />Menos confusão.<br /><em>Mais controle.</em></h1>
          <p>Criamos sistemas personalizados e acessíveis para pequenos e médios negócios organizarem a rotina, entenderem seus números e crescerem com segurança.</p>
          <div className="hero-actions">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="button primary">Quero organizar meu negócio <ArrowUpRight size={18} /></a>
            <a href="#solucoes" className="text-link">Ver como ajudamos <ChevronRight size={17} /></a>
          </div>
        </div>
        <div className="hero-visual">
          <OrbitalScene />
          <div className="telemetry t-one"><span>VISÃO DO NEGÓCIO</span><strong>100%</strong><small>VENDAS · CAIXA · CLIENTES</small></div>
          <div className="telemetry t-two"><Zap size={15} /><span>ROTINA ORGANIZADA</span><strong>TODO DIA</strong></div>
          <div className="orbit-label">EXT / NEGÓCIO SOB CONTROLE</div>
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
          <div><span className="kicker">/ Quem cresce com a Extreme</span><h2>Empreendedores reais.<br /><em>Negócios mais organizados.</em></h2></div>
          <p>Pequenas e médias empresas de diferentes segmentos que escolheram simplificar a rotina com tecnologia.</p>
        </div>
        <div className="client-marquee" aria-label="Clientes da Extreme Software">
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
          <div><span className="kicker">/ Como podemos ajudar</span><h2>Seu negócio organizado.<br /><em>Do seu jeito.</em></h2></div>
          <p>Você não precisa se adaptar a um sistema complicado. Nós entendemos sua rotina e construímos uma solução simples para os seus problemas reais.</p>
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
          <div className="method-copy" data-reveal><span className="kicker">/ Sem complicação</span><h2>Você conhece o negócio.<br /><em>Nós organizamos a tecnologia.</em></h2><p>Não precisa entender de software. Você conta como trabalha e onde estão as dificuldades; nós transformamos isso em uma solução simples, útil e possível de pagar.</p></div>
          <div className="pipeline" data-reveal>
            {[['01','CONVERSA','Entendemos sua rotina, suas anotações e o que tira seu tempo.'],['02','PLANO SOB MEDIDA','Definimos o que você realmente precisa, sem funções desnecessárias.'],['03','ENTREGA SIMPLES','Construímos, mostramos cada etapa e ensinamos sua equipe a usar.'],['04','PARCERIA CONTÍNUA','Acompanhamos seu negócio e evoluímos o sistema junto com você.']].map(([n,t,d]) => <div className="pipeline-row" key={n}><span>{n}</span><div><strong>{t}</strong><p>{d}</p></div><Check size={17}/></div>)}
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
        <h2>Seu negócio pode ser<br /><em>mais simples de controlar.</em></h2>
        <p>Conte como você trabalha hoje. A primeira conversa é sem compromisso e sem linguagem complicada.</p>
        <a className="button primary large" href={whatsappUrl} target="_blank" rel="noopener noreferrer">Conversar pelo WhatsApp <ArrowUpRight size={19}/></a>
      </section>

      <footer className="footer shell">
        <Brand /><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Conversar com a Extreme Software pelo WhatsApp">WhatsApp · (84) 98627-6144</a><span>© 2026 Extreme Software</span>
      </footer>
    </main>
  );
}

export function Dashboard({ onExit }: { onExit: () => void }) {
  const [clients, setClients] = useState<Client[]>([]);
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

  const saveClient = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSavingClient(true);
    setClientsError("");
    try {
      const token = sessionStorage.getItem("extreme_auth_token");
      const company = String(form.get("company"));
      const response = await fetch(`${apiUrl}/api/clients/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Token ${token}` }, body: JSON.stringify({ full_name: form.get("name"), company, email: form.get("email"), phone: form.get("phone"), service: form.get("service"), monthly_value: form.get("value"), system_url: form.get("system_url"), billing_day: Number(form.get("billing_day")), billing_messages_enabled: form.get("billing_messages_enabled") === "on", status: "Onboarding" }) });
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
        <button className="side-item active"><CircleGauge size={18}/> Visão geral</button>
        <button className="side-item"><Network size={18}/> Clientes <span>{clients.length}</span></button>
        <button className="side-item"><Bot size={18}/> Automações</button>
        <div className="side-spacer" />
        <div className="system-card"><span><i /> SISTEMA ONLINE</span><strong>Todos os serviços operando</strong><small>Atualizado agora</small></div>
        <button className="side-exit" onClick={onExit}>← Sair do painel</button>
      </aside>
      <section className="dash-main">
        <header className="dash-header"><div><span>PAINEL OPERACIONAL</span><h1>Bom dia, Extreme.</h1></div><div className="operator"><div>ES</div><span><strong>Administrador</strong><small>Equipe Extreme</small></span></div></header>
        <div className="dash-content">
          <div className="dash-title"><div><h2>Visão geral</h2><p>Acompanhe clientes e a saúde da sua operação.</p></div><button className="button primary" onClick={() => setModal(true)}><Plus size={17}/> Novo cliente</button></div>
          <div className="stat-grid">
            <div className="stat-card"><span>CLIENTES ATIVOS <Network/></span><strong>{activeClients}</strong><small>de {clients.length} clientes cadastrados</small></div>
            <div className="stat-card"><span>RECEITA MENSAL <CircleGauge/></span><strong>{revenue.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0})}</strong><small>valor mensal dos contratos vigentes</small></div>
            <div className="stat-card"><span>EM ONBOARDING <Zap/></span><strong>{onboardingClients}</strong><small>projetos em implantação</small></div>
            <div className="stat-card accent"><span>CLIENTES PAUSADOS <Sparkles/></span><strong>{pausedClients}</strong><small>contratos temporariamente pausados</small></div>
          </div>
          <div className="client-panel">
            <div className="client-panel-head"><div><h3>Clientes</h3><span>{clients.length} registros</span></div><label className="search"><Search size={16}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar cliente..."/></label></div>
            {clientsError && <div className="panel-message error">{clientsError} <button onClick={() => void loadClients()}>Tentar novamente</button></div>}
            <div className="table-wrap"><table><thead><tr><th>CLIENTE</th><th>SOLUÇÃO</th><th>STATUS</th><th>VALOR / MÊS</th><th>COBRANÇA</th><th>SISTEMA</th><th>CONTATO</th></tr></thead><tbody>
              {loadingClients ? <tr><td className="table-state" colSpan={7}>Carregando clientes da API...</td></tr> : filtered.length === 0 ? <tr><td className="table-state" colSpan={7}>{query ? "Nenhum cliente encontrado." : "Nenhum cliente cadastrado ainda."}</td></tr> : filtered.map(client => <tr key={client.id}><td><span className="avatar">{client.company.slice(0,2).toUpperCase()}</span><div><strong>{client.company}</strong><small>{client.full_name}</small></div></td><td>{client.service}</td><td><span className={`status ${client.status.toLowerCase()}`}><i/>{client.status}</span></td><td><strong>{Number(client.monthly_value).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</strong></td><td><span className="contact-cell">Dia {client.billing_day || "—"}<small>{client.billing_messages_enabled ? "WhatsApp automático" : "Envio desativado"}</small></span></td><td>{client.system_url ? <a className="system-link" href={client.system_url} target="_blank" rel="noreferrer">Abrir sistema <ArrowUpRight size={13}/></a> : "—"}</td><td><span className="contact-cell">{client.email}<small>{client.phone}</small></span></td></tr>)}
            </tbody></table></div>
          </div>
        </div>
      </section>
      {notice && <div className="toast"><Check size={17}/>{notice}</div>}
      {modal && <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && !savingClient && setModal(false)}><div className="modal"><div className="modal-head"><div><span>NOVO REGISTRO</span><h2>Cadastrar cliente</h2></div><button disabled={savingClient} onClick={() => setModal(false)} aria-label="Fechar"><X/></button></div><form onSubmit={saveClient}><div className="form-grid"><label>Nome completo<input required name="name" placeholder="Ex: Ana Martins"/></label><label>Empresa<input required name="company" placeholder="Ex: Acme Ltda."/></label><label>E-mail<input required type="email" name="email" placeholder="ana@empresa.com"/></label><label>Telefone / WhatsApp<input required name="phone" placeholder="(84) 99999-9999"/></label><label>Solução<select name="service"><option>Agente de IA</option><option>Automação</option><option>Software sob medida</option><option>Integrações</option></select></label><label>Valor mensal<input required min="0" step="0.01" type="number" name="value" placeholder="5000"/></label><label>Link do sistema<input type="url" name="system_url" placeholder="https://sistema.cliente.com"/></label><label>Dia da cobrança<input required min="1" max="31" type="number" name="billing_day" placeholder="10"/></label><label className="check-field"><input type="checkbox" name="billing_messages_enabled"/> Enviar cobrança automática pelo WhatsApp</label></div><div className="form-note"><ShieldCheck size={16}/> Os dados serão armazenados com segurança na API Extreme.</div><button disabled={savingClient} className="button primary form-submit" type="submit">{savingClient ? "Salvando..." : <>Cadastrar cliente <ArrowUpRight size={17}/></>}</button></form></div></div>}
    </main>
  );
}

export default function Home() {
  return <PublicSite />;
}
