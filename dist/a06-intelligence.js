(() => {
  "use strict";

  const VERSION = "1.1.9";

  const LANGS = [
    "it",
    "fr",
    "en",
    "es"
  ];

  const LOCALES = {
    it: "it-IT",
    fr: "fr-FR",
    en: "en-GB",
    es: "es-ES"
  };

  let bridge = null;
  let currentLanguage = "it";
  let activeRequestLanguage = null;
  let askButton = null;
  let speechRunId = 0;

  const CONVERSATION_MAX_TURNS = 4;
  const CLARIFICATION_MAX_AGE = 3;

  const sessionState = {
    turn: 0,
    language: null,
    lastPlaceIds: [],
    lastTerritoryId: null,
    lastIntents: [],
    lastRoute: null,
    pendingClarification: null,
    turns: [],
    focus: {
      territoryId: null,
      poiIds: [],
      section: null
    },
    lastResult: {
      type: null,
      poiIds: [],
      territoryId: null,
      intent: null
    }
  };


  /* =========================================
     TEXTES
     ========================================= */

  const I18N = {

    it: {

      ask: "Chiedi ad Aracne",

      thinking:
        "Aracne sta tessendo…",

      title:
        "Aracne",

      empty:
        "Scrivi o detta prima una domanda.",

      scope:
        "Aracne conosce i luoghi, i percorsi e le principali funzioni dell’app. Può raccontarti un luogo, creare o modificare itinerari, aprire mappa, missioni, passaporto e diario, mostrare Filo Verde e punti, preparare QR e condivisioni. Non è ancora un assistente generalista su Internet.",

      unknown:
        "Posso aiutarti soprattutto con i luoghi presenti nell’app, ciò che c’è vicino, i percorsi e le funzioni di HIRUNDU. Prova per esempio: «Cosa c’è vicino a Otranto?», «Raccontami Porto Badisco» o «Creami un percorso natura di 3 ore».",

      noPlace:
        "Non ho identificato un luogo preciso nella domanda.",

      nearMe:
        "Cerco i luoghi più vicini a te.",

      noCoords:
        "Non ho coordinate sufficienti per calcolare cosa c’è intorno a questo luogo.",

      add: name =>
        `Preparo ${name} per il tuo percorso.`,

      open: name =>
        `Ti mostro ${name}.`,

      routeFail:
        "Mi servono un po’ più di indicazioni: prova a citare un luogo, un tema, il tempo disponibile o il mezzo.",

      nearbyIntro: name =>
        `Vicino a ${name} puoi trovare:`,

      multiIntro:
        "Hai citato più luoghi. Ecco cosa so:",

      businessesIntro:
        "Attività locali vicine:",

      category: {
        sea: "mare",
        nature: "natura",
        culture: "cultura",
        food: "sapori"
      },

      mins: m =>
        `${m} min circa`
    },


    fr: {

      ask:
        "Demander à Aracne",

      thinking:
        "Aracne tisse sa réponse…",

      title:
        "Aracne",

      empty:
        "Écris ou dicte d’abord une question.",

      scope:
        "Aracne connaît les lieux, les parcours et les principales fonctions de l’app. Elle peut raconter un lieu, créer ou modifier un itinéraire, ouvrir la carte, les missions, le passeport et le journal, montrer le Filo Verde et les points, préparer le QR et le partage. Ce n’est pas encore un assistant généraliste connecté à Internet.",

      unknown:
        "Je peux surtout t’aider avec les lieux présents dans l’app, ce qu’il y a autour, les parcours et les fonctions de HIRUNDU. Essaie par exemple : « Qu’est-ce qu’il y a autour d’Otranto ? », « Raconte-moi Porto Badisco » ou « Crée-moi un parcours nature de 3 heures ».",

      noPlace:
        "Je n’ai pas identifié de lieu précis dans la question.",

      nearMe:
        "Je cherche les lieux les plus proches de toi.",

      noCoords:
        "Je n’ai pas assez de coordonnées pour calculer ce qu’il y a autour de ce lieu.",

      add: name =>
        `Je prépare ${name} pour ton parcours.`,

      open: name =>
        `Je t’ouvre ${name}.`,

      routeFail:
        "Il me faut un peu plus d’indications : cite un lieu, un thème, le temps disponible ou le moyen de transport.",

      nearbyIntro: name =>
        `Autour de ${name}, tu peux trouver :`,

      multiIntro:
        "Tu as cité plusieurs lieux. Voici ce que je sais :",

      businessesIntro:
        "Commerces et activités locales à proximité :",

      category: {
        sea: "mer",
        nature: "nature",
        culture: "culture",
        food: "saveurs"
      },

      mins: m =>
        `${m} min environ`
    },


    en: {

      ask:
        "Ask Aracne",

      thinking:
        "Aracne is weaving…",

      title:
        "Aracne",

      empty:
        "Type or dictate a question first.",

      scope:
        "Aracne knows the places, routes and main app functions. It can describe places, create or modify routes, open the map, missions, passport and journal, show Filo Verde and points, and prepare QR or sharing actions. It is not yet a general Internet assistant.",

      unknown:
        "I can mainly help with places already in the app, nearby discoveries, routes and HIRUNDU features. Try: “What is near Otranto?”, “Tell me about Porto Badisco”, or “Create a 3-hour nature route”.",

      noPlace:
        "I could not identify a specific place in the question.",

      nearMe:
        "I am looking for the nearest places around you.",

      noCoords:
        "I do not have enough coordinates to calculate what is around this place.",

      add: name =>
        `I am preparing ${name} for your route.`,

      open: name =>
        `I am opening ${name}.`,

      routeFail:
        "I need a little more information: name a place, a theme, the available time or your transport mode.",

      nearbyIntro: name =>
        `Near ${name}, you can find:`,

      multiIntro:
        "You mentioned several places. Here is what I know:",

      businessesIntro:
        "Nearby local businesses and activities:",

      category: {
        sea: "sea",
        nature: "nature",
        culture: "culture",
        food: "food"
      },

      mins: m =>
        `about ${m} min`
    },


    es: {

      ask:
        "Preguntar a Aracne",

      thinking:
        "Aracne está tejiendo…",

      title:
        "Aracne",

      empty:
        "Escribe o dicta primero una pregunta.",

      scope:
        "Aracne conoce los lugares, las rutas y las principales funciones de la app. Puede describir lugares, crear o modificar rutas, abrir el mapa, las misiones, el pasaporte y el diario, mostrar Filo Verde y puntos, y preparar QR o acciones para compartir. Todavía no es un asistente generalista conectado a Internet.",

      unknown:
        "Puedo ayudarte sobre todo con los lugares presentes en la app, lo que hay cerca, las rutas y las funciones de HIRUNDU. Prueba: «¿Qué hay cerca de Otranto?», «Cuéntame Porto Badisco» o «Crea una ruta de naturaleza de 3 horas».",

      noPlace:
        "No he identificado un lugar concreto en la pregunta.",

      nearMe:
        "Busco los lugares más cercanos a ti.",

      noCoords:
        "No tengo suficientes coordenadas para calcular qué hay alrededor de este lugar.",

      add: name =>
        `Preparo ${name} para tu ruta.`,

      open: name =>
        `Te muestro ${name}.`,

      routeFail:
        "Necesito un poco más de información: indica un lugar, un tema, el tiempo disponible o el medio de transporte.",

      nearbyIntro: name =>
        `Cerca de ${name} puedes encontrar:`,

      multiIntro:
        "Has mencionado varios lugares. Esto es lo que sé:",

      businessesIntro:
        "Comercios y actividades locales cercanas:",

      category: {
        sea: "mar",
        nature: "naturaleza",
        culture: "cultura",
        food: "sabores"
      },

      mins: m =>
        `${m} min aprox.`
    }
  };


  /* =========================================
     CONNAISSANCE SUR HIRUNDU LUI-MÊME
     ========================================= */

  const APP_KNOWLEDGE = [

    {
      keys: [
        "filo verde",
        "green thread",
        "hilo verde"
      ],

      text: {

        it:
          "Il Filo Verde è l’indicatore di viaggio responsabile dell’app: cresce con scelte e missioni più sostenibili.",

        fr:
          "Le Filo Verde est l’indicateur de voyage responsable de l’app : il progresse avec les choix et missions plus durables.",

        en:
          "Filo Verde is the app’s responsible-travel indicator. It grows with more sustainable choices and missions.",

        es:
          "Filo Verde es el indicador de viaje responsable de la app. Progresa con decisiones y misiones más sostenibles."
      }
    },


    {
      keys: [
        "aracne points",
        "points aracne",
        "punti aracne"
      ],

      text: {

        it:
          "Gli Aracne Points vengono guadagnati completando missioni e azioni validate nell’app.",

        fr:
          "Les Aracne Points se gagnent en réalisant des missions et actions validées dans l’app.",

        en:
          "Aracne Points are earned by completing validated missions and actions in the app.",

        es:
          "Los Aracne Points se obtienen completando misiones y acciones validadas en la app."
      }
    },


    {
      keys: [
        "diario",
        "journal",
        "diary"
      ],

      text: {

        it:
          "Il Diario di Aracne salva le tue note localmente sul dispositivo. Non è sincronizzato nel cloud.",

        fr:
          "Le Journal d’Aracne enregistre tes notes localement sur l’appareil. Il n’est pas synchronisé dans le cloud.",

        en:
          "The Aracne Journal stores your notes locally on the device. It is not synced to the cloud.",

        es:
          "El Diario de Aracne guarda tus notas localmente en el dispositivo. No se sincroniza en la nube."
      }
    }
  ];


  /* =========================================
     LANGUE
     ========================================= */

  function normalizeLanguageCode(value) {
    const code=String(value||"").toLowerCase().slice(0,2);
    return LANGS.includes(code) ? code : null;
  }

  function lang() {
    return (
      normalizeLanguageCode(activeRequestLanguage)
      ||
      normalizeLanguageCode(bridge?.getVoiceLanguage?.())
      ||
      normalizeLanguageCode(bridge?.getLanguage?.())
      ||
      normalizeLanguageCode(currentLanguage)
      ||
      "it"
    );
  }


  function tr(key, ...args) {

    const value =
      (I18N[lang()] || I18N.it)[key];

    return typeof value === "function"
      ? value(...args)
      : value;
  }


  /* =========================================
     NORMALISATION
     ========================================= */

  function normalize(value = "") {

    return String(value)

      .toLowerCase()

      .normalize("NFD")

      .replace(
        /[\u0300-\u036f]/g,
        ""
      )

      .replace(
        /[’']/g,
        " "
      )

      .replace(
        /[-–—]/g,
        " "
      )

      .replace(
        /[^a-z0-9\s]/g,
        " "
      )

      .replace(
        /\s+/g,
        " "
      )

      .trim();
  }


  function getTranscript() {

    return (

      bridge
        ?.getTranscript
        ?.()

      ||

      document
        .querySelector(
          "#assistantTranscript"
        )
        ?.value

      ||

      ""

    ).trim();
  }


  /* =========================================
     RECHERCHE POI
     ========================================= */

  function getPlaces(text) {

    try {

      const result =
        bridge
          ?.findPlaces
          ?.(text);

      if (
        Array.isArray(result)
        &&
        result.length
      ) {

        return result.filter(Boolean);
      }

    } catch (error) {

      console.warn(
        "[Aracne] findPlaces",
        error
      );
    }


    const n =
      normalize(text);


    return (
      bridge?.getPlaces?.()
      ||
      []
    ).filter(place => {

      const id =
        normalize(
          place?.id || ""
        );


      const name =
        normalize(
          place?.name || ""
        );


      return (

        (
          id
          &&
          n.includes(id)
        )

        ||

        (
          name.length > 3
          &&
          n.includes(name)
        )
      );
    });
  }


  function placeName(place) {

    return (
      place?.name
      ||
      place?.id
      ||
      ""
    );
  }


  function placeSummary(place) {

    return (

      place
        ?.text
        ?.[lang()]

      ||

      place
        ?.text
        ?.it

      ||

      ""
    );
  }


  function hasCoords(place) {

    return (

      Number.isFinite(
        Number(place?.lat)
      )

      &&

      Number.isFinite(
        Number(place?.lng)
      )
    );
  }


  /* =========================================
     DISTANCE
     ========================================= */

  function distanceKm(a, b) {

    const R =
      6371;


    const rad =
      value =>
        value * Math.PI / 180;


    const dLat =
      rad(
        Number(b.lat)
        -
        Number(a.lat)
      );


    const dLng =
      rad(
        Number(b.lng)
        -
        Number(a.lng)
      );


    const lat1 =
      rad(
        Number(a.lat)
      );


    const lat2 =
      rad(
        Number(b.lat)
      );


    const h =

      Math.sin(
        dLat / 2
      ) ** 2

      +

      Math.cos(lat1)

      *

      Math.cos(lat2)

      *

      Math.sin(
        dLng / 2
      ) ** 2;


    return (

      2

      *

      R

      *

      Math.asin(
        Math.sqrt(h)
      )
    );
  }


  /* =========================================
     CONNAISSANCE APP
     ========================================= */

  function appKnowledge(text) {

    const n =
      normalize(text);


    for (
      const item
      of APP_KNOWLEDGE
    ) {

      const found =
        item.keys.some(
          key =>
            n.includes(
              normalize(key)
            )
        );


      if (found) {

        return (
          item.text[lang()]
          ||
          item.text.it
        );
      }
    }


    return null;
  }


  /* =========================================
     COMPREHENSION v0.4
     Multi-intent, multilingual, deterministic.
     No external AI / no network.
     ========================================= */

  const CONTEXT_I18N = {
    it:{
      clarifyPlace:"Di quale luogo stai parlando?",
      clarifyOrigin:names=>"Vuoi partire da "+names.join(" o ")+" oppure vuoi semplicemente includerli nel percorso?",
      noContext:"Non ho ancora un luogo o un percorso di riferimento. Dimmi prima da dove vuoi partire."
    },
    fr:{
      clarifyPlace:"De quel lieu parles-tu ?",
      clarifyOrigin:names=>"Tu veux partir de "+names.join(" ou ")+" ou simplement les inclure dans le parcours ?",
      noContext:"Je n’ai pas encore de lieu ou de parcours de référence. Indique-moi d’abord d’où tu veux partir."
    },
    en:{
      clarifyPlace:"Which place are you referring to?",
      clarifyOrigin:names=>"Do you want to start from "+names.join(" or ")+" or simply include them in the route?",
      noContext:"I do not have a place or route in context yet. Tell me where you want to start."
    },
    es:{
      clarifyPlace:"¿De qué lugar hablas?",
      clarifyOrigin:names=>"¿Quieres salir de "+names.join(" o ")+" o simplemente incluirlos en la ruta?",
      noContext:"Todavía no tengo un lugar o una ruta de referencia. Dime primero desde dónde quieres salir."
    }
  };

  const CONTEXT_RULES = {
    it:{
      nearby:["e intorno","intorno","e vicino","nei dintorni","cosa c e intorno"],
      routeFollowup:["fallo","rifallo","rifai","modificalo","cambialo","lo stesso percorso"],
      shorter:["piu corto","accorcialo","meno tempo"],
      longer:["piu lungo","allungalo","piu tempo"],
      nature:["piu natura","piu naturale"],
      sea:["piu mare","piu spiagge"],
      culture:["piu cultura","piu storia"],
      food:["piu sapori","piu gastronomia","piu cibo"],
      origin:["partendo da","a partire da","con partenza da","da"],
      include:["con","includendo","passando per","attraverso"],
      contextPlace:["li","quel posto","questa zona","quel luogo"],
      both:["entrambi","tutti e due","tutte e due"],
      between:["tra","fra"],
      clauseBreaks:["e poi","poi","dopo","e puoi","e potresti"]
    },
    fr:{
      nearby:["et autour","autour","et a proximite","a proximite","dans les environs","et pres de la"],
      routeFollowup:["fais le","refais le","refais","modifie le","change le","le meme parcours","ce parcours"],
      shorter:["plus court","raccourcis le","moins long","moins de temps"],
      longer:["plus long","allonge le","plus de temps"],
      nature:["plus nature","plus naturel","davantage de nature"],
      sea:["plus mer","plus de mer","plus de plages"],
      culture:["plus culture","plus culturel","plus d histoire"],
      food:["plus gastronomie","plus de saveurs","plus cuisine"],
      origin:["en partant de","au depart de","a partir de","depuis"],
      include:["avec","en incluant","en passant par","via"],
      contextPlace:["la bas","ce lieu","cet endroit","sur place"],
      both:["les deux","tous les deux","toutes les deux"],
      between:["entre"],
      clauseBreaks:["et apres","puis","ensuite","et est ce que","et peux tu","et tu peux","apres ca"]
    },
    en:{
      nearby:["and around","around there","nearby","near there","what is around"],
      routeFollowup:["do it","redo it","redo","change it","modify it","same route","this route"],
      shorter:["shorter","make it shorter","less time"],
      longer:["longer","make it longer","more time"],
      nature:["more nature","more natural","more outdoors"],
      sea:["more sea","more beach","more beaches"],
      culture:["more culture","more history","more cultural"],
      food:["more food","more gastronomy","more local food"],
      origin:["starting from","start from","departing from","from"],
      include:["with","including","via","passing through"],
      contextPlace:["there","that place","this place","on site"],
      both:["both","both of them"],
      between:["between"],
      clauseBreaks:["and then","then","after that","and can you","can you also"]
    },
    es:{
      nearby:["y alrededor","alrededor","cerca de alli","en los alrededores","y cerca"],
      routeFollowup:["hazlo","rehazlo","cambialo","modificalo","la misma ruta","esta ruta"],
      shorter:["mas corto","acortalo","menos tiempo"],
      longer:["mas largo","alargalo","mas tiempo"],
      nature:["mas naturaleza","mas natural"],
      sea:["mas mar","mas playa","mas playas"],
      culture:["mas cultura","mas historia","mas cultural"],
      food:["mas gastronomia","mas sabores","mas comida"],
      origin:["saliendo de","partiendo de","a partir de","desde"],
      include:["con","incluyendo","pasando por","via"],
      contextPlace:["alli","ese lugar","este lugar","ahi"],
      both:["los dos","las dos","ambos","ambas"],
      between:["entre"],
      clauseBreaks:["y luego","luego","despues","despues de eso","y puedes"]
    }
  };

  function contextText(language,key,...args) {
    const pack=CONTEXT_I18N[language]||CONTEXT_I18N.it;
    const value=pack[key];
    return typeof value==="function" ? value(...args) : value;
  }

  function activePendingClarification() {
    const pending=sessionState.pendingClarification;
    if(!pending)return null;

    const createdTurn=Number(pending.createdTurn||0);
    if(createdTurn && (sessionState.turn-createdTurn)>=CLARIFICATION_MAX_AGE) {
      sessionState.pendingClarification=null;
      return null;
    }

    return pending;
  }

  function resetContext() {
    sessionState.turn=0;
    sessionState.language=null;
    sessionState.lastPlaceIds=[];
    sessionState.lastTerritoryId=null;
    sessionState.lastIntents=[];
    sessionState.lastRoute=null;
    sessionState.pendingClarification=null;
    sessionState.turns=[];
    sessionState.focus={territoryId:null,poiIds:[],section:null};
    sessionState.lastResult={type:null,poiIds:[],territoryId:null,intent:null};
    try{updateContextIndicator();}catch(error){}
    return getContext();
  }

  function getContext() {
    const pending=activePendingClarification();

    return {
      turn:sessionState.turn,
      language:sessionState.language,
      currentSection:currentSectionId(),
      lastPlaceIds:[...sessionState.lastPlaceIds],
      lastTerritoryId:sessionState.lastTerritoryId,
      lastIntents:[...sessionState.lastIntents],
      focus:{
        territoryId:sessionState.focus?.territoryId||null,
        poiIds:[...(sessionState.focus?.poiIds||[])],
        section:sessionState.focus?.section||currentSectionId()||null
      },
      lastResult:{
        type:sessionState.lastResult?.type||null,
        poiIds:[...(sessionState.lastResult?.poiIds||[])],
        territoryId:sessionState.lastResult?.territoryId||null,
        intent:sessionState.lastResult?.intent||null
      },
      turns:(sessionState.turns||[]).map(turn=>({
        turn:turn.turn,
        user:turn.user,
        intents:[...(turn.intents||[])],
        entityRefs:[...(turn.entityRefs||[])],
        territoryId:turn.territoryId||null,
        poiIds:[...(turn.poiIds||[])],
        resultPoiIds:[...(turn.resultPoiIds||[])],
        clarificationType:turn.clarificationType||null
      })),
      lastRoute:sessionState.lastRoute
        ? {
            placeIds:[...(sessionState.lastRoute.originPlaceIds||sessionState.lastRoute.placeIds||[])],
            originPlaceIds:[...(sessionState.lastRoute.originPlaceIds||sessionState.lastRoute.placeIds||[])],
            selectedPlaceIds:[...(sessionState.lastRoute.selectedPlaceIds||[])],
            durationHours:sessionState.lastRoute.durationHours,
            themes:[...(sessionState.lastRoute.themes||[])],
            mode:sessionState.lastRoute.mode||null
          }
        : null,
      pendingClarification:pending
        ? {
            type:pending.type,
            placeIds:[...(pending.placeIds||[])],
            createdTurn:pending.createdTurn||null
          }
        : null
    };
  }

  function conversationEntityRefs(analysis) {
    const refs=[];
    const add=ref=>{
      if(!ref||!ref.type||!ref.id)return;
      const key=ref.type+":"+ref.id;
      if(!refs.some(item=>item.key===key))refs.push({...ref,key});
    };

    if(analysis?.territory?.id)add({type:"territory",id:analysis.territory.id});

    for(const place of analysis?.places||[]) {
      if(place?.id)add({type:"poi",id:place.id});
    }

    for(const request of analysis?.plan||[]) {
      for(const ref of request.entityRefs||[])add(ref);
    }

    return refs.map(({key,...ref})=>ref);
  }

  function recordConversationTurn(userText,analysis,meta={}) {
    sessionState.language=analysis?.language||sessionState.language;

    const entityRefs=conversationEntityRefs(analysis);
    const poiIds=[
      ...(meta.resultPoiIds||[]),
      ...entityRefs.filter(ref=>ref.type==="poi").map(ref=>ref.id)
    ].filter(Boolean);
    const uniquePoiIds=[...new Set(poiIds)].slice(0,12);
    const territoryId=
      meta.resultTerritoryId
      || analysis?.territory?.id
      || entityRefs.find(ref=>ref.type==="territory")?.id
      || null;

    const record={
      turn:sessionState.turn,
      user:String(userText||"").slice(0,240),
      intents:[...(analysis?.intents||[])],
      entityRefs,
      territoryId,
      poiIds:[...new Set(entityRefs.filter(ref=>ref.type==="poi").map(ref=>ref.id))],
      resultPoiIds:uniquePoiIds,
      clarificationType:meta.clarificationType||null
    };

    sessionState.turns.push(record);
    if(sessionState.turns.length>CONVERSATION_MAX_TURNS) {
      sessionState.turns=sessionState.turns.slice(-CONVERSATION_MAX_TURNS);
    }

    sessionState.focus={
      territoryId:territoryId||sessionState.focus?.territoryId||null,
      poiIds:uniquePoiIds.length
        ? [...uniquePoiIds]
        : [...(sessionState.focus?.poiIds||[])],
      section:currentSectionId()||sessionState.focus?.section||null
    };

    if(meta.resultType || uniquePoiIds.length || territoryId) {
      sessionState.lastResult={
        type:meta.resultType||"answer",
        poiIds:[...uniquePoiIds],
        territoryId:territoryId||null,
        intent:meta.resultIntent||analysis?.intents?.[0]||null
      };
    }

    return record;
  }

  function placesByIds(ids=[]) {
    const all=bridge?.getPlaces?.()||[];
    const map=new Map(all.map(place=>[place.id,place]));
    return ids.map(id=>map.get(id)).filter(Boolean);
  }

  function territoryMatches(text,language){
    try{
      const direct=bridge?.findTerritories?.(text,language);
      if(Array.isArray(direct))return direct;
    }catch(error){
      console.warn("[Aracne] findTerritories",error);
    }
    try{
      return window.AracneKnowledgeBase?.findTerritories?.(text,language)||[];
    }catch(error){
      return [];
    }
  }

  function hydrateTerritoryMatch(match){
    if(!match)return null;
    if(match.entry)return {id:match.id,...match.entry};
    if(match.id)return territoryById(match.id);
    return null;
  }

  function orderedTerritoryMentions(text,language){
    const n=normalize(text);
    const matches=territoryMatches(text,language)||[];
    const out=[];
    const seen=new Set();

    const allPositions=(haystack,needle)=>{
      const positions=[];
      if(!needle)return positions;
      let from=0;

      while(from<haystack.length){
        const pos=haystack.indexOf(needle,from);
        if(pos<0)break;

        const before=pos===0 ? " " : haystack[pos-1];
        const afterPos=pos+needle.length;
        const after=afterPos>=haystack.length ? " " : haystack[afterPos];
        const boundaryBefore=before===" ";
        const boundaryAfter=after===" ";

        if(boundaryBefore && boundaryAfter)positions.push(pos);
        from=pos+Math.max(1,needle.length);
      }

      return positions;
    };

    for(const match of matches){
      const territory=hydrateTerritoryMatch(match);
      if(!territory?.id)continue;

      const aliases=[...new Set([
        match.matchedAlias,
        territory.id,
        territory.name,
        territory.labels?.[language],
        ...(territory.aliases?.[language]||territory.aliases?.it||[])
      ]
        .filter(Boolean)
        .map(normalize)
        .filter(Boolean))];

      for(const alias of aliases){
        for(const pos of allPositions(n,alias)){
          const key=territory.id+"@"+pos;
          if(seen.has(key))continue;
          seen.add(key);

          out.push({
            id:territory.id,
            territory,
            pos,
            alias
          });
        }
      }
    }

    return out.sort((a,b)=>a.pos-b.pos || a.id.localeCompare(b.id));
  }

  function representativePlaceForTerritory(territory){
    if(!territory?.id)return null;
    const places=placesByIds(territoryPoiIds(territory.id));

    return (
      places.find(place=>place.id===territory.id && hasCoords(place))
      ||
      places.find(hasCoords)
      ||
      places.find(place=>place.id===territory.id)
      ||
      places[0]
      ||
      null
    );
  }

  function buildSemanticPlan(text,language,cues){
    const n=normalize(text);
    const mentions=orderedTerritoryMentions(text,language);
    const routeCue=[...(cues||[])]
      .filter(cue=>cue.name==="route")
      .sort((a,b)=>a.pos-b.pos)[0]||null;

    const infoCues=[...(cues||[])]
      .filter(cue=>["tell","see_place","near_place"].includes(cue.name))
      .sort((a,b)=>a.pos-b.pos);

    const routeBoundary=routeCue?.pos>=0 ? routeCue.pos : Number.POSITIVE_INFINITY;

    const preRouteMentions=mentions.filter(item=>item.pos<routeBoundary);
    const postRouteMentions=routeCue
      ? mentions.filter(item=>item.pos>routeCue.pos)
      : [];

    let primaryMention=null;

    for(const cue of infoCues){
      const afterCue=preRouteMentions.find(item=>item.pos>=cue.pos);
      if(afterCue){
        primaryMention=afterCue;
        break;
      }
    }

    if(!primaryMention){
      primaryMention=preRouteMentions[0]||mentions[0]||null;
    }

    let routeMentions=[...postRouteMentions];

    // If the route verb appears after a city list ("Lecce, Gallipoli: fammi un percorso"),
    // retain the ordered city mentions rather than losing them.
    if(routeCue && routeMentions.length<2){
      const allBefore=mentions.filter(item=>item.pos<routeCue.pos);
      if(allBefore.length>=2 && !infoCues.length)routeMentions=allBefore;
    }

    const uniqueRouteMentions=[];
    for(const item of routeMentions){
      if(!uniqueRouteMentions.some(existing=>existing.id===item.id)){
        uniqueRouteMentions.push(item);
      }
    }

    const routePlaces=uniqueRouteMentions
      .map(item=>representativePlaceForTerritory(item.territory))
      .filter(Boolean);

    return {
      cityMentions:mentions.map(item=>({
        id:item.id,
        name:territoryName(item.territory),
        pos:item.pos
      })),
      primaryTerritory:primaryMention?.territory||null,
      infoTerritory:primaryMention?.territory||null,
      routeTerritories:uniqueRouteMentions.map(item=>item.territory),
      routePlaces,
      routeLabels:uniqueRouteMentions.map(item=>territoryName(item.territory)),
      routeBoundary:Number.isFinite(routeBoundary)?routeBoundary:null
    };
  }

  function territoryById(id){
    if(!id)return null;
    try{
      const direct=bridge?.getTerritoryKnowledge?.(id);
      if(direct)return {id,...direct};
    }catch(error){}
    try{
      const entry=window.AracneKnowledgeBase?.getTerritory?.(id);
      return entry ? {id,...entry} : null;
    }catch(error){
      return null;
    }
  }

  function territorySources(id){
    if(!id)return [];
    try{
      const direct=bridge?.getTerritorySources?.(id);
      if(Array.isArray(direct))return direct;
    }catch(error){}
    try{
      return window.AracneKnowledgeBase?.territorySourcesFor?.(id)||[];
    }catch(error){
      return [];
    }
  }

  function territoryPoiIds(id){
    if(!id)return [];
    try{
      const direct=bridge?.getTerritoryPoiIds?.(id);
      if(Array.isArray(direct))return direct;
    }catch(error){}
    try{
      return window.AracneKnowledgeBase?.poisForTerritory?.(id)||[];
    }catch(error){
      return [];
    }
  }

  function territoryName(territory){
    if(!territory)return "";
    return territory.name || territory.id || "";
  }

  function territoryLocalized(territory,field,language){
    const value=territory?.[field];
    if(!value)return null;
    if(Array.isArray(value))return value;
    if(typeof value==="string")return value;
    return value?.[language]||value?.it||value?.en||null;
  }

  function formatTerritorySources(territory,language){
    const sources=territorySources(territory?.id);
    const labels=knowledgeLabels(language);
    if(!sources.length)return noVerifiedAspect("sources",language);
    return labels.sources+":\n"+sources.slice(0,4).map(function(source){
      const label=source.publisher||source.title||source.id;
      const suffix=(source.title&&source.publisher)?" — "+source.title:"";
      return "• "+label+suffix;
    }).join("\n");
  }

  function formatTerritoryKnowledge(territory,aspect,language){
    if(!territory)return null;
    const labels=knowledgeLabels(language);
    if(aspect==="sources")return formatTerritorySources(territory,language);
    if(aspect){
      const value=territoryLocalized(territory,aspect,language);
      if(value)return (labels[aspect]||"Info")+":\n"+value;
      return noVerifiedAspect(aspect,language);
    }
    const summary=territoryLocalized(territory,"summary",language);
    const history=territoryLocalized(territory,"history",language);
    return [summary,history].filter(Boolean).join("\n\n")||null;
  }

  function formatTerritoryHighlights(territory,language){
    const list=territoryLocalized(territory,"highlights",language);
    if(!Array.isArray(list)||!list.length)return null;
    return knowledgeLabels(language).highlights+":\n"+list.slice(0,6).map(function(item){return "• "+item;}).join("\n");
  }

  function territoryPois(territory){
    const ids=territoryPoiIds(territory?.id);
    return placesByIds(ids);
  }

  function territoryFilterTokens(themes=[],aspect=null){
    const tokens=new Set();

    for(const theme of themes||[]){
      if(theme==="nature")["nature","wetland","biodiversity","birdlife","woodland","protected-area","landscape","geology","park"].forEach(x=>tokens.add(x));
      if(theme==="sea")["sea","coast","beach","bay","cove","island","sea-cave","sea-stacks","adriatic","ionian"].forEach(x=>tokens.add(x));
      if(theme==="culture")["culture","history","archaeology","prehistory","castle","fortification","religious","architecture","coastal-tower","medieval","renaissance","baroque"].forEach(x=>tokens.add(x));
      if(theme==="food")["food","wine","gastronomy","rural-history"].forEach(x=>tokens.add(x));
      if(theme==="sunset")["sunset","tramonto"].forEach(x=>tokens.add(x));
    }

    if(aspect==="history")["history","archaeology","prehistory","castle","fortification","religious","architecture","coastal-tower","medieval","renaissance","baroque"].forEach(x=>tokens.add(x));
    if(aspect==="nature")["nature","wetland","biodiversity","birdlife","woodland","protected-area","landscape","geology","sea","coast","beach","bay","cove","island","sea-cave"].forEach(x=>tokens.add(x));
    if(aspect==="myth")["myth","legend"].forEach(x=>tokens.add(x));

    return tokens;
  }

  function territoryPoiMatches(place,themes=[],aspect=null){
    const entry=knowledgeEntry(place);
    const tokens=territoryFilterTokens(themes,aspect);
    if(!tokens.size)return true;

    const entryThemes=new Set((entry?.themes||[]).map(normalize));
    const tags=new Set((place?.tags||[]).map(normalize));
    const cat=normalize(place?.cat||"");

    if(themes.includes("nature") && ["nature","sea"].includes(cat))return true;
    if(themes.includes("sea") && cat==="sea")return true;
    if(themes.includes("culture") && cat==="culture")return true;
    if(themes.includes("food") && cat==="food")return true;
    if(themes.includes("sunset") && (tags.has("tramonto")||tags.has("sunset")))return true;

    if(aspect==="history" && (cat==="culture" || !!entry?.history))return true;
    if(aspect==="nature" && (["nature","sea"].includes(cat) || !!entry?.nature))return true;
    if(aspect==="myth" && !!entry?.myth)return true;

    for(const token of tokens){
      if(entryThemes.has(normalize(token)) || tags.has(normalize(token)))return true;
    }

    return false;
  }

  function formatTerritoryPoiList(territory,language,options={}){
    const themes=Array.isArray(options.themes)?options.themes:[];
    const aspect=options.aspect||null;
    const filtered=territoryPois(territory).filter(place=>territoryPoiMatches(place,themes,aspect));
    const pois=filtered.slice(0,8);

    if(!pois.length){
      if(themes.length || ["history","nature","myth"].includes(aspect)){
        return ({
          it:"Non ho ancora un POI HIRUNDU collegato che corrisponda esattamente a questo filtro.",
          fr:"Je n’ai pas encore de POI HIRUNDU lié qui corresponde exactement à ce filtre.",
          en:"I do not yet have a linked HIRUNDU POI that exactly matches this filter.",
          es:"Todavía no tengo un POI HIRUNDU vinculado que coincida exactamente con este filtro."
        })[language]||null;
      }
      return null;
    }

    const filteredLabel=(themes.length || ["history","nature","myth"].includes(aspect));
    const intro=filteredLabel
      ? ({it:"Selezione HIRUNDU",fr:"Sélection HIRUNDU",en:"HIRUNDU selection",es:"Selección HIRUNDU"}[language]||"HIRUNDU")
      : ({it:"Luoghi HIRUNDU collegati",fr:"Lieux HIRUNDU liés",en:"Related HIRUNDU places",es:"Lugares HIRUNDU relacionados"}[language]||"HIRUNDU");

    return intro+":\n"+pois.map(function(place){return "• "+placeName(place);}).join("\n");
  }

  function exactNamedPlaces(text){
    try{
      const result=bridge?.findExactPlaces?.(text);
      return Array.isArray(result)?result:[];
    }catch(error){
      return [];
    }
  }

  const SECTION_LABELS = {
    it:{about:"Su",see:"Da vedere",nearby:"Nei dintorni",route:"Percorso proposto",action:"Azione",compare:"Confronto",stops:"Tappe",duration:"Durata",mode:"Mezzo"},
    fr:{about:"À propos de",see:"À voir",nearby:"Autour",route:"Parcours proposé",action:"Action",compare:"Comparaison",stops:"Étapes",duration:"Durée",mode:"Transport"},
    en:{about:"About",see:"What to see",nearby:"Nearby",route:"Suggested route",action:"Action",compare:"Comparison",stops:"Stops",duration:"Duration",mode:"Transport"},
    es:{about:"Sobre",see:"Qué ver",nearby:"Alrededores",route:"Ruta propuesta",action:"Acción",compare:"Comparación",stops:"Etapas",duration:"Duración",mode:"Transporte"}
  };

  const MODE_LABELS = {
    it:{driving:"auto / scooter",cycling:"bici",walking:"a piedi"},
    fr:{driving:"voiture / scooter",cycling:"vélo",walking:"à pied"},
    en:{driving:"car / scooter",cycling:"bike",walking:"walking"},
    es:{driving:"coche / scooter",cycling:"bici",walking:"a pie"}
  };

  const NUMBER_WORDS = {
    it:{uno:1,una:1,un:1,due:2,tre:3,quattro:4,cinque:5,sei:6,sette:7,otto:8,nove:9,dieci:10,undici:11,dodici:12},
    fr:{un:1,une:1,deux:2,trois:3,quatre:4,cinq:5,six:6,sept:7,huit:8,neuf:9,dix:10,onze:11,douze:12},
    en:{one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12},
    es:{un:1,uno:1,una:1,dos:2,tres:3,cuatro:4,cinco:5,seis:6,siete:7,ocho:8,nueve:9,diez:10,once:11,doce:12}
  };

  const KNOWLEDGE_ASPECT_RULES = {
    it:{
      history:["storia","origine","origini","quando e stato costruito","quando fu costruito","epoca"],
      myth:["mito","leggenda","tradizione","enea","racconto mitologico"],
      nature:["natura","biodiversita","fauna","flora","ambiente","geologia","paesaggio"],
      practical:["si puo visitare","posso visitare","come si visita","accesso","orari","biglietti","prenotazione"],
      why:["perche si chiama","si chiama","perche questo nome","origine del nome","significato del nome"],
      sources:["fonti","fonte","da dove lo sai","come lo sai","quali sono le fonti"]
    },
    fr:{
      history:["histoire","origine","origines","quand a ete construit","quand a ete construite","epoque"],
      myth:["mythe","legende","tradition","enee","recit mythologique"],
      nature:["nature","biodiversite","faune","flore","environnement","geologie","paysage"],
      practical:["est ce qu on peut visiter","peut on visiter","comment visiter","acces","horaires","billets","reservation"],
      why:["pourquoi ca s appelle","s appelle","pourquoi ce nom","origine du nom","signification du nom"],
      sources:["sources","source","d ou tu sais ca","comment tu sais","quelles sont tes sources"]
    },
    en:{
      history:["history","origin","origins","when was it built","period","era"],
      myth:["myth","legend","tradition","aeneas","mythological story"],
      nature:["nature","biodiversity","fauna","flora","environment","geology","landscape"],
      practical:["can i visit","can we visit","how to visit","access","opening hours","tickets","booking"],
      why:["why is it called","called that","called this","why this name","origin of the name","meaning of the name"],
      sources:["sources","source","how do you know","where do you know that from","what are your sources"]
    },
    es:{
      history:["historia","origen","origenes","cuando se construyo","epoca"],
      myth:["mito","leyenda","tradicion","eneas","relato mitologico"],
      nature:["naturaleza","biodiversidad","fauna","flora","medio ambiente","geologia","paisaje"],
      practical:["se puede visitar","puedo visitar","como visitar","acceso","horarios","entradas","reserva"],
      why:["por que se llama","se llama","por que este nombre","origen del nombre","significado del nombre"],
      sources:["fuentes","fuente","como lo sabes","de donde lo sabes","cuales son tus fuentes"]
    }
  };

  function allKnowledgeAspectPhrases(language){
    const pack=KNOWLEDGE_ASPECT_RULES[language]||KNOWLEDGE_ASPECT_RULES.it;
    return Object.values(pack).flat();
  }

  function detectKnowledgeAspect(text,language){
    const n=normalize(text);
    const pack=KNOWLEDGE_ASPECT_RULES[language]||KNOWLEDGE_ASPECT_RULES.it;
    for(const aspect of ["sources","practical","myth","history","nature","why"]){
      if(hasAny(n,pack[aspect]||[]))return aspect;
    }
    return null;
  }

  function knowledgeEntry(place){
    if(!place?.id)return null;
    try{
      const entry=bridge?.getKnowledge?.(place.id);
      if(entry)return entry;
    }catch(error){
      console.warn("[Aracne] getKnowledge",error);
    }
    try{
      return window.AracneKnowledgeBase?.get?.(place.id)||null;
    }catch(error){
      return null;
    }
  }

  function knowledgeSources(place){
    if(!place?.id)return [];
    try{
      const result=bridge?.getKnowledgeSources?.(place.id);
      if(Array.isArray(result))return result;
    }catch(error){}
    try{
      return window.AracneKnowledgeBase?.sourcesFor?.(place.id)||[];
    }catch(error){
      return [];
    }
  }

  function localizedKnowledge(entry,field,language){
    const value=entry?.[field];
    if(!value)return null;
    if(Array.isArray(value))return value;
    if(typeof value==="string")return value;
    return value?.[language]||value?.it||value?.en||null;
  }

  function knowledgeLabels(language){
    return ({
      it:{history:"Storia",myth:"Mito e tradizione",nature:"Natura",practical:"Visita",why:"Perché questo nome",sources:"Fonti",highlights:"Da notare"},
      fr:{history:"Histoire",myth:"Mythe et tradition",nature:"Nature",practical:"Visite",why:"Pourquoi ce nom",sources:"Sources",highlights:"À remarquer"},
      en:{history:"History",myth:"Myth and tradition",nature:"Nature",practical:"Visit",why:"Why this name",sources:"Sources",highlights:"Look for"},
      es:{history:"Historia",myth:"Mito y tradición",nature:"Naturaleza",practical:"Visita",why:"Por qué este nombre",sources:"Fuentes",highlights:"Qué observar"}
    })[language]||{};
  }

  function noVerifiedAspect(aspect,language){
    const labels=knowledgeLabels(language);
    const name=labels[aspect]||aspect;
    return ({
      it:"Non ho ancora una scheda locale verificata per questo aspetto ("+name+"). Posso però usare le informazioni generali già curate sul luogo.",
      fr:"Je n’ai pas encore de fiche locale vérifiée pour cet aspect ("+name+"). Je peux toutefois utiliser les informations générales déjà vérifiées sur ce lieu.",
      en:"I do not yet have a verified local record for this aspect ("+name+"). I can still use the general curated information for this place.",
      es:"Todavía no tengo una ficha local verificada para este aspecto ("+name+"). Aun así puedo utilizar la información general ya verificada sobre este lugar."
    })[language];
  }
  function formatKnowledgeSources(place,language){
    const sources=knowledgeSources(place);
    const labels=knowledgeLabels(language);
    if(!sources.length)return noVerifiedAspect("sources",language);
    return labels.sources+":\n"+sources.slice(0,4).map(function(source){
      const label=source.publisher||source.title||source.id;
      const suffix=(source.title&&source.publisher)?" — "+source.title:"";
      return "• "+label+suffix;
    }).join("\n");
  }

  function formatKnowledgeHighlights(entry,language){
    const list=localizedKnowledge(entry,"highlights",language);
    if(!Array.isArray(list)||!list.length)return null;
    const labels=knowledgeLabels(language);
    return labels.highlights+":\n"+list.slice(0,5).map(function(item){return "• "+item;}).join("\n");
  }

  function formatKnowledgePlace(place,aspect,language){
    const entry=knowledgeEntry(place);
    if(!entry)return null;
    const labels=knowledgeLabels(language);
    if(aspect==="sources")return formatKnowledgeSources(place,language);
    if(aspect){
      const value=localizedKnowledge(entry,aspect,language);
      if(value)return (labels[aspect]||"Info")+":\n"+value;
      return noVerifiedAspect(aspect,language);
    }
    const summary=localizedKnowledge(entry,"summary",language);
    const history=localizedKnowledge(entry,"history",language);
    const lines=[];
    if(summary)lines.push(summary);
    if(!aspect&&history&&history!==summary)lines.push(history);
    return lines.join("\n\n")||null;
  }

  function whatToSeeKnowledge(place,language){
    const entry=knowledgeEntry(place);
    if(!entry)return null;
    return formatKnowledgeHighlights(entry,language);
  }
  const LEXICON = {
    it:{
      scope:["cosa puoi fare","cosa sai fare","come funziona","come puoi aiutarmi"],
      tell:["parlami di","parlami","parlarmi di","parlarmi","puoi parlarmi di","mi puoi parlare di","potresti parlarmi di","vorrei sapere di","raccontami","spiegami","dimmi di","descrivimi","cosa sai di"],
      see:["cosa vedere","cosa c e da vedere","che cosa vedere","da vedere"],
      routeNouns:["percorso","tragitto","itinerario","giro","passeggiata","camminata","escursione","tour","viaggio"],
      routeVerbs:["crea","creami","costruisci","proponi","prepara","organizza","fammi","suggerisci","consigliami","pianifica"],
      nearbyMe:["vicino a me","intorno a me","nei miei dintorni"],
      nearbyPlace:["vicino a","intorno a","nei dintorni di","nei pressi di","cosa c e vicino a","cosa vedere vicino a"],
      add:["aggiungi","aggiungere","inserisci","inserire","metti","includi","includere"],
      open:["apri","mostra","fammi vedere","visualizza"],
      compare:["confronta","confronto","differenza tra","meglio tra"],
      themes:{nature:["natura","naturale","parco","bosco","verde"],sea:["mare","spiaggia","baia","costa"],culture:["cultura","storia","arte","chiesa","castello","museo"],food:["cibo","cucina","sapori","gastronomia","prodotto locale"],sunset:["tramonto"]},
      modes:{cycling:["bici","bicicletta","ciclismo"],walking:["a piedi","camminare","camminata"],driving:["auto","macchina","scooter","moto"]}
    },
    fr:{
      scope:["que peux tu faire","qu est ce que tu fais","comment ca marche","comment peux tu m aider"],
      tell:["parle moi de","parle moi d","parle moi","peux tu me parler de","pouvez vous me parler de","parler de","raconte moi","raconte moi d","explique moi","dis moi","decris moi","presente moi","que sais tu de","que sais tu d"],
      see:["qu est ce qu il y a a voir","qu est ce qu il y a voir","que voir","quoi voir","a voir"],
      routeNouns:["parcours","trajet","itineraire","circuit","balade","promenade","excursion","tour","trip","voyage"],
      routeVerbs:["cree","creer","construis","construire","propose","proposer","prepare","preparer","organise","organiser","fais","faire","planifie","planifier","suggere","suggerer","conseille moi"],
      nearbyMe:["autour de moi","pres de moi","a proximite de moi","dans les environs"],
      nearbyPlace:["autour de","autour d","pres de","pres d","a proximite de","a proximite d","aux alentours de","aux alentours d","dans les environs de","dans les environs d","qu est ce qu il y a autour de","qu est ce qu il y a autour d","que voir pres de","que voir pres d"],
      add:["ajoute","ajouter","mets","mettre","insere","inserer","inclus","inclure"],
      open:["ouvre","ouvrir","montre","montre moi","affiche","fais moi voir"],
      compare:["compare","comparaison","difference entre","lequel choisir entre"],
      themes:{nature:["nature","naturel","plein air","parc","foret","vert"],sea:["mer","plage","baie","cote"],culture:["culture","histoire","art","eglise","chateau","musee"],food:["saveurs","gastronomie","cuisine","produit local","manger"],sunset:["coucher de soleil","sunset"]},
      modes:{cycling:["velo","bicyclette","bike"],walking:["a pied","marche","marcher"],driving:["voiture","auto","scooter","moto"]}
    },
    en:{
      scope:["what can you do","what do you do","how does this work","how can you help me"],
      tell:["tell me about","tell me","can you tell me about","could you tell me about","talk to me about","describe","explain","what do you know about","introduce me to"],
      see:["what to see","what is there to see","things to see","what can i see"],
      routeNouns:["route","trip","itinerary","journey","tour","walk","walking tour","excursion","trail","circuit"],
      routeVerbs:["create","build","make","plan","suggest","propose","prepare","organize","organise","recommend"],
      nearbyMe:["near me","around me","close to me","in my area"],
      nearbyPlace:["near","around","close to","nearby","what is around","what s around","what can i see near"],
      add:["add","include","insert","put"],
      open:["open","show","show me","display"],
      compare:["compare","comparison","difference between","which is better"],
      themes:{nature:["nature","natural","outdoors","park","forest","green"],sea:["sea","beach","bay","coast"],culture:["culture","history","art","church","castle","museum"],food:["food","flavours","flavors","cuisine","local food","gastronomy"],sunset:["sunset"]},
      modes:{cycling:["bike","bicycle","cycling"],walking:["walk","walking","on foot"],driving:["car","driving","scooter","motorbike","motorcycle"]}
    },
    es:{
      scope:["que puedes hacer","que sabes hacer","como funciona","como puedes ayudarme"],
      tell:["hablame de","hablame","puedes hablarme de","podrias hablarme de","hablarme de","cuentame","explicame","dime","describeme","presentame","que sabes de"],
      see:["que ver","que hay que ver","que hay para ver","cosas que ver"],
      routeNouns:["ruta","trayecto","recorrido","itinerario","circuito","paseo","excursion","tour","trip","viaje"],
      routeVerbs:["crea","crear","construye","construir","propon","propone","proponer","prepara","organiza","organizar","haz","hacer","planifica","sugiere","recomienda"],
      nearbyMe:["cerca de mi","a mi alrededor","en mis alrededores"],
      nearbyPlace:["cerca de","alrededor de","en los alrededores de","proximo a","que hay cerca de","que ver cerca de"],
      add:["anade","anadir","agrega","agregar","incluye","incluir","inserta"],
      open:["abre","abrir","muestra","muestrame","ensena"],
      compare:["compara","comparacion","diferencia entre","cual elegir entre"],
      themes:{nature:["naturaleza","natural","parque","bosque","verde"],sea:["mar","playa","bahia","costa"],culture:["cultura","historia","arte","iglesia","castillo","museo"],food:["comida","sabores","gastronomia","cocina","producto local"],sunset:["atardecer","puesta de sol"]},
      modes:{cycling:["bici","bicicleta","ciclismo"],walking:["a pie","caminar","paseo"],driving:["coche","auto","scooter","moto"]}
    }
  };


  /* =========================================
     CAPABILITY REGISTRY v0.7
     Mirrors the five bottom tabs of HIRUNDU.
     ========================================= */

  const CAPABILITY_REGISTRY = {
    "discover": {
      "icon": "🧭",
      "labels": {
        "it": "Scopri",
        "fr": "Découvrir",
        "en": "Discover",
        "es": "Descubrir"
      },
      "aliases": {
        "it": [
          "scopri",
          "scoprire"
        ],
        "fr": [
          "decouvrir",
          "decouverte"
        ],
        "en": [
          "discover",
          "discovery"
        ],
        "es": [
          "descubrir",
          "descubre"
        ]
      },
      "actions": {
        "it": [
          "conoscere un luogo e cosa vedere",
          "scoprire cosa c’è vicino a te o a un luogo",
          "ricevere suggerimenti per mare, natura, cultura o sapori",
          "aprire un POI o aggiungerlo al percorso"
        ],
        "fr": [
          "découvrir un lieu et ce qu’il y a à voir",
          "chercher autour de toi ou autour d’un lieu",
          "obtenir des suggestions mer, nature, culture ou saveurs",
          "ouvrir un POI ou l’ajouter au parcours"
        ],
        "en": [
          "learn about a place and what to see",
          "find what is near you or near a place",
          "get sea, nature, culture or food suggestions",
          "open a POI or add it to the route"
        ],
        "es": [
          "conocer un lugar y qué ver",
          "buscar cerca de ti o alrededor de un lugar",
          "recibir sugerencias de mar, naturaleza, cultura o sabores",
          "abrir un POI o añadirlo a la ruta"
        ]
      },
      "examples": {
        "it": "Cosa c’è intorno a Otranto?",
        "fr": "Qu’est-ce qu’il y a autour d’Otranto ?",
        "en": "What is around Otranto?",
        "es": "¿Qué hay alrededor de Otranto?"
      },
      "tools": [
        "open",
        "near_me",
        "near_place",
        "add",
        "navigate:discover"
      ]
    },
    "routes": {
      "icon": "🧵",
      "labels": {
        "it": "Percorsi",
        "fr": "Parcours",
        "en": "Routes",
        "es": "Rutas"
      },
      "aliases": {
        "it": [
          "percorsi",
          "percorso",
          "itinerario"
        ],
        "fr": [
          "parcours",
          "itineraire",
          "itineraires"
        ],
        "en": [
          "routes",
          "route",
          "itinerary"
        ],
        "es": [
          "rutas",
          "ruta",
          "itinerario"
        ]
      },
      "actions": {
        "it": [
          "creare un percorso da luoghi, tempo, tema o mezzo",
          "aggiungere o togliere tappe dal percorso",
          "cambiare tra auto/scooter, bici e cammino",
          "aprire il percorso in Maps o condividerlo"
        ],
        "fr": [
          "créer un parcours avec lieux, durée, thème ou transport",
          "ajouter ou retirer des étapes du parcours",
          "passer voiture/scooter, vélo ou marche",
          "ouvrir le parcours dans Maps ou le partager"
        ],
        "en": [
          "create a route from places, time, theme or transport",
          "add or remove stops from the route",
          "switch between car/scooter, bike and walking",
          "open the route in Maps or share it"
        ],
        "es": [
          "crear una ruta con lugares, duración, tema o transporte",
          "añadir o quitar etapas de la ruta",
          "cambiar entre coche/scooter, bici y caminar",
          "abrir la ruta en Maps o compartirla"
        ]
      },
      "examples": {
        "it": "Togli Otranto dal percorso e passa alla bici.",
        "fr": "Enlève Otranto du parcours et passe à vélo.",
        "en": "Remove Otranto from the route and switch to bike.",
        "es": "Quita Otranto de la ruta y cambia a bici."
      },
      "tools": [
        "route",
        "route_remove",
        "route_clear",
        "route_mode",
        "maps_open",
        "share:route",
        "navigate:routes"
      ]
    },
    "act": {
      "icon": "🌿",
      "labels": {
        "it": "Agisci",
        "fr": "Agir",
        "en": "Act",
        "es": "Actuar"
      },
      "aliases": {
        "it": [
          "agisci",
          "missioni",
          "azioni verdi",
          "azioni sostenibili"
        ],
        "fr": [
          "agir",
          "missions",
          "actions vertes",
          "actions green",
          "actions durables"
        ],
        "en": [
          "act",
          "missions",
          "green actions",
          "sustainable actions"
        ],
        "es": [
          "actuar",
          "misiones",
          "acciones verdes",
          "acciones sostenibles"
        ]
      },
      "actions": {
        "it": [
          "vedere e aprire le missioni sostenibili",
          "capire come validare con foto, QR o percorso",
          "consultare Filo Verde e Aracne Points",
          "condividere missioni, punti e Filo Verde"
        ],
        "fr": [
          "voir et ouvrir les missions durables",
          "comprendre les validations photo, QR ou parcours",
          "consulter le Filo Verde et les Aracne Points",
          "partager missions, points et Filo Verde"
        ],
        "en": [
          "view and open sustainable missions",
          "understand photo, QR or route validation",
          "check Filo Verde and Aracne Points",
          "share missions, points and Filo Verde"
        ],
        "es": [
          "ver y abrir las misiones sostenibles",
          "entender la validación por foto, QR o ruta",
          "consultar Filo Verde y Aracne Points",
          "compartir misiones, puntos y Filo Verde"
        ]
      },
      "examples": {
        "it": "Mostra le mie missioni e dimmi quanti punti ho.",
        "fr": "Montre mes missions et dis-moi combien de points j’ai.",
        "en": "Show my missions and tell me how many points I have.",
        "es": "Muestra mis misiones y dime cuántos puntos tengo."
      },
      "tools": [
        "mission_open",
        "qr_open",
        "status",
        "share:act",
        "navigate:act"
      ]
    },
    "mapSheet": {
      "icon": "🗺️",
      "labels": {
        "it": "Mappa",
        "fr": "Carte",
        "en": "Map",
        "es": "Mapa"
      },
      "aliases": {
        "it": [
          "mappa",
          "cartina"
        ],
        "fr": [
          "carte",
          "map"
        ],
        "en": [
          "map"
        ],
        "es": [
          "mapa"
        ]
      },
      "actions": {
        "it": [
          "aprire la mappa e centrare un luogo",
          "mostrare un POI sulla mappa",
          "cercare i luoghi più vicini alla tua posizione",
          "esplorare i luoghi per mare, natura, cultura e sapori"
        ],
        "fr": [
          "ouvrir la carte et centrer un lieu",
          "afficher un POI sur la carte",
          "chercher les lieux proches de ta position",
          "explorer mer, nature, culture et saveurs"
        ],
        "en": [
          "open the map and focus a place",
          "show a POI on the map",
          "find places nearest to your position",
          "explore sea, nature, culture and food"
        ],
        "es": [
          "abrir el mapa y centrar un lugar",
          "mostrar un POI en el mapa",
          "buscar lugares cerca de tu posición",
          "explorar mar, naturaleza, cultura y sabores"
        ]
      },
      "examples": {
        "it": "Apri la mappa e mostrami Otranto.",
        "fr": "Ouvre la carte et montre-moi Otranto.",
        "en": "Open the map and show me Otranto.",
        "es": "Abre el mapa y muéstrame Otranto."
      },
      "tools": [
        "navigate:mapSheet",
        "open",
        "near_me"
      ]
    },
    "passport": {
      "icon": "🕷️",
      "labels": {
        "it": "Viaggio",
        "fr": "Voyage",
        "en": "Trip",
        "es": "Viaje"
      },
      "aliases": {
        "it": [
          "viaggio",
          "passaporto",
          "diario",
          "badge"
        ],
        "fr": [
          "voyage",
          "passeport",
          "journal",
          "badges"
        ],
        "en": [
          "trip",
          "passport",
          "journal",
          "badges"
        ],
        "es": [
          "viaje",
          "pasaporte",
          "diario",
          "insignias"
        ]
      },
      "actions": {
        "it": [
          "aprire il Passaporto Aracne e vedere i badge",
          "consultare impatto, Filo Verde e punti",
          "leggere o salvare note nel Diario di Aracne",
          "condividere viaggio, passaporto o note"
        ],
        "fr": [
          "ouvrir le Passeport Aracne et voir les badges",
          "consulter impact, Filo Verde et points",
          "lire ou enregistrer des notes dans le Journal d’Aracne",
          "partager voyage, passeport ou notes"
        ],
        "en": [
          "open the Aracne Passport and view badges",
          "check impact, Filo Verde and points",
          "read or save notes in the Aracne Journal",
          "share the trip, passport or notes"
        ],
        "es": [
          "abrir el Pasaporte Aracne y ver las insignias",
          "consultar impacto, Filo Verde y puntos",
          "leer o guardar notas en el Diario de Aracne",
          "compartir viaje, pasaporte o notas"
        ]
      },
      "examples": {
        "it": "Nota che Castro al tramonto era bellissima e apri il mio passaporto.",
        "fr": "Note que Castro au coucher du soleil était magnifique et ouvre mon passeport.",
        "en": "Note that Castro at sunset was beautiful and open my passport.",
        "es": "Anota que Castro al atardecer era precioso y abre mi pasaporte."
      },
      "tools": [
        "journal_open",
        "journal_save",
        "status",
        "share:trip",
        "share:journal",
        "navigate:passport"
      ]
    }
  };

  const CAPABILITY_RULES = {
    "it": {
      "general": [
        "cosa puoi fare",
        "cosa sai fare",
        "come puoi aiutarmi",
        "quali sono le tue possibilita",
        "cosa posso fare",
        "che cosa posso fare",
        "come funziona",
        "come funziona aracne"
      ],
      "here": [
        "cosa posso fare qui",
        "che cosa posso fare qui",
        "cosa puoi fare qui"
      ],
      "actions": [
        "posso fare delle azioni",
        "quali azioni posso fare",
        "che azioni posso fare",
        "quali azioni",
        "azioni che posso fare",
        "azioni verdi",
        "azioni sostenibili"
      ],
      "wholeApp": [
        "in tutta l app",
        "tutta l app",
        "globalmente",
        "ovunque nell app"
      ]
    },
    "fr": {
      "general": [
        "que peux tu faire",
        "qu est ce que tu peux faire",
        "comment peux tu m aider",
        "quelles sont tes possibilites",
        "qu est ce que je peux faire",
        "que puis je faire",
        "comment ca marche",
        "comment fonctionne aracne",
        "comment utiliser aracne"
      ],
      "here": [
        "que puis je faire ici",
        "qu est ce que je peux faire ici",
        "que peux tu faire ici"
      ],
      "actions": [
        "est ce que je peux faire des actions",
        "quelles actions je peux faire",
        "quelles actions puis je faire",
        "quelles actions",
        "actions que je peux faire",
        "actions green",
        "actions vertes",
        "actions durables"
      ],
      "wholeApp": [
        "dans toute l app",
        "toute l app",
        "globalement",
        "partout dans l app"
      ]
    },
    "en": {
      "general": [
        "what can you do",
        "how can you help me",
        "what are your capabilities",
        "what can i do",
        "how does this work",
        "how does aracne work"
      ],
      "here": [
        "what can i do here",
        "what can you do here"
      ],
      "actions": [
        "can i do actions",
        "what actions can i do",
        "which actions can i do",
        "what actions",
        "green actions",
        "sustainable actions"
      ],
      "wholeApp": [
        "across the whole app",
        "whole app",
        "everywhere in the app",
        "globally"
      ]
    },
    "es": {
      "general": [
        "que puedes hacer",
        "como puedes ayudarme",
        "cuales son tus posibilidades",
        "que puedo hacer",
        "como funciona",
        "como funciona aracne"
      ],
      "here": [
        "que puedo hacer aqui",
        "que puedes hacer aqui"
      ],
      "actions": [
        "puedo hacer acciones",
        "que acciones puedo hacer",
        "cuales acciones puedo hacer",
        "que acciones",
        "acciones verdes",
        "acciones sostenibles"
      ],
      "wholeApp": [
        "en toda la app",
        "toda la app",
        "globalmente",
        "en cualquier parte de la app"
      ]
    }
  };

  function allCapabilityLanguagePhrases(language) {
    const rules=CAPABILITY_RULES[language] || CAPABILITY_RULES.it;
    return [
      ...(rules.general || []),
      ...(rules.here || []),
      ...(rules.actions || []),
      ...(rules.wholeApp || [])
    ];
  }

  function currentSectionId() {
    const id=bridge?.getCurrentSection?.();
    return CAPABILITY_REGISTRY[id] ? id : null;
  }

  function capabilityLabel(sectionId, language) {
    const entry=CAPABILITY_REGISTRY[sectionId];
    return entry?.labels?.[language] || entry?.labels?.it || sectionId;
  }

  function detectCapabilitySection(text, language) {
    const n=normalize(text);
    for (const [sectionId, entry] of Object.entries(CAPABILITY_REGISTRY)) {
      const aliases=entry.aliases?.[language] || entry.aliases?.it || [];
      if (hasAny(n, aliases)) return sectionId;
    }
    return null;
  }

  function detectCapabilityQuery(text, language) {
    const n=normalize(text);
    const rules=CAPABILITY_RULES[language] || CAPABILITY_RULES.it;
    const explicitSection=detectCapabilitySection(text, language);
    const currentSection=currentSectionId();
    const pendingCapability=activePendingClarification()?.type==="capability_actions";

    if(pendingCapability) {
      if(explicitSection==="act" || hasAny(n,rules.actions||[])) {
        return {type:"section",section:"act",reason:"capability_followup_act"};
      }
      if(hasAny(n,rules.wholeApp||[]) || hasAny(n,rules.general||[])) {
        return {type:"overview",section:null,reason:"capability_followup_app"};
      }
    }

    if (hasAny(n, rules.actions || [])) {
      if (explicitSection==="act") return {type:"section", section:"act", reason:"explicit_actions"};
      if (currentSection==="act" && !explicitSection) return {type:"section", section:"act", reason:"context_actions"};
      return {type:"ambiguous_actions", section:null, currentSection, reason:"generic_actions"};
    }

    if (hasAny(n, rules.here || [])) {
      return currentSection ? {type:"section", section:currentSection, reason:"here"} : {type:"overview", section:null, reason:"here_without_section"};
    }

    if (explicitSection && hasAny(n, rules.general || [])) return {type:"section", section:explicitSection, reason:"explicit_section"};
    if (hasAny(n, rules.general || [])) return {type:"overview", section:null, reason:"general"};
    return null;
  }

  function formatCapabilityOverview(language) {
    const intro={
      it:"HIRUNDU è organizzata in 5 spazi. Puoi parlare con Aracne in modo naturale:",
      fr:"HIRUNDU est organisé en 5 espaces. Tu peux parler naturellement à ARACNE :",
      en:"HIRUNDU is organised into 5 areas. You can speak naturally to ARACNE:",
      es:"HIRUNDU está organizado en 5 espacios. Puedes hablar con ARACNE de forma natural:"
    }[language] || "";
    const lines=[intro];
    for (const sectionId of ["discover","routes","act","mapSheet","passport"]) {
      const entry=CAPABILITY_REGISTRY[sectionId];
      const first=(entry.actions?.[language] || entry.actions?.it || [])[0] || "";
      lines.push(entry.icon+" "+capabilityLabel(sectionId,language)+" — "+first+".");
    }
    const tail={
      it:"Puoi anche combinare più richieste nella stessa frase. Per esempio: «Parlami di Castro, togli Otranto dal percorso e apri il mio passaporto.»",
      fr:"Tu peux aussi combiner plusieurs demandes dans la même phrase. Par exemple : « Parle-moi de Castro, enlève Otranto du parcours et ouvre mon passeport. »",
      en:"You can also combine several requests in one sentence. For example: “Tell me about Castro, remove Otranto from my route and open my passport.”",
      es:"También puedes combinar varias peticiones en una frase. Por ejemplo: «Háblame de Castro, quita Otranto de la ruta y abre mi pasaporte.»"
    }[language];
    if (tail) lines.push("",tail);
    return lines.join("\n");
  }

  function formatSectionCapabilities(sectionId, language) {
    const entry=CAPABILITY_REGISTRY[sectionId];
    if (!entry) return formatCapabilityOverview(language);
    const intro={
      it:"In "+capabilityLabel(sectionId,language)+" posso aiutarti a:",
      fr:"Dans "+capabilityLabel(sectionId,language)+", je peux t’aider à :",
      en:"In "+capabilityLabel(sectionId,language)+", I can help you:",
      es:"En "+capabilityLabel(sectionId,language)+", puedo ayudarte a:"
    }[language];
    const lines=[entry.icon+" "+intro];
    for (const action of (entry.actions?.[language] || entry.actions?.it || [])) lines.push("• "+action);
    const example=entry.examples?.[language] || entry.examples?.it;
    if (example) {
      const prefix={it:"Esempio",fr:"Exemple",en:"Example",es:"Ejemplo"}[language] || "Example";
      lines.push("",prefix+" : « "+example+" »");
    }
    return lines.join("\n");
  }

  function formatActionsAmbiguity(language) {
    return {
      it:"Quando dici «azioni», intendi le azioni sostenibili nella sezione Agisci, oppure le azioni che Aracne può eseguire in tutta l’app?",
      fr:"Quand tu dis « actions », tu parles des actions durables dans l’onglet Agir, ou des actions qu’ARACNE peut effectuer dans toute l’app ?",
      en:"When you say “actions”, do you mean the sustainable actions in the Act tab, or the actions ARACNE can perform across the whole app?",
      es:"Cuando dices «acciones», ¿te refieres a las acciones sostenibles de la pestaña Actuar o a las acciones que ARACNE puede realizar en toda la app?"
    }[language];
  }

  function capabilitySuggestions(sectionId, language) {
    const entry=CAPABILITY_REGISTRY[sectionId];
    if (!entry) return [];
    return [entry.examples?.[language] || entry.examples?.it].filter(Boolean);
  }
  /* =========================================
     STRUCTURED APP TOOLS v0.7
     The language engine decides WHAT; HIRUNDU bridge decides HOW.
     ========================================= */

  const TOOL_RULES = {
    it:{
      navigate:{
        discover:["apri scopri","vai a scopri","torna a scopri"],
        routes:["apri i percorsi","apri il percorso","mostra il percorso","mostra i percorsi","vai ai percorsi"],
        act:["apri le missioni","mostra le missioni","vai alle missioni","apri agisci","vai ad agisci"],
        mapSheet:["apri la mappa","mostra la mappa","vai alla mappa"],
        passport:["apri il passaporto","apri il mio passaporto","mostra il passaporto","mostra il mio passaporto","apri il mio viaggio","mostra il mio viaggio"]
      },
      journalOpen:["apri il diario","mostra il diario","apri le mie note","mostra le mie note"],
      journalSave:["nota che","salva una nota","aggiungi una nota","registra una nota"],
      routeRemove:["rimuovi","togli","elimina dal percorso","rimuovi dal percorso"],
      routeClear:["svuota il percorso","cancella il percorso","elimina tutte le tappe","azzera il percorso"],
      routeMode:{
        walking:["metti il percorso a piedi","passa a piedi","usa il percorso a piedi"],
        cycling:["metti il percorso in bici","passa alla bici","usa la bici per il percorso"],
        driving:["metti il percorso in auto","passa all auto","usa auto per il percorso","usa lo scooter per il percorso"]
      },
      missionsOpen:["mostra le missioni","mostra le mie missioni","apri le missioni","apri le mie missioni"],
      missionOpen:["apri la missione","mostra la missione","vai alla missione"],
      qrOpen:["apri il qr","mostra il qr","qr della missione","scansiona il qr"],
      status:["quanti punti","i miei punti","mostra i punti","mostra il mio filo verde","filo verde","il mio filo verde","punteggio filo verde"],
      share:{
        route:["condividi il percorso","condividi il mio percorso"],
        act:["condividi le missioni","condividi i punti","condividi il filo verde"],
        trip:["condividi il viaggio","condividi il passaporto"],
        journal:["condividi le note","condividi il diario"]
      },
      maps:["apri google maps","apri maps","lancia google maps","naviga con google maps"]
    },
    fr:{
      navigate:{
        discover:["ouvre decouvrir","va dans decouvrir","retourne a decouvrir"],
        routes:["ouvre les parcours","ouvre le parcours","montre mon parcours","montre mes parcours","va dans parcours"],
        act:["ouvre les missions","montre les missions","va dans les missions","ouvre agir","va dans agir"],
        mapSheet:["ouvre la carte","montre la carte","va sur la carte","affiche la carte"],
        passport:["ouvre mon passeport","montre mon passeport","ouvre mon voyage","montre mon voyage"]
      },
      journalOpen:["ouvre mon journal","montre mon journal","ouvre mes notes","montre mes notes"],
      journalSave:["note que","sauvegarde une note","ajoute une note","enregistre une note"],
      routeRemove:["retire","enleve","supprime du parcours","retire du parcours"],
      routeClear:["vide le parcours","efface le parcours","supprime toutes les etapes","reinitialise le parcours"],
      routeMode:{
        walking:["mets le parcours a pied","passe a pied","fais le parcours a pied"],
        cycling:["mets le parcours a velo","passe en velo","fais le parcours a velo"],
        driving:["mets le parcours en voiture","passe en voiture","fais le parcours en voiture","passe en scooter"]
      },
      missionsOpen:["montre les missions","montre mes missions","ouvre les missions","ouvre mes missions"],
      missionOpen:["ouvre la mission","montre la mission","va sur la mission"],
      qrOpen:["ouvre le qr","montre le qr","qr de la mission","scanne le qr"],
      status:["combien de points","mes points","montre mes points","montre mon filo verde","quel est mon filo verde","filo verde","mon filo verde","score filo verde"],
      share:{
        route:["partage le parcours","partage mon parcours"],
        act:["partage les missions","partage mes points","partage le filo verde"],
        trip:["partage mon voyage","partage mon passeport"],
        journal:["partage mes notes","partage mon journal"]
      },
      maps:["ouvre google maps","ouvre maps","lance google maps","navigue avec google maps"]
    },
    en:{
      navigate:{
        discover:["open discover","go to discover","back to discover"],
        routes:["open routes","open my route","show my route","show routes","go to routes"],
        act:["open missions","show missions","go to missions","open act"],
        mapSheet:["open the map","show the map","go to the map"],
        passport:["open my passport","show my passport","open my trip","show my trip"]
      },
      journalOpen:["open my journal","show my journal","open my notes","show my notes"],
      journalSave:["note that","save a note","add a note","record a note"],
      routeRemove:["remove","remove from route","delete from route","take out"],
      routeClear:["clear the route","empty the route","remove all stops","reset the route"],
      routeMode:{
        walking:["set the route to walking","switch to walking","make the route walking"],
        cycling:["set the route to cycling","switch to bike","make the route cycling"],
        driving:["set the route to driving","switch to car","make the route driving","switch to scooter"]
      },
      missionsOpen:["show missions","show my missions","open missions","open my missions"],
      missionOpen:["open the mission","show the mission","go to the mission"],
      qrOpen:["open the qr","show the qr","mission qr","scan the qr"],
      status:["how many points","my points","show my points","show my filo verde","filo verde","my filo verde","filo verde score"],
      share:{
        route:["share the route","share my route"],
        act:["share missions","share my points","share filo verde"],
        trip:["share my trip","share my passport"],
        journal:["share my notes","share my journal"]
      },
      maps:["open google maps","open maps","launch google maps","navigate with google maps"]
    },
    es:{
      navigate:{
        discover:["abre descubrir","ve a descubrir","vuelve a descubrir"],
        routes:["abre las rutas","abre mi ruta","muestra mi ruta","muestra las rutas","ve a rutas"],
        act:["abre las misiones","muestra las misiones","ve a las misiones","abre actuar"],
        mapSheet:["abre el mapa","muestra el mapa","ve al mapa"],
        passport:["abre mi pasaporte","muestra mi pasaporte","abre mi viaje","muestra mi viaje"]
      },
      journalOpen:["abre mi diario","muestra mi diario","abre mis notas","muestra mis notas"],
      journalSave:["anota que","guarda una nota","anade una nota","registra una nota"],
      routeRemove:["quita","elimina de la ruta","quita de la ruta","borra de la ruta"],
      routeClear:["vacia la ruta","borra la ruta","elimina todas las etapas","reinicia la ruta"],
      routeMode:{
        walking:["pon la ruta a pie","cambia a pie","haz la ruta a pie"],
        cycling:["pon la ruta en bici","cambia a bici","haz la ruta en bici"],
        driving:["pon la ruta en coche","cambia a coche","haz la ruta en coche","cambia a scooter"]
      },
      missionsOpen:["muestra las misiones","muestra mis misiones","abre las misiones","abre mis misiones"],
      missionOpen:["abre la mision","muestra la mision","ve a la mision"],
      qrOpen:["abre el qr","muestra el qr","qr de la mision","escanea el qr"],
      status:["cuantos puntos","mis puntos","muestra mis puntos","muestra mi filo verde","filo verde","mi filo verde","puntuacion filo verde"],
      share:{
        route:["comparte la ruta","comparte mi ruta"],
        act:["comparte las misiones","comparte mis puntos","comparte filo verde"],
        trip:["comparte mi viaje","comparte mi pasaporte"],
        journal:["comparte mis notas","comparte mi diario"]
      },
      maps:["abre google maps","abre maps","lanza google maps","navega con google maps"]
    }
  };

  const TOOL_TEXT = {
    it:{
      navigate:"Apro la sezione richiesta.",
      journalSaved:"Nota salvata nel Diario di Aracne.",
      routeRemoved:names=>"Ho rimosso dal percorso: "+names+".",
      routeCleared:"Ho svuotato il percorso.",
      routeMode:mode=>"Ho impostato il percorso su "+mode+".",
      missionOpened:"Apro la missione.",
      qrOpened:"Apro la verifica QR della missione.",
      missionRequired:"Dimmi quale missione vuoi aprire o verificare con QR.",
      shared:"Preparo la condivisione.",
      maps:"Apro il percorso in Google Maps.",
      status:data=>"Filo Verde: "+data.greenScore+"/100 · Aracne Points: "+data.points+" · Missioni oggi: "+data.claimsToday+"/"+data.missionsTotal+".",
      toolFail:"Non sono riuscita a completare questa azione."
    },
    fr:{
      navigate:"J’ouvre la section demandée.",
      journalSaved:"Note enregistrée dans le Journal d’Aracne.",
      routeRemoved:names=>"J’ai retiré du parcours : "+names+".",
      routeCleared:"J’ai vidé le parcours.",
      routeMode:mode=>"J’ai réglé le parcours sur "+mode+".",
      missionOpened:"J’ouvre la mission.",
      qrOpened:"J’ouvre la validation QR de la mission.",
      missionRequired:"Dis-moi quelle mission tu veux ouvrir ou valider par QR.",
      shared:"Je prépare le partage.",
      maps:"J’ouvre le parcours dans Google Maps.",
      status:data=>"Filo Verde : "+data.greenScore+"/100 · Aracne Points : "+data.points+" · Missions aujourd’hui : "+data.claimsToday+"/"+data.missionsTotal+".",
      toolFail:"Je n’ai pas pu terminer cette action."
    },
    en:{
      navigate:"I’m opening the requested section.",
      journalSaved:"Note saved in the Aracne Journal.",
      routeRemoved:names=>"I removed from the route: "+names+".",
      routeCleared:"I cleared the route.",
      routeMode:mode=>"I set the route to "+mode+".",
      missionOpened:"I’m opening the mission.",
      qrOpened:"I’m opening the mission QR validation.",
      missionRequired:"Tell me which mission you want to open or validate by QR.",
      shared:"I’m preparing the share action.",
      maps:"I’m opening the route in Google Maps.",
      status:data=>"Filo Verde: "+data.greenScore+"/100 · Aracne Points: "+data.points+" · Missions today: "+data.claimsToday+"/"+data.missionsTotal+".",
      toolFail:"I couldn’t complete that action."
    },
    es:{
      navigate:"Abro la sección solicitada.",
      journalSaved:"Nota guardada en el Diario de Aracne.",
      routeRemoved:names=>"He quitado de la ruta: "+names+".",
      routeCleared:"He vaciado la ruta.",
      routeMode:mode=>"He configurado la ruta en "+mode+".",
      missionOpened:"Abro la misión.",
      qrOpened:"Abro la validación QR de la misión.",
      missionRequired:"Dime qué misión quieres abrir o validar por QR.",
      shared:"Preparo la acción para compartir.",
      maps:"Abro la ruta en Google Maps.",
      status:data=>"Filo Verde: "+data.greenScore+"/100 · Aracne Points: "+data.points+" · Misiones hoy: "+data.claimsToday+"/"+data.missionsTotal+".",
      toolFail:"No he podido completar esta acción."
    }
  };

  function toolText(language,key,...args){
    const pack=TOOL_TEXT[language]||TOOL_TEXT.it;
    const value=pack[key];
    return typeof value==="function" ? value(...args) : value;
  }

  function allToolLanguagePhrases(language){
    const r=TOOL_RULES[language]||TOOL_RULES.it;
    const out=[];
    Object.values(r.navigate||{}).forEach(list=>out.push(...list));
    out.push(...(r.journalOpen||[]),...(r.journalSave||[]),...(r.routeRemove||[]),...(r.routeClear||[]));
    Object.values(r.routeMode||{}).forEach(list=>out.push(...list));
    out.push(...(r.missionsOpen||[]),...(r.missionOpen||[]),...(r.qrOpen||[]),...(r.status||[]),...(r.maps||[]));
    Object.values(r.share||{}).forEach(list=>out.push(...list));
    return out;
  }

  function extractJournalNote(text,language){
    let value=String(text||"").trim();
    const patterns={
      it:/^\s*(?:nota che|salva una nota|aggiungi una nota|registra una nota)\s*[:\-]?\s*/i,
      fr:/^\s*(?:note que|sauvegarde une note|ajoute une note|enregistre une note)\s*[:\-]?\s*/i,
      en:/^\s*(?:note that|save a note|add a note|record a note)\s*[:\-]?\s*/i,
      es:/^\s*(?:anota que|guarda una nota|añade una nota|anade una nota|registra una nota)\s*[:\-]?\s*/i
    };
    value=value.replace(patterns[language]||patterns.it,"").trim();
    return value;
  }

  function detectToolRequests(text,language,places=[]){
    const n=normalize(text);
    const r=TOOL_RULES[language]||TOOL_RULES.it;
    const requests=[];
    const add=(name,args,pos)=>{
      if(pos<0)return;
      const key=name+":"+JSON.stringify(args||{});
      if(requests.some(x=>x.key===key))return;
      requests.push({name,args:args||{},pos,key});
    };

    for(const [sheet,phrases] of Object.entries(r.navigate||{})){
      const pos=earliestMatch(n,phrases);
      if(pos>=0)add("navigate",{sheet},pos);
    }

    let pos=earliestMatch(n,r.journalOpen||[]);
    if(pos>=0)add("journal_open",{},pos);

    pos=earliestMatch(n,r.journalSave||[]);
    if(pos>=0){
      const note=extractJournalNote(text,language);
      if(note)add("journal_save",{text:note},pos);
    }

    pos=earliestMatch(n,r.routeClear||[]);
    if(pos>=0)add("route_clear",{},pos);

    pos=earliestMatch(n,r.routeRemove||[]);
    if(pos>=0 && places.length){
      const afterCommand=places.filter(place=>{
        const placePos=findPlacePosition(n,place);
        return placePos>=pos;
      });
      const targets=afterCommand.length?afterCommand:places;
      add("route_remove",{placeIds:targets.map(p=>p.id).filter(Boolean)},pos);
    }

    for(const [mode,phrases] of Object.entries(r.routeMode||{})){
      const modePos=earliestMatch(n,phrases);
      if(modePos>=0)add("route_mode",{mode},modePos);
    }

    pos=earliestMatch(n,r.missionsOpen||[]);
    if(pos>=0)add("navigate",{sheet:"act"},pos);

    pos=earliestMatch(n,r.missionOpen||[]);
    if(pos>=0)add("mission_open",{query:text},pos);

    pos=earliestMatch(n,r.qrOpen||[]);
    if(pos>=0)add("qr_open",{query:text},pos);

    pos=earliestMatch(n,r.status||[]);
    if(pos>=0)add("status",{},pos);

    for(const [scope,phrases] of Object.entries(r.share||{})){
      const sharePos=earliestMatch(n,phrases);
      if(sharePos>=0)add("share",{scope},sharePos);
    }

    pos=earliestMatch(n,r.maps||[]);
    if(pos>=0)add("maps_open",{},pos);

    return requests
      .sort((a,b)=>a.pos-b.pos)
      .map(({key,...request})=>request);
  }

  async function executeToolRequest(request,analysis){
    if(!request||!bridge?.runTool)return {ok:false};

    try{
      const result=await bridge.runTool(
        request.name,
        request.args||{},
        {
          language:analysis.language,
          composite:(analysis.intents.length+(analysis.toolRequests?.length||0))>1
        }
      );

      const data=result?.data||{};

      if(!result?.ok){
        if(result?.code==="mission_required")return {ok:false,text:toolText(analysis.language,"missionRequired")};
        return {ok:false,text:result?.text||toolText(analysis.language,"toolFail")};
      }

      if(request.name==="status")return {ok:true,text:toolText(analysis.language,"status",data)};
      if(request.name==="journal_save")return {ok:true,text:toolText(analysis.language,"journalSaved")};
      if(request.name==="route_remove")return {ok:true,text:toolText(analysis.language,"routeRemoved",(data.names||[]).join(", "))};
      if(request.name==="route_clear")return {ok:true,text:toolText(analysis.language,"routeCleared")};
      if(request.name==="route_mode")return {ok:true,text:toolText(analysis.language,"routeMode",data.modeLabel||request.args.mode)};
      if(request.name==="mission_open")return {ok:true,text:toolText(analysis.language,"missionOpened")};
      if(request.name==="qr_open")return {ok:true,text:toolText(analysis.language,"qrOpened")};
      if(request.name==="share")return {ok:true,text:toolText(analysis.language,"shared")};
      if(request.name==="maps_open")return {ok:true,text:toolText(analysis.language,"maps")};
      if(request.name==="navigate"||request.name==="journal_open")return {ok:true,text:toolText(analysis.language,"navigate")};

      return {ok:true,text:result?.text||""};
    }catch(error){
      console.warn("[Aracne tool]",request.name,error);
      return {ok:false,text:toolText(analysis.language,"toolFail")};
    }
  }

  function earliestMatch(text, phrases) {
    let best=-1;

    for(const raw of phrases||[]) {
      const p=normalize(raw);
      if(!p)continue;

      let from=0;
      while(from<=text.length-p.length) {
        const i=text.indexOf(p,from);
        if(i<0)break;

        const before=i===0?" ":text[i-1];
        const after=(i+p.length)>=text.length?" ":text[i+p.length];

        if(before===" " && after===" ") {
          if(best<0 || i<best)best=i;
          break;
        }

        from=i+1;
      }
    }

    return best;
  }

  function hasAny(text, phrases) {
    return earliestMatch(text,phrases)>=0;
  }

  function detectTextLanguage(text) {
    const n=normalize(text);
    if(!n)return null;
    const scores={it:0,fr:0,en:0,es:0};

    for(const code of LANGS) {
      const l=LEXICON[code];
      const groups=[l.scope,l.tell,l.see,l.routeNouns,l.routeVerbs,l.nearbyMe,l.nearbyPlace,l.add,l.open,l.compare,allToolLanguagePhrases(code),allCapabilityLanguagePhrases(code),allKnowledgeAspectPhrases(code)];
      for(const group of groups) {
        for(const raw of group||[]) {
          const p=normalize(raw);
          if(p && earliestMatch(n,[p])>=0)scores[code]+=p.includes(" ")?3:1;
        }
      }
    }

    let best=null,bestScore=0,second=0;
    for(const code of LANGS) {
      const score=scores[code];
      if(score>bestScore){second=bestScore;bestScore=score;best=code;}
      else if(score>second)second=score;
    }

    return bestScore>=2 && bestScore>second ? best : null;
  }

  function replaceNumberWords(text, language) {
    let n=normalize(text);
    const map=NUMBER_WORDS[language]||{};
    for(const [word,value] of Object.entries(map)) {
      n=n.replace(new RegExp("\\b"+word+"\\b","g"),String(value));
    }
    return n;
  }

  function parseDurationHours(text, language) {
    const n=replaceNumberWords(text,language);

    if(/\b(mezza giornata|demi journee|half day|medio dia)\b/.test(n))return 4;
    if(/\b(giornata intera|journee entiere|full day|dia entero)\b/.test(n))return 8;

    let m=n.match(/\b(\d+(?:[\.,]\d+)?)\s*(?:h|ore|ora|heures?|heure|hours?|hour|horas?|hora)\b/);
    if(m) {
      let hours=parseFloat(m[1].replace(",","."));
      if(/\b(et demie|e mezza|and a half|y media)\b/.test(n))hours+=0.5;
      return hours;
    }

    m=n.match(/\b(\d+(?:[\.,]\d+)?)\s*(?:min|mins|minutes?|minuti|minutos?)\b/);
    if(m)return parseFloat(m[1].replace(",","."))/60;

    return null;
  }

  function detectThemes(text, language) {
    const n=normalize(text), l=LEXICON[language]||LEXICON.it, out=[];
    for(const [theme,phrases] of Object.entries(l.themes||{})) {
      if(hasAny(n,phrases))out.push(theme);
    }
    return out;
  }

  function detectMode(text, language) {
    const n=normalize(text), l=LEXICON[language]||LEXICON.it;
    for(const mode of ["cycling","walking","driving"]) {
      if(hasAny(n,l.modes?.[mode]||[]))return mode;
    }
    return null;
  }

  function splitClauses(text, language) {
    let n=normalize(text);
    const ctx=CONTEXT_RULES[language]||CONTEXT_RULES.it;

    for(const raw of ctx.clauseBreaks||[]) {
      const sep=normalize(raw);
      if(!sep)continue;
      n=n.split(" "+sep+" ").join(" | ");
    }

    return n
      .split("|")
      .map(part=>part.trim())
      .filter(Boolean);
  }

  function clauseSnapshot(clause, language) {
    const l=LEXICON[language]||LEXICON.it;
    const ctx=CONTEXT_RULES[language]||CONTEXT_RULES.it;
    const places=(getPlaces(clause)||[])
      .map(place=>({place,pos:findPlacePosition(clause,place)}))
      .filter(item=>item.pos>=0)
      .sort((a,b)=>a.pos-b.pos)
      .map(item=>item.place);
    const territories=(territoryMatches(clause,language)||[])
      .map(hydrateTerritoryMatch)
      .filter(Boolean);

    const intents=[];
    const add=name=>{if(!intents.includes(name))intents.push(name);};

    if(hasAny(clause,l.tell))add("tell");
    if(hasAny(clause,l.see))add("see_place");
    if(hasAny(clause,l.nearbyPlace)||hasAny(clause,ctx.nearby))add("near_place");
    if(hasAny(clause,l.nearbyMe))add("near_me");
    if(hasAny(clause,l.add))add("add");
    if(hasAny(clause,l.open))add("open");
    if(hasAny(clause,l.compare))add("compare");

    const routeNoun=hasAny(clause,l.routeNouns);
    const routeVerb=hasAny(clause,l.routeVerbs);
    if(routeNoun || (routeVerb && places.length))add("route");

    return {
      text:clause,
      places,
      territories,
      intents,
      between:hasAny(clause,ctx.between||[])
    };
  }

  function estimateMinimumRouteHours(places, mode=null) {
    if(!Array.isArray(places)||places.length<2)return null;

    let km=0;
    for(let i=1;i<places.length;i++) {
      km+=distanceKm(places[i-1],places[i]);
    }

    // Straight-line distance -> conservative road/path distance.
    km*=1.18;

    const speed=
      mode==="walking" ? 4.5
      : mode==="cycling" ? 15
      : 48;

    const raw=km/speed;
    return Math.max(0.5,Math.ceil(raw*2)/2);
  }

  function placeSearchCandidates(place) {
    const candidates=[];
    const add=value=>{
      const n=normalize(value);
      if(n.length>=3 && !candidates.includes(n))candidates.push(n);
    };

    add(place?.name||"");
    add(String(place?.id||"").replace(/_/g," "));

    String(place?.name||"")
      .split(",")
      .forEach(add);

    const words=normalize(place?.name||"").split(" ").filter(Boolean);
    if(words.length>=2) {
      add(words.slice(0,2).join(" "));
      add(words.slice(-2).join(" "));
    }

    for(const word of words) {
      if(word.length>=5)add(word);
    }

    return candidates.sort((a,b)=>b.length-a.length);
  }

  function findPlacePosition(text, place) {
    let best=-1;
    for(const candidate of placeSearchCandidates(place)) {
      const i=earliestMatch(text,[candidate]);
      if(i>=0 && (best<0 || i<best))best=i;
    }
    return best;
  }

  function assignTargets(text, cues, places) {
    const mentions=places
      .map(place=>({place,pos:findPlacePosition(text,place)}))
      .filter(x=>x.pos>=0)
      .sort((a,b)=>a.pos-b.pos);

    const byPosition=[...cues].sort((a,b)=>a.pos-b.pos);
    const targets={};

    for(let i=0;i<byPosition.length;i++) {
      const cue=byPosition[i];
      const end=i+1<byPosition.length ? byPosition[i+1].pos : text.length+1;

      let local=mentions
        .filter(x=>x.pos>=cue.pos && x.pos<end)
        .map(x=>x.place);

      // Route clauses often inherit the place introduced just before:
      // "Tell me about Gallipoli and build a 3-hour route".
      if(cue.name==="route" && !local.length) {
        const previous=mentions.filter(x=>x.pos<cue.pos);
        if(previous.length)local=[previous[previous.length-1].place];
      }

      targets[cue.name]=[...new Map(local.map(p=>[p.id||p.name,p])).values()];
    }

    return targets;
  }

  function buildBridgeText(text, analysis) {
    const routePlaces=analysis.targets?.route||[];
    let output=routePlaces.map(placeName).join(" ");

    if(analysis.durationHours!=null)output+=" "+analysis.durationHours+" h";
    for(const theme of analysis.themes||[])output+=" "+theme;
    if(analysis.mode)output+=" "+analysis.mode;

    return output.trim() || normalize(text);
  }

  function analyze(text) {
    const n=normalize(text);
    const explicitPlaces=getPlaces(text);
    const language=
      detectTextLanguage(text)
      ||
      normalizeLanguageCode(sessionState.language)
      ||
      normalizeLanguageCode(bridge?.getVoiceLanguage?.())
      ||
      normalizeLanguageCode(bridge?.getLanguage?.())
      ||
      "it";

    const l=LEXICON[language]||LEXICON.it;
    const ctx=CONTEXT_RULES[language]||CONTEXT_RULES.it;
    const capabilityQuery=detectCapabilityQuery(text,language);
    const knowledgeAspect=detectKnowledgeAspect(text,language);
    const specificPlaces=exactNamedPlaces(text);
    let territories=territoryMatches(text,language);
    const territoryFollowup=
      !!knowledgeAspect
      ||
      hasAny(n,ctx.nearby||[])
      ||
      hasAny(n,ctx.contextPlace||[]);

    if(
      !territories.length
      &&
      territoryFollowup
      &&
      !specificPlaces.length
      &&
      !explicitPlaces.length
      &&
      sessionState.lastTerritoryId
    ){
      const remembered=territoryById(sessionState.lastTerritoryId);
      if(remembered)territories=[{id:remembered.id,entry:remembered,score:1,remembered:true}];
    }
    const primaryTerritory=territories[0]?.entry
      ? {id:territories[0].id,...territories[0].entry}
      : (territories[0]?.id ? territoryById(territories[0].id) : null);

    let durationHours=parseDurationHours(text,language);
    let themes=detectThemes(text,language);
    let mode=detectMode(text,language);

    let resolvedPending=null;
    const pending=sessionState.pendingClarification;

    if(pending?.type==="route_origin") {
      const pendingPlaces=placesByIds(pending.placeIds||[]);
      const chosen=explicitPlaces.find(place=>(pending.placeIds||[]).includes(place.id));
      const chooseBoth=hasAny(n,ctx.both||[]);

      if(chosen || chooseBoth) {
        const ordered=chosen
          ? [chosen,...pendingPlaces.filter(place=>place.id!==chosen.id)]
          : pendingPlaces;

        resolvedPending={
          type:"route_origin",
          places:ordered
        };

        if(durationHours==null && pending.durationHours!=null) {
          durationHours=pending.durationHours;
        }
        if(!themes.length && pending.themes?.length) {
          themes=[...pending.themes];
        }
        if(!mode && pending.mode) {
          mode=pending.mode;
        }
      }
    }

    // A refusal must also apply to route cues recovered from later clauses.
    // Keep this conservative: a contradictory request needs clarification,
    // never an unsolicited route mutation.
    const routeRefused=hasAny(n,[
      "ne me fais pas de parcours","ne fais pas de parcours","je ne veux pas de parcours","pas de parcours","sans parcours",
      "non farmi un percorso","non fare un percorso","non voglio un percorso","niente percorso","senza percorso",
      "do not make a route","don t make a route","i do not want a route","i don t want a route","no route","without a route",
      "no hagas una ruta","no quiero una ruta","sin ruta","ninguna ruta"
    ]);
    const cues=[];
    const addIntent=(name,pos,score=1)=>{
      if(name==="route" && routeRefused)return;
      if(pos<0)return;
      const existing=cues.find(x=>x.name===name);
      if(existing){
        existing.score=Math.max(existing.score,score);
        existing.pos=Math.min(existing.pos,pos);
        return;
      }
      cues.push({name,pos,score});
    };

    addIntent("scope",earliestMatch(n,l.scope),9);
    if(capabilityQuery)addIntent("scope",0,10);
    addIntent("tell",earliestMatch(n,l.tell),8);
    addIntent("see_place",earliestMatch(n,l.see),8);
    addIntent("near_me",earliestMatch(n,l.nearbyMe),9);
    addIntent("near_place",earliestMatch(n,l.nearbyPlace),8);
    addIntent("near_place",earliestMatch(n,ctx.nearby),7);
    addIntent("add",earliestMatch(n,l.add),8);
    addIntent("open",earliestMatch(n,l.open),7);
    addIntent("compare",earliestMatch(n,l.compare),8);

    if(resolvedPending) {
      addIntent("route",0,10);
    }

    const routeNounPos=earliestMatch(n,l.routeNouns);
    const routeVerbPos=earliestMatch(n,l.routeVerbs);
    const routeFollowupPos=earliestMatch(n,ctx.routeFollowup);

    const shorter=hasAny(n,ctx.shorter);
    const longer=hasAny(n,ctx.longer);
    const themeModifier=
      hasAny(n,ctx.nature) ? "nature"
      : hasAny(n,ctx.sea) ? "sea"
      : hasAny(n,ctx.culture) ? "culture"
      : hasAny(n,ctx.food) ? "food"
      : null;

    if(themeModifier)themes=[themeModifier];

    const routeIsFollowup=
      !!resolvedPending
      ||
      (
        !!sessionState.lastRoute
        &&
        (
        routeFollowupPos>=0
        || shorter
        || longer
        || !!themeModifier
        || hasAny(n,ctx.contextPlace)
        || (
          routeNounPos<0
          && routeVerbPos<0
          && (durationHours!=null || !!mode)
        )
      )
      );

    if(durationHours==null && sessionState.lastRoute?.durationHours!=null) {
      if(shorter)durationHours=Math.max(1,Number(sessionState.lastRoute.durationHours)-1);
      if(longer)durationHours=Math.min(12,Number(sessionState.lastRoute.durationHours)+1);
    }

    const routeContext=
      durationHours!=null
      || themes.length
      || explicitPlaces.length
      || mode
      || routeFollowupPos>=0
      || shorter
      || longer
      || !!themeModifier;

    if(
      (routeNounPos>=0 && (routeVerbPos>=0 || routeContext))
      ||
      (routeVerbPos>=0 && routeContext)
      ||
      (
        routeIsFollowup
        &&
        routeContext
      )
    ) {
      const positions=[routeNounPos,routeVerbPos,routeFollowupPos].filter(x=>x>=0);
      addIntent("route",positions.length?Math.min(...positions):0,9);
    }

    let places=resolvedPending?.places?.length
      ? [...resolvedPending.places]
      : [...explicitPlaces];

    const needsRememberedPlace=
      !places.length
      &&
      (
        cues.some(x=>x.name==="near_place")
        ||
        hasAny(n,ctx.contextPlace)
        ||
        (
          cues.some(x=>x.name==="route")
          &&
          (
            !!sessionState.lastRoute
            ||
            sessionState.lastPlaceIds.length>0
          )
        )
      );

    if(needsRememberedPlace) {
      const ids=
        cues.some(x=>x.name==="route") && sessionState.lastRoute
          ? (
              sessionState.lastRoute.originPlaceIds?.length
                ? sessionState.lastRoute.originPlaceIds
                : (
                    sessionState.lastRoute.placeIds?.length
                      ? sessionState.lastRoute.placeIds
                      : sessionState.lastPlaceIds
                  )
            )
          : sessionState.lastPlaceIds;

      places=placesByIds(ids);
    }

    // A named place or territory with no explicit action is informational.
    if(!cues.length && (places.length || primaryTerritory))addIntent("tell",0,4);
    if(!cues.length && knowledgeAspect && sessionState.lastTerritoryId)addIntent("tell",0,4);

    if(cues.some(x=>x.name==="compare")) {
      const i=cues.findIndex(x=>x.name==="tell");
      if(i>=0)cues.splice(i,1);
    }

    if(cues.length>1) {
      const i=cues.findIndex(x=>x.name==="scope");
      if(i>=0)cues.splice(i,1);
    }

    const order={tell:10,see_place:15,compare:18,near_me:20,near_place:20,add:30,open:35,route:40,scope:50};
    cues.sort((a,b)=>(order[a.name]||99)-(order[b.name]||99)||a.pos-b.pos);

    const clauses=splitClauses(text,language);
    const clauseAnalyses=clauses.map(clause=>clauseSnapshot(clause,language));

    for(const clause of clauseAnalyses) {
      for(const intentName of clause.intents) {
        if(!cues.some(cue=>cue.name===intentName)) {
          addIntent(intentName,Math.max(0,n.indexOf(clause.text)),8);
        }
      }
    }

    // A capability/help question is meta-conversation, not an app command.
    // It must never create a route or trigger a tool merely because the
    // sentence mentions a tab such as "Parcours".
    if(capabilityQuery) {
      cues.splice(0,cues.length,{name:"scope",pos:0,score:10});
    }

    cues.sort((a,b)=>(order[a.name]||99)-(order[b.name]||99)||a.pos-b.pos);

    const analysis={
      language,
      normalized:n,
      explicitPlaces,
      specificPlaces,
      places,
      territories,
      territory:primaryTerritory,
      infoTerritory:null,
      infoPlaces:[],
      semanticPlan:null,
      routeTerritories:[],
      routeLabels:[],
      intents:cues.map(x=>x.name),
      cues,
      durationHours,
      themes,
      mode,
      clauses:clauseAnalyses,
      routeExactSequence:false,
      capabilityQuery,
      knowledgeAspect,
      currentSection:currentSectionId(),
      contextUsed:needsRememberedPlace || routeIsFollowup || !!themeModifier || shorter || longer || routeFollowupPos>=0,
      modifiers:{shorter,longer,theme:themeModifier},
      clarification:null
    };

    analysis.targets=assignTargets(n,cues,places);

    // Prefer clause-local places only when that clause owns a single intent.
    // A multi-intent sentence must keep the positional targets computed above,
    // otherwise a final route list leaks back into an earlier "parlami di...".
    for(const clause of clauseAnalyses) {
      if(clause.intents.length===1 && clause.places.length) {
        analysis.targets[clause.intents[0]]=[...clause.places];
      }

      if(clause.intents.includes("route") && clause.between) {
        const routeLocal=
          clause.intents.length===1 && clause.places.length
            ? clause.places
            : (analysis.targets.route||[]);

        if(routeLocal.length>=2) {
          analysis.targets.route=[...routeLocal];
          analysis.routeExactSequence=true;
        }
      }
    }

    // Semantic plan: cities are extracted in spoken order before any POI logic.
    // This is deliberately punctuation-independent and keeps a city-level subject
    // separate from a later multi-city route.
    analysis.semanticPlan=buildSemanticPlan(text,language,cues);
    analysis.infoTerritory=analysis.semanticPlan.infoTerritory||null;
    analysis.routeTerritories=[...(analysis.semanticPlan.routeTerritories||[])];
    analysis.routeLabels=[...(analysis.semanticPlan.routeLabels||[])];

    if(analysis.infoTerritory){
      analysis.infoPlaces=territoryPois(analysis.infoTerritory).slice(0,8);

      for(const intentName of ["tell","see_place","near_place"]){
        if(analysis.intents.includes(intentName) && !(analysis.targets[intentName]?.length)){
          const representative=representativePlaceForTerritory(analysis.infoTerritory);
          if(representative)analysis.targets[intentName]=[representative];
        }
      }
    }

    if(
      analysis.intents.includes("route")
      &&
      analysis.semanticPlan.routePlaces?.length>=2
    ){
      analysis.targets.route=[...analysis.semanticPlan.routePlaces];
      analysis.routeExactSequence=true;
    }

    const toolRequests=capabilityQuery ? [] : detectToolRequests(text,language,places);

    // Structured tool positions act as clause boundaries for conversational
    // intents. This prevents a later tool target from leaking into an earlier
    // "tell me about..." clause.
    for(const cue of cues) {
      const laterToolPositions=toolRequests
        .map(request=>request.pos)
        .filter(pos=>pos>cue.pos)
        .sort((a,b)=>a-b);

      if(!laterToolPositions.length)continue;
      const boundary=laterToolPositions[0];
      const currentTargets=analysis.targets?.[cue.name]||[];

      if(currentTargets.length) {
        const scoped=currentTargets.filter(place=>{
          const pos=findPlacePosition(n,place);
          return pos>=cue.pos && pos<boundary;
        });

        if(scoped.length)analysis.targets[cue.name]=scoped;
      }
    }

    // If the old generic "open/show" cue starts at the same point as a
    // structured app tool ("open passport", "show my Filo Verde", etc.),
    // the structured tool owns that verb. A separate earlier "open Otranto"
    // remains a POI action.
    const openIndex=cues.findIndex(cue=>cue.name==="open");
    if(openIndex>=0) {
      const openCue=cues[openIndex];
      const sameTool=toolRequests.some(request=>Math.abs(request.pos-openCue.pos)<=2);
      if(sameTool)cues.splice(openIndex,1);
    }

    // Commands that operate on the CURRENT route must not be reinterpreted
    // as requests to CREATE a new route merely because they contain
    // "route / parcours / percorso / ruta".
    const routeUtility=toolRequests.some(request=>
      ["route_remove","route_clear","route_mode","maps_open"].includes(request.name)
      ||
      (request.name==="share" && request.args?.scope==="route")
      ||
      (request.name==="navigate" && request.args?.sheet==="routes")
    );
    if(routeUtility && routeVerbPos<0) {
      const routeIndex=cues.findIndex(cue=>cue.name==="route");
      if(routeIndex>=0)cues.splice(routeIndex,1);
    }

    // "Mets le parcours à vélo" uses "mets", which is also an old synonym
    // for adding a POI. The structured mode tool wins.
    if(toolRequests.some(request=>request.name==="route_mode")) {
      const addIndex=cues.findIndex(cue=>cue.name==="add");
      if(addIndex>=0)cues.splice(addIndex,1);
    }

    // A journal command mentioning a place should save the note, not
    // automatically turn into "tell me about that place".
    if(
      toolRequests.some(request=>request.name==="journal_save")
      &&
      earliestMatch(n,l.tell)<0
    ) {
      const tellIndex=cues.findIndex(cue=>cue.name==="tell");
      if(tellIndex>=0)cues.splice(tellIndex,1);
    }

    analysis.intents=cues.map(x=>x.name);

    if(resolvedPending?.places?.length) {
      analysis.targets.route=[...resolvedPending.places];
      analysis.resolvedClarification=resolvedPending.type;
    }

    // Context fallback for route origin: reuse the previous origin, or the last discussed place.
    if(
      analysis.intents.includes("route")
      &&
      !(analysis.targets.route?.length)
    ) {
      const rememberedRouteIds=
        sessionState.lastRoute?.originPlaceIds?.length
          ? sessionState.lastRoute.originPlaceIds
          : (sessionState.lastRoute?.placeIds||[]);

      const rememberedIds=
        rememberedRouteIds.length
          ? rememberedRouteIds
          : sessionState.lastPlaceIds;

      if(rememberedIds.length) {
        analysis.targets.route=placesByIds(rememberedIds);
      }
    }

    // Context fallback for "and around?".
    if(
      analysis.intents.includes("near_place")
      &&
      !(analysis.targets.near_place?.length)
      &&
      sessionState.lastPlaceIds.length
    ) {
      analysis.targets.near_place=placesByIds(sessionState.lastPlaceIds);
    }

    // Inherit route settings only for a genuine contextual follow-up.
    // A new explicit route request must start clean.
    if(analysis.intents.includes("route") && routeIsFollowup && sessionState.lastRoute) {
      if(durationHours==null && sessionState.lastRoute.durationHours!=null) {
        analysis.durationHours=sessionState.lastRoute.durationHours;
      }
      if(!themes.length && sessionState.lastRoute.themes?.length) {
        analysis.themes=[...sessionState.lastRoute.themes];
      }
      if(!mode && sessionState.lastRoute.mode) {
        analysis.mode=sessionState.lastRoute.mode;
      }
    }

    const routeTargets=analysis.targets.route||[];
    const hasOriginCue=hasAny(n,ctx.origin);
    const hasIncludeCue=hasAny(n,ctx.include);
    const hasBetweenCue=hasAny(n,ctx.between||[]);

    if(
      analysis.intents.includes("route")
      &&
      analysis.durationHours==null
      &&
      analysis.routeExactSequence
      &&
      routeTargets.length>=2
    ) {
      analysis.estimatedMinimumRouteHours=estimateMinimumRouteHours(routeTargets,analysis.mode);
    }

    if(
      analysis.intents.includes("route")
      &&
      explicitPlaces.length>=2
      &&
      routeTargets.length>=2
      &&
      !hasOriginCue
      &&
      !hasIncludeCue
      &&
      !hasBetweenCue
      &&
      !resolvedPending
    ) {
      analysis.clarification={
        type:"route_origin",
        placeIds:routeTargets.map(place=>place.id),
        text:contextText(language,"clarifyOrigin",routeTargets.slice(0,3).map(placeName))
      };
    }

    const placeRequired=cues.some(x=>["tell","see_place","near_place","add","open"].includes(x.name));
    if(placeRequired && !places.length && !analysis.territory && !analysis.clarification && !toolRequests.length) {
      analysis.clarification={
        type:"place",
        placeIds:[],
        text:contextText(language,"clarifyPlace")
      };
    }

    const contextOnlyRequest=
      !explicitPlaces.length
      &&
      (
        routeFollowupPos>=0
        || shorter
        || longer
        || !!themeModifier
        || hasAny(n,ctx.contextPlace)
        || hasAny(n,ctx.nearby)
      );

    if(
      contextOnlyRequest
      &&
      !sessionState.lastPlaceIds.length
      &&
      !sessionState.lastTerritoryId
      &&
      !sessionState.lastRoute
      &&
      !analysis.clarification
    ) {
      analysis.clarification={
        type:"missing_context",
        placeIds:[],
        text:contextText(language,"noContext")
      };
    }

    analysis.intents=cues.map(x=>x.name);
    analysis.toolRequests=toolRequests;
    analysis.bridgeText=buildBridgeText(text,analysis);
    return analysis;
  }

  function rememberTurn(userText, analysis, routeInfo=null) {
    sessionState.pendingClarification=null;
    sessionState.turn+=1;
    sessionState.language=analysis.language||sessionState.language;
    sessionState.lastIntents=[...(analysis.intents||[])];
    const rememberedTerritory=analysis.infoTerritory||analysis.territory;
    if(rememberedTerritory?.id)sessionState.lastTerritoryId=rememberedTerritory.id;

    let focusPlaces=[];

    for(const key of ["tell","see_place","near_place","open","route","add"]) {
      const candidates=analysis.targets?.[key]||[];
      if(candidates.length){
        focusPlaces=candidates;
        if(key!=="add")break;
      }
    }

    if(focusPlaces.length) {
      sessionState.lastPlaceIds=focusPlaces.map(place=>place.id).filter(Boolean);
    } else if(analysis.places?.length) {
      sessionState.lastPlaceIds=analysis.places.map(place=>place.id).filter(Boolean);
    }

    let routeSelectedPlaceIds=[];

    if(analysis.intents.includes("route")) {
      const originPlaces=
        analysis.targets?.route?.length
          ? analysis.targets.route
          : placesByIds(sessionState.lastPlaceIds);

      const selectedPlaces=
        routeInfo?.selected?.length
          ? routeInfo.selected
          : originPlaces;

      const originPlaceIds=originPlaces.map(place=>place.id).filter(Boolean);
      const selectedPlaceIds=selectedPlaces.map(place=>place.id).filter(Boolean);
      routeSelectedPlaceIds=[...selectedPlaceIds];

      sessionState.lastRoute={
        placeIds:[...originPlaceIds],
        originPlaceIds:[...originPlaceIds],
        selectedPlaceIds:[...selectedPlaceIds],
        durationHours:
          routeInfo?.hours!=null
            ? routeInfo.hours
            : analysis.durationHours,
        themes:[...(analysis.themes||[])],
        mode:routeInfo?.detectedMode||analysis.mode||null
      };

      if(originPlaceIds.length) {
        sessionState.lastPlaceIds=[originPlaceIds[0]];
      } else if(selectedPlaceIds.length) {
        sessionState.lastPlaceIds=[selectedPlaceIds[0]];
      }
    }

    recordConversationTurn(userText,analysis,{
      resultType:analysis.intents.includes("route")?"route":"answer",
      resultPoiIds:routeSelectedPlaceIds.length
        ? routeSelectedPlaceIds
        : [...(sessionState.lastPlaceIds||[])],
      resultTerritoryId:analysis.territory?.id||sessionState.lastTerritoryId||null,
      resultIntent:analysis.intents?.[0]||null
    });

    return getContext();
  }

  function formatRouteResult(info, language) {
    const labels=SECTION_LABELS[language]||SECTION_LABELS.it;
    const modes=MODE_LABELS[language]||MODE_LABELS.it;
    const metrics={
      it:{available:"Tempo disponibile",distance:"Distanza totale",travel:"Tempo di viaggio"},
      fr:{available:"Temps disponible",distance:"Distance totale",travel:"Temps de trajet"},
      en:{available:"Available time",distance:"Total distance",travel:"Travel time"},
      es:{available:"Tiempo disponible",distance:"Distancia total",travel:"Tiempo de viaje"}
    }[language]||{};
    const lines=[];
    const selected=info?.selected||[];

    if(selected.length)lines.push(labels.stops+": "+selected.map(placeName).join(" → "));
    if(info?.detectedMode)lines.push(labels.mode+": "+(modes[info.detectedMode]||info.detectedMode));
    if(info?.hours!=null && Number(info.hours)>0)lines.push((metrics.available||labels.duration)+": "+Number(info.hours)+" h");
    if(Number(info?.distanceKm)>0)lines.push((metrics.distance||"Distance")+": "+Number(info.distanceKm).toFixed(1)+" km");
    if(Number(info?.travelMinutes)>0)lines.push((metrics.travel||"Travel time")+": "+Math.round(Number(info.travelMinutes))+" min");

    return lines.join("\n");
  }


  /* =========================================
     REPONSE DETAILLEE POI
     ========================================= */

  function enrichPlace(place, knowledgeAspect) {
    const knowledge=formatKnowledgePlace(place,knowledgeAspect||null,lang());
    if(knowledge)return knowledge;

    const output = [];
    const summary = placeSummary(place);
    if (summary) output.push(summary);

    const pack = I18N[lang()] || I18N.it;
    if (place?.cat && pack.category?.[place.cat]) output.push(pack.category[place.cat]+".");
    if (Number.isFinite(Number(place?.mins))) output.push(pack.mins(Number(place.mins))+".");
    if (Array.isArray(place?.tags) && place.tags.length) output.push(place.tags.slice(0,2).join(", ")+".");
    return output.join(" ");
  }


  /* =========================================
     AUTOUR D'UN POI
     ========================================= */

  function nearbyFrom(
    origin,
    limit = 5
  ) {

    if (
      !hasCoords(origin)
    ) {

      return {
        pois: [],
        businesses: []
      };
    }


    const pois = (

      bridge
        ?.getPlaces
        ?.()

      ||

      []

    )

      .filter(
        place =>
          place.id !== origin.id
          &&
          hasCoords(place)
      )

      .map(
        place => ({
          ...place,

          _d:
            distanceKm(
              origin,
              place
            )
        })
      )

      .sort(
        (a, b) =>
          a._d - b._d
      )

      .slice(
        0,
        limit
      );


    /*
     * Optionnel :
     * fonctionne dès que nous ajoutons
     * une vraie base de commerces.
     */

    const businesses = (

      bridge
        ?.getBusinesses
        ?.()

      ||

      []

    )

      .filter(
        hasCoords
      )

      .map(
        business => ({
          ...business,

          _d:
            distanceKm(
              origin,
              business
            )
        })
      )

      .sort(
        (a, b) =>
          a._d - b._d
      )

      .slice(
        0,
        4
      );


    return {
      pois,
      businesses
    };
  }


  function formatNearby(
    origin,
    data
  ) {

    if (
      !hasCoords(origin)
    ) {

      return tr(
        "noCoords"
      );
    }


    const lines = [

      tr(
        "nearbyIntro",
        placeName(origin)
      )
    ];


    data.pois.forEach(
      place => {

        lines.push(
          `• ${placeName(place)} — ${place._d.toFixed(1)} km`
        );
      }
    );


    if (
      data.businesses.length
    ) {

      lines.push(
        "",
        tr(
          "businessesIntro"
        )
      );


      data.businesses.forEach(
        business => {

          lines.push(

            `• ${business.name} — ${business._d.toFixed(1)} km`

            +

            (
              business.type
                ? ` · ${business.type}`
                : ""
            )
          );
        }
      );
    }


    return lines.join(
      "\n"
    );
  }


  /* =========================================
     PLUSIEURS POI
     ========================================= */

  function multiAnswer(
    places
  ) {

    const lines = [
      tr("multiIntro")
    ];


    places
      .slice(0, 4)
      .forEach(
        place => {

          lines.push(

            `• ${placeName(place)} — ${enrichPlace(place)}`
          );
        }
      );


    return lines.join(
      "\n"
    );
  }


  /* =========================================
     MOTEUR
     ========================================= */

  async function execute(
    text
  ) {

    text=String(text||"").trim();

    if(!text) {
      return {
        ok:false,
        intent:"empty",
        intents:["empty"],
        language:lang(),
        text:tr("empty")
      };
    }

    const analysis=analyze(text);
    const previousLanguage=activeRequestLanguage;
    activeRequestLanguage=analysis.language;

    try {
      const labels=SECTION_LABELS[analysis.language]||SECTION_LABELS.it;
      const sections=[];
      const actions=[];
      let ok=true;
      let routeInfo=null;

      if(analysis.clarification) {
        sessionState.language=analysis.language||sessionState.language;
        sessionState.pendingClarification={
          type:analysis.clarification.type,
          placeIds:[...(analysis.clarification.placeIds||[])],
          durationHours:analysis.durationHours,
          themes:[...(analysis.themes||[])],
          mode:analysis.mode||null,
          language:analysis.language,
          createdTurn:sessionState.turn
        };

        return {
          ok:false,
          intent:"clarify",
          intents:[...(analysis.intents||[])],
          language:analysis.language,
          clarification:analysis.clarification,
          analysis,
          context:getContext(),
          text:analysis.clarification.text
        };
      }

      if(
        analysis.capabilityQuery
        &&
        analysis.intents.every(intent=>intent==="scope")
        &&
        !(analysis.toolRequests?.length)
      ) {
        if(String(analysis.capabilityQuery.reason||"").startsWith("capability_followup_")) {
          sessionState.pendingClarification=null;
        }
        if(analysis.capabilityQuery.type==="ambiguous_actions") {
          sessionState.language=analysis.language||sessionState.language;
          sessionState.pendingClarification={
            type:"capability_actions",
            placeIds:[],
            language:analysis.language,
            createdTurn:sessionState.turn
          };
          return {
            ok:false,
            intent:"clarify_capability",
            intents:["scope"],
            language:analysis.language,
            analysis,
            capability:analysis.capabilityQuery,
            context:getContext(),
            text:formatActionsAmbiguity(analysis.language)
          };
        }

        const sectionId=analysis.capabilityQuery.section;
        const capabilityText=sectionId
          ? formatSectionCapabilities(sectionId,analysis.language)
          : formatCapabilityOverview(analysis.language);

        return {
          ok:true,
          intent:sectionId?"capabilities_section":"capabilities_overview",
          intents:["scope"],
          language:analysis.language,
          analysis,
          capability:analysis.capabilityQuery,
          suggestions:sectionId?capabilitySuggestions(sectionId,analysis.language):[],
          context:getContext(),
          text:capabilityText
        };
      }

      if(analysis.intents.includes("scope")) {
        return {
          ok:true,
          intent:"scope",
          intents:["scope"],
          language:analysis.language,
          analysis,
          text:tr("scope")
        };
      }

      const appAnswer=appKnowledge(text);
      if(appAnswer && !(analysis.toolRequests?.length) && !analysis.intents.some(x=>["route","add","open","near_me","near_place"].includes(x))) {
        sections.push(appAnswer);
      }

      const comparePlaces=analysis.targets.compare?.length ? analysis.targets.compare : analysis.places;
      const tellPlaces=analysis.infoPlaces?.length
        ? analysis.infoPlaces
        : (analysis.targets.tell?.length ? analysis.targets.tell : analysis.places);
      const territoryForInfo=
        analysis.infoTerritory
        ||
        (
          analysis.territory
          &&
          !(analysis.specificPlaces?.length)
            ? analysis.territory
            : null
        );

      if(analysis.intents.includes("compare") && comparePlaces.length>=2) {
        sections.push(labels.compare+"\n"+multiAnswer(comparePlaces));
      } else if(analysis.intents.includes("tell") && territoryForInfo) {
        sections.push(
          labels.about+" "+territoryName(territoryForInfo)+"\n"+
          formatTerritoryKnowledge(territoryForInfo,analysis.knowledgeAspect,analysis.language)
        );
      } else if(analysis.intents.includes("tell") && tellPlaces.length) {
        if(tellPlaces.length===1) {
          const place=tellPlaces[0];
          sections.push(labels.about+" "+placeName(place)+"\n"+enrichPlace(place,analysis.knowledgeAspect));
        } else {
          sections.push(multiAnswer(tellPlaces));
        }
      }

      const seePlaces=analysis.infoPlaces?.length
        ? analysis.infoPlaces
        : (analysis.targets.see_place?.length
          ? analysis.targets.see_place
          : analysis.places);
      const seeTerritory=
        analysis.infoTerritory
        ||
        (
          analysis.territory
          &&
          !(analysis.specificPlaces?.length)
            ? analysis.territory
            : null
        );

      if(
        analysis.intents.includes("see_place")
        &&
        seeTerritory
      ) {
        const body=[
          formatTerritoryHighlights(seeTerritory,analysis.language),
          formatTerritoryPoiList(seeTerritory,analysis.language,{
            themes:analysis.themes,
            aspect:analysis.knowledgeAspect
          })
        ].filter(Boolean).join("\n\n");
        sections.push(labels.see+" · "+territoryName(seeTerritory)+"\n"+body);
      } else if(analysis.intents.includes("see_place") && seePlaces.length) {
        const origin=seePlaces[0];
        const data=nearbyFrom(origin,4);
        const intrinsic=whatToSeeKnowledge(origin,analysis.language);
        const nearby=formatNearby(origin,data);
        const body=[intrinsic,nearby].filter(Boolean).join("\n\n");
        sections.push(labels.see+" · "+placeName(origin)+"\n"+body);
      }

      if(analysis.intents.includes("near_me")) {
        await bridge?.nearMe?.();
        sections.push(labels.nearby+"\n"+tr("nearMe"));
        actions.push("near_me");
      }

      const nearbyPlaces=analysis.infoPlaces?.length
        ? analysis.infoPlaces
        : (analysis.targets.near_place?.length ? analysis.targets.near_place : analysis.places);
      const nearbyTerritory=
        analysis.infoTerritory
        ||
        (
          analysis.territory
          &&
          !(analysis.specificPlaces?.length)
            ? analysis.territory
            : null
        );
      if(
        analysis.intents.includes("near_place")
        &&
        nearbyTerritory
      ) {
        const linked=formatTerritoryPoiList(nearbyTerritory,analysis.language,{
          themes:analysis.themes,
          aspect:analysis.knowledgeAspect
        });
        if(linked)sections.push(labels.nearby+" · "+territoryName(nearbyTerritory)+"\n"+linked);
        actions.push("near_place");
      } else if(analysis.intents.includes("near_place") && nearbyPlaces.length) {
        const origin=nearbyPlaces[0];
        const data=nearbyFrom(origin);
        sections.push(labels.nearby+"\n"+formatNearby(origin,data));
        actions.push("near_place");
      }

      if(analysis.intents.includes("add") && !analysis.intents.includes("route")) {
        const addPlaces=analysis.targets.add?.length ? analysis.targets.add : analysis.places;
        if(!addPlaces.length) {
          sections.push(tr("noPlace"));
          ok=false;
        } else {
          for(const place of addPlaces.slice(0,4)) {
            await bridge?.addPlace?.(place.id,place);
          }
          sections.push(labels.action+"\n"+tr("add",addPlaces.slice(0,4).map(placeName).join(", ")));
          actions.push("add");
        }
      }

      const openPlaces=analysis.targets.open?.length ? analysis.targets.open : analysis.places;
      if(analysis.intents.includes("open") && openPlaces.length) {
        await bridge?.openPlace?.(openPlaces[0].id,openPlaces[0]);
        if(!analysis.intents.includes("tell")) {
          sections.push(labels.action+"\n"+tr("open",placeName(openPlaces[0])));
        }
        actions.push("open");
      }

      // Route is deliberately executed last so informational intentions are composed first.
      if(analysis.intents.includes("route")) {
        const routeTargets=
          analysis.targets?.route?.length
            ? analysis.targets.route
            : analysis.places;

        const result=await bridge?.createRouteFromText?.(
          analysis.bridgeText,
          {
            keepAssistantOpen:analysis.intents.length>1,
            intents:analysis.intents,
            routeRequest:{
              placeIds:routeTargets.map(place=>place.id).filter(Boolean),
              territoryIds:(analysis.routeTerritories||[]).map(territory=>territory.id).filter(Boolean),
              routeLabels:[...(analysis.routeLabels||[])],
              durationHours:analysis.durationHours,
              themes:[...(analysis.themes||[])],
              mode:analysis.mode||null,
              exactPlaceSequence:!!analysis.routeExactSequence
            }
          }
        );

        if(result?.ok) {
          routeInfo=result.info||null;
          const routeText=formatRouteResult(result.info,analysis.language) || result.text || result.spokenText || "";
          sections.push(labels.route+(routeText?"\n"+routeText:""));
          actions.push("route");
        } else {
          sections.push(labels.route+"\n"+tr("routeFail"));
          ok=false;
        }
      }

      if(analysis.toolRequests?.length) {
        for(const request of analysis.toolRequests) {
          // Route creation already applies its requested mode directly.
          if(request.name==="route_mode" && analysis.intents.includes("route"))continue;

          const result=await executeToolRequest(request,analysis);
          if(result?.text)sections.push(labels.action+"\n"+result.text);
          if(result?.ok)actions.push("tool:"+request.name);
          else ok=false;
        }
      }

      if(!sections.length) {
        if(analysis.territory && !(analysis.specificPlaces?.length))sections.push(formatTerritoryKnowledge(analysis.territory,analysis.knowledgeAspect,analysis.language));
        else if(analysis.places.length>=2)sections.push(multiAnswer(analysis.places));
        else if(analysis.places.length===1)sections.push(enrichPlace(analysis.places[0]));
        else if(!(analysis.toolRequests?.length)) {
          sections.push(tr("unknown"));
          ok=false;
        }
      }

      const context=rememberTurn(text,analysis,routeInfo);

      return {
        ok,
        intent:(analysis.intents.length+(analysis.toolRequests?.length||0))>1?"composed":(analysis.intents[0]||(analysis.toolRequests?.[0]?.name)||"unknown"),
        intents:analysis.intents,
        actions,
        language:analysis.language,
        analysis,
        semanticPlan:analysis.semanticPlan,
        context,
        places:analysis.places,
        text:sections.filter(Boolean).join("\n\n")
      };

    } finally {
      activeRequestLanguage=previousLanguage;
    }
  }


  /* =========================================
     AFFICHAGE
     ========================================= */

  function show(text) {

    bridge
      ?.showResult
      ?.(
        tr("title"),
        text
      );
  }


  /* =========================================
     VOIX
     ========================================= */

  function stopSpeaking() {
    speechRunId += 1;

    try {
      window
        .speechSynthesis
        ?.cancel();
    } catch (error) {}
  }


  function speak(text, languageOverride=null, lifecycle={}) {

    if (
      !text
      ||
      !("speechSynthesis" in window)
      ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      return null;
    }

    stopSpeaking();

    const runId=++speechRunId;
    const utterance=new SpeechSynthesisUtterance(text);
    const speechLanguage=
      normalizeLanguageCode(languageOverride)
      ||
      lang();

    utterance.lang=
      LOCALES[speechLanguage]
      ||
      LOCALES.it;

    utterance.rate=0.96;

    const voices=
      window
        .speechSynthesis
        .getVoices?.()
      ||
      [];

    const voice=
      voices.find(item=>item.lang===utterance.lang)
      ||
      voices.find(item=>
        (item.lang||"")
          .toLowerCase()
          .startsWith(speechLanguage)
      );

    if(voice)utterance.voice=voice;

    const invoke=(name,event)=>{
      if(runId!==speechRunId)return;
      try{lifecycle?.[name]?.(event);}catch(error){
        console.warn("[Aracne speech lifecycle]",name,error);
      }
    };

    utterance.onstart=event=>invoke("onStart",event);
    utterance.onend=event=>invoke("onEnd",event);
    utterance.onerror=event=>invoke("onError",event);

    try{
      window.speechSynthesis.speak(utterance);
      return {runId,utterance};
    }catch(error){
      invoke("onError",error);
      return null;
    }
  }


  /* =========================================
     QUESTION
     ========================================= */

  async function ask(
    text = getTranscript(),
    options = {}
  ) {

    /*
     * Evite qu'Aracne
     * écoute sa propre voix.
     */
    try {
      bridge
        ?.stopRecognition
        ?.();
    } catch (error) {}

    updateContextIndicator({thinking:true});

    const result=
      await execute(
        text
      );

    /*
     * Toujours écrire la réponse AVANT toute fermeture
     * de panneau ou synthèse vocale.
     */
    if(options.show!==false){
      show(result.text);
    }

    /*
     * Le carnet est écrit immédiatement, avant la voix.
     * Ainsi une fermeture de modal, un changement d'onglet
     * ou une interruption de speech ne peut pas perdre la réponse.
     */
    try{
      bridge?.saveAnswer?.(result);
    }catch(error){
      console.warn("[Aracne] saveAnswer",error);
    }

    let speechStarted=false;
    let speechFinished=false;
    let speechHandle=null;

    if(options.speak!==false){
      speechHandle=speak(
        result.text,
        result.language,
        {
          onStart:()=>{
            speechStarted=true;
            try{bridge?.speechStart?.(result);}catch(error){
              console.warn("[Aracne] speechStart",error);
            }
          },
          onEnd:()=>{
            speechFinished=true;
            try{bridge?.speechEnd?.(result);}catch(error){
              console.warn("[Aracne] speechEnd",error);
            }
          },
          onError:()=>{
            speechFinished=true;
            if(options.reveal!==false){
              try{bridge?.afterAnswer?.(result);}catch(error){
                console.warn("[Aracne] afterAnswer",error);
              }
            }
          }
        }
      );
    }

    /*
     * Fallback mobile : certains WebKit ne déclenchent pas
     * toujours onstart/onend de façon fiable.
     */
    if(options.reveal!==false){
      if(!speechHandle){
        try{bridge?.afterAnswer?.(result);}catch(error){
          console.warn("[Aracne] afterAnswer",error);
        }
      }else{
        // Safari/iOS may occasionally miss speech events. Keep the answer
        // visible; only move to the map at an estimated END, never at start.
        const words=String(result.text||"").trim().split(/\s+/).filter(Boolean).length;
        const fallbackEndMs=Math.max(4200,Math.min(26000,Math.round((words/2.15)*1000)+1200));

        const fallbackRunId=speechHandle?.runId;

        setTimeout(()=>{
          if(fallbackRunId!==speechRunId)return;
          if(!speechStarted && !speechFinished){
            speechStarted=true;
            try{bridge?.speechStart?.(result);}catch(error){
              console.warn("[Aracne] speechStart fallback",error);
            }
          }
        },900);

        setTimeout(()=>{
          if(fallbackRunId!==speechRunId)return;
          if(!speechFinished){
            speechFinished=true;
            try{bridge?.speechEnd?.(result);}catch(error){
              console.warn("[Aracne] speechEnd fallback",error);
            }
          }
        },fallbackEndMs);
      }
    }

    updateContextIndicator();

    return result;
  }


  /* =========================================
     EXPLICATION DANS LE MODAL
     ========================================= */

  function injectScopeHint() {

    const body =
      document.querySelector(
        ".assistant-body"
      );


    if (

      !body

      ||

      document.getElementById(
        "aracneScopeHint"
      )

    ) {

      return;
    }


    const hint =
      document.createElement(
        "div"
      );


    hint.id =
      "aracneScopeHint";


    hint.style.cssText =

      "margin:10px 0 14px;"

      +

      "padding:12px 14px;"

      +

      "border-radius:14px;"

      +

      "background:rgba(40,120,232,.08);"

      +

      "font-size:.82rem;"

      +

      "line-height:1.4";


    hint.textContent =
      tr("scope");


    const status =
      document.getElementById(
        "assistantStatus"
      );


    body.insertBefore(
      hint,
      status || body.firstChild
    );
  }


  /* =========================================
     BOUTON
     ========================================= */

  function contextThemeLabel(theme,language) {
    const labels={
      it:{nature:"Natura",sea:"Mare",culture:"Cultura",food:"Sapori",sunset:"Tramonto"},
      fr:{nature:"Nature",sea:"Mer",culture:"Culture",food:"Saveurs",sunset:"Coucher de soleil"},
      en:{nature:"Nature",sea:"Sea",culture:"Culture",food:"Food",sunset:"Sunset"},
      es:{nature:"Naturaleza",sea:"Mar",culture:"Cultura",food:"Sabores",sunset:"Atardecer"}
    };
    return labels[language]?.[theme]||theme;
  }

  function ensureContextIndicator() {
    const body=document.querySelector(".assistant-body");
    if(!body)return null;

    let indicator=document.getElementById("aracneContextIndicator");
    if(indicator)return indicator;

    indicator=document.createElement("div");
    indicator.id="aracneContextIndicator";
    indicator.style.cssText=
      "display:none;"
      +"margin:0 0 10px;"
      +"padding:8px 11px;"
      +"border-radius:999px;"
      +"width:max-content;"
      +"max-width:100%;"
      +"background:rgba(138,35,135,.08);"
      +"border:1px solid rgba(138,35,135,.14);"
      +"font-size:.78rem;"
      +"line-height:1.25;"
      +"white-space:nowrap;"
      +"overflow:hidden;"
      +"text-overflow:ellipsis;"
      +"transition:opacity .2s ease,transform .2s ease;";

    const status=document.getElementById("assistantStatus");
    body.insertBefore(indicator,status||body.firstChild);
    return indicator;
  }

  function updateContextIndicator(options={}) {
    const indicator=ensureContextIndicator();
    if(!indicator)return;

    if(options.thinking) {
      indicator.textContent="🕸️ "+tr("thinking");
      indicator.style.display="block";
      indicator.style.opacity="0.7";
      indicator.style.transform="translateY(1px)";
      return;
    }

    const context=getContext();
    const route=context.lastRoute;
    const ids=route?.originPlaceIds?.length
      ? route.originPlaceIds
      : context.lastPlaceIds;
    const places=placesByIds(ids||[]);
    const parts=[];
    const sectionId=currentSectionId();
    if(sectionId)parts.push(capabilityLabel(sectionId,lang()));

    if(places.length)parts.push(places.slice(0,2).map(placeName).join(" → "));
    if(route?.durationHours!=null)parts.push(route.durationHours+" h");
    if(route?.themes?.length)parts.push(route.themes.slice(0,2).map(t=>contextThemeLabel(t,lang())).join(" · "));
    if(route?.mode)parts.push((MODE_LABELS[lang()]||MODE_LABELS.it)[route.mode]||route.mode);

    if(!parts.length) {
      indicator.style.display="none";
      indicator.textContent="";
      return;
    }

    indicator.textContent="🕸️ "+parts.join(" · ");
    indicator.style.display="block";
    indicator.style.opacity="1";
    indicator.style.transform="translateY(0)";
  }


  function updateUI() {

    const span =
      askButton
        ?.querySelector(
          "span"
        );


    if (span) {

      span.textContent =
        tr("ask");
    }


    const hint =
      document.getElementById(
        "aracneScopeHint"
      );


    if (hint) {

      hint.textContent =
        tr("scope");
    }
  }


  function ensureButton() {

    const actions =
      document.querySelector(
        ".assistant-actions"
      );


    if (!actions) {
      return;
    }


    askButton =
      document.getElementById(
        "assistantAsk"
      );


    if (!askButton) {

      askButton =
        document.createElement(
          "button"
        );


      askButton.id =
        "assistantAsk";


      askButton.type =
        "button";


      askButton.className =
        "assistant-action route";


      askButton.innerHTML =

        '<i class="fa-solid fa-wand-magic-sparkles"></i>'

        +

        "<span></span>";


      actions.appendChild(
        askButton
      );
    }


    if (
      !askButton
        .dataset
        .boundV3
    ) {

      askButton.addEventListener(
        "click",

        async () => {

          const span =
            askButton
              .querySelector(
                "span"
              );


          askButton.disabled =
            true;


          if (span) {

            span.textContent =
              tr("thinking");
          }


          try {

            await ask();

          } catch (error) {

            console.error("[Aracne] request failed",error);

            const message=toolText(lang(),"toolFail");
            try{
              bridge?.showResult?.(tr("title"),message);
            }catch(displayError){
              console.warn("[Aracne] error display failed",displayError);
            }

            try{
              bridge?.toast?.(message);
            }catch(toastError){}

          } finally {

            askButton.disabled =
              false;


            updateUI();
          }
        }
      );


      askButton.dataset.boundV3 =
        "1";
    }


    updateUI();
  }


  /* =========================================
     CONNECTION
     ========================================= */

  function connect(
    appBridge
  ) {

    bridge =
      appBridge;


    currentLanguage =
      lang();


    ensureButton();

    injectScopeHint();

    ensureContextIndicator();
    updateContextIndicator();


    document
      .querySelectorAll(
        ".voice-lang"
      )
      .forEach(
        button => {

          if (
            button.dataset
              .aracneV3Lang
          ) {

            return;
          }


          button.addEventListener(
            "click",

            () => {

              currentLanguage =

                button
                  .dataset
                  .voiceLang

                ||

                currentLanguage;


              setTimeout(
                updateUI,
                0
              );
            }
          );


          button.dataset
            .aracneV3Lang =
            "1";
        }
      );


    console.info(
      `[Aracne Intelligence] v${VERSION} connectée à HIRUNDU`
    );


    return true;
  }


  /* =========================================
     API
     ========================================= */

  window.AracneIntelligence = {

    version:
      VERSION,

    connect,

    ask,

    speak,

    stopSpeaking,

    execute,

    analyze,

    detectTools: text => {
      const language=detectTextLanguage(text)||lang();
      return detectToolRequests(text,language,getPlaces(text));
    },

    capabilities: () => ({
      currentSection:currentSectionId(),
      sections:Object.keys(CAPABILITY_REGISTRY)
    }),

    detectCapabilities: text => {
      const language=detectTextLanguage(text)||lang();
      return detectCapabilityQuery(text,language);
    },

    detectLanguage: detectTextLanguage,

    knowledgeFor: id => {
      const place=(bridge?.getPlaces?.()||[]).find(item=>item.id===id);
      return place ? knowledgeEntry(place) : null;
    },

    knowledgeStats: () => {
      try{return window.AracneKnowledgeBase?.stats?.()||null;}catch(error){return null;}
    },

    territoriesFor: text => {
      const language=detectTextLanguage(text)||lang();
      return territoryMatches(text,language);
    },

    territoryForPoi: id => {
      try{return window.AracneKnowledgeBase?.territoryForPoi?.(id)||null;}catch(error){return null;}
    },

    knowledgeQuality: id => {
      try{return window.AracneKnowledgeBase?.quality?.(id)||null;}catch(error){return null;}
    },

    context: getContext,

    resetContext,

    status: () => ({

      version:
        VERSION,

      connected:
        !!bridge,

      language:
        lang(),

      places:
        bridge
          ?.getPlaces
          ?.()
          ?.length
        ||
        0,

      businesses:
        bridge
          ?.getBusinesses
          ?.()
          ?.length
        ||
        0,

      knowledge:
        (()=>{try{return window.AracneKnowledgeBase?.stats?.()||null;}catch(error){return null;}})()
    })
  };


  if (
    window
      .aracneIntelligenceBridge
  ) {

    connect(
      window
        .aracneIntelligenceBridge
    );
  }

})();
