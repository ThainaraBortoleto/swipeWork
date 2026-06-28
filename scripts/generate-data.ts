import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

type Category =
  | 'desenvolvimento'
  | 'design'
  | 'marketing'
  | 'fotografia'
  | 'video'
  | 'redacao'
  | 'saude'
  | 'educacao'
  | 'reforma'
  | 'domestico'
  | 'consultoria'
  | 'traducao'

interface Professional {
  name: string
  avatar: string
  profession: string
  category: Category
  description: string
  hourly_rate: number
  rating: number
  review_count: number
  city: string
  state: string
  distance_km: number
  tags: string[]
  services: string[]
  available: boolean
  response_time_hours: number
  joined_at: string
}

// ─── Utilitários ─────────────────────────────────────────────────────────────

let _seed = 42
function rand(min: number, max: number): number {
  _seed = (_seed * 1664525 + 1013904223) & 0xffffffff
  const t = ((_seed >>> 0) / 0xffffffff)
  return Math.floor(t * (max - min + 1)) + min
}
function pick<T>(arr: T[]): T { return arr[rand(0, arr.length - 1)] }
function pickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => rand(0, 1) - 0.5)
  return shuffled.slice(0, n)
}
function slugify(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
}

// ─── Dados Base ───────────────────────────────────────────────────────────────

const firstNames = [
  'Ana','Bruno','Carla','Diego','Eduarda','Felipe','Gabriela','Henrique',
  'Isabela','João','Karina','Lucas','Mariana','Nicolas','Olivia','Pedro',
  'Rafaela','Samuel','Thais','Ursula','Vinícius','Wanderley','Ximena',
  'Yasmin','André','Beatriz','César','Daniela','Eduardo','Fernanda',
  'Gustavo','Helena','Igor','Juliana','Larissa','Mateus','Natália',
  'Oscar','Patrícia','Roberta','Sérgio','Tatiana','Ulisses','Vera','William',
]

const lastNames = [
  'Silva','Santos','Oliveira','Souza','Rodrigues','Ferreira','Alves','Pereira',
  'Lima','Gomes','Costa','Ribeiro','Martins','Carvalho','Almeida','Lopes',
  'Sousa','Fernandes','Vieira','Barbosa','Rocha','Dias','Nascimento','Andrade',
  'Moreira','Nunes','Marques','Machado','Mendes','Freitas','Cardoso','Ramos',
]

const cities = [
  { city: 'São Paulo', state: 'SP' },
  { city: 'Rio de Janeiro', state: 'RJ' },
  { city: 'Belo Horizonte', state: 'MG' },
  { city: 'Curitiba', state: 'PR' },
  { city: 'Porto Alegre', state: 'RS' },
  { city: 'Salvador', state: 'BA' },
  { city: 'Fortaleza', state: 'CE' },
  { city: 'Recife', state: 'PE' },
  { city: 'Goiânia', state: 'GO' },
  { city: 'Florianópolis', state: 'SC' },
  { city: 'Campinas', state: 'SP' },
  { city: 'Natal', state: 'RN' },
  { city: 'Belém', state: 'PA' },
  { city: 'Vitória', state: 'ES' },
  { city: 'João Pessoa', state: 'PB' },
]

// ─── Categorias ───────────────────────────────────────────────────────────────

interface CategoryConfig {
  category: Category
  professions: string[]
  tags: string[]
  services: string[]
  rateMin: number
  rateMax: number
  descriptions: string[]
}

const categories: CategoryConfig[] = [
  {
    category: 'desenvolvimento',
    professions: ['Desenvolvedor Full Stack','Desenvolvedor Frontend','Desenvolvedor Backend','Engenheiro de Software','Desenvolvedor Mobile','DevOps Engineer','Arquiteto de Software'],
    tags: ['typescript','react','vue','node','python','docker','aws','api rest','git'],
    services: ['Desenvolvimento web','APIs e integrações','Aplicativos mobile','Consultoria técnica','Code review','Automação de processos'],
    rateMin: 80, rateMax: 350,
    descriptions: [
      'Desenvolvedor com {years} anos de experiência em projetos de alto impacto. Especializado em arquiteturas escaláveis e código limpo.',
      'Apaixonado por resolver problemas complexos com código elegante. {years} anos construindo sistemas robustos para empresas de todos os portes.',
    ],
  },
  {
    category: 'design',
    professions: ['Designer UI/UX','Designer Gráfico','Designer de Produto','Motion Designer','Web Designer','Designer de Marca'],
    tags: ['figma','adobe xd','illustrator','photoshop','branding','ui','ux','prototipação','design system'],
    services: ['Design de interfaces','Identidade visual','Prototipação','Design system','Ilustrações','Redesign de marca'],
    rateMin: 60, rateMax: 280,
    descriptions: [
      'Designer com {years} anos criando experiências memoráveis. Meu processo combina pesquisa, estratégia e estética.',
      'Acredito que bom design resolve problemas. {years} anos ajudando marcas a se comunicar melhor.',
    ],
  },
  {
    category: 'marketing',
    professions: ['Especialista em Marketing Digital','Gestor de Tráfego Pago','Social Media Manager','Especialista em SEO','Copywriter','Growth Hacker'],
    tags: ['google ads','facebook ads','seo','analytics','instagram','tiktok','email marketing','funil de vendas'],
    services: ['Gestão de tráfego pago','Estratégia de redes sociais','Otimização SEO','Criação de conteúdo','Campanhas de e-mail'],
    rateMin: 50, rateMax: 220,
    descriptions: [
      'Profissional de marketing com {years} anos gerando resultados mensuráveis. ROAS médio de 4x nas campanhas.',
      'Especialista em crescimento orgânico e pago. Já ajudei mais de {projects} negócios a escalar sua presença digital.',
    ],
  },
  {
    category: 'fotografia',
    professions: ['Fotógrafo de Eventos','Fotógrafo Corporativo','Fotógrafo de Produtos','Fotógrafo de Casamentos','Fotógrafo Editorial'],
    tags: ['fotografia','edição','lightroom','photoshop','estúdio','retratos','produtos','eventos'],
    services: ['Fotos de eventos','Ensaios corporativos','Fotografia de produto','Cobertura de casamentos','Edição e tratamento'],
    rateMin: 40, rateMax: 200,
    descriptions: [
      'Fotógrafo com {years} anos capturando momentos únicos. Minha missão é contar histórias através de imagens.',
      'Especializado em {years} anos de fotografia profissional com equipamentos de última geração.',
    ],
  },
  {
    category: 'video',
    professions: ['Editor de Vídeo','Videomaker','Motion Graphics Designer','Produtor de Conteúdo','Editor para YouTube'],
    tags: ['premiere','after effects','davinci resolve','youtube','reels','motion','4k','colorização'],
    services: ['Edição de vídeos','Motion graphics','Vídeos para YouTube','Reels e Shorts','Vídeos institucionais'],
    rateMin: 50, rateMax: 250,
    descriptions: [
      'Editor com {years} anos transformando gravações brutas em histórias cativantes.',
      'Especialista em conteúdo audiovisual. {projects} vídeos produzidos com alta satisfação.',
    ],
  },
  {
    category: 'redacao',
    professions: ['Redator Publicitário','Copywriter','Redator SEO','Produtor de Conteúdo','Ghostwriter','Revisor de Textos'],
    tags: ['copywriting','seo','blog','e-mail','storytelling','revisão','ghostwriting','artigos'],
    services: ['Textos para landing pages','Blog posts','Roteiros de vídeo','E-mails de vendas','Posts para redes sociais'],
    rateMin: 30, rateMax: 180,
    descriptions: [
      'Redator com {years} anos escrevendo textos que convencem e convertem.',
      'Palavras certas no lugar certo. {years} anos de experiência em copywriting persuasivo.',
    ],
  },
  {
    category: 'saude',
    professions: ['Personal Trainer','Nutricionista','Psicólogo','Fisioterapeuta','Coach de Saúde','Massoterapeuta'],
    tags: ['saúde','bem-estar','exercícios','nutrição','mental','fisioterapia','massagem','online'],
    services: ['Treinos personalizados','Plano alimentar','Acompanhamento psicológico','Reabilitação física','Massagem terapêutica'],
    rateMin: 60, rateMax: 300,
    descriptions: [
      'Profissional de saúde com {years} anos dedicados ao bem-estar integral dos meus clientes.',
      'Acredito que saúde é um estilo de vida. {years} anos ajudando pessoas a alcançar seus objetivos.',
    ],
  },
  {
    category: 'educacao',
    professions: ['Professor Particular','Tutor de Idiomas','Instrutor de Programação','Coach Educacional','Professor de Música'],
    tags: ['aulas','tutoria','online','idiomas','programação','matemática','concursos','vestibular'],
    services: ['Aulas particulares','Preparação para vestibular','Tutoria universitária','Aulas de idiomas','Reforço escolar'],
    rateMin: 40, rateMax: 150,
    descriptions: [
      'Educador com {years} anos e método próprio que acelera o aprendizado.',
      'Transformo dificuldades em competências. {years} anos de ensino personalizado.',
    ],
  },
  {
    category: 'reforma',
    professions: ['Eletricista','Encanador','Pedreiro','Pintor','Marceneiro','Técnico em Ar-condicionado'],
    tags: ['elétrica','hidráulica','alvenaria','pintura','marcenaria','reforma','instalação','manutenção'],
    services: ['Instalações elétricas','Reparos hidráulicos','Pintura residencial','Móveis planejados','Manutenção de ar-condicionado'],
    rateMin: 50, rateMax: 180,
    descriptions: [
      'Profissional com {years} anos de experiência em reformas e manutenção. Trabalho com garantia.',
      'Pontualidade e serviço de qualidade. {years} anos atendendo residências e comércios.',
    ],
  },
  {
    category: 'domestico',
    professions: ['Diarista','Cozinheiro Particular','Babá','Cuidador de Idosos','Jardineiro','Cuidador de Pets'],
    tags: ['limpeza','cozinha','cuidado','doméstico','jardim','pets','organização','residencial'],
    services: ['Faxina completa','Diarista semanal','Cozinha particular','Cuidado de crianças','Cuidado de idosos','Jardinagem'],
    rateMin: 30, rateMax: 120,
    descriptions: [
      'Profissional dedicado com {years} anos em serviços domésticos. Referências disponíveis.',
      'Organização e cuidado com o que você mais valoriza. {years} anos de experiência.',
    ],
  },
  {
    category: 'consultoria',
    professions: ['Consultor Financeiro','Consultor de RH','Contador','Consultor de TI','Consultor de Negócios'],
    tags: ['finanças','rh','contabilidade','gestão','estratégia','processos','compliance','planejamento'],
    services: ['Planejamento financeiro','Recrutamento e seleção','Contabilidade','Auditoria de TI','Plano de negócios'],
    rateMin: 100, rateMax: 500,
    descriptions: [
      'Consultor com {years} anos ajudando empresas a tomar decisões mais inteligentes.',
      'Experiência sólida em {years} anos de consultoria para PMEs e grandes corporações.',
    ],
  },
  {
    category: 'traducao',
    professions: ['Tradutor Inglês-Português','Intérprete Simultâneo','Tradutor Técnico','Tradutor Jurídico','Legendista'],
    tags: ['inglês','espanhol','francês','tradução','interpretação','legendas','técnico','jurídico'],
    services: ['Tradução de documentos','Interpretação simultânea','Tradução técnica','Legendagem de vídeos','Revisão de traduções'],
    rateMin: 40, rateMax: 200,
    descriptions: [
      'Tradutor certificado com {years} anos. Precisão terminológica e entrega no prazo.',
      'Especializado em textos técnicos e jurídicos. {years} anos garantindo que sua mensagem chegue perfeitamente.',
    ],
  },
]

// ─── Gerador ──────────────────────────────────────────────────────────────────

function generateDescription(template: string): string {
  return template
    .replace('{years}', String(rand(2, 15)))
    .replace('{projects}', String(rand(30, 500)))
}

function generateDate(): string {
  const start = new Date('2019-01-01').getTime()
  const end = new Date('2024-12-31').getTime()
  const t = start + (rand(0, 10000) / 10000) * (end - start)
  return new Date(t).toISOString()
}

function generate(): Professional[] {
  const professionals: Professional[] = []
  const perCategory = Math.ceil(500 / categories.length)

  for (const config of categories) {
    for (let i = 0; i < perCategory; i++) {
      const firstName = pick(firstNames)
      const lastName = pick(lastNames)
      const fullName = `${firstName} ${lastName}`
      const location = pick(cities)
      const seed = slugify(fullName) + i

      professionals.push({
        name: fullName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
        profession: pick(config.professions),
        category: config.category,
        description: generateDescription(pick(config.descriptions)),
        hourly_rate: rand(config.rateMin, config.rateMax),
        rating: Math.round((rand(35, 50) / 10) * 10) / 10,
        review_count: rand(1, 287),
        city: location.city,
        state: location.state,
        distance_km: rand(1, 80),
        tags: pickN(config.tags, rand(3, 5)),
        services: pickN(config.services, rand(3, 5)),
        available: rand(0, 4) > 0,
        response_time_hours: pick([1, 2, 4, 8, 12, 24, 48]),
        joined_at: generateDate(),
      })
    }
  }

  return professionals
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const professionals = generate()

try { mkdirSync(resolve(process.cwd(), 'scripts/output'), { recursive: true }) } catch {}

const outputPath = resolve(process.cwd(), 'scripts/output/professionals.json')
writeFileSync(outputPath, JSON.stringify(professionals, null, 2), 'utf-8')

console.log(`\n✅ ${professionals.length} profissionais gerados!`)
console.log(`📁 Arquivo: scripts/output/professionals.json\n`)

const counts: Record<string, number> = {}
for (const p of professionals) {
  counts[p.category] = (counts[p.category] ?? 0) + 1
}
Object.entries(counts).forEach(([cat, count]) => {
  console.log(`   ${cat.padEnd(16)} ${count}`)
})