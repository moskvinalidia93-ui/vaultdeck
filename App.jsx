import React, { useState, useEffect, useMemo, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import {
  Sparkles,
  Shield,
  Plus,
  Layers,
  Store,
  Trophy,
  Palette,
  Lightbulb,
  Users,
  Key,
  Check,
  Copy,
  Lock,
  Unlock,
  Flame,
  Crown,
  Star,
  Gift,
  RefreshCw,
  Trash2,
  Eye,
  X,
  ChevronRight,
  Zap,
  Award,
  Search,
  Filter,
  PackageOpen,
  Coins,
  UserCheck,
  UserPlus,
  Sliders,
  Heart,
  ThumbsUp,
  Image as ImageIcon,
  Wand2,
  Upload,
  FileImage,
  Tv,
  Radio,
  Play,
  ExternalLink,
  Volume2,
  Send,
  UserCircle,
  Bell,
} from 'lucide-react';

// ==========================================
// 1. ИНИЦИАЛИЗАЦИЯ FIREBASE
// ==========================================
const firebaseConfig =
  typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : {
        apiKey: 'demo-key',
        authDomain: 'demo.firebaseapp.com',
        projectId: 'demo-project',
      };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'vaultdeck-private-app';

// ==========================================
// 2. КОНФИГУРАЦИЯ РЕДКОСТИ, ТЕМ И ЭФФЕКТОВ
// ==========================================
const RARITIES = {
  common: {
    id: 'common',
    label: 'Обычная',
    color: '#94a3b8',
    border: 'border-slate-500/50',
    bg: 'from-slate-800 to-slate-900',
    glow: 'shadow-slate-500/20',
    badge: 'bg-slate-700/80 text-slate-200 border-slate-500/40',
    points: 10,
    dust: 15,
    weight: 50,
  },
  rare: {
    id: 'rare',
    label: 'Редкая',
    color: '#38bdf8',
    border: 'border-sky-400/60',
    bg: 'from-sky-950 via-slate-900 to-slate-950',
    glow: 'shadow-sky-500/30',
    badge: 'bg-sky-950/90 text-sky-300 border-sky-400/50',
    points: 25,
    dust: 40,
    weight: 28,
  },
  epic: {
    id: 'epic',
    label: 'Эпическая',
    color: '#c084fc',
    border: 'border-purple-400/70',
    bg: 'from-purple-950 via-slate-900 to-slate-950',
    glow: 'shadow-purple-500/40',
    badge: 'bg-purple-950/90 text-purple-300 border-purple-400/50',
    points: 60,
    dust: 100,
    weight: 14,
  },
  legendary: {
    id: 'legendary',
    label: 'Легендарная',
    color: '#fbbf24',
    border: 'border-amber-400/80',
    bg: 'from-amber-950 via-stone-900 to-neutral-950',
    glow: 'shadow-amber-500/50',
    badge: 'bg-amber-950/90 text-amber-300 border-amber-400/60',
    points: 150,
    dust: 250,
    weight: 6,
  },
  limited: {
    id: 'limited',
    label: 'Лимитированная',
    color: '#10b981',
    border: 'border-emerald-400/90',
    bg: 'from-emerald-950 via-teal-950 to-neutral-950',
    glow: 'shadow-emerald-400/60',
    badge: 'bg-emerald-950/90 text-emerald-300 border-emerald-400/70',
    points: 300,
    dust: 500,
    weight: 2,
  },
};

const CARD_EFFECTS = {
  none: { id: 'none', name: 'Стандарт', price: 0, desc: 'Чистый классический вид без наложений' },
  holo: { id: 'holo', name: 'Призма-Голография', price: 150, desc: 'Радужный перелив при движении карты' },
  gold: { id: 'gold', name: 'Королевское Золото', price: 300, desc: 'Сияющая золотая окантовка и искры' },
  glitch: { id: 'glitch', name: 'Кибер-Матрица', price: 250, desc: 'Неоновая изумрудная сетка и сканлайны' },
};

const SITE_THEMES = {
  obsidian: {
    id: 'obsidian',
    name: 'Обсидиан и Изумруд',
    bgMain: 'bg-[#090b0e]',
    bgCard: 'bg-[#11151c]/90',
    bgElevated: 'bg-[#171d26]',
    border: 'border-emerald-500/20',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-500',
    accentHover: 'hover:bg-emerald-400',
    textMain: 'text-slate-100',
    textMuted: 'text-slate-400',
    gradientHero: 'from-emerald-950/40 via-[#0d1117] to-[#090b0e]',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Неоновый Киберпанк',
    bgMain: 'bg-[#090514]',
    bgCard: 'bg-[#130b29]/90',
    bgElevated: 'bg-[#1b103b]',
    border: 'border-fuchsia-500/25',
    accentText: 'text-fuchsia-400',
    accentBg: 'bg-fuchsia-600',
    accentHover: 'hover:bg-fuchsia-500',
    textMain: 'text-slate-100',
    textMuted: 'text-purple-300/70',
    gradientHero: 'from-fuchsia-950/40 via-[#0f0821] to-[#090514]',
  },
  royal: {
    id: 'royal',
    name: 'Королевское Золото',
    bgMain: 'bg-[#0c0a08]',
    bgCard: 'bg-[#17130e]/90',
    bgElevated: 'bg-[#211b14]',
    border: 'border-amber-500/25',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500',
    accentHover: 'hover:bg-amber-400',
    textMain: 'text-amber-50',
    textMuted: 'text-amber-200/60',
    gradientHero: 'from-amber-950/40 via-[#120e0a] to-[#0c0a08]',
  },
  light: {
    id: 'light',
    name: 'Светлый Минимализм',
    bgMain: 'bg-slate-100',
    bgCard: 'bg-white/95',
    bgElevated: 'bg-slate-50',
    border: 'border-slate-200',
    accentText: 'text-emerald-600',
    accentBg: 'bg-emerald-600',
    accentHover: 'hover:bg-emerald-500',
    textMain: 'text-slate-900',
    textMuted: 'text-slate-500',
    gradientHero: 'from-emerald-100/70 via-white to-slate-100',
  },
};

const ART_PRESETS = [
  { name: 'Изумрудный Ядерный Реактор', gradient: 'from-emerald-500 via-teal-700 to-slate-950', icon: '⚡' },
  { name: 'Золотой Феникс', gradient: 'from-amber-400 via-orange-600 to-stone-950', icon: '🔥' },
  { name: 'Кибер-Самурай', gradient: 'from-fuchsia-500 via-purple-800 to-indigo-950', icon: '⚔️' },
  { name: 'Ледяной Кристалл', gradient: 'from-cyan-400 via-blue-700 to-slate-950', icon: '❄️' },
  { name: 'Тёмная Материя', gradient: 'from-violet-600 via-slate-900 to-black', icon: '🌌' },
  { name: 'Королевский Артефакт', gradient: 'from-yellow-300 via-amber-600 to-neutral-950', icon: '👑' },
];

// Стартовые коллекции для наполнения при первом запуске
const SEED_COLLECTIONS = [
  {
    id: 'col_genesis',
    title: 'Хроники Основателей',
    description: 'Эксклюзивный стартовый набор для первых участников закрытого клуба VaultDeck.',
    season: 'Сезон 2026 • Alpha',
    creatorName: 'Владелец Клуба',
    coverGradient: 'from-emerald-600 via-teal-900 to-slate-950',
    coverIcon: '💎',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'col_cyber',
    title: 'Ночной Неон-Сити',
    description: 'Артефакты, хакеры и кибернетические реликвии ночных стримов.',
    season: 'Сезон 2026 • Cyber',
    creatorName: 'Kira_V',
    coverGradient: 'from-purple-600 via-fuchsia-900 to-slate-950',
    coverIcon: '🌆',
    createdAt: Date.now() - 86400000,
  },
];

const SEED_CARDS = [
  {
    id: 'card_01',
    collectionId: 'col_genesis',
    name: 'Ключ от Хранилища',
    rarity: 'limited',
    editionMax: 25,
    editionCurrent: 1,
    season: 'Сезон 2026',
    trigger: 'Инвайт Основателя',
    lore: 'Открывает двери в закрытую экосистему VaultDeck. Выдаётся только первым участникам.',
    artGradient: 'from-emerald-400 via-teal-700 to-slate-950',
    artIcon: '🗝️',
    imageUrl: '',
    author: 'VaultArchitect',
    price: 450,
  },
  {
    id: 'card_02',
    collectionId: 'col_genesis',
    name: 'Золотой Слиток Эфира',
    rarity: 'legendary',
    editionMax: 100,
    editionCurrent: 4,
    season: 'Сезон 2026',
    trigger: 'Награда за 10 000 баллов',
    lore: 'Символ абсолютной поддержки и удачи во время редких событий.',
    artGradient: 'from-amber-300 via-amber-600 to-stone-950',
    artIcon: '🏆',
    imageUrl: '',
    author: 'VaultArchitect',
    price: 300,
  },
  {
    id: 'card_03',
    collectionId: 'col_genesis',
    name: 'Хранитель Чата',
    rarity: 'epic',
    editionMax: 250,
    editionCurrent: 12,
    season: 'Сезон 2026',
    trigger: 'Команда !drop в чате',
    lore: 'Бдительный страж, следящий за порядком и атмосферой в уютном комьюнити.',
    artGradient: 'from-purple-500 via-indigo-800 to-slate-950',
    artIcon: '🛡️',
    imageUrl: '',
    author: 'VaultArchitect',
    price: 160,
  },
  {
    id: 'card_04',
    collectionId: 'col_genesis',
    name: 'Кристалл Энергии',
    rarity: 'rare',
    editionMax: 500,
    editionCurrent: 48,
    season: 'Сезон 2026',
    trigger: 'Ежедневный вход',
    lore: 'Питает голографические проекторы всех карточек в твоей витрине.',
    artGradient: 'from-sky-400 via-blue-700 to-slate-950',
    artIcon: '💠',
    imageUrl: '',
    author: 'VaultArchitect',
    price: 80,
  },
  {
    id: 'card_05',
    collectionId: 'col_genesis',
    name: 'Бронзовый Жетон Участника',
    rarity: 'common',
    editionMax: 1000,
    editionCurrent: 142,
    season: 'Сезон 2026',
    trigger: 'Базовый пак',
    lore: 'С этого жетона начинается путь каждого коллекционера.',
    artGradient: 'from-slate-500 via-slate-700 to-slate-950',
    artIcon: '🪙',
    imageUrl: '',
    author: 'VaultArchitect',
    price: 40,
  },
  {
    id: 'card_06',
    collectionId: 'col_cyber',
    name: 'Нейро-Визор Призрака',
    rarity: 'legendary',
    editionMax: 50,
    editionCurrent: 3,
    season: 'Сезон 2026',
    trigger: 'Секретный код стрима',
    lore: 'Позволяет видеть скрытые вероятности выпадения редких экземпляров.',
    artGradient: 'from-fuchsia-500 via-purple-800 to-slate-950',
    artIcon: '🥽',
    imageUrl: '',
    author: 'Kira_V',
    price: 320,
  },
  {
    id: 'card_07',
    collectionId: 'col_cyber',
    name: 'Катана Синтеза',
    rarity: 'epic',
    editionMax: 150,
    editionCurrent: 19,
    season: 'Сезон 2026',
    trigger: 'Победа в мини-игре',
    lore: 'Клинок, выкованный из чистого неонового света.',
    artGradient: 'from-rose-500 via-red-800 to-slate-950',
    artIcon: '⚔️',
    imageUrl: '',
    author: 'Kira_V',
    price: 150,
  },
  {
    id: 'card_08',
    collectionId: 'col_cyber',
    name: 'Чип Памяти v2.6',
    rarity: 'common',
    editionMax: 1000,
    editionCurrent: 210,
    season: 'Сезон 2026',
    trigger: 'Базовый пак',
    lore: 'Содержит архивные записи лучших моментов прошлых трансляций.',
    artGradient: 'from-teal-500 via-slate-800 to-slate-950',
    artIcon: '💾',
    imageUrl: '',
    author: 'Kira_V',
    price: 40,
  },
];

// ==========================================
// 3. КОМПОНЕНТ 3D-КАРТОЧКИ С ПАРАЛЛАКСОМ И ЭФФЕКТАМИ
// ==========================================
const CollectibleCard = ({
  card,
  count = 0,
  effect = 'none',
  onClick,
  size = 'md',
  isPinned = false,
  onTogglePin,
  showPrice = false,
}) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const rarityInfo = RARITIES[card.rarity] || RARITIES.common;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setTilt({ rotateX, rotateY, glareX, glareY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  };

  const sizeClasses =
    size === 'sm'
      ? 'w-full aspect-[3/4] text-xs'
      : size === 'lg'
      ? 'w-72 sm:w-80 aspect-[3/4]'
      : 'w-full aspect-[3/4]';

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: tilt.rotateX === 0 ? 'transform 0.4s ease-out' : 'transform 0.08s linear',
      }}
      className={`group relative rounded-2xl border-2 ${rarityInfo.border} bg-gradient-to-b ${rarityInfo.bg} shadow-xl ${rarityInfo.glow} cursor-pointer select-none overflow-hidden flex flex-col justify-between ${sizeClasses}`}
    >
      {/* Эффект: Королевское Золото */}
      {effect === 'gold' && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-amber-300/80 shadow-[inset_0_0_24px_rgba(251,191,36,0.45)] z-20" />
      )}

      {/* Эффект: Кибер-Матрица */}
      {effect === 'glitch' && (
        <div
          className="pointer-events-none absolute inset-0 opacity-35 z-20 mix-blend-screen"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(16,185,129,0.25) 0px, rgba(16,185,129,0.25) 1px, transparent 1px, transparent 4px)',
          }}
        />
      )}

      {/* Голографический блик */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background:
            effect === 'holo' || card.rarity === 'limited' || card.rarity === 'legendary'
              ? `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.38), rgba(16,185,129,0.22) 35%, rgba(192,132,252,0.2) 60%, transparent 80%)`
              : `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.22), transparent 65%)`,
        }}
      />

      {/* Верхняя шапка карты */}
      <div className="relative z-10 flex items-center justify-between p-2.5 gap-1">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${rarityInfo.badge}`}>
          {rarityInfo.label}
        </span>

        <div className="flex items-center gap-1">
          {count > 1 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500 text-slate-950 shadow">
              x{count}
            </span>
          )}
          {onTogglePin && count > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(card.id);
              }}
              title={isPinned ? 'Убрать с витрины' : 'На витрину'}
              className={`p-1 rounded-full transition ${
                isPinned
                  ? 'bg-amber-400 text-slate-950 shadow-md'
                  : 'bg-black/50 text-slate-300 hover:text-amber-300'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          )}
        </div>
      </div>

      {/* Арт-зона карты */}
      <div className="relative mx-2.5 my-1 flex-1 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
        {card.imageUrl ? (
          <img
            src={card.imageUrl}
            alt={card.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${
              card.artGradient || 'from-emerald-600 to-slate-900'
            } flex items-center justify-center relative`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_70%)]" />
            <span className="text-5xl sm:text-6xl drop-shadow-[0_6px_16px_rgba(0,0,0,0.65)] transition-transform duration-300 group-hover:scale-110">
              {card.artIcon || '✨'}
            </span>
          </div>
        )}

        {/* Тираж поверх арта снизу */}
        <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-white/10 text-[10px] font-mono text-slate-200">
          #{String(card.editionCurrent || 1).padStart(2, '0')}/{card.editionMax || 100}
        </div>
      </div>

      {/* Нижняя панель названия и описания */}
      <div className="relative z-10 p-2.5 pt-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        <h4 className="font-bold text-white text-sm leading-tight truncate">{card.name}</h4>
        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-300/80">
          <span className="truncate max-w-[65%]">{card.season || 'Сезон 2026'}</span>
          {showPrice ? (
            <span className="flex items-center gap-1 font-bold text-amber-400">
              <Coins className="w-3 h-3" /> {card.price || 100}
            </span>
          ) : (
            <span className="text-[10px] text-emerald-300/90 font-medium">
              +{rarityInfo.points} престижа
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. ГЛАВНОЕ ПРИЛОЖЕНИЕ VAULTDECK
// ==========================================
export default function App() {
  // Аутентификация и пользователь
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // Данные из Firestore
  const [collections, setCollections] = useState([]);
  const [cards, setCards] = useState([]);
  const [members, setMembers] = useState([]);
  const [invites, setInvites] = useState([]);
  const [ideas, setIdeas] = useState([]);

  // Текущий профиль и права доступа
  const [currentMember, setCurrentMember] = useState(null);
  const [inviteInput, setInviteInput] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');
  const [accessError, setAccessError] = useState('');

  // Навигация и UI-состояния
  const [activeTab, setActiveTab] = useState('collections'); // collections, my-cards, create, shop, prestige, ideas, access
  const [selectedCollectionId, setSelectedCollectionId] = useState('all');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [siteTheme, setSiteTheme] = useState('obsidian');
  const [toast, setToast] = useState(null);

  // Режим OBS Overlay (работает и по URL ?overlay=1, и по кнопке переключения внутри приложения)
  const [manualOverlayMode, setManualOverlayMode] = useState(false);
  const [chromaBg, setChromaBg] = useState('transparent'); // transparent | green | dark

  const isOverlayMode = useMemo(() => {
    if (manualOverlayMode) return true;
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    return params.get('overlay') === '1';
  }, [manualOverlayMode]);

  // Состояния входа зрителя по Twitch-нику (без обязательного инвайта)
  const [viewerLoginOpen, setViewerLoginOpen] = useState(false);
  const [twitchNickInput, setTwitchNickInput] = useState('');
  const [authorRequestNote, setAuthorRequestNote] = useState('');

  // Состояния OBS-виджета и анимации выпадения карты
  const [liveAlertDrop, setLiveAlertDrop] = useState(null);
  const [lastSeenAlertId, setLastSeenAlertId] = useState(null);
  const [manualAuthorNick, setManualAuthorNick] = useState('');
  const [dropTargetNick, setDropTargetNick] = useState('');
  const [dropCardId, setDropCardId] = useState('');
  const [overlaySoundEnabled, setOverlaySoundEnabled] = useState(true);

  // Модальные окна
  const [inspectCard, setInspectCard] = useState(null);
  const [packModalOpen, setPackModalOpen] = useState(false);
  const [openedCards, setOpenedCards] = useState([]);
  const [revealedIndices, setRevealedIndices] = useState([]);

  // Формы создания коллекции и карты
  const [newColTitle, setNewColTitle] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [newColSeason, setNewColSeason] = useState('Сезон 2026');
  const [newColPreset, setNewColPreset] = useState(0);
  const [newColCoverUrl, setNewColCoverUrl] = useState('');
  const [newColFileInfo, setNewColFileInfo] = useState(null);
  const [isColDragging, setIsColDragging] = useState(false);

  const [newCardColId, setNewCardColId] = useState('');
  const [newCardName, setNewCardName] = useState('');
  const [newCardRarity, setNewCardRarity] = useState('rare');
  const [newCardEdition, setNewCardEdition] = useState(50);
  const [newCardTrigger, setNewCardTrigger] = useState('Награда канала / Команда !drop');
  const [newCardLore, setNewCardLore] = useState('');
  const [newCardImageUrl, setNewCardImageUrl] = useState('');
  const [newCardFileInfo, setNewCardFileInfo] = useState(null);
  const [isCardDragging, setIsCardDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [newCardPreset, setNewCardPreset] = useState(0);
  const [newCardPrice, setNewCardPrice] = useState(120);

  const cardFileInputRef = useRef(null);
  const colFileInputRef = useRef(null);

  // Форма новой идеи
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaDesc, setNewIdeaDesc] = useState('');

  // Форма инвайта
  const [newInviteRole, setNewInviteRole] = useState('creator');
  const [newInviteNote, setNewInviteNote] = useState('');

  const theme = SITE_THEMES[siteTheme] || SITE_THEMES.obsidian;

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ==========================================
  // 5. FIREBASE AUTH (ПРАВИЛО 3: СНАЧАЛА АВТОРИЗАЦИЯ)
  // ==========================================
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Auth error:', err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // ==========================================
  // 6. ЗАГРУЗКА ДАННЫХ И ИНИЦИАЛИЗАЦИЯ КЛУБА
  // ==========================================
  useEffect(() => {
    if (!authReady || !firebaseUser) return;

    const colRef = collection(db, 'artifacts', appId, 'public', 'data', 'collections');
    const cardsRef = collection(db, 'artifacts', appId, 'public', 'data', 'cards');
    const membersRef = collection(db, 'artifacts', appId, 'public', 'data', 'members');
    const invitesRef = collection(db, 'artifacts', appId, 'public', 'data', 'invites');
    const ideasRef = collection(db, 'artifacts', appId, 'public', 'data', 'ideas');

    // Первичное наполнение базы, если она пуста
    const bootstrapClub = async () => {
      try {
        const metaDocRef = doc(db, 'artifacts', appId, 'public', 'data', 'meta', 'init');
        const metaSnap = await getDoc(metaDocRef);

        if (!metaSnap.exists()) {
          await setDoc(metaDocRef, { initialized: true, createdAt: Date.now() });
          for (const c of SEED_COLLECTIONS) {
            await setDoc(doc(colRef, c.id), c);
          }
          for (const card of SEED_CARDS) {
            await setDoc(doc(cardsRef, card.id), card);
          }
          // Создаём первый инвайт-код для друзей
          await setDoc(doc(invitesRef, 'VAULT-2026'), {
            code: 'VAULT-2026',
            role: 'creator',
            note: 'Стартовый код для друзей',
            usedBy: null,
            createdAt: Date.now(),
          });
          // Стартовая идея
          await addDoc(ideasRef, {
            title: 'Анимированные голографические рамки для Лимитированных карт',
            description: 'Добавить особый эффект перелива для карт тиражом до 25 штук.',
            author: 'Владелец Клуба',
            votes: 5,
            voters: [],
            createdAt: Date.now(),
          });
        }

        // Проверяем, зарегистрирован ли текущий пользователь в клубе
        const myMemberRef = doc(membersRef, firebaseUser.uid);
        const myMemberSnap = await getDoc(myMemberRef);

        if (!myMemberSnap.exists()) {
          // Первый вошедший пользователь автоматически становится Владельцем/Админом клуба
          const ownerCheckRef = doc(db, 'artifacts', appId, 'public', 'data', 'meta', 'owner');
          const ownerSnap = await getDoc(ownerCheckRef);

          if (!ownerSnap.exists()) {
            await setDoc(ownerCheckRef, { ownerUid: firebaseUser.uid });
            const newOwnerProfile = {
              uid: firebaseUser.uid,
              nickname: 'Владелец Хранилища',
              twitchLogin: 'vault_owner',
              role: 'owner', // owner | creator | collector
              approved: true,
              authorRequest: null,
              coins: 500,
              dust: 120,
              inventory: {
                card_01: 1,
                card_03: 1,
                card_05: 2,
              },
              pinnedCards: ['card_01', 'card_03'],
              cardEffects: {
                card_01: 'holo',
              },
              unlockedEffects: ['none', 'holo'],
              lastDailyClaim: 0,
              joinedAt: Date.now(),
            };
            await setDoc(myMemberRef, newOwnerProfile);
          } else {
            // Любой новый посетитель сразу получает профиль зрителя (коллекционера) без блокировки входа
            const guestNick = `Зритель_${firebaseUser.uid.slice(0, 4)}`;
            await setDoc(myMemberRef, {
              uid: firebaseUser.uid,
              nickname: guestNick,
              twitchLogin: guestNick.toLowerCase(),
              role: 'collector',
              approved: true,
              authorRequest: null,
              coins: 200,
              dust: 0,
              inventory: { card_05: 1 },
              pinnedCards: ['card_05'],
              cardEffects: {},
              unlockedEffects: ['none'],
              lastDailyClaim: 0,
              joinedAt: Date.now(),
            });
          }
        }
      } catch (err) {
        console.error('Bootstrap error:', err);
      }
    };

    bootstrapClub();

    const unsubCols = onSnapshot(
      colRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setCollections(list);
        if (list.length > 0 && !newCardColId) {
          setNewCardColId(list[0].id);
        }
      },
      (err) => console.error('Collections snapshot error:', err)
    );

    const unsubCards = onSnapshot(
      cardsRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCards(list);
        if (list.length > 0 && !dropCardId) {
          setDropCardId(list[0].id);
        }
      },
      (err) => console.error('Cards snapshot error:', err)
    );

    // Подписка на поток живых анимаций выпадения карт для OBS Overlay
    const alertsRef = doc(db, 'artifacts', appId, 'public', 'data', 'meta', 'liveAlert');
    const unsubAlerts = onSnapshot(
      alertsRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (data?.alertId && data.alertId !== lastSeenAlertId && Date.now() - (data.triggeredAt || 0) < 15000) {
            setLastSeenAlertId(data.alertId);
            setLiveAlertDrop(data);
            playDropChime(data.card?.rarity || 'rare');
            setTimeout(() => {
              setLiveAlertDrop((prev) => (prev?.alertId === data.alertId ? null : prev));
            }, 6500);
          }
        }
      },
      (err) => console.error('Live alert snapshot error:', err)
    );

    const unsubMembers = onSnapshot(
      membersRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMembers(list);
        const me = list.find((m) => m.uid === firebaseUser.uid);
        setCurrentMember(me || null);
      },
      (err) => console.error('Members snapshot error:', err)
    );

    const unsubInvites = onSnapshot(
      invitesRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setInvites(list);
      },
      (err) => console.error('Invites snapshot error:', err)
    );

    const unsubIdeas = onSnapshot(
      ideasRef,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (b.votes || 0) - (a.votes || 0));
        setIdeas(list);
      },
      (err) => console.error('Ideas snapshot error:', err)
    );

    return () => {
      unsubCols();
      unsubCards();
      unsubMembers();
      unsubInvites();
      unsubIdeas();
      unsubAlerts();
    };
  }, [authReady, firebaseUser, lastSeenAlertId]);

  // Синтез звукового эффекта при выпадении карты в OBS-виджете
  const playDropChime = (rarity = 'rare') => {
    if (!overlaySoundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes =
        rarity === 'limited' || rarity === 'legendary'
          ? [523.25, 659.25, 783.99, 1046.5]
          : [440, 554.37, 659.25];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = rarity === 'limited' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.11);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.11 + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.11);
        osc.stop(ctx.currentTime + idx * 0.11 + 0.6);
      });
    } catch (e) {
      // Игнорируем блокировку автовоспроизведения звука браузером до клика
    }
  };

  // ==========================================
  // 7. ВЫЧИСЛЯЕМЫЕ ДАННЫЕ (ПРЕСТИЖ, РЕЙТИНГ, ФИЛЬТРЫ)
  // ==========================================
  const calculatePrestige = (member) => {
    if (!member || !member.inventory) return { score: 0, level: 1, title: 'Новичок' };
    let score = 0;
    Object.entries(member.inventory).forEach(([cardId, count]) => {
      if (count > 0) {
        const card = cards.find((c) => c.id === cardId);
        if (card) {
          const r = RARITIES[card.rarity] || RARITIES.common;
          score += r.points + (count - 1) * Math.round(r.points * 0.25);
        }
      }
    });
    const level = Math.floor(score / 150) + 1;
    let title = 'Искатель';
    if (level >= 10) title = 'Хранитель Легенд';
    else if (level >= 6) title = 'Магистр Колоды';
    else if (level >= 3) title = 'Коллекционер';
    return { score, level, title };
  };

  const myPrestige = useMemo(() => calculatePrestige(currentMember), [currentMember, cards]);

  const leaderboard = useMemo(() => {
    return members
      .filter((m) => m.approved)
      .map((m) => {
        const p = calculatePrestige(m);
        const uniqueCount = Object.values(m.inventory || {}).filter((c) => c > 0).length;
        return { ...m, prestige: p, uniqueCount };
      })
      .sort((a, b) => b.prestige.score - a.prestige.score);
  }, [members, cards]);

  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (selectedCollectionId !== 'all' && card.collectionId !== selectedCollectionId) return false;
      if (rarityFilter !== 'all' && card.rarity !== rarityFilter) return false;
      if (searchQuery.trim() && !card.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [cards, selectedCollectionId, rarityFilter, searchQuery]);

  const myOwnedCardsList = useMemo(() => {
    if (!currentMember?.inventory) return [];
    return cards.filter((c) => (currentMember.inventory[c.id] || 0) > 0);
  }, [cards, currentMember]);

  // ==========================================
  // 8. ДЕЙСТВИЯ ПОЛЬЗОВАТЕЛЯ И АДМИНА
  // ==========================================

  // Обработка и автоматическое сжатие локального изображения в компактный Data URL
  const processUploadedImage = (file, target = 'card') => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Пожалуйста, выберите файл изображения (PNG, JPG, WEBP, GIF)', 'error');
      return;
    }

    setIsProcessingImage(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxSide = 640;
        let width = img.width;
        let height = img.height;

        if (width > maxSide || height > maxSide) {
          if (width > height) {
            height = Math.round((height * maxSide) / width);
            width = maxSide;
          } else {
            width = Math.round((width * maxSide) / height);
            height = maxSide;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Сохраняем прозрачность для PNG/WEBP или сжимаем в качественный JPEG/WEBP
        const outputMime = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(outputMime, 0.82);

        const info = {
          name: file.name,
          dimensions: `${width}×${height}px`,
          sizeKb: Math.round((compressedDataUrl.length * 3) / 4 / 1024),
        };

        if (target === 'card') {
          setNewCardImageUrl(compressedDataUrl);
          setNewCardFileInfo(info);
        } else {
          setNewColCoverUrl(compressedDataUrl);
          setNewColFileInfo(info);
        }

        setIsProcessingImage(false);
        showToast(`Изображение «${file.name}» загружено и оптимизировано!`);
      };

      img.onerror = () => {
        setIsProcessingImage(false);
        showToast('Не удалось прочитать изображение', 'error');
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      setIsProcessingImage(false);
      showToast('Ошибка при чтении файла', 'error');
    };

    reader.readAsDataURL(file);
  };

  // Привязка / поиск профиля зрителя по Twitch-нику
  const handleTwitchViewerLogin = async (e) => {
    e.preventDefault();
    const cleanNick = twitchNickInput.trim().replace(/^@/, '');
    if (!cleanNick) return;

    try {
      // Ищем существующий профиль с таким же Twitch-ником
      const existingProfile = members.find(
        (m) =>
          m.nickname?.toLowerCase() === cleanNick.toLowerCase() ||
          m.twitchLogin?.toLowerCase() === cleanNick.toLowerCase()
      );

      if (existingProfile && existingProfile.uid !== firebaseUser.uid) {
        // Синхронизируем найденную коллекцию зрителя с текущей сессией
        await setDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'members', firebaseUser.uid),
          {
            ...currentMember,
            nickname: existingProfile.nickname,
            twitchLogin: cleanNick.toLowerCase(),
            role: existingProfile.role === 'owner' ? currentMember.role : existingProfile.role,
            coins: Math.max(currentMember?.coins || 0, existingProfile.coins || 0),
            inventory: { ...(existingProfile.inventory || {}), ...(currentMember?.inventory || {}) },
            pinnedCards: existingProfile.pinnedCards || currentMember?.pinnedCards || [],
          },
          { merge: true }
        );
        showToast(`Профиль Twitch @${existingProfile.nickname} найден и загружен!`);
      } else {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', firebaseUser.uid), {
          nickname: cleanNick,
          twitchLogin: cleanNick.toLowerCase(),
        });
        showToast(`Вы вошли как @${cleanNick}`);
      }
      setViewerLoginOpen(false);
    } catch (err) {
      console.error(err);
      showToast('Не удалось обновить профиль Twitch', 'error');
    }
  };

  // Запрос прав автора от зрителя (Владелец увидит заявку в панели управления)
  const handleRequestAuthorAccess = async (e) => {
    e.preventDefault();
    if (!currentMember) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', firebaseUser.uid), {
        authorRequest: {
          note: authorRequestNote.trim() || 'Хочу создавать свои коллекции карточек',
          requestedAt: Date.now(),
        },
      });
      setAuthorRequestNote('');
      showToast('Заявка на права автора отправлена Владельцу!');
    } catch (err) {
      console.error(err);
    }
  };

  // Прямая выдача прав автора по Twitch-нику (только Владелец)
  const handleGrantCreatorByNick = async (e) => {
    e.preventDefault();
    if (currentMember?.role !== 'owner') return;
    const targetNick = manualAuthorNick.trim().replace(/^@/, '');
    if (!targetNick) return;

    try {
      const existing = members.find(
        (m) =>
          m.nickname?.toLowerCase() === targetNick.toLowerCase() ||
          m.twitchLogin?.toLowerCase() === targetNick.toLowerCase()
      );

      if (existing) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', existing.uid), {
          role: 'creator',
          approved: true,
          authorRequest: null,
        });
        showToast(`Пользователю @${existing.nickname} выданы права Автора!`);
      } else {
        // Предварительно создаём профиль-слот по Twitch-нику с правами Автора
        const preUid = `twitch_${targetNick.toLowerCase()}`;
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', preUid), {
          uid: preUid,
          nickname: targetNick,
          twitchLogin: targetNick.toLowerCase(),
          role: 'creator',
          approved: true,
          authorRequest: null,
          coins: 300,
          dust: 50,
          inventory: { card_05: 1 },
          pinnedCards: ['card_05'],
          cardEffects: {},
          unlockedEffects: ['none'],
          lastDailyClaim: 0,
          joinedAt: Date.now(),
        });
        showToast(`Создан слот Автора для @${targetNick}. Когда он зайдёт по нику, права активируются!`);
      }
      setManualAuthorNick('');
    } catch (err) {
      console.error(err);
    }
  };

  // Запуск живой анимации выпадения карты (и выдача карты зрителю по желанию)
  const handleTriggerLiveDrop = async ({ cardId, recipientNick, giveCardToUser = false }) => {
    const card = cards.find((c) => c.id === cardId) || cards[0];
    if (!card) return;
    const cleanRecipient = (recipientNick || currentMember?.nickname || 'Зритель').trim().replace(/^@/, '');

    try {
      // Если выбрана выдача карты конкретному зрителю — начисляем её в его инвентарь
      if (giveCardToUser && cleanRecipient) {
        const targetMember = members.find(
          (m) =>
            m.nickname?.toLowerCase() === cleanRecipient.toLowerCase() ||
            m.twitchLogin?.toLowerCase() === cleanRecipient.toLowerCase()
        );
        if (targetMember) {
          const updatedInv = { ...(targetMember.inventory || {}) };
          updatedInv[card.id] = (updatedInv[card.id] || 0) + 1;
          await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', targetMember.uid), {
            inventory: updatedInv,
          });
        }
      }

      // Публикуем событие в Firestore, чтобы OBS Overlay мгновенно проиграл анимацию
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'meta', 'liveAlert'), {
        alertId: `drop_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        recipient: cleanRecipient,
        card: {
          id: card.id,
          name: card.name,
          rarity: card.rarity,
          season: card.season || 'Сезон 2026',
          editionMax: card.editionMax || 100,
          editionCurrent: card.editionCurrent || 1,
          imageUrl: card.imageUrl || '',
          artGradient: card.artGradient || 'from-emerald-500 to-slate-900',
          artIcon: card.artIcon || '✨',
        },
        triggeredAt: Date.now(),
      });

      showToast(`Анимация выпадения «${card.name}» отправлена в OBS-виджет!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Генерация и скачивание автономного HTML-файла для OBS Studio (Local File Browser Source)
  const handleDownloadObsOverlayFile = () => {
    const serializedConfig = JSON.stringify(firebaseConfig);
    const serializedAppId = JSON.stringify(appId);

    const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VaultDeck OBS Overlay</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: transparent !important;
      overflow: hidden;
      font-family: 'Inter', system-ui, sans-serif;
      user-select: none;
    }
    @keyframes dropIn {
      0% { opacity: 0; transform: scale(0.4) translateY(80px) rotateY(-35deg); }
      55% { opacity: 1; transform: scale(1.06) translateY(-10px) rotateY(8deg); }
      75% { transform: scale(0.98) translateY(0px) rotateY(-4deg); }
      100% { opacity: 1; transform: scale(1) translateY(0px) rotateY(0deg); }
    }
    @keyframes floatHolo {
      0%, 100% { transform: perspective(900px) rotateX(4deg) rotateY(-8deg) translateY(0px); }
      50% { transform: perspective(900px) rotateX(-4deg) rotateY(8deg) translateY(-10px); }
    }
    @keyframes fadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.85) translateY(-40px); }
    }
    .animate-card-enter {
      animation: dropIn 0.75s cubic-bezier(0.22, 1, 0.36, 1) forwards, floatHolo 3.2s ease-in-out 0.75s infinite;
    }
    .animate-card-exit {
      animation: fadeOut 0.55s ease-in forwards;
    }
  </style>
</head>
<body class="flex items-center justify-center min-h-screen">
  <div id="alert-root" class="hidden flex-col items-center justify-center p-8"></div>

  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
    import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
    import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

    const firebaseConfig = ${serializedConfig};
    const appId = ${serializedAppId};

    const RARITIES = {
      common: { label: 'Обычная', border: '#64748b', glow: 'rgba(100,116,139,0.45)', bg: 'linear-gradient(180deg,#1e293b,#0f172a)' },
      rare: { label: 'Редкая', border: '#38bdf8', glow: 'rgba(56,189,248,0.6)', bg: 'linear-gradient(180deg,#082f49,#0f172a)' },
      epic: { label: 'Эпическая', border: '#c084fc', glow: 'rgba(192,132,252,0.65)', bg: 'linear-gradient(180deg,#3b0764,#0f172a)' },
      legendary: { label: 'Легендарная', border: '#fbbf24', glow: 'rgba(251,191,36,0.75)', bg: 'linear-gradient(180deg,#451a03,#0c0a09)' },
      limited: { label: 'Лимитированная', border: '#10b981', glow: 'rgba(16,185,129,0.85)', bg: 'linear-gradient(180deg,#022c22,#090d16)' }
    };

    const playSound = (rarity) => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const notes = (rarity === 'limited' || rarity === 'legendary')
          ? [523.25, 659.25, 783.99, 1046.5]
          : [440, 554.37, 659.25];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = rarity === 'limited' ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.11);
          gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.11);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.11 + 0.65);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.11);
          osc.stop(ctx.currentTime + idx * 0.11 + 0.7);
        });
      } catch (e) {}
    };

    const root = document.getElementById('alert-root');
    let lastAlertId = null;
    let hideTimer = null;

    function showCardAlert(data) {
      if (!data || !data.card) return;
      const card = data.card;
      const r = RARITIES[card.rarity] || RARITIES.rare;

      if (hideTimer) clearTimeout(hideTimer);
      playSound(card.rarity);

      const artHtml = card.imageUrl
        ? \`<img src="\${card.imageUrl}" style="width:100%;height:100%;object-fit:cover;" />\`
        : \`<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:78px;background:radial-gradient(circle,rgba(16,185,129,0.35),#090b0e);">\${card.artIcon || '✨'}</div>\`;

      root.className = "flex flex-col items-center justify-center p-8 animate-card-enter";
      root.innerHTML = \`
        <div style="margin-bottom:16px;padding:10px 24px;border-radius:999px;background:rgba(9,11,14,0.92);border:2px solid \${r.border};box-shadow:0 0 35px \${r.glow};text-align:center;">
          <div style="font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;color:\${r.border};">✨ Выпала карточка VaultDeck!</div>
          <div style="font-size:20px;font-weight:900;color:#ffffff;margin-top:2px;">@\${data.recipient || 'Зритель'}</div>
        </div>

        <div style="width:310px;height:420px;border-radius:24px;border:3px solid \${r.border};background:\${r.bg};box-shadow:0 20px 60px rgba(0,0,0,0.9), 0 0 45px \${r.glow};display:flex;flex-direction:column;justify-content:space-between;padding:14px;position:relative;overflow:hidden;">
          <div style="display:flex;justify-content:space-between;align-items:center;z-index:2;">
            <span style="padding:4px 12px;border-radius:999px;font-size:11px;font-weight:800;text-transform:uppercase;background:rgba(0,0,0,0.65);color:\${r.border};border:1px solid \${r.border};">\${r.label}</span>
            <span style="font-family:monospace;font-size:12px;color:#e2e8f0;background:rgba(0,0,0,0.6);padding:2px 8px;border-radius:8px;">#\${String(card.editionCurrent || 1).padStart(2,'0')}/\${card.editionMax || 100}</span>
          </div>

          <div style="flex:1;margin:10px 0;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.15);position:relative;">
            \${artHtml}
          </div>

          <div style="z-index:2;">
            <div style="font-size:18px;font-weight:900;color:#ffffff;line-height:1.2;">\${card.name}</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:4px;">\${card.season || 'Сезон 2026'}</div>
          </div>
        </div>
      \`;

      hideTimer = setTimeout(() => {
        root.className = "flex flex-col items-center justify-center p-8 animate-card-exit";
        setTimeout(() => {
          root.className = "hidden";
        }, 550);
      }, 6000);
    }

    async function startOverlay() {
      try {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        await signInAnonymously(auth);
        const db = getFirestore(app);
        const alertRef = doc(db, 'artifacts', appId, 'public', 'data', 'meta', 'liveAlert');

        onSnapshot(alertRef, (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            if (data && data.alertId && data.alertId !== lastAlertId && Date.now() - (data.triggeredAt || 0) < 20000) {
              lastAlertId = data.alertId;
              showCardAlert(data);
            }
          }
        });
      } catch (err) {
        console.error("OBS Overlay connection error:", err);
      }
    }

    startOverlay();
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vaultdeck-obs-overlay.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Файл vaultdeck-obs-overlay.html скачан! Добавьте его в OBS -> Браузер -> Локальный файл.');
  };

  // Копирование текста с надёжным фолбэком для iFrame
  const copyTextSafe = (text, successMsg) => {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showToast(successMsg);
    } catch (e) {
      navigator.clipboard?.writeText(text);
      showToast(successMsg);
    }
  };

  // Вход по инвайт-коду Автора (если Владелец выдал код)
  const handleRedeemInvite = async (e) => {
    e.preventDefault();
    setAccessError('');
    const code = inviteInput.trim().toUpperCase();
    const nick = nicknameInput.trim() || currentMember?.nickname || `Автор_${firebaseUser.uid.slice(0, 4)}`;

    if (!code) {
      setAccessError('Введите пригласительный код.');
      return;
    }

    const foundInvite = invites.find((inv) => inv.code === code && !inv.usedBy);
    if (!foundInvite) {
      setAccessError('Неверный или уже использованный инвайт-код.');
      return;
    }

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'invites', foundInvite.id), {
        usedBy: firebaseUser.uid,
        usedByNick: nick,
        usedAt: Date.now(),
      });

      await setDoc(
        doc(db, 'artifacts', appId, 'public', 'data', 'members', firebaseUser.uid),
        {
          uid: firebaseUser.uid,
          nickname: nick,
          twitchLogin: nick.toLowerCase(),
          role: foundInvite.role || 'creator',
          approved: true,
          authorRequest: null,
        },
        { merge: true }
      );

      setInviteInput('');
      showToast('Код активирован! Вам открыты права Автора коллекций.');
    } catch (err) {
      console.error(err);
      setAccessError('Ошибка при активации кода.');
    }
  };

  // Генерация нового инвайт-кода (Админ/Владелец)
  const handleCreateInvite = async (e) => {
    e.preventDefault();
    if (currentMember?.role !== 'owner') return;
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    const code = `VD-${randomPart}`;

    try {
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'invites', code), {
        code,
        role: newInviteRole,
        note: newInviteNote.trim() || 'Приглашение в клуб',
        usedBy: null,
        createdAt: Date.now(),
      });
      setNewInviteNote('');
      showToast(`Инвайт-код ${code} создан!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Изменение роли или доступа участника
  const handleUpdateMember = async (targetUid, updates) => {
    if (currentMember?.role !== 'owner') return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', targetUid), updates);
      showToast('Права участника обновлены');
    } catch (err) {
      console.error(err);
    }
  };

  // Создание новой коллекции
  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newColTitle.trim()) return;
    const preset = ART_PRESETS[newColPreset] || ART_PRESETS[0];

    try {
      const colDoc = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'collections'), {
        title: newColTitle.trim(),
        description: newColDesc.trim() || 'Авторская коллекция закрытого клуба.',
        season: newColSeason.trim() || 'Сезон 2026',
        creatorUid: firebaseUser.uid,
        creatorName: currentMember.nickname,
        coverImageUrl: newColCoverUrl.trim(),
        coverGradient: preset.gradient,
        coverIcon: preset.icon,
        createdAt: Date.now(),
      });
      setNewCardColId(colDoc.id);
      setNewColTitle('');
      setNewColDesc('');
      setNewColCoverUrl('');
      setNewColFileInfo(null);
      showToast('Коллекция успешно создана!');
    } catch (err) {
      console.error(err);
    }
  };

  // Создание новой карточки
  const handleCreateCard = async (e) => {
    e.preventDefault();
    if (!newCardName.trim() || !newCardColId) return;
    const preset = ART_PRESETS[newCardPreset] || ART_PRESETS[0];

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'cards'), {
        collectionId: newCardColId,
        name: newCardName.trim(),
        rarity: newCardRarity,
        editionMax: Number(newCardEdition) || 50,
        editionCurrent: 1,
        season: newColSeason || 'Сезон 2026',
        trigger: newCardTrigger.trim() || 'Эксклюзивный дроп',
        lore: newCardLore.trim() || 'Редкий экземпляр из приватного хранилища.',
        imageUrl: newCardImageUrl.trim(),
        artGradient: preset.gradient,
        artIcon: preset.icon,
        author: currentMember.nickname,
        price: Number(newCardPrice) || 100,
        createdAt: Date.now(),
      });

      setNewCardName('');
      setNewCardLore('');
      setNewCardImageUrl('');
      setNewCardFileInfo(null);
      showToast('Карточка добавлена в коллекцию!');
    } catch (err) {
      console.error(err);
    }
  };

  // Открытие пака (3 случайные карты с весами редкости)
  const handleOpenPack = async (packType = 'standard') => {
    const cost = packType === 'elite' ? 250 : 100;
    if ((currentMember?.coins || 0) < cost) {
      showToast('Недостаточно монет для открытия пака!', 'error');
      return;
    }
    if (cards.length === 0) return;

    const pulled = [];
    for (let i = 0; i < 3; i++) {
      // Взвешенный выбор редкости
      const roll = Math.random() * 100;
      let targetRarity = 'common';
      if (packType === 'elite') {
        if (roll < 12) targetRarity = 'limited';
        else if (roll < 35) targetRarity = 'legendary';
        else if (roll < 70) targetRarity = 'epic';
        else targetRarity = 'rare';
      } else {
        if (roll < 3) targetRarity = 'limited';
        else if (roll < 10) targetRarity = 'legendary';
        else if (roll < 25) targetRarity = 'epic';
        else if (roll < 55) targetRarity = 'rare';
        else targetRarity = 'common';
      }

      const pool = cards.filter((c) => c.rarity === targetRarity);
      const chosenPool = pool.length > 0 ? pool : cards;
      const randomCard = chosenPool[Math.floor(Math.random() * chosenPool.length)];
      pulled.push(randomCard);
    }

    // Обновляем инвентарь и монеты
    const updatedInventory = { ...(currentMember.inventory || {}) };
    pulled.forEach((c) => {
      updatedInventory[c.id] = (updatedInventory[c.id] || 0) + 1;
    });

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', firebaseUser.uid), {
        coins: currentMember.coins - cost,
        inventory: updatedInventory,
      });
      setOpenedCards(pulled);
      setRevealedIndices([]);
      setPackModalOpen(true);

      // Если выпала Эпическая, Легендарная или Лимитированная карта — автоматически шлём алерт в OBS-оверлей
      const bestCard = pulled.find((c) => ['limited', 'legendary', 'epic'].includes(c.rarity));
      if (bestCard) {
        handleTriggerLiveDrop({
          cardId: bestCard.id,
          recipientNick: currentMember.nickname,
          giveCardToUser: false,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Прямая покупка карты в магазине
  const handleBuySingleCard = async (card) => {
    const price = card.price || 100;
    if ((currentMember?.coins || 0) < price) {
      showToast('Недостаточно монет!', 'error');
      return;
    }

    const updatedInventory = { ...(currentMember.inventory || {}) };
    updatedInventory[card.id] = (updatedInventory[card.id] || 0) + 1;

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', firebaseUser.uid), {
        coins: currentMember.coins - price,
        inventory: updatedInventory,
      });
      showToast(`Карта «${card.name}» добавлена в вашу коллекцию!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Переработка дубликата в монеты
  const handleRecycleDuplicate = async (card) => {
    const count = currentMember?.inventory?.[card.id] || 0;
    if (count <= 1) return;

    const rarityInfo = RARITIES[card.rarity] || RARITIES.common;
    const updatedInventory = { ...currentMember.inventory, [card.id]: count - 1 };

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', firebaseUser.uid), {
        coins: (currentMember.coins || 0) + rarityInfo.dust,
        inventory: updatedInventory,
      });
      showToast(`Дубликат переработан: +${rarityInfo.dust} монет!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Ежедневный бонус
  const handleClaimDaily = async () => {
    const now = Date.now();
    const cooldown = 12 * 60 * 60 * 1000; // 12 часов
    if (now - (currentMember?.lastDailyClaim || 0) < cooldown) {
      showToast('Бонус уже получен! Возвращайтесь позже.', 'error');
      return;
    }

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', firebaseUser.uid), {
        coins: (currentMember.coins || 0) + 200,
        lastDailyClaim: now,
      });
      showToast('Получен ежедневный бонус: +200 монет!');
    } catch (err) {
      console.error(err);
    }
  };

  // Закрепление на витрине (до 4 карт)
  const handleTogglePin = async (cardId) => {
    const pinned = currentMember?.pinnedCards || [];
    let nextPinned;
    if (pinned.includes(cardId)) {
      nextPinned = pinned.filter((id) => id !== cardId);
    } else {
      if (pinned.length >= 4) {
        showToast('На витрине можно закрепить максимум 4 карты', 'error');
        return;
      }
      nextPinned = [...pinned, cardId];
    }

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', firebaseUser.uid), {
        pinnedCards: nextPinned,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Применение визуального эффекта к карте
  const handleApplyCardEffect = async (cardId, effectId) => {
    const effectObj = CARD_EFFECTS[effectId];
    const unlocked = currentMember?.unlockedEffects || ['none'];
    const isUnlocked = unlocked.includes(effectId);

    if (!isUnlocked && (currentMember?.coins || 0) < effectObj.price) {
      showToast('Недостаточно монет для разблокировки эффекта!', 'error');
      return;
    }

    const nextEffects = { ...(currentMember.cardEffects || {}), [cardId]: effectId };
    const nextUnlocked = isUnlocked ? unlocked : [...unlocked, effectId];
    const nextCoins = isUnlocked ? currentMember.coins : currentMember.coins - effectObj.price;

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'members', firebaseUser.uid), {
        cardEffects: nextEffects,
        unlockedEffects: nextUnlocked,
        coins: nextCoins,
      });
      showToast(`Эффект «${effectObj.name}» применён!`);
    } catch (err) {
      console.error(err);
    }
  };

  // Создание новой идеи
  const handleCreateIdea = async (e) => {
    e.preventDefault();
    if (!newIdeaTitle.trim()) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'ideas'), {
        title: newIdeaTitle.trim(),
        description: newIdeaDesc.trim(),
        author: currentMember?.nickname || 'Участник',
        votes: 1,
        voters: [firebaseUser.uid],
        createdAt: Date.now(),
      });
      setNewIdeaTitle('');
      setNewIdeaDesc('');
      showToast('Идея добавлена на голосование!');
    } catch (err) {
      console.error(err);
    }
  };

  // Голосование за идею
  const handleVoteIdea = async (idea) => {
    const voters = idea.voters || [];
    const hasVoted = voters.includes(firebaseUser.uid);
    const nextVoters = hasVoted
      ? voters.filter((id) => id !== firebaseUser.uid)
      : [...voters, firebaseUser.uid];
    const nextVotes = hasVoted ? Math.max(0, (idea.votes || 1) - 1) : (idea.votes || 0) + 1;

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'ideas', idea.id), {
        voters: nextVoters,
        votes: nextVotes,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // 9. ЭКРАН ЗАГРУЗКИ И РЕЖИМ OBS OVERLAY
  // ==========================================
  if (!authReady || !currentMember) {
    return (
      <div className="min-h-screen bg-[#090b0e] text-slate-100 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-spin mb-4">
          <RefreshCw className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-slate-300">Загрузка хранилища VaultDeck...</p>
      </div>
    );
  }

  // Прозрачный экран специально для OBS Browser Source (?overlay=1) или встроенного режима захвата
  if (isOverlayMode) {
    const bgClass =
      chromaBg === 'green'
        ? 'bg-[#00ff00]'
        : chromaBg === 'dark'
        ? 'bg-[#090b0e]'
        : 'bg-transparent';

    return (
      <div className={`min-h-screen w-full ${bgClass} flex flex-col items-center justify-center overflow-hidden p-6 select-none relative`}>
        {/* Панель управления сверху (скрывается при отсутствии наведения мыши, чтобы не мешать в OBS) */}
        <div className="fixed top-4 left-4 right-4 z-50 flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-white/15 opacity-20 hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Режим OBS-Оверлея активен (Ожидание дропов...)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleTriggerLiveDrop({
                  cardId: cards[0]?.id,
                  recipientNick: currentMember?.nickname || 'TwitchViewer',
                  giveCardToUser: false,
                })
              }
              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5" /> Тест анимации сейчас
            </button>

            <button
              onClick={() =>
                setChromaBg((prev) =>
                  prev === 'transparent' ? 'green' : prev === 'green' ? 'dark' : 'transparent'
                )
              }
              className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold"
            >
              Фон: {chromaBg === 'transparent' ? 'Прозрачный' : chromaBg === 'green' ? 'Хромакей (#00FF00)' : 'Тёмный'}
            </button>

            {manualOverlayMode && (
              <button
                onClick={() => setManualOverlayMode(false)}
                className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Вернуться на сайт
              </button>
            )}
          </div>
        </div>

        {liveAlertDrop ? (
          <div className="flex flex-col items-center animate-[bounce_0.8s_ease-out]">
            <div className="mb-4 px-6 py-2.5 rounded-full bg-slate-950/95 border-2 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.75)] text-center">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 block">
                ✨ Выпала карточка VaultDeck!
              </span>
              <span className="text-xl font-black text-white">@{liveAlertDrop.recipient}</span>
            </div>

            <div className="scale-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
              <CollectibleCard size="lg" card={liveAlertDrop.card} count={1} effect="holo" />
            </div>
          </div>
        ) : (
          <div className="text-center opacity-25 hover:opacity-80 transition-opacity pointer-events-none">
            <p className="text-xs font-mono text-slate-400">
              OBS Оверлей подключён • Нажмите «Тест анимации» или выдайте карту
            </p>
          </div>
        )}
      </div>
    );
  }

  const canCreate = currentMember.role === 'owner' || currentMember.role === 'creator';
  const isOwner = currentMember.role === 'owner';

  // ==========================================
  // 10. ОСНОВНОЙ ИНТЕРФЕЙС ПЛАТФОРМЫ
  // ==========================================
  return (
    <div className={`min-h-screen ${theme.bgMain} ${theme.textMain} transition-colors duration-300 pb-20`}>
      {/* Живое всплывающее уведомление о выпадении редкой карты (также работает на сайте) */}
      {liveAlertDrop && (
        <div className="fixed top-20 right-5 z-50 w-72 rounded-3xl bg-slate-950/95 border-2 border-emerald-400/80 p-4 shadow-[0_0_40px_rgba(16,185,129,0.4)] backdrop-blur-xl animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 animate-ping" /> Дроп на стриме!
            </span>
            <button onClick={() => setLiveAlertDrop(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-xs text-slate-300 mb-2">
            Зритель <strong className="text-white">@{liveAlertDrop.recipient}</strong> выбил карту{' '}
            <strong className="text-emerald-300">«{liveAlertDrop.card?.name}»</strong>!
          </div>
        </div>
      )}

      {/* Уведомления (Toast) */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md flex items-center gap-2.5 text-sm font-medium animate-bounce ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
              : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toast.msg}</span>
        </div>
      )}

      {/* ВЕРХНЯЯ НАВИГАЦИОННАЯ ПАНЕЛЬ */}
      <header className={`sticky top-0 z-30 border-b ${theme.border} ${theme.bgCard} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Логотип */}
          <div
            onClick={() => setActiveTab('collections')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition">
              V
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight">
                Vault<span className={theme.accentText}>Deck</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Private Club
              </span>
            </div>
          </div>

          {/* Навигация (Десктоп) */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { id: 'collections', label: 'Коллекции', icon: Layers },
              { id: 'my-cards', label: 'Мои карты', icon: Sparkles },
              { id: 'shop', label: 'Магазин и Паки', icon: Store },
              { id: 'prestige', label: 'Престиж и Рейтинг', icon: Trophy },
              { id: 'ideas', label: 'Идеи', icon: Lightbulb },
              ...(canCreate ? [{ id: 'create', label: 'Создать', icon: Plus }] : []),
              {
                id: 'access',
                label: isOwner ? 'Управление и OBS' : 'Права автора',
                icon: Shield,
              },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                    active
                      ? `${theme.accentBg} text-slate-950 shadow-md`
                      : `${theme.textMuted} hover:bg-white/5`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Баланс, профиль Twitch и смена темы */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setTwitchNickInput(currentMember.nickname || '');
                setViewerLoginOpen(true);
              }}
              title="Войти через Twitch / найти свою коллекцию по нику"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 text-xs font-bold transition"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="max-w-[100px] truncate">@{currentMember.nickname}</span>
            </button>

            <button
              onClick={handleClaimDaily}
              title="Забрать ежедневный бонус (+200 монет)"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 text-xs font-bold transition"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Бонус</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 border border-white/10 text-xs font-bold text-amber-400">
              <Coins className="w-3.5 h-3.5" />
              <span>{currentMember.coins || 0}</span>
            </div>

            {/* Переключатель тем */}
            <div className="relative group">
              <button
                className={`p-2 rounded-xl border ${theme.border} ${theme.bgElevated} hover:opacity-90 transition`}
                title="Сменить тему оформления"
              >
                <Palette className={`w-4 h-4 ${theme.accentText}`} />
              </button>
              <div
                className={`absolute right-0 mt-2 w-48 rounded-2xl border ${theme.border} ${theme.bgCard} shadow-2xl p-1.5 hidden group-hover:block z-50`}
              >
                {Object.values(SITE_THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSiteTheme(t.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                      siteTheme === t.id ? `${theme.accentBg} text-slate-950 font-bold` : 'hover:bg-white/5'
                    }`}
                  >
                    <span>{t.name}</span>
                    {siteTheme === t.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Мобильная навигация */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto px-4 py-2 border-t border-white/5 no-scrollbar">
          {[
            { id: 'collections', label: 'Коллекции', icon: Layers },
            { id: 'my-cards', label: 'Мои карты', icon: Sparkles },
            { id: 'shop', label: 'Магазин', icon: Store },
            { id: 'prestige', label: 'Рейтинг', icon: Trophy },
            { id: 'ideas', label: 'Идеи', icon: Lightbulb },
            ...(canCreate ? [{ id: 'create', label: 'Создать', icon: Plus }] : []),
            { id: 'access', label: isOwner ? 'Управление' : 'Авторство', icon: Shield },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                  active ? `${theme.accentBg} text-slate-950` : `${theme.textMuted} bg-white/5`
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* КОНТЕНТ СТРАНИЦ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* ========================================== */}
        {/* ВКЛАДКА 1: ВСЕ КОЛЛЕКЦИИ И КАРТЫ КЛУБА     */}
        {/* ========================================== */}
        {activeTab === 'collections' && (
          <div className="space-y-8">
            <section
              className={`rounded-3xl border ${theme.border} bg-gradient-to-br ${theme.gradientHero} p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6`}
            >
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Живые коллекции сообщества</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
                  Собирай моменты. <span className={theme.accentText}>Храни легенды.</span>
                </h1>
                <p className={`text-sm ${theme.textMuted}`}>
                  Участвуй в трансляциях, открывай бустеры, следи за тиражами и собирай редкие карточки клуба.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('shop')}
                  className={`px-5 py-3 rounded-2xl ${theme.accentBg} ${theme.accentHover} text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition`}
                >
                  <PackageOpen className="w-4 h-4" /> Открыть бустер
                </button>
                {canCreate && (
                  <button
                    onClick={() => setActiveTab('create')}
                    className={`px-5 py-3 rounded-2xl border ${theme.border} ${theme.bgElevated} font-bold text-sm flex items-center gap-2 hover:border-emerald-400/50 transition`}
                  >
                    <Plus className="w-4 h-4" /> Создать карту
                  </button>
                )}
              </div>
            </section>

            {/* Список наборов (Коллекций) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold flex items-center gap-2">
                  <Layers className={`w-5 h-5 ${theme.accentText}`} /> Доступные наборы ({collections.length})
                </h2>
                {selectedCollectionId !== 'all' && (
                  <button
                    onClick={() => setSelectedCollectionId('all')}
                    className={`text-xs font-bold ${theme.accentText} hover:underline`}
                  >
                    Показать все наборы
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((col) => {
                  const colCards = cards.filter((c) => c.collectionId === col.id);
                  const ownedInCol = colCards.filter((c) => (currentMember.inventory?.[c.id] || 0) > 0).length;
                  const isSelected = selectedCollectionId === col.id;

                  return (
                    <div
                      key={col.id}
                      onClick={() => setSelectedCollectionId(isSelected ? 'all' : col.id)}
                      className={`group rounded-2xl border p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-400 ring-2 ring-emerald-400/30 bg-emerald-950/20'
                          : `${theme.border} ${theme.bgCard} hover:border-emerald-400/50`
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        {col.coverImageUrl ? (
                          <img
                            src={col.coverImageUrl}
                            alt={col.title}
                            className="w-14 h-14 rounded-2xl object-cover border border-white/10 shrink-0 shadow-lg"
                          />
                        ) : (
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                              col.coverGradient || 'from-emerald-600 to-slate-900'
                            } flex items-center justify-center text-2xl shrink-0 shadow-lg`}
                          >
                            {col.coverIcon || '🃏'}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                            {col.season || 'Сезон 2026'}
                          </span>
                          <h3 className="font-extrabold text-base truncate">{col.title}</h3>
                          <p className={`text-xs ${theme.textMuted} truncate`}>{col.description}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                        <span className={theme.textMuted}>Автор: {col.creatorName}</span>
                        <span className="font-bold text-emerald-400">
                          Собрано: {ownedInCol} / {colCards.length}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Фильтры и сетка всех карточек */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск карты по названию..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${theme.border} ${theme.bgCard} text-xs focus:outline-none focus:border-emerald-400`}
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setRarityFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      rarityFilter === 'all' ? `${theme.accentBg} text-slate-950` : `${theme.bgCard} ${theme.textMuted}`
                    }`}
                  >
                    Все редкости
                  </button>
                  {Object.values(RARITIES).map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRarityFilter(r.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                        rarityFilter === r.id
                          ? `${theme.accentBg} text-slate-950`
                          : `${theme.bgCard} ${theme.textMuted}`
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredCards.map((card) => {
                  const ownedCount = currentMember.inventory?.[card.id] || 0;
                  const isPinned = (currentMember.pinnedCards || []).includes(card.id);
                  return (
                    <div key={card.id} className={ownedCount === 0 ? 'opacity-65 hover:opacity-100 transition' : ''}>
                      <CollectibleCard
                        card={card}
                        count={ownedCount}
                        effect={currentMember.cardEffects?.[card.id] || 'none'}
                        isPinned={isPinned}
                        onTogglePin={handleTogglePin}
                        onClick={() => setInspectCard(card)}
                      />
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {/* ========================================== */}
        {/* ВКЛАДКА 2: МОИ КАРТЫ И ВИТРИНА ПРОФИЛЯ     */}
        {/* ========================================== */}
        {activeTab === 'my-cards' && (
          <div className="space-y-8">
            <section className={`rounded-3xl border ${theme.border} ${theme.bgCard} p-6 space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-extrabold flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Витрина @{currentMember.nickname}
                  </h2>
                  <p className={`text-xs ${theme.textMuted}`}>
                    Закрепите до 4 самых редких экземпляров (нажмите на звёздочку в углу карты)
                  </p>
                </div>
                <div className="text-xs font-bold text-emerald-400">
                  Уровень престижа: {myPrestige.level} ({myPrestige.title})
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((slotIdx) => {
                  const cardId = (currentMember.pinnedCards || [])[slotIdx];
                  const card = cards.find((c) => c.id === cardId);
                  if (!card) {
                    return (
                      <div
                        key={slotIdx}
                        className={`aspect-[3/4] rounded-2xl border-2 border-dashed ${theme.border} flex flex-col items-center justify-center p-4 text-center ${theme.textMuted}`}
                      >
                        <Star className="w-6 h-6 mb-2 opacity-30" />
                        <span className="text-xs font-medium">Свободный слот витрины</span>
                      </div>
                    );
                  }
                  return (
                    <CollectibleCard
                      key={card.id}
                      card={card}
                      count={currentMember.inventory?.[card.id] || 1}
                      effect={currentMember.cardEffects?.[card.id] || 'none'}
                      isPinned={true}
                      onTogglePin={handleTogglePin}
                      onClick={() => setInspectCard(card)}
                    />
                  );
                })}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-extrabold">
                Собранные карты ({myOwnedCardsList.length} из {cards.length})
              </h2>

              {myOwnedCardsList.length === 0 ? (
                <div className={`rounded-3xl border ${theme.border} ${theme.bgCard} p-12 text-center space-y-3`}>
                  <p className={theme.textMuted}>У вас пока нет ни одной карточки.</p>
                  <button
                    onClick={() => setActiveTab('shop')}
                    className={`px-5 py-2.5 rounded-xl ${theme.accentBg} text-slate-950 font-bold text-xs`}
                  >
                    Открыть первый бустер
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {myOwnedCardsList.map((card) => {
                    const count = currentMember.inventory?.[card.id] || 0;
                    return (
                      <div key={card.id} className="space-y-2">
                        <CollectibleCard
                          card={card}
                          count={count}
                          effect={currentMember.cardEffects?.[card.id] || 'none'}
                          isPinned={(currentMember.pinnedCards || []).includes(card.id)}
                          onTogglePin={handleTogglePin}
                          onClick={() => setInspectCard(card)}
                        />
                        {count > 1 && (
                          <button
                            onClick={() => handleRecycleDuplicate(card)}
                            className="w-full py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-400 text-[11px] font-bold transition"
                          >
                            Распылить дубликат (+{(RARITIES[card.rarity] || RARITIES.common).dust} 🪙)
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ========================================== */}
        {/* ВКЛАДКА 3: МАГАЗИН КАРТ И БУСТЕРОВ         */}
        {/* ========================================== */}
        {activeTab === 'shop' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`rounded-3xl border ${theme.border} bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 p-6 flex flex-col justify-between gap-4`}
              >
                <div className="space-y-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                    Базовый набор • 3 карты
                  </span>
                  <h3 className="text-xl font-black text-white">Стандартный Бустер</h3>
                  <p className="text-xs text-slate-300">
                    Содержит 3 случайные карточки из всех коллекций клуба с шансом на Легендарную и Лимитированную.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenPack('standard')}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition"
                >
                  <PackageOpen className="w-4 h-4" /> Открыть за 100 🪙
                </button>
              </div>

              <div
                className={`rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/50 via-stone-900 to-neutral-950 p-6 flex flex-col justify-between gap-4`}
              >
                <div className="space-y-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                    Повышенный шанс • 3 карты
                  </span>
                  <h3 className="text-xl font-black text-white">Элитный Хранитель-Пак</h3>
                  <p className="text-xs text-amber-100/80">
                    Гарантированно минимум Редкая карта и в 4 раза выше шанс выпадения Лимитированных экземпляров!
                  </p>
                </div>
                <button
                  onClick={() => handleOpenPack('elite')}
                  className="w-full py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-4 h-4" /> Открыть за 250 🪙
                </button>
              </div>
            </div>

            <section className="space-y-4">
              <h2 className="text-lg font-extrabold flex items-center gap-2">
                <Store className={`w-5 h-5 ${theme.accentText}`} /> Прямая покупка экземпляров
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {cards.map((card) => (
                  <div key={card.id} className="space-y-2">
                    <CollectibleCard
                      card={card}
                      count={currentMember.inventory?.[card.id] || 0}
                      showPrice={true}
                      onClick={() => setInspectCard(card)}
                    />
                    <button
                      onClick={() => handleBuySingleCard(card)}
                      className={`w-full py-2 rounded-xl ${theme.bgElevated} hover:bg-emerald-500 hover:text-slate-950 border ${theme.border} text-xs font-bold transition`}
                    >
                      Купить за {card.price || 100} 🪙
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ========================================== */}
        {/* ВКЛАДКА 4: ПРЕСТИЖ И РЕЙТИНГ              */}
        {/* ========================================== */}
        {activeTab === 'prestige' && (
          <div className="space-y-6">
            <div className={`rounded-3xl border ${theme.border} ${theme.bgCard} p-6 flex flex-col sm:flex-row items-center justify-between gap-4`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Ваш статус</span>
                <h2 className="text-2xl font-black mt-0.5">
                  Уровень {myPrestige.level} — {myPrestige.title}
                </h2>
                <p className={`text-xs ${theme.textMuted} mt-1`}>
                  Очки престижа начисляются за каждую уникальную карту и дубликаты в вашей коллекции.
                </p>
              </div>
              <div className="px-6 py-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center">
                <div className="text-2xl font-black text-emerald-400">{myPrestige.score}</div>
                <div className="text-[11px] font-bold uppercase text-emerald-300/80">Очков престижа</div>
              </div>
            </div>

            <div className={`rounded-3xl border ${theme.border} ${theme.bgCard} overflow-hidden`}>
              <div className="p-5 border-b border-white/10">
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" /> Таблица лидеров клуба
                </h3>
              </div>
              <div className="divide-y divide-white/5">
                {leaderboard.map((m, index) => (
                  <div key={m.uid} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                          index === 0
                            ? 'bg-amber-400 text-slate-950'
                            : index === 1
                            ? 'bg-slate-300 text-slate-950'
                            : index === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-white/10'
                        }`}
                      >
                        #{index + 1}
                      </span>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-2">
                          <span>@{m.nickname}</span>
                          {m.role === 'owner' && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                        </div>
                        <span className={`text-xs ${theme.textMuted}`}>
                          Уровень {m.prestige.level} • {m.uniqueCount} уникальных карт
                        </span>
                      </div>
                    </div>
                    <div className="font-black text-emerald-400 text-sm">{m.prestige.score} pts</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ВКЛАДКА 5: ИДЕИ И ГОЛОСОВАНИЕ              */}
        {/* ========================================== */}
        {activeTab === 'ideas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <form
              onSubmit={handleCreateIdea}
              className={`lg:col-span-5 rounded-3xl border ${theme.border} ${theme.bgCard} p-6 space-y-4 h-fit`}
            >
              <h2 className="text-lg font-extrabold flex items-center gap-2">
                <Lightbulb className={`w-5 h-5 ${theme.accentText}`} /> Предложить идею или коллекцию
              </h2>
              <input
                type="text"
                required
                value={newIdeaTitle}
                onChange={(e) => setNewIdeaTitle(e.target.value)}
                placeholder="Название идеи или темы нового набора"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
              />
              <textarea
                rows={3}
                value={newIdeaDesc}
                onChange={(e) => setNewIdeaDesc(e.target.value)}
                placeholder="Опишите подробнее, какие карточки хотелось бы увидеть..."
                className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
              />
              <button
                type="submit"
                className={`w-full py-3 rounded-xl ${theme.accentBg} text-slate-950 font-bold text-xs transition`}
              >
                Опубликовать на голосование
              </button>
            </form>

            <div className="lg:col-span-7 space-y-3">
              {ideas.map((idea) => {
                const voted = (idea.voters || []).includes(firebaseUser.uid);
                return (
                  <div
                    key={idea.id}
                    className={`rounded-2xl border ${theme.border} ${theme.bgCard} p-4 flex items-center justify-between gap-4`}
                  >
                    <div className="space-y-1">
                      <h3 className="font-bold text-sm">{idea.title}</h3>
                      {idea.description && <p className={`text-xs ${theme.textMuted}`}>{idea.description}</p>}
                      <span className="block text-[10px] text-slate-400">Предложил: @{idea.author}</span>
                    </div>
                    <button
                      onClick={() => handleVoteIdea(idea)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition ${
                        voted
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                          : `${theme.border} hover:border-emerald-400/50`
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" /> {idea.votes || 0}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ВКЛАДКА 6: КОНСТРУКТОР КОЛЛЕКЦИЙ И КАРТ     */}
        {/* ========================================== */}
        {activeTab === 'create' && canCreate && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Левая колонка: Создание коллекции + Создание карты */}
            <div className="lg:col-span-7 space-y-6">
              {/* Форма 1: Создать новый набор (коллекцию) */}
              <form
                onSubmit={handleCreateCollection}
                className={`rounded-3xl border ${theme.border} ${theme.bgCard} p-6 space-y-4`}
              >
                <h2 className="text-lg font-extrabold flex items-center gap-2">
                  <Layers className={`w-5 h-5 ${theme.accentText}`} /> 1. Создать новую коллекцию (набор)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={newColTitle}
                    onChange={(e) => setNewColTitle(e.target.value)}
                    placeholder="Название коллекции (напр. Летний Ивент)"
                    className={`px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
                  />
                  <input
                    type="text"
                    value={newColSeason}
                    onChange={(e) => setNewColSeason(e.target.value)}
                    placeholder="Сезон (напр. Сезон 2026)"
                    className={`px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
                  />
                </div>

                <input
                  type="text"
                  value={newColDesc}
                  onChange={(e) => setNewColDesc(e.target.value)}
                  placeholder="Краткое описание коллекции"
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
                />

                {/* Загрузка обложки набора с устройства или ссылка */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold">Обложка коллекции (файл или ссылка)</label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsColDragging(true);
                    }}
                    onDragLeave={() => setIsColDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsColDragging(false);
                      if (e.dataTransfer.files?.[0]) {
                        processUploadedImage(e.dataTransfer.files[0], 'collection');
                      }
                    }}
                    onClick={() => colFileInputRef.current?.click()}
                    className={`p-3 rounded-xl border-2 border-dashed cursor-pointer text-center text-xs transition ${
                      isColDragging
                        ? 'border-emerald-400 bg-emerald-500/15'
                        : `${theme.border} hover:border-emerald-400/50 bg-black/20`
                    }`}
                  >
                    <input
                      ref={colFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          processUploadedImage(e.target.files[0], 'collection');
                        }
                      }}
                    />
                    <span className="flex items-center justify-center gap-2 font-medium">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      {newColFileInfo
                        ? `Загружено: ${newColFileInfo.name} (${newColFileInfo.sizeKb} КБ)`
                        : 'Нажмите или перетащите обложку сюда'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl ${theme.accentBg} text-slate-950 font-bold text-xs transition`}
                >
                  Создать коллекцию
                </button>
              </form>

              {/* Форма 2: Создать карточку */}
              <form
                onSubmit={handleCreateCard}
                className={`rounded-3xl border ${theme.border} ${theme.bgCard} p-6 space-y-4`}
              >
                <h2 className="text-lg font-extrabold flex items-center gap-2">
                  <Sparkles className={`w-5 h-5 ${theme.accentText}`} /> 2. Добавить карточку в набор
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold mb-1">Набор (Коллекция)</label>
                    <select
                      value={newCardColId}
                      onChange={(e) => setNewCardColId(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/30 text-xs focus:outline-none`}
                    >
                      {collections.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold mb-1">Редкость</label>
                    <select
                      value={newCardRarity}
                      onChange={(e) => setNewCardRarity(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/30 text-xs focus:outline-none`}
                    >
                      {Object.values(RARITIES).map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    value={newCardName}
                    onChange={(e) => setNewCardName(e.target.value)}
                    placeholder="Название карты"
                    className={`sm:col-span-2 px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
                  />
                  <input
                    type="number"
                    min="1"
                    max="9999"
                    value={newCardEdition}
                    onChange={(e) => setNewCardEdition(e.target.value)}
                    placeholder="Тираж (шт.)"
                    className={`px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
                  />
                </div>

                {/* Загрузка изображения с компьютера или по ссылке */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold">Изображение карты (загрузить файл или вставить URL)</label>
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsCardDragging(true);
                    }}
                    onDragLeave={() => setIsCardDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsCardDragging(false);
                      if (e.dataTransfer.files?.[0]) {
                        processUploadedImage(e.dataTransfer.files[0], 'card');
                      }
                    }}
                    onClick={() => cardFileInputRef.current?.click()}
                    className={`p-4 rounded-2xl border-2 border-dashed cursor-pointer text-center text-xs transition ${
                      isCardDragging
                        ? 'border-emerald-400 bg-emerald-500/15'
                        : `${theme.border} hover:border-emerald-400/50 bg-black/20`
                    }`}
                  >
                    <input
                      ref={cardFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          processUploadedImage(e.target.files[0], 'card');
                        }
                      }}
                    />
                    <div className="flex flex-col items-center gap-1">
                      <FileImage className="w-6 h-6 text-emerald-400" />
                      <span className="font-bold">
                        {isProcessingImage
                          ? 'Оптимизация изображения...'
                          : newCardFileInfo
                          ? `${newCardFileInfo.name} (${newCardFileInfo.dimensions}, ${newCardFileInfo.sizeKb} КБ)`
                          : 'Нажмите или перетащите картинку сюда (PNG, JPG, WEBP)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCardImageUrl.startsWith('data:') ? '' : newCardImageUrl}
                      onChange={(e) => {
                        setNewCardFileInfo(null);
                        setNewCardImageUrl(e.target.value);
                      }}
                      placeholder="Или вставьте прямую ссылку https://..."
                      className={`flex-1 px-3.5 py-2 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
                    />
                    {newCardImageUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewCardImageUrl('');
                          setNewCardFileInfo(null);
                        }}
                        className="px-3 py-2 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-bold"
                      >
                        Очистить
                      </button>
                    )}
                  </div>
                </div>

                {/* Выбор встроенного арт-пресета, если картинка не загружена */}
                {!newCardImageUrl && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {ART_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewCardPreset(idx)}
                        className={`p-2 rounded-xl border text-center transition ${
                          newCardPreset === idx ? 'border-emerald-400 bg-emerald-500/20' : `${theme.border} bg-black/20`
                        }`}
                      >
                        <div className="text-xl">{preset.icon}</div>
                        <div className="text-[9px] truncate mt-0.5">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newCardTrigger}
                    onChange={(e) => setNewCardTrigger(e.target.value)}
                    placeholder="Способ получения (напр. Команда !drop)"
                    className={`px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
                  />
                  <input
                    type="number"
                    min="10"
                    value={newCardPrice}
                    onChange={(e) => setNewCardPrice(e.target.value)}
                    placeholder="Цена в магазине (монет)"
                    className={`px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
                  />
                </div>

                <textarea
                  rows={2}
                  value={newCardLore}
                  onChange={(e) => setNewCardLore(e.target.value)}
                  placeholder="Описание / история карты..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
                />

                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl ${theme.accentBg} ${theme.accentHover} text-slate-950 font-extrabold text-xs shadow-lg transition`}
                >
                  Опубликовать карточку
                </button>
              </form>
            </div>

            {/* Правая колонка: Живой 3D-предпросмотр */}
            <div className="lg:col-span-5">
              <div className={`sticky top-24 rounded-3xl border ${theme.border} ${theme.bgCard} p-6 flex flex-col items-center gap-4`}>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  Живой 3D-предпросмотр карты
                </span>
                <CollectibleCard
                  size="lg"
                  count={1}
                  effect="holo"
                  card={{
                    name: newCardName || 'Название новой карты',
                    rarity: newCardRarity,
                    editionMax: newCardEdition || 50,
                    editionCurrent: 1,
                    season: newColSeason || 'Сезон 2026',
                    imageUrl: newCardImageUrl,
                    artGradient: (ART_PRESETS[newCardPreset] || ART_PRESETS[0]).gradient,
                    artIcon: (ART_PRESETS[newCardPreset] || ART_PRESETS[0]).icon,
                  }}
                />
                <p className={`text-xs text-center ${theme.textMuted}`}>
                  Наведите курсор на карту, чтобы проверить голографический блик и 3D-наклон.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ВКЛАДКА 7: ПАНЕЛЬ УПРАВЛЕНИЯ, ПРАВ И OBS   */}
        {/* ========================================== */}
        {activeTab === 'access' && (
          <div className="space-y-8">
            {/* Для обычных зрителей: Профиль Twitch + запрос прав автора или ввод кода */}
            {!isOwner && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`rounded-3xl border ${theme.border} ${theme.bgCard} p-6 space-y-4`}>
                  <h2 className="text-lg font-extrabold flex items-center gap-2">
                    <Tv className="w-5 h-5 text-purple-400" /> Ваш профиль зрителя
                  </h2>
                  <p className={`text-xs ${theme.textMuted}`}>
                    Просмотр всех коллекций и сбор карт открыты для всех! Укажите свой ник на Twitch, чтобы найти
                    свою коллекцию и отображаться в рейтинге.
                  </p>
                  <button
                    onClick={() => {
                      setTwitchNickInput(currentMember.nickname || '');
                      setViewerLoginOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 transition"
                  >
                    <Tv className="w-4 h-4" /> Указать или сменить ник Twitch (@{currentMember.nickname})
                  </button>

                  {canCreate ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Владелец выдал вам права Автора! Вы можете создавать коллекции во вкладке «Создать».</span>
                    </div>
                  ) : currentMember.authorRequest ? (
                    <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs">
                      Ваша заявка на создание карточек отправлена и ожидает подтверждения Владельца.
                    </div>
                  ) : (
                    <form onSubmit={handleRequestAuthorAccess} className="space-y-3 pt-2 border-t border-white/10">
                      <label className="block text-xs font-bold">Хотите создавать свои карточки?</label>
                      <input
                        type="text"
                        value={authorRequestNote}
                        onChange={(e) => setAuthorRequestNote(e.target.value)}
                        placeholder="Напишите коротко Владельцу, какую коллекцию хотите сделать..."
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
                      />
                      <button
                        type="submit"
                        className={`px-4 py-2.5 rounded-xl ${theme.accentBg} text-slate-950 font-bold text-xs flex items-center gap-1.5`}
                      >
                        <Send className="w-3.5 h-3.5" /> Запросить права у Владельца
                      </button>
                    </form>
                  )}
                </div>

                <form
                  onSubmit={handleRedeemInvite}
                  className={`rounded-3xl border ${theme.border} ${theme.bgCard} p-6 space-y-4 h-fit`}
                >
                  <h2 className="text-lg font-extrabold flex items-center gap-2">
                    <Key className={`w-5 h-5 ${theme.accentText}`} /> Активировать код Автора
                  </h2>
                  <p className={`text-xs ${theme.textMuted}`}>
                    Если Владелец лично передал вам пригласительный код для создания карточек, введите его ниже:
                  </p>
                  <input
                    type="text"
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    placeholder="VD-XXXXX"
                    className={`w-full px-4 py-3 rounded-xl border ${theme.border} bg-black/30 text-sm font-mono uppercase`}
                  />
                  {accessError && <p className="text-xs text-rose-400">{accessError}</p>}
                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl ${theme.accentBg} text-slate-950 font-bold text-xs`}
                  >
                    Активировать права Автора
                  </button>
                </form>
              </div>
            )}

            {/* ПАНЕЛЬ ВЛАДЕЛЬЦА: OBS-ВИДЖЕТ АНИМАЦИИ + УПРАВЛЕНИЕ ПРАВАМИ СОЗДАНИЯ КАРТ */}
            {isOwner && (
              <>
                {/* БЛОК 1: OBS WIDGET / АНИМАЦИЯ ВЫПАДЕНИЯ КАРТЫ НА СТРИМ */}
                <section className={`rounded-3xl border border-purple-500/35 ${theme.bgCard} p-6 space-y-5`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold uppercase tracking-wider">
                        Собственный OBS-виджет VaultDeck • Работает на 100% в OBS Studio
                      </span>
                      <h2 className="text-xl font-black mt-1.5 flex items-center gap-2">
                        <Radio className="w-5 h-5 text-purple-400" /> Подключение 3D-анимации выпадения карт в OBS
                      </h2>
                      <p className={`text-xs ${theme.textMuted} mt-1 max-w-3xl`}>
                        Так как сейчас вы находитесь внутри закрытого редактора, обычная ссылка из адресной строки недоступна для внешней программы OBS. Поэтому я создал для вас <strong>автономный файл-виджет</strong>, который напрямую связывает ваш OBS с этой базой карточек!
                      </p>
                    </div>

                    <button
                      onClick={() => setOverlaySoundEnabled(!overlaySoundEnabled)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0 ${
                        overlaySoundEnabled
                          ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-300'
                          : 'border-slate-700 text-slate-400'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" />
                      {overlaySoundEnabled ? 'Звук анимации: ВКЛ' : 'Звук анимации: ВЫКЛ'}
                    </button>
                  </div>

                  {/* 2 РАБОЧИХ СПОСОБА ДЛЯ OBS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Способ 1: Скачать готовый файл для OBS (Рекомендуемый) */}
                    <div className="p-4 rounded-2xl bg-purple-950/25 border border-purple-500/40 flex flex-col justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="text-xs font-extrabold uppercase text-purple-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" /> Способ 1 (Идеально для OBS Browser Source)
                        </div>
                        <h3 className="font-bold text-sm text-white">Автономный виджет-файл (.html)</h3>
                        <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside">
                          <li>Нажмите кнопку ниже, чтобы скачать файл <code>vaultdeck-obs-overlay.html</code>.</li>
                          <li>В <strong>OBS Studio</strong> добавьте источник <strong>«Браузер» (Browser)</strong>.</li>
                          <li>Поставьте галочку <strong>«Локальный файл» (Local File)</strong> и выберите скачанный файл.</li>
                        </ol>
                      </div>

                      <button
                        type="button"
                        onClick={handleDownloadObsOverlayFile}
                        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition"
                      >
                        <Upload className="w-4 h-4 rotate-180" /> Скачать готовый файл для OBS (.html)
                      </button>
                    </div>

                    {/* Способ 2: Встроенный экран оверлея / Ссылка при публикации */}
                    <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="text-xs font-extrabold uppercase text-emerald-400 flex items-center gap-1.5">
                          <Tv className="w-4 h-4" /> Способ 2 (Прямой экран / Веб-ссылка)
                        </div>
                        <h3 className="font-bold text-sm text-white">Открыть чистый экран оверлея или скопировать URL</h3>
                        <p className="text-xs text-slate-300">
                          Вы можете переключить это окно в режим чистого экрана с хромакеем для захвата окна в OBS, либо скопировать веб-ссылку (если вы выложили сайт на свой домен).
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          onClick={() => setManualOverlayMode(true)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Открыть экран OBS здесь
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const url = `${window.location.origin}${window.location.pathname}?overlay=1&channel=${encodeURIComponent(currentMember.nickname)}`;
                            copyTextSafe(url, 'Ссылка скопирована!');
                          }}
                          className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <Copy className="w-3.5 h-3.5" /> Копировать URL
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Пульт запуска анимации и выдачи карты зрителю */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    <label className="block text-xs font-extrabold text-emerald-400">
                      Пульт проверки: отправьте карту на стрим прямо сейчас
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <select
                        value={dropCardId}
                        onChange={(e) => setDropCardId(e.target.value)}
                        className={`px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/30 text-xs focus:outline-none`}
                      >
                        {cards.map((c) => (
                          <option key={c.id} value={c.id}>
                            Карта: {c.name} ({RARITIES[c.rarity]?.label})
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        value={dropTargetNick}
                        onChange={(e) => setDropTargetNick(e.target.value)}
                        placeholder="Ник зрителя на Twitch (напр. Alex_TV)"
                        className={`px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/30 text-xs focus:outline-none`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          handleTriggerLiveDrop({
                            cardId: dropCardId || cards[0]?.id,
                            recipientNick: dropTargetNick || currentMember.nickname,
                            giveCardToUser: false,
                          })
                        }
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Play className="w-3.5 h-3.5 text-emerald-400" /> Тест анимации в OBS
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleTriggerLiveDrop({
                            cardId: dropCardId || cards[0]?.id,
                            recipientNick: dropTargetNick || currentMember.nickname,
                            giveCardToUser: true,
                          })
                        }
                        className={`px-4 py-2.5 rounded-xl ${theme.accentBg} ${theme.accentHover} text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition`}
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Выдать карту + Анимация
                      </button>
                    </div>
                  </div>
                </section>

                {/* БЛОК 2: ВЫДАЧА ПРАВ НА СОЗДАНИЕ КАРТ (ТОЛЬКО ВЫ РЕШАЕТЕ, КТО МОЖЕТ СОЗДАВАТЬ) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-5 space-y-6">
                    {/* Прямая выдача по нику Twitch */}
                    <form
                      onSubmit={handleGrantCreatorByNick}
                      className={`rounded-3xl border ${theme.border} ${theme.bgCard} p-6 space-y-4`}
                    >
                      <h2 className="text-lg font-extrabold flex items-center gap-2">
                        <UserCheck className={`w-5 h-5 ${theme.accentText}`} /> Выдать права Автора по нику
                      </h2>
                      <p className={`text-xs ${theme.textMuted}`}>
                        Смотреть коллекции могут все, но создавать свои наборы и карточки смогут только те, кому вы
                        лично выдадите доступ.
                      </p>
                      <input
                        type="text"
                        required
                        value={manualAuthorNick}
                        onChange={(e) => setManualAuthorNick(e.target.value)}
                        placeholder="Введите ник на Twitch (например: Kira_V)"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-sm focus:outline-none`}
                      />
                      <button
                        type="submit"
                        className={`w-full py-3 rounded-xl ${theme.accentBg} text-slate-950 font-bold text-xs shadow transition`}
                      >
                        Разрешить создание карточек
                      </button>
                    </form>

                    {/* Генерация одноразового кода для автора */}
                    <form
                      onSubmit={handleCreateInvite}
                      className={`rounded-3xl border ${theme.border} ${theme.bgCard} p-6 space-y-4`}
                    >
                      <h3 className="text-base font-extrabold flex items-center gap-2">
                        <Key className={`w-4 h-4 ${theme.accentText}`} /> Или создать код-пропуск для Автора
                      </h3>
                      <input
                        type="text"
                        value={newInviteNote}
                        onChange={(e) => setNewInviteNote(e.target.value)}
                        placeholder="Заметка (для кого этот код)"
                        className={`w-full px-3.5 py-2.5 rounded-xl border ${theme.border} bg-black/25 text-xs focus:outline-none`}
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 font-bold text-xs transition"
                      >
                        Сгенерировать код Автора
                      </button>

                      <div className="space-y-2 max-h-48 overflow-y-auto pt-2">
                        {invites.map((inv) => (
                          <div
                            key={inv.code}
                            className="p-2.5 rounded-xl bg-black/25 border border-white/5 flex items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <span className="font-mono font-bold text-emerald-400">{inv.code}</span>
                              <span className="block text-[10px] text-slate-400">{inv.note}</span>
                            </div>
                            {inv.usedBy ? (
                              <span className="text-[10px] text-slate-500">Активирован ({inv.usedByNick})</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(inv.code);
                                  showToast(`Код ${inv.code} скопирован!`);
                                }}
                                className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 text-[11px] font-bold"
                              >
                                Копия
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </form>
                  </div>

                  {/* Список всех зрителей, заявок и авторов */}
                  <div className="lg:col-span-7">
                    <div className={`rounded-3xl border ${theme.border} ${theme.bgCard} p-6 space-y-4`}>
                      <h2 className="text-lg font-extrabold flex items-center gap-2">
                        <Users className={`w-5 h-5 ${theme.accentText}`} /> Зрители и Авторы ({members.length})
                      </h2>

                      <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                        {members.map((m) => (
                          <div
                            key={m.uid}
                            className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                              m.authorRequest
                                ? 'bg-amber-500/10 border-amber-500/40'
                                : 'bg-black/25 border-white/5'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="font-bold text-sm flex items-center gap-2 flex-wrap">
                                <span>@{m.nickname}</span>
                                {m.role === 'owner' && (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 font-bold">
                                    Владелец (Вы)
                                  </span>
                                )}
                                {m.role === 'creator' && (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-bold">
                                    Автор карточек
                                  </span>
                                )}
                                {m.role === 'collector' && (
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-700/60 text-slate-300">
                                    Зритель (только просмотр/сбор)
                                  </span>
                                )}
                              </div>

                              {m.authorRequest && (
                                <div className="text-xs text-amber-300 flex items-center gap-1.5">
                                  <Bell className="w-3.5 h-3.5 shrink-0" />
                                  <span>Заявка на авторство: «{m.authorRequest.note}»</span>
                                </div>
                              )}
                            </div>

                            {m.role !== 'owner' && (
                              <div className="flex items-center gap-2 shrink-0">
                                {m.role !== 'creator' ? (
                                  <button
                                    onClick={() =>
                                      handleUpdateMember(m.uid, { role: 'creator', authorRequest: null })
                                    }
                                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition"
                                  >
                                    Выдать права Автора
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateMember(m.uid, { role: 'collector' })}
                                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-bold transition"
                                  >
                                    Отозвать права Автора
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* МОДАЛЬНОЕ ОКНО: ВХОД ЧЕРЕЗ TWITCH / ПОИСК  */}
      {/* ========================================== */}
      {viewerLoginOpen && (
        <div
          onClick={() => setViewerLoginOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-3xl border ${theme.border} ${theme.bgCard} p-6 sm:p-7 shadow-2xl space-y-5 relative`}
          >
            <button
              onClick={() => setViewerLoginOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-400 flex items-center justify-center">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black">Вход по нику Twitch</h2>
                <p className={`text-xs ${theme.textMuted}`}>
                  Найдите свою коллекцию карт по нику со стрима
                </p>
              </div>
            </div>

            <form onSubmit={handleTwitchViewerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5">Ваш никнейм на Twitch</label>
                <input
                  type="text"
                  required
                  value={twitchNickInput}
                  onChange={(e) => setTwitchNickInput(e.target.value)}
                  placeholder="Например: NightViewer"
                  className={`w-full px-4 py-3 rounded-xl border ${theme.border} bg-black/30 text-sm focus:outline-none`}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
              >
                <Tv className="w-4 h-4" /> Открыть мою коллекцию
              </button>
            </form>

            {members.length > 0 && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className={`block text-[11px] font-semibold ${theme.textMuted}`}>
                  Быстрый выбор участника из списка:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                  {members.map((m) => (
                    <button
                      key={m.uid}
                      type="button"
                      onClick={() => setTwitchNickInput(m.nickname)}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-500/20 border border-white/10 text-xs transition"
                    >
                      @{m.nickname}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* МОДАЛЬНОЕ ОКНО: ДЕТАЛЬНЫЙ ПРОСМОТР КАРТЫ   */}
      {/* ========================================== */}
      {inspectCard && (
        <div
          onClick={() => setInspectCard(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl rounded-3xl border ${theme.border} ${theme.bgCard} p-6 sm:p-8 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative`}
          >
            <button
              onClick={() => setInspectCard(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex justify-center">
              <CollectibleCard
                size="lg"
                card={inspectCard}
                count={currentMember.inventory?.[inspectCard.id] || 0}
                effect={currentMember.cardEffects?.[inspectCard.id] || 'none'}
              />
            </div>

            <div className="space-y-4">
              <div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${
                    (RARITIES[inspectCard.rarity] || RARITIES.common).badge
                  }`}
                >
                  {(RARITIES[inspectCard.rarity] || RARITIES.common).label}
                </span>
                <h2 className="text-2xl font-black mt-2">{inspectCard.name}</h2>
                <p className={`text-xs ${theme.textMuted} mt-1`}>{inspectCard.lore}</p>
              </div>

              <div className="space-y-2 text-xs border-y border-white/10 py-3">
                <div className="flex justify-between">
                  <span className={theme.textMuted}>Автор иллюстрации:</span>
                  <span className="font-bold">{inspectCard.author || 'VaultArchitect'}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textMuted}>Тираж выпуска:</span>
                  <span className="font-mono font-bold">
                    #{String(inspectCard.editionCurrent || 1).padStart(2, '0')} из {inspectCard.editionMax || 100}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textMuted}>Источник получения:</span>
                  <span className="font-bold text-emerald-400">{inspectCard.trigger}</span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textMuted}>В вашей коллекции:</span>
                  <span className="font-bold">{currentMember.inventory?.[inspectCard.id] || 0} шт.</span>
                </div>
              </div>

              {/* Кастомизация эффектов карты, если она есть у пользователя */}
              {(currentMember.inventory?.[inspectCard.id] || 0) > 0 && (
                <div className="space-y-2">
                  <span className="block text-xs font-bold">Визуальный эффект карты:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {Object.values(CARD_EFFECTS).map((eff) => {
                      const active = (currentMember.cardEffects?.[inspectCard.id] || 'none') === eff.id;
                      const unlocked = (currentMember.unlockedEffects || ['none']).includes(eff.id);
                      return (
                        <button
                          key={eff.id}
                          onClick={() => handleApplyCardEffect(inspectCard.id, eff.id)}
                          className={`p-2 rounded-xl border text-left text-[11px] transition ${
                            active
                              ? 'border-emerald-400 bg-emerald-500/20 font-bold'
                              : `${theme.border} hover:border-emerald-400/50`
                          }`}
                        >
                          <div className="truncate">{eff.name}</div>
                          <div className="text-[10px] text-amber-400">
                            {unlocked ? 'Доступно' : `${eff.price} 🪙`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* МОДАЛЬНОЕ ОКНО: ОТКРЫТИЕ БУСТЕРА (ПАКА)    */}
      {/* ========================================== */}
      {packModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Открытие бустера!</h2>
            <p className="text-xs sm:text-sm text-emerald-400 mt-1">
              Нажмите на каждую карту, чтобы перевернуть её
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl w-full justify-items-center">
            {openedCards.map((card, idx) => {
              const isRevealed = revealedIndices.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (!isRevealed) {
                      setRevealedIndices([...revealedIndices, idx]);
                    }
                  }}
                  className="w-64 aspect-[3/4] cursor-pointer"
                >
                  {isRevealed ? (
                    <CollectibleCard card={card} count={1} effect="holo" />
                  ) : (
                    <div className="w-full h-full rounded-2xl border-2 border-emerald-400/60 bg-gradient-to-br from-emerald-950 via-slate-900 to-black shadow-2xl shadow-emerald-500/20 flex flex-col items-center justify-center p-6 hover:scale-105 transition">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 font-black text-2xl mb-3 animate-pulse">
                        V
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                        Нажмите, чтобы открыть
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex gap-3">
            {revealedIndices.length < openedCards.length && (
              <button
                onClick={() => setRevealedIndices([0, 1, 2])}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
              >
                Открыть все сразу
              </button>
            )}
            <button
              onClick={() => setPackModalOpen(false)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold transition"
            >
              Забрать в коллекцию
            </button>
          </div>
        </div>
      )}
    </div>
  );
}