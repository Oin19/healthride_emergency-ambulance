import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: { features: "Features", how: "How It Works", safety: "Safety", contact: "Contact", request: "Request Ambulance", signin: "Sign In" },
      hero: {
        badge: "AI-Powered Emergency Response",
        title1: "Every Second", title2: "Counts.",
        subtitle: "HealthRide dispatches the nearest ambulance using AI, tracks it live, and connects you to the right hospital — with insurance handled before you arrive.",
        cta: "Request Ambulance Now", learn: "See How It Works",
      },
      emergency: {
        header: "EMERGENCY REQUEST",
        step1_title: "Where are you?", step1_sub: "We need your location to dispatch the nearest ambulance.",
        detect: "Detect My Location", detecting: "Detecting Location...", detected: "Location Detected",
        or_manual: "or enter manually", loc_placeholder: "Building name, street, landmark...",
        continue: "Continue", back: "Back",
        step2_title: "Emergency Details", step2_sub: "Select the type of emergency and provide patient info.",
        types: { cardiac: "Cardiac Emergency", trauma: "Trauma / Injury", stroke: "Stroke / Neuro", burns: "Burns", breathing: "Breathing Difficulty", other: "Other Emergency" },
        patient_name: "Patient name (optional)", contact: "Contact number", notes_ph: "Additional notes (symptoms, conditions...)",
        dispatch: "Dispatch Ambulance",
        voice_hold: "Hold to speak emergency", voice_recording: "Recording... release to send", voice_processing: "Transcribing...",
        voice_filled: "Form pre-filled from your description",
        signin_required: "You need to sign in to request an ambulance",
      },
      lang: { label: "Language" },
    },
  },
  hi: {
    translation: {
      nav: { features: "विशेषताएँ", how: "यह कैसे काम करता है", safety: "सुरक्षा", contact: "संपर्क", request: "एम्बुलेंस बुलाएँ", signin: "साइन इन" },
      hero: {
        badge: "एआई-संचालित आपातकालीन प्रतिक्रिया",
        title1: "हर सेकंड", title2: "मायने रखता है।",
        subtitle: "HealthRide एआई के ज़रिए निकटतम एम्बुलेंस भेजता है, लाइव ट्रैक करता है, और सही अस्पताल से जोड़ता है — बीमा पहुँचने से पहले ही संभाल लिया जाता है।",
        cta: "अभी एम्बुलेंस बुलाएँ", learn: "यह कैसे काम करता है देखें",
      },
      emergency: {
        header: "आपातकालीन अनुरोध",
        step1_title: "आप कहाँ हैं?", step1_sub: "निकटतम एम्बुलेंस भेजने के लिए हमें आपका स्थान चाहिए।",
        detect: "मेरा स्थान पहचानें", detecting: "स्थान पहचाना जा रहा है...", detected: "स्थान पहचाना गया",
        or_manual: "या मैन्युअली दर्ज करें", loc_placeholder: "इमारत, गली, लैंडमार्क...",
        continue: "आगे बढ़ें", back: "पीछे",
        step2_title: "आपातकाल विवरण", step2_sub: "आपातकाल का प्रकार चुनें और मरीज़ की जानकारी दें।",
        types: { cardiac: "हृदय आपातकाल", trauma: "चोट / आघात", stroke: "स्ट्रोक / न्यूरो", burns: "जलना", breathing: "साँस लेने में तकलीफ़", other: "अन्य आपातकाल" },
        patient_name: "मरीज़ का नाम (वैकल्पिक)", contact: "संपर्क नंबर", notes_ph: "अतिरिक्त नोट्स (लक्षण, स्थिति...)",
        dispatch: "एम्बुलेंस भेजें",
        voice_hold: "बोलने के लिए दबाकर रखें", voice_recording: "रिकॉर्डिंग... छोड़ें भेजने के लिए", voice_processing: "ट्रांसक्राइब हो रहा है...",
        voice_filled: "आपके विवरण से फॉर्म भर दिया गया",
        signin_required: "एम्बुलेंस अनुरोध के लिए साइन इन करें",
      },
      lang: { label: "भाषा" },
    },
  },
  bn: {
    translation: {
      nav: { features: "বৈশিষ্ট্য", how: "এটি কীভাবে কাজ করে", safety: "নিরাপত্তা", contact: "যোগাযোগ", request: "অ্যাম্বুলেন্স ডাকুন", signin: "সাইন ইন" },
      hero: {
        badge: "এআই-চালিত জরুরি সাড়া",
        title1: "প্রতিটি সেকেন্ড", title2: "গুরুত্বপূর্ণ।",
        subtitle: "HealthRide এআই ব্যবহার করে নিকটতম অ্যাম্বুলেন্স পাঠায়, লাইভ ট্র্যাক করে এবং সঠিক হাসপাতালে সংযোগ করে — পৌঁছানোর আগেই বীমা সামলে দেয়।",
        cta: "এখনই অ্যাম্বুলেন্স ডাকুন", learn: "এটি কীভাবে কাজ করে দেখুন",
      },
      emergency: {
        header: "জরুরি অনুরোধ",
        step1_title: "আপনি কোথায়?", step1_sub: "নিকটতম অ্যাম্বুলেন্স পাঠাতে আপনার অবস্থান দরকার।",
        detect: "আমার অবস্থান শনাক্ত করুন", detecting: "অবস্থান শনাক্ত হচ্ছে...", detected: "অবস্থান শনাক্ত হয়েছে",
        or_manual: "অথবা ম্যানুয়ালি লিখুন", loc_placeholder: "বিল্ডিং, রাস্তা, ল্যান্ডমার্ক...",
        continue: "এগিয়ে যান", back: "পেছনে",
        step2_title: "জরুরি বিবরণ", step2_sub: "জরুরির ধরন নির্বাচন করুন এবং রোগীর তথ্য দিন।",
        types: { cardiac: "হৃদরোগ জরুরি", trauma: "আঘাত", stroke: "স্ট্রোক / নিউরো", burns: "পোড়া", breathing: "শ্বাসকষ্ট", other: "অন্যান্য জরুরি" },
        patient_name: "রোগীর নাম (ঐচ্ছিক)", contact: "যোগাযোগ নম্বর", notes_ph: "অতিরিক্ত নোট (উপসর্গ, অবস্থা...)",
        dispatch: "অ্যাম্বুলেন্স পাঠান",
        voice_hold: "কথা বলতে চেপে ধরুন", voice_recording: "রেকর্ড হচ্ছে... ছাড়লে পাঠাবে", voice_processing: "ট্রান্সক্রাইব হচ্ছে...",
        voice_filled: "আপনার বিবরণ থেকে ফর্ম পূরণ হয়েছে",
        signin_required: "অ্যাম্বুলেন্স অনুরোধের জন্য সাইন ইন করুন",
      },
      lang: { label: "ভাষা" },
    },
  },
  ta: {
    translation: {
      nav: { features: "அம்சங்கள்", how: "எப்படி இயங்குகிறது", safety: "பாதுகாப்பு", contact: "தொடர்பு", request: "ஆம்புலன்ஸ் கோரு", signin: "உள்நுழை" },
      hero: {
        badge: "AI இயங்கும் அவசர பதில்",
        title1: "ஒவ்வொரு விநாடியும்", title2: "முக்கியம்.",
        subtitle: "HealthRide AI மூலம் அருகிலுள்ள ஆம்புலன்ஸை அனுப்பி, நேரலையில் கண்காணித்து, சரியான மருத்துவமனையுடன் இணைக்கிறது — நீங்கள் வருமுன்பே காப்பீடு கையாளப்படும்.",
        cta: "இப்போது ஆம்புலன்ஸ் கோரு", learn: "எப்படி இயங்குகிறது என்று பார்",
      },
      emergency: {
        header: "அவசர கோரிக்கை",
        step1_title: "நீங்கள் எங்கே இருக்கிறீர்கள்?", step1_sub: "அருகிலுள்ள ஆம்புலன்ஸ் அனுப்ப உங்கள் இருப்பிடம் தேவை.",
        detect: "என் இருப்பிடத்தை கண்டறி", detecting: "இருப்பிடம் கண்டறியப்படுகிறது...", detected: "இருப்பிடம் கண்டறியப்பட்டது",
        or_manual: "அல்லது கைமுறையாக உள்ளிடு", loc_placeholder: "கட்டிடம், தெரு, அடையாளம்...",
        continue: "தொடர்", back: "பின்",
        step2_title: "அவசர விவரம்", step2_sub: "அவசர வகையைத் தேர்ந்தெடுத்து நோயாளி விவரம் கொடுக்க.",
        types: { cardiac: "இதய அவசரம்", trauma: "காயம்", stroke: "பக்கவாதம்", burns: "தீக்காயம்", breathing: "மூச்சுத் திணறல்", other: "பிற அவசரம்" },
        patient_name: "நோயாளியின் பெயர் (விருப்பம்)", contact: "தொடர்பு எண்", notes_ph: "கூடுதல் குறிப்புகள் (அறிகுறிகள்...)",
        dispatch: "ஆம்புலன்ஸ் அனுப்பு",
        voice_hold: "பேச பிடித்திரு", voice_recording: "பதிவு செய்யப்படுகிறது... விட்டால் அனுப்பும்", voice_processing: "மொழிபெயர்க்கப்படுகிறது...",
        voice_filled: "உங்கள் விவரத்திலிருந்து படிவம் நிரப்பப்பட்டது",
        signin_required: "ஆம்புலன்ஸ் கோர உள்நுழைக",
      },
      lang: { label: "மொழி" },
    },
  },
  te: {
    translation: {
      nav: { features: "ఫీచర్లు", how: "ఇది ఎలా పనిచేస్తుంది", safety: "భద్రత", contact: "సంప్రదించండి", request: "అంబులెన్స్ కోరండి", signin: "సైన్ ఇన్" },
      hero: {
        badge: "AI ఆధారిత అత్యవసర ప్రతిస్పందన",
        title1: "ప్రతి క్షణం", title2: "ముఖ్యం.",
        subtitle: "HealthRide AI ద్వారా సమీప అంబులెన్స్‌ను పంపి, లైవ్ ట్రాక్ చేసి, సరైన ఆసుపత్రికి కలుపుతుంది — మీరు చేరుకోకముందే బీమా నిర్వహించబడుతుంది.",
        cta: "ఇప్పుడు అంబులెన్స్ కోరండి", learn: "ఇది ఎలా పనిచేస్తుందో చూడండి",
      },
      emergency: {
        header: "అత్యవసర అభ్యర్థన",
        step1_title: "మీరు ఎక్కడ ఉన్నారు?", step1_sub: "సమీప అంబులెన్స్ పంపేందుకు మీ లొకేషన్ అవసరం.",
        detect: "నా లొకేషన్ గుర్తించు", detecting: "లొకేషన్ గుర్తిస్తోంది...", detected: "లొకేషన్ గుర్తించబడింది",
        or_manual: "లేదా మాన్యువల్‌గా నమోదు చేయండి", loc_placeholder: "భవనం, వీధి, ల్యాండ్‌మార్క్...",
        continue: "కొనసాగించు", back: "వెనుకకు",
        step2_title: "అత్యవసర వివరాలు", step2_sub: "అత్యవసర రకాన్ని ఎంచుకుని పేషెంట్ సమాచారం ఇవ్వండి.",
        types: { cardiac: "గుండె అత్యవసరం", trauma: "గాయం", stroke: "స్ట్రోక్", burns: "కాలిన గాయాలు", breathing: "శ్వాస కష్టం", other: "ఇతర అత్యవసరం" },
        patient_name: "పేషెంట్ పేరు (ఐచ్ఛికం)", contact: "సంప్రదింపు నంబర్", notes_ph: "అదనపు గమనికలు (లక్షణాలు...)",
        dispatch: "అంబులెన్స్ పంపండి",
        voice_hold: "మాట్లాడటానికి పట్టుకోండి", voice_recording: "రికార్డ్ అవుతోంది... వదిలితే పంపబడుతుంది", voice_processing: "ట్రాన్స్‌క్రైబ్ అవుతోంది...",
        voice_filled: "మీ వివరణ నుండి ఫారం నింపబడింది",
        signin_required: "అంబులెన్స్ కోసం సైన్ ఇన్ చేయండి",
      },
      lang: { label: "భాష" },
    },
  },
};

const saved = typeof window !== "undefined" ? localStorage.getItem("healthride_lang") : null;

i18n.use(initReactI18next).init({
  resources,
  lng: saved || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export const supportedLanguages = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
];

export default i18n;