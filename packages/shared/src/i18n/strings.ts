import type { Lang } from "./tr";

export interface TermsSection {
  title: string;
  body: string;
}

export interface Strings {
  navHome: string;
  navLines: string;
  navStops: string;
  navMap: string;
  navSchedule: string;
  favorites: string;
  searchPlaceholder: string;
  nearbyStops: string;
  popularLines: string;
  viewAll: string;
  allLines: string;
  activeNow: string;
  weekday: string;
  weekend: string;
  sunday: string;
  firstBus: string;
  lastBus: string;
  frequency: string;
  line: string;
  upcoming: string;
  walk: string;
  direction: string;
  fullSchedule: string;
  findRoute: string;
  from: string;
  to: string;
  departure: string;
  myStops: string;
  myLines: string;
  noResults: string;
  lastBusToday: string;
  onTime: string;
  arriving: string;
  delayed: string;
  disrupted: string;
  locationDenied: string;
  enableLocation: string;
  noBuses: string;
  disruptions: string;
  morning: string;
  afternoon: string;
  evening: string;
  nextFromFav: string;
  back: string;
  viewStop: string;
  noRoute: string;
  viewOnMap: string;
  allStopsOnLine: string;
  routeMap: string;
  status: string;
  noFavorites: string;
  start: string;
  end: string;
  denar: string;
  language: string;
  stopsAllStations: string;
  skipsSomeStations: string;
  doesNotStopAt: string;
  notAllStops: string;
  comingSoonTitle: string;
  comingSoonBody: string;
  termsMenu: string;
  termsTitle: string;
  installMenu: string;
  installTitle: string;
  installIntro: string;
  installAndroidTitle: string;
  installIosTitle: string;
  termsGateBody: string;
  acceptTermsBtn: string;
  readFullTerms: string;
  neighborhood: string;
  updateAvailable: string;
  refresh: string;
  dismiss: string;
  termsSections: TermsSection[];
}

export const STR: Record<Lang, Strings> = {
  mk: {
    navHome: "Дома", navLines: "Линии", navStops: "Постојки", navMap: "Мапа", navSchedule: "Возен ред", favorites: "Омилени",
    searchPlaceholder: "Каде сакаш да одиш?", nearbyStops: "Блиски постојки", popularLines: "Популарни линии", viewAll: "Погледни ги сите поаѓања",
    allLines: "Сите", activeNow: "Активни сега", weekday: "Работен ден", weekend: "Сабота", sunday: "Недела/празник",
    firstBus: "Прв автобус", lastBus: "Последен автобус", frequency: "Фреквенција", line: "Линија", upcoming: "Следни автобуси",
    walk: "Пешачење", direction: "Насока", fullSchedule: "Целосен возен ред", findRoute: "Најди рута", from: "Од", to: "До",
    departure: "Време на поаѓање", myStops: "Мои постојки", myLines: "Омилени линии", noResults: "Нема резултати",
    lastBusToday: "Последен автобус за денес", onTime: "На време", arriving: "Пристигнува", delayed: "Задржан", disrupted: "Прекин во услугата на линијата",
    locationDenied: "Локацијата е оневозможена — приказ по азбучен ред", enableLocation: "Овозможи локација", noBuses: "Нема автобуси во моментов",
    disruptions: "Прекини", morning: "Добро утро", afternoon: "Добар ден", evening: "Добра вечер", nextFromFav: "Следен од омилена",
    back: "Назад", viewStop: "Погледни постојка", noRoute: "Не е пронајдена директна рута за оваа комбинација", viewOnMap: "Погледни на мапа",
    allStopsOnLine: "Постојки на линијата", routeMap: "Мапа на рутата", status: "Статус", noFavorites: "Немате зачувани омилени сè уште",
    start: "Почетна", end: "Крајна", denar: "ден", language: "Јазик",
    stopsAllStations: "Овој автобус застанува на сите постојки", skipsSomeStations: "Овој автобус не застанува на сите постојки", doesNotStopAt: "Не застанува на:", notAllStops: "Не на сите постојки",
    comingSoonTitle: "Наскоро", comingSoonBody: "Мапата е во подготовка. Наскоро ќе можете да ги гледате линиите и постојките во живо.",
    termsMenu: "Услови и употреба", termsTitle: "Услови и политика на употреба",
    installMenu: "Инсталирајте апликација", installTitle: "Инсталирајте го на вашиот телефон",
    installIntro: "Додадете го Куманово Транзит на почетниот екран за брз пристап, без да морате да одите во продавница на апликации. (Скоро ќе понудиме и посебна апликација.)",
    installAndroidTitle: "Android", installIosTitle: "iPhone (iOS)",
    termsGateBody: "За да ги користите возните редови и информациите во апликацијата, ве молиме да ги прифатите условите и политиката на употреба.", acceptTermsBtn: "Прифатам", readFullTerms: "Ги читам условите",
    neighborhood: "Населба",
    updateAvailable: "Достапна е нова верзија",
    refresh: "Освежи",
    dismiss: "Затвори",
    termsSections: [
      { title: "Користење на апликацијата", body: "Куманово Транзит ви дава информации за линии, постојки и поаѓања на јавниот превоз во Куманово. Апликацијата е наменета за лична, некомерцијална употреба." },
      { title: "Точност на информациите", body: "Возните редови, цените и мапите на рутите се објавени од превозниците и може да се менуваат без најава. Се трудиме информациите да бидат ажурни, но не можеме да гарантираме точност." },
      { title: "Цени", body: "Прикажаните цени на билети се информативни. Секогаш проверете ја цената кај возачот или превозникот пред качување." },
      { title: "Дозволена употреба", body: "Не користете ја апликацијата за нарушување на нејзиното функционирање, преземање на податоци за препродажба или погрешно претставување на официјални информации за превоз." },
      { title: "Промени на политиката", body: "Можеме да ја ажурираме оваа политика како апликацијата се развива. Продолженото користење по промените значи дека ги прифаќате ажурираните услови." },
    ],
  },
  en: {
    navHome: "Home", navLines: "Lines", navStops: "Stops", navMap: "Map", navSchedule: "Schedule", favorites: "Favorites",
    searchPlaceholder: "Where do you want to go?", nearbyStops: "Nearby Stops", popularLines: "Popular Lines", viewAll: "View all departures",
    allLines: "All", activeNow: "Active Now", weekday: "Weekday", weekend: "Saturday", sunday: "Sunday / Holiday",
    firstBus: "First bus", lastBus: "Last bus", frequency: "Frequency", line: "Line", upcoming: "Upcoming departures",
    walk: "Walk", direction: "Direction", fullSchedule: "Full schedule", findRoute: "Find Route", from: "From", to: "To",
    departure: "Departure time", myStops: "My Stops", myLines: "Favorite Lines", noResults: "No results",
    lastBusToday: "Last bus today", onTime: "On time", arriving: "Arriving", delayed: "Delayed", disrupted: "Service disruption on this line",
    locationDenied: "Location disabled — showing alphabetical list", enableLocation: "Enable location", noBuses: "No buses available right now",
    disruptions: "Disruptions", morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening", nextFromFav: "Next from favorite",
    back: "Back", viewStop: "View Stop", noRoute: "No direct route found for this combination", viewOnMap: "View on Map",
    allStopsOnLine: "Stops on this line", routeMap: "Route map", status: "Status", noFavorites: "You haven't saved any favorites yet",
    start: "Start", end: "End", denar: "MKD", language: "Language",
    stopsAllStations: "This bus stops at every station", skipsSomeStations: "This bus does not stop at every station", doesNotStopAt: "Does not stop at:", notAllStops: "Not all stops",
    comingSoonTitle: "Coming soon", comingSoonBody: "The live map is on its way. You'll soon be able to see lines and stops in real time.",
    termsMenu: "Terms & Usage", termsTitle: "Terms & Usage Policy",
    installMenu: "Install the app", installTitle: "Install on your phone",
    installIntro: "Add Kumanovo Transit to your home screen for fast access, no app store needed. (A dedicated app is coming later.)",
    installAndroidTitle: "Android", installIosTitle: "iPhone (iOS)",
    termsGateBody: "To use the live schedules and information in this app, please accept our terms and usage policy.", acceptTermsBtn: "Accept", readFullTerms: "Read the full terms",
    neighborhood: "Neighborhood",
    updateAvailable: "A new version is available",
    refresh: "Refresh",
    dismiss: "Dismiss",
    termsSections: [
      { title: "Use of the App", body: "Kumanovo Transit gives you route, stop and departure information for public bus lines in Kumanovo. It is provided for personal, non-commercial use." },
      { title: "Accuracy of Information", body: "Schedules, prices and route maps are published by transport operators and may change without notice. We do our best to keep them current but cannot guarantee accuracy." },
      { title: "Fares", body: "Displayed ticket prices are indicative. Always confirm the fare with the driver or operator before boarding." },
      { title: "Acceptable Use", body: "Do not use the app to disrupt its operation, scrape data for resale, or misrepresent official transit information." },
      { title: "Changes to this Policy", body: "We may update this policy as the app evolves. Continued use after changes means you accept the updated terms." },
    ],
  },
  sq: {
    navHome: "Shtëpia", navLines: "Linjat", navStops: "Stacionet", navMap: "Harta", navSchedule: "Orari", favorites: "Të preferuarat",
    searchPlaceholder: "Ku dëshironi të shkoni?", nearbyStops: "Stacionet e afërta", popularLines: "Linjat popullore", viewAll: "Shiko të gjitha nisjet",
    allLines: "Të gjitha", activeNow: "Aktive tani", weekday: "Ditë pune", weekend: "E shtunë", sunday: "E diel/Festë",
    firstBus: "Autobusi i parë", lastBus: "Autobusi i fundit", frequency: "Frekuenca", line: "Linja", upcoming: "Autobusët e ardhshëm",
    walk: "Ecje", direction: "Drejtimi", fullSchedule: "Orari i plotë", findRoute: "Gjej rrugën", from: "Nga", to: "Për",
    departure: "Koha e nisjes", myStops: "Stacionet e mia", myLines: "Linjat e preferuara", noResults: "Nuk ka rezultate",
    lastBusToday: "Autobusi i fundit për sot", onTime: "Në kohë", arriving: "Po afrohet", delayed: "Vonuar", disrupted: "Ndërprerje e shërbimit në këtë linjë",
    locationDenied: "Vendndodhja e çaktivizuar — shfaqet lista alfabetike", enableLocation: "Aktivizo vendndodhjen", noBuses: "Nuk ka autobusë në këtë moment",
    disruptions: "Ndërprerje", morning: "Mirëmëngjes", afternoon: "Mirëdita", evening: "Mirëmbrëma", nextFromFav: "Radha nga e preferuara",
    back: "Prapa", viewStop: "Shiko stacionin", noRoute: "Nuk u gjet rrugë e drejtpërdrejtë për këtë kombinim", viewOnMap: "Shiko në hartë",
    allStopsOnLine: "Stacionet e linjës", routeMap: "Harta e itinerarit", status: "Statusi", noFavorites: "Nuk keni ende asnjë të preferuar të ruajtur",
    start: "Fillimi", end: "Fundi", denar: "den", language: "Gjuha",
    stopsAllStations: "Ky autobus ndalon në të gjitha stacionet", skipsSomeStations: "Ky autobus nuk ndalon në të gjitha stacionet", doesNotStopAt: "Nuk ndalon në:", notAllStops: "Jo në të gjitha stacionet",
    comingSoonTitle: "Së shpejti", comingSoonBody: "Harta live është duke u përgatitur. Së shpejti do të mund t'i shihni linjat dhe stacionet në kohë reale.",
    termsMenu: "Kushtet e Përdorimit", termsTitle: "Kushtet dhe Politika e Përdorimit",
    installMenu: "Instaloni aplikacionin", installTitle: "Instaloni në telefonin tuaj",
    installIntro: "Shtoni Kumanovo Transit në ekranin kryesor për qasje të shpejtë, pa nevojë për dyqan aplikacionesh. (Së shpejti do të ketë dhe aplikacion të dedikuar.)",
    installAndroidTitle: "Android", installIosTitle: "iPhone (iOS)",
    termsGateBody: "Për të përdorur oraret dhe informacionet live në këtë aplikacion, ju lutemi pranoni kushtet dhe politikën e përdorimit.", acceptTermsBtn: "Prano", readFullTerms: "Lexoni kushtet e plota",
    neighborhood: "Lagje",
    updateAvailable: "Është në dispozicion një version i ri",
    refresh: "Rifresko",
    dismiss: "Mbyll",
    termsSections: [
      { title: "Përdorimi i aplikacionit", body: "Kumanovo Transit ju jep informacione për linjat, stacionet dhe nisjet e transportit publik në Kumanovë. Aplikacioni është për përdorim personal, jo-komercial." },
      { title: "Saktësia e informacionit", body: "Oraret, çmimet dhe hartat e itinerareve publikohen nga operatorët e transportit dhe mund të ndryshojnë pa njoftim. Bëjmë çmos t'i mbajmë të përditësuara, por nuk mund të garantojmë saktësinë." },
      { title: "Çmimet e biletave", body: "Çmimet e shfaqura janë indikative. Konfirmoni gjithmonë çmimin me shoferin ose operatorin para se të hipni." },
      { title: "Përdorimi i lejuar", body: "Mos e përdorni aplikacionin për të prishur funksionimin e tij, për të mbledhur të dhëna për rishitje, ose për të keqinterpretuar informacionin zyrtar të transportit." },
      { title: "Ndryshimet e politikës", body: "Ne mund ta përditësojmë këtë politikë ndërsa aplikacioni evoluon. Vazhdimi i përdorimit pas ndryshimeve nënkupton pranimin e kushteve të përditësuara." },
    ],
  },
};

export const getStrings = (lang: Lang): Strings => STR[lang] ?? STR.mk;
