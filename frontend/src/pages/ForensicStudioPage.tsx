import React, { useState, useRef, useEffect } from 'react';
import { 
  Scan, 
  Sparkles, 
  RefreshCw, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  User, 
  Sliders, 
  FileText, 
  RotateCcw, 
  ShieldCheck, 
  Cpu, 
  Download,
  AlertTriangle,
  HelpCircle,
  Crosshair,
  Layers,
  History,
  Eye,
  Activity,
  Mic,
  MicOff,
  Maximize2,
  ChevronRight,
  SunMedium,
  Check,
  Zap,
  ArrowRight,
  FolderArchive,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Globe,
  Languages
} from 'lucide-react';
import { api, resolveImageUrl } from '../lib/api';
import { FacialTraits, CompositeRevision } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// Supported Deposition Languages
export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en-US', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh-CN', name: 'Mandarin', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja-JP', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
];

// Multilingual Eyewitness Testimonials
const MULTILINGUAL_TESTIMONIALS: Record<string, {
  badge: string;
  type: string;
  title: string;
  context: string;
  translations: Record<string, string>;
}> = {
  case1: {
    badge: "CASE 01",
    type: "Armed Robbery",
    title: "Sharp Jaw & Eyebrow Scar",
    context: "Convenience store night incident under fluorescent lighting",
    translations: {
      'en-US': "Male in his early to mid-30s. Sharp, square chiseled jawline and narrow chin. Deep-set pale blue eyes with heavy brow. Thick dark arched eyebrows. Short cropped dark brown hair fading at the sides. Distinctive thin diagonal scar running through his right eyebrow. Light stubble on his chin.",
      'ta-IN': "30 முதல் 35 வயது மதிக்கத்தக்க ஆண். கூர்மையான, செவ்வக வடிவ தாடை மற்றும் குறுகிய கன்னம். ஆழமான வெளிர் நீலக் கண்கள் மற்றும் அடர்த்தியான வளைந்த புருவங்கள். பக்கவாட்டில் குறைக்கப்பட்ட குட்டையான அடர் பழுப்பு நிற முடி. வலது புருவத்தில் ஒரு குறுக்கு வடு. தாடையில் லேசான தாடி முடி.",
      'kn-IN': "ಸುಮಾರು 30 ರಿಂದ 35 ವರ್ಷ ವಯಸ್ಸಿನ ಪುರುಷ. ತೀಕ್ಷ್ಣವಾದ ಚೌಕಾಕಾರದ ದವಡೆ ಮತ್ತು ಕಿರಿದಾದ ಗಲ್ಲ. ಆಳವಾದ ತಿಳಿ ನೀಲಿ ಕಣ್ಣುಗಳು ಮತ್ತು ದಟ್ಟವಾದ ಬಾಗಿದ ಹುಬ್ಬುಗಳು. ಬದಿಗಳಲ್ಲಿ ಕತ್ತರಿಸಿದ ಸಣ್ಣ ಕಡು ಕಂದು ಕೂದಲು. ಬಲ ಹುಬ್ಬಿನ ಮೇಲೆ ಸ್ಪಷ್ಟವಾದ ತೆಳುವಾದ ಗಾಯದ ಗುರುತು. ಗಲ್ಲದ ಮೇಲೆ ಲಘು ಗಡ್ಡ.",
      'es-ES': "Hombre de unos 30 a 35 años. Mandíbula cuadrada muy marcada y mentón estrecho. Ojos azul claro profundos con cejas gruesas y arqueadas. Cabello castaño oscuro corto degradado a los lados. Cicatriz diagonal distintiva en la ceja derecha. Barba corta de varios días.",
      'hi-IN': "30 से 35 वर्ष का पुरुष। नुकीला चौकोर जबड़ा और पतली ठुड्डी। गहरी हल्की नीली आंखें और घनी धनुषाकार भौहें। गहरे भूरे छोटे बाल जो किनारों से छोटे हैं। दाहिनी भौंह पर एक विशिष्ट तिरछा निशान। ठुड्डी पर हल्की दाढ़ी।",
      'fr-FR': "Homme au début de la trentaine. Mâchoire carrée et ciselée avec menton étroit. Yeux bleu clair enfoncés sous des sourcils épais et arqués. Cheveux châtain foncé coupés court en dégradé sur les côtés. Cicatrice diagonale distinctive sur le sourcil droit. Légère barbe de trois jours.",
      'de-DE': "Mann Anfang bis Mitte 30. Markante quadratische Kinnlinie und schmales Kinn. Tief liegende hellblaue Augen mit dichten gewölbten Augenbrauen. Kurzes dunkelbraunes Haar an den Seiten kurz rasiert. Auffällige diagonale Narbe an der rechten Augenbraue. Leichte Stoppeln am Kinn.",
      'zh-CN': "30岁出头的男性。下颌线条分明呈方字脸，下巴较尖。深邃的浅蓝色眼睛，眉毛浓密呈拱形。深棕色短发两边渐层推剪。右眉有一条明显的斜向疤痕。下巴有少量胡茬。",
      'ja-JP': "30代前半の男性。角張った引き締まった顎のラインと細い顎。彫りの深い淡い青い目と濃い弓形の眉。サイドを刈り上げた短いダークブラウンの髪。右眉を斜めに走る目立つ薄い傷跡。顎にうっすらとした無精髭。",
      'ar-SA': "رجل في أوائل إلى منتصف الثلاثينيات من عمره. خط فك مربع وحاد مع ذقن ضيق. عيون زرقاء فاتحة غائرة وحواجب داكنة مقوسة وكثيفة. شعر بني داكن قصير متدرج على الجانبين. ندبة قطرية مميزة تمر عبر حاجبه الأيمن. لحية خفيفة على ذقنه.",
      'pt-BR': "Homem no início aos 35 anos. Mandíbula quadrada bem definida e queixo estreito. Olhos azul-claros fundos com sobrancelhas grossas arqueadas. Cabelo castanho-escuro curto degradê nas laterais. Cicatriz diagonal fina na sobrancelha direita. Barba por fazer no queixo.",
      'ru-RU': "Мужчина около 30–35 лет. Четкая квадратная линия челюсти и узкий подбородок. Глубоко посаженные светло-голубые глаза с густыми дугообразными бровями. Короткие темно-каштановые волосы с плавным переходом по бокам. Тонкий диагональный шрам через правую бровь. Легкая щетина на подбородке."
    }
  },
  case2: {
    badge: "CASE 02",
    type: "ATM Vault Intrusion",
    title: "Heart Face & Cheek Mole",
    context: "Drive-through automated teller enclosure",
    translations: {
      'en-US': "Female, approximately 28 to 32 years old. Heart-shaped face with high prominent cheekbones and tapered chin. Narrow almond-shaped hazel eyes, average spacing. Long straight jet-black hair tied back in a low ponytail. Small birthmark or mole below her right lower eyelid. Thin upper lip.",
      'ta-IN': "சுமார் 28 முதல் 32 வயதுடைய பெண். எடுப்பான கன்னத்து எலும்புகள் மற்றும் குறுகிய கன்னத்துடன் கூடிய இதய வடிவ முகம். வாதுமை வடிவ பழுப்பு நிறக் கண்கள். பின்புறம் கட்டப்பட்ட நீண்ட நேரான கரிய கூந்தல். வலது கீழ் இமைக்கு கீழே ஒரு சிறிய மச்சம். மெல்லிய மேல் உதடு.",
      'kn-IN': "ಸುಮಾರು 28 ರಿಂದ 32 ವರ್ಷದ ಮಹಿಳೆ. ಎತ್ತರದ ಕೆನ್ನೆಯ ಮೂಳೆಗಳು ಮತ್ತು ಕಿರಿದಾದ ಗಲ್ಲವಿರುವ ಹೃದಯಾಕಾರದ ಮುಖ. ಬಾದಾಮಿ ಆಕಾರದ ತಿಳಿ ಕಂದು ಕಣ್ಣುಗಳು. ಕೆಳಭಾಗದಲ್ಲಿ ಕಟ್ಟಿದ ಉದ್ದನೆಯ ನೇರ ಕಪ್ಪು ಕೂದಲು. ಬಲ ಕಣ್ಣಿನ ಕೆಳರೆಪ್ಪೆಯ ಕೆಳಗೆ ಸಣ್ಣ ಮಚ್ಚೆ. ತೆಳುವಾದ ಮೇಲ್ತುಟಿ.",
      'es-ES': "Mujer de aproximadamente 28 a 32 años. Rostro en forma de corazón con pómulos altos y prominentes y mentón afinado. Ojos avellana almendrados. Cabello largo, liso y negro azabache recogido en una coleta baja. Pequeño lunar debajo del párpado inferior derecho. Labio superior delgado.",
      'hi-IN': "लगभग 28 से 32 वर्ष की महिला। दिल के आकार का चेहरा, उभरे हुए गाल और पतली ठुड्डी। बादामी हेज़ल आँखें। लंबे सीधे काले बाल जो नीचे पोनीटेल में बंधे हैं। दाहिनी आँख के नीचे एक छोटा तिल। पतला ऊपरी होंठ।",
      'fr-FR': "Femme d'environ 28 à 32 ans. Visage en forme de cœur avec pommettes hautes et menton effilé. Yeux noisette en amande. Longs cheveux noirs lisses attachés en queue de cheval basse. Petit grain de beauté sous la paupière inférieure droite. Lèvre supérieure fine.",
      'de-DE': "Frau, etwa 28 bis 32 Jahre alt. Herzförmiges Gesicht mit hohen markanten Wangenknochen und spitz zulaufendem Kinn. Mandelförmige haselnussbraune Augen. Langes glattes pechschwarzes Haar im Zopf. Kleines Muttermal unter dem rechten Unterlid. Dünne Oberlippe.",
      'zh-CN': "女性，大约28至32岁。心形脸，颧骨高耸突出，下巴尖细。杏仁状淡褐色眼睛。乌黑笔直的长发低扎成马尾。右下眼睑下方有一颗小痣。上嘴唇偏薄。",
      'ja-JP': "28歳から32歳くらいの女性。頬骨が高く突き出たハート型の顔と細い顎。アーモンド形のハシバミ色の目。低いポニーテールに結んだ長くて真っ直ぐな漆黒の髪。右下まぶたの下にある小さなほくろ。薄い上唇。",
      'ar-SA': "امرأة تبلغ من العمر حوالي 28 إلى 32 عامًا. وجه على شكل قلب مع عظام وجنتين بارزة وذقن مدبب. عيون عسلية لوزية الشكل. شعر أسود داكن طويل مفرود مربوط على شكل ذيل حصان منخفض. شامة صغيرة أسفل جفنها السفلي الأيمن. شفة علوية رفيعة.",
      'pt-BR': "Mulher com cerca de 28 a 32 anos. Rosto em formato de coração com maçãs do rosto altas e queixo afilado. Olhos castanho-esverdeados amendoados. Cabelo comprido liso preto preso em rabo de cavalo baixo. Pequena pinta abaixo da pálpebra inferior direita. Lábio superior fino.",
      'ru-RU': "Женщина примерно 28–32 лет. Сердцевидная форма лица с высокими скулами и зауженным подбородком. Миндалевидные ореховые глаза. Длинные прямые смоляно-черные волосы в низком хвосте. Небольшая родинка под правым нижним веком. Тонкая верхняя губа."
    }
  },
  case3: {
    badge: "CASE 03",
    type: "Warehouse Breach",
    title: "Weathered & Broken Nose",
    context: "Cargo docks dusk illumination",
    translations: {
      'en-US': "Older male, late 40s to 50s. Weathered rough skin texture. Broad nose with an old healed break. Salt and pepper thick wavy hair and a trimmed greyish goatee beard. Hooded dark brown eyes with crow's feet wrinkles. Heavy brow ridge.",
      'ta-IN': "சுமார் 45 முதல் 55 வயதுடைய முதியவர். முரட்டுத்தனமான தோல் அமைப்பு. பழைய உடைந்த காயம் ஆறிய தடித்த அகன்ற மூக்கு. நரை கலந்த தடித்த அலை அலையான முடி மற்றும் ஒழுங்கமைக்கப்பட்ட சாம்பல் நிற தாடி. சுருக்கங்கள் கொண்ட கரும் பழுப்பு நிற கண்கள்.",
      'kn-IN': "ಸುಮಾರು 45 ರಿಂದ 55 ವರ್ಷದ ಹಿರಿಯ ಪುರುಷ. ಒರಟಾದ ಚರ್ಮದ ವಿನ್ಯಾಸ. ಹಳೆಯ ಮುರಿತ ಮಾಗಿದ ಅಗಲವಾದ ಮೂಗು. ಬಿಳಿ-ಕಪ್ಪು ಮಿಶ್ರಿತ ದಟ್ಟವಾದ ಅಲೆಅಲೆಯಾದ ಕೂದಲು ಮತ್ತು ಸಣ್ಣದಾಗಿ ಕತ್ತರಿಸಿದ ಬೂದು ಗಡ್ಡ. ಕಣ್ಣಿನ ಸುತ್ತ ಸುಕ್ಕುಗಳಿರುವ ಕಡು ಕಂದು ಕಣ್ಣುಗಳು.",
      'es-ES': "Hombre mayor de unos 48 a 55 años. Piel curtida y rugosa. Nariz ancha con fractura antigua curada. Cabello ondulado canoso y perilla grisácea recortada. Ojos castaño oscuro encapuchados con patas de gallo. Arco superciliar prominente.",
      'hi-IN': "45 से 55 वर्ष का वृद्ध पुरुष। खुरदरी धूप से झुलसी त्वचा। चौड़ी नाक जिस पर पुरानी चोट का निशान। सफेद-काले घुंघराले घने बाल और कटी हुई भूरी दाढ़ी। गहरी भूरी आँखें जिनके किनारों पर झुर्रियाँ हैं।",
      'fr-FR': "Homme mûr, fin de quarantaine ou cinquintaine. Peau marquée par les intempéries. Nez large avec ancienne fracture consolidée. Cheveux épais ondulés poivre et sel et bouc gris taillé. Yeux marron foncé sous des arcades sourcilières prononcées.",
      'de-DE': "Älterer Mann, Ende 40 bis Anfang 50. Wettergegerbte raue Haut. Breite Nase mit alter verheilter Fraktur. Dichtes welliges graumeliertes Haar und getrimmter grauer Kinnbart. Dunkelbraune Schlupflider mit Lachfalten.",
      'zh-CN': "年长男性，40多岁至50岁左右。饱经风霜的粗糙皮肤。宽鼻梁，有愈合的旧伤痕迹。花白浓密的波浪形头发，修剪整齐的灰白山羊胡。深褐色内双眼睛，眼角有鱼尾纹。眉骨深沉突出。",
      'ja-JP': "40代後半から50代の年配の男性。風化した荒い肌質。古い治癒した骨折痕のある幅広の鼻。厚い白髪交じりのウェーブのかかった髪と整えられた灰色のあごひげ。目尻にしわのある窪んだ暗褐色の目。",
      'ar-SA': "رجل مسن في أواخر الأربعينيات إلى الخمسينيات. ملمس بشرة خشن مجوى. أنف عريض به كسر قديم ملتئم. شعر مموج كثيف بلون الملح والفلفل ولحية صغيرة رمادية مشذبة. عيون بنية داكنة مع تجاعيد حول العينين.",
      'pt-BR': "Homem mais velho, 48 a 55 anos. Pele castigada e áspera. Nariz largo com fratura antiga cicatrizada. Cabelo ondulado grisalho e cavanhaque cinza aparado. Olhos castanho-escuros encapuzados com pés de galinha.",
      'ru-RU': "Пожилой мужчина около 48–55 лет. Грубая обветренная кожа. Широкий нос со следами старого сросшегося перелома. Густые волнистые волосы с проседью и подстриженная седоватая эспаньолка. Темно-карие глаза с морщинами в уголках."
    }
  }
};

const LIGHTING_PRESETS = [
  "Fluorescent convenience store night",
  "Sodium-vapor streetlight illumination",
  "Direct daytime outdoor lighting",
  "Dim underground transit lighting"
];

export const ForensicStudioPage: React.FC = () => {
  const { user } = useAuth();

  // State: Selected Language
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [activeCaseKey, setActiveCaseKey] = useState<string>('case1');

  // State: Witness Input
  const [statement, setStatement] = useState(MULTILINGUAL_TESTIMONIALS['case1'].translations['en-US']);
  const [contextNote, setContextNote] = useState(MULTILINGUAL_TESTIMONIALS['case1'].context);

  // State: Voice Input (Speech-to-Text)
  const [speechRecognizing, setSpeechRecognizing] = useState(false);
  const [audioSimActive, setAudioSimActive] = useState(false);
  const speechRecognitionRef = useRef<any>(null);

  // State: Voice Output (Text-to-Speech)
  const [speakingDeposition, setSpeakingDeposition] = useState(false);
  const [speakingSummary, setSpeakingSummary] = useState(false);
  const [isSpeechPaused, setIsSpeechPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // State: AI Analysis
  const [analyzing, setAnalyzing] = useState(false);
  const [traits, setTraits] = useState<FacialTraits | null>(null);
  const [forensicSummary, setForensicSummary] = useState('');
  const [synthesisPrompt, setSynthesisPrompt] = useState('');
  const [uncertainTraits, setUncertainTraits] = useState<string[]>([]);
  const [contradictions, setContradictions] = useState<string[]>([]);

  // State: Composite Generation & Revision Tracking
  const [generating, setGenerating] = useState(false);
  const [currentComposite, setCurrentComposite] = useState<CompositeRevision | null>(null);
  const [revisions, setRevisions] = useState<CompositeRevision[]>([]);

  // State: Correction Loop
  const [correctionInput, setCorrectionInput] = useState('');
  const [refining, setRefining] = useState(false);

  // State: Canvas HUD & Overlays
  const [showBiometricHUD, setShowBiometricHUD] = useState(true);
  const [showScanlines, setShowScanlines] = useState(true);
  const [cursorCoords, setCursorCoords] = useState<{ x: number; y: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // State: Saving Case Dossier
  const [savingCase, setSavingCase] = useState(false);
  const [caseSavedId, setCaseSavedId] = useState<string | null>(null);
  const [caseTitle, setCaseTitle] = useState('Sector 7 Suspect Investigation');
  const [incidentType, setIncidentType] = useState('Armed Robbery');

  // Error/Status banner
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  // Cleanup Web Speech Synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, []);

  // Handle Language Switch
  const handleSelectLanguage = (lang: LanguageOption) => {
    setSelectedLang(lang);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingDeposition(false);
      setSpeakingSummary(false);
    }

    // If currently matching an existing case preset, switch statement to that language
    const caseData = MULTILINGUAL_TESTIMONIALS[activeCaseKey];
    if (caseData && caseData.translations[lang.code]) {
      setStatement(caseData.translations[lang.code]);
      setStatusBanner(`Switched testimony language to ${lang.name} (${lang.nativeName}). Ready for voice and AI synthesis.`);
    } else {
      setStatusBanner(`Language configured to ${lang.name} (${lang.nativeName}). Speak or type description in ${lang.name}.`);
    }
  };

  // Handle Preset Case Select
  const handleSelectCasePreset = (caseKey: string) => {
    setActiveCaseKey(caseKey);
    const caseData = MULTILINGUAL_TESTIMONIALS[caseKey];
    if (!caseData) return;

    const translatedText = caseData.translations[selectedLang.code] || caseData.translations['en-US'];
    setStatement(translatedText);
    setContextNote(caseData.context);
    setTraits(null);
    setCurrentComposite(null);
    setUncertainTraits([]);
    setContradictions([]);
    setCaseSavedId(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingDeposition(false);
      setSpeakingSummary(false);
    }
    setStatusBanner(`Loaded preset: ${caseData.badge} (${caseData.title}) in ${selectedLang.name}. Click "GENERATE FACIAL COMPOSITE".`);
  };

  // VOICE INPUT: Speech-to-Text Voice Dictation
  const toggleVoiceRecording = () => {
    if (speechRecognizing || audioSimActive) {
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch (_) {}
      }
      setSpeechRecognizing(false);
      setAudioSimActive(false);
      setStatusBanner('Voice deposition stream stopped.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = selectedLang.code; // Uses currently selected language!

        recognition.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript;
            }
          }
          if (transcript) {
            setStatement(prev => prev ? `${prev} ${transcript.trim()}` : transcript.trim());
            setStatusBanner(`Transcribed (${selectedLang.name}): "${transcript.trim()}"`);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setSpeechRecognizing(false);
          setAudioSimActive(false);
          setStatusBanner(`Microphone error: ${event.error}. Switching to simulated stream.`);
          startSimulatedDeposition();
        };

        recognition.onend = () => {
          setSpeechRecognizing(false);
          setAudioSimActive(false);
        };

        speechRecognitionRef.current = recognition;
        recognition.start();
        setSpeechRecognizing(true);
        setAudioSimActive(true);
        setStatusBanner(`Listening in ${selectedLang.name} (${selectedLang.nativeName}). Speak into microphone...`);
        return;
      } catch (err) {
        console.warn('SpeechRecognition initialization error:', err);
      }
    }

    // Fallback: Simulated voice stream in selected language
    startSimulatedDeposition();
  };

  const startSimulatedDeposition = () => {
    setAudioSimActive(true);
    setStatusBanner(`Simulating eyewitness voice deposition in ${selectedLang.name}...`);
    const caseData = MULTILINGUAL_TESTIMONIALS[activeCaseKey] || MULTILINGUAL_TESTIMONIALS['case1'];
    const fullText = caseData.translations[selectedLang.code] || caseData.translations['en-US'];
    const chunks = fullText.split('. ').map(s => s.trim() + '.');

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < chunks.length) {
        setStatement(chunks.slice(0, idx + 1).join(' '));
        idx++;
      } else {
        clearInterval(interval);
        setAudioSimActive(false);
        setStatusBanner(`Voice deposition complete in ${selectedLang.name}.`);
      }
    }, 1200);
  };

  // VOICE OUTPUT: Text-to-Speech (Can Say with Voice)
  const speakText = (text: string, isSummary: boolean = false) => {
    if (!('speechSynthesis' in window)) {
      setErrorBanner('Speech synthesis voice engine is not supported in this browser.');
      return;
    }

    // If currently speaking this target, toggle pause or stop
    if ((isSummary && speakingSummary) || (!isSummary && speakingDeposition)) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsSpeechPaused(false);
        setStatusBanner('Resumed voice readout.');
      } else {
        window.speechSynthesis.pause();
        setIsSpeechPaused(true);
        setStatusBanner('Paused voice readout.');
      }
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingDeposition(false);
    setSpeakingSummary(false);
    setIsSpeechPaused(false);

    if (!text.trim()) {
      setErrorBanner('No text available to speak.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLang.code;
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    // Try finding matching voice for language
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(selectedLang.code.slice(0, 2)));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      if (isSummary) {
        setSpeakingSummary(true);
        setSpeakingDeposition(false);
        setStatusBanner(`Reading forensic biometric summary aloud in ${selectedLang.name}...`);
      } else {
        setSpeakingDeposition(true);
        setSpeakingSummary(false);
        setStatusBanner(`Speaking eyewitness deposition aloud in ${selectedLang.name}...`);
      }
    };

    utterance.onend = () => {
      setSpeakingDeposition(false);
      setSpeakingSummary(false);
      setIsSpeechPaused(false);
      setStatusBanner('Voice playback finished.');
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      setSpeakingDeposition(false);
      setSpeakingSummary(false);
      setIsSpeechPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopAllSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeakingDeposition(false);
      setSpeakingSummary(false);
      setIsSpeechPaused(false);
      setStatusBanner('Voice audio stopped.');
    }
  };

  // Canvas Mouse Move for Biometric HUD Cursor Coordinates
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setCursorCoords({ x, y });
  };

  // Step 1: Analyze Witness Statement (Trait Extraction)
  const handleAnalyzeStatement = async () => {
    if (!statement.trim()) {
      setErrorBanner('Please enter an eyewitness statement to deconstruct.');
      return;
    }
    setAnalyzing(true);
    setErrorBanner(null);
    setStatusBanner(`Deconstructing 12 anatomical parameters with Gemini (${selectedLang.name} input)...`);

    try {
      const res = await api.analyzeWitnessStatement(statement, contextNote);
      setTraits(res.traits);
      setForensicSummary(res.forensic_summary);
      setSynthesisPrompt(res.synthesis_prompt);
      setUncertainTraits(res.uncertain_traits || res.traits.uncertain_traits || []);
      setContradictions(res.contradictions || res.traits.contradictions || []);
      setStatusBanner('Biometric parameters cataloged. Ready to synthesize composite.');
      return res;
    } catch (err: any) {
      setErrorBanner(err.message || 'Analysis failed. Check backend connection.');
      return null;
    } finally {
      setAnalyzing(false);
    }
  };

  // Step 2: One-Click Direct Generate or Trait-Based Generate
  const handleGenerateComposite = async () => {
    if (!statement.trim()) {
      setErrorBanner('Please enter an eyewitness statement to generate a composite.');
      return;
    }

    setGenerating(true);
    setErrorBanner(null);
    setStatusBanner(`Synthesizing photorealistic human facial composite from ${selectedLang.name} description...`);

    try {
      let currentTraits = traits;
      let promptToUse = synthesisPrompt;

      if (!currentTraits) {
        setStatusBanner(`Analyzing eyewitness testimony in ${selectedLang.name} before facial synthesis...`);
        const analysisRes = await api.analyzeWitnessStatement(statement, contextNote);
        currentTraits = analysisRes.traits;
        promptToUse = analysisRes.synthesis_prompt;
        setTraits(currentTraits);
        setForensicSummary(analysisRes.forensic_summary);
        setSynthesisPrompt(promptToUse);
        setUncertainTraits(analysisRes.uncertain_traits || analysisRes.traits.uncertain_traits || []);
        setContradictions(analysisRes.contradictions || analysisRes.traits.contradictions || []);
      }

      setStatusBanner('Rendering documentary-grade forensic portrait...');
      const res = await api.generateComposite({
        traits: currentTraits,
        witness_notes: statement,
        custom_prompt_enhancements: promptToUse || statement,
      });

      const initialRev: CompositeRevision = {
        ...res,
        revision_number: 1,
        extracted_traits: currentTraits,
        prompt_used: res.prompt_used || promptToUse,
        created_at: new Date().toISOString()
      };

      setCurrentComposite(initialRev);
      setRevisions([initialRev]);
      setCaseSavedId(null);
      setStatusBanner('Photorealistic suspect composite synthesized (Revision #1).');
    } catch (err: any) {
      setErrorBanner(err.message || 'Image generation failed. Ensure backend server is active.');
    } finally {
      setGenerating(false);
    }
  };

  // Step 3: Refine / Correct Composite
  const handleRefineComposite = async () => {
    if (!correctionInput.trim()) {
      setErrorBanner('Please specify a witness modification instruction.');
      return;
    }

    if (!currentComposite) {
      const enrichedStatement = `${statement.trim()}\nEyewitness correction note: ${correctionInput.trim()}`;
      setStatement(enrichedStatement);
      setCorrectionInput('');
      setStatusBanner(`Added modification "${correctionInput.trim()}" to deposition. Synthesizing composite...`);
      setTimeout(() => handleGenerateComposite(), 100);
      return;
    }

    setRefining(true);
    setErrorBanner(null);
    const targetRev = currentComposite.revision_number + 1;
    setStatusBanner(`Applying witness delta: "${correctionInput}" to Revision #${targetRev}...`);

    try {
      const res = await api.refineComposite({
        previous_image_url: currentComposite.image_url,
        current_traits: traits || currentComposite.extracted_traits || {},
        correction_feedback: correctionInput,
        revision_number: currentComposite.revision_number,
      });

      const updatedRev: CompositeRevision = {
        ...res,
        revision_number: targetRev,
        extracted_traits: res.traits || res.extracted_traits || traits,
        correction_instruction: correctionInput,
        created_at: new Date().toISOString()
      };

      setCurrentComposite(updatedRev);
      if (updatedRev.extracted_traits) {
        setTraits(updatedRev.extracted_traits);
      }
      setRevisions(prev => [updatedRev, ...prev]);
      setCorrectionInput('');
      setCaseSavedId(null);
      setStatusBanner(`Revision #${targetRev} synthesized based on witness correction.`);
    } catch (err: any) {
      setErrorBanner(err.message || 'Refinement failed.');
    } finally {
      setRefining(false);
    }
  };

  // Step 4: Persist into Case Studies
  const handleSaveToCase = async () => {
    if (!currentComposite) return;
    setSavingCase(true);
    setErrorBanner(null);

    try {
      const caseNumber = `CF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const saved = await api.createCase({
        case_number: caseNumber,
        title: caseTitle,
        incident_type: incidentType,
        location: contextNote || 'Metropolitan Sector',
        summary: statement,
        status: 'Active Investigation',
        primary_composite_url: currentComposite.image_url,
        initial_traits: traits || undefined,
        witness_statement: `[Language: ${selectedLang.name}]\n${statement}`,
      });

      setCaseSavedId(saved.id);
      setStatusBanner(`Investigation Case ${caseNumber} successfully recorded into persistent archives.`);
    } catch (err: any) {
      setErrorBanner(err.message || 'Failed to archive case.');
    } finally {
      setSavingCase(false);
    }
  };

  // Safe Cross-Browser Download Handler
  const handleDownloadComposite = async () => {
    if (!currentComposite) return;
    const downloadFilename = `CrimeFace_Composite_Rev${currentComposite.revision_number}.jpg`;
    const imageSrc = currentComposite.image_base64 || resolveImageUrl(currentComposite.image_url);

    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      setStatusBanner(`Exported forensic portrait: ${downloadFilename}`);
    } catch (e) {
      const link = document.createElement('a');
      link.href = imageSrc;
      link.download = downloadFilename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSelectRevision = (rev: CompositeRevision) => {
    setCurrentComposite(rev);
    if (rev.extracted_traits) {
      setTraits(rev.extracted_traits);
    }
    setStatusBanner(`Loaded Revision #${rev.revision_number} into biometric canvas.`);
  };

  const handleQuickAdjustmentClick = (chip: string) => {
    if (currentComposite) {
      setCorrectionInput(prev => prev ? `${prev}, ${chip}` : chip);
      setStatusBanner(`Added "${chip}" to conversational delta instructions.`);
    } else {
      setStatement(prev => prev ? `${prev}. Eyewitness note: ${chip}.` : chip);
      setStatusBanner(`Appended "${chip}" to witness deposition.`);
    }
  };

  const renderTraitValue = (val?: string) => {
    if (!val || val.toLowerCase() === 'unknown') {
      return (
        <span className="text-slate-500 italic font-mono text-[10px] bg-slate-900/60 px-1.5 py-0.5 rounded border border-slate-800">
          [UNSPECIFIED]
        </span>
      );
    }
    return (
      <span className="text-cyan-200 font-semibold font-mono text-xs">
        {val}
      </span>
    );
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Forensic Command Ribbon */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a0e1a] via-[#0f1424] to-[#070a12] border border-cyan-500/30 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] corner-bracket">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 cyan-pulse-indicator mr-1.5" />
                HUD ACTIVE // MULTI-LANGUAGE VOICE ENGINE
              </span>
              <span className="text-xs font-mono text-slate-400">
                PIPELINE 2.5 // {selectedLang.name.toUpperCase()}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-wide mt-1.5 flex items-center gap-3">
              <span>FORENSIC RECONSTRUCTION STUDIO</span>
              <span className="hidden sm:inline-block text-xs font-mono font-medium text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-950/40">
                VOICE & BIOMETRICS
              </span>
            </h1>
            
            <p className="text-xs text-slate-400 font-mono mt-1 max-w-2xl">
              Deconstruct verbal eyewitness statements in 10 languages with interactive voice readout, real human face synthesis, and conversational corrections.
            </p>
          </div>

          {/* Preset Quick Loaders */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-[#06080e]/80 border border-[#1b2336] p-2.5 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1">
              <FolderArchive className="w-3 h-3 text-cyan-400" />
              Eyewitness Testimonials:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['case1', 'case2', 'case3'].map((cKey) => {
                const cData = MULTILINGUAL_TESTIMONIALS[cKey];
                const isActive = activeCaseKey === cKey;
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => handleSelectCasePreset(cKey)}
                    className={`group px-3 py-1.5 text-[11px] font-mono rounded-lg border transition-all flex items-center space-x-1 shadow-sm active:scale-95 ${
                      isActive
                        ? 'bg-cyan-950/90 text-cyan-200 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                        : 'bg-[#111726] hover:bg-[#1a233a] text-slate-300 hover:text-cyan-300 border-cyan-500/20'
                    }`}
                  >
                    <span className="text-cyan-400 font-bold">{cData.badge}</span>
                    <span className="text-slate-400 group-hover:text-slate-200">({cData.type})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Bar */}
      {statusBanner && (
        <div className="p-3.5 rounded-xl bg-cyan-950/50 border border-cyan-500/50 flex items-center space-x-3 text-xs font-mono text-cyan-200 shadow-[0_0_20px_rgba(0,240,255,0.15)] animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="flex-1">{statusBanner}</span>
          <button 
            onClick={() => setStatusBanner(null)}
            className="text-cyan-400/60 hover:text-cyan-200 text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}
      {errorBanner && (
        <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/60 flex items-center space-x-3 text-xs font-mono text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.2)] animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="flex-1">{errorBanner}</span>
          <button 
            onClick={() => setErrorBanner(null)}
            className="text-red-400/60 hover:text-red-200 text-xs px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Studio Dual-Column Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Witness Narrative + 12 Anatomical Parameters (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Witness Statement Deposition */}
          <div className="forensic-glass rounded-2xl p-5 border border-cyan-500/20 shadow-xl relative">
            
            {/* Header: Title + Language & Voice Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100 flex items-center gap-1.5">
                    <span>1. Eyewitness Deposition</span>
                    <span className="text-cyan-400 font-normal">[{selectedLang.code}]</span>
                  </h2>
                  <span className="text-[10px] text-slate-500 font-mono">
                    MULTILINGUAL AUDIO & TEXT INPUT
                  </span>
                </div>
              </div>

              {/* Voice Action Ribbon (Speak Aloud & Record) */}
              <div className="flex items-center space-x-2">
                
                {/* Text-to-Speech: Listen to testimony */}
                <button
                  type="button"
                  onClick={() => speakText(statement, false)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] font-mono border transition-all ${
                    speakingDeposition
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)] animate-pulse'
                      : 'bg-[#101420] border-slate-700 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40'
                  }`}
                  title="Speak eyewitness statement out loud with native voice pronunciation"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    {speakingDeposition
                      ? isSpeechPaused ? 'RESUME' : 'PAUSE'
                      : 'SAY VOICE'}
                  </span>
                  {speakingDeposition && !isSpeechPaused && (
                    <div className="flex items-end space-x-0.5 h-3 ml-0.5">
                      <span className="w-0.5 bg-cyan-400 eq-bar-1" />
                      <span className="w-0.5 bg-cyan-400 eq-bar-2" />
                      <span className="w-0.5 bg-cyan-400 eq-bar-3" />
                    </div>
                  )}
                </button>

                {/* Stop speech button if active */}
                {(speakingDeposition || speakingSummary) && (
                  <button
                    type="button"
                    onClick={stopAllSpeech}
                    className="p-1 rounded bg-red-950/80 border border-red-500/50 text-red-300 hover:bg-red-900"
                    title="Stop voice speech"
                  >
                    <Square className="w-3 h-3 fill-red-400" />
                  </button>
                )}

                {/* Speech-to-Text: Dictate with microphone */}
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono border transition-all ${
                    speechRecognizing || audioSimActive
                      ? 'bg-red-950/80 border-red-400 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.3)] animate-pulse'
                      : 'bg-[#101420] border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
                  }`}
                  title="Dictate testimony into microphone or test speech stream"
                >
                  {speechRecognizing || audioSimActive ? (
                    <>
                      <Mic className="w-3 h-3 text-red-400" />
                      <span>REC [{selectedLang.code.slice(0, 2).toUpperCase()}]</span>
                      <div className="flex items-end space-x-0.5 h-3 ml-0.5">
                        <span className="w-0.5 bg-red-400 eq-bar-1" />
                        <span className="w-0.5 bg-red-400 eq-bar-2" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3 text-cyan-400" />
                      <span>MIC</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Language Selector Bar (10 Languages) */}
            <div className="mb-3 p-2 rounded-xl bg-[#080b13] border border-[#182033] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <Languages className="w-3 h-3 text-cyan-400" />
                  Deposition Language ({SUPPORTED_LANGUAGES.length}):
                </span>
                <span className="text-cyan-300 font-bold">{selectedLang.flag} {selectedLang.name}</span>
              </div>

              {/* Horizontal Scrollable Language Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {SUPPORTED_LANGUAGES.map((lang) => {
                  const isSelected = selectedLang.code === lang.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => handleSelectLanguage(lang)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono shrink-0 transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? 'bg-cyan-950 border border-cyan-400 text-cyan-200 font-bold shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                          : 'bg-[#0f1422] hover:bg-[#151c2e] text-slate-400 hover:text-slate-200 border border-[#1b2336]'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Statement Textarea */}
            <div className="relative">
              <textarea
                rows={5}
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                placeholder={`Describe the suspect in ${selectedLang.name} or speak via microphone...`}
                className="w-full bg-[#07090f] border border-[#1b2336] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl p-3.5 text-xs font-mono text-white placeholder-slate-600 outline-none transition-all leading-relaxed"
              />
              <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-slate-500 flex items-center gap-2">
                <span>{selectedLang.flag} {selectedLang.code}</span>
                <span>|</span>
                <span>{statement.length} chars</span>
              </div>
            </div>

            {/* Scene Context & Lighting */}
            <div className="mt-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                  <span>Scene Illumination & Environmental Context</span>
                </label>
              </div>

              <input
                type="text"
                value={contextNote}
                onChange={(e) => setContextNote(e.target.value)}
                placeholder="e.g. Fluorescent street lamp, night illumination"
                className="w-full bg-[#07090f] border border-[#1b2336] focus:border-cyan-400 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none"
              />

              {/* Quick Lighting Preset Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {LIGHTING_PRESETS.map((light, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setContextNote(light)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all ${
                      contextNote === light
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                        : 'bg-[#0d121e] hover:bg-[#161d30] text-slate-400 hover:text-cyan-300 border-[#182032]'
                    }`}
                  >
                    + {light}
                  </button>
                ))}
              </div>
            </div>

            {/* Dual Action Center: Always Visible Generation & Analysis */}
            <div className="mt-4 pt-4 border-t border-[#182033] space-y-2.5">
              
              {/* PRIMARY BUTTON: One-Click Instant Composite Synthesis */}
              <button
                type="button"
                onClick={handleGenerateComposite}
                disabled={generating || !statement.trim()}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-sky-400 hover:from-cyan-300 hover:to-sky-300 active:scale-[0.99] text-slate-950 font-heading font-extrabold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-[0_0_25px_rgba(0,240,255,0.35)] disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>SYNTHESIZING REAL HUMAN FACIAL COMPOSITE...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>GENERATE FACIAL COMPOSITE</span>
                    <ArrowRight className="w-4 h-4 text-slate-950" />
                  </>
                )}
              </button>

              {/* SECONDARY BUTTON: Deconstruct 12 Anatomical Traits */}
              <button
                type="button"
                onClick={handleAnalyzeStatement}
                disabled={analyzing || !statement.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0e1424] hover:bg-[#141d33] active:scale-[0.99] text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 hover:border-cyan-400/60 font-mono text-xs font-semibold tracking-wider transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    <span>CATALOGING 12 ANATOMICAL TRAITS...</span>
                  </>
                ) : (
                  <>
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>DECONSTRUCT 12 ANATOMICAL PARAMETERS</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Biometric Trait Parameters (12 Features) */}
          <div className="forensic-glass rounded-2xl p-5 border border-cyan-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
                    2. Anatomical Trait Breakdown
                  </h2>
                  <span className="text-[10px] text-slate-500 font-mono">
                    12 STANDARDIZED FORENSIC ATTRIBUTES
                  </span>
                </div>
              </div>

              {traits && (
                <div className="flex items-center space-x-1.5 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 rounded-md text-[10px] font-mono text-cyan-300">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  <span>CONFIDENCE: {Math.round((traits.confidence_score || 0.92) * 100)}%</span>
                </div>
              )}
            </div>

            {traits ? (
              <div className="space-y-4">
                
                {/* Forensic Clinical Summary + Voice Readout */}
                {forensicSummary && (
                  <div className="p-3.5 rounded-xl bg-[#090d18] border border-cyan-500/30 text-xs font-mono text-slate-300">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-cyan-400 font-bold text-[10px] uppercase">
                        // CLINICAL RECONSTRUCTION SUMMARY:
                      </span>
                      
                      {/* Voice button for summary */}
                      <button
                        type="button"
                        onClick={() => speakText(forensicSummary, true)}
                        className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] flex items-center space-x-1 hover:bg-cyan-900"
                        title="Listen to clinical forensic summary"
                      >
                        <Volume2 className="w-3 h-3 text-cyan-400" />
                        <span>{speakingSummary ? 'PLAYING...' : 'SAY SUMMARY'}</span>
                      </button>
                    </div>
                    <p className="italic text-slate-200">
                      "{forensicSummary}"
                    </p>
                  </div>
                )}

                {/* Contradiction Flag Alert */}
                {contradictions && contradictions.length > 0 && (
                  <div className="bg-red-950/50 border border-red-500/60 p-3.5 rounded-xl text-xs font-mono text-red-200 space-y-1.5 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                    <div className="flex items-center space-x-2 font-bold text-red-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>CONTRADICTORY WITNESS STATEMENTS DETECTED</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-red-300 space-y-0.5">
                      {contradictions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Uncertainty Flag Alert */}
                {uncertainTraits && uncertainTraits.length > 0 && (
                  <div className="bg-amber-950/40 border border-amber-500/50 p-3.5 rounded-xl text-xs font-mono text-amber-200 space-y-1.5 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                    <div className="flex items-center space-x-2 font-bold text-amber-400">
                      <HelpCircle className="w-4 h-4" />
                      <span>WITNESS UNCERTAINTY TRACKED</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-amber-300 space-y-0.5">
                      {uncertainTraits.map((u, i) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Grouped 12-Feature Biometric Pods */}
                <div className="space-y-3">
                  
                  {/* Category 1: Cranial Structure */}
                  <div className="bg-[#070910] border border-[#172033] rounded-xl p-3">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                      I. CRANIAL & JAW STRUCTURE
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="bg-[#0c101d] p-2 rounded-lg border border-[#1b253b]">
                        <span className="text-slate-500 block text-[9px]">AGE ESTIMATE</span>
                        {renderTraitValue(traits.age_range)}
                      </div>
                      <div className="bg-[#0c101d] p-2 rounded-lg border border-[#1b253b]">
                        <span className="text-slate-500 block text-[9px]">GENDER</span>
                        {renderTraitValue(traits.gender)}
                      </div>
                      <div className="bg-[#0c101d] p-2 rounded-lg border border-[#1b253b]">
                        <span className="text-slate-500 block text-[9px]">FACE SHAPE</span>
                        {renderTraitValue(traits.face_shape)}
                      </div>
                      <div className="bg-[#0c101d] p-2 rounded-lg border border-[#1b253b]">
                        <span className="text-slate-500 block text-[9px]">FOREHEAD</span>
                        {renderTraitValue(traits.forehead)}
                      </div>
                      <div className="bg-[#0c101d] p-2 rounded-lg border border-[#1b253b]">
                        <span className="text-slate-500 block text-[9px]">JAWLINE</span>
                        {renderTraitValue(traits.jawline)}
                      </div>
                      <div className="bg-[#0c101d] p-2 rounded-lg border border-[#1b253b]">
                        <span className="text-slate-500 block text-[9px]">CHIN</span>
                        {renderTraitValue(traits.chin)}
                      </div>
                    </div>
                  </div>

                  {/* Category 2: Ocular & Brow */}
                  <div className="bg-[#070910] border border-[#172033] rounded-xl p-3">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                      II. OCULAR & BROW GEOMETRY
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="bg-[#0c101d] p-2 rounded-lg border border-[#1b253b]">
                        <span className="text-slate-500 block text-[9px]">EYEBROWS</span>
                        {renderTraitValue(traits.eyebrows)}
                      </div>
                      <div className="bg-[#0c101d] p-2 rounded-lg border border-[#1b253b]">
                        <span className="text-slate-500 block text-[9px]">EYES & SPACING</span>
                        {renderTraitValue(traits.eyes)}
                      </div>
                    </div>
                  </div>

                  {/* Category 3: Nasal & Oral */}
                  <div className="bg-[#070910] border border-[#172033] rounded-xl p-3">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                      III. NASAL & ORAL FEATURES
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="bg-[#0c101d] p-2 rounded-lg border border-[#1b253b]">
                        <span className="text-slate-500 block text-[9px]">NOSE SHAPE/WIDTH</span>
                        {renderTraitValue(traits.nose)}
                      </div>
                      <div className="bg-[#0c101d] p-2 rounded-lg border border-[#1b253b]">
                        <span className="text-slate-500 block text-[9px]">LIPS & MOUTH</span>
                        {renderTraitValue(traits.lips_and_mouth)}
                      </div>
                    </div>
                  </div>

                  {/* Category 4: Hair, Beard & Scars */}
                  <div className="bg-[#070910] border border-[#172033] rounded-xl p-3">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
                      IV. HAIR, BEARD & DISTINCTIVE SCARS
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="bg-[#0c101d] p-2 rounded-lg border border-[#1b253b]">
                        <span className="text-slate-500 block text-[9px]">HAIR & TEXTURE</span>
                        {renderTraitValue(traits.hair)}
                      </div>
                      <div className="bg-[#0c101d] p-2 rounded-lg border border-[#1b253b]">
                        <span className="text-slate-500 block text-[9px]">FACIAL HAIR</span>
                        {renderTraitValue(traits.facial_hair)}
                      </div>

                      {traits.distinctive_features && traits.distinctive_features.length > 0 && (
                        <div className="bg-[#0e1424] p-2.5 rounded-lg border border-cyan-500/40 col-span-2">
                          <span className="text-cyan-400 font-bold block text-[10px]">
                            DISTINCTIVE MARKS / SCARS:
                          </span>
                          <ul className="list-disc list-inside text-slate-200 mt-1 space-y-0.5">
                            {traits.distinctive_features.map((feat, i) => (
                              <li key={i}>{feat}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="py-10 text-center space-y-3 border border-dashed border-[#1c2230] rounded-xl p-4">
                <Sliders className="w-8 h-8 text-cyan-500/50 mx-auto" />
                <p className="text-xs font-mono text-slate-400">
                  Traits not yet deconstructed. Click below to synthesize composite or extract parameters.
                </p>
                <button
                  type="button"
                  onClick={handleGenerateComposite}
                  disabled={generating || !statement.trim()}
                  className="px-4 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold transition-all shadow-md"
                >
                  Synthesize Face Directly →
                </button>
              </div>
            )}
          </div>

          {/* Section 5: Save Dossier to Case Studies */}
          {currentComposite && (
            <div className="forensic-glass rounded-2xl p-5 border border-cyan-500/20 shadow-xl">
              <div className="flex items-center space-x-2.5 mb-3.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Save to Classified Case Archive
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Investigation Dossier Title
                  </label>
                  <input
                    type="text"
                    value={caseTitle}
                    onChange={(e) => setCaseTitle(e.target.value)}
                    className="w-full bg-[#07090f] border border-[#1b2336] focus:border-cyan-400 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Incident Classification
                  </label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full bg-[#07090f] border border-[#1b2336] focus:border-cyan-400 rounded-lg px-3 py-2 text-xs font-mono text-white outline-none"
                  >
                    <option value="Armed Robbery">Armed Robbery</option>
                    <option value="Corporate Espionage">Corporate Espionage</option>
                    <option value="Cyber Intrusion">Cyber Intrusion</option>
                    <option value="Burglary">Burglary</option>
                    <option value="Assault">Assault</option>
                    <option value="Extortion">Extortion</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSaveToCase}
                  disabled={savingCase}
                  className={`w-full py-3 px-4 rounded-xl font-mono text-xs font-bold tracking-wider transition-all flex items-center justify-center space-x-2 ${
                    caseSavedId
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-[#121a2c] hover:bg-[#1a253e] active:scale-[0.99] text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {savingCase 
                      ? 'ARCHIVING DOSSIER...' 
                      : caseSavedId 
                      ? 'ARCHIVE AGAIN AS NEW DOSSIER' 
                      : 'ARCHIVE COMPOSITE TO DOSSIER'}
                  </span>
                </button>

                {caseSavedId && (
                  <Link
                    to="/cases"
                    className="block text-center text-xs font-mono text-cyan-400 hover:text-cyan-200 underline mt-2"
                  >
                    View in Case Studies Archive →
                  </Link>
                )}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Biometric Canvas + HUD Landmarks + Conversational Refinement (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Biometric Image Canvas Pod */}
          <div className="forensic-glass rounded-2xl overflow-hidden shadow-2xl relative border border-cyan-500/30">
            
            {/* Canvas Header Bar */}
            <div className="bg-[#080b12] border-b border-[#1b2336] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2.5">
                <Scan className="w-4 h-4 text-[#00f0ff]" />
                <span className="font-mono text-xs text-slate-100 font-bold tracking-wider">
                  BIOMETRIC FACIAL COMPOSITE CANVAS
                </span>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center space-x-2">
                {currentComposite && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowBiometricHUD(!showBiometricHUD)}
                      title="Toggle Biometric Landmarks HUD"
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono transition-all flex items-center space-x-1.5 ${
                        showBiometricHUD
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                          : 'bg-[#101420] border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Crosshair className="w-3 h-3 text-cyan-400" />
                      <span>{showBiometricHUD ? 'HUD: ON' : 'HUD: OFF'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowScanlines(!showScanlines)}
                      title="Toggle Scanline Filter"
                      className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono transition-all flex items-center space-x-1.5 ${
                        showScanlines
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                          : 'bg-[#101420] border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>{showScanlines ? 'SCAN: ON' : 'SCAN: OFF'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadComposite}
                      title="Export Forensic Portrait to Device"
                      className="px-2.5 py-1 rounded-lg bg-[#111828] hover:bg-[#1a253e] border border-cyan-500/40 text-cyan-300 hover:text-white transition-all flex items-center space-x-1.5 text-[10px] font-mono active:scale-95"
                    >
                      <Download className="w-3 h-3 text-cyan-400" />
                      <span>EXPORT</span>
                    </button>

                    <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-cyan-950/90 border border-cyan-500/60 text-cyan-300 font-extrabold shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                      REV #{currentComposite.revision_number}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Display Canvas Viewport with Crosshairs */}
            <div 
              ref={canvasRef}
              onMouseMove={handleCanvasMouseMove}
              onMouseLeave={() => setCursorCoords(null)}
              className="relative aspect-square max-h-[520px] mx-auto bg-[#030407] flex items-center justify-center overflow-hidden cursor-crosshair select-none"
            >
              
              {currentComposite ? (
                <>
                  <img
                    src={currentComposite.image_base64 || resolveImageUrl(currentComposite.image_url)}
                    alt="AI Forensic Suspect Composite"
                    className="w-full h-full object-cover"
                  />

                  {/* Scanline filter overlay */}
                  {showScanlines && (
                    <div className="absolute inset-0 pointer-events-none scanline opacity-30" />
                  )}

                  {/* Interactive Biometric Landmarks HUD Overlay */}
                  {showBiometricHUD && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      
                      {/* Cranial Ellipse Reticle */}
                      <div className="w-64 h-80 border border-cyan-400/30 rounded-full" />
                      
                      {/* Axis crosshair lines */}
                      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-cyan-400/20" />
                      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-cyan-400/20" />
                      
                      {/* Anatomical Landmark Anchors */}
                      <div className="absolute top-[37%] left-[34%] -translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border border-cyan-400/80 rounded-full animate-ping opacity-40" />
                        <div className="w-3 h-3 border border-red-500/80 rounded-full absolute inset-0.5" />
                        <span className="text-[8px] font-mono text-cyan-300 absolute -top-3.5 -left-4 bg-black/70 px-1 rounded">
                          [L_ORBIT]
                        </span>
                      </div>

                      <div className="absolute top-[37%] right-[34%] translate-x-1/2 -translate-y-1/2">
                        <div className="w-4 h-4 border border-cyan-400/80 rounded-full animate-ping opacity-40" />
                        <div className="w-3 h-3 border border-red-500/80 rounded-full absolute inset-0.5" />
                        <span className="text-[8px] font-mono text-cyan-300 absolute -top-3.5 -left-2 bg-black/70 px-1 rounded">
                          [R_ORBIT]
                        </span>
                      </div>

                      <div className="absolute top-[54%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]" />
                        <span className="text-[8px] font-mono text-cyan-300 absolute -bottom-3.5 -left-4 bg-black/70 px-1 rounded">
                          [NASION]
                        </span>
                      </div>

                      <div className="absolute top-[78%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-6 h-1 border-b-2 border-cyan-400/70" />
                        <span className="text-[8px] font-mono text-cyan-300 absolute -bottom-3.5 -left-4 bg-black/70 px-1 rounded">
                          [GNATHION]
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Live Coordinates HUD Ribbon */}
                  {cursorCoords && (
                    <div className="absolute bottom-10 left-3 bg-[#05070dc0] backdrop-blur-md border border-cyan-500/40 px-2.5 py-1 rounded text-[9px] font-mono text-cyan-300 pointer-events-none">
                      X: {cursorCoords.x}% | Y: {cursorCoords.y}% | ANATOMICAL_COORD
                    </div>
                  )}

                  {/* Top-Left Classified Watermark */}
                  <div className="absolute top-3 left-3 bg-[#06080de0] backdrop-blur-md border border-cyan-500/40 px-2.5 py-1 rounded-md text-[10px] font-mono text-cyan-300 flex items-center space-x-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>FORENSIC COMPOSITE // REV #{currentComposite.revision_number}</span>
                  </div>

                  {/* Bottom-Right Biometric Calibration Tag */}
                  <div className="absolute bottom-3 right-3 bg-[#06080de0] backdrop-blur-md border border-cyan-500/40 px-2.5 py-1 rounded-md text-[10px] font-mono text-slate-400 shadow-lg">
                    <span>1:1 NEURAL PROJECTION</span>
                  </div>
                </>
              ) : (
                <div className="text-center p-8 space-y-4">
                  <div className="relative w-20 h-20 rounded-full bg-[#0b0f1a] border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                    <User className="w-10 h-10" />
                    <div className="absolute inset-0 rounded-full border border-cyan-500/40 border-t-transparent animate-radar pointer-events-none" />
                  </div>
                  <div>
                    <h3 className="text-slate-300 font-mono text-xs font-bold uppercase tracking-wider">
                      Biometric Canvas Ready
                    </h3>
                    <p className="text-[11px] font-mono text-slate-500 max-w-sm mt-1">
                      Choose a language and case on the left, then click "GENERATE FACIAL COMPOSITE" to reconstruct the face.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Revisions History Timeline Bar (Version Management) */}
            {revisions.length > 0 && (
              <div className="bg-[#07090f] border-t border-[#1b2336] p-3.5 flex items-center space-x-3 overflow-x-auto">
                <span className="text-[10px] font-mono text-slate-400 shrink-0 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-bold text-slate-300">REVISIONS ({revisions.length}):</span>
                </span>
                
                {revisions.map((rev, index) => {
                  const isActive = currentComposite?.revision_number === rev.revision_number;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectRevision(rev)}
                      className={`relative w-14 h-14 rounded-xl border overflow-hidden shrink-0 transition-all ${
                        isActive
                          ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_0_12px_rgba(0,240,255,0.35)] scale-105'
                          : 'border-[#1b2336] opacity-60 hover:opacity-100 hover:border-cyan-500/50'
                      }`}
                    >
                      <img
                        src={rev.image_base64 || resolveImageUrl(rev.image_url)}
                        alt={`Revision ${rev.revision_number}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[9px] font-mono text-cyan-300 text-center font-bold py-0.5">
                        v{rev.revision_number}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 4: Eyewitness Conversational Image Correction */}
          <div className="forensic-glass rounded-2xl p-5 border border-cyan-500/20 shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
                    3. Eyewitness Conversational Delta Correction
                  </h2>
                  <span className="text-[10px] text-slate-500 font-mono">
                    TARGETED REFINEMENT WITH BASELINE REFERENCE
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono mb-3.5">
              Refine specific anatomical features in any language while keeping untouched facial landmarks strictly preserved.
            </p>

            <div className="space-y-3">
              <textarea
                rows={3}
                value={correctionInput}
                onChange={(e) => setCorrectionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleRefineComposite();
                  }
                }}
                placeholder="Witness adjustment: 'Make nose wider', 'Reduce beard thickness', 'Add eyebrow scar', 'Recede hairline by 1cm'..."
                className="w-full bg-[#07090f] border border-[#1b2336] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl p-3.5 text-xs font-mono text-white placeholder-slate-600 outline-none transition-all leading-relaxed"
              />

              {/* Categorized Quick Delta Pills (Always Unlocked) */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Quick Witness Adjustments (Click to add):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Make nose wider',
                    'Reduce beard thickness',
                    'Recede hairline by 1cm',
                    'Make eyebrows thicker',
                    'Sharpen jawline',
                    'Add horizontal scar on left cheek',
                    'Narrow eye spacing slightly',
                    'Add greyish stubble'
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickAdjustmentClick(chip)}
                      className="px-2.5 py-1 text-[10px] font-mono rounded-lg bg-[#0d121e] hover:bg-[#161d30] text-slate-300 hover:text-cyan-300 border border-[#182032] hover:border-cyan-500/40 active:scale-95 transition-all"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply Delta Action Button */}
              <button
                type="button"
                onClick={handleRefineComposite}
                disabled={refining || (!correctionInput.trim() && !currentComposite)}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#121c2e] to-[#1a2944] hover:from-[#18263e] hover:to-[#22365a] active:scale-[0.99] text-[#00f0ff] border border-cyan-500/40 hover:border-cyan-400 font-heading font-extrabold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2.5 shadow-[0_0_20px_rgba(0,240,255,0.18)] disabled:opacity-50"
              >
                {refining ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#00f0ff]" />
                    <span>SYNTHESIZING REVISED COMPOSITE...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>
                      {currentComposite
                        ? 'APPLY WITNESS CORRECTION (CREATE NEW REVISION)'
                        : 'GENERATE COMPOSITE WITH CORRECTION'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default ForensicStudioPage;
