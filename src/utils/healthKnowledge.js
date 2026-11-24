import { appendAIDisclaimer } from './aiLanguage.js'

const languageCodes = ['en', 'te', 'tanglish', 'hi', 'hi-roman']

const labels = {
  en: {
    what: 'What it might be:',
    care: 'Home care:',
    redFlags: 'Get urgent medical help if',
    specialist: 'Recommended specialist:',
    didYouMean: 'Did you mean?',
    correction: 'Did you mean: {condition}? (You typed: {typed})',
    clarify: 'Could you share more details? Tell me where it is, when it started, and whether you have pain, fever, or other symptoms.',
    suggestions: 'Did you mean one of these: ',
    duration: 'You mentioned this has lasted for',
    multiple: 'Because you mentioned more than one symptom, a General Physician can assess them together.',
    urgent: 'If symptoms are severe or getting worse, seek in-person care now.',
  },
  te: {
    what: 'ఇది ఏమై ఉండవచ్చు:',
    care: 'ఇంట్లో సాధారణ జాగ్రత్తలు:',
    redFlags: 'ఈ లక్షణాలు ఉంటే వెంటనే వైద్య సహాయం పొందండి:',
    specialist: 'సిఫార్సు చేసే వైద్యుడు:',
    didYouMean: 'తదుపరి సూచనలు:',
    correction: 'మీ ఉద్దేశం {condition}నా? (మీరు టైప్ చేసింది: {typed})',
    clarify: 'మరింత వివరంగా చెబుతారా? ఎక్కడ ఉంది, ఎప్పుడు మొదలైంది, నొప్పి, జ్వరం లేదా ఇతర లక్షణాలు ఉన్నాయా చెప్పండి.',
    suggestions: 'మీరు వీటిలో దేనిని ఉద్దేశించారా: ',
    duration: 'మీరు ఇది ఇంతకాలంగా ఉందని చెప్పారు:',
    multiple: 'ఒకటి కంటే ఎక్కువ లక్షణాలు ఉన్నందున, జనరల్ ఫిజిషియన్ వాటిని కలిపి పరిశీలించగలరు.',
    urgent: 'లక్షణాలు తీవ్రంగా ఉంటే లేదా పెరుగుతుంటే వెంటనే ప్రత్యక్ష వైద్య సహాయం పొందండి.',
  },
  tanglish: {
    what: 'Idi deni valla avvachu:',
    care: 'Intlo teesukovalsina jagrattalu:',
    redFlags: 'Ee lakshanalu unte ventane medical help teesukondi:',
    specialist: 'Recommended specialist:',
    didYouMean: 'Next suggestions:',
    correction: 'Meeru {condition} anukunnara? (Meeru type chesindi: {typed})',
    clarify: 'Inka details chepthara? Ekkada undi, eppudu start ayyindi, pain, fever leda vere symptoms unnayo cheppandi.',
    suggestions: 'Meeru veetilo edaina anukunnara: ',
    duration: 'Meeru idi intha kalam nundi undani chepparu:',
    multiple: 'Okati kanna ekkuva symptoms unnayi kabatti, General Physician vatini kalipi assess cheyyagalru.',
    urgent: 'Symptoms severe ga unte leda perigite ventane in-person medical care teesukondi.',
  },
  hi: {
    what: 'यह किस वजह से हो सकता है:',
    care: 'घर पर सामान्य देखभाल:',
    redFlags: 'इन लक्षणों पर तुरंत चिकित्सा सहायता लें:',
    specialist: 'सुझाया गया विशेषज्ञ:',
    didYouMean: 'क्या आप इनमें से कुछ ढूँढ रहे हैं?',
    correction: 'क्या आपका मतलब {condition} था? (आपने लिखा: {typed})',
    clarify: 'क्या आप और जानकारी देंगे? यह कहाँ है, कब शुरू हुआ, और क्या दर्द, बुखार या अन्य लक्षण हैं?',
    suggestions: 'क्या आपका मतलब इनमें से किसी से है: ',
    duration: 'आपने बताया कि यह इतने समय से है:',
    multiple: 'एक से अधिक लक्षण होने पर जनरल फिजिशियन उनका साथ में मूल्यांकन कर सकते हैं।',
    urgent: 'लक्षण गंभीर हों या बढ़ रहे हों तो तुरंत प्रत्यक्ष चिकित्सा लें।',
  },
  'hi-roman': {
    what: 'Yeh kis wajah se ho sakta hai:',
    care: 'Ghar par aam dekhbhaal:',
    redFlags: 'In lakshanon par turant medical help lein:',
    specialist: 'Sujhaya gaya specialist:',
    didYouMean: 'Kya aap inmein se kuch dhoondh rahe hain?',
    correction: 'Kya aapka matlab {condition} tha? (Aapne likha: {typed})',
    clarify: 'Kya aap aur jaankari denge? Yeh kahan hai, kab shuru hua, aur kya dard, bukhar ya doosre symptoms hain?',
    suggestions: 'Kya aapka matlab inmein se kisi se hai: ',
    duration: 'Aapne bataya ki yeh itne samay se hai:',
    multiple: 'Ek se zyada symptoms par General Physician unka saath mein assessment kar sakte hain.',
    urgent: 'Symptoms severe hon ya badh rahe hon to turant in-person medical care lein.',
  },
}

const localizedNames = {
  fever: { en: 'fever', te: 'జ్వరం', tanglish: 'fever', hi: 'बुखार', 'hi-roman': 'bukhar' },
  headache: { en: 'headache', te: 'తలనొప్పి', tanglish: 'headache', hi: 'सिरदर्द', 'hi-roman': 'sir dard' },
  cold: { en: 'a cold', te: 'జలుబు', tanglish: 'cold', hi: 'सर्दी', 'hi-roman': 'sardi' },
  cough: { en: 'cough', te: 'దగ్గు', tanglish: 'cough', hi: 'खाँसी', 'hi-roman': 'khansi' },
  diarrhea: { en: 'loose motions', te: 'విరేచనాలు', tanglish: 'loose motions', hi: 'दस्त', 'hi-roman': 'dast' },
  constipation: { en: 'constipation', te: 'మలబద్ధకం', tanglish: 'constipation', hi: 'कब्ज', 'hi-roman': 'kabz' },
  stomach: { en: 'stomach pain', te: 'కడుపు నొప్పి', tanglish: 'kadupu noppi', hi: 'पेट दर्द', 'hi-roman': 'pet dard' },
  acidity: { en: 'acidity or gas', te: 'అసిడిటీ లేదా గ్యాస్', tanglish: 'acidity leda gas', hi: 'एसिडिटी या गैस', 'hi-roman': 'acidity ya gas' },
  vomiting: { en: 'vomiting or nausea', te: 'వాంతులు లేదా వికారం', tanglish: 'vomiting leda nausea', hi: 'उल्टी या मतली', 'hi-roman': 'ulti ya matli' },
  bodyPain: { en: 'body pain', te: 'శరీర నొప్పి', tanglish: 'body pain', hi: 'शरीर में दर्द', 'hi-roman': 'badan dard' },
  jointPain: { en: 'joint pain', te: 'కీళ్ల నొప్పి', tanglish: 'joint pain', hi: 'जोड़ों का दर्द', 'hi-roman': 'jodon ka dard' },
  legPain: { en: 'leg pain', te: 'కాలి నొప్పి', tanglish: 'kalu noppi', hi: 'पैर में दर्द', 'hi-roman': 'pair mein dard' },
  kneePain: { en: 'knee pain', te: 'మోకాలి నొప్పి', tanglish: 'mokaali noppi', hi: 'घुटने में दर्द', 'hi-roman': 'ghutne mein dard' },
  backPain: { en: 'back pain', te: 'నడుము నొప్పి', tanglish: 'nadumu noppi', hi: 'कमर दर्द', 'hi-roman': 'kamar dard' },
  shoulderPain: { en: 'shoulder pain', te: 'భుజం నొప్పి', tanglish: 'bhujam noppi', hi: 'कंधे का दर्द', 'hi-roman': 'kandhe ka dard' },
  chestPain: { en: 'chest pain', te: 'ఛాతి నొప్పి', tanglish: 'chest pain', hi: 'सीने में दर्द', 'hi-roman': 'seene mein dard' },
  breathing: { en: 'breathing difficulty', te: 'శ్వాస తీసుకోవడంలో ఇబ్బంది', tanglish: 'breathing problem', hi: 'साँस लेने में कठिनाई', 'hi-roman': 'saans lene mein dikkat' },
  diabetes: { en: 'diabetes or high blood sugar', te: 'మధుమేహం లేదా అధిక రక్త చక్కెర', tanglish: 'diabetes leda sugar ekkuva', hi: 'मधुमेह या अधिक ब्लड शुगर', 'hi-roman': 'diabetes ya high blood sugar' },
  bloodPressure: { en: 'blood pressure concern', te: 'రక్తపోటు సమస్య', tanglish: 'blood pressure problem', hi: 'ब्लड प्रेशर की समस्या', 'hi-roman': 'blood pressure ki problem' },
  skin: { en: 'skin irritation', te: 'చర్మ సమస్య', tanglish: 'skin problem', hi: 'त्वचा की समस्या', 'hi-roman': 'skin ki problem' },
  allergy: { en: 'allergy symptoms', te: 'అలర్జీ లక్షణాలు', tanglish: 'allergy symptoms', hi: 'एलर्जी के लक्षण', 'hi-roman': 'allergy ke symptoms' },
  eye: { en: 'eye problem', te: 'కంటి సమస్య', tanglish: 'eye problem', hi: 'आँख की समस्या', 'hi-roman': 'aankh ki problem' },
  ear: { en: 'ear problem', te: 'చెవి సమస్య', tanglish: 'ear problem', hi: 'कान की समस्या', 'hi-roman': 'kaan ki problem' },
  tooth: { en: 'tooth or gum pain', te: 'పంటి లేదా చిగుళ్ల నొప్పి', tanglish: 'tooth leda gum pain', hi: 'दाँत या मसूड़े का दर्द', 'hi-roman': 'daant ya masude ka dard' },
  throat: { en: 'throat pain', te: 'గొంతు నొప్పి', tanglish: 'gonthu noppi', hi: 'गले में दर्द', 'hi-roman': 'gale mein dard' },
  dizziness: { en: 'dizziness', te: 'తల తిరగడం', tanglish: 'dizziness', hi: 'चक्कर', 'hi-roman': 'chakkar' },
  weakness: { en: 'weakness', te: 'బలహీనత', tanglish: 'weakness', hi: 'कमज़ोरी', 'hi-roman': 'kamzori' },
  fatigue: { en: 'fatigue', te: 'అలసట', tanglish: 'fatigue', hi: 'थकान', 'hi-roman': 'thakaan' },
  sleep: { en: 'sleep difficulty', te: 'నిద్ర సమస్య', tanglish: 'nidra problem', hi: 'नींद की समस्या', 'hi-roman': 'neend ki problem' },
  anxiety: { en: 'anxiety', te: 'ఆందోళన', tanglish: 'anxiety', hi: 'चिंता', 'hi-roman': 'chinta' },
  stress: { en: 'stress', te: 'ఒత్తిడి', tanglish: 'stress', hi: 'तनाव', 'hi-roman': 'tanaav' },
  depression: { en: 'low mood or depression', te: 'మానసిక దిగులు', tanglish: 'low mood leda depression', hi: 'उदासी या अवसाद', 'hi-roman': 'udaasi ya depression' },
  periods: { en: 'period concern', te: 'పీరియడ్స్ సమస్య', tanglish: 'periods problem', hi: 'मासिक धर्म की समस्या', 'hi-roman': 'periods ki problem' },
  discharge: { en: 'vaginal discharge', te: 'తెల్లబట్ట సమస్య', tanglish: 'white discharge', hi: 'योनि स्राव', 'hi-roman': 'vaginal discharge' },
  urine: { en: 'urine problem', te: 'మూత్ర సమస్య', tanglish: 'urine problem', hi: 'पेशाब की समस्या', 'hi-roman': 'peshab ki problem' },
  swelling: { en: 'swelling', te: 'వాపు', tanglish: 'vappu', hi: 'सूजन', 'hi-roman': 'sujan' },
  wound: { en: 'wound or injury', te: 'గాయం', tanglish: 'gaayam', hi: 'घाव या चोट', 'hi-roman': 'ghaav ya chot' },
  bleeding: { en: 'bleeding', te: 'రక్తస్రావం', tanglish: 'bleeding', hi: 'खून बहना', 'hi-roman': 'khoon behna' },
  hair: { en: 'hair loss', te: 'జుట్టు రాలడం', tanglish: 'ventruka raladam', hi: 'बाल झड़ना', 'hi-roman': 'baal jhadna' },
  weight: { en: 'weight change', te: 'బరువు మార్పు', tanglish: 'weight change', hi: 'वज़न में बदलाव', 'hi-roman': 'wazan mein badlav' },
  weightLoss: { en: 'unexplained weight loss', te: 'కారణం తెలియని బరువు తగ్గడం', tanglish: 'reason teliyani weight loss', hi: 'बिना कारण वज़न घटना', 'hi-roman': 'bina wajah wazan ghatna' },
  weightGain: { en: 'weight gain', te: 'బరువు పెరగడం', tanglish: 'weight gain', hi: 'वज़न बढ़ना', 'hi-roman': 'wazan badhna' },
  childFever: { en: 'fever in a child', te: 'పిల్లలకు జ్వరం', tanglish: 'pillalaki fever', hi: 'बच्चे को बुखार', 'hi-roman': 'bachche ko bukhar' },
  childCough: { en: 'cough in a child', te: 'పిల్లలకు దగ్గు', tanglish: 'pillalaki cough', hi: 'बच्चे को खाँसी', 'hi-roman': 'bachche ko khansi' },
  pregnancy: { en: 'pregnancy', te: 'గర్భధారణ', tanglish: 'pregnancy', hi: 'गर्भावस्था', 'hi-roman': 'garbhavastha' },
  anemia: { en: 'anemia', te: 'రక్తహీనత', tanglish: 'anemia', hi: 'खून की कमी', 'hi-roman': 'khoon ki kami' },
  thyroid: { en: 'thyroid problem', te: 'థైరాయిడ్ సమస్య', tanglish: 'thyroid problem', hi: 'थायरॉइड समस्या', 'hi-roman': 'thyroid problem' },
  arthritis: { en: 'arthritis', te: 'కీళ్ల వాపు', tanglish: 'arthritis', hi: 'गठिया', 'hi-roman': 'gathiya' },
  sinus: { en: 'sinus problem', te: 'సైనస్ సమస్య', tanglish: 'sinus problem', hi: 'साइनस समस्या', 'hi-roman': 'sinus problem' },
  kidneyStone: { en: 'kidney stone', te: 'కిడ్నీ రాయి', tanglish: 'kidney stone', hi: 'गुर्दे की पथरी', 'hi-roman': 'gurde ki pathri' },
  liver: { en: 'liver problem', te: 'కాలేయ సమస్య', tanglish: 'liver problem', hi: 'लिवर की समस्या', 'hi-roman': 'liver ki problem' },
  heart: { en: 'heart problem', te: 'గుండె సమస్య', tanglish: 'heart problem', hi: 'दिल की समस्या', 'hi-roman': 'dil ki problem' },
  cancer: { en: 'cancer concern', te: 'క్యాన్సర్ సంబంధిత ఆందోళన', tanglish: 'cancer concern', hi: 'कैंसर संबंधी चिंता', 'hi-roman': 'cancer ki chinta' },
  hiv: { en: 'HIV', te: 'HIV', tanglish: 'HIV', hi: 'एचआईवी', 'hi-roman': 'HIV' },
  tuberculosis: { en: 'tuberculosis (TB)', te: 'క్షయవ్యాధి (TB)', tanglish: 'tuberculosis (TB)', hi: 'तपेदिक (TB)', 'hi-roman': 'TB' },
  kidneyDisease: { en: 'kidney disease', te: 'మూత్రపిండాల సమస్య', tanglish: 'kidney problem', hi: 'गुर्दे की बीमारी', 'hi-roman': 'gurde ki bimari' },
  cholesterol: { en: 'high cholesterol', te: 'అధిక కొలెస్ట్రాల్', tanglish: 'high cholesterol', hi: 'उच्च कोलेस्ट्रॉल', 'hi-roman': 'high cholesterol' },
  dengue: { en: 'dengue', te: 'డెంగ్యూ', tanglish: 'dengue', hi: 'डेंगू', 'hi-roman': 'dengue' },
  malaria: { en: 'malaria', te: 'మలేరియా', tanglish: 'malaria', hi: 'मलेरिया', 'hi-roman': 'malaria' },
  viralFever: { en: 'viral fever', te: 'వైరల్ జ్వరం', tanglish: 'viral fever', hi: 'वायरल बुखार', 'hi-roman': 'viral bukhar' },
  ulcer: { en: 'stomach ulcer', te: 'కడుపు పుండు', tanglish: 'stomach ulcer', hi: 'पेट का अल्सर', 'hi-roman': 'pet ka ulcer' },
  piles: { en: 'piles or hemorrhoids', te: 'మొలలు', tanglish: 'piles', hi: 'बवासीर', 'hi-roman': 'bawaseer' },
  stroke: { en: 'stroke concern', te: 'స్ట్రోక్ సంబంధిత ఆందోళన', tanglish: 'stroke concern', hi: 'स्ट्रोक संबंधी चिंता', 'hi-roman': 'stroke ki chinta' },
  hepatitis: { en: 'hepatitis', te: 'హెపటైటిస్', tanglish: 'hepatitis', hi: 'हेपेटाइटिस', 'hi-roman': 'hepatitis' },
  uti: { en: 'urinary tract infection', te: 'మూత్ర మార్గ ఇన్ఫెక్షన్', tanglish: 'urine infection', hi: 'मूत्र संक्रमण', 'hi-roman': 'urine infection' },
}

const specialistNames = {
  en: {
    'General Physician': 'General Physician',
    Gastroenterology: 'Gastroenterology',
    Neurology: 'Neurology',
    Cardiology: 'Cardiology / emergency care',
    Pulmonology: 'Pulmonology',
    Dermatology: 'Dermatology',
    Ophthalmology: 'Ophthalmology',
    ENT: 'ENT',
    Dentist: 'Dentist',
    Gynecology: 'Gynecology',
    Urology: 'Urology',
    'Mental health professional': 'Mental health professional',
    Pediatrics: 'Pediatrics',
    Obstetrics: 'Obstetrics',
    'Emergency department': 'Emergency department',
    Endocrinology: 'Endocrinology',
    Orthopedics: 'Orthopedics',
    Oncology: 'Oncology',
    'Infectious disease specialist': 'Infectious disease specialist',
    Nephrology: 'Nephrology',
  },
  te: {
    'General Physician': 'జనరల్ ఫిజిషియన్',
    Gastroenterology: 'గ్యాస్ట్రోఎంటరాలజీ',
    Neurology: 'న్యూరాలజీ',
    Cardiology: 'కార్డియాలజీ / అత్యవసర వైద్యం',
    Pulmonology: 'పల్మనాలజీ',
    Dermatology: 'డెర్మటాలజీ',
    Ophthalmology: 'కంటి వైద్య నిపుణుడు',
    ENT: 'ENT',
    Dentist: 'దంత వైద్యుడు',
    Gynecology: 'గైనకాలజీ',
    Urology: 'యూరాలజీ',
    'Mental health professional': 'మానసిక ఆరోగ్య నిపుణుడు',
    Pediatrics: 'పిల్లల వైద్యుడు',
    Obstetrics: 'ప్రసూతి వైద్యుడు',
    'Emergency department': 'అత్యవసర వైద్య విభాగం',
    Endocrinology: 'ఎండోక్రైనాలజీ',
    Orthopedics: 'ఆర్థోపెడిక్స్',
    Oncology: 'ఆంకాలజీ',
    'Infectious disease specialist': 'ఇన్ఫెక్షియస్ డిసీజ్ నిపుణుడు',
    Nephrology: 'నెఫ్రాలజీ',
  },
  tanglish: {
    'General Physician': 'General Physician',
    Gastroenterology: 'Gastroenterology',
    Neurology: 'Neurology',
    Cardiology: 'Cardiology / emergency care',
    Pulmonology: 'Pulmonology',
    Dermatology: 'Dermatology',
    Ophthalmology: 'Eye specialist',
    ENT: 'ENT',
    Dentist: 'Dentist',
    Gynecology: 'Gynecology',
    Urology: 'Urology',
    'Mental health professional': 'Mental health professional',
    Pediatrics: 'Pediatrician',
    Obstetrics: 'Obstetrician',
    'Emergency department': 'Emergency department',
    Endocrinology: 'Endocrinology',
    Orthopedics: 'Orthopedics',
    Oncology: 'Oncology',
    'Infectious disease specialist': 'Infectious disease specialist',
    Nephrology: 'Nephrology',
  },
  hi: {
    'General Physician': 'जनरल फिजिशियन',
    Gastroenterology: 'गैस्ट्रोएंटरोलॉजी',
    Neurology: 'न्यूरोलॉजी',
    Cardiology: 'कार्डियोलॉजी / आपातकालीन देखभाल',
    Pulmonology: 'पल्मोनोलॉजी',
    Dermatology: 'त्वचा रोग विशेषज्ञ',
    Ophthalmology: 'नेत्र रोग विशेषज्ञ',
    ENT: 'ENT विशेषज्ञ',
    Dentist: 'दंत चिकित्सक',
    Gynecology: 'स्त्री रोग विशेषज्ञ',
    Urology: 'यूरोलॉजी',
    'Mental health professional': 'मानसिक स्वास्थ्य विशेषज्ञ',
    Pediatrics: 'बाल रोग विशेषज्ञ',
    Obstetrics: 'प्रसूति विशेषज्ञ',
    'Emergency department': 'आपातकालीन विभाग',
    Endocrinology: 'एंडोक्रिनोलॉजी',
    Orthopedics: 'हड्डी रोग विशेषज्ञ',
    Oncology: 'ऑन्कोलॉजी',
    'Infectious disease specialist': 'संक्रामक रोग विशेषज्ञ',
    Nephrology: 'नेफ्रोलॉजी',
  },
  'hi-roman': {
    'General Physician': 'General Physician',
    Gastroenterology: 'Gastroenterology',
    Neurology: 'Neurology',
    Cardiology: 'Cardiology / emergency care',
    Pulmonology: 'Pulmonology',
    Dermatology: 'Skin specialist',
    Ophthalmology: 'Eye specialist',
    ENT: 'ENT specialist',
    Dentist: 'Dentist',
    Gynecology: 'Gynecologist',
    Urology: 'Urology',
    'Mental health professional': 'Mental health professional',
    Pediatrics: 'Pediatrician',
    Obstetrics: 'Obstetrician',
    'Emergency department': 'Emergency department',
    Endocrinology: 'Endocrinology',
    Orthopedics: 'Orthopedics',
    Oncology: 'Oncology',
    'Infectious disease specialist': 'Infectious disease specialist',
    Nephrology: 'Nephrology',
  },
}

const guidance = {
  fever: {
    en: { what: 'Fever often accompanies an infection, but it can have other causes.', care: ['Rest and sip water or other suitable fluids.', 'Check your temperature and note when symptoms began.', 'Avoid taking medicines without advice from a clinician or pharmacist.'], redFlags: 'a very high or persistent fever, confusion, stiff neck, severe weakness, or difficulty breathing.' },
    te: { what: 'జ్వరం తరచుగా ఇన్ఫెక్షన్‌తో రావచ్చు, కానీ ఇతర కారణాలు కూడా ఉండవచ్చు.', care: ['విశ్రాంతి తీసుకుని నీళ్లు లేదా తగిన ద్రవాలు కొద్దికొద్దిగా తాగండి.', 'ఉష్ణోగ్రతను కొలిచి లక్షణాలు ఎప్పుడు మొదలయ్యాయో గమనించండి.', 'వైద్యుడు లేదా ఫార్మసిస్ట్ సలహా లేకుండా మందులు వాడకండి.'], redFlags: 'జ్వరం చాలా ఎక్కువగా లేదా ఎక్కువకాలం ఉండటం, గందరగోళం, మెడ బిగుసుకుపోవడం, తీవ్రమైన బలహీనత లేదా శ్వాస ఇబ్బంది.' },
    tanglish: { what: 'Fever infection tho ravachu, kani vere causes kuda undachu.', care: ['Rest teesukoni water leda suitable fluids konchem konchem ga tagandi.', 'Temperature check chesi symptoms eppudu start ayyayo note cheyyandi.', 'Clinician leda pharmacist advice lekunda medicines teesukokandi.'], redFlags: 'fever chaala high ga leda ekkuva rojulu undadam, confusion, neck stiff avvadam, severe weakness leda breathing problem.' },
    hi: { what: 'बुखार अक्सर संक्रमण के साथ होता है, लेकिन इसके अन्य कारण भी हो सकते हैं।', care: ['आराम करें और पानी या उपयुक्त तरल थोड़ी-थोड़ी मात्रा में लें।', 'तापमान मापें और लक्षण शुरू होने का समय नोट करें।', 'डॉक्टर या फार्मासिस्ट की सलाह के बिना दवा न लें।'], redFlags: 'बहुत तेज़ या लंबे समय तक बुखार, भ्रम, गर्दन अकड़ना, गंभीर कमजोरी या साँस लेने में कठिनाई।' },
    'hi-roman': { what: 'Bukhar aksar infection ke saath hota hai, par doosre causes bhi ho sakte hain.', care: ['Aaram karein aur paani ya suitable fluids thoda-thoda lein.', 'Temperature check karke symptoms shuru hone ka samay note karein.', 'Doctor ya pharmacist ki salah ke bina dawa na lein.'], redFlags: 'bahut tez ya lambe samay tak bukhar, confusion, gardan akadna, severe kamzori ya saans lene mein dikkat.' },
  },
  diarrhea: {
    en: { what: 'Loose motions may be caused by food or water infections and other conditions.', care: ['Use packaged ORS mixed exactly as its label directs; take small frequent sips, especially after each loose stool.', 'Drink safe fluids; if tolerated, choose simple foods such as curd rice or banana.', 'Avoid greasy or very spicy foods and monitor urination.'], redFlags: 'blood or black stool, repeated vomiting, very little urine, fainting, severe weakness, severe pain, or symptoms lasting more than 3 days.' },
    te: { what: 'విరేచనాలకు ఆహారం లేదా నీటి ద్వారా వచ్చే ఇన్ఫెక్షన్లు సహా అనేక కారణాలు ఉండవచ్చు.', care: ['ప్యాకెట్ సూచనల ప్రకారం మాత్రమే ORS కలిపి, ప్రతి విరేచనం తర్వాత కొద్దికొద్దిగా తాగండి.', 'సురక్షితమైన ద్రవాలు తాగండి; తట్టుకోగలిగితే పెరుగన్నం లేదా అరటిపండు వంటి తేలికపాటి ఆహారం తీసుకోండి.', 'నూనె లేదా చాలా కారంగా ఉన్న ఆహారాన్ని తగ్గించి, మూత్ర విసర్జనను గమనించండి.'], redFlags: 'మలంలో రక్తం లేదా నల్లటి మలం, పదేపదే వాంతులు, చాలా తక్కువ మూత్రం, మూర్ఛ, తీవ్రమైన బలహీనత లేదా నొప్పి, లేదా 3 రోజులకు మించి లక్షణాలు.' },
    tanglish: { what: 'Loose motions food leda water infection valla ravachu, vere causes kuda undachu.', care: ['Packet instructions prakaram matrame ORS kalapandi; prathi loose motion tharvatha konchem konchem ga tagandi.', 'Safe fluids tagandi; tolerate ayithe perugu annam leda arati pandu tinnandi.', 'Oil/spicy food avoid chesi urine sarigga vastundo gamaninchandi.'], redFlags: 'motion lo blood leda black stool, repeated vomiting, urine chaala takkuva ravatam, fainting, severe weakness/pain, leda 3 days kanna ekkuva symptoms.' },
    hi: { what: 'दस्त भोजन या पानी के संक्रमण और अन्य कारणों से हो सकते हैं।', care: ['पैकेट के निर्देशों के अनुसार ही ORS बनाएँ; हर दस्त के बाद थोड़ी-थोड़ी मात्रा में पिएँ।', 'सुरक्षित तरल लें; सहन हो तो दही-चावल या केला जैसे हल्के भोजन लें।', 'तैलीय या बहुत मसालेदार भोजन से बचें और पेशाब पर ध्यान दें।'], redFlags: 'मल में खून या काला मल, बार-बार उल्टी, बहुत कम पेशाब, बेहोशी, गंभीर कमजोरी या दर्द, या 3 दिनों से अधिक लक्षण।' },
    'hi-roman': { what: 'Dast food ya water infection aur doosre causes se ho sakte hain.', care: ['Packet ke instructions ke mutabik hi ORS banayein; har loose stool ke baad thoda-thoda piyen.', 'Safe fluids lein; suit kare to dahi-chawal ya kela jaisa halka khana lein.', 'Oily ya bahut spicy khane se bachein aur urine par dhyan dein.'], redFlags: 'stool mein blood ya black stool, baar-baar vomiting, bahut kam urine, behoshi, severe kamzori ya pain, ya 3 din se zyada symptoms.' },
  },
  constipation: {
    en: { what: 'Constipation can be related to diet, fluids, activity, medicines, or other causes.', care: ['Drink fluids and include fiber-rich foods if suitable for you.', 'Gentle movement may help if you are able.', 'Avoid straining and do not start laxatives without checking with a clinician or pharmacist.'], redFlags: 'severe or worsening abdominal pain, vomiting, a swollen abdomen, blood in stool, or inability to pass stool or gas.' },
    te: { what: 'మలబద్ధకానికి ఆహారం, ద్రవాలు, కదలిక, మందులు లేదా ఇతర కారణాలు ఉండవచ్చు.', care: ['మీకు తగినట్లయితే ద్రవాలు తాగి, పీచు పదార్థాలు ఉన్న ఆహారం తీసుకోండి.', 'వీలైతే మెల్లగా నడవడం సహాయపడవచ్చు.', 'బలవంతంగా మల విసర్జన చేయకండి; వైద్యుడు లేదా ఫార్మసిస్ట్‌ను అడగకుండా విరేచన మందులు వాడకండి.'], redFlags: 'తీవ్రమైన లేదా పెరుగుతున్న కడుపు నొప్పి, వాంతులు, పొట్ట ఉబ్బరం, మలంలో రక్తం, లేదా మలం/గ్యాస్ వెళ్లకపోవడం.' },
    tanglish: { what: 'Constipation diet, fluids, activity, medicines leda vere causes tho sambandham undachu.', care: ['Meeku suitable ayithe fluids tagi fiber unna food teesukondi.', 'Veedaithe gentle ga nadavadam help avvachu.', 'Force cheyyakandi; clinician/pharmacist ni adagakunda laxative start cheyyakandi.'], redFlags: 'severe leda worsening stomach pain, vomiting, stomach swelling, stool lo blood, leda stool/gas pass kakapovadam.' },
    hi: { what: 'कब्ज़ का संबंध भोजन, तरल, गतिविधि, दवाओं या अन्य कारणों से हो सकता है।', care: ['आपके लिए उचित हो तो तरल लें और रेशेदार भोजन खाएँ।', 'यदि संभव हो तो हल्की गतिविधि करें।', 'ज़ोर न लगाएँ और डॉक्टर या फार्मासिस्ट से पूछे बिना जुलाब न लें।'], redFlags: 'तेज़ या बढ़ता पेट दर्द, उल्टी, पेट फूलना, मल में खून, या मल/गैस न निकलना।' },
    'hi-roman': { what: 'Kabz ka sambandh khane, fluids, activity, medicines ya doosre causes se ho sakta hai.', care: ['Aapke liye theek ho to fluids lein aur fiber wala khana khayein.', 'Agar mumkin ho to halki activity karein.', 'Zor na lagayein aur doctor/pharmacist se poochhe bina laxative na lein.'], redFlags: 'tez ya badhta pet dard, vomiting, pet phoolna, stool mein blood, ya stool/gas pass na hona.' },
  },
  digestive: {
    en: { what: 'Digestive symptoms can have many causes; this chat cannot determine the cause.', care: ['Sip water and choose small, simple meals if tolerated.', 'Avoid foods or drinks that seem to trigger symptoms.', 'Note when symptoms happen and what you ate.'], redFlags: 'severe or persistent pain, blood in vomit or stool, repeated vomiting, fainting, or inability to keep fluids down.' },
    te: { what: 'జీర్ణ సమస్యలకు అనేక కారణాలు ఉండవచ్చు; ఈ చాట్ కారణాన్ని నిర్ధారించలేదు.', care: ['కొద్దికొద్దిగా నీళ్లు తాగి, తట్టుకోగలిగితే తేలికపాటి ఆహారం తీసుకోండి.', 'లక్షణాలు పెంచే ఆహారం లేదా పానీయాలను తగ్గించండి.', 'లక్షణాలు ఎప్పుడు వస్తాయో, ఏ ఆహారం తీసుకున్నారో గమనించండి.'], redFlags: 'తీవ్రమైన లేదా కొనసాగుతున్న నొప్పి, వాంతి/మలంలో రక్తం, పదేపదే వాంతులు, మూర్ఛ, లేదా ద్రవాలు నిలవకపోవడం.' },
    tanglish: { what: 'Digestive symptoms ki chaala causes undachu; ee chat cause ni confirm cheyyaledu.', care: ['Water konchem konchem ga tagi, tolerate ayithe light meals teesukondi.', 'Symptoms trigger chese food/drinks avoid cheyyandi.', 'Symptoms eppudu vastunnayo, emi tinnaro note cheyyandi.'], redFlags: 'severe leda continue ayye pain, vomit/stool lo blood, repeated vomiting, fainting, leda fluids nilavakapovadam.' },
    hi: { what: 'पाचन संबंधी लक्षणों के कई कारण हो सकते हैं; यह चैट कारण तय नहीं कर सकती।', care: ['थोड़ा-थोड़ा पानी पिएँ और सहन हो तो हल्का भोजन करें।', 'जो भोजन या पेय लक्षण बढ़ाए उससे बचें।', 'लक्षण कब होते हैं और आपने क्या खाया, यह नोट करें।'], redFlags: 'तेज़ या लगातार दर्द, उल्टी/मल में खून, बार-बार उल्टी, बेहोशी, या तरल न रुकना।' },
    'hi-roman': { what: 'Digestive symptoms ke kai causes ho sakte hain; yeh chat cause confirm nahi kar sakti.', care: ['Thoda-thoda paani piyen aur suit kare to halka khana lein.', 'Jo food/drink symptoms badhaye usse bachein.', 'Symptoms kab hote hain aur kya khaya tha, note karein.'], redFlags: 'tez ya lagatar pain, vomit/stool mein blood, baar-baar vomiting, behoshi, ya fluids na rukna.' },
  },
  pain: {
    en: { what: 'Pain can come from strain or many other causes; a chat cannot identify the cause.', care: ['Rest from activities that worsen it and move gently as comfortable.', 'Avoid heavy lifting or painful movements for now.', 'Arrange a clinician review if it persists or affects daily activity.'], redFlags: 'sudden severe pain, pain after a major injury, numbness or weakness, fever with a hot swollen joint, or loss of bladder/bowel control.' },
    te: { what: 'నొప్పి కండరాల ఒత్తిడి సహా అనేక కారణాల వల్ల రావచ్చు; చాట్ కారణాన్ని గుర్తించలేదు.', care: ['నొప్పి పెంచే పనులకు విరామం ఇచ్చి, సౌకర్యంగా ఉంటే మెల్లగా కదలండి.', 'ప్రస్తుతం బరువులు ఎత్తడం లేదా నొప్పి కలిగించే కదలికలు తగ్గించండి.', 'నొప్పి కొనసాగితే లేదా రోజువారీ పనులకు ఇబ్బంది అయితే వైద్యుడిని కలవండి.'], redFlags: 'అకస్మాత్తుగా తీవ్రమైన నొప్పి, పెద్ద గాయం తర్వాత నొప్పి, మొద్దుబారడం లేదా బలహీనత, జ్వరంతో వేడిగా వాపిన కీలు, లేదా మూత్ర/మల నియంత్రణ కోల్పోవడం.' },
    tanglish: { what: 'Pain strain tho saha chaala causes valla ravachu; chat cause ni identify cheyyaledu.', care: ['Pain penche activities ki rest ichi, comfortable ga unte gentle ga move avvandi.', 'Ippatiki heavy lifting leda pain iche movements avoid cheyyandi.', 'Pain continue ayina leda daily work affect ayina clinician ni kalavandi.'], redFlags: 'sudden severe pain, major injury tharvatha pain, numbness/weakness, fever tho hot swollen joint, leda urine/stool control povadam.' },
    hi: { what: 'दर्द खिंचाव सहित कई कारणों से हो सकता है; चैट कारण नहीं पहचान सकती।', care: ['जो गतिविधि दर्द बढ़ाए उससे आराम करें और सहज हो तो हल्की गति रखें।', 'अभी भारी चीज़ उठाने या दर्द वाले मूवमेंट से बचें।', 'दर्द बना रहे या रोज़मर्रा के काम प्रभावित हों तो डॉक्टर से मिलें।'], redFlags: 'अचानक तेज दर्द, बड़ी चोट के बाद दर्द, सुन्नपन या कमजोरी, बुखार के साथ गर्म सूजा जोड़, या पेशाब/मल पर नियंत्रण खोना।' },
    'hi-roman': { what: 'Dard strain samet kai causes se ho sakta hai; chat cause nahi pehchan sakti.', care: ['Jo activity dard badhaye usse rest karein, comfortable ho to halki movement karein.', 'Filhaal heavy lifting ya dard wali movement se bachein.', 'Dard bana rahe ya daily kaam prabhavit hon to doctor se milein.'], redFlags: 'achanak tez dard, badi chot ke baad dard, sunnpan ya kamzori, bukhar ke saath garam soojha joint, ya urine/stool control khona.' },
  },
  headache: {
    en: { what: 'Headaches can have many causes, including tension, migraine, or illness.', care: ['Rest somewhere quiet and drink water.', 'Take a break from screens and note possible triggers.', 'Seek a clinician review if headaches recur or affect daily activities.'], redFlags: 'a sudden worst-ever headache, headache after an injury, weakness, confusion, fever with a stiff neck, or vision loss.' },
    te: { what: 'తలనొప్పికి ఒత్తిడి, మైగ్రేన్ లేదా అనారోగ్యం సహా అనేక కారణాలు ఉండవచ్చు.', care: ['ప్రశాంతమైన చోట విశ్రాంతి తీసుకుని నీళ్లు తాగండి.', 'స్క్రీన్‌కు విరామం ఇచ్చి, లక్షణాలు పెంచే కారణాలను గమనించండి.', 'తలనొప్పి మళ్లీ వస్తే లేదా రోజువారీ పనులకు ఇబ్బంది అయితే వైద్యుడిని కలవండి.'], redFlags: 'అకస్మాత్తుగా వచ్చిన అత్యంత తీవ్రమైన తలనొప్పి, గాయం తర్వాత నొప్పి, బలహీనత, గందరగోళం, మెడ బిగుసుకుపోవడంతో జ్వరం లేదా చూపు తగ్గడం.' },
    tanglish: { what: 'Headache tension, migraine leda illness tho saha chaala causes valla ravachu.', care: ['Quiet place lo rest teesukoni water tagandi.', 'Screens nundi break teesukoni triggers note cheyyandi.', 'Headache repeat ayina leda daily activities affect ayina clinician ni kalavandi.'], redFlags: 'sudden ga vachina worst headache, injury tharvatha headache, weakness, confusion, stiff neck tho fever, leda vision loss.' },
    hi: { what: 'सिरदर्द के कई कारण हो सकते हैं, जैसे तनाव, माइग्रेन या बीमारी।', care: ['शांत जगह आराम करें और पानी पिएँ।', 'स्क्रीन से विराम लें और संभावित कारण नोट करें।', 'सिरदर्द लौटे या रोज़मर्रा के काम प्रभावित करे तो डॉक्टर से मिलें।'], redFlags: 'अचानक बहुत तेज़ सिरदर्द, चोट के बाद दर्द, कमजोरी, भ्रम, गर्दन अकड़ने के साथ बुखार, या दृष्टि कम होना।' },
    'hi-roman': { what: 'Sir dard ke kai causes ho sakte hain, jaise tension, migraine ya illness.', care: ['Shaant jagah aaram karein aur paani piyen.', 'Screen se break lein aur possible triggers note karein.', 'Sir dard laute ya daily kaam prabhavit kare to doctor se milein.'], redFlags: 'achanak bahut tez headache, chot ke baad dard, kamzori, confusion, gardan akadne ke saath bukhar, ya nazar kam hona.' },
  },
  stomachPain: {
    en: { what: 'Stomach pain has many possible causes, from indigestion to conditions that need prompt care.', care: ['Rest and sip water if you can keep it down.', 'Avoid heavy meals and do not self-prescribe medicines.', 'Note where the pain is, when it began, and whether it is changing.'], redFlags: 'severe or worsening pain, a hard or swollen abdomen, repeated vomiting, blood, fainting, or pain with pregnancy.' },
    te: { what: 'అజీర్ణం నుంచి త్వరగా వైద్యం అవసరమయ్యే పరిస్థితుల వరకు కడుపు నొప్పికి అనేక కారణాలు ఉండవచ్చు.', care: ['ద్రవాలు నిలిస్తే విశ్రాంతి తీసుకుని కొద్దికొద్దిగా నీళ్లు తాగండి.', 'భారీ భోజనం తగ్గించి, మందులు స్వయంగా వాడకండి.', 'నొప్పి ఎక్కడ ఉంది, ఎప్పుడు మొదలైంది, మారుతోందా గమనించండి.'], redFlags: 'తీవ్రమైన లేదా పెరుగుతున్న నొప్పి, గట్టిగా/ఉబ్బిన పొట్ట, పదేపదే వాంతులు, రక్తం, మూర్ఛ లేదా గర్భధారణలో నొప్పి.' },
    tanglish: { what: 'Stomach pain indigestion nundi urgent care avasaram ayye conditions varaku chaala reasons valla ravachu.', care: ['Fluids nilusthe rest teesukoni water konchem konchem ga tagandi.', 'Heavy meals avoid chesi medicines self ga teesukokandi.', 'Pain ekkada undi, eppudu start ayyindi, marutondo note cheyyandi.'], redFlags: 'severe/worsening pain, hard/swollen stomach, repeated vomiting, blood, fainting, leda pregnancy tho pain.' },
    hi: { what: 'पेट दर्द के कई कारण हो सकते हैं, अपच से लेकर ऐसी स्थितियों तक जिन्हें जल्दी देखभाल चाहिए।', care: ['तरल रुक पा रहे हों तो आराम करें और थोड़ा-थोड़ा पानी पिएँ।', 'भारी भोजन से बचें और स्वयं दवा न लें।', 'दर्द कहाँ है, कब शुरू हुआ और बदल रहा है या नहीं, नोट करें।'], redFlags: 'तेज़ या बढ़ता दर्द, कड़ा/फूला पेट, बार-बार उल्टी, खून, बेहोशी, या गर्भावस्था के साथ दर्द।' },
    'hi-roman': { what: 'Pet dard ke kai causes ho sakte hain, indigestion se lekar jaldi care wali conditions tak.', care: ['Fluids ruk rahe hon to aaram karein aur thoda-thoda paani piyen.', 'Heavy meals se bachein aur khud se dawa na lein.', 'Dard kahan hai, kab shuru hua aur badal raha hai ya nahi note karein.'], redFlags: 'tez ya badhta dard, sakht/phoola pet, baar-baar vomiting, blood, behoshi, ya pregnancy ke saath dard.' },
  },
  acidity: {
    en: { what: 'Acidity or gas can cause upper-abdominal burning or belching, but chest discomfort can also have urgent causes.', care: ['Choose smaller meals and avoid foods that reliably trigger symptoms.', 'Stay upright after eating if that feels comfortable.', 'Discuss frequent or persistent symptoms with a clinician; avoid starting medicines without advice.'], redFlags: 'chest pressure or pain, breathlessness, sweating, faintness, vomiting blood, or severe persistent abdominal pain.' },
    te: { what: 'అసిడిటీ లేదా గ్యాస్ వల్ల పై కడుపులో మంట లేదా తేన్పులు రావచ్చు; ఛాతీ అసౌకర్యానికి అత్యవసర కారణాలు కూడా ఉండవచ్చు.', care: ['చిన్న పరిమాణాల్లో భోజనం చేసి, లక్షణాలు పెంచే ఆహారాన్ని తగ్గించండి.', 'భోజనం తర్వాత సౌకర్యంగా ఉంటే కొంతసేపు నిటారుగా ఉండండి.', 'లక్షణాలు తరచూ లేదా ఎక్కువకాలం ఉంటే వైద్యుడితో చర్చించండి; సలహా లేకుండా మందులు మొదలుపెట్టకండి.'], redFlags: 'ఛాతీ ఒత్తిడి/నొప్పి, శ్వాస ఇబ్బంది, చెమటలు, మూర్ఛలా అనిపించడం, రక్త వాంతి లేదా తీవ్రమైన కొనసాగుతున్న కడుపు నొప్పి.' },
    tanglish: { what: 'Acidity/gas valla upper stomach burning leda burping ravachu; chest discomfort ki urgent causes kuda undachu.', care: ['Small meals teesukoni symptoms trigger chese foods avoid cheyyandi.', 'Comfortable ga unte meal tharvatha konchem sepu upright ga undandi.', 'Symptoms frequent ga/continue ayithe clinician tho discuss cheyyandi; advice lekunda medicines start cheyyakandi.'], redFlags: 'chest pressure/pain, breathlessness, sweating, faint ga anipinchadam, blood vomiting, leda severe persistent stomach pain.' },
    hi: { what: 'एसिडिटी या गैस से पेट के ऊपरी हिस्से में जलन या डकार हो सकती है, लेकिन सीने की परेशानी के गंभीर कारण भी हो सकते हैं।', care: ['थोड़ा-थोड़ा भोजन करें और लक्षण बढ़ाने वाले भोजन से बचें।', 'सुविधाजनक हो तो भोजन के बाद कुछ समय सीधे बैठें।', 'लक्षण बार-बार हों या बने रहें तो डॉक्टर से चर्चा करें; सलाह के बिना दवा शुरू न करें।'], redFlags: 'सीने में दबाव/दर्द, साँस फूलना, पसीना, बेहोशी जैसा लगना, खून की उल्टी, या तेज लगातार पेट दर्द।' },
    'hi-roman': { what: 'Acidity/gas se upper pet mein jalan ya dakaar ho sakti hai, par chest discomfort ke serious causes bhi ho sakte hain.', care: ['Chhota khana lein aur symptoms badhane wale foods se bachein.', 'Theek lage to khane ke baad kuch der seedhe baithein.', 'Symptoms baar-baar hon ya bane rahein to doctor se baat karein; salah ke bina dawa shuru na karein.'], redFlags: 'seene mein pressure/dard, saans phoolna, sweating, behoshi jaisa lagna, khoon ki ulti, ya tez lagatar pet dard.' },
  },
  vomiting: {
    en: { what: 'Vomiting or nausea may come from infection, food, medicines, or other causes.', care: ['Take small frequent sips of water or packaged ORS prepared as directed.', 'Rest and return to simple foods only when you feel able.', 'Avoid self-prescribing anti-vomiting medicines.'], redFlags: 'blood or green vomit, severe abdominal pain, confusion, very little urine, fainting, or inability to keep fluids down.' },
    te: { what: 'వాంతులు లేదా వికారం ఇన్ఫెక్షన్, ఆహారం, మందులు లేదా ఇతర కారణాల వల్ల రావచ్చు.', care: ['నీళ్లు లేదా సూచనల ప్రకారం కలిపిన ప్యాకెట్ ORS‌ను కొద్దికొద్దిగా తరచూ తాగండి.', 'విశ్రాంతి తీసుకుని, వీలైనప్పుడు తేలికపాటి ఆహారం తీసుకోండి.', 'వాంతుల మందులను స్వయంగా వాడకండి.'], redFlags: 'రక్తం లేదా ఆకుపచ్చ వాంతి, తీవ్రమైన కడుపు నొప్పి, గందరగోళం, చాలా తక్కువ మూత్రం, మూర్ఛ లేదా ద్రవాలు నిలవకపోవడం.' },
    tanglish: { what: 'Vomiting/nausea infection, food, medicines leda vere causes valla ravachu.', care: ['Water leda packet instructions prakaram kalipina ORS ni konchem konchem ga frequent ga tagandi.', 'Rest teesukoni, ready ga anipinchinappudu light food teesukondi.', 'Vomiting medicines self ga teesukokandi.'], redFlags: 'blood/green vomit, severe stomach pain, confusion, urine chaala takkuva, fainting, leda fluids nilavakapovadam.' },
    hi: { what: 'उल्टी या मतली संक्रमण, भोजन, दवा या अन्य कारणों से हो सकती है।', care: ['पानी या निर्देशानुसार तैयार पैकेट ORS थोड़ी-थोड़ी मात्रा में बार-बार लें।', 'आराम करें और सहज होने पर हल्का भोजन लें।', 'उल्टी रोकने की दवा स्वयं न लें।'], redFlags: 'खून या हरी उल्टी, तेज पेट दर्द, भ्रम, बहुत कम पेशाब, बेहोशी, या तरल न रुकना।' },
    'hi-roman': { what: 'Ulti ya matli infection, khane, dawa ya doosre causes se ho sakti hai.', care: ['Paani ya packet instructions ke mutabik bana ORS thoda-thoda baar-baar lein.', 'Aaram karein aur theek lage tab halka khana lein.', 'Ulti rokne ki dawa khud se na lein.'], redFlags: 'blood/green vomit, tez pet dard, confusion, bahut kam urine, behoshi, ya fluids na rukna.' },
  },
  urgent: {
    en: { what: 'This symptom can be a medical emergency and cannot be safely assessed in chat.', care: ['Call your local emergency number or go to the nearest emergency department now.', 'Do not drive yourself if unwell; ask someone nearby to help.', 'Do not wait for an online appointment or reply.'], redFlags: 'Treat the symptom itself as urgent, especially with sweating, fainting, severe pain, blue lips, or worsening breathing.' },
    te: { what: 'ఈ లక్షణం అత్యవసర పరిస్థితి కావచ్చు; చాట్‌లో సురక్షితంగా అంచనా వేయలేము.', care: ['వెంటనే స్థానిక అత్యవసర నంబర్‌కు కాల్ చేయండి లేదా సమీప అత్యవసర విభాగానికి వెళ్లండి.', 'అస్వస్థంగా ఉంటే మీరే వాహనం నడపకండి; దగ్గరలో ఉన్నవారి సహాయం తీసుకోండి.', 'ఆన్‌లైన్ అపాయింట్‌మెంట్ లేదా సమాధానం కోసం వేచి ఉండకండి.'], redFlags: 'ఈ లక్షణాన్నే అత్యవసరంగా పరిగణించండి; చెమటలు, మూర్ఛ, తీవ్రమైన నొప్పి, పెదవులు నీలంగా మారడం లేదా శ్వాస మరింత ఇబ్బందిగా ఉండటం ప్రత్యేకంగా ప్రమాద సూచనలు.' },
    tanglish: { what: 'Ee symptom emergency avvachu; chat lo safe ga assess cheyyalem.', care: ['Ventane local emergency number ki call cheyyandi leda nearest emergency department ki vellandi.', 'Baaga lekapothe meeru drive cheyyakandi; pakkana unna vaari help teesukondi.', 'Online appointment/reply kosam wait cheyyakandi.'], redFlags: 'Ee symptom ni urgent ga treat cheyyandi; sweating, fainting, severe pain, lips blue avvadam, leda breathing worsen avvadam unte inka urgent.' },
    hi: { what: 'यह लक्षण आपात स्थिति हो सकता है और चैट में इसका सुरक्षित आकलन नहीं किया जा सकता।', care: ['अभी स्थानीय आपातकालीन नंबर पर कॉल करें या नज़दीकी आपातकालीन विभाग जाएँ।', 'अस्वस्थ हों तो स्वयं वाहन न चलाएँ; पास के व्यक्ति से मदद लें।', 'ऑनलाइन अपॉइंटमेंट या जवाब की प्रतीक्षा न करें।'], redFlags: 'इस लक्षण को ही आपात मानें, खासकर पसीना, बेहोशी, तेज दर्द, होंठ नीले पड़ना या साँस का बिगड़ना हो।' },
    'hi-roman': { what: 'Yeh symptom emergency ho sakta hai aur chat mein iska safe assessment nahi ho sakta.', care: ['Abhi local emergency number par call karein ya nearest emergency department jaayein.', 'Tabiyat kharab ho to khud drive na karein; paas ke vyakti se help lein.', 'Online appointment ya reply ka wait na karein.'], redFlags: 'Is symptom ko urgent samjhein, khaaskar sweating, fainting, severe pain, hont neele hona, ya saans bigadna.' },
  },
  respiratory: {
    en: { what: 'Cold, cough, sneezing, or wheezing can have infectious or allergy-related causes.', care: ['Rest, drink fluids, and avoid smoke or other irritants.', 'Use a mask and hand hygiene if you may have an infection.', 'A clinician can assess symptoms that persist or keep returning.'], redFlags: 'difficulty breathing, blue lips, chest pain, confusion, or inability to speak full sentences.' },
    te: { what: 'జలుబు, దగ్గు, తుమ్ములు లేదా వీజింగ్‌కు ఇన్ఫెక్షన్ లేదా అలర్జీ వంటి కారణాలు ఉండవచ్చు.', care: ['విశ్రాంతి తీసుకుని ద్రవాలు తాగండి; పొగ, చికాకు కలిగించే వాటికి దూరంగా ఉండండి.', 'ఇన్ఫెక్షన్ ఉండవచ్చని అనిపిస్తే మాస్క్, చేతుల శుభ్రత పాటించండి.', 'లక్షణాలు కొనసాగితే లేదా మళ్లీ మళ్లీ వస్తే వైద్యుడిని కలవండి.'], redFlags: 'శ్వాస తీసుకోవడంలో ఇబ్బంది, పెదవులు నీలం కావడం, ఛాతీ నొప్పి, గందరగోళం, లేదా పూర్తి వాక్యాలు మాట్లాడలేకపోవడం.' },
    tanglish: { what: 'Cold, cough, sneezing leda wheezing infection/allergy valla ravachu.', care: ['Rest teesukoni fluids tagandi; smoke/irritants ki dooranga undandi.', 'Infection undochu anipisthe mask, hand hygiene follow avvandi.', 'Symptoms continue ayina leda malli malli vachina clinician ni kalavandi.'], redFlags: 'breathing difficulty, lips blue avvadam, chest pain, confusion, leda full sentences matladalekapovadam.' },
    hi: { what: 'सर्दी, खाँसी, छींक या घरघराहट संक्रमण या एलर्जी से हो सकती है।', care: ['आराम करें, तरल लें और धुएँ या जलन पैदा करने वाली चीज़ों से बचें।', 'संक्रमण की आशंका हो तो मास्क और हाथों की स्वच्छता रखें।', 'लक्षण बने रहें या बार-बार लौटें तो डॉक्टर से मिलें।'], redFlags: 'साँस लेने में कठिनाई, होंठ नीले पड़ना, सीने में दर्द, भ्रम, या पूरा वाक्य न बोल पाना।' },
    'hi-roman': { what: 'Sardi, khansi, chheenk ya wheezing infection ya allergy se ho sakti hai.', care: ['Aaram karein, fluids lein aur smoke/irritants se bachein.', 'Infection ka shak ho to mask aur hand hygiene rakhein.', 'Symptoms bane rahein ya baar-baar aayein to doctor se milein.'], redFlags: 'saans lene mein dikkat, hont neele hona, seene mein dard, confusion, ya poora vaakya na bol pana.' },
  },
  chronic: {
    en: { what: 'Blood sugar or blood pressure readings need interpretation using your history and repeat measurements.', care: ['Follow the care plan already agreed with your clinician.', 'Record readings with the date, time, and relevant context.', 'Do not start, stop, or change prescribed medicine without medical advice.'], redFlags: 'chest pain, severe breathlessness, fainting, confusion, severe headache, weakness on one side, or a very abnormal reading with symptoms.' },
    te: { what: 'రక్త చక్కెర లేదా రక్తపోటు రీడింగ్‌లను మీ ఆరోగ్య చరిత్ర, మళ్లీ చేసిన కొలతలతో వైద్యుడు అర్థం చేసుకోవాలి.', care: ['మీ వైద్యుడితో ఇప్పటికే నిర్ణయించిన ప్రణాళికను అనుసరించండి.', 'తేదీ, సమయం, సంబంధిత వివరాలతో రీడింగ్‌లను నమోదు చేయండి.', 'వైద్య సలహా లేకుండా సూచించిన మందులను మొదలు పెట్టడం, ఆపడం లేదా మార్చడం చేయకండి.'], redFlags: 'ఛాతీ నొప్పి, తీవ్రమైన శ్వాస ఇబ్బంది, మూర్ఛ, గందరగోళం, తీవ్రమైన తలనొప్పి, ఒకవైపు బలహీనత, లేదా లక్షణాలతో కూడిన చాలా అసాధారణ రీడింగ్.' },
    tanglish: { what: 'Blood sugar/BP readings ni mee history mariyu repeat measurements tho clinician interpret cheyyali.', care: ['Mee clinician tho decide chesina care plan follow avvandi.', 'Date, time, relevant context tho readings note cheyyandi.', 'Medical advice lekunda prescribed medicine start/stop/change cheyyakandi.'], redFlags: 'chest pain, severe breathing problem, fainting, confusion, severe headache, one-side weakness, leda symptoms tho chaala abnormal reading.' },
    hi: { what: 'ब्लड शुगर या ब्लड प्रेशर रीडिंग को आपके इतिहास और दोबारा माप के साथ डॉक्टर को समझना चाहिए।', care: ['अपने डॉक्टर के साथ तय की गई देखभाल योजना का पालन करें।', 'तारीख, समय और ज़रूरी संदर्भ के साथ रीडिंग लिखें।', 'चिकित्सकीय सलाह के बिना निर्धारित दवा शुरू, बंद या बदलें नहीं।'], redFlags: 'सीने में दर्द, गंभीर साँस की तकलीफ़, बेहोशी, भ्रम, तेज सिरदर्द, शरीर के एक तरफ कमज़ोरी, या लक्षणों के साथ बहुत असामान्य रीडिंग।' },
    'hi-roman': { what: 'Blood sugar ya BP reading ko aapki history aur repeat measurements ke saath doctor ko samajhna chahiye.', care: ['Doctor ke saath tay care plan follow karein.', 'Date, time aur zaroori context ke saath readings likhein.', 'Medical salah ke bina prescribed dawa shuru/band/change na karein.'], redFlags: 'seene mein dard, severe saans ki dikkat, behoshi, confusion, tez headache, ek taraf kamzori, ya symptoms ke saath bahut abnormal reading.' },
  },
  skin: {
    en: { what: 'Itching, rashes, acne, or scaling can have several causes, including irritation or infection.', care: ['Keep the area clean and dry and avoid scratching.', 'Stop a new product that seems to trigger irritation.', 'Avoid sharing towels and do not apply unknown creams or chemicals.'], redFlags: 'rapidly spreading rash, facial or tongue swelling, trouble breathing, fever with a painful rash, or sores near the eyes.' },
    te: { what: 'దురద, దద్దుర్లు, మొటిమలు లేదా పొట్టు రావడానికి అలర్జీ లేదా ఇన్ఫెక్షన్ సహా అనేక కారణాలు ఉండవచ్చు.', care: ['ఆ ప్రాంతాన్ని శుభ్రంగా, పొడిగా ఉంచి గోకకండి.', 'చికాకు కలిగిస్తున్నట్లు అనిపించే కొత్త ఉత్పత్తిని ఆపండి.', 'తువ్వాళ్లు పంచుకోకండి; తెలియని క్రీమ్‌లు లేదా రసాయనాలు రాయవద్దు.'], redFlags: 'దద్దుర్లు వేగంగా వ్యాపించడం, ముఖం/నాలుక వాపు, శ్వాస ఇబ్బంది, జ్వరంతో నొప్పి కలిగించే దద్దుర్లు, లేదా కళ్ల దగ్గర పుండ్లు.' },
    tanglish: { what: 'Itching, rash, pimples leda scaling irritation/infection tho saha chaala causes valla ravachu.', care: ['Area clean, dry ga unchi scratch cheyyakandi.', 'Irritation trigger chesina kottha product ni aapeyyandi.', 'Towels share cheyyakandi; teliyani creams/chemicals apply cheyyakandi.'], redFlags: 'rash fast ga spread avvadam, face/tongue swelling, breathing problem, fever tho painful rash, leda eyes daggara sores.' },
    hi: { what: 'खुजली, दाने, मुहाँसे या पपड़ी के कई कारण हो सकते हैं, जैसे जलन या संक्रमण।', care: ['जगह को साफ़ और सूखा रखें तथा खुजलाएँ नहीं।', 'जलन बढ़ाने वाले नए उत्पाद का उपयोग रोकें।', 'तौलिया साझा न करें और अनजान क्रीम या रसायन न लगाएँ।'], redFlags: 'तेज़ी से फैलते दाने, चेहरे/जीभ में सूजन, साँस की तकलीफ़, बुखार के साथ दर्दनाक दाने, या आँखों के पास घाव।' },
    'hi-roman': { what: 'Khujli, rash, pimples ya scaling ke kai causes ho sakte hain, jaise irritation ya infection.', care: ['Jagah ko saaf aur sukha rakhein, khujlayein nahi.', 'Irritation badhane wale naye product ka use rok dein.', 'Towel share na karein aur anjaan cream/chemical na lagayein.'], redFlags: 'tez failta rash, chehre/zubaan mein sujan, saans ki dikkat, bukhar ke saath dardnaak rash, ya aankhon ke paas ghaav.' },
  },
  allergy: {
    en: { what: 'Sneezing or itching may be allergy-related, but other causes are possible.', care: ['Move away from a suspected trigger when practical.', 'Wash exposed skin and change dusty clothing.', 'Keep track of possible triggers and discuss recurring symptoms with a clinician.'], redFlags: 'swelling of the lips, tongue, or throat, trouble breathing, faintness, or a rapidly worsening reaction.' },
    te: { what: 'తుమ్ములు లేదా దురద అలర్జీ వల్ల కావచ్చు, కానీ ఇతర కారణాలు కూడా ఉండవచ్చు.', care: ['వీలైతే అనుమానిత అలర్జీ కారకం నుంచి దూరంగా ఉండండి.', 'బయటపడిన చర్మాన్ని కడిగి, దుమ్ము ఉన్న దుస్తులు మార్చండి.', 'ఏవి లక్షణాలు పెంచుతున్నాయో గమనించి, మళ్లీ వస్తే వైద్యుడితో చర్చించండి.'], redFlags: 'పెదవులు, నాలుక లేదా గొంతు వాపు, శ్వాస ఇబ్బంది, మూర్ఛలా అనిపించడం, లేదా వేగంగా తీవ్రమవుతున్న ప్రతిచర్య.' },
    tanglish: { what: 'Sneezing leda itching allergy valla ravachu, kani vere causes kuda undachu.', care: ['Veedaithe suspected trigger nundi dooranga undandi.', 'Expose ayina skin wash chesi, dust unna clothes marchandi.', 'Triggers note chesi symptoms repeat ayithe clinician tho discuss cheyyandi.'], redFlags: 'lips/tongue/throat swelling, breathing difficulty, faint ga anipinchadam, leda reaction fast ga worsen avvadam.' },
    hi: { what: 'छींक या खुजली एलर्जी से हो सकती है, लेकिन अन्य कारण भी संभव हैं।', care: ['संभव हो तो संदिग्ध एलर्जी कारक से दूर रहें।', 'खुली त्वचा धोएँ और धूल वाले कपड़े बदलें।', 'संभावित कारण नोट करें और लक्षण लौटें तो डॉक्टर से चर्चा करें।'], redFlags: 'होंठ, जीभ या गले में सूजन, साँस लेने में कठिनाई, बेहोशी जैसा लगना, या तेज़ी से बिगड़ती प्रतिक्रिया।' },
    'hi-roman': { what: 'Chheenk ya khujli allergy se ho sakti hai, par doosre causes bhi mumkin hain.', care: ['Mumkin ho to suspected trigger se door rahein.', 'Expose hui skin dhoyein aur dusty kapde badlein.', 'Triggers note karein aur symptoms lautne par doctor se baat karein.'], redFlags: 'hont/zubaan/gale mein sujan, saans lene mein dikkat, behoshi jaisa lagna, ya tezi se bigadti reaction.' },
  },
  eye: {
    en: { what: 'Eye redness, pain, watering, or blurred vision can have different causes.', care: ['Avoid rubbing your eyes and wash your hands.', 'Remove contact lenses if they are uncomfortable.', 'Arrange an eye-care review for persistent or new vision symptoms.'], redFlags: 'sudden vision loss, severe eye pain, chemical exposure, eye injury, or a very red eye with light sensitivity.' },
    te: { what: 'కంటి ఎర్రదనం, నొప్పి, నీరు కారడం లేదా మసక చూపుకు వేర్వేరు కారణాలు ఉండవచ్చు.', care: ['కళ్లను రుద్దకండి, చేతులు శుభ్రంగా కడుక్కోండి.', 'కాంటాక్ట్ లెన్స్ వల్ల ఇబ్బంది ఉంటే వాటిని తీసేయండి.', 'లక్షణాలు కొనసాగితే లేదా చూపు కొత్తగా మసకబారితే కంటి వైద్యుడిని కలవండి.'], redFlags: 'అకస్మాత్తుగా చూపు తగ్గడం, తీవ్రమైన కంటి నొప్పి, రసాయనం పడటం, కంటికి గాయం, లేదా వెలుతురు చూడలేని ఎర్ర కంటి.' },
    tanglish: { what: 'Eye redness, pain, watering leda blur vision ki different causes undachu.', care: ['Eyes rub cheyyakandi, hands wash chesukondi.', 'Contact lens valla discomfort unte teeseyyandi.', 'Symptoms continue ayina leda vision kotthaga blur ayina eye doctor ni kalavandi.'], redFlags: 'sudden vision loss, severe eye pain, chemical exposure, eye injury, leda light sensitivity tho chala red eye.' },
    hi: { what: 'आँख की लालिमा, दर्द, पानी आना या धुंधला दिखना अलग-अलग कारणों से हो सकता है।', care: ['आँख न मलें और हाथ साफ़ रखें।', 'कॉन्टैक्ट लेंस से परेशानी हो तो उन्हें निकाल दें।', 'लक्षण बने रहें या नई धुंधली दृष्टि हो तो नेत्र चिकित्सक से मिलें।'], redFlags: 'अचानक दृष्टि कम होना, तेज आँख दर्द, रसायन पड़ना, आँख में चोट, या रोशनी से तकलीफ़ के साथ बहुत लाल आँख।' },
    'hi-roman': { what: 'Aankh ki laali, dard, paani aana ya dhundhla dikhna alag causes se ho sakta hai.', care: ['Aankh na malein aur haath saaf rakhein.', 'Contact lens se takleef ho to nikaal dein.', 'Symptoms bane rahein ya nayi blur vision ho to eye doctor se milein.'], redFlags: 'achanak nazar kam hona, tez aankh dard, chemical padna, aankh mein chot, ya roshni se takleef ke saath bahut laal aankh.' },
  },
  ear: {
    en: { what: 'Ear pain, wax, or hearing changes can have several causes.', care: ['Keep objects and cotton buds out of the ear canal.', 'Keep the ear dry if discharge is present.', 'Arrange a clinician review for ongoing pain or hearing change.'], redFlags: 'sudden hearing loss, severe pain, blood or fluid after an injury, facial weakness, or high fever.' },
    te: { what: 'చెవి నొప్పి, గులిమి లేదా వినికిడి మార్పులకు అనేక కారణాలు ఉండవచ్చు.', care: ['చెవి లోపల వస్తువులు లేదా కాటన్ బడ్స్ పెట్టకండి.', 'స్రావం ఉంటే చెవిని పొడిగా ఉంచండి.', 'నొప్పి లేదా వినికిడి సమస్య కొనసాగితే వైద్యుడిని కలవండి.'], redFlags: 'అకస్మాత్తుగా వినికిడి తగ్గడం, తీవ్రమైన నొప్పి, గాయం తర్వాత రక్తం/ద్రవం రావడం, ముఖం బలహీనపడటం లేదా అధిక జ్వరం.' },
    tanglish: { what: 'Ear pain, wax leda hearing change ki chaala causes undachu.', care: ['Ear lopala objects leda cotton buds pettakandi.', 'Discharge unte ear dry ga unchandi.', 'Pain/hearing change continue ayithe clinician ni kalavandi.'], redFlags: 'sudden hearing loss, severe pain, injury tharvatha blood/fluid, face weakness, leda high fever.' },
    hi: { what: 'कान का दर्द, मैल या सुनने में बदलाव के कई कारण हो सकते हैं।', care: ['कान के अंदर वस्तु या कॉटन बड न डालें।', 'स्राव हो तो कान सूखा रखें।', 'दर्द या सुनने की समस्या बनी रहे तो डॉक्टर से मिलें।'], redFlags: 'अचानक सुनाई न देना, तेज दर्द, चोट के बाद खून/तरल, चेहरे में कमजोरी, या तेज बुखार।' },
    'hi-roman': { what: 'Kaan ka dard, mail ya sunne mein badlav ke kai causes ho sakte hain.', care: ['Kaan ke andar cheez ya cotton bud na daalein.', 'Discharge ho to kaan sukha rakhein.', 'Dard ya sunne ki problem bani rahe to doctor se milein.'], redFlags: 'achanak sunai na dena, tez dard, chot ke baad khoon/fluid, chehre mein kamzori, ya tez bukhar.' },
  },
  dental: {
    en: { what: 'Tooth or gum pain may need dental assessment and can have several causes.', care: ['Keep the area clean with gentle brushing.', 'Avoid very hot, cold, or hard foods if they worsen pain.', 'Arrange a dentist appointment rather than placing chemicals on the tooth.'], redFlags: 'face or neck swelling, fever with dental pain, difficulty swallowing or breathing, or uncontrolled bleeding.' },
    te: { what: 'పంటి లేదా చిగుళ్ల నొప్పికి అనేక కారణాలు ఉండవచ్చు; దంత వైద్యుడి పరీక్ష అవసరం కావచ్చు.', care: ['మెల్లగా బ్రష్ చేసి ఆ ప్రాంతాన్ని శుభ్రంగా ఉంచండి.', 'నొప్పి పెంచితే చాలా వేడి, చల్లని లేదా గట్టి ఆహారాన్ని తగ్గించండి.', 'పంటిపై రసాయనాలు పెట్టకుండా దంత వైద్యుడిని కలవండి.'], redFlags: 'ముఖం లేదా మెడ వాపు, పంటి నొప్పితో జ్వరం, మింగడం/శ్వాసలో ఇబ్బంది, లేదా ఆగని రక్తస్రావం.' },
    tanglish: { what: 'Tooth leda gum pain ki chaala causes undachu; dentist assessment avasaram avvachu.', care: ['Gentle brushing tho area clean ga unchandi.', 'Pain perigite chaala hot/cold/hard foods avoid cheyyandi.', 'Tooth meeda chemicals pettakunda dentist appointment teesukondi.'], redFlags: 'face/neck swelling, tooth pain tho fever, swallow/breath cheyyadaniki problem, leda aagani bleeding.' },
    hi: { what: 'दाँत या मसूड़े के दर्द के कई कारण हो सकते हैं और दंत जाँच की ज़रूरत पड़ सकती है।', care: ['धीरे ब्रश करके जगह साफ़ रखें।', 'दर्द बढ़े तो बहुत गर्म, ठंडे या सख्त भोजन से बचें।', 'दाँत पर रसायन लगाने के बजाय दंत चिकित्सक से मिलें।'], redFlags: 'चेहरे/गर्दन में सूजन, दाँत दर्द के साथ बुखार, निगलने/साँस लेने में कठिनाई, या न रुकने वाला खून।' },
    'hi-roman': { what: 'Daant ya masude ke dard ke kai causes ho sakte hain aur dental check ki zaroorat ho sakti hai.', care: ['Halki brushing se jagah saaf rakhein.', 'Dard badhe to bahut garam, thande ya sakht khane se bachein.', 'Daant par chemical lagane ke bajay dentist se milein.'], redFlags: 'chehre/gardan mein sujan, daant dard ke saath bukhar, nigalne/saans lene mein dikkat, ya na rukne wala khoon.' },
  },
  throat: {
    en: { what: 'Throat pain can occur with infections, irritation, or other causes.', care: ['Drink fluids and rest your voice.', 'Avoid smoke and other throat irritants.', 'Seek a clinician review if symptoms persist or keep returning.'], redFlags: 'trouble breathing or swallowing saliva, drooling, severe swelling, dehydration, or a rapidly worsening condition.' },
    te: { what: 'గొంతు నొప్పి ఇన్ఫెక్షన్, చికాకు లేదా ఇతర కారణాల వల్ల రావచ్చు.', care: ['ద్రవాలు తాగి గొంతుకు విశ్రాంతి ఇవ్వండి.', 'పొగ, గొంతుకు చికాకు కలిగించే వాటికి దూరంగా ఉండండి.', 'లక్షణాలు కొనసాగితే లేదా మళ్లీ మళ్లీ వస్తే వైద్యుడిని కలవండి.'], redFlags: 'శ్వాస తీసుకోవడం లేదా లాలాజలం మింగడంలో ఇబ్బంది, నోటి నుంచి లాలాజలం కారడం, తీవ్రమైన వాపు, నీరసం లేదా వేగంగా క్షీణించడం.' },
    tanglish: { what: 'Throat pain infection, irritation leda vere causes valla ravachu.', care: ['Fluids tagi voice ki rest ivvandi.', 'Smoke/throat irritants ki dooranga undandi.', 'Symptoms continue ayina leda repeat ayina clinician ni kalavandi.'], redFlags: 'breath/swallow saliva cheyyalekapovadam, drooling, severe swelling, dehydration, leda condition fast ga worsen avvadam.' },
    hi: { what: 'गले में दर्द संक्रमण, जलन या अन्य कारणों से हो सकता है।', care: ['तरल लें और आवाज़ को आराम दें।', 'धुएँ और गले में जलन करने वाली चीज़ों से बचें।', 'लक्षण बने रहें या लौटें तो डॉक्टर से मिलें।'], redFlags: 'साँस लेने या लार निगलने में कठिनाई, मुँह से लार गिरना, गंभीर सूजन, पानी की कमी, या तेज़ी से बिगड़ना।' },
    'hi-roman': { what: 'Gale ka dard infection, irritation ya doosre causes se ho sakta hai.', care: ['Fluids lein aur awaaz ko aaram dein.', 'Smoke/gale ko irritate karne wali cheezon se bachein.', 'Symptoms bane rahein ya lautein to doctor se milein.'], redFlags: 'saans lene ya laar nigalne mein dikkat, drooling, severe sujan, dehydration, ya tezi se bigadna.' },
  },
  wellbeing: {
    en: { what: 'Weakness, tiredness, dizziness, or sleep problems can have many physical or emotional causes.', care: ['Keep a regular sleep and meal routine and drink enough fluids.', 'Avoid driving or risky activities if dizzy or very tired.', 'Arrange a clinician review if symptoms persist or affect daily life.'], redFlags: 'fainting, confusion, sudden weakness on one side, chest pain, severe breathlessness, or inability to stay awake.' },
    te: { what: 'బలహీనత, అలసట, తల తిరగడం లేదా నిద్ర సమస్యలకు శారీరక లేదా మానసిక కారణాలు ఉండవచ్చు.', care: ['నిద్ర, భోజన సమయాలను క్రమంగా ఉంచి తగినంత ద్రవాలు తాగండి.', 'తల తిరుగుతున్నప్పుడు లేదా చాలా అలసటగా ఉన్నప్పుడు వాహనం నడపకండి.', 'లక్షణాలు కొనసాగితే లేదా రోజువారీ జీవితాన్ని ప్రభావితం చేస్తే వైద్యుడిని కలవండి.'], redFlags: 'మూర్ఛ, గందరగోళం, అకస్మాత్తుగా ఒకవైపు బలహీనత, ఛాతీ నొప్పి, తీవ్రమైన శ్వాస ఇబ్బంది లేదా మేల్కొని ఉండలేకపోవడం.' },
    tanglish: { what: 'Weakness, tiredness, dizziness leda sleep problems ki physical/mental causes undachu.', care: ['Regular sleep/meal routine maintain chesi fluids tagandi.', 'Dizzy ga leda chaala tired ga unte drive/risky activities cheyyakandi.', 'Symptoms continue ayina leda daily life affect ayina clinician ni kalavandi.'], redFlags: 'fainting, confusion, sudden one-side weakness, chest pain, severe breathing problem, leda melukuvaga undalekapovadam.' },
    hi: { what: 'कमज़ोरी, थकान, चक्कर या नींद की समस्या के कई शारीरिक या भावनात्मक कारण हो सकते हैं।', care: ['नियमित नींद और भोजन का समय रखें तथा पर्याप्त तरल लें।', 'चक्कर या बहुत थकान हो तो वाहन न चलाएँ और जोखिम वाले काम न करें।', 'लक्षण बने रहें या दैनिक जीवन प्रभावित हो तो डॉक्टर से मिलें।'], redFlags: 'बेहोशी, भ्रम, अचानक एक तरफ कमज़ोरी, सीने में दर्द, गंभीर साँस की तकलीफ़, या जागते न रह पाना।' },
    'hi-roman': { what: 'Kamzori, thakaan, chakkar ya neend ki problem ke kai physical ya emotional causes ho sakte hain.', care: ['Regular sleep/meal routine rakhein aur kaafi fluids lein.', 'Chakkar ya bahut thakaan ho to drive/risky kaam na karein.', 'Symptoms bane rahein ya daily life affect ho to doctor se milein.'], redFlags: 'behoshi, confusion, achanak ek taraf kamzori, seene mein dard, severe saans ki dikkat, ya jaagte na reh pana.' },
  },
  sleep: {
    en: { what: 'Sleep difficulty can be linked to routine, stress, health conditions, or medicines.', care: ['Keep a regular wake-up time and a quiet, comfortable sleep space.', 'Reduce late caffeine and bright screens before bed if they affect you.', 'Discuss ongoing sleep problems with a clinician rather than using sleep medicines on your own.'], redFlags: 'severe daytime sleepiness causing safety problems, breathing pauses during sleep, or sleep loss with confusion or extreme mood changes.' },
    te: { what: 'నిద్ర సమస్యలకు దినచర్య, ఒత్తిడి, ఆరోగ్య పరిస్థితులు లేదా మందులు కారణం కావచ్చు.', care: ['ప్రతిరోజూ ఒకే సమయానికి లేచి, ప్రశాంతమైన నిద్ర వాతావరణం ఏర్పరచుకోండి.', 'మీకు ఇబ్బంది కలిగిస్తే రాత్రి కెఫీన్, ప్రకాశవంతమైన స్క్రీన్‌లను తగ్గించండి.', 'నిద్ర మందులను స్వయంగా వాడకుండా, సమస్య కొనసాగితే వైద్యుడితో చర్చించండి.'], redFlags: 'భద్రతకు ఇబ్బంది కలిగించే పగటి నిద్రమత్తు, నిద్రలో శ్వాస ఆగిపోవడం, లేదా గందరగోళం/తీవ్ర మూడ్ మార్పులతో నిద్రలేమి.' },
    tanglish: { what: 'Sleep difficulty routine, stress, health condition leda medicines tho sambandham undachu.', care: ['Regular ga oka time ki lechi, quiet comfortable sleep space maintain cheyyandi.', 'Meeku affect ayithe night caffeine, bright screens tagginchandi.', 'Sleep medicines self ga vadakunda, problem continue ayithe clinician tho discuss cheyyandi.'], redFlags: 'safety ki problem ayye daytime sleepiness, sleep lo breathing pauses, leda confusion/extreme mood changes tho sleep loss.' },
    hi: { what: 'नींद की परेशानी दिनचर्या, तनाव, स्वास्थ्य स्थिति या दवाओं से जुड़ी हो सकती है।', care: ['नियमित समय पर उठें और शांत, आरामदायक नींद का माहौल रखें।', 'यदि असर पड़ता हो तो देर से कैफीन और सोने से पहले तेज़ स्क्रीन कम करें।', 'नींद की दवा स्वयं न लें; समस्या बनी रहे तो डॉक्टर से चर्चा करें।'], redFlags: 'सुरक्षा प्रभावित करने वाली दिन की नींद, सोते समय साँस रुकना, या भ्रम/अत्यधिक मूड बदलाव के साथ नींद की कमी।' },
    'hi-roman': { what: 'Neend ki dikkat routine, stress, health condition ya medicines se judi ho sakti hai.', care: ['Regular time par uthein aur shaant, comfortable sleep space rakhein.', 'Agar asar padta ho to raat ki caffeine aur sone se pehle bright screen kam karein.', 'Sleep medicine khud se na lein; problem bani rahe to doctor se baat karein.'], redFlags: 'safety prabhavit karne wali din ki neend, sote waqt saans rukna, ya confusion/extreme mood change ke saath neend ki kami.' },
  },
  mental: {
    en: { what: 'Stress, anxiety, or low mood can affect health and deserve support; a chat cannot diagnose a mental health condition.', care: ['Try a calm breathing or grounding exercise and take one manageable step at a time.', 'Talk with someone you trust and consider a mental health professional.', 'Keep regular sleep, meals, and gentle activity where possible.'], redFlags: 'feeling unsafe, thoughts of self-harm, or being unable to care for yourself; contact emergency services or a trusted person now.' },
    te: { what: 'ఒత్తిడి, ఆందోళన లేదా మానసిక దిగులు ఆరోగ్యాన్ని ప్రభావితం చేయవచ్చు; చాట్ మానసిక వ్యాధిని నిర్ధారించదు.', care: ['ప్రశాంతంగా శ్వాస తీసుకునే లేదా గ్రౌండింగ్ వ్యాయామం చేసి, ఒక్కో చిన్న పనిపై దృష్టి పెట్టండి.', 'నమ్మకమైన వ్యక్తితో మాట్లాడి, మానసిక ఆరోగ్య నిపుణుడిని సంప్రదించండి.', 'వీలైనంతవరకు క్రమమైన నిద్ర, భోజనం, తేలికపాటి కదలిక కొనసాగించండి.'], redFlags: 'మీకు సురక్షితంగా అనిపించకపోవడం, మీకు హాని చేసుకోవాలనే ఆలోచనలు, లేదా మీ సంరక్షణ చేసుకోలేకపోవడం; వెంటనే అత్యవసర సేవలను లేదా నమ్మకమైన వ్యక్తిని సంప్రదించండి.' },
    tanglish: { what: 'Stress, anxiety leda low mood health ni affect cheyyachu; chat mental health condition diagnose cheyyaledu.', care: ['Calm breathing/grounding try chesi, okka manageable step meeda focus cheyyandi.', 'Nammakam unna vyakthi tho matladi mental health professional ni consider cheyyandi.', 'Possible ayithe regular sleep, meals, gentle activity maintain cheyyandi.'], redFlags: 'safe ga lekapovadam, self-harm thoughts, leda self-care cheyyalekapovadam; ventane emergency services leda trusted person ni contact cheyyandi.' },
    hi: { what: 'तनाव, चिंता या उदासी स्वास्थ्य को प्रभावित कर सकती है; चैट मानसिक स्वास्थ्य स्थिति का निदान नहीं कर सकती।', care: ['शांत साँस या ग्राउंडिंग अभ्यास करें और एक समय में एक छोटा कदम लें।', 'किसी भरोसेमंद व्यक्ति से बात करें और मानसिक स्वास्थ्य विशेषज्ञ पर विचार करें।', 'जहाँ संभव हो नियमित नींद, भोजन और हल्की गतिविधि रखें।'], redFlags: 'असुरक्षित महसूस होना, खुद को नुकसान पहुँचाने के विचार, या अपनी देखभाल न कर पाना; अभी आपातकालीन सेवाओं या भरोसेमंद व्यक्ति से संपर्क करें।' },
    'hi-roman': { what: 'Stress, anxiety ya low mood health ko affect kar sakte hain; chat mental health condition diagnose nahi kar sakti.', care: ['Shaant breathing/grounding try karein aur ek samay mein ek chhota step lein.', 'Kisi bharosemand vyakti se baat karein aur mental health professional par vichar karein.', 'Mumkin ho to regular neend, khana aur halki activity rakhein.'], redFlags: 'unsafe mehsoos hona, khud ko nuksan pahunchane ke vichar, ya apni dekhbhaal na kar pana; abhi emergency services ya bharosemand vyakti se sampark karein.' },
  },
  reproductive: {
    en: { what: 'Period changes, pelvic discomfort, or discharge can have several causes and need context.', care: ['Track dates, symptoms, and any changes from your usual pattern.', 'Use gentle hygiene and avoid scented or internal cleansing products.', 'Arrange a confidential clinician review for persistent, painful, or unusual symptoms.'], redFlags: 'severe pelvic pain, fainting, heavy bleeding, fever, or possible pregnancy with pain or bleeding.' },
    te: { what: 'పీరియడ్స్ మార్పులు, కటి ప్రాంత అసౌకర్యం లేదా స్రావానికి అనేక కారణాలు ఉండవచ్చు; వివరాలు అవసరం.', care: ['తేదీలు, లక్షణాలు, సాధారణ విధానంలో వచ్చిన మార్పులను నమోదు చేయండి.', 'సున్నితమైన పరిశుభ్రత పాటించి సువాసన ఉత్పత్తులు లేదా లోపలి శుభ్రపరిచే పదార్థాలు వాడకండి.', 'కొనసాగుతున్న, నొప్పితో కూడిన లేదా అసాధారణ లక్షణాలకు గోప్యంగా వైద్యుడిని కలవండి.'], redFlags: 'తీవ్రమైన కటి నొప్పి, మూర్ఛ, అధిక రక్తస్రావం, జ్వరం, లేదా గర్భం ఉండే అవకాశం ఉన్నప్పుడు నొప్పి/రక్తస్రావం.' },
    tanglish: { what: 'Periods changes, pelvic discomfort leda discharge ki chaala causes undachu; context avasaram.', care: ['Dates, symptoms, usual pattern lo changes note cheyyandi.', 'Gentle hygiene follow ayi scented/internal cleansing products avoid cheyyandi.', 'Symptoms continue, painful, leda unusual ga unte confidential ga clinician ni kalavandi.'], redFlags: 'severe pelvic pain, fainting, heavy bleeding, fever, leda pregnancy chance tho pain/bleeding.' },
    hi: { what: 'मासिक धर्म में बदलाव, पेट के निचले हिस्से में परेशानी या स्राव के कई कारण हो सकते हैं।', care: ['तारीखें, लक्षण और सामान्य तरीके से बदलाव नोट करें।', 'हल्की स्वच्छता रखें और सुगंधित या अंदरूनी सफाई वाले उत्पादों से बचें।', 'लक्षण बने रहें, दर्दनाक हों या असामान्य हों तो गोपनीय रूप से डॉक्टर से मिलें।'], redFlags: 'तेज़ निचले पेट का दर्द, बेहोशी, बहुत अधिक रक्तस्राव, बुखार, या गर्भावस्था की संभावना के साथ दर्द/रक्तस्राव।' },
    'hi-roman': { what: 'Periods mein badlav, pelvic discomfort ya discharge ke kai causes ho sakte hain; context zaroori hai.', care: ['Dates, symptoms aur usual pattern mein badlav note karein.', 'Halki hygiene rakhein aur scented/internal cleansing products se bachein.', 'Symptoms bane rahein, dard ho ya unusual hon to confidential doctor se milein.'], redFlags: 'tez pelvic pain, behoshi, heavy bleeding, bukhar, ya pregnancy chance ke saath pain/bleeding.' },
  },
  urinary: {
    en: { what: 'Pain or frequent urination can have several causes and may need a urine test.', care: ['Drink fluids normally unless a clinician has restricted them.', 'Do not hold urine for long periods.', 'Arrange a clinician review, especially if symptoms are new or recurring.'], redFlags: 'fever with back/flank pain, vomiting, blood in urine, inability to urinate, or pregnancy with urinary symptoms.' },
    te: { what: 'మూత్రంలో మంట లేదా తరచుగా మూత్రం రావడానికి అనేక కారణాలు ఉండవచ్చు; పరీక్ష అవసరం కావచ్చు.', care: ['వైద్యుడు ద్రవాలు పరిమితం చేయకపోతే సాధారణంగా నీళ్లు తాగండి.', 'చాలాసేపు మూత్రాన్ని ఆపకండి.', 'లక్షణాలు కొత్తగా ఉంటే లేదా మళ్లీ వస్తే వైద్యుడిని కలవండి.'], redFlags: 'జ్వరంతో వెన్ను/పక్క నొప్పి, వాంతులు, మూత్రంలో రక్తం, మూత్రం రాకపోవడం, లేదా గర్భధారణలో మూత్ర లక్షణాలు.' },
    tanglish: { what: 'Urine pain/burning leda frequent urination ki chaala causes undachu; urine test avasaram avvachu.', care: ['Clinician fluids limit cheyyamani cheppakapothe normal ga water tagandi.', 'Urine ni chaala sepu aapukokandi.', 'Symptoms kotthaga unte leda repeat ayithe clinician ni kalavandi.'], redFlags: 'fever tho back/side pain, vomiting, urine lo blood, urine pass kakapovadam, leda pregnancy tho urine symptoms.' },
    hi: { what: 'पेशाब में दर्द या बार-बार पेशाब आने के कई कारण हो सकते हैं और जाँच की ज़रूरत पड़ सकती है।', care: ['डॉक्टर ने तरल सीमित न किए हों तो सामान्य रूप से पानी पिएँ।', 'लंबे समय तक पेशाब न रोकें।', 'लक्षण नए हों या लौटें तो डॉक्टर से मिलें।'], redFlags: 'बुखार के साथ पीठ/बगल में दर्द, उल्टी, पेशाब में खून, पेशाब न कर पाना, या गर्भावस्था में मूत्र संबंधी लक्षण।' },
    'hi-roman': { what: 'Peshab mein dard ya baar-baar peshab ke kai causes ho sakte hain aur test ki zaroorat ho sakti hai.', care: ['Doctor ne fluids limit na kiye hon to normal paani piyen.', 'Lambe samay tak urine na rokein.', 'Symptoms naye hon ya lautein to doctor se milein.'], redFlags: 'bukhar ke saath back/side pain, vomiting, urine mein blood, urine na kar pana, ya pregnancy mein urinary symptoms.' },
  },
  swelling: {
    en: { what: 'Swelling can have many causes; new or unexplained swelling should be assessed.', care: ['Note when it began and whether one or both sides are affected.', 'Avoid tight clothing or pressure on the swollen area.', 'Arrange medical review, especially if swelling is persistent.'], redFlags: 'sudden face/tongue swelling, breathing difficulty, one-sided painful leg swelling, chest pain, or fainting.' },
    te: { what: 'వాపుకు అనేక కారణాలు ఉండవచ్చు; కొత్తగా లేదా కారణం తెలియని వాపును వైద్యుడు పరిశీలించాలి.', care: ['ఎప్పుడు మొదలైందో, ఒకవైపా రెండు వైపులా ఉందో గమనించండి.', 'వాపు ఉన్న చోట బిగుతైన దుస్తులు లేదా ఒత్తిడి వద్దు.', 'వాపు కొనసాగితే వైద్యుడిని కలవండి.'], redFlags: 'అకస్మాత్తుగా ముఖం/నాలుక వాపు, శ్వాస ఇబ్బంది, ఒక కాలిలో నొప్పితో వాపు, ఛాతీ నొప్పి లేదా మూర్ఛ.' },
    tanglish: { what: 'Swelling ki chaala causes undachu; kotthaga leda cause teliyani swelling ni doctor assess cheyyali.', care: ['Eppudu start ayyindo, one-side/two-side undo note cheyyandi.', 'Swollen area meeda tight clothes/pressure avoid cheyyandi.', 'Swelling continue ayithe medical review teesukondi.'], redFlags: 'sudden face/tongue swelling, breathing problem, one-side painful leg swelling, chest pain, leda fainting.' },
    hi: { what: 'सूजन के कई कारण हो सकते हैं; नई या बिना कारण की सूजन की जाँच होनी चाहिए।', care: ['कब शुरू हुई और एक तरफ है या दोनों तरफ, यह नोट करें।', 'सूजे हिस्से पर तंग कपड़े या दबाव से बचें।', 'सूजन बनी रहे तो डॉक्टर से मिलें।'], redFlags: 'अचानक चेहरे/जीभ में सूजन, साँस की तकलीफ़, एक पैर में दर्दनाक सूजन, सीने में दर्द, या बेहोशी।' },
    'hi-roman': { what: 'Sujan ke kai causes ho sakte hain; nayi ya bina wajah ki sujan ki jaanch honi chahiye.', care: ['Kab shuru hui aur ek ya dono taraf hai, note karein.', 'Sooje hisse par tight kapde ya pressure se bachein.', 'Sujan bani rahe to doctor se milein.'], redFlags: 'achanak chehre/zubaan mein sujan, saans ki dikkat, ek pair mein dardnaak sujan, seene mein dard, ya behoshi.' },
  },
  wound: {
    en: { what: 'A wound or injury may need cleaning and assessment depending on its depth and cause.', care: ['For a small cut, rinse with clean running water and cover with a clean dressing.', 'Do not put powders, toothpaste, or unknown substances on it.', 'Check whether tetanus advice is needed for a dirty or deep wound.'], redFlags: 'bleeding that will not stop with firm pressure, a deep/gaping wound, exposed tissue, a serious bite, numbness, or signs of infection.' },
    te: { what: 'గాయం లోతు, కారణాన్ని బట్టి శుభ్రపరచడం లేదా వైద్య పరీక్ష అవసరం కావచ్చు.', care: ['చిన్న కోత అయితే శుభ్రమైన ప్రవహించే నీటితో కడిగి శుభ్రమైన కట్టుతో కప్పండి.', 'పొడులు, టూత్‌పేస్ట్ లేదా తెలియని పదార్థాలు రాయవద్దు.', 'మురికి లేదా లోతైన గాయానికి టెటానస్ సలహా అవసరమా అడగండి.'], redFlags: 'ఒత్తిడి పెట్టినా ఆగని రక్తస్రావం, లోతైన/తెరిచి ఉన్న గాయం, లోపలి కణజాలం కనిపించడం, తీవ్రమైన కాటు, మొద్దుబారడం లేదా ఇన్ఫెక్షన్ లక్షణాలు.' },
    tanglish: { what: 'Wound/injury depth mariyu cause batti cleaning leda medical assessment avasaram avvachu.', care: ['Small cut ayithe clean running water tho wash chesi clean dressing tho cover cheyyandi.', 'Powder, toothpaste leda teliyani substances pettakandi.', 'Dirty/deep wound ki tetanus advice avasarama ani adagandi.'], redFlags: 'firm pressure tho aagani bleeding, deep/open wound, lopali tissue kanipinchadam, serious bite, numbness, leda infection signs.' },
    hi: { what: 'घाव की गहराई और कारण के अनुसार सफाई या चिकित्सकीय जाँच ज़रूरी हो सकती है।', care: ['छोटे कट को साफ़ बहते पानी से धोकर साफ़ पट्टी से ढकें।', 'उस पर पाउडर, टूथपेस्ट या अनजान चीज़ न लगाएँ।', 'गंदे या गहरे घाव में टिटनेस सलाह की ज़रूरत पूछें।'], redFlags: 'दबाव देने पर भी न रुकने वाला खून, गहरा/खुला घाव, अंदर का ऊतक दिखना, गंभीर काटना, सुन्नपन, या संक्रमण के लक्षण।' },
    'hi-roman': { what: 'Ghaav ki gehraai aur cause ke mutabik safai ya medical check zaroori ho sakta hai.', care: ['Chhote cut ko saaf bahte paani se dhokar clean dressing se dhakein.', 'Powder, toothpaste ya anjaan cheez na lagayein.', 'Gande/gehre ghaav mein tetanus salah ki zaroorat poochhein.'], redFlags: 'pressure ke baad bhi na rukne wala khoon, gehra/khula ghaav, andar ka tissue dikhna, serious bite, sunnpan, ya infection signs.' },
  },
  hair: {
    en: { what: 'Hair loss can have many causes, including genetics, stress, illness, or scalp conditions.', care: ['Use gentle hair care and avoid tight hairstyles or harsh treatments.', 'Note when it started and whether there are scalp symptoms.', 'Discuss persistent or sudden hair loss with a clinician.'], redFlags: 'sudden patchy hair loss with pain, scarring, severe scalp inflammation, or other new significant symptoms.' },
    te: { what: 'జుట్టు రాలడానికి వంశపారంపర్యం, ఒత్తిడి, అనారోగ్యం లేదా తల చర్మ సమస్యలు సహా అనేక కారణాలు ఉండవచ్చు.', care: ['మృదువైన జుట్టు సంరక్షణ పాటించి బిగుతైన స్టైళ్లు లేదా కఠిన చికిత్సలు తగ్గించండి.', 'ఎప్పుడు మొదలైందో, తల చర్మ లక్షణాలు ఉన్నాయో గమనించండి.', 'జుట్టు రాలడం కొనసాగితే లేదా అకస్మాత్తుగా పెరిగితే వైద్యుడిని కలవండి.'], redFlags: 'నొప్పితో అకస్మాత్తుగా మచ్చలుగా జుట్టు రాలడం, మచ్చలు ఏర్పడటం, తీవ్రమైన తల చర్మ వాపు లేదా ఇతర కొత్త తీవ్రమైన లక్షణాలు.' },
    tanglish: { what: 'Hair loss genetics, stress, illness leda scalp condition tho saha chaala causes valla ravachu.', care: ['Gentle hair care use chesi tight styles/harsh treatments avoid cheyyandi.', 'Eppudu start ayyindo, scalp symptoms unnayo note cheyyandi.', 'Hair loss continue ayina leda sudden ga perigina clinician ni kalavandi.'], redFlags: 'pain tho sudden patchy hair loss, scarring, severe scalp inflammation, leda vere kottha serious symptoms.' },
    hi: { what: 'बाल झड़ने के कई कारण हो सकते हैं, जैसे आनुवंशिकता, तनाव, बीमारी या सिर की त्वचा की समस्या।', care: ['बालों की कोमल देखभाल करें और बहुत तंग स्टाइल या कठोर उपचार से बचें।', 'कब शुरू हुआ और सिर की त्वचा में लक्षण हैं या नहीं, नोट करें।', 'बाल लगातार या अचानक अधिक झड़ें तो डॉक्टर से चर्चा करें।'], redFlags: 'दर्द के साथ अचानक जगह-जगह बाल झड़ना, निशान बनना, सिर की त्वचा में गंभीर सूजन, या अन्य नए गंभीर लक्षण।' },
    'hi-roman': { what: 'Baal jhadne ke kai causes ho sakte hain, jaise genetics, stress, illness ya scalp condition.', care: ['Gentle hair care karein aur tight styles/harsh treatment se bachein.', 'Kab shuru hua aur scalp symptoms hain ya nahi, note karein.', 'Hair loss continue ho ya achanak badhe to doctor se baat karein.'], redFlags: 'dard ke saath achanak patchy hair loss, scarring, severe scalp inflammation, ya doosre naye serious symptoms.' },
  },
  weight: {
    en: { what: 'Weight changes can be related to food, activity, stress, medicines, or health conditions.', care: ['Focus on regular balanced meals and sustainable activity rather than crash diets.', 'Track changes over time and note appetite or other symptoms.', 'Discuss unexplained or rapid weight change with a clinician.'], redFlags: 'rapid unexplained weight loss, inability to eat or drink, fainting, severe weakness, or weight change with other serious symptoms.' },
    te: { what: 'బరువు మార్పులకు ఆహారం, కదలిక, ఒత్తిడి, మందులు లేదా ఆరోగ్య పరిస్థితులు కారణం కావచ్చు.', care: ['తీవ్ర డైట్‌లకు బదులుగా సమతుల్య భోజనం, సాధ్యమైన స్థిరమైన కదలికపై దృష్టి పెట్టండి.', 'కాలక్రమంలో మార్పులు, ఆకలి లేదా ఇతర లక్షణాలను నమోదు చేయండి.', 'కారణం తెలియని లేదా వేగమైన బరువు మార్పును వైద్యుడితో చర్చించండి.'], redFlags: 'కారణం తెలియకుండా వేగంగా బరువు తగ్గడం, తినలేక/తాగలేకపోవడం, మూర్ఛ, తీవ్రమైన బలహీనత లేదా ఇతర తీవ్రమైన లక్షణాలతో బరువు మార్పు.' },
    tanglish: { what: 'Weight changes food, activity, stress, medicines leda health conditions tho sambandham undachu.', care: ['Crash diets badulu balanced meals, sustainable activity meeda focus cheyyandi.', 'Changes ni time tho track chesi appetite/other symptoms note cheyyandi.', 'Unexplained leda fast weight change ni clinician tho discuss cheyyandi.'], redFlags: 'reason lekunda fast weight loss, tinaleka/tagaleka povadam, fainting, severe weakness, leda vere serious symptoms tho weight change.' },
    hi: { what: 'वज़न में बदलाव भोजन, गतिविधि, तनाव, दवाओं या स्वास्थ्य स्थितियों से जुड़ा हो सकता है।', care: ['क्रैश डाइट के बजाय संतुलित भोजन और टिकाऊ गतिविधि पर ध्यान दें।', 'समय के साथ बदलाव, भूख और अन्य लक्षण लिखें।', 'बिना कारण या तेज़ वज़न बदलाव पर डॉक्टर से चर्चा करें।'], redFlags: 'बिना कारण तेज़ वज़न घटना, खाना/पीना न कर पाना, बेहोशी, गंभीर कमजोरी, या अन्य गंभीर लक्षणों के साथ वज़न बदलना।' },
    'hi-roman': { what: 'Wazan mein badlav khane, activity, stress, medicines ya health conditions se juda ho sakta hai.', care: ['Crash diet ke bajay balanced meals aur sustainable activity par dhyan dein.', 'Samay ke saath changes, bhookh aur doosre symptoms note karein.', 'Bina wajah ya tez wazan badlav par doctor se baat karein.'], redFlags: 'bina wajah tez weight loss, kha/pi na pana, fainting, severe kamzori, ya doosre serious symptoms ke saath weight change.' },
  },
  child: {
    en: { what: 'Fever or cough in a child needs age-specific assessment, especially for infants.', care: ['Offer fluids or usual feeds and monitor breathing, alertness, and urination.', 'Use a thermometer and note the child’s age and symptom duration.', 'Contact a pediatric clinician for advice; do not give adult medicines to a child.'], redFlags: 'a baby under 3 months with fever, difficulty breathing, unusual sleepiness, blue lips, seizure, dehydration, or a child getting worse.' },
    te: { what: 'పిల్లల్లో జ్వరం లేదా దగ్గుకు వయస్సును బట్టి పరీక్ష అవసరం; చిన్న శిశువులకు ప్రత్యేక జాగ్రత్త అవసరం.', care: ['ద్రవాలు లేదా సాధారణ ఆహారం ఇవ్వండి; శ్వాస, చురుకుదనం, మూత్రాన్ని గమనించండి.', 'థర్మామీటర్‌తో ఉష్ణోగ్రత కొలిచి వయస్సు, లక్షణాల వ్యవధి నమోదు చేయండి.', 'పిల్లల వైద్యుడిని సంప్రదించండి; పెద్దల మందులు పిల్లలకు ఇవ్వకండి.'], redFlags: '3 నెలల లోపు శిశువుకు జ్వరం, శ్వాస ఇబ్బంది, అసాధారణ నిద్రమత్తు, పెదవులు నీలం కావడం, ఫిట్స్, నీరసం లేదా పరిస్థితి దిగజారడం.' },
    tanglish: { what: 'Pillalaki fever/cough age batti assess cheyyali; chinna babies ki special care avasaram.', care: ['Fluids leda usual feeds ivvandi; breathing, alertness, urine gamaninchandi.', 'Thermometer tho temperature check chesi age/duration note cheyyandi.', 'Pediatric clinician ni contact cheyyandi; adult medicines pillalaki ivvakandi.'], redFlags: '3 months kanna chinna baby ki fever, breathing problem, unusual sleepiness, lips blue avvadam, seizure, dehydration, leda child condition worsen avvadam.' },
    hi: { what: 'बच्चे में बुखार या खाँसी का आकलन उम्र के अनुसार होना चाहिए, खासकर छोटे शिशु में।', care: ['तरल या सामान्य आहार दें और साँस, सतर्कता तथा पेशाब पर ध्यान दें।', 'थर्मामीटर से तापमान लें और उम्र व लक्षणों की अवधि नोट करें।', 'बाल रोग विशेषज्ञ से सलाह लें; बच्चे को वयस्कों की दवा न दें।'], redFlags: '3 महीने से छोटे शिशु को बुखार, साँस की तकलीफ़, असामान्य नींद, होंठ नीले पड़ना, दौरा, पानी की कमी, या बच्चे की हालत बिगड़ना।' },
    'hi-roman': { what: 'Bachche ke bukhar/khansi ka assessment umar ke mutabik hona chahiye, khaaskar chhote infant mein.', care: ['Fluids ya usual feed dein; saans, alertness aur urine dekhein.', 'Thermometer se temperature lekar age/duration note karein.', 'Pediatric doctor se salah lein; adult medicine bachche ko na dein.'], redFlags: '3 mahine se chhote baby ko bukhar, saans ki dikkat, unusual neend, hont neele, seizure, dehydration, ya bachche ki halat bigadna.' },
  },
  pregnancy: {
    en: { what: 'Pregnancy questions and symptoms need individualized care from a qualified maternity clinician.', care: ['Contact a maternity clinician to confirm pregnancy and discuss next steps.', 'Avoid starting medicines or supplements without professional advice.', 'Keep a note of symptoms, dates, and any medicines already taken.'], redFlags: 'heavy bleeding, severe abdominal pain, fainting, severe headache or vision change, or difficulty breathing.' },
    te: { what: 'గర్భధారణ ప్రశ్నలు, లక్షణాలకు అర్హత కలిగిన ప్రసూతి వైద్యుడి వ్యక్తిగత సలహా అవసరం.', care: ['గర్భధారణను నిర్ధారించుకుని తదుపరి చర్యల కోసం ప్రసూతి వైద్యుడిని సంప్రదించండి.', 'వృత్తిపరమైన సలహా లేకుండా మందులు లేదా సప్లిమెంట్లు మొదలు పెట్టకండి.', 'లక్షణాలు, తేదీలు, ఇప్పటికే తీసుకున్న మందులను నమోదు చేయండి.'], redFlags: 'అధిక రక్తస్రావం, తీవ్రమైన కడుపు నొప్పి, మూర్ఛ, తీవ్రమైన తలనొప్పి/చూపు మార్పు లేదా శ్వాస ఇబ్బంది.' },
    tanglish: { what: 'Pregnancy questions/symptoms ki qualified maternity clinician nundi individual care avasaram.', care: ['Pregnancy confirm chesi next steps discuss cheyyadaniki maternity clinician ni contact cheyyandi.', 'Professional advice lekunda medicines/supplements start cheyyakandi.', 'Symptoms, dates, already teesukunna medicines note cheyyandi.'], redFlags: 'heavy bleeding, severe stomach pain, fainting, severe headache/vision change, leda breathing problem.' },
    hi: { what: 'गर्भावस्था से जुड़े सवालों और लक्षणों के लिए योग्य मातृत्व चिकित्सक की व्यक्तिगत सलाह ज़रूरी है।', care: ['गर्भावस्था की पुष्टि और आगे की योजना के लिए मातृत्व चिकित्सक से संपर्क करें।', 'विशेषज्ञ की सलाह के बिना दवा या सप्लीमेंट शुरू न करें।', 'लक्षण, तारीखें और पहले से ली गई दवाएँ नोट करें।'], redFlags: 'बहुत अधिक रक्तस्राव, तेज पेट दर्द, बेहोशी, गंभीर सिरदर्द/दृष्टि में बदलाव, या साँस लेने में कठिनाई।' },
    'hi-roman': { what: 'Pregnancy ke sawalon/symptoms ke liye qualified maternity clinician ki personal salah zaroori hai.', care: ['Pregnancy confirm aur next steps ke liye maternity clinician se sampark karein.', 'Professional salah ke bina dawa/supplement shuru na karein.', 'Symptoms, dates aur pehle li gayi medicines note karein.'], redFlags: 'heavy bleeding, tez pet dard, behoshi, severe headache/vision change, ya saans lene mein dikkat.' },
  },
  anemia: {
    en: { what: 'Anemia means low hemoglobin, but tiredness, dizziness, or pale skin can have other causes too.', care: ['A clinician can check a complete blood count and hemoglobin.', 'Include iron-rich foods such as leafy greens, beans, and dates if suitable for you.', 'Take iron tablets only when advised by a clinician.'], redFlags: 'chest pain, fainting, severe breathlessness, or rapidly worsening weakness.' },
    te: { what: 'రక్తహీనత అంటే హిమోగ్లోబిన్ తక్కువగా ఉండటం; అలసట, తల తిరగడం లేదా పాలిపోయిన చర్మానికి ఇతర కారణాలు కూడా ఉండవచ్చు.', care: ['వైద్యుడు CBC మరియు హిమోగ్లోబిన్ పరీక్షలు సూచించవచ్చు.', 'మీకు సరిపోతే ఆకుకూరలు, బీన్స్, ఖర్జూరం వంటి ఐరన్ ఉన్న ఆహారం తీసుకోండి.', 'వైద్యుడి సలహా ఉన్నప్పుడే ఐరన్ మాత్రలు వాడండి.'], redFlags: 'ఛాతీ నొప్పి, మూర్ఛ, తీవ్రమైన శ్వాస ఇబ్బంది లేదా వేగంగా పెరుగుతున్న బలహీనత.' },
    tanglish: { what: 'Anemia ante hemoglobin takkuva; tiredness, dizziness, pale skin ki vere causes kuda undachu.', care: ['Clinician CBC mariyu hemoglobin test cheyyamani cheppavachu.', 'Meeku suitable ayithe leafy greens, beans, dates lanti iron foods teesukondi.', 'Clinician cheppinappude iron tablets teesukondi.'], redFlags: 'chest pain, fainting, severe breathlessness, leda fast ga perigే weakness.' },
    hi: { what: 'एनीमिया का अर्थ हीमोग्लोबिन कम होना है, लेकिन थकान, चक्कर या पीली त्वचा के अन्य कारण भी हो सकते हैं।', care: ['डॉक्टर CBC और हीमोग्लोबिन जाँच करा सकते हैं।', 'आपके लिए उचित हो तो हरी पत्तेदार सब्ज़ियाँ, बीन्स और खजूर जैसे आयरन वाले भोजन लें।', 'आयरन की गोलियाँ केवल डॉक्टर की सलाह पर लें।'], redFlags: 'सीने में दर्द, बेहोशी, गंभीर साँस की तकलीफ़, या तेज़ी से बढ़ती कमजोरी।' },
    'hi-roman': { what: 'Anemia ka matlab hemoglobin kam hona hai, lekin thakaan, chakkar ya peeli skin ke doosre causes bhi ho sakte hain.', care: ['Doctor CBC aur hemoglobin test kara sakte hain.', 'Aapke liye theek ho to hari sabzi, beans aur khajoor jaise iron foods lein.', 'Iron tablet sirf doctor ki salah par lein.'], redFlags: 'seene mein dard, behoshi, severe saans ki dikkat, ya tezi se badhti kamzori.' },
  },
  cancer: {
    en: { what: 'A symptom or concern alone does not mean cancer. Only a qualified clinician can assess it.', care: ['Arrange a timely evaluation with a clinician; if cancer is suspected or diagnosed, ask about an oncologist.', 'Write down symptoms, when they began, and any relevant test results.', 'Avoid unproven treatments and do not delay recommended testing.'], redFlags: 'severe or rapidly worsening symptoms, uncontrolled bleeding, or difficulty breathing.' },
    te: { what: 'ఒక లక్షణం లేదా ఆందోళన మాత్రమే క్యాన్సర్ అని అర్థం కాదు. అర్హత కలిగిన వైద్యుడే పరీక్షించగలరు.', care: ['సమయానికి వైద్యుడిని కలవండి; క్యాన్సర్ అనుమానం లేదా నిర్ధారణ ఉంటే ఆంకాలజిస్ట్‌ను సంప్రదించండి.', 'లక్షణాలు ఎప్పుడు మొదలయ్యాయో, పరీక్ష ఫలితాలు ఉంటే వాటిని నమోదు చేయండి.', 'నిరూపించని చికిత్సలను నివారించి, సూచించిన పరీక్షలను ఆలస్యం చేయకండి.'], redFlags: 'తీవ్రమైన లేదా వేగంగా పెరుగుతున్న లక్షణాలు, ఆగని రక్తస్రావం లేదా శ్వాస ఇబ్బంది.' },
    tanglish: { what: 'Oka symptom leda concern undadam matrame cancer ani artham kadu. Qualified clinician matrame assess cheyyagalru.', care: ['Timely ga clinician ni kalavandi; cancer suspect/diagnose ayithe oncologist gurinchi adagandi.', 'Symptoms eppudu start ayyayo, test results unte note chesukondi.', 'Proven kani treatments avoid chesi, suggest chesina tests delay cheyyakandi.'], redFlags: 'severe leda fast ga perige symptoms, control kani bleeding, leda breathing problem.' },
    hi: { what: 'केवल किसी लक्षण या चिंता का होना कैंसर नहीं बताता। इसकी जाँच योग्य डॉक्टर ही कर सकते हैं।', care: ['समय पर डॉक्टर से जाँच कराएँ; कैंसर का संदेह या पुष्टि हो तो ऑन्कोलॉजिस्ट से पूछें।', 'लक्षण कब शुरू हुए और जाँच के नतीजे हों तो लिखें।', 'अप्रमाणित उपचारों से बचें और सुझाई गई जाँच में देरी न करें।'], redFlags: 'गंभीर या तेज़ी से बिगड़ते लक्षण, न रुकने वाला खून, या साँस लेने में कठिनाई।' },
    'hi-roman': { what: 'Sirf symptom ya chinta hone ka matlab cancer nahi hai. Qualified doctor hi jaanch kar sakte hain.', care: ['Samay par doctor se jaanch karayein; cancer ka shak ya diagnosis ho to oncologist ke baare mein poochhein.', 'Symptoms kab shuru hue aur test results hon to likhein.', 'Unproven treatment se bachein aur suggest kiye tests mein der na karein.'], redFlags: 'serious ya tezi se bigadte symptoms, na rukne wala khoon, ya saans lene mein dikkat.' },
  },
  infectious: {
    en: { what: 'This condition needs proper testing; symptoms alone cannot confirm the cause. Care is available and there is no need for blame or stigma.', care: ['Arrange a confidential assessment with a qualified clinician.', 'Follow testing and treatment advice; do not start or stop prescription medicines on your own.', 'For a persistent cough or fever, ask a clinician about appropriate precautions while awaiting assessment.'], redFlags: 'difficulty breathing, coughing blood, confusion, fainting, or rapid worsening.' },
    te: { what: 'ఈ పరిస్థితికి సరైన పరీక్ష అవసరం; లక్షణాలతోనే కారణం నిర్ధారించలేం. చికిత్స అందుబాటులో ఉంది; నింద లేదా వివక్ష అవసరం లేదు.', care: ['గోప్యంగా అర్హత కలిగిన వైద్యుడిని సంప్రదించండి.', 'పరీక్ష, చికిత్స సలహాను పాటించండి; ప్రిస్క్రిప్షన్ మందులను స్వయంగా మొదలుపెట్టడం లేదా ఆపడం చేయకండి.', 'దగ్గు లేదా జ్వరం కొనసాగితే, పరీక్ష కోసం వేచి ఉన్నప్పుడు తీసుకోవాల్సిన జాగ్రత్తలను వైద్యుడిని అడగండి.'], redFlags: 'శ్వాస ఇబ్బంది, దగ్గులో రక్తం, గందరగోళం, మూర్ఛ లేదా వేగంగా పరిస్థితి దిగజారడం.' },
    tanglish: { what: 'Ee condition ki proper testing avasaram; symptoms matrame cause confirm cheyyavu. Treatment available undi, blame/stigma avasaram ledu.', care: ['Confidential ga qualified clinician ni kalavandi.', 'Testing/treatment advice follow avvandi; prescription medicines self ga start/stop cheyyakandi.', 'Cough leda fever continue ayithe assessment varaku precautions gurinchi clinician ni adagandi.'], redFlags: 'breathing problem, cough lo blood, confusion, fainting, leda fast ga condition worsen avvadam.' },
    hi: { what: 'इस स्थिति के लिए उचित जाँच ज़रूरी है; केवल लक्षण कारण की पुष्टि नहीं करते। इलाज उपलब्ध है और दोष या कलंक की कोई जगह नहीं है।', care: ['योग्य डॉक्टर से गोपनीय रूप से जाँच कराएँ।', 'जाँच और उपचार की सलाह मानें; दवा स्वयं शुरू या बंद न करें।', 'खाँसी या बुखार बना रहे तो जाँच तक उचित सावधानियों के बारे में डॉक्टर से पूछें।'], redFlags: 'साँस लेने में कठिनाई, खाँसी में खून, भ्रम, बेहोशी, या तेज़ी से हालत बिगड़ना।' },
    'hi-roman': { what: 'Is condition ke liye sahi testing zaroori hai; sirf symptoms se cause confirm nahi hota. Treatment available hai, blame ya stigma ki zaroorat nahi.', care: ['Qualified doctor se confidential jaanch karayein.', 'Testing/treatment advice follow karein; prescription medicine khud se shuru ya band na karein.', 'Khansi ya bukhar bana rahe to assessment tak precautions ke baare mein doctor se poochhein.'], redFlags: 'saans lene mein dikkat, khansi mein khoon, confusion, behoshi, ya tezi se halat bigadna.' },
  },
}

const conditionDefinitions = [
  ['fever', 'fever', 'fever', 'fever', 'General Physician', 'soon', ['fever', 'jwaram', 'jvaram', 'bukhar', 'temperature', 'hot body'], ['జ్వరం', 'జ్వరము', 'बुखार', 'ताप']],
  ['headache', 'headache', 'pain', 'headache', 'General Physician', 'routine', ['headache', 'head pain', 'tala noppi', 'tala noppiga', 'sar dard', 'migraine'], ['తలనొప్పి', 'తల నొప్పి', 'सिरदर्द', 'माइग्रेन']],
  ['migraine', 'headache', 'pain', 'headache', 'Neurology', 'soon', ['migraine'], ['మైగ్రేన్', 'माइग्रेन']],
  ['common-cold', 'cold', 'respiratory', 'cold', 'General Physician', 'routine', ['cold', 'jalubu', 'sardi', 'sneezing'], ['జలుబు', 'छींक', 'सर्दी']],
  ['cough', 'cough', 'respiratory', 'cough', 'General Physician', 'routine', ['cough', 'daggu', 'khansi', 'sneezing'], ['దగ్గు', 'खाँसी']],
  ['loose-motions', 'diarrhea', 'diarrhea', 'diarrhea', 'General Physician', 'soon', ['motions', 'motion', 'loose motions', 'loose motion', 'diarrhea', 'diarrhoea', 'loose stool', 'watery stool', 'frequent stool', 'motions avuthunnayi', 'kadupu loose', 'potty loose', 'dast', 'moshans'], ['విరేచనాలు', 'పలుచటి మలం', 'దస్త్', 'दस्त', 'पतला मल']],
  ['dysentery', 'diarrhea', 'diarrhea', 'diarrhea', 'General Physician', 'soon', ['dysentery', 'blood in stool'], ['రక్తంతో విరేచనాలు', 'पेचिश']],
  ['constipation', 'constipation', 'constipation', 'constipation', 'General Physician', 'routine', ['constipation', 'potty ravatledu', 'motion ravatledu', 'kabz', 'hard stool'], ['మలబద్ధకం', 'మోషన్ రావడం లేదు', 'कब्ज', 'कठोर मल']],
  ['stomach-pain', 'stomach', 'digestive', 'stomachPain', 'General Physician', 'soon', ['stomach pain', 'kadupu noppi', 'pet dard', 'abdominal pain', 'belly pain', 'gastric pain'], ['కడుపు నొప్పి', 'పొట్ట నొప్పి', 'पेट दर्द']],
  ['acidity', 'acidity', 'digestive', 'acidity', 'General Physician', 'routine', ['acidity', 'gas', 'gastic', 'gastritis', 'heartburn', 'chest burning', 'manta', 'khatti dakar'], ['అసిడిటీ', 'గ్యాస్', 'మంట', 'గుండెల్లో మంట', 'एसिडिटी', 'खट्टी डकार']],
  ['vomiting', 'vomiting', 'digestive', 'vomiting', 'General Physician', 'soon', ['vomiting', 'vomit', 'vanti', 'vomiting avuthundi', 'nausea', 'ulti', 'vomiting sensation'], ['వాంతులు', 'వికారం', 'उल्टी', 'मतली']],
  ['body-pain', 'bodyPain', 'pain', 'pain', 'General Physician', 'routine', ['body pain', 'body ache', 'mootlu noppi'], ['శరీర నొప్పి', 'शरीर दर्द']],
  ['joint-pain', 'jointPain', 'pain', 'pain', 'General Physician', 'routine', ['joint pain', 'joint ache', 'mootlu noppi'], ['కీళ్ల నొప్పి', 'जोड़ों का दर्द']],
  ['leg-pain', 'legPain', 'pain', 'pain', 'General Physician', 'routine', ['leg pain', 'leg ache', 'kalu noppi', 'my leg is paining', 'leg is paining'], ['కాలి నొప్పి', 'पैर में दर्द']],
  ['knee-pain', 'kneePain', 'pain', 'pain', 'General Physician', 'routine', ['knee pain', 'knee ache', 'mootlu noppi'], ['మోకాలి నొప్పి', 'घुटने का दर्द']],
  ['back-pain', 'backPain', 'pain', 'pain', 'General Physician', 'routine', ['back pain', 'nadumu noppi', 'kamar dard', 'lower back pain'], ['నడుము నొప్పి', 'कमर दर्द']],
  ['shoulder-pain', 'shoulderPain', 'pain', 'pain', 'General Physician', 'routine', ['shoulder pain', 'shoulder ache'], ['భుజం నొప్పి', 'कंधे का दर्द']],
  ['chest-pain', 'chestPain', 'urgent', 'urgent', 'Emergency department', 'urgent', ['chest pain', 'gunde noppi', 'chest tight', 'chati dard'], ['ఛాతి నొప్పి', 'గుండె నొప్పి', 'सीने में दर्द']],
  ['breathing-problem', 'breathing', 'urgent', 'urgent', 'Emergency department', 'urgent', ['breathing problem', 'breathing', 'breathlessness', 'oopiri adadam', 'saans', 'shortness of breath'], ['శ్వాస ఇబ్బంది', 'ఊపిరి ఆడటం', 'साँस की तकलीफ़']],
  ['asthma-wheezing', 'breathing', 'respiratory', 'breathing', 'Pulmonology', 'soon', ['asthma', 'wheezing'], ['ఆస్తమా', 'వీజింగ్', 'दमा', 'घरघराहट']],
  ['diabetes', 'diabetes', 'chronic', 'diabetes', 'General Physician', 'soon', ['diabetes', 'sugar', 'sugar ekkuva', 'madhumeham', 'blood sugar'], ['మధుమేహం', 'షుగర్', 'मधुमेह', 'ब्लड शुगर']],
  ['high-blood-pressure', 'bloodPressure', 'chronic', 'bloodPressure', 'General Physician', 'soon', ['bp', 'blood pressure', 'bp ekkuva', 'hypertension', 'high bp'], ['రక్తపోటు', 'బీపీ ఎక్కువ', 'उच्च रक्तचाप']],
  ['low-blood-pressure', 'bloodPressure', 'chronic', 'bloodPressure', 'General Physician', 'soon', ['bp takkuva', 'low bp', 'low blood pressure', 'hypotension'], ['బీపీ తక్కువ', 'తక్కువ రక్తపోటు', 'निम्न रक्तचाप']],
  ['itching', 'skin', 'skin', 'skin', 'Dermatology', 'routine', ['itching', 'itchy skin', 'durada'], ['దురద', 'खुजली']],
  ['rash', 'skin', 'skin', 'skin', 'Dermatology', 'routine', ['rash', 'skin rash', 'skin allergy'], ['దద్దుర్లు', 'చర్మ అలర్జీ', 'चकत्ते']],
  ['acne', 'skin', 'skin', 'skin', 'Dermatology', 'routine', ['pimples', 'acne'], ['మొటిమలు', 'मुहाँसे']],
  ['dandruff', 'skin', 'skin', 'skin', 'Dermatology', 'routine', ['dandruff'], ['చుండ్రు', 'रूसी']],
  ['fungal-skin', 'skin', 'skin', 'skin', 'Dermatology', 'soon', ['fungal', 'fungal infection', 'ringworm'], ['ఫంగల్ ఇన్ఫెక్షన్', 'దద్దుర్లు', 'दाद']],
  ['allergy', 'allergy', 'allergy', 'allergy', 'General Physician', 'routine', ['allergy', 'dust allergy', 'food allergy', 'sneezing'], ['అలర్జీ', 'ధూళి అలర్జీ', 'ఆహార అలర్జీ', 'एलर्जी']],
  ['eye-pain', 'eye', 'eye', 'eye', 'Ophthalmology', 'soon', ['eye pain', 'kannu noppi'], ['కంటి నొప్పి', 'आँख में दर्द']],
  ['red-eye', 'eye', 'eye', 'eye', 'Ophthalmology', 'soon', ['eye red', 'red eye', 'kannu erra'], ['కన్ను ఎర్రగా', 'आँख लाल']],
  ['eye-watering-blur', 'eye', 'eye', 'eye', 'Ophthalmology', 'soon', ['eye watering', 'vision blur', 'blurred vision'], ['కన్నీరు రావడం', 'మసక చూపు', 'धुंधला दिखना']],
  ['ear-pain', 'ear', 'ear', 'ear', 'ENT', 'soon', ['ear pain', 'chevi noppi'], ['చెవి నొప్పి', 'कान में दर्द']],
  ['ear-wax-hearing', 'ear', 'ear', 'ear', 'ENT', 'routine', ['ear wax', 'hearing problem', 'hearing loss'], ['చెవి గులిమి', 'వినికిడి సమస్య', 'कान का मैल', 'सुनने में दिक्कत']],
  ['tooth-pain', 'tooth', 'dental', 'tooth', 'Dentist', 'soon', ['tooth pain', 'pannu noppi', 'daant dard'], ['పంటి నొప్పి', 'दाँत दर्द']],
  ['gum-pain', 'tooth', 'dental', 'tooth', 'Dentist', 'soon', ['gum pain', 'gum swelling'], ['చిగుళ్ల నొప్పి', 'मसूड़े का दर्द']],
  ['throat-pain', 'throat', 'throat', 'throat', 'General Physician', 'routine', ['throat pain', 'gonthu noppi', 'sore throat', 'gala dard'], ['గొంతు నొప్పి', 'గొంతు మంట', 'गले में दर्द']],
  ['dizziness', 'dizziness', 'wellbeing', 'weakness', 'General Physician', 'soon', ['dizziness', 'dizzy', 'dizziness ga undi', 'kalu thiruguthundi', 'chakkar', 'faint', 'lightheaded'], ['తల తిరగడం', 'కాళ్లు తిరుగుతున్నాయి', 'चक्कर', 'बेहोशी']],
  ['weakness', 'weakness', 'wellbeing', 'weakness', 'General Physician', 'routine', ['weakness', 'nirasam', 'low energy'], ['బలహీనత', 'నీరసం', 'कमज़ोरी']],
  ['fatigue', 'fatigue', 'wellbeing', 'weakness', 'General Physician', 'routine', ['tired', 'fatigue', 'alupu', 'very tired'], ['అలసట', 'थकान']],
  ['insomnia', 'sleep', 'wellbeing', 'sleep', 'General Physician', 'routine', ['sleep ravatledu', 'nidra ledu', 'nidra ravatledu', 'insomnia', 'neend nahi'], ['నిద్ర రావడం లేదు', 'నిద్ర లేదు', 'अनिद्रा', 'नींद नहीं']],
  ['anxiety', 'anxiety', 'mental', 'mental', 'Mental health professional', 'soon', ['anxiety', 'bhayam', 'panic'], ['ఆందోళన', 'భయం', 'चिंता', 'घबराहट']],
  ['stress', 'stress', 'mental', 'mental', 'Mental health professional', 'routine', ['stress', 'tension', 'manasika'], ['ఒత్తిడి', 'మానసిక ఒత్తిడి', 'तनाव']],
  ['depression', 'depression', 'mental', 'mental', 'Mental health professional', 'soon', ['depression', 'low mood', 'feeling hopeless'], ['డిప్రెషన్', 'మానసిక దిగులు', 'अवसाद', 'उदासी']],
  ['period-pain', 'periods', 'reproductive', 'periods', 'Gynecology', 'routine', ['periods pain', 'period pain', 'menstrual pain'], ['పీరియడ్స్ నొప్పి', 'మాసిక నొప్పి', 'मासिक धर्म दर्द']],
  ['irregular-periods-pcod', 'periods', 'reproductive', 'periods', 'Gynecology', 'soon', ['irregular periods', 'pcod', 'pcos'], ['క్రమం లేని పీరియడ్స్', 'పీసీఓడీ', 'अनियमित पीरियड']],
  ['white-discharge', 'discharge', 'reproductive', 'periods', 'Gynecology', 'soon', ['white discharge', 'vaginal discharge'], ['తెల్లబట్ట', 'योनि स्राव']],
  ['urine-burning', 'urine', 'urinary', 'urine', 'General Physician', 'soon', ['urine pain', 'urine lo manta', 'burning urine', 'painful urination', 'peshab mein jalan'], ['మూత్రంలో మంట', 'మూత్రం నొప్పి', 'पेशाब में जलन']],
  ['frequent-urination', 'urine', 'urinary', 'urine', 'General Physician', 'soon', ['frequent urine', 'frequent urination', 'peshab baar baar'], ['తరచుగా మూత్రం', 'बार-बार पेशाब']],
  ['swelling', 'swelling', 'swelling', 'swelling', 'General Physician', 'soon', ['swelling', 'vappu', 'edema'], ['వాపు', 'सूजन']],
  ['leg-swelling', 'swelling', 'swelling', 'swelling', 'General Physician', 'soon', ['leg swelling', 'swollen leg'], ['కాలు వాపు', 'पैर में सूजन']],
  ['face-swelling', 'swelling', 'urgent', 'swelling', 'Emergency department', 'urgent', ['face swelling', 'facial swelling'], ['ముఖం వాపు', 'चेहरे पर सूजन']],
  ['wound-injury', 'wound', 'wound', 'wound', 'General Physician', 'soon', ['wound', 'injury', 'debba', 'cut', 'గాయం'], ['గాయం', 'దెబ్బ', 'चोट', 'घाव']],
  ['bleeding', 'bleeding', 'urgent', 'urgent', 'Emergency department', 'urgent', ['bleeding', 'heavy bleeding'], ['రక్తస్రావం', 'ఎక్కువ రక్తస్రావం', 'खून बहना']],
  ['hair-fall', 'hair', 'hair', 'hair', 'Dermatology', 'routine', ['hair fall', 'hairfall', 'ventruka raladam', 'bald', 'hair loss'], ['జుట్టు రాలడం', 'బట్టతల', 'बाल झड़ना', 'गंजापन']],
  ['weight-loss', 'weightLoss', 'weight', 'weight', 'General Physician', 'soon', ['weight loss', 'weight taggadam', 'losing weight'], ['బరువు తగ్గడం', 'वज़न कम होना']],
  ['weight-gain', 'weightGain', 'weight', 'weight', 'General Physician', 'routine', ['weight gain', 'badda', 'gaining weight'], ['బరువు పెరగడం', 'वज़न बढ़ना']],
  ['child-fever', 'childFever', 'child', 'fever', 'Pediatrics', 'soon', ['baby fever', 'child fever', 'pillalu fever', 'fever in baby'], ['పిల్లలకు జ్వరం', 'పాపకు జ్వరం', 'बच्चे को बुखार']],
  ['child-cough', 'childCough', 'child', 'cough', 'Pediatrics', 'soon', ['child cough', 'baby cough', 'pillalaki daggu'], ['పిల్లలకు దగ్గు', 'बच्चे को खाँसी']],
  ['pregnancy', 'pregnancy', 'pregnancy', 'pregnancy', 'Obstetrics', 'soon', ['pregnancy', 'pregnant', 'garbham'], ['గర్భం', 'గర్భధారణ', 'गर्भावस्था']],
  ['anemia', 'anemia', 'chronic', 'anemia', 'General Physician', 'soon', ['anemia', 'anaemia', 'aneamia', 'animia', 'low hemoglobin', 'hb low', 'blood less', 'rakta himinata'], ['రక్తహీనత', 'హిమోగ్లోబిన్ తక్కువ', 'खून की कमी', 'कम हीमोग्लोबिन']],
  ['thyroid', 'thyroid', 'chronic', 'chronic', 'Endocrinology', 'soon', ['thyroid', 'thayroid', 'thyroid problem', 'hypothyroid', 'hypo', 'hyperthyroid'], ['థైరాయిడ్', 'థైరాయిడ్ సమస్య', 'थायरॉइड']],
  ['arthritis', 'arthritis', 'pain', 'pain', 'Orthopedics', 'soon', ['arthritis', 'joint inflammation'], ['ఆర్థరైటిస్', 'కీళ్ల వాపు', 'गठिया']],
  ['sinus', 'sinus', 'respiratory', 'respiratory', 'ENT', 'soon', ['sinus', 'sinusitis', 'nose block', 'sinus headache'], ['సైనసైటిస్', 'ముక్కు దిబ్బడ', 'साइनस']],
  ['kidney-stone', 'kidneyStone', 'urinary', 'urinary', 'Urology', 'soon', ['kidney stone', 'renal stone', 'stone in kidney', 'stone', 'urine pain'], ['కిడ్నీ రాయి', 'మూత్రపిండ రాయి', 'गुर्दे की पथरी']],
  ['liver-problem', 'liver', 'chronic', 'chronic', 'Gastroenterology', 'soon', ['liver', 'liver problem', 'jaundice', 'pasupu', 'yellow eyes'], ['కాలేయం', 'కామెర్లు', 'जिगर', 'पीलिया']],
  ['heart-problem', 'heart', 'chronic', 'chronic', 'Cardiology', 'soon', ['heart problem', 'heart disease', 'heart', 'gunde', 'palpitation', 'palpitations'], ['గుండె సమస్య', 'గుండె దడ', 'दिल की बीमारी', 'धड़कन']],
  ['cancer', 'cancer', 'chronic', 'cancer', 'Oncology', 'soon', ['cancer', 'tumor', 'tumour', 'malignancy'], ['క్యాన్సర్', 'ట్యూమర్', 'कैंसर', 'ट्यूमर']],
  ['hiv', 'hiv', 'chronic', 'infectious', 'Infectious disease specialist', 'soon', ['hiv', 'human immunodeficiency virus', 'aids'], ['హెచ్ఐవి', 'ఎయిడ్స్', 'एचआईवी', 'एड्स']],
  ['tuberculosis', 'tuberculosis', 'respiratory', 'infectious', 'Pulmonology', 'soon', ['tb', 'tuberculosis', 'pulmonary tuberculosis'], ['క్షయ', 'టి.బి.', 'तपेदिक', 'टीबी']],
  ['kidney-disease', 'kidneyDisease', 'chronic', 'urinary', 'Nephrology', 'soon', ['kidney disease', 'kidney problem', 'kidney failure', 'renal disease'], ['మూత్రపిండాల వ్యాధి', 'కిడ్నీ సమస్య', 'गुर्दे की बीमारी']],
  ['high-cholesterol', 'cholesterol', 'chronic', 'chronic', 'General Physician', 'routine', ['high cholesterol', 'cholesterol', 'cholesterol high'], ['అధిక కొలెస్ట్రాల్', 'కొలెస్ట్రాల్', 'उच्च कोलेस्ट्रॉल']],
  ['dengue', 'dengue', 'fever', 'fever', 'General Physician', 'soon', ['dengue', 'dengue fever'], ['డెంగ్యూ', 'डेंगू']],
  ['malaria', 'malaria', 'fever', 'fever', 'General Physician', 'soon', ['malaria', 'malarial fever'], ['మలేరియా', 'मलेरिया']],
  ['viral-fever', 'viralFever', 'fever', 'fever', 'General Physician', 'soon', ['viral fever', 'viral infection fever'], ['వైరల్ జ్వరం', 'వైరల్ ఫీవర్', 'वायरल बुखार']],
  ['stomach-ulcer', 'ulcer', 'digestive', 'digestive', 'Gastroenterology', 'soon', ['stomach ulcer', 'gastric ulcer', 'peptic ulcer', 'ulcer'], ['కడుపు పుండు', 'అల్సర్', 'पेट का अल्सर']],
  ['piles', 'piles', 'digestive', 'digestive', 'General Physician', 'soon', ['piles', 'hemorrhoids', 'haemorrhoids', 'bawasir'], ['మొలలు', 'పైల్స్', 'बवासीर']],
  ['stroke', 'stroke', 'urgent', 'urgent', 'Emergency department', 'urgent', ['stroke', 'brain stroke', 'paralysis sudden'], ['స్ట్రోక్', 'పక్షవాతం', 'स्ट्रोक', 'लकवा']],
  ['hepatitis', 'hepatitis', 'chronic', 'infectious', 'Gastroenterology', 'soon', ['hepatitis', 'hepatitis b', 'hepatitis c'], ['హెపటైటిస్', 'కాలేయ వాపు', 'हेपेटाइटिस']],
  ['uti', 'uti', 'urinary', 'urinary', 'Urology', 'soon', ['uti', 'urinary tract infection', 'urine infection', 'bladder infection'], ['మూత్ర మార్గ ఇన్ఫెక్షన్', 'యూరిన్ ఇన్ఫెక్షన్', 'मूत्र संक्रमण']],
]

const commonMisspellings = {
  anemia: ['aneamia', 'animia'],
  fever: ['fevr'],
  headache: ['hedache'],
  'loose-motions': ['moshans'],
  thyroid: ['thayroid'],
  acidity: ['acidityy'],
  diabetes: ['daibetis'],
}

function buildCondition([id, nameKey, topic, guidanceKey, specialist, urgency, keywords, synonyms]) {
  const name = localizedNames[nameKey]
  const topicGuidance = guidance[guidanceKey] || guidance[topic] || guidance.digestive
  const replies = Object.fromEntries(languageCodes.map((language) => {
    const text = topicGuidance[language]
    const what = text.what.toLocaleLowerCase().includes(name[language].toLocaleLowerCase())
      ? text.what
      : `${name[language]}: ${text.what}`
    const reply = [
      `${labels[language].what} ${what}`,
      `${labels[language].care}\n1. ${text.care[0]}\n2. ${text.care[1]}\n3. ${text.care[2]}`,
      `${labels[language].redFlags} ${text.redFlags}`,
      `${labels[language].specialist} ${specialistNames[language][specialist] || specialist}.`,
    ].join('\n\n')
    return [language, reply]
  }))

  return {
    id,
    name,
    keywords,
    synonyms,
    specialist,
    urgency,
    remedies: topicGuidance.en.care,
    replies,
    topic,
    commonMisspellings: commonMisspellings[id] || [],
  }
}

export const healthKnowledge = conditionDefinitions.map(buildCondition)

const pluralForms = new Map([
  ['motions', 'motion'],
  ['fevers', 'fever'],
  ['pains', 'pain'],
  ['stools', 'stool'],
  ['symptoms', 'symptom'],
  ['pimples', 'pimple'],
  ['periods', 'period'],
  ['weeks', 'week'],
  ['days', 'day'],
])

export function normalizeText(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/paining\b/g, 'pain')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => pluralForms.get(word) || word)
    .join(' ')
}

const ignoredMatchWords = new Set([
  'i', 'a', 'am', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'for',
  'from', 'have', 'having', 'he', 'her', 'here', 'how', 'in', 'is', 'it',
  'me', 'my', 'of', 'on', 'or', 'our', 'she', 'that', 'the', 'their', 'them',
  'there', 'they', 'this', 'to', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'who', 'with', 'you', 'your', 'problem', 'condition', 'disease',
  'health', 'issue', 'feel', 'feeling', 'since', 'day', 'week', 'month',
  'naku', 'naaku', 'nenu', 'undi', 'undhi', 'unna', 'unnayi', 'avuthundi',
  'avuthunnayi', 'vastundi', 'vastunnayi', 'ledu', 'ravatledu', 'cheyyali',
  'meeru', 'meeku', 'mujhe', 'mujhko', 'hai', 'kya', 'karna', 'mere', 'mera',
])
const genericSymptomWords = new Set(['pain', 'ache', 'hurt', 'symptom', 'sick', 'ill', 'problem', 'disease'])

export function levenshteinDistance(first, second) {
  const left = String(first)
  const right = String(second)
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index)

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = previous[0]
    previous[0] = leftIndex
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const above = previous[rightIndex]
      const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1
      previous[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + 1,
        diagonal + substitutionCost,
      )
      diagonal = above
    }
  }

  return previous[right.length]
}

function termSimilarity(queryWord, termWord) {
  if (queryWord === termWord) return 1
  if (genericSymptomWords.has(queryWord)) return 0
  if (Math.min(queryWord.length, termWord.length) >= 3
    && Math.abs(queryWord.length - termWord.length) <= 2
    && (queryWord.includes(termWord) || termWord.includes(queryWord))) return 0.95

  const maxLength = Math.max(queryWord.length, termWord.length)
  const maxDistance = maxLength <= 6 ? 2 : 3
  if (queryWord[0] !== termWord[0]) return 0
  const distance = levenshteinDistance(queryWord, termWord)
  if (distance > maxDistance) return 0
  return 1 - (distance / (maxDistance + 1)) * 0.3
}

function scoreConditionMatch(condition, text) {
  const terms = [...condition.keywords, ...condition.synonyms]
    .map(normalizeText)
    .filter(Boolean)
  let best = null

  for (const term of terms) {
    if (` ${text} `.includes(` ${term} `)) {
      const misspelling = condition.commonMisspellings.find((word) => normalizeText(word) === term)
      const typedWord = misspelling || term
      const candidate = {
        condition,
        matchedTerm: term,
        typedWord,
        confidence: 1,
        isFuzzy: Boolean(misspelling),
      }
      if (!best || candidate.confidence > best.confidence) best = candidate
      continue
    }

    const allTermWords = term.split(' ')
    const termWords = allTermWords.filter((word) => word.length >= 3)
    const queryWords = text.split(' ')
      .filter((word) => !ignoredMatchWords.has(word) && (word.length >= 3 || word === 'bp'))

    const usedQueryWords = new Set()
    const alignedWords = []
    for (const termWord of termWords) {
      const candidates = queryWords
        .filter((queryWord) => !usedQueryWords.has(queryWord))
        .map((queryWord) => ({ queryWord, confidence: termSimilarity(queryWord, termWord) }))
        .filter(({ confidence }) => confidence > 0.7)
        .sort((first, second) => second.confidence - first.confidence)
      const aligned = candidates[0]
      if (aligned) {
        usedQueryWords.add(aligned.queryWord)
        alignedWords.push(aligned)
      }
    }

    if (allTermWords.length > 1 && alignedWords.length < 2) continue
    if (!alignedWords.length) continue
    const confidence = alignedWords.reduce((sum, aligned) => sum + aligned.confidence, 0) / alignedWords.length
    if (best && confidence <= best.confidence) continue
    const typo = alignedWords.find(({ confidence: score }) => score < 1) || alignedWords[0]
    best = {
      condition,
      matchedTerm: term,
      typedWord: typo.queryWord,
      confidence,
      isFuzzy: alignedWords.some(({ confidence: score }) => score < 1),
    }
  }

  return best
}

export function findBestMatch(userText) {
  const text = normalizeText(userText)
  if (!text) return null
  return healthKnowledge
    .map((condition) => scoreConditionMatch(condition, text))
    .filter((match) => match && match.confidence > 0.7)
    .sort((first, second) => second.confidence - first.confidence)[0] || null
}

export function matchHealthConditions(message) {
  const text = normalizeText(message)
  if (!text) return []

  const matches = healthKnowledge
    .map((condition) => scoreConditionMatch(condition, text))
    .filter((match) => match && match.confidence > 0.7)
  const distinct = new Map()

  for (const match of matches.sort((first, second) => {
    if (second.confidence !== first.confidence) return second.confidence - first.confidence
    return second.matchedTerm.length - first.matchedTerm.length
  })) {
    if (!distinct.has(match.condition.id)) distinct.set(match.condition.id, match)
  }

  return [...distinct.values()]
}

function extractDuration(message, language) {
  const text = normalizeText(message)
  const numberWords = { one: '1', two: '2', three: '3', four: '4', five: '5' }
  const match = text.match(/\b(one|two|three|four|five|\d+)\s+(days?|weeks?|months?)\b/)
  if (!match) return ''
  const value = numberWords[match[1]] || match[1]
  const unit = match[2].replace(/s$/, '')
  const rendered = language === 'te'
    ? `${value} ${unit === 'day' ? 'రోజులు' : unit === 'week' ? 'వారాలు' : 'నెలలు'}`
    : language === 'hi'
      ? `${value} ${unit === 'day' ? 'दिन' : unit === 'week' ? 'सप्ताह' : 'महीने'}`
      : language === 'hi-roman'
        ? `${value} ${unit === 'day' ? 'din' : unit === 'week' ? 'hafte' : 'mahine'}`
        : `${value} ${unit}${value === '1' ? '' : 's'}`
  return `${labels[language].duration} ${rendered}.`
}

const healthSignalPattern = /\b(pain|ache|hurt|hurting|sick|ill|unwell|symptom|swelling|bleeding|itch|itchy|fever|feverish|cough|vomit|nausea|motion|stool|rash|weak|tired|pale|burning|infection|disease|disorder|injury|wound|body|head|headache|stomach|belly|chest|breath|leg|knee|back|shoulder|eye|ear|tooth|gum|throat|skin|urine|period|pregnan|sleep|dizzy|vertigo|health|medical|pressure|sugar|cholesterol|anemia|anemic|anaemia|weight|hair|allergy|chakkar|khansi|bukhar|thyroid|ulcer|arthritis|malaria|dengue|typhoid|cancer|tumou?r|piles|hemorrhoids|flu)\b|(?:నొప్పి|జ్వరం|దగ్గు|జలుబు|వాంతి|విరేచనాలు|మలబద్ధకం|దురద|వాపు|మంట|రక్తస్రావం|మూత్రం|పీరియడ్స్|గర్భం|తలనొప్పి|అలసట|నిద్ర|థైరాయిడ్|క్యాన్సర్)|(?:दर्द|बुखार|खाँसी|सर्दी|उल्टी|दस्त|कब्ज|खुजली|सूजन|जलन|खून|पेशाब|पीरियड|गर्भ|सिरदर्द|थकान|नींद|थायरॉइड|कैंसर)/u
const medicalWordEnding = /\b[\p{L}]+(?:itis|osis|emia|algia|pathy|oma)\b/iu

const nonHealthReplies = {
  greeting: {
    en: 'Hello! I’m Healthcare AI. I can share general health information and help you find care. What would you like help with?',
    te: 'నమస్కారం! నేను Healthcare AI. సాధారణ ఆరోగ్య సమాచారం, వైద్యుడిని కనుగొనడంలో సహాయం చేస్తాను. మీకు ఏ సహాయం కావాలి?',
    tanglish: 'Hello! Nenu Healthcare AI. General health info mariyu doctor ni find cheyyadaniki help chesthanu. Meeku em help kavali?',
    hi: 'नमस्ते! मैं Healthcare AI हूँ। मैं सामान्य स्वास्थ्य जानकारी और डॉक्टर ढूँढने में मदद कर सकता हूँ। आपको किस बारे में सहायता चाहिए?',
    'hi-roman': 'Namaste! Main Healthcare AI hoon. Main general health jaankari aur doctor dhoondhne mein madad kar sakta hoon. Aapko kis baat mein madad chahiye?',
  },
  appointment: {
    en: 'To book a doctor, open Find Doctors. You can also use the Book Doctor button below.',
    te: 'డాక్టర్‌ను బుక్ చేయడానికి Find Doctors తెరవండి. కింద ఉన్న Book Doctor బటన్‌ను కూడా ఉపయోగించవచ్చు.',
    tanglish: 'Doctor book cheyyadaniki Find Doctors open cheyyandi. Kinda unna Book Doctor button kuda use cheyyachu.',
    hi: 'डॉक्टर बुक करने के लिए Find Doctors खोलें। नीचे दिया Book Doctor बटन भी इस्तेमाल कर सकते हैं।',
    'hi-roman': 'Doctor book karne ke liye Find Doctors kholein. Neeche diya Book Doctor button bhi use kar sakte hain.',
  },
  identity: {
    en: 'I’m Healthcare AI, a demo assistant for general health information. I can’t diagnose or replace a clinician.',
    te: 'నేను Healthcare AI, సాధారణ ఆరోగ్య సమాచారం కోసం రూపొందించిన డెమో సహాయకుడిని. నేను నిర్ధారణ చేయలేను లేదా వైద్యుడికి ప్రత్యామ్నాయం కాదు.',
    tanglish: 'Nenu Healthcare AI, general health info kosam demo assistant ni. Diagnosis cheyyalenu, clinician ki replacement kadu.',
    hi: 'मैं Healthcare AI हूँ, सामान्य स्वास्थ्य जानकारी के लिए एक डेमो सहायक। मैं निदान नहीं कर सकता और डॉक्टर का विकल्प नहीं हूँ।',
    'hi-roman': 'Main Healthcare AI hoon, general health jaankari ke liye demo assistant. Main diagnosis nahi kar sakta aur doctor ka replacement nahi hoon.',
  },
  unknownHealth: {
    en: 'I understand you have “{message}.” I’m not sure which condition you mean. Could you tell me more about the body part, how it feels, and when it started? Did you mean {suggestions}?',
    te: 'మీకు “{message}” సమస్య ఉందని అర్థమైంది. ఏ సమస్యో స్పష్టంగా తెలియలేదు. ఏ భాగంలో ఉంది, ఎలా అనిపిస్తోంది, ఎప్పుడు మొదలైందో చెబుతారా? మీరు {suggestions} ఉద్దేశించారా?',
    tanglish: 'Meeku “{message}” problem undani ardham ayyindi. Exact issue clear ga ledu. Ye body part lo undi, ela anipistondi, eppudu start ayyindo chepthara? Meeru {suggestions} anukunnara?',
    hi: 'मुझे समझ आया कि आपको “{message}” है। समस्या स्पष्ट नहीं है। यह शरीर के किस हिस्से में है, कैसा लगता है और कब शुरू हुआ? क्या आपका मतलब {suggestions} से है?',
    'hi-roman': 'Mujhe samajh aaya ki aapko “{message}” hai. Problem clear nahi hai. Yeh body ke kis hisse mein hai, kaisa lagta hai aur kab shuru hua? Kya aapka matlab {suggestions} se hai?',
  },
}

function chooseLanguage(language) {
  return labels[language] ? language : 'en'
}

export function getReplyActionLabel(language) {
  return labels[chooseLanguage(language)].didYouMean
}

function isGreeting(message) {
  return /^(hi|hello|hey|namaste|నమస్కారం|नमस्ते)[!. ]*$/iu.test(normalizeText(message))
}

export function isHealthRelatedMessage(message) {
  const text = String(message || '')
  return healthSignalPattern.test(text)
    || medicalWordEnding.test(text)
    || matchHealthConditions(message).length > 0
}

function getSymptomClusterNotes(matches, message, language) {
  const ids = new Set(matches.map(({ condition }) => condition.id))
  const text = normalizeText(message)
  const notes = []

  if ((ids.has('fatigue') || ids.has('weakness'))
    && ids.has('dizziness')
    && (/\b(pale|pallor)\b/u.test(text) || ids.has('anemia') || ids.has('fatigue'))) {
    notes.push({
      en: 'Tiredness with dizziness, especially with pale skin, can occur with anemia, but these symptoms have many causes. A clinician can assess you and check hemoglobin.',
      te: 'అలసట, తల తిరగడం—ముఖ్యంగా పాలిపోయిన చర్మంతో—రక్తహీనతలో రావచ్చు; అయితే ఇతర కారణాలూ ఉంటాయి. వైద్యుడు పరీక్షించి హిమోగ్లోబిన్‌ను చూడగలరు.',
      tanglish: 'Tiredness tho dizziness, mukhyanga pale skin unte, anemia lo ravachu; vere causes kuda untayi. Clinician assess chesi hemoglobin check cheyyagalru.',
      hi: 'थकान और चक्कर, खासकर पीली त्वचा के साथ, एनीमिया में हो सकते हैं; इनके अन्य कारण भी हैं। डॉक्टर जाँच कर हीमोग्लोबिन देख सकते हैं।',
      'hi-roman': 'Thakaan aur chakkar, khaaskar peeli skin ke saath, anemia mein ho sakte hain; inke doosre causes bhi hain. Doctor jaanch karke hemoglobin dekh sakte hain.',
    }[language])
  }

  if (ids.has('fever') && ids.has('cough') && ids.has('common-cold')) {
    notes.push({
      en: 'Fever with cough and cold symptoms can occur with a viral illness, but the cause cannot be confirmed here.',
      te: 'జ్వరం, దగ్గు, జలుబు లక్షణాలు వైరల్ అనారోగ్యంలో రావచ్చు; ఇక్కడ కారణాన్ని నిర్ధారించలేం.',
      tanglish: 'Fever, cough, cold symptoms viral illness lo ravachu; ikkada cause confirm cheyyalem.',
      hi: 'बुखार, खाँसी और सर्दी के लक्षण वायरल बीमारी में हो सकते हैं, लेकिन यहाँ कारण की पुष्टि नहीं की जा सकती।',
      'hi-roman': 'Bukhar, khansi aur sardi ke symptoms viral illness mein ho sakte hain, par yahan cause confirm nahi ho sakta.',
    }[language])
  }

  if (ids.has('acidity') && ids.has('stomach-pain')) {
    notes.push({
      en: 'Acidity, gas, and stomach pain can occur with gastritis or other digestive issues; a clinician can assess persistent symptoms.',
      te: 'అసిడిటీ, గ్యాస్, కడుపు నొప్పి గ్యాస్ట్రైటిస్ లేదా ఇతర జీర్ణ సమస్యల్లో రావచ్చు; లక్షణాలు కొనసాగితే వైద్యుడిని కలవండి.',
      tanglish: 'Acidity, gas, stomach pain gastritis leda vere digestive issues lo ravachu; symptoms continue ayithe clinician ni kalavandi.',
      hi: 'एसिडिटी, गैस और पेट दर्द गैस्ट्राइटिस या अन्य पाचन समस्याओं में हो सकते हैं; लक्षण बने रहें तो डॉक्टर से मिलें।',
      'hi-roman': 'Acidity, gas aur pet dard gastritis ya doosri digestive problems mein ho sakte hain; symptoms bane rahein to doctor se milein.',
    }[language])
  }

  return notes
}

export function getHealthKnowledgeReply(message, language = 'en') {
  const lang = chooseLanguage(language)
  const matches = matchHealthConditions(message)
  const duration = extractDuration(message, lang)

  if (matches.length) {
    const urgentMatches = matches.filter(({ condition }) => condition.urgency === 'urgent')
    const selected = urgentMatches.length ? urgentMatches : matches
    const replies = selected.map(({ condition, isFuzzy, typedWord }) => {
      const reply = condition.replies[lang] || condition.replies.en
      if (!isFuzzy) return reply
      const conditionName = condition.name[lang].replace(/^./u, (character) => character.toLocaleUpperCase())
      return `${labels[lang].correction.replace('{condition}', conditionName).replace('{typed}', typedWord)}\n\n${reply}`
    })
    replies.push(...getSymptomClusterNotes(matches, message, lang))
    if (duration) replies.push(duration)
    if (matches.length > 1 && !urgentMatches.length) replies.push(labels[lang].multiple)
    return appendAIDisclaimer(replies.join('\n\n'), lang)
  }

  if (isGreeting(message)) {
    return appendAIDisclaimer(nonHealthReplies.greeting[lang], lang)
  }

  const text = normalizeText(message)
  if (/\b(who are you|your name|what are you|మీరు ఎవరు|तुम कौन हो)\b/u.test(text)) {
    return appendAIDisclaimer(nonHealthReplies.identity[lang], lang)
  }

  if (/\b(book|appointment|doctor|అపాయింట్మెంట్|डॉक्टर)\b/u.test(text)) {
    return appendAIDisclaimer(nonHealthReplies.appointment[lang], lang)
  }

  if (isHealthRelatedMessage(message)) {
    const escapedMessage = String(message || '')
      .trim()
      .replace(/^\s*(?:i have|i am having|i'm having|my|naku|naaku|mujhe|mere ko|నాకు|मुझे)\s*/iu, '')
      .replace(/[<>]/g, '')
      .slice(0, 180)
    const suggestions = getDidYouMeanSuggestions(message)
      .map((id) => healthKnowledge.find((condition) => condition.id === id)?.name[lang])
      .filter(Boolean)
      .join(lang === 'te' ? ', ' : ', ')
    const unknownReply = nonHealthReplies.unknownHealth[lang]
      .replace('{message}', escapedMessage || (lang === 'en' ? 'these symptoms' : 'ఈ లక్షణాలు'))
      .replace('{suggestions}', suggestions)
    return appendAIDisclaimer(unknownReply, lang)
  }

  return appendAIDisclaimer(nonHealthReplies.greeting[lang], lang)
}

export function getDidYouMeanSuggestions(message) {
  const matches = matchHealthConditions(message)
  if (matches.length) return matches.slice(0, 3).map(({ condition }) => condition.id)

  const text = normalizeText(message)
  const relatedSuggestions = [
    { pattern: /\b(thyroid|hormone|gland)\b|థైరాయిడ్|थायरॉइड/u, ids: ['fatigue', 'weight-loss', 'weight-gain'] },
    { pattern: /\b(tonsil|tonsillitis|neck)\b|టాన్సిల్|गला/u, ids: ['throat-pain', 'fever', 'cough'] },
    { pattern: /\b(kidney|bladder)\b|కిడ్నీ|गुर्दा/u, ids: ['urine-burning', 'frequent-urination', 'back-pain'] },
    { pattern: /\b(dengue|malaria|typhoid|flu)\b|డెంగ్యూ|मलेरिया/u, ids: ['fever', 'headache', 'body-pain'] },
    { pattern: /\b(arm|hand|wrist|elbow)\b/u, ids: ['joint-pain', 'body-pain', 'shoulder-pain'] },
  ]
  const related = relatedSuggestions.find(({ pattern }) => pattern.test(text))?.ids || []
  const defaults = ['fever', 'stomach-pain', 'loose-motions']
  const availableIds = new Set(healthKnowledge.map((condition) => condition.id))
  return [...new Set([...related, ...defaults])].filter((id) => availableIds.has(id)).slice(0, 3)
}
