import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "forum" | "chat" | "news" | "events" | "profile";

const NAV_ITEMS: { id: Page; label: string; icon: string }[] = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "forum", label: "Форум", icon: "MessageSquare" },
  { id: "chat", label: "Чат", icon: "MessageCircle" },
  { id: "news", label: "Новости", icon: "Newspaper" },
  { id: "events", label: "События", icon: "Calendar" },
  { id: "profile", label: "Профиль", icon: "User" },
];

const FORUM_TOPICS = [
  { id: 1, category: "Общее", title: "Как правильно настроить рабочее место для удалённой работы?", author: "Максим К.", replies: 24, views: 312, time: "2 часа назад", pinned: true },
  { id: 2, category: "Дизайн", title: "Тренды UI/UX в 2026 году — что стоит знать каждому", author: "Алина В.", replies: 18, views: 245, time: "4 часа назад", pinned: false },
  { id: 3, category: "Разработка", title: "React vs Vue в 2026: личный опыт перехода", author: "Илья Р.", replies: 47, views: 891, time: "вчера", pinned: false },
  { id: 4, category: "Карьера", title: "Как я нашёл первого клиента на фриланс за две недели", author: "Соня П.", replies: 31, views: 567, time: "вчера", pinned: false },
  { id: 5, category: "Инструменты", title: "Подборка AI-инструментов для повышения продуктивности", author: "Денис Ф.", replies: 12, views: 178, time: "2 дня назад", pinned: false },
  { id: 6, category: "Общее", title: "Обсуждение: границы между работой и отдыхом при удалёнке", author: "Катя М.", replies: 55, views: 730, time: "3 дня назад", pinned: false },
];

const NEWS_ITEMS = [
  { id: 1, tag: "Технологии", title: "Новый стандарт веб-разработки принят W3C", excerpt: "Консорциум W3C утвердил новые спецификации, которые изменят подход к созданию адаптивных интерфейсов.", author: "Редакция", time: "Сегодня, 10:30", reading: "3 мин" },
  { id: 2, tag: "Сообщество", title: "Встреча участников форума в Москве — итоги", excerpt: "Более 200 человек собрались на офлайн-встречу. Рассказываем о главных темах и впечатлениях участников.", author: "Организаторы", time: "Вчера, 18:00", reading: "5 мин" },
  { id: 3, tag: "Карьера", title: "Рынок труда IT: что изменилось за квартал", excerpt: "Аналитика по зарплатам, востребованным навыкам и регионам с наибольшим ростом вакансий.", author: "Аналитика", time: "7 апр", reading: "7 мин" },
  { id: 4, tag: "Дизайн", title: "Figma запустила новый режим совместной работы", excerpt: "Обновление значительно ускоряет командную работу над крупными проектами с общими библиотеками.", author: "Редакция", time: "6 апр", reading: "2 мин" },
];

const EVENTS = [
  { id: 1, date: { day: "12", month: "апр" }, title: "Воркшоп: Figma для начинающих", type: "Онлайн", spots: 8, total: 30 },
  { id: 2, date: { day: "15", month: "апр" }, title: "Встреча фронтенд-разработчиков Москвы", type: "Офлайн", spots: 15, total: 50 },
  { id: 3, date: { day: "20", month: "апр" }, title: "Вебинар: Как построить личный бренд в IT", type: "Онлайн", spots: 120, total: 200 },
  { id: 4, date: { day: "28", month: "апр" }, title: "Хакатон: Продукт за 48 часов", type: "Гибрид", spots: 0, total: 40 },
];

const CHAT_MESSAGES = [
  { id: 1, author: "Алина В.", avatar: "А", time: "12:04", text: "Всем привет! Кто занимался интеграцией Stripe с российскими картами?" },
  { id: 2, author: "Денис Ф.", avatar: "Д", time: "12:06", text: "Привет! Сейчас это почти нереально напрямую, используют посредников типа ЮKassa" },
  { id: 3, author: "Максим К.", avatar: "М", time: "12:09", text: "Согласен с Денисом. Мы полгода назад переехали на ЮKassa — документация нормальная, API чистое" },
  { id: 4, author: "Соня П.", avatar: "С", time: "12:11", text: "А с Tinkoff кто-нибудь пробовал? Видела что у них тоже есть платёжное решение" },
  { id: 5, author: "Илья Р.", avatar: "И", time: "12:14", text: "Tinkoff Acquiring — вполне рабочая штука. Но документация местами устаревшая, это раздражает" },
  { id: 6, author: "Катя М.", avatar: "К", time: "12:17", text: "Ребята, в канале #инструменты я пин закрепила ссылки на сравнение платёжек — заходите" },
];

function SearchBar({ onSearch, value, placeholder }: { onSearch: (v: string) => void; value: string; placeholder?: string }) {
  return (
    <div className="relative">
      <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={e => onSearch(e.target.value)}
        placeholder={placeholder || "Поиск..."}
        className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-sm text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
      />
      {value && (
        <button onClick={() => onSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
          <Icon name="X" size={14} />
        </button>
      )}
    </div>
  );
}

function CategoryBadge({ label }: { label: string }) {
  const colors: Record<string, string> = {
    "Общее": "bg-stone-100 text-stone-600",
    "Дизайн": "bg-blue-50 text-blue-600",
    "Разработка": "bg-green-50 text-green-600",
    "Карьера": "bg-amber-50 text-amber-600",
    "Инструменты": "bg-purple-50 text-purple-600",
    "Технологии": "bg-blue-50 text-blue-600",
    "Сообщество": "bg-rose-50 text-rose-600",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${colors[label] || "bg-muted text-muted-foreground"}`}>
      {label}
    </span>
  );
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-14 h-14 text-lg" };
  return (
    <div className={`${sizes[size]} rounded-full bg-foreground text-background flex items-center justify-center font-semibold flex-shrink-0`}>
      {name[0]}
    </div>
  );
}

function HomePage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  const stats = [
    { label: "Участников", value: "12 840" },
    { label: "Тем на форуме", value: "4 291" },
    { label: "Сообщений", value: "86 700" },
    { label: "Событий", value: "34" },
  ];

  return (
    <div className="animate-fade-in">
      <section className="pt-16 pb-20 border-b border-border">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6 animate-slide-up">Сообщество профессионалов</p>
        <h1 className="font-display text-6xl md:text-8xl font-normal leading-[0.95] tracking-tight mb-8 animate-slide-up animate-stagger-1">
          Место,<br />
          <em>где рождаются</em><br />
          идеи
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mb-10 animate-slide-up animate-stagger-2">
          Форум, чат, новости и события для тех, кто строит цифровые продукты. Всё в одном месте, без лишнего шума.
        </p>
        <div className="flex flex-wrap gap-3 animate-slide-up animate-stagger-3">
          <button onClick={() => onNavigate("forum")} className="bg-foreground text-background px-6 py-3 text-sm font-medium rounded-sm hover:opacity-80 transition-opacity">
            Перейти к форуму
          </button>
          <button onClick={() => onNavigate("events")} className="border border-border px-6 py-3 text-sm font-medium rounded-sm hover:bg-secondary transition-colors">
            Ближайшие события
          </button>
        </div>
      </section>

      <section className="py-12 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-border">
          {stats.map((s, i) => (
            <div key={s.label} className="px-8 py-6 animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="text-3xl font-semibold mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 border-b border-border">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">Популярные темы</h2>
          <button onClick={() => onNavigate("forum")} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            Все темы <Icon name="ArrowRight" size={14} />
          </button>
        </div>
        <div className="space-y-0 divide-y divide-border">
          {FORUM_TOPICS.slice(0, 4).map((topic, i) => (
            <div key={topic.id} className="py-5 hover:bg-muted/40 -mx-6 px-6 cursor-pointer transition-colors animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="flex items-start gap-4">
                <CategoryBadge label={topic.category} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-snug mb-1 line-clamp-2">{topic.title}</p>
                  <p className="text-xs text-muted-foreground">{topic.author} · {topic.time}</p>
                </div>
                <div className="text-xs text-muted-foreground text-right flex-shrink-0">
                  <div>{topic.replies} отв.</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">Ближайшие события</h2>
          <button onClick={() => onNavigate("events")} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            Все события <Icon name="ArrowRight" size={14} />
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {EVENTS.slice(0, 2).map((ev, i) => (
            <div key={ev.id} className="border border-border rounded-sm p-6 hover-lift cursor-pointer animate-slide-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="flex items-start gap-5">
                <div className="text-center flex-shrink-0 w-12">
                  <div className="text-2xl font-bold leading-none">{ev.date.day}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{ev.date.month}</div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm mb-2">{ev.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Icon name="MapPin" size={12} />{ev.type}</span>
                    <span>{ev.spots > 0 ? `${ev.spots} мест` : "Мест нет"}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ForumPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const categories = ["Все", "Общее", "Дизайн", "Разработка", "Карьера", "Инструменты"];

  const filtered = FORUM_TOPICS.filter(t => {
    const matchCat = activeCategory === "Все" || t.category === activeCategory;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.author.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Форум</h2>
          <p className="text-sm text-muted-foreground">{FORUM_TOPICS.length} тем · 4 291 всего</p>
        </div>
        <button className="bg-foreground text-background px-5 py-2.5 text-sm font-medium rounded-sm hover:opacity-80 transition-opacity flex items-center gap-2 self-start md:self-auto">
          <Icon name="Plus" size={16} />
          Новая тема
        </button>
      </div>

      <div className="mb-5">
        <SearchBar onSearch={setSearch} value={search} placeholder="Поиск по темам и авторам..." />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-3 py-1.5 text-xs rounded-sm font-medium transition-colors ${activeCategory === c ? "bg-foreground text-background" : "border border-border hover:bg-secondary"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {search && (
        <p className="text-sm text-muted-foreground mb-4">
          Результаты для «{search}»: {filtered.length} {filtered.length === 1 ? "тема" : "темы"}
        </p>
      )}

      <div className="divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Icon name="SearchX" size={32} className="mx-auto mb-3 opacity-40" />
            <p>По запросу ничего не найдено</p>
          </div>
        ) : filtered.map((topic, i) => (
          <div key={topic.id} className="py-5 hover:bg-muted/40 -mx-6 px-6 cursor-pointer transition-colors group animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <CategoryBadge label={topic.category} />
                  {topic.pinned && <span className="text-xs text-muted-foreground flex items-center gap-1"><Icon name="Pin" size={10} />Закреплено</span>}
                </div>
                <p className="font-medium text-sm leading-snug mb-2 line-clamp-2">{topic.title}</p>
                <p className="text-xs text-muted-foreground">{topic.author} · {topic.time}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-medium">{topic.replies}</div>
                <div className="text-xs text-muted-foreground">ответов</div>
                <div className="text-xs text-muted-foreground mt-1">{topic.views} просм.</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const endRef = useRef<HTMLDivElement>(null);
  const channels = ["# общий", "# дизайн", "# разработка", "# инструменты", "# карьера"];
  const [activeChannel, setActiveChannel] = useState("# общий");

  const send = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      author: "Вы",
      avatar: "В",
      time: new Date().toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" }),
      text: message,
    }]);
    setMessage("");
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="animate-fade-in flex gap-6 h-[calc(100vh-180px)]">
      <div className="w-44 flex-shrink-0 hidden md:block">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">Каналы</p>
        <div className="space-y-0.5">
          {channels.map(c => (
            <button
              key={c}
              onClick={() => setActiveChannel(c)}
              className={`w-full text-left px-2 py-1.5 rounded-sm text-sm transition-colors ${activeChannel === c ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col border border-border rounded-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm font-medium">{activeChannel}</span>
          <span className="text-xs text-muted-foreground">6 участников онлайн</span>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg, i) => (
            <div key={msg.id} className="flex gap-3 animate-slide-up" style={{ animationDelay: `${i * 0.03}s` }}>
              <Avatar name={msg.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-medium">{msg.author}</span>
                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                </div>
                <p className="text-sm text-foreground/90 leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder={`Сообщение в ${activeChannel}`}
              className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-sm text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all"
            />
            <button onClick={send} className="bg-foreground text-background px-4 py-2.5 rounded-sm hover:opacity-80 transition-opacity">
              <Icon name="Send" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewsPage() {
  const [search, setSearch] = useState("");
  const filtered = NEWS_ITEMS.filter(n =>
    !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.excerpt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-1">Новости</h2>
        <p className="text-sm text-muted-foreground">Актуальное для сообщества</p>
      </div>

      <div className="mb-8">
        <SearchBar onSearch={setSearch} value={search} placeholder="Поиск по новостям..." />
      </div>

      {!search && (
        <div className="border border-border rounded-sm overflow-hidden mb-6 hover-lift cursor-pointer animate-slide-up">
          <div className="p-8 bg-foreground text-background">
            <CategoryBadge label="Технологии" />
            <h3 className="font-display text-3xl mt-4 mb-3 font-normal">{NEWS_ITEMS[0].title}</h3>
            <p className="text-background/70 text-sm line-clamp-2 mb-4">{NEWS_ITEMS[0].excerpt}</p>
            <div className="flex items-center gap-3 text-xs text-background/50">
              <span>{NEWS_ITEMS[0].author}</span>
              <span>·</span>
              <span>{NEWS_ITEMS[0].time}</span>
              <span>·</span>
              <span>{NEWS_ITEMS[0].reading} чтения</span>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-border">
        {(search ? filtered : filtered.slice(1)).map((item, i) => (
          <div key={item.id} className="py-6 hover:bg-muted/40 -mx-6 px-6 cursor-pointer transition-colors group animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CategoryBadge label={item.tag} />
                  <span className="text-xs text-muted-foreground">{item.reading} чтения</span>
                </div>
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{item.excerpt}</p>
                <p className="text-xs text-muted-foreground">{item.author} · {item.time}</p>
              </div>
              <Icon name="ArrowUpRight" size={16} className="text-muted-foreground flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <Icon name="SearchX" size={32} className="mx-auto mb-3 opacity-40" />
            <p>Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventsPage() {
  const [search, setSearch] = useState("");
  const filtered = EVENTS.filter(e =>
    !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-1">События</h2>
          <p className="text-sm text-muted-foreground">Апрель 2026</p>
        </div>
        <button className="bg-foreground text-background px-5 py-2.5 text-sm font-medium rounded-sm hover:opacity-80 transition-opacity flex items-center gap-2 self-start md:self-auto">
          <Icon name="Plus" size={16} />
          Предложить событие
        </button>
      </div>

      <div className="mb-8">
        <SearchBar onSearch={setSearch} value={search} placeholder="Поиск событий..." />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Icon name="SearchX" size={32} className="mx-auto mb-3 opacity-40" />
            <p>Ничего не найдено</p>
          </div>
        ) : filtered.map((ev, i) => (
          <div key={ev.id} className="border border-border rounded-sm p-6 hover-lift cursor-pointer animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="flex items-center gap-6">
              <div className="text-center w-14 flex-shrink-0">
                <div className="text-3xl font-bold leading-none">{ev.date.day}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{ev.date.month}</div>
              </div>
              <div className="w-px h-12 bg-border flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm mb-2">{ev.title}</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Icon name="MapPin" size={12} />{ev.type}</span>
                  <span className="flex items-center gap-1">
                    <Icon name="Users" size={12} />
                    {ev.spots === 0 ? "Мест нет" : `${ev.spots} из ${ev.total} мест`}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                {ev.spots === 0 ? (
                  <span className="text-xs px-3 py-1.5 border border-border rounded-sm text-muted-foreground">Закрыто</span>
                ) : (
                  <button className="text-xs px-3 py-1.5 bg-foreground text-background rounded-sm hover:opacity-80 transition-opacity">
                    Записаться
                  </button>
                )}
              </div>
            </div>
            {ev.spots > 0 && (
              <div className="mt-4">
                <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${((ev.total - ev.spots) / ev.total) * 100}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{ev.total - ev.spots} из {ev.total} зарегистрировались</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"posts" | "activity">("posts");
  const userPosts = FORUM_TOPICS.slice(0, 3);
  const filteredPosts = userPosts.filter(p =>
    !search || p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row items-start gap-8 pb-10 mb-10 border-b border-border">
        <Avatar name="М" size="lg" />
        <div className="flex-1">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-semibold mb-1">Максим Карпов</h2>
              <p className="text-muted-foreground text-sm">@maxim_k · Участник с марта 2024</p>
            </div>
            <button className="border border-border px-4 py-2 text-sm rounded-sm hover:bg-secondary transition-colors flex items-center gap-2">
              <Icon name="Pencil" size={14} />
              Редактировать
            </button>
          </div>
          <p className="text-sm mt-4 max-w-lg">Фронтенд-разработчик, люблю чистый код и хороший дизайн. Открыт к интересным проектам.</p>
          <div className="flex flex-wrap gap-6 mt-5">
            {[{ v: "47", l: "Тем" }, { v: "312", l: "Ответов" }, { v: "1 842", l: "Лайков" }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-xl font-semibold">{s.v}</div>
                <div className="text-xs text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-6 border-b border-border mb-6">
        {[{ id: "posts" as const, label: "Мои темы" }, { id: "activity" as const, label: "Активность" }].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === t.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-5">
        <SearchBar onSearch={setSearch} value={search} placeholder="Поиск по моим темам..." />
      </div>

      {activeTab === "posts" && (
        <div className="divide-y divide-border">
          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Icon name="SearchX" size={32} className="mx-auto mb-3 opacity-40" />
              <p>Ничего не найдено</p>
            </div>
          ) : filteredPosts.map((topic, i) => (
            <div key={topic.id} className="py-5 hover:bg-muted/40 -mx-6 px-6 cursor-pointer transition-colors group animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CategoryBadge label={topic.category} />
                  </div>
                  <p className="font-medium text-sm mb-1">{topic.title}</p>
                  <p className="text-xs text-muted-foreground">{topic.time} · {topic.replies} ответов · {topic.views} просмотров</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="space-y-3">
          {[
            { icon: "MessageSquare", text: "Ответил в теме «React vs Vue в 2026»", time: "4 часа назад" },
            { icon: "Heart", text: "Оценил тему «Тренды UI/UX»", time: "вчера" },
            { icon: "Calendar", text: "Записался на «Встреча фронтенд-разработчиков»", time: "2 дня назад" },
            { icon: "MessageCircle", text: "Написал в канал #разработка", time: "3 дня назад" },
          ].map((act, i) => (
            <div key={i} className="flex items-start gap-3 py-3 animate-slide-up" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="w-8 h-8 rounded-sm bg-muted flex items-center justify-center flex-shrink-0">
                <Icon name={act.icon} size={14} className="text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm">{act.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (p: Page) => {
    setPage(p);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage onNavigate={navigate} />;
      case "forum": return <ForumPage />;
      case "chat": return <ChatPage />;
      case "news": return <NewsPage />;
      case "events": return <EventsPage />;
      case "profile": return <ProfilePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => navigate("home")} className="font-display text-xl font-normal tracking-tight hover:opacity-70 transition-opacity">
            Forum<em>·</em>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`px-3 py-1.5 text-sm rounded-sm transition-colors ${page === item.id ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 rounded-sm hover:bg-secondary transition-colors">
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-slide-up">
            <div className="max-w-5xl mx-auto px-6 py-3 space-y-1">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm rounded-sm transition-colors ${page === item.id ? "bg-foreground text-background font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
                >
                  <Icon name={item.icon} size={16} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {renderPage()}
      </main>

      <footer className="border-t border-border mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg">Forum<em>·</em></span>
          <p className="text-xs text-muted-foreground">© 2026 Сообщество профессионалов</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Правила</a>
            <a href="#" className="hover:text-foreground transition-colors">Поддержка</a>
            <a href="#" className="hover:text-foreground transition-colors">О нас</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
