(() => {
  "use strict";

  const DATA = {
    "version": "1.0.0",
    "updated": "2026-09-15",
    "languages": [
      "it",
      "fr",
      "en",
      "es"
    ],
    "policy": {
      "sourcePriority": [
        "institutional",
        "official-tourism",
        "protected-area",
        "curated-tourism"
      ],
      "dynamicFacts": "Opening hours, prices, events and temporary access conditions must be treated as volatile and verified before being presented as current.",
      "legendRule": "Myths and traditions are explicitly labelled as such and are never presented as established historical fact.",
      "coverage": "All 50 HIRUNDU POIs have a knowledge record. Records marked legacy-pending are intentionally cautious until the inherited POI label is field-verified.",
      "qualityLevels": {
        "high": "Specific institutional/official or high-quality territorial source supports the POI.",
        "medium": "Reliable territorial source supports the place and its core characteristics.",
        "legacy-pending": "POI retained for app compatibility, but exact inherited label or historical identification still requires verification."
      }
    },
    "sources": {
      "italia-otranto-castle": {
        "title": "Aragonese Castle, Otranto",
        "publisher": "Italia.it",
        "type": "official-tourism",
        "url": "https://www.italia.it/en/puglia/otranto/monuments/aragonese-castle"
      },
      "visit-badisco": {
        "title": "Porto Badisco",
        "publisher": "Visit Puglia",
        "type": "curated-tourism",
        "url": "https://visit.puglia.it/en/porto-badisco"
      },
      "visit-cervi": {
        "title": "Grotta dei Cervi",
        "publisher": "Visit Puglia",
        "type": "curated-tourism",
        "url": "https://visit.puglia.it/en/grotta-dei-cervi"
      },
      "visit-zinzulusa": {
        "title": "Grotta Zinzulusa",
        "publisher": "Visit Puglia",
        "type": "curated-tourism",
        "url": "https://visit.puglia.it/en/zinzulusa-cave"
      },
      "wwf-cesine": {
        "title": "Le Cesine",
        "publisher": "WWF Italia",
        "type": "protected-area",
        "url": "https://www.wwf.it/dove-interveniamo/il-nostro-lavoro-in-italia/oasi/le-cesine/"
      },
      "nardo-porto-selvaggio": {
        "title": "Parco Naturale di Porto Selvaggio",
        "publisher": "Comune di Nardò",
        "type": "institutional",
        "url": "https://www.comune.nardo.le.it/informazione/parco-naturale-di-porto-selvaggio/"
      },
      "fai-cerrate": {
        "title": "Abbazia di Santa Maria di Cerrate",
        "publisher": "FAI – Fondo per l'Ambiente Italiano",
        "type": "institutional",
        "url": "https://fondoambiente.it/luoghi/abbazia-di-santa-maria-di-cerrate/"
      },
      "mic-copertino": {
        "title": "Castello di Copertino",
        "publisher": "Ministero della Cultura / Direzione regionale Musei Puglia",
        "type": "institutional",
        "url": "https://museipuglia.cultura.gov.it/musei/castello-di-copertino/"
      },
      "visit-galatina": {
        "title": "Basilica di Santa Caterina d'Alessandria",
        "publisher": "Visit Puglia",
        "type": "curated-tourism",
        "url": "https://visit.puglia.it/en/basilicas-and-sanctuaries-of-puglia"
      },
      "italia-lecce-city": {
        "title": "Lecce",
        "publisher": "Italia.it",
        "type": "official-tourism",
        "url": "https://www.italia.it/en/puglia/lecce"
      },
      "italia-otranto-city": {
        "title": "Otranto",
        "publisher": "Italia.it",
        "type": "official-tourism",
        "url": "https://www.italia.it/en/puglia/otranto"
      },
      "italia-gallipoli-city": {
        "title": "Gallipoli",
        "publisher": "Italia.it",
        "type": "official-tourism",
        "url": "https://www.italia.it/en/puglia/lecce/gallipoli"
      },
      "italia-nardo-city": {
        "title": "Nardò",
        "publisher": "Italia.it",
        "type": "official-tourism",
        "url": "https://www.italia.it/it/puglia/nardo"
      },
      "italia-castro-city": {
        "title": "Castro",
        "publisher": "Italia.it",
        "type": "official-tourism",
        "url": "https://www.italia.it/en/puglia/castro"
      },
      "italia-galatina-city": {
        "title": "Galatina",
        "publisher": "Italia.it",
        "type": "official-tourism",
        "url": "https://www.italia.it/it/puglia/lecce/galatina"
      },
      "visit-copertino-city": {
        "title": "Copertino",
        "publisher": "Visit Puglia",
        "type": "curated-tourism",
        "url": "https://visit.puglia.it/en/copertino"
      },
      "italia-manduria-city": {
        "title": "Manduria",
        "publisher": "Italia.it",
        "type": "official-tourism",
        "url": "https://www.italia.it/it/puglia/manduria"
      },
      "italia-ostuni-city": {
        "title": "Ostuni",
        "publisher": "Italia.it",
        "type": "official-tourism",
        "url": "https://www.italia.it/en/puglia/brindisi/ostuni"
      },
      "visitpuglia-otranto-guide": {
        "title": "Otranto: what to do and see, beaches, nature, history",
        "publisher": "Visit Puglia",
        "type": "curated-tourism",
        "url": "https://visit.puglia.it/en/otranto"
      },
      "visitpuglia-bauxite": {
        "title": "Cava di Bauxite Otranto",
        "publisher": "Visit Puglia",
        "type": "curated-tourism",
        "url": "https://visit.puglia.it/it/cava-di-bauxite"
      },
      "italia-palascia": {
        "title": "Faro di Punta Palascìa",
        "publisher": "Italia.it",
        "type": "official-tourism",
        "url": "https://www.italia.it/fr/pouilles/otranto/phare-de-punta-palascia"
      },
      "parco-otranto-leuca-itinerari": {
        "title": "Itinerari nel Parco Costa Otranto – Santa Maria di Leuca e Bosco di Tricase",
        "publisher": "Parco Naturale Regionale Costa Otranto – Santa Maria di Leuca e Bosco di Tricase",
        "type": "protected-area",
        "url": "https://www.sentierinelparco.it/gli-itinerari/"
      },
      "parco-otranto-leuca-comuni": {
        "title": "I comuni del Parco",
        "publisher": "Parco Naturale Regionale Costa Otranto – Santa Maria di Leuca e Bosco di Tricase",
        "type": "protected-area",
        "url": "https://www.parcootrantoleuca.it/pagina191381_i-comuni-del-parco.html"
      },
      "italia-cammino-salento": {
        "title": "Cammino del Salento: da Lecce a Leuca",
        "publisher": "Italia.it",
        "type": "official-tourism",
        "url": "https://www.italia.it/it/puglia/cosa-fare/cammino-salento-6-tappe-lecce-leuca"
      },
      "visitpuglia-portomiggiano": {
        "title": "Porto Miggiano",
        "publisher": "Visit Puglia",
        "type": "curated-tourism",
        "url": "https://visit.puglia.it/en/porto-miggiano-beach"
      },
      "italia-santacesarea": {
        "title": "Santa Cesarea Terme",
        "publisher": "Italia.it",
        "type": "official-tourism",
        "url": "https://www.italia.it/fr/pouilles/santa-cesarea-terme"
      },
      "tourpuglia-acquaviva": {
        "title": "Cala dell'Acquaviva",
        "publisher": "TourPuglia",
        "type": "curated-tourism",
        "url": "https://tour.puglia.it/en/things-to-see/provincia-di-lecce/comuni/diso/beaches/cala-dellacquaviva"
      },
      "tricase-caprarica": {
        "title": "Caprarica del Capo",
        "publisher": "Tricase Destinazione Autentica",
        "type": "institutional-tourism",
        "url": "https://tricaseautentica.it/caprarica-del-capo/"
      },
      "visitpuglia-leuca": {
        "title": "Santa Maria di Leuca",
        "publisher": "Visit Puglia",
        "type": "curated-tourism",
        "url": "https://visit.puglia.it/en/santa-maria-di-leuca"
      },
      "ugento-park": {
        "title": "Parco Naturale Regionale Litorale di Ugento",
        "publisher": "Parco Naturale Regionale Litorale di Ugento / Comune di Ugento",
        "type": "protected-area",
        "url": "https://www.parcolitoralediugento.it/"
      },
      "gallipoli-park": {
        "title": "Parco naturale regionale Isola di S. Andrea e litorale di Punta Pizzo",
        "publisher": "Comune di Gallipoli",
        "type": "institutional",
        "url": "https://www.comune.gallipoli.le.it/item/parco-naturale-regionale-isola-di-s-andrea-e-litorale-di-punta-pizzo"
      },
      "visitgallipoli-puntasuina": {
        "title": "Punta della Suina",
        "publisher": "Visit Gallipoli",
        "type": "curated-tourism",
        "url": "https://www.visit-gallipoli.com/en/spiagge/punta-della-suina/"
      },
      "visitnardo-marinas": {
        "title": "Marinas: Santa Maria al Bagno, Santa Caterina, Sant'Isidoro",
        "publisher": "Visit Nardò / Comune di Nardò",
        "type": "institutional-tourism",
        "url": "https://www.visitnardo.it/en/beauty/points-of-interest/marinas"
      },
      "visitnardo-fiume": {
        "title": "Torre del Fiume - Quattro Colonne",
        "publisher": "Visit Nardò / Comune di Nardò",
        "type": "institutional-tourism",
        "url": "https://www.visitnardo.it/en/beauty/points-of-interest/river-towers/204-torre-del-fiume-quattro-colonne-en"
      },
      "visitnardo-uluzzo": {
        "title": "Torre Uluzzo",
        "publisher": "Visit Nardò / Comune di Nardò",
        "type": "institutional-tourism",
        "url": "https://www.visitnardo.it/en/beauty/points-of-interest/river-towers/207-torre-uluzzo-en"
      },
      "visitnardo-park": {
        "title": "Porto Selvaggio Park and Palude del Capitano",
        "publisher": "Visit Nardò / Comune di Nardò",
        "type": "institutional-tourism",
        "url": "https://www.visitnardo.it/en/beauty/157-thematic-itineraries/in-contact-with-nature/228-porto-selvaggio-park-and-palude-del-capitano"
      },
      "visitnardo-santacaterina": {
        "title": "Santa Caterina Tower",
        "publisher": "Visit Nardò / Comune di Nardò",
        "type": "institutional-tourism",
        "url": "https://www.visitnardo.it/en/beauty/points-of-interest/river-towers/205-santa-caterina-tower"
      },
      "visitpuglia-portocesareo": {
        "title": "Porto Cesareo",
        "publisher": "Visit Puglia",
        "type": "curated-tourism",
        "url": "https://visit.puglia.it/en/porto-cesareo"
      },
      "portocesareo-torri": {
        "title": "Le Torri Costiere di Porto Cesareo",
        "publisher": "Visita Porto Cesareo",
        "type": "curated-tourism",
        "url": "https://www.visitaportocesareo.it/torri-costiere/"
      },
      "portocesareo-conigli": {
        "title": "Isola dei Conigli / Isola Grande",
        "publisher": "Visita Porto Cesareo",
        "type": "curated-tourism",
        "url": "https://www.visitaportocesareo.it/isola-dei-conigli/"
      },
      "visitmelendugno": {
        "title": "Visit Melendugno",
        "publisher": "Comune di Melendugno",
        "type": "institutional-tourism",
        "url": "https://www.visitmelendugno.com/"
      },
      "visitmelendugno-poi": {
        "title": "Punti di Interesse",
        "publisher": "Comune di Melendugno",
        "type": "institutional-tourism",
        "url": "https://www.visitmelendugno.com/lista/punti-interesse/"
      },
      "visitpuglia-poesia": {
        "title": "Grotta della Poesia",
        "publisher": "Visit Puglia",
        "type": "curated-tourism",
        "url": "https://visit.puglia.it/en/cave-of-poetry"
      },
      "torcito-official": {
        "title": "Parco Torcito",
        "publisher": "Parco Torcito",
        "type": "institutional-tourism",
        "url": "https://www.parcotorcito.com/en/"
      },
      "copertino-grottella": {
        "title": "Santuario della Grottella",
        "publisher": "Comune di Copertino",
        "type": "institutional",
        "url": "https://www.comune.copertino.le.it/vivere-il-comune/luoghi/santuario-della-grottella/"
      },
      "manduria-salina": {
        "title": "Salina dei Monaci",
        "publisher": "Visit Manduria",
        "type": "institutional-tourism",
        "url": "https://visitmanduria.it/en/listing-category/cosa-vedere/148-salina-dei-monaci"
      },
      "mic-rudiae": {
        "title": "Rudiae e il suo anfiteatro",
        "publisher": "Ministero della Cultura",
        "type": "institutional",
        "url": "https://cultura.gov.it/evento/gep-2024-rudiae-e-il-suo-anfiteatro"
      },
      "otranto-cathedral": {
        "title": "Cattedrale di Santa Maria Annunziata",
        "publisher": "Otranto Welcome",
        "type": "institutional-tourism",
        "url": "https://www.otrantowelcome.it/en/punti-di-interesse/cattedrale-di-santa-maria-annunziata"
      }
    },
    "entries": {
      "otranto": {
        "poiId": "otranto",
        "confidence": "high",
        "themes": [
          "history",
          "fortification",
          "renaissance",
          "architecture"
        ],
        "sourceIds": [
          "italia-otranto-castle"
        ],
        "summary": {
          "it": "Il Castello Aragonese è il grande presidio fortificato di Otranto. L’assetto aragonese fu progettato e realizzato tra il 1485 e il 1498, dopo la traumatica presa ottomana della città del 1480.",
          "fr": "Le château aragonais est la grande forteresse d’Otranto. Son organisation aragonaise fut conçue et réalisée entre 1485 et 1498, après la prise ottomane traumatique de la ville en 1480.",
          "en": "The Aragonese Castle is Otranto’s major fortified landmark. Its Aragonese layout was designed and built between 1485 and 1498, after the traumatic Ottoman capture of the city in 1480.",
          "es": "El Castillo Aragonés es la gran fortaleza de Otranto. Su configuración aragonesa fue diseñada y construida entre 1485 y 1498, después de la traumática toma otomana de la ciudad en 1480."
        },
        "history": {
          "it": "Ferdinando I d’Aragona promosse la ricostruzione; il progetto è attribuito a Ciro Ciri con la collaborazione di Francesco di Giorgio Martini. La fortezza inglobò difese precedenti e fu ulteriormente rinforzata nel Cinquecento.",
          "fr": "Ferdinand Ier d’Aragon lança la reconstruction ; le projet est attribué à Ciro Ciri avec la collaboration de Francesco di Giorgio Martini. La forteresse intégra des défenses antérieures et fut encore renforcée au XVIe siècle.",
          "en": "Ferdinand I of Aragon promoted the rebuilding; the design is attributed to Ciro Ciri with Francesco di Giorgio Martini. The fortress incorporated earlier defences and was strengthened again in the 16th century.",
          "es": "Fernando I de Aragón impulsó la reconstrucción; el proyecto se atribuye a Ciro Ciri con la colaboración de Francesco di Giorgio Martini. La fortaleza integró defensas anteriores y volvió a reforzarse en el siglo XVI."
        },
        "highlights": {
          "it": [
            "fossato che circonda la fortezza",
            "pianta pentagonale irregolare",
            "tre torri cilindriche angolari",
            "bastioni e stemmi monumentali"
          ],
          "fr": [
            "douves autour de la forteresse",
            "plan pentagonal irrégulier",
            "trois tours cylindriques d’angle",
            "bastions et armoiries monumentales"
          ],
          "en": [
            "moat around the fortress",
            "irregular pentagonal plan",
            "three cylindrical corner towers",
            "bastions and monumental coats of arms"
          ],
          "es": [
            "foso alrededor de la fortaleza",
            "planta pentagonal irregular",
            "tres torres cilíndricas angulares",
            "bastiones y escudos monumentales"
          ]
        },
        "territoryIds": [
          "otranto"
        ],
        "verificationStatus": "verified"
      },
      "badisco": {
        "poiId": "badisco",
        "confidence": "medium-high",
        "themes": [
          "sea",
          "landscape",
          "prehistory",
          "myth"
        ],
        "sourceIds": [
          "visit-badisco",
          "visit-cervi"
        ],
        "summary": {
          "it": "Porto Badisco è una piccola insenatura della costa rocciosa tra Otranto e Santa Cesarea Terme, con tratti sabbiosi, acqua limpida e sentieri costieri.",
          "fr": "Porto Badisco est une petite crique de la côte rocheuse entre Otranto et Santa Cesarea Terme, avec quelques zones sableuses, une eau claire et des sentiers côtiers.",
          "en": "Porto Badisco is a small inlet on the rocky coast between Otranto and Santa Cesarea Terme, with some sandy stretches, clear water and coastal trails.",
          "es": "Porto Badisco es una pequeña cala de la costa rocosa entre Otranto y Santa Cesarea Terme, con algunos tramos de arena, agua clara y senderos costeros."
        },
        "history": {
          "it": "Il luogo è strettamente legato alla Grotta dei Cervi, scoperta nel 1970 e celebre per il suo eccezionale patrimonio di pitture rupestri neolitiche.",
          "fr": "Le lieu est étroitement lié à la Grotta dei Cervi, découverte en 1970 et célèbre pour son exceptionnel ensemble de peintures rupestres néolithiques.",
          "en": "The place is closely linked to the Grotta dei Cervi, discovered in 1970 and famous for its exceptional collection of Neolithic rock paintings.",
          "es": "El lugar está estrechamente relacionado con la Grotta dei Cervi, descubierta en 1970 y famosa por su excepcional conjunto de pinturas rupestres neolíticas."
        },
        "myth": {
          "it": "La tradizione locale associa Porto Badisco all’approdo di Enea. È una lettura mitica e culturale del luogo, non una localizzazione storicamente dimostrata.",
          "fr": "La tradition locale associe Porto Badisco au débarquement d’Énée. Il s’agit d’une lecture mythique et culturelle du lieu, et non d’une localisation historiquement démontrée.",
          "en": "Local tradition associates Porto Badisco with Aeneas’ landing. This is a mythical and cultural interpretation of the place, not a historically proven location.",
          "es": "La tradición local asocia Porto Badisco con el desembarco de Eneas. Es una interpretación mítica y cultural del lugar, no una localización históricamente demostrada."
        },
        "highlights": {
          "it": [
            "la piccola baia",
            "Grotta dei Cervi nelle vicinanze",
            "snorkeling e mare",
            "trekking costiero"
          ],
          "fr": [
            "la petite baie",
            "la Grotta dei Cervi à proximité",
            "snorkeling et mer",
            "randonnée côtière"
          ],
          "en": [
            "the small bay",
            "nearby Grotta dei Cervi",
            "snorkelling and sea",
            "coastal hiking"
          ],
          "es": [
            "la pequeña cala",
            "la cercana Grotta dei Cervi",
            "snorkel y mar",
            "senderismo costero"
          ]
        },
        "territoryIds": [
          "otranto"
        ],
        "verificationStatus": "verified"
      },
      "cervi": {
        "poiId": "cervi",
        "confidence": "medium-high",
        "themes": [
          "prehistory",
          "archaeology",
          "rock-art"
        ],
        "sourceIds": [
          "visit-cervi"
        ],
        "summary": {
          "it": "La Grotta dei Cervi di Porto Badisco è uno dei più importanti complessi di arte rupestre preistorica del Salento, con pitture neolitiche di animali, figure umane e motivi geometrici.",
          "fr": "La Grotta dei Cervi de Porto Badisco est l’un des ensembles d’art rupestre préhistorique les plus importants du Salento, avec des peintures néolithiques d’animaux, de figures humaines et de motifs géométriques.",
          "en": "The Grotta dei Cervi at Porto Badisco is one of Salento’s most important prehistoric rock-art complexes, with Neolithic paintings of animals, human figures and geometric motifs.",
          "es": "La Grotta dei Cervi de Porto Badisco es uno de los conjuntos de arte rupestre prehistórico más importantes del Salento, con pinturas neolíticas de animales, figuras humanas y motivos geométricos."
        },
        "history": {
          "it": "La grotta fu scoperta il 1º febbraio 1970 da speleologi del Gruppo Speleologico Salentino di Maglie. Il nome deriva dalle raffigurazioni di cervi e scene di caccia presenti sulle pareti.",
          "fr": "La grotte fut découverte le 1er février 1970 par des spéléologues du Gruppo Speleologico Salentino de Maglie. Son nom vient des représentations de cerfs et de scènes de chasse sur ses parois.",
          "en": "The cave was discovered on 1 February 1970 by speleologists from the Gruppo Speleologico Salentino of Maglie. Its name comes from depictions of deer and hunting scenes on the walls.",
          "es": "La cueva fue descubierta el 1 de febrero de 1970 por espeleólogos del Gruppo Speleologico Salentino de Maglie. Su nombre procede de las representaciones de ciervos y escenas de caza de sus paredes."
        },
        "practical": {
          "it": "L’accesso è fortemente controllato per proteggere le pitture: non va trattato come una normale grotta turistica. Le condizioni di visita devono essere verificate con fonti autorizzate.",
          "fr": "L’accès est fortement contrôlé afin de protéger les peintures : ce n’est pas une grotte touristique ordinaire. Les conditions de visite doivent être vérifiées auprès de sources autorisées.",
          "en": "Access is tightly controlled to protect the paintings; this is not an ordinary tourist cave. Visiting conditions should be checked with authorised sources.",
          "es": "El acceso está muy controlado para proteger las pinturas; no es una cueva turística ordinaria. Las condiciones de visita deben verificarse con fuentes autorizadas."
        },
        "highlights": {
          "it": [
            "pitture neolitiche",
            "figure di cervi",
            "scene di caccia",
            "simboli e motivi geometrici"
          ],
          "fr": [
            "peintures néolithiques",
            "figures de cerfs",
            "scènes de chasse",
            "symboles et motifs géométriques"
          ],
          "en": [
            "Neolithic paintings",
            "deer figures",
            "hunting scenes",
            "symbols and geometric motifs"
          ],
          "es": [
            "pinturas neolíticas",
            "figuras de ciervos",
            "escenas de caza",
            "símbolos y motivos geométricos"
          ]
        },
        "territoryIds": [
          "otranto"
        ],
        "verificationStatus": "verified"
      },
      "zinzulusa": {
        "poiId": "zinzulusa",
        "confidence": "medium-high",
        "themes": [
          "geology",
          "cave",
          "nature"
        ],
        "sourceIds": [
          "visit-zinzulusa"
        ],
        "summary": {
          "it": "La Grotta Zinzulusa, presso Castro, è una cavità carsica della costa adriatica salentina, nota per le concrezioni che pendono dalla volta e per gli ambienti sotterranei ricchi d’acqua.",
          "fr": "La Grotta Zinzulusa, près de Castro, est une cavité karstique de la côte adriatique du Salento, connue pour ses concrétions suspendues et ses espaces souterrains riches en eau.",
          "en": "Grotta Zinzulusa, near Castro, is a karst cave on Salento’s Adriatic coast, known for its hanging formations and water-rich underground chambers.",
          "es": "La Grotta Zinzulusa, cerca de Castro, es una cueva kárstica de la costa adriática del Salento, conocida por sus formaciones colgantes y sus espacios subterráneos ricos en agua."
        },
        "history": {
          "it": "Conosciuta localmente da secoli, fu documentata nel 1793 e aperta al pubblico nel 1957 dopo studi ed esplorazioni.",
          "fr": "Connue localement depuis des siècles, elle fut documentée en 1793 et ouverte au public en 1957 après des études et des explorations.",
          "en": "Known locally for centuries, it was documented in 1793 and opened to the public in 1957 after study and exploration.",
          "es": "Conocida localmente desde hace siglos, fue documentada en 1793 y abierta al público en 1957 tras estudios y exploraciones."
        },
        "why": {
          "it": "Il nome deriva da «zinzuli», parola salentina che significa «stracci»: le stalattiti ricordano infatti panni appesi.",
          "fr": "Son nom vient de « zinzuli », mot salentin signifiant « chiffons » : les stalactites évoquent des tissus suspendus.",
          "en": "Its name comes from “zinzuli”, a Salentino word meaning “rags”, because the stalactites resemble hanging cloth.",
          "es": "Su nombre procede de «zinzuli», palabra salentina que significa «trapos», porque las estalactitas recuerdan telas colgadas."
        },
        "highlights": {
          "it": [
            "Corridoio delle Meraviglie",
            "Cripta",
            "Duomo",
            "Lago Cocito",
            "concrezioni dette «zinzuli»"
          ],
          "fr": [
            "Corridor des Merveilles",
            "Crypte",
            "Dôme",
            "lac Cocito",
            "concrétions appelées « zinzuli »"
          ],
          "en": [
            "Corridor of Wonders",
            "Crypt",
            "Dome",
            "Lake Cocito",
            "formations known as “zinzuli”"
          ],
          "es": [
            "Corredor de las Maravillas",
            "Cripta",
            "Cúpula",
            "lago Cocito",
            "formaciones llamadas «zinzuli»"
          ]
        },
        "territoryIds": [
          "castro"
        ],
        "verificationStatus": "verified"
      },
      "cesine": {
        "poiId": "cesine",
        "confidence": "high",
        "themes": [
          "wetland",
          "biodiversity",
          "birdlife",
          "nature"
        ],
        "sourceIds": [
          "wwf-cesine"
        ],
        "summary": {
          "it": "Le Cesine è una Riserva Naturale e Oasi WWF nel territorio di Vernole, uno degli ultimi lembi delle paludi costiere che un tempo caratterizzavano il litorale salentino.",
          "fr": "Le Cesine est une réserve naturelle et oasis WWF sur le territoire de Vernole, l’un des derniers vestiges des marais côtiers qui caractérisaient autrefois le littoral du Salento.",
          "en": "Le Cesine is a nature reserve and WWF oasis in the Vernole area, one of the last remnants of the coastal wetlands that once characterised the Salento shoreline.",
          "es": "Le Cesine es una reserva natural y oasis WWF en el territorio de Vernole, uno de los últimos restos de los humedales costeros que antiguamente caracterizaban el litoral del Salento."
        },
        "nature": {
          "it": "La riserva copre circa 348 ettari e riunisce stagni temporanei, pinete di pino d’Aleppo, leccete, gariga e paludi costiere. È lungo un’importante rotta migratoria e ospita una ricchissima avifauna.",
          "fr": "La réserve couvre environ 348 hectares et réunit mares temporaires, pinèdes de pin d’Alep, chênaies vertes, garrigue et marais côtiers. Elle se trouve sur une importante route migratoire et accueille une avifaune très riche.",
          "en": "The reserve covers about 348 hectares and combines temporary ponds, Aleppo-pine woods, holm-oak woods, garrigue and coastal marshes. It lies on a major migration route and supports very rich birdlife.",
          "es": "La reserva abarca unas 348 hectáreas y reúne estanques temporales, pinares de pino carrasco, encinares, garriga y marismas costeras. Se encuentra en una importante ruta migratoria y alberga una avifauna muy rica."
        },
        "practical": {
          "it": "Secondo le regole pubblicate dal WWF, l’accesso alla riserva avviene con accompagnamento delle guide e prenotazione. Orari e modalità vanno sempre verificati prima della visita.",
          "fr": "Selon les règles publiées par le WWF, l’accès à la réserve se fait accompagné par les guides et sur réservation. Les horaires et modalités doivent toujours être vérifiés avant la visite.",
          "en": "Under the rules published by WWF, access to the reserve is with reserve guides and booking. Current times and conditions should always be checked before visiting.",
          "es": "Según las normas publicadas por WWF, el acceso a la reserva se realiza acompañado por guías y con reserva. Los horarios y condiciones deben verificarse siempre antes de la visita."
        },
        "highlights": {
          "it": [
            "zone umide costiere",
            "birdwatching",
            "orchidee spontanee",
            "pineta e macchia mediterranea"
          ],
          "fr": [
            "zones humides côtières",
            "observation des oiseaux",
            "orchidées sauvages",
            "pinède et maquis méditerranéen"
          ],
          "en": [
            "coastal wetlands",
            "birdwatching",
            "wild orchids",
            "pine woods and Mediterranean scrub"
          ],
          "es": [
            "humedales costeros",
            "observación de aves",
            "orquídeas silvestres",
            "pinar y matorral mediterráneo"
          ]
        },
        "territoryIds": [
          "vernole"
        ],
        "verificationStatus": "verified"
      },
      "alto": {
        "poiId": "alto",
        "confidence": "high",
        "themes": [
          "nature",
          "history",
          "coastal-tower",
          "porto-selvaggio"
        ],
        "sourceIds": [
          "nardo-porto-selvaggio"
        ],
        "summary": {
          "it": "Torre dell’Alto domina il Parco Naturale di Porto Selvaggio, uno dei paesaggi costieri protetti più importanti del territorio di Nardò.",
          "fr": "Torre dell’Alto domine le parc naturel de Porto Selvaggio, l’un des paysages côtiers protégés les plus importants du territoire de Nardò.",
          "en": "Torre dell’Alto overlooks the Porto Selvaggio Natural Park, one of the most important protected coastal landscapes in the Nardò area.",
          "es": "Torre dell’Alto domina el Parque Natural de Porto Selvaggio, uno de los paisajes costeros protegidos más importantes del territorio de Nardò."
        },
        "history": {
          "it": "È una delle tre torri di vedetta della costa del parco, insieme a Torre Uluzzo e Torre Inserraglio. La rete di torri costiere fu potenziata nel Cinquecento nel quadro della difesa contro le incursioni dal mare.",
          "fr": "C’est l’une des trois tours de guet du littoral du parc, avec Torre Uluzzo et Torre Inserraglio. Le réseau de tours côtières fut renforcé au XVIe siècle dans le cadre de la défense contre les incursions maritimes.",
          "en": "It is one of the park coast’s three watchtowers, alongside Torre Uluzzo and Torre Inserraglio. The coastal-tower network was strengthened in the 16th century as part of defence against seaborne raids.",
          "es": "Es una de las tres torres de vigilancia de la costa del parque, junto con Torre Uluzzo y Torre Inserraglio. La red de torres costeras se reforzó en el siglo XVI para defenderse de incursiones marítimas."
        },
        "nature": {
          "it": "Il parco, istituito nel 1980, tutela 424 ettari e circa 7 km di costa, con pineta, aree carsiche, zone archeologiche e la vicina Palude del Capitano.",
          "fr": "Le parc, créé en 1980, protège 424 hectares et environ 7 km de côte, avec pinède, zones karstiques, secteurs archéologiques et la proche Palude del Capitano.",
          "en": "Established in 1980, the park protects 424 hectares and about 7 km of coast, including pine woods, karst areas, archaeological sites and the nearby Palude del Capitano.",
          "es": "El parque, creado en 1980, protege 424 hectáreas y unos 7 km de costa, con pinar, zonas kársticas, áreas arqueológicas y la cercana Palude del Capitano."
        },
        "highlights": {
          "it": [
            "vista sulla costa di Porto Selvaggio",
            "torre di vedetta storica",
            "sentieri nella pineta",
            "paesaggio carsico e marino"
          ],
          "fr": [
            "vue sur la côte de Porto Selvaggio",
            "tour de guet historique",
            "sentiers dans la pinède",
            "paysage karstique et marin"
          ],
          "en": [
            "views over Porto Selvaggio coast",
            "historic watchtower",
            "pine-wood trails",
            "karst and marine landscape"
          ],
          "es": [
            "vistas sobre la costa de Porto Selvaggio",
            "torre de vigilancia histórica",
            "senderos en el pinar",
            "paisaje kárstico y marino"
          ]
        },
        "territoryIds": [
          "nardo"
        ],
        "verificationStatus": "verified"
      },
      "cerrate": {
        "poiId": "cerrate",
        "confidence": "high",
        "themes": [
          "medieval",
          "byzantine",
          "romanesque",
          "rural-history"
        ],
        "sourceIds": [
          "fai-cerrate"
        ],
        "summary": {
          "it": "Santa Maria di Cerrate è un complesso abbaziale medievale immerso nel paesaggio rurale salentino, dove si incontrano eredità bizantina, romanico pugliese e storia agricola.",
          "fr": "Santa Maria di Cerrate est un ensemble abbatial médiéval plongé dans le paysage rural du Salento, où se rencontrent héritage byzantin, art roman des Pouilles et histoire agricole.",
          "en": "Santa Maria di Cerrate is a medieval abbey complex set in the Salento countryside, where Byzantine heritage, Apulian Romanesque architecture and agricultural history meet.",
          "es": "Santa Maria di Cerrate es un complejo abacial medieval en el paisaje rural del Salento, donde se encuentran la herencia bizantina, el románico de Apulia y la historia agrícola."
        },
        "history": {
          "it": "Le origini storiche sono collocate tra la fine dell’XI e l’inizio del XII secolo, con una comunità di monaci greci di tradizione basiliana. Nei secoli il complesso fu trasformato anche in masseria.",
          "fr": "Ses origines historiques se situent entre la fin du XIe et le début du XIIe siècle, avec une communauté de moines grecs de tradition basilienne. Au fil des siècles, le complexe fut également transformé en masseria.",
          "en": "Its historical origins lie between the late 11th and early 12th centuries, with a community of Greek monks in the Basilian tradition. Over the centuries the complex was also transformed into a masseria.",
          "es": "Sus orígenes históricos se sitúan entre finales del siglo XI y comienzos del XII, con una comunidad de monjes griegos de tradición basiliana. Con los siglos el complejo también se transformó en masseria."
        },
        "myth": {
          "it": "Una leggenda lega la fondazione a Tancredi d’Altavilla e all’apparizione della Madonna durante una battuta di caccia. Il FAI distingue questa tradizione dalla ricostruzione storica del monastero.",
          "fr": "Une légende relie la fondation à Tancrède d’Hauteville et à une apparition de la Vierge pendant une chasse. Le FAI distingue cette tradition de la reconstruction historique du monastère.",
          "en": "A legend links the foundation to Tancred of Hauteville and an apparition of the Virgin during a hunt. FAI distinguishes this tradition from the historical reconstruction of the monastery.",
          "es": "Una leyenda vincula la fundación con Tancredo de Hauteville y una aparición de la Virgen durante una cacería. El FAI distingue esta tradición de la reconstrucción histórica del monasterio."
        },
        "highlights": {
          "it": [
            "chiesa romanica",
            "affreschi medievali",
            "portico duecentesco",
            "frantoi ipogei",
            "eredità del rito greco"
          ],
          "fr": [
            "église romane",
            "fresques médiévales",
            "portique du XIIIe siècle",
            "moulins à huile souterrains",
            "héritage du rite grec"
          ],
          "en": [
            "Romanesque church",
            "medieval frescoes",
            "13th-century portico",
            "underground olive presses",
            "Greek-rite heritage"
          ],
          "es": [
            "iglesia románica",
            "frescos medievales",
            "pórtico del siglo XIII",
            "almazaras subterráneas",
            "herencia del rito griego"
          ]
        },
        "territoryIds": [
          "lecce"
        ],
        "verificationStatus": "verified"
      },
      "copertino": {
        "poiId": "copertino",
        "confidence": "high",
        "themes": [
          "renaissance",
          "fortification",
          "architecture"
        ],
        "sourceIds": [
          "mic-copertino"
        ],
        "summary": {
          "it": "Il Castello di Copertino è una grande fortezza rinascimentale costruita intorno al 1540 inglobando strutture precedenti, tra cui una torre del XIII secolo.",
          "fr": "Le château de Copertino est une grande forteresse de la Renaissance construite vers 1540 en intégrant des structures antérieures, dont une tour du XIIIe siècle.",
          "en": "Copertino Castle is a major Renaissance fortress built around 1540, incorporating earlier structures including a 13th-century tower.",
          "es": "El Castillo de Copertino es una gran fortaleza renacentista construida hacia 1540 e integrada con estructuras anteriores, entre ellas una torre del siglo XIII."
        },
        "history": {
          "it": "Il progetto rinascimentale è probabilmente legato all’architetto pugliese Evangelista Menga. Alla funzione militare si affiancò progressivamente quella residenziale, con palazzo e cappelle interne.",
          "fr": "Le projet Renaissance est probablement lié à l’architecte des Pouilles Evangelista Menga. À la fonction militaire s’ajouta progressivement une fonction résidentielle, avec palais et chapelles intérieures.",
          "en": "The Renaissance design is probably associated with Apulian architect Evangelista Menga. A residential role gradually complemented the military function, with an internal palace and chapels.",
          "es": "El proyecto renacentista se relaciona probablemente con el arquitecto de Apulia Evangelista Menga. A la función militar se añadió progresivamente una función residencial, con palacio y capillas interiores."
        },
        "highlights": {
          "it": [
            "portale monumentale rinascimentale",
            "bastioni della fortezza",
            "Cappella di San Marco",
            "affreschi di Gianserio Strafella"
          ],
          "fr": [
            "portail monumental Renaissance",
            "bastions de la forteresse",
            "chapelle Saint-Marc",
            "fresques de Gianserio Strafella"
          ],
          "en": [
            "monumental Renaissance portal",
            "fortress bastions",
            "Chapel of San Marco",
            "frescoes by Gianserio Strafella"
          ],
          "es": [
            "portal monumental renacentista",
            "bastiones de la fortaleza",
            "capilla de San Marcos",
            "frescos de Gianserio Strafella"
          ]
        },
        "practical": {
          "it": "Orari, giorni di apertura e biglietti sono dati dinamici: ARACNE deve rimandare alla fonte ufficiale del Ministero della Cultura per l’informazione aggiornata.",
          "fr": "Horaires, jours d’ouverture et tarifs sont des données dynamiques : ARACNE doit renvoyer à la source officielle du ministère italien de la Culture pour l’information à jour.",
          "en": "Opening times, days and ticket prices are dynamic data: ARACNE should refer to the official Italian Ministry of Culture source for current information.",
          "es": "Los horarios, días de apertura y precios son datos dinámicos: ARACNE debe remitir a la fuente oficial del Ministerio de Cultura italiano para la información actualizada."
        },
        "territoryIds": [
          "copertino"
        ],
        "verificationStatus": "verified"
      },
      "galatina": {
        "poiId": "galatina",
        "confidence": "medium-high",
        "themes": [
          "medieval-art",
          "frescoes",
          "gothic",
          "religious-art"
        ],
        "sourceIds": [
          "visit-galatina"
        ],
        "summary": {
          "it": "La Basilica di Santa Caterina d’Alessandria a Galatina è uno dei grandi scrigni d’arte medievale del Salento, celebre soprattutto per il vasto ciclo di affreschi dell’interno.",
          "fr": "La basilique Santa Caterina d’Alessandria à Galatina est l’un des grands trésors d’art médiéval du Salento, célèbre surtout pour son vaste cycle de fresques intérieures.",
          "en": "The Basilica of Santa Caterina d’Alessandria in Galatina is one of Salento’s great medieval-art treasures, especially famous for its extensive interior fresco cycle.",
          "es": "La Basílica de Santa Caterina d’Alessandria en Galatina es uno de los grandes tesoros de arte medieval del Salento, famosa sobre todo por su extenso ciclo de frescos interiores."
        },
        "history": {
          "it": "L’edificio riunisce elementi romanici, gotici, normanni e bizantini. Nel Quattrocento Maria d’Enghien promosse la decorazione pittorica dell’interno, affidata ad artisti legati all’ambiente napoletano.",
          "fr": "L’édifice réunit des éléments romans, gothiques, normands et byzantins. Au XVe siècle, Maria d’Enghien favorisa la décoration picturale intérieure, confiée à des artistes liés au milieu napolitain.",
          "en": "The building combines Romanesque, Gothic, Norman and Byzantine elements. In the 15th century Maria d’Enghien promoted the interior painted decoration, carried out by artists connected with Naples.",
          "es": "El edificio combina elementos románicos, góticos, normandos y bizantinos. En el siglo XV, Maria d’Enghien impulsó la decoración pictórica del interior, realizada por artistas vinculados al ambiente napolitano."
        },
        "highlights": {
          "it": [
            "ciclo di affreschi medievali",
            "facciata romanica",
            "rosone e portale scolpito",
            "angeli musicanti e strumenti medievali"
          ],
          "fr": [
            "cycle de fresques médiévales",
            "façade romane",
            "rosace et portail sculpté",
            "anges musiciens et instruments médiévaux"
          ],
          "en": [
            "medieval fresco cycle",
            "Romanesque façade",
            "rose window and carved portal",
            "musical angels and medieval instruments"
          ],
          "es": [
            "ciclo de frescos medievales",
            "fachada románica",
            "rosetón y portal esculpido",
            "ángeles músicos e instrumentos medievales"
          ]
        },
        "territoryIds": [
          "galatina"
        ],
        "verificationStatus": "verified"
      },
      "lecce": {
        "poiId": "lecce",
        "territoryIds": [
          "lecce"
        ],
        "confidence": "legacy-pending",
        "verificationStatus": "legacy-pending",
        "themes": [
          "culture",
          "historic-centre"
        ],
        "sourceIds": [
          "italia-lecce-city"
        ],
        "summary": {
          "it": "Questo POI culturale è collocato nel centro di Lecce, ma l’intitolazione ereditata «Basilica di S.M. Annunziata, Lecce» richiede una verifica puntuale prima di associarle una storia monumentale specifica.",
          "fr": "Ce POI culturel est situé dans le centre de Lecce, mais l’intitulé hérité « Basilica di S.M. Annunziata, Lecce » doit être vérifié avant de lui attribuer une histoire monumentale précise.",
          "en": "This cultural POI is located in central Lecce, but the inherited label “Basilica di S.M. Annunziata, Lecce” needs verification before attaching a specific monument history to it.",
          "es": "Este POI cultural está situado en el centro de Lecce, pero la etiqueta heredada «Basilica di S.M. Annunziata, Lecce» debe verificarse antes de atribuirle una historia monumental concreta."
        },
        "highlights": {
          "it": [
            "centro storico di Lecce"
          ],
          "fr": [
            "centre historique de Lecce"
          ],
          "en": [
            "Lecce historic centre"
          ],
          "es": [
            "centro histórico de Lecce"
          ]
        },
        "notes": "Inherited POI label needs review; do not silently identify it with a different church."
      },
      "bauxite": {
        "poiId": "bauxite",
        "territoryIds": [
          "otranto"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "nature",
          "geology",
          "industrial-history"
        ],
        "sourceIds": [
          "visitpuglia-bauxite",
          "italia-cammino-salento"
        ],
        "summary": {
          "it": "La cava di bauxite a sud di Otranto è un’ex area estrattiva divenuta celebre per il contrasto fra la terra rosso-corallo e il piccolo lago verde formatosi nel fondo della cava.",
          "fr": "La carrière de bauxite au sud d’Otranto est une ancienne zone d’extraction devenue célèbre pour le contraste entre la terre rouge-corail et le petit lac vert formé au fond.",
          "en": "The bauxite quarry south of Otranto is a former extraction site famous for the contrast between coral-red earth and the small green lake formed in the pit.",
          "es": "La cantera de bauxita al sur de Otranto es una antigua zona de extracción famosa por el contraste entre la tierra rojo coral y el pequeño lago verde formado en el fondo."
        },
        "history": {
          "it": "L’estrazione della bauxite interessò il sito soprattutto tra gli anni Sessanta e la metà degli anni Settanta; il paesaggio attuale è il risultato della dismissione e della successiva rinaturalizzazione spontanea.",
          "fr": "L’extraction de bauxite a surtout concerné le site entre les années 1960 et le milieu des années 1970 ; le paysage actuel résulte de l’abandon du site et de sa renaturalisation spontanée.",
          "en": "Bauxite extraction mainly affected the site from the 1960s to the mid-1970s; today’s landscape results from abandonment and spontaneous renaturalisation.",
          "es": "La extracción de bauxita afectó principalmente al lugar entre los años sesenta y mediados de los setenta; el paisaje actual es fruto del abandono y la renaturalización espontánea."
        },
        "highlights": {
          "it": [
            "terre rosso-corallo",
            "laghetto verde",
            "trekking verso Punta Palascia"
          ],
          "fr": [
            "terres rouge-corail",
            "petit lac vert",
            "randonnée vers Punta Palascia"
          ],
          "en": [
            "coral-red earth",
            "green lake",
            "walks toward Punta Palascia"
          ],
          "es": [
            "tierra rojo coral",
            "pequeño lago verde",
            "senderos hacia Punta Palascia"
          ]
        }
      },
      "palascia": {
        "poiId": "palascia",
        "territoryIds": [
          "otranto"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "lighthouse",
          "landscape",
          "adriatic"
        ],
        "sourceIds": [
          "italia-palascia"
        ],
        "summary": {
          "it": "Punta Palascìa, o Capo d’Otranto, è il punto più orientale d’Italia; il faro domina il Canale d’Otranto e uno dei paesaggi costieri più simbolici del Salento.",
          "fr": "Punta Palascìa, ou Cap d’Otrante, est le point le plus oriental d’Italie ; le phare domine le canal d’Otrante et l’un des paysages côtiers les plus symboliques du Salento.",
          "en": "Punta Palascìa, or Capo d’Otranto, is Italy’s easternmost point; its lighthouse overlooks the Otranto Channel and one of Salento’s most emblematic coastal landscapes.",
          "es": "Punta Palascìa, o Cabo de Otranto, es el punto más oriental de Italia; su faro domina el canal de Otranto y uno de los paisajes costeros más emblemáticos del Salento."
        },
        "history": {
          "it": "Il faro fu eretto nel 1867, rimase inattivo per un periodo nel Novecento e venne recuperato e riacceso negli anni Duemila.",
          "fr": "Le phare fut érigé en 1867, resta inactif pendant une période du XXe siècle puis fut restauré et rallumé dans les années 2000.",
          "en": "The lighthouse was built in 1867, remained inactive for a period in the 20th century and was restored and relit in the 2000s.",
          "es": "El faro fue construido en 1867, permaneció inactivo durante un periodo del siglo XX y fue restaurado y reencendido en los años 2000."
        },
        "highlights": {
          "it": [
            "prima alba simbolica d’Italia",
            "faro storico",
            "panorama sul Canale d’Otranto"
          ],
          "fr": [
            "première aube symbolique d’Italie",
            "phare historique",
            "vue sur le canal d’Otrante"
          ],
          "en": [
            "symbolic first sunrise in Italy",
            "historic lighthouse",
            "Otranto Channel panorama"
          ],
          "es": [
            "primera salida del sol simbólica de Italia",
            "faro histórico",
            "panorama del canal de Otranto"
          ]
        }
      },
      "santemiliano": {
        "poiId": "santemiliano",
        "territoryIds": [
          "otranto"
        ],
        "confidence": "medium",
        "verificationStatus": "verified",
        "themes": [
          "coast",
          "islet",
          "protected-landscape"
        ],
        "sourceIds": [
          "parco-otranto-leuca-itinerari"
        ],
        "summary": {
          "it": "Sant’Emiliano appartiene al tratto costiero protetto a sud di Otranto, lungo l’itinerario fra Porto Badisco e Punta Palascia, caratterizzato da falesie, macchia mediterranea e mare aperto.",
          "fr": "Sant’Emiliano appartient au littoral protégé au sud d’Otranto, sur l’itinéraire entre Porto Badisco et Punta Palascia, marqué par les falaises, le maquis méditerranéen et la mer ouverte.",
          "en": "Sant’Emiliano lies on the protected coast south of Otranto, along the route between Porto Badisco and Punta Palascia, characterised by cliffs, Mediterranean scrub and open sea.",
          "es": "Sant’Emiliano forma parte de la costa protegida al sur de Otranto, en la ruta entre Porto Badisco y Punta Palascia, caracterizada por acantilados, matorral mediterráneo y mar abierto."
        },
        "highlights": {
          "it": [
            "costa selvaggia",
            "macchia mediterranea",
            "itinerario Sant’Emiliano"
          ],
          "fr": [
            "côte sauvage",
            "maquis méditerranéen",
            "itinéraire Sant’Emiliano"
          ],
          "en": [
            "wild coastline",
            "Mediterranean scrub",
            "Sant’Emiliano route"
          ],
          "es": [
            "costa salvaje",
            "matorral mediterráneo",
            "itinerario Sant’Emiliano"
          ]
        }
      },
      "miggiano": {
        "poiId": "miggiano",
        "territoryIds": [
          "santa_cesarea"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "sea",
          "cliffs",
          "watchtower"
        ],
        "sourceIds": [
          "visitpuglia-portomiggiano",
          "italia-santacesarea"
        ],
        "summary": {
          "it": "Porto Miggiano è una piccola baia nel comune di Santa Cesarea Terme, incastonata fra alte pareti calcaree e nota anche come spiaggia dei «100 scalini».",
          "fr": "Porto Miggiano est une petite baie de Santa Cesarea Terme, enchâssée entre de hautes falaises calcaires et également connue comme la plage des « 100 marches ».",
          "en": "Porto Miggiano is a small bay in Santa Cesarea Terme, enclosed by high limestone cliffs and also known as the “100 Steps” beach.",
          "es": "Porto Miggiano es una pequeña bahía de Santa Cesarea Terme, encajada entre altos acantilados de caliza y conocida también como la playa de los «100 escalones»."
        },
        "history": {
          "it": "Sopra la baia si trova la Torre di Porto Miggiano, parte del sistema cinquecentesco di avvistamento e difesa costiera del Salento.",
          "fr": "Au-dessus de la baie se dresse la tour de Porto Miggiano, élément du système de surveillance et de défense côtière du XVIe siècle.",
          "en": "Above the bay stands Porto Miggiano Tower, part of Salento’s 16th-century coastal watch and defence system.",
          "es": "Sobre la bahía se alza la Torre de Porto Miggiano, parte del sistema de vigilancia y defensa costera del siglo XVI."
        },
        "highlights": {
          "it": [
            "baia dei 100 scalini",
            "falesie calcaree",
            "Torre di Porto Miggiano"
          ],
          "fr": [
            "baie des 100 marches",
            "falaises calcaires",
            "tour de Porto Miggiano"
          ],
          "en": [
            "100 Steps bay",
            "limestone cliffs",
            "Porto Miggiano Tower"
          ],
          "es": [
            "bahía de los 100 escalones",
            "acantilados calcáreos",
            "Torre de Porto Miggiano"
          ]
        }
      },
      "scarra": {
        "poiId": "scarra",
        "territoryIds": [
          "tricase"
        ],
        "confidence": "legacy-pending",
        "verificationStatus": "legacy-pending",
        "themes": [
          "woodland",
          "nature"
        ],
        "sourceIds": [
          "parco-otranto-leuca-comuni"
        ],
        "summary": {
          "it": "Bosco della Scarra è registrato in HIRUNDU come area naturale del basso Salento; la localizzazione e la scheda botanica dettagliata devono ancora essere verificate con una fonte puntuale.",
          "fr": "Bosco della Scarra est enregistré dans HIRUNDU comme espace naturel du bas Salento ; sa localisation et sa fiche botanique détaillée doivent encore être vérifiées par une source précise.",
          "en": "Bosco della Scarra is recorded in HIRUNDU as a natural area of lower Salento; its precise location and detailed botanical record still need point-source verification.",
          "es": "Bosco della Scarra figura en HIRUNDU como área natural del bajo Salento; su localización y ficha botánica detallada aún deben verificarse con una fuente específica."
        },
        "highlights": {
          "it": [
            "bosco salentino",
            "paesaggio rurale"
          ],
          "fr": [
            "bois salentin",
            "paysage rural"
          ],
          "en": [
            "Salento woodland",
            "rural landscape"
          ],
          "es": [
            "bosque salentino",
            "paisaje rural"
          ]
        }
      },
      "enea": {
        "poiId": "enea",
        "territoryIds": [
          "otranto"
        ],
        "confidence": "legacy-pending",
        "verificationStatus": "legacy-pending",
        "themes": [
          "sea",
          "myth"
        ],
        "sourceIds": [
          "italia-cammino-salento"
        ],
        "summary": {
          "it": "Il POI «Porto Enea» è collegato nell’app al tratto costiero di Porto Badisco, tradizionalmente associato all’approdo di Enea; l’esatta denominazione locale del POI va ancora verificata.",
          "fr": "Le POI « Porto Enea » est relié dans l’app au secteur côtier de Porto Badisco, traditionnellement associé au débarquement d’Énée ; l’appellation locale exacte doit encore être vérifiée.",
          "en": "The “Porto Enea” POI is linked in the app to the Porto Badisco coastal area, traditionally associated with Aeneas’ landing; the exact local POI name still needs verification.",
          "es": "El POI «Porto Enea» está vinculado en la app al tramo costero de Porto Badisco, tradicionalmente asociado al desembarco de Eneas; la denominación local exacta aún debe verificarse."
        },
        "myth": {
          "it": "La tradizione letteraria identifica Porto Badisco con uno degli approdi di Enea. ARACNE lo tratta come tradizione culturale, non come fatto archeologico dimostrato.",
          "fr": "La tradition littéraire identifie Porto Badisco comme l’un des lieux de débarquement d’Énée. ARACNE le traite comme une tradition culturelle, non comme un fait archéologique démontré.",
          "en": "Literary tradition identifies Porto Badisco as one of Aeneas’ landing places. ARACNE treats this as cultural tradition, not as proven archaeological fact.",
          "es": "La tradición literaria identifica Porto Badisco como uno de los desembarcos de Eneas. ARACNE lo trata como tradición cultural, no como hecho arqueológico demostrado."
        },
        "highlights": {
          "it": [
            "mito di Enea",
            "costa di Porto Badisco"
          ],
          "fr": [
            "mythe d’Énée",
            "côte de Porto Badisco"
          ],
          "en": [
            "Aeneas tradition",
            "Porto Badisco coast"
          ],
          "es": [
            "mito de Eneas",
            "costa de Porto Badisco"
          ]
        }
      },
      "acquaviva": {
        "poiId": "acquaviva",
        "territoryIds": [
          "diso"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "sea",
          "springs",
          "cove"
        ],
        "sourceIds": [
          "tourpuglia-acquaviva",
          "italia-cammino-salento"
        ],
        "summary": {
          "it": "Cala dell’Acquaviva è una stretta insenatura di Marina di Marittima, nel comune di Diso, dove sorgenti di acqua dolce e fredda raggiungono il mare fra pareti rocciose e vegetazione.",
          "fr": "Cala dell’Acquaviva est une étroite crique de Marina di Marittima, dans la commune de Diso, où des sources d’eau douce et fraîche rejoignent la mer entre rochers et végétation.",
          "en": "Cala dell’Acquaviva is a narrow inlet at Marina di Marittima in the municipality of Diso, where cool freshwater springs reach the sea between rocky walls and vegetation.",
          "es": "Cala dell’Acquaviva es una estrecha cala de Marina di Marittima, en el municipio de Diso, donde manantiales de agua dulce y fría llegan al mar entre rocas y vegetación."
        },
        "why": {
          "it": "Il nome richiama direttamente le sorgenti di acqua dolce e fresca che caratterizzano la cala.",
          "fr": "Le nom fait directement référence aux sources d’eau douce et fraîche qui caractérisent la crique.",
          "en": "The name directly refers to the cool freshwater springs that characterise the cove.",
          "es": "El nombre hace referencia directa a los manantiales de agua dulce y fresca que caracterizan la cala."
        },
        "highlights": {
          "it": [
            "sorgenti fredde",
            "insenatura stretta",
            "acqua trasparente"
          ],
          "fr": [
            "sources froides",
            "crique étroite",
            "eau transparente"
          ],
          "en": [
            "cool springs",
            "narrow inlet",
            "clear water"
          ],
          "es": [
            "manantiales fríos",
            "cala estrecha",
            "agua transparente"
          ]
        }
      },
      "ripe": {
        "poiId": "ripe",
        "territoryIds": [
          "tricase"
        ],
        "confidence": "legacy-pending",
        "verificationStatus": "legacy-pending",
        "themes": [
          "coastal-tower",
          "history"
        ],
        "sourceIds": [
          "parco-otranto-leuca-comuni"
        ],
        "summary": {
          "it": "Torre di Ripe è conservata come POI storico nella base HIRUNDU del basso Salento; la denominazione e la posizione esatte richiedono ancora una verifica documentaria puntuale.",
          "fr": "Torre di Ripe est conservée comme POI historique dans la base HIRUNDU du bas Salento ; son appellation et sa position exactes nécessitent encore une vérification documentaire précise.",
          "en": "Torre di Ripe is retained as a historical lower-Salento POI in HIRUNDU; its exact name and location still require point-by-point documentary verification.",
          "es": "Torre di Ripe se conserva como POI histórico del bajo Salento en HIRUNDU; su denominación y ubicación exactas aún requieren una verificación documental específica."
        },
        "highlights": {
          "it": [
            "sistema delle torri costiere",
            "paesaggio del Capo di Leuca"
          ],
          "fr": [
            "système des tours côtières",
            "paysage du Cap de Leuca"
          ],
          "en": [
            "coastal-tower network",
            "Capo di Leuca landscape"
          ],
          "es": [
            "red de torres costeras",
            "paisaje del Capo di Leuca"
          ]
        }
      },
      "verde": {
        "poiId": "verde",
        "territoryIds": [
          "andrano"
        ],
        "confidence": "medium",
        "verificationStatus": "verified",
        "themes": [
          "sea",
          "cave",
          "light"
        ],
        "sourceIds": [
          "parco-otranto-leuca-itinerari"
        ],
        "summary": {
          "it": "Grotta Verde, lungo la costa di Andrano, è una cavità marina nota per i riflessi verdi prodotti dalla luce che penetra nell’acqua e si riflette sulle pareti della grotta.",
          "fr": "Grotta Verde, sur la côte d’Andrano, est une cavité marine connue pour les reflets verts produits par la lumière dans l’eau et sur les parois rocheuses.",
          "en": "Grotta Verde on the Andrano coast is a sea cave known for the green reflections created as light enters the water and bounces off the cave walls.",
          "es": "Grotta Verde, en la costa de Andrano, es una cueva marina conocida por los reflejos verdes producidos por la luz en el agua y las paredes rocosas."
        },
        "highlights": {
          "it": [
            "riflessi verdi",
            "grotta marina",
            "costa rocciosa di Andrano"
          ],
          "fr": [
            "reflets verts",
            "grotte marine",
            "côte rocheuse d’Andrano"
          ],
          "en": [
            "green reflections",
            "sea cave",
            "Andrano rocky coast"
          ],
          "es": [
            "reflejos verdes",
            "cueva marina",
            "costa rocosa de Andrano"
          ]
        }
      },
      "caprarica": {
        "poiId": "caprarica",
        "territoryIds": [
          "tricase"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "castle",
          "renaissance",
          "fortification"
        ],
        "sourceIds": [
          "parco-otranto-leuca-comuni",
          "tricase-caprarica"
        ],
        "summary": {
          "it": "Il Castello di Caprarica del Capo, frazione di Tricase, è una fortezza del primo Cinquecento a pianta rettangolare, rafforzata da torri circolari agli angoli.",
          "fr": "Le château de Caprarica del Capo, hameau de Tricase, est une forteresse du début du XVIe siècle de plan rectangulaire, renforcée par des tours circulaires aux angles.",
          "en": "Caprarica del Capo Castle, in the municipality of Tricase, is an early-16th-century rectangular fortress reinforced by circular corner towers.",
          "es": "El Castillo de Caprarica del Capo, en el municipio de Tricase, es una fortaleza de comienzos del siglo XVI de planta rectangular, reforzada por torres circulares en las esquinas."
        },
        "history": {
          "it": "Una fonte del Parco ricorda la costruzione del castello nel 1524. Il borgo di Caprarica ha origini medievali ed entrò nei domini di diverse famiglie feudali del Capo di Leuca.",
          "fr": "Une source du parc mentionne la construction du château en 1524. Le bourg de Caprarica a des origines médiévales et passa sous le contrôle de plusieurs familles féodales du Cap de Leuca.",
          "en": "A park source records the castle’s construction in 1524. Caprarica itself has medieval origins and passed through several feudal families of the Capo di Leuca area.",
          "es": "Una fuente del parque sitúa la construcción del castillo en 1524. Caprarica tiene orígenes medievales y pasó por varias familias feudales del Capo di Leuca."
        },
        "highlights": {
          "it": [
            "torri circolari",
            "mura in carparo",
            "portale difeso da caditoie"
          ],
          "fr": [
            "tours circulaires",
            "murs en carparo",
            "portail défendu par des mâchicoulis"
          ],
          "en": [
            "circular towers",
            "carparo-stone walls",
            "defended entrance"
          ],
          "es": [
            "torres circulares",
            "muros de carparo",
            "entrada defendida"
          ]
        }
      },
      "treporte": {
        "poiId": "treporte",
        "territoryIds": [
          "leuca"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "sea-cave",
          "geology",
          "prehistory"
        ],
        "sourceIds": [
          "visitpuglia-leuca"
        ],
        "summary": {
          "it": "La Grotta delle Tre Porte, sul versante di ponente di Santa Maria di Leuca, deve il nome alle tre grandi aperture naturali che introducono in una vasta cavità marina.",
          "fr": "La Grotta delle Tre Porte, sur le versant ouest de Santa Maria di Leuca, doit son nom aux trois grandes ouvertures naturelles donnant accès à une vaste cavité marine.",
          "en": "Grotta delle Tre Porte, on the western side of Santa Maria di Leuca, takes its name from the three large natural openings leading into a broad sea cave.",
          "es": "La Grotta delle Tre Porte, en el lado occidental de Santa Maria di Leuca, debe su nombre a las tres grandes aberturas naturales que dan acceso a una amplia cueva marina."
        },
        "history": {
          "it": "Nella vicina Grotta del Bambino sono stati rinvenuti resti neandertaliani e fossili di grandi mammiferi, elemento che aggiunge interesse preistorico al complesso.",
          "fr": "Dans la proche Grotta del Bambino, des restes néandertaliens et des fossiles de grands mammifères ont été retrouvés, ajoutant un intérêt préhistorique au complexe.",
          "en": "Nearby Grotta del Bambino yielded Neanderthal remains and fossils of large mammals, adding prehistoric interest to the cave complex.",
          "es": "En la cercana Grotta del Bambino se hallaron restos neandertales y fósiles de grandes mamíferos, lo que añade interés prehistórico al conjunto."
        },
        "highlights": {
          "it": [
            "tre grandi archi naturali",
            "Grotta del Bambino",
            "paesaggio delle falesie di Leuca"
          ],
          "fr": [
            "trois grands arcs naturels",
            "Grotta del Bambino",
            "falaises de Leuca"
          ],
          "en": [
            "three natural arches",
            "Grotta del Bambino",
            "Leuca cliff landscape"
          ],
          "es": [
            "tres grandes arcos naturales",
            "Grotta del Bambino",
            "acantilados de Leuca"
          ]
        }
      },
      "ugento": {
        "poiId": "ugento",
        "territoryIds": [
          "ugento"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "wetlands",
          "dunes",
          "mediterranean-scrub"
        ],
        "sourceIds": [
          "ugento-park"
        ],
        "summary": {
          "it": "Il Parco Naturale Regionale Litorale di Ugento protegge circa 9 km di costa con dune, bacini, canali, zone umide, pinete e una delle più estese aree di macchia mediterranea del Salento.",
          "fr": "Le Parc naturel régional du littoral d’Ugento protège environ 9 km de côte avec dunes, bassins, canaux, zones humides, pinèdes et l’un des plus vastes maquis méditerranéens du Salento.",
          "en": "The Litorale di Ugento Regional Natural Park protects about 9 km of coast with dunes, basins, canals, wetlands, pine woods and one of Salento’s largest expanses of Mediterranean scrub.",
          "es": "El Parque Natural Regional del Litoral de Ugento protege unos 9 km de costa con dunas, lagunas, canales, humedales, pinares y una de las mayores extensiones de matorral mediterráneo del Salento."
        },
        "nature": {
          "it": "Il parco, istituito nel 2007, copre circa 1.626 ettari e comprende habitat dunali, retrodunali, palustri e sistemi carsici dell’entroterra.",
          "fr": "Le parc, créé en 2007, couvre environ 1 626 hectares et comprend des habitats dunaires, arrière-dunaires, marécageux et des systèmes karstiques intérieurs.",
          "en": "Established in 2007, the park covers about 1,626 hectares and includes dune, back-dune and wetland habitats as well as inland karst systems.",
          "es": "Creado en 2007, el parque abarca unas 1.626 hectáreas e incluye hábitats de dunas, retrodunas, humedales y sistemas kársticos interiores."
        },
        "highlights": {
          "it": [
            "dune costiere",
            "bacini e zone umide",
            "macchia mediterranea",
            "gravinelle carsiche"
          ],
          "fr": [
            "dunes côtières",
            "bassins et zones humides",
            "maquis méditerranéen",
            "ravins karstiques"
          ],
          "en": [
            "coastal dunes",
            "wetland basins",
            "Mediterranean scrub",
            "karst ravines"
          ],
          "es": [
            "dunas costeras",
            "lagunas y humedales",
            "matorral mediterráneo",
            "barrancos kársticos"
          ]
        }
      },
      "casale": {
        "poiId": "casale",
        "territoryIds": [
          "ugento"
        ],
        "confidence": "medium",
        "verificationStatus": "verified",
        "themes": [
          "church",
          "rural-history",
          "religious"
        ],
        "sourceIds": [
          "ugento-park"
        ],
        "summary": {
          "it": "La Madonna del Casale è una chiesa rurale del territorio di Ugento, inserita nel paesaggio storico dell’entroterra costiero.",
          "fr": "La Madonna del Casale est une église rurale du territoire d’Ugento, intégrée au paysage historique de l’arrière-pays côtier.",
          "en": "Madonna del Casale is a rural church in the Ugento area, set within the historic landscape behind the coast.",
          "es": "Madonna del Casale es una iglesia rural del territorio de Ugento, integrada en el paisaje histórico del interior costero."
        },
        "history": {
          "it": "Fonti comunali descrivono Santa Maria del Casale come un eremo di origine medievale; la scheda HIRUNDU conserva il luogo come testimonianza religiosa rurale.",
          "fr": "Des sources communales décrivent Santa Maria del Casale comme un ermitage d’origine médiévale ; HIRUNDU le conserve comme témoignage religieux rural.",
          "en": "Municipal sources describe Santa Maria del Casale as a medieval-origin hermitage; HIRUNDU retains it as a rural religious heritage site.",
          "es": "Fuentes municipales describen Santa Maria del Casale como una ermita de origen medieval; HIRUNDU la conserva como testimonio religioso rural."
        },
        "highlights": {
          "it": [
            "chiesa rurale",
            "paesaggio dell’entroterra di Ugento"
          ],
          "fr": [
            "église rurale",
            "paysage intérieur d’Ugento"
          ],
          "en": [
            "rural church",
            "Ugento hinterland landscape"
          ],
          "es": [
            "iglesia rural",
            "paisaje interior de Ugento"
          ]
        }
      },
      "giurupi": {
        "poiId": "giurupi",
        "territoryIds": [
          "ugento"
        ],
        "confidence": "legacy-pending",
        "verificationStatus": "legacy-pending",
        "themes": [
          "architecture",
          "historic-building"
        ],
        "sourceIds": [],
        "summary": {
          "it": "«Palazzo Giurupi» è presente nella base storica HIRUNDU come POI culturale, ma l’identificazione monumentale e la localizzazione esatta non sono ancora sufficientemente documentate.",
          "fr": "« Palazzo Giurupi » figure dans l’ancienne base HIRUNDU comme POI culturel, mais son identification monumentale et sa localisation exacte ne sont pas encore suffisamment documentées.",
          "en": "“Palazzo Giurupi” is present in the legacy HIRUNDU dataset as a cultural POI, but its exact monument identification and location are not yet sufficiently documented.",
          "es": "«Palazzo Giurupi» figura en la base histórica de HIRUNDU como POI cultural, pero su identificación monumental y ubicación exacta aún no están suficientemente documentadas."
        },
        "highlights": {
          "it": [
            "scheda da verificare"
          ],
          "fr": [
            "fiche à vérifier"
          ],
          "en": [
            "record pending verification"
          ],
          "es": [
            "ficha pendiente de verificación"
          ]
        }
      },
      "santandrea_gallipoli": {
        "poiId": "santandrea_gallipoli",
        "territoryIds": [
          "gallipoli"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "island",
          "birdlife",
          "protected-area"
        ],
        "sourceIds": [
          "gallipoli-park"
        ],
        "summary": {
          "it": "L’Isola di Sant’Andrea, davanti a Gallipoli, è il cuore insulare del parco naturale regionale che comprende anche il litorale di Punta Pizzo.",
          "fr": "L’île de Sant’Andrea, face à Gallipoli, est le cœur insulaire du parc naturel régional qui comprend aussi le littoral de Punta Pizzo.",
          "en": "Sant’Andrea Island, off Gallipoli, is the island core of the regional nature park that also includes the Punta Pizzo coastline.",
          "es": "La isla de Sant’Andrea, frente a Gallipoli, es el núcleo insular del parque natural regional que también incluye el litoral de Punta Pizzo."
        },
        "nature": {
          "it": "L’isola ospita habitat costieri prioritari e una colonia nidificante di gabbiano corso, specie di grande interesse conservazionistico nel Mediterraneo.",
          "fr": "L’île abrite des habitats côtiers prioritaires et une colonie nicheuse de goéland d’Audouin, espèce méditerranéenne de grand intérêt pour la conservation.",
          "en": "The island supports priority coastal habitats and a breeding colony of Audouin’s gull, a Mediterranean species of major conservation interest.",
          "es": "La isla alberga hábitats costeros prioritarios y una colonia reproductora de gaviota de Audouin, especie mediterránea de gran interés de conservación."
        },
        "highlights": {
          "it": [
            "faro e isola",
            "gabbiano corso",
            "parco Punta Pizzo"
          ],
          "fr": [
            "phare et île",
            "goéland d’Audouin",
            "parc Punta Pizzo"
          ],
          "en": [
            "island and lighthouse",
            "Audouin’s gull",
            "Punta Pizzo park"
          ],
          "es": [
            "isla y faro",
            "gaviota de Audouin",
            "parque Punta Pizzo"
          ]
        }
      },
      "montagna": {
        "poiId": "montagna",
        "territoryIds": [
          "nardo"
        ],
        "confidence": "medium",
        "verificationStatus": "verified",
        "themes": [
          "coast",
          "cliff",
          "landscape"
        ],
        "sourceIds": [
          "visitnardo-marinas"
        ],
        "summary": {
          "it": "La Montagna Spaccata è un tratto scenografico della costa ionica nell’area fra le marine di Nardò e Lido Conchiglie, riconoscibile per il taglio della roccia attraversato dalla strada litoranea.",
          "fr": "La Montagna Spaccata est un secteur spectaculaire de la côte ionienne entre les marinas de Nardò et Lido Conchiglie, reconnaissable à la coupure de la roche traversée par la route côtière.",
          "en": "Montagna Spaccata is a striking Ionian-coast landmark between Nardò’s seaside area and Lido Conchiglie, recognisable by the road cutting through the rock.",
          "es": "La Montagna Spaccata es un paisaje destacado de la costa jónica entre la zona costera de Nardò y Lido Conchiglie, reconocible por el corte de la roca atravesado por la carretera."
        },
        "highlights": {
          "it": [
            "taglio nella roccia",
            "panorama ionico",
            "collegamento fra marine"
          ],
          "fr": [
            "entaille dans la roche",
            "panorama ionien",
            "liaison entre stations balnéaires"
          ],
          "en": [
            "rock cutting",
            "Ionian panorama",
            "coastal connection"
          ],
          "es": [
            "corte en la roca",
            "panorama jónico",
            "conexión costera"
          ]
        },
        "notes": "The legacy POI label says Gallipoli; territorial sources place Montagna Spaccata in the Nardò/Lido Conchiglie coastal area."
      },
      "fiume": {
        "poiId": "fiume",
        "territoryIds": [
          "nardo"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "coastal-tower",
          "freshwater",
          "history"
        ],
        "sourceIds": [
          "visitnardo-fiume"
        ],
        "summary": {
          "it": "Torre del Fiume, oggi nota come Quattro Colonne, è ciò che resta di una fortezza costiera costruita presso una sorgente d’acqua dolce a Santa Maria al Bagno.",
          "fr": "Torre del Fiume, aujourd’hui connue comme les Quattro Colonne, est ce qui reste d’une forteresse côtière construite près d’une source d’eau douce à Santa Maria al Bagno.",
          "en": "Torre del Fiume, now known as Quattro Colonne, is the surviving part of a coastal fortress built beside a freshwater spring at Santa Maria al Bagno.",
          "es": "Torre del Fiume, hoy conocida como Quattro Colonne, es lo que queda de una fortaleza costera construida junto a un manantial de agua dulce en Santa Maria al Bagno."
        },
        "history": {
          "it": "La torre fu completata all’inizio del Seicento per proteggere la sorgente dagli approvvigionamenti dei corsari. Il corpo centrale crollò e oggi restano i quattro bastioni angolari.",
          "fr": "La tour fut achevée au début du XVIIe siècle pour protéger la source des ravitaillements des corsaires. Le corps central s’effondra et il reste aujourd’hui les quatre bastions d’angle.",
          "en": "The tower was completed in the early 17th century to protect the spring from corsair resupply. Its central body collapsed, leaving the four corner bastions.",
          "es": "La torre se completó a comienzos del siglo XVII para proteger el manantial del aprovisionamiento de corsarios. El cuerpo central se derrumbó y hoy quedan los cuatro bastiones angulares."
        },
        "highlights": {
          "it": [
            "Quattro Colonne",
            "antica sorgente",
            "sistema difensivo costiero"
          ],
          "fr": [
            "Quattro Colonne",
            "ancienne source",
            "système défensif côtier"
          ],
          "en": [
            "Quattro Colonne",
            "historic spring",
            "coastal defence system"
          ],
          "es": [
            "Quattro Colonne",
            "antiguo manantial",
            "sistema defensivo costero"
          ]
        }
      },
      "cavallo": {
        "poiId": "cavallo",
        "territoryIds": [
          "nardo"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "prehistory",
          "archaeology",
          "cave"
        ],
        "sourceIds": [
          "visitnardo-uluzzo",
          "visitnardo-park"
        ],
        "summary": {
          "it": "Grotta del Cavallo, nella Baia di Uluzzo, è uno dei siti preistorici più importanti del territorio di Nardò e ha dato il nome alla cultura paleolitica detta Uluzziano.",
          "fr": "La Grotta del Cavallo, dans la baie d’Uluzzo, est l’un des sites préhistoriques les plus importants du territoire de Nardò et a donné son nom à la culture paléolithique dite Uluzzienne.",
          "en": "Grotta del Cavallo in Uluzzo Bay is one of Nardò’s most important prehistoric sites and gave its name to the Upper-Palaeolithic Uluzzian culture.",
          "es": "La Grotta del Cavallo, en la bahía de Uluzzo, es uno de los yacimientos prehistóricos más importantes de Nardò y dio nombre a la cultura paleolítica Uluzziense."
        },
        "highlights": {
          "it": [
            "Baia di Uluzzo",
            "preistoria europea",
            "cultura uluzziana"
          ],
          "fr": [
            "baie d’Uluzzo",
            "préhistoire européenne",
            "culture uluzzienne"
          ],
          "en": [
            "Uluzzo Bay",
            "European prehistory",
            "Uluzzian culture"
          ],
          "es": [
            "bahía de Uluzzo",
            "prehistoria europea",
            "cultura uluzziense"
          ]
        }
      },
      "uluzzo": {
        "poiId": "uluzzo",
        "territoryIds": [
          "nardo"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "coastal-tower",
          "prehistory",
          "sunset"
        ],
        "sourceIds": [
          "visitnardo-uluzzo"
        ],
        "summary": {
          "it": "Torre Uluzzo è una torre costiera cinquecentesca in rovina, posta sulla falesia presso Porto Selvaggio e affacciata sulla baia che ospita importanti siti preistorici.",
          "fr": "Torre Uluzzo est une tour côtière du XVIe siècle en ruine, dressée sur la falaise près de Porto Selvaggio et dominant une baie riche en sites préhistoriques.",
          "en": "Torre Uluzzo is a ruined 16th-century coastal tower on the cliff near Porto Selvaggio, overlooking a bay rich in prehistoric sites.",
          "es": "Torre Uluzzo es una torre costera en ruinas del siglo XVI, situada sobre el acantilado cerca de Porto Selvaggio y dominando una bahía rica en yacimientos prehistóricos."
        },
        "history": {
          "it": "La costruzione fu affidata nel 1568. La torre comunicava visivamente con Torre dell’Alto e Torre Inserraglio e venne restaurata e messa in sicurezza nel 2020.",
          "fr": "La construction fut confiée en 1568. La tour communiquait visuellement avec Torre dell’Alto et Torre Inserraglio et fut restaurée et sécurisée en 2020.",
          "en": "Construction was commissioned in 1568. The tower communicated visually with Torre dell’Alto and Torre Inserraglio and was restored and secured in 2020.",
          "es": "La construcción fue encargada en 1568. La torre se comunicaba visualmente con Torre dell’Alto y Torre Inserraglio y fue restaurada y asegurada en 2020."
        },
        "highlights": {
          "it": [
            "rovine della torre",
            "Baia di Uluzzo",
            "tramonto sullo Ionio"
          ],
          "fr": [
            "ruines de la tour",
            "baie d’Uluzzo",
            "coucher de soleil ionien"
          ],
          "en": [
            "tower ruins",
            "Uluzzo Bay",
            "Ionian sunset"
          ],
          "es": [
            "ruinas de la torre",
            "bahía de Uluzzo",
            "puesta de sol jónica"
          ]
        }
      },
      "capitano": {
        "poiId": "capitano",
        "territoryIds": [
          "nardo"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "wetland",
          "karst",
          "nature"
        ],
        "sourceIds": [
          "visitnardo-park"
        ],
        "summary": {
          "it": "Palude del Capitano è una zona umida carsica del Parco di Porto Selvaggio, caratterizzata dalle «spundurate», doline di crollo nelle quali affiora l’acqua.",
          "fr": "Palude del Capitano est une zone humide karstique du parc de Porto Selvaggio, caractérisée par les « spundurate », dolines d’effondrement où l’eau affleure.",
          "en": "Palude del Capitano is a karst wetland in Porto Selvaggio Park, characterised by “spundurate”, collapse sinkholes where water reaches the surface.",
          "es": "Palude del Capitano es un humedal kárstico del Parque de Porto Selvaggio, caracterizado por las «spundurate», dolinas de colapso donde aflora el agua."
        },
        "nature": {
          "it": "L’area unisce ambienti umidi, vegetazione mediterranea e fenomeni carsici, ed è uno dei nuclei naturalistici più delicati del parco.",
          "fr": "La zone associe milieux humides, végétation méditerranéenne et phénomènes karstiques, et constitue l’un des secteurs naturels les plus sensibles du parc.",
          "en": "The area combines wetlands, Mediterranean vegetation and karst phenomena, forming one of the park’s most sensitive natural zones.",
          "es": "La zona combina humedales, vegetación mediterránea y fenómenos kársticos, y constituye uno de los sectores naturales más delicados del parque."
        },
        "highlights": {
          "it": [
            "spundurate",
            "zona umida carsica",
            "macchia mediterranea"
          ],
          "fr": [
            "spundurate",
            "zone humide karstique",
            "maquis méditerranéen"
          ],
          "en": [
            "spundurate sinkholes",
            "karst wetland",
            "Mediterranean scrub"
          ],
          "es": [
            "spundurate",
            "humedal kárstico",
            "matorral mediterráneo"
          ]
        }
      },
      "frascone": {
        "poiId": "frascone",
        "territoryIds": [
          "nardo"
        ],
        "confidence": "medium",
        "verificationStatus": "verified",
        "themes": [
          "sea",
          "protected-coast",
          "nature"
        ],
        "sourceIds": [
          "visitnardo-park"
        ],
        "summary": {
          "it": "La Spiaggia del Frascone si trova lungo il litorale protetto a nord di Porto Selvaggio, in un paesaggio ionico di rocce basse, piccole insenature e vegetazione mediterranea.",
          "fr": "La plage du Frascone se trouve sur le littoral protégé au nord de Porto Selvaggio, dans un paysage ionien de rochers bas, petites criques et végétation méditerranéenne.",
          "en": "Frascone beach lies on the protected coast north of Porto Selvaggio, in an Ionian landscape of low rocks, small coves and Mediterranean vegetation.",
          "es": "La playa del Frascone se encuentra en la costa protegida al norte de Porto Selvaggio, en un paisaje jónico de rocas bajas, pequeñas calas y vegetación mediterránea."
        },
        "highlights": {
          "it": [
            "costa protetta",
            "piccole cale",
            "mare ionico"
          ],
          "fr": [
            "côte protégée",
            "petites criques",
            "mer Ionienne"
          ],
          "en": [
            "protected coast",
            "small coves",
            "Ionian Sea"
          ],
          "es": [
            "costa protegida",
            "pequeñas calas",
            "mar Jónico"
          ]
        }
      },
      "chianca": {
        "poiId": "chianca",
        "territoryIds": [
          "porto_cesareo"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "coastal-tower",
          "sea",
          "history"
        ],
        "sourceIds": [
          "portocesareo-torri",
          "visitpuglia-portocesareo"
        ],
        "summary": {
          "it": "Torre Chianca, detta anche Torre Santo Stefano, è una torre costiera cinquecentesca su una penisola a nord di Porto Cesareo, affacciata su bassi fondali sabbiosi.",
          "fr": "Torre Chianca, également appelée Torre Santo Stefano, est une tour côtière du XVIe siècle sur une péninsule au nord de Porto Cesareo, face à de faibles fonds sableux.",
          "en": "Torre Chianca, also called Torre Santo Stefano, is a 16th-century coastal watchtower on a peninsula north of Porto Cesareo, overlooking shallow sandy waters.",
          "es": "Torre Chianca, también llamada Torre Santo Stefano, es una torre costera del siglo XVI situada en una península al norte de Porto Cesareo, frente a aguas arenosas poco profundas."
        },
        "history": {
          "it": "La torre faceva parte della rete difensiva costiera del Cinquecento e comunicava con Torre Cesarea e Torre Lapillo.",
          "fr": "La tour faisait partie du réseau défensif côtier du XVIe siècle et communiquait avec Torre Cesarea et Torre Lapillo.",
          "en": "The tower formed part of the 16th-century coastal defence network and communicated with Torre Cesarea and Torre Lapillo.",
          "es": "La torre formaba parte de la red defensiva costera del siglo XVI y se comunicaba con Torre Cesarea y Torre Lapillo."
        },
        "highlights": {
          "it": [
            "torre costiera",
            "fondali bassi",
            "sistema difensivo cinquecentesco"
          ],
          "fr": [
            "tour côtière",
            "fonds peu profonds",
            "système défensif du XVIe siècle"
          ],
          "en": [
            "coastal tower",
            "shallow water",
            "16th-century defence network"
          ],
          "es": [
            "torre costera",
            "fondos poco profundos",
            "red defensiva del siglo XVI"
          ]
        }
      },
      "conigli": {
        "poiId": "conigli",
        "territoryIds": [
          "porto_cesareo"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "island",
          "nature",
          "sea"
        ],
        "sourceIds": [
          "portocesareo-conigli",
          "visitpuglia-portocesareo"
        ],
        "summary": {
          "it": "L’Isola dei Conigli, storicamente Isola Grande, è un isolotto molto vicino al centro di Porto Cesareo, ricoperto da vegetazione mediterranea e pineta.",
          "fr": "L’Isola dei Conigli, historiquement Isola Grande, est un îlot très proche du centre de Porto Cesareo, couvert de végétation méditerranéenne et de pinède.",
          "en": "Isola dei Conigli, historically Isola Grande, is an islet very close to central Porto Cesareo, covered with Mediterranean vegetation and pine woodland.",
          "es": "La Isola dei Conigli, históricamente Isola Grande, es un islote muy próximo al centro de Porto Cesareo, cubierto de vegetación mediterránea y pinar."
        },
        "why": {
          "it": "Il nome moderno deriva dalla presenza, soprattutto nel Novecento, di allevamenti di conigli lasciati sull’isola.",
          "fr": "Le nom moderne vient de la présence, surtout au XXe siècle, d’élevages de lapins installés sur l’île.",
          "en": "The modern name comes from rabbit colonies kept on the island, particularly in the 20th century.",
          "es": "El nombre moderno procede de las colonias de conejos criadas en la isla, especialmente durante el siglo XX."
        },
        "highlights": {
          "it": [
            "isolotto vicino alla costa",
            "macchia mediterranea",
            "pineta"
          ],
          "fr": [
            "îlot proche du rivage",
            "maquis méditerranéen",
            "pinède"
          ],
          "en": [
            "nearshore islet",
            "Mediterranean scrub",
            "pine woodland"
          ],
          "es": [
            "islote próximo a la costa",
            "matorral mediterráneo",
            "pinar"
          ]
        }
      },
      "santandrea": {
        "poiId": "santandrea",
        "territoryIds": [
          "melendugno"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "sea",
          "sea-stack",
          "coast"
        ],
        "sourceIds": [
          "visitmelendugno",
          "visitmelendugno-poi"
        ],
        "summary": {
          "it": "Il faraglione di Sant’Andrea appartiene alla spettacolare costa di Melendugno, dove il calcare chiaro è modellato dal mare in archi, pilastri e scogli isolati.",
          "fr": "Le faraglione de Sant’Andrea appartient à la spectaculaire côte de Melendugno, où le calcaire clair est sculpté par la mer en arches, piliers et rochers isolés.",
          "en": "The Sant’Andrea sea stack belongs to Melendugno’s spectacular coast, where pale limestone is sculpted by the sea into arches, pillars and isolated rocks.",
          "es": "El farallón de Sant’Andrea forma parte de la espectacular costa de Melendugno, donde la caliza clara es esculpida por el mar en arcos, pilares y rocas aisladas."
        },
        "highlights": {
          "it": [
            "faraglioni bianchi",
            "archi naturali",
            "mare Adriatico"
          ],
          "fr": [
            "faraglioni blancs",
            "arches naturelles",
            "Adriatique"
          ],
          "en": [
            "white sea stacks",
            "natural arches",
            "Adriatic Sea"
          ],
          "es": [
            "farallones blancos",
            "arcos naturales",
            "mar Adriático"
          ]
        }
      },
      "sorelle": {
        "poiId": "sorelle",
        "territoryIds": [
          "melendugno"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "sea",
          "legend",
          "sea-stacks"
        ],
        "sourceIds": [
          "visitmelendugno",
          "visitpuglia-otranto-guide"
        ],
        "summary": {
          "it": "Le Due Sorelle sono i due celebri faraglioni che emergono davanti alla spiaggia di Torre dell’Orso, una delle immagini più riconoscibili della costa di Melendugno.",
          "fr": "Les Due Sorelle sont les deux célèbres stacks qui émergent devant la plage de Torre dell’Orso, l’une des images les plus reconnaissables de la côte de Melendugno.",
          "en": "Le Due Sorelle are the two famous sea stacks off Torre dell’Orso beach, one of the most recognisable images of the Melendugno coastline.",
          "es": "Le Due Sorelle son los dos famosos farallones frente a la playa de Torre dell’Orso, una de las imágenes más reconocibles de la costa de Melendugno."
        },
        "myth": {
          "it": "La leggenda locale racconta di due sorelle trasformate dagli dei nei due scogli. È una tradizione narrativa, non un fatto storico.",
          "fr": "La légende locale raconte que deux sœurs furent transformées par les dieux en deux rochers. Il s’agit d’une tradition narrative, non d’un fait historique.",
          "en": "Local legend tells of two sisters transformed by the gods into the two rocks. This is a narrative tradition, not a historical fact.",
          "es": "La leyenda local cuenta que dos hermanas fueron transformadas por los dioses en los dos peñascos. Es una tradición narrativa, no un hecho histórico."
        },
        "highlights": {
          "it": [
            "due faraglioni",
            "spiaggia di Torre dell’Orso",
            "leggenda locale"
          ],
          "fr": [
            "deux stacks",
            "plage de Torre dell’Orso",
            "légende locale"
          ],
          "en": [
            "twin sea stacks",
            "Torre dell’Orso beach",
            "local legend"
          ],
          "es": [
            "dos farallones",
            "playa de Torre dell’Orso",
            "leyenda local"
          ]
        }
      },
      "grottella": {
        "poiId": "grottella",
        "territoryIds": [
          "copertino"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "religious",
          "saint-joseph",
          "history"
        ],
        "sourceIds": [
          "copertino-grottella"
        ],
        "summary": {
          "it": "Il Santuario della Grottella, poco fuori Copertino, è legato alla devozione mariana e alla biografia di San Giuseppe da Copertino.",
          "fr": "Le sanctuaire de la Grottella, juste à l’extérieur de Copertino, est lié à la dévotion mariale et à la vie de saint Joseph de Copertino.",
          "en": "The Grottella Sanctuary, just outside Copertino, is linked to Marian devotion and the life of Saint Joseph of Copertino.",
          "es": "El Santuario de la Grottella, a las afueras de Copertino, está ligado a la devoción mariana y a la vida de San José de Copertino."
        },
        "history": {
          "it": "L’attuale chiesa fu edificata nel 1577 sul luogo dove era stata ritrovata un’icona mariana; dal Seicento il complesso passò ai francescani e fu profondamente legato alla vocazione di Giuseppe Maria Desa.",
          "fr": "L’église actuelle fut édifiée en 1577 sur le lieu où une icône mariale avait été découverte ; au XVIIe siècle, le complexe passa aux franciscains et fut fortement lié à la vocation de Giuseppe Maria Desa.",
          "en": "The present church was built in 1577 where a Marian icon had been found; in the 17th century the complex passed to the Franciscans and became closely linked with Giuseppe Maria Desa’s vocation.",
          "es": "La iglesia actual fue construida en 1577 en el lugar donde se halló un icono mariano; en el siglo XVII el complejo pasó a los franciscanos y quedó muy ligado a la vocación de Giuseppe Maria Desa."
        },
        "highlights": {
          "it": [
            "icona della Madonna",
            "luoghi di San Giuseppe da Copertino",
            "convento francescano"
          ],
          "fr": [
            "icône de la Vierge",
            "lieux de saint Joseph de Copertino",
            "couvent franciscain"
          ],
          "en": [
            "Marian icon",
            "Saint Joseph of Copertino sites",
            "Franciscan convent"
          ],
          "es": [
            "icono mariano",
            "lugares de San José de Copertino",
            "convento franciscano"
          ]
        }
      },
      "santacaterina": {
        "poiId": "santacaterina",
        "territoryIds": [
          "nardo"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "sea",
          "marina",
          "pinewood"
        ],
        "sourceIds": [
          "visitnardo-marinas",
          "visitnardo-santacaterina"
        ],
        "summary": {
          "it": "Santa Caterina è una marina di Nardò, raccolta attorno a una costa rocciosa con pineta e numerosi accessi al mare, fra Santa Maria al Bagno e Porto Selvaggio.",
          "fr": "Santa Caterina est une marina de Nardò, organisée autour d’une côte rocheuse avec pinède et nombreux accès à la mer, entre Santa Maria al Bagno et Porto Selvaggio.",
          "en": "Santa Caterina is a seaside settlement of Nardò, set around a rocky coast with pine woodland and many sea access points, between Santa Maria al Bagno and Porto Selvaggio.",
          "es": "Santa Caterina es una marina de Nardò, situada en una costa rocosa con pinar y numerosos accesos al mar, entre Santa Maria al Bagno y Porto Selvaggio."
        },
        "highlights": {
          "it": [
            "lungomare",
            "pineta",
            "Torre Santa Caterina"
          ],
          "fr": [
            "front de mer",
            "pinède",
            "Torre Santa Caterina"
          ],
          "en": [
            "seafront",
            "pine woodland",
            "Santa Caterina Tower"
          ],
          "es": [
            "paseo marítimo",
            "pinar",
            "Torre Santa Caterina"
          ]
        },
        "notes": "The legacy POI label says Gallipoli; official Nardò tourism sources place Santa Caterina in the municipality of Nardò."
      },
      "cesarea": {
        "poiId": "cesarea",
        "territoryIds": [
          "santa_cesarea"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "thermal",
          "architecture",
          "sea"
        ],
        "sourceIds": [
          "italia-santacesarea",
          "visitpuglia-portomiggiano"
        ],
        "summary": {
          "it": "Santa Cesarea Terme è una località adriatica costruita su terrazze rocciose, nota per le sorgenti termali sulfuree e per l’architettura eclettica e moresca affacciata sul mare.",
          "fr": "Santa Cesarea Terme est une localité adriatique bâtie sur des terrasses rocheuses, connue pour ses sources thermales sulfureuses et son architecture éclectique et mauresque face à la mer.",
          "en": "Santa Cesarea Terme is an Adriatic resort built on rocky terraces, known for sulphurous thermal springs and eclectic, Moorish-style architecture overlooking the sea.",
          "es": "Santa Cesarea Terme es una localidad adriática construida sobre terrazas rocosas, conocida por sus aguas termales sulfurosas y su arquitectura ecléctica y morisca frente al mar."
        },
        "nature": {
          "it": "Le acque termali sgorgano da grotte costiere naturali; il territorio ricade nel Parco Costa Otranto–Santa Maria di Leuca.",
          "fr": "Les eaux thermales jaillissent de grottes côtières naturelles ; le territoire appartient au parc Costa Otranto–Santa Maria di Leuca.",
          "en": "Thermal waters emerge from natural coastal caves; the area lies within the Costa Otranto–Santa Maria di Leuca regional park.",
          "es": "Las aguas termales brotan de cuevas costeras naturales; el territorio forma parte del parque Costa Otranto–Santa Maria di Leuca."
        },
        "highlights": {
          "it": [
            "acque termali",
            "Villa Sticchi",
            "costa rocciosa"
          ],
          "fr": [
            "eaux thermales",
            "Villa Sticchi",
            "côte rocheuse"
          ],
          "en": [
            "thermal waters",
            "Villa Sticchi",
            "rocky coast"
          ],
          "es": [
            "aguas termales",
            "Villa Sticchi",
            "costa rocosa"
          ]
        }
      },
      "suina": {
        "poiId": "suina",
        "territoryIds": [
          "gallipoli"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "beach",
          "protected-area",
          "pinewood"
        ],
        "sourceIds": [
          "visitgallipoli-puntasuina",
          "gallipoli-park"
        ],
        "summary": {
          "it": "Punta della Suina è un promontorio e sistema di piccole cale sabbiose nella parte meridionale del litorale di Gallipoli, dentro il Parco Isola di Sant’Andrea e Punta Pizzo.",
          "fr": "Punta della Suina est un promontoire et un ensemble de petites criques sableuses au sud du littoral de Gallipoli, dans le parc Isola di Sant’Andrea et Punta Pizzo.",
          "en": "Punta della Suina is a headland and series of small sandy coves on Gallipoli’s southern coast, within the Isola di Sant’Andrea and Punta Pizzo park.",
          "es": "Punta della Suina es un promontorio y conjunto de pequeñas calas arenosas en la costa sur de Gallipoli, dentro del parque Isola di Sant’Andrea y Punta Pizzo."
        },
        "nature": {
          "it": "La spiaggia alterna sabbia, scogli bassi, pineta e macchia mediterranea in un’area naturale protetta.",
          "fr": "La plage alterne sable, rochers bas, pinède et maquis méditerranéen dans une zone naturelle protégée.",
          "en": "The beach alternates sand, low rocks, pine woodland and Mediterranean scrub within a protected natural area.",
          "es": "La playa alterna arena, rocas bajas, pinar y matorral mediterráneo dentro de un espacio natural protegido."
        },
        "highlights": {
          "it": [
            "piccole cale",
            "pineta",
            "parco Punta Pizzo"
          ],
          "fr": [
            "petites criques",
            "pinède",
            "parc Punta Pizzo"
          ],
          "en": [
            "small coves",
            "pine woodland",
            "Punta Pizzo park"
          ],
          "es": [
            "pequeñas calas",
            "pinar",
            "parque Punta Pizzo"
          ]
        }
      },
      "monaci": {
        "poiId": "monaci",
        "territoryIds": [
          "manduria"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "wetland",
          "saltpan",
          "birdlife"
        ],
        "sourceIds": [
          "manduria-salina"
        ],
        "summary": {
          "it": "La Salina dei Monaci, presso Torre Colimena, è una storica salina costiera oggi inserita in un’area protetta di grande valore naturalistico.",
          "fr": "La Salina dei Monaci, près de Torre Colimena, est une ancienne saline côtière aujourd’hui intégrée à une zone protégée de grande valeur naturelle.",
          "en": "Salina dei Monaci, near Torre Colimena, is a historic coastal saltpan now within a protected area of major natural value.",
          "es": "La Salina dei Monaci, cerca de Torre Colimena, es una histórica salina costera hoy incluida en un espacio protegido de gran valor natural."
        },
        "history": {
          "it": "La salina deve il nome ai monaci benedettini di Aversa, che la gestirono fino al 1404; depositi e opere idrauliche ricordano la lunga attività di estrazione del sale.",
          "fr": "La saline doit son nom aux moines bénédictins d’Aversa, qui la gérèrent jusqu’en 1404 ; dépôts et ouvrages hydrauliques rappellent la longue activité d’extraction du sel.",
          "en": "The saltpan takes its name from the Benedictine monks of Aversa, who managed it until 1404; storage buildings and hydraulic works recall centuries of salt extraction.",
          "es": "La salina debe su nombre a los monjes benedictinos de Aversa, que la gestionaron hasta 1404; almacenes y obras hidráulicas recuerdan siglos de extracción de sal."
        },
        "nature": {
          "it": "È un habitat per vegetazione alofila e numerosi uccelli migratori, fra cui fenicotteri, cavalieri d’Italia e garzette.",
          "fr": "C’est un habitat pour la végétation halophile et de nombreux oiseaux migrateurs, dont flamants roses, échasses blanches et aigrettes.",
          "en": "It supports salt-tolerant vegetation and many migratory birds, including flamingos, black-winged stilts and egrets.",
          "es": "Alberga vegetación halófila y numerosas aves migratorias, entre ellas flamencos, cigüeñuelas y garcetas."
        },
        "highlights": {
          "it": [
            "fenicotteri",
            "dune e salina",
            "storia del sale"
          ],
          "fr": [
            "flamants roses",
            "dunes et saline",
            "histoire du sel"
          ],
          "en": [
            "flamingos",
            "dunes and saltpan",
            "salt-making history"
          ],
          "es": [
            "flamencos",
            "dunas y salina",
            "historia de la sal"
          ]
        }
      },
      "santamaria": {
        "poiId": "santamaria",
        "territoryIds": [
          "nardo"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "sea",
          "marina",
          "memory"
        ],
        "sourceIds": [
          "visitnardo-marinas"
        ],
        "summary": {
          "it": "Santa Maria al Bagno è una marina di Nardò raccolta attorno a una piccola baia e a una piazza affacciata sullo Ionio.",
          "fr": "Santa Maria al Bagno est une marina de Nardò organisée autour d’une petite baie et d’une place ouverte sur la mer Ionienne.",
          "en": "Santa Maria al Bagno is a seaside settlement of Nardò centred on a small bay and a square overlooking the Ionian Sea.",
          "es": "Santa Maria al Bagno es una marina de Nardò organizada alrededor de una pequeña bahía y una plaza frente al mar Jónico."
        },
        "highlights": {
          "it": [
            "piazza sul mare",
            "piccola baia",
            "tramonti ionici"
          ],
          "fr": [
            "place sur la mer",
            "petite baie",
            "couchers de soleil ioniens"
          ],
          "en": [
            "seafront square",
            "small bay",
            "Ionian sunsets"
          ],
          "es": [
            "plaza frente al mar",
            "pequeña bahía",
            "puestas de sol jónicas"
          ]
        }
      },
      "alimini": {
        "poiId": "alimini",
        "territoryIds": [
          "otranto"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "lakes",
          "wetland",
          "nature"
        ],
        "sourceIds": [
          "visitpuglia-otranto-guide"
        ],
        "summary": {
          "it": "I Laghi Alimini sono un sistema di laghi costieri e zone umide a nord di Otranto, circondato da pinete, macchia mediterranea e lunghi tratti di costa sabbiosa.",
          "fr": "Les lacs Alimini forment un système de lacs côtiers et de zones humides au nord d’Otranto, entouré de pinèdes, de maquis méditerranéen et de longues plages sableuses.",
          "en": "The Alimini Lakes form a system of coastal lakes and wetlands north of Otranto, surrounded by pine woods, Mediterranean scrub and long sandy shores.",
          "es": "Los Lagos Alimini forman un sistema de lagos costeros y humedales al norte de Otranto, rodeado de pinares, matorral mediterráneo y largas playas de arena."
        },
        "highlights": {
          "it": [
            "laghi costieri",
            "pineta",
            "zone umide"
          ],
          "fr": [
            "lacs côtiers",
            "pinède",
            "zones humides"
          ],
          "en": [
            "coastal lakes",
            "pine woods",
            "wetlands"
          ],
          "es": [
            "lagos costeros",
            "pinar",
            "humedales"
          ]
        }
      },
      "turchi": {
        "poiId": "turchi",
        "territoryIds": [
          "otranto"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "beach",
          "protected-area",
          "history"
        ],
        "sourceIds": [
          "visitpuglia-otranto-guide"
        ],
        "summary": {
          "it": "Baia dei Turchi è una baia sabbiosa a nord di Otranto, immersa nella pineta e nella macchia mediterranea di un tratto costiero protetto.",
          "fr": "Baia dei Turchi est une baie sableuse au nord d’Otranto, entourée de pinède et de maquis méditerranéen dans un secteur côtier protégé.",
          "en": "Baia dei Turchi is a sandy bay north of Otranto, surrounded by pine woodland and Mediterranean scrub within a protected coastal area.",
          "es": "Baia dei Turchi es una bahía de arena al norte de Otranto, rodeada de pinar y matorral mediterráneo en un tramo de costa protegida."
        },
        "why": {
          "it": "Il nome richiama la tradizione che lega questo tratto di costa allo sbarco delle forze ottomane durante l’assedio di Otranto del 1480.",
          "fr": "Le nom renvoie à la tradition qui associe ce secteur côtier au débarquement des forces ottomanes pendant le siège d’Otranto de 1480.",
          "en": "The name recalls the tradition linking this stretch of coast with the Ottoman landing during the 1480 siege of Otranto.",
          "es": "El nombre recuerda la tradición que vincula este tramo de costa con el desembarco otomano durante el asedio de Otranto de 1480."
        },
        "highlights": {
          "it": [
            "sabbia chiara",
            "pineta",
            "costa protetta"
          ],
          "fr": [
            "sable clair",
            "pinède",
            "côte protégée"
          ],
          "en": [
            "light sand",
            "pine woodland",
            "protected coast"
          ],
          "es": [
            "arena clara",
            "pinar",
            "costa protegida"
          ]
        }
      },
      "mulino": {
        "poiId": "mulino",
        "territoryIds": [
          "otranto"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "bay",
          "sea-caves",
          "snorkeling"
        ],
        "sourceIds": [
          "visitpuglia-otranto-guide"
        ],
        "summary": {
          "it": "Baia del Mulino d’Acqua è una piccola baia della costa di Otranto nota per l’acqua limpida e per il sistema di grotte marine e cavità costiere vicine.",
          "fr": "Baia del Mulino d’Acqua est une petite baie de la côte d’Otranto connue pour son eau claire et son système de grottes marines et cavités côtières voisines.",
          "en": "Baia del Mulino d’Acqua is a small bay on the Otranto coast known for clear water and a nearby system of sea caves and coastal cavities.",
          "es": "Baia del Mulino d’Acqua es una pequeña bahía de la costa de Otranto conocida por sus aguas claras y por el sistema cercano de cuevas marinas."
        },
        "why": {
          "it": "Il nome ricorda un antico mulino ad acqua che si trovava nei pressi della baia.",
          "fr": "Le nom rappelle un ancien moulin à eau qui se trouvait près de la baie.",
          "en": "The name recalls an old watermill that once stood near the bay.",
          "es": "El nombre recuerda un antiguo molino de agua que existía cerca de la bahía."
        },
        "highlights": {
          "it": [
            "grotte marine",
            "acqua limpida",
            "baia raccolta"
          ],
          "fr": [
            "grottes marines",
            "eau claire",
            "petite baie"
          ],
          "en": [
            "sea caves",
            "clear water",
            "small bay"
          ],
          "es": [
            "cuevas marinas",
            "agua clara",
            "pequeña bahía"
          ]
        }
      },
      "torre_santandrea": {
        "poiId": "torre_santandrea",
        "territoryIds": [
          "melendugno"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "coast",
          "sea-stacks",
          "watchtower"
        ],
        "sourceIds": [
          "visitmelendugno",
          "visitmelendugno-poi"
        ],
        "summary": {
          "it": "Torre Sant’Andrea è una marina del comune di Melendugno celebre per la costa di calcare bianco modellata in faraglioni, archi naturali e piccole cale.",
          "fr": "Torre Sant’Andrea est une marina de Melendugno célèbre pour sa côte de calcaire blanc sculptée en stacks, arches naturelles et petites criques.",
          "en": "Torre Sant’Andrea is a Melendugno seaside area famous for pale limestone coast sculpted into sea stacks, natural arches and small coves.",
          "es": "Torre Sant’Andrea es una marina de Melendugno famosa por su costa de caliza blanca esculpida en farallones, arcos naturales y pequeñas calas."
        },
        "history": {
          "it": "La torre costiera di Sant’Andrea fu costruita nel XVI secolo come parte della rete difensiva contro le incursioni dal mare.",
          "fr": "La tour côtière de Sant’Andrea fut construite au XVIe siècle dans le cadre du réseau défensif contre les incursions maritimes.",
          "en": "Sant’Andrea’s coastal tower was built in the 16th century as part of the defence network against raids from the sea.",
          "es": "La torre costera de Sant’Andrea fue construida en el siglo XVI como parte de la red defensiva contra incursiones marítimas."
        },
        "highlights": {
          "it": [
            "faraglioni",
            "archi naturali",
            "torre costiera"
          ],
          "fr": [
            "faraglioni",
            "arches naturelles",
            "tour côtière"
          ],
          "en": [
            "sea stacks",
            "natural arches",
            "coastal tower"
          ],
          "es": [
            "farallones",
            "arcos naturales",
            "torre costera"
          ]
        }
      },
      "poesia": {
        "poiId": "poesia",
        "territoryIds": [
          "melendugno"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "archaeology",
          "karst",
          "natural-pool"
        ],
        "sourceIds": [
          "visitpuglia-poesia",
          "visitmelendugno"
        ],
        "summary": {
          "it": "La Grotta della Poesia a Roca Vecchia è una grande cavità carsica aperta sul mare, parte di un sito di eccezionale interesse paesaggistico e archeologico.",
          "fr": "La Grotta della Poesia à Roca Vecchia est une grande cavité karstique ouverte sur la mer, au sein d’un site d’un intérêt paysager et archéologique exceptionnel.",
          "en": "Grotta della Poesia at Roca Vecchia is a large karst cavity open to the sea, within a site of exceptional landscape and archaeological interest.",
          "es": "La Grotta della Poesia en Roca Vecchia es una gran cavidad kárstica abierta al mar, dentro de un lugar de excepcional interés paisajístico y arqueológico."
        },
        "history": {
          "it": "Roca Vecchia è frequentata fin dall’età del Bronzo e conserva importanti testimonianze messapiche e iscrizioni legate all’antico luogo di culto.",
          "fr": "Roca Vecchia est fréquentée depuis l’âge du Bronze et conserve d’importants témoignages messapiens ainsi que des inscriptions liées à l’ancien lieu de culte.",
          "en": "Roca Vecchia has been occupied since the Bronze Age and preserves important Messapian evidence and inscriptions linked to the ancient cult site.",
          "es": "Roca Vecchia está ocupada desde la Edad del Bronce y conserva importantes testimonios mesapios e inscripciones vinculadas al antiguo lugar de culto."
        },
        "myth": {
          "it": "Una leggenda popolare collega il nome della grotta a una giovane principessa la cui bellezza avrebbe ispirato poeti; ARACNE la presenta come leggenda.",
          "fr": "Une légende populaire relie le nom de la grotte à une jeune princesse dont la beauté aurait inspiré les poètes ; ARACNE la présente comme une légende.",
          "en": "A popular legend links the cave’s name to a young princess whose beauty inspired poets; ARACNE presents this as legend.",
          "es": "Una leyenda popular relaciona el nombre de la cueva con una joven princesa cuya belleza habría inspirado a poetas; ARACNE la presenta como leyenda."
        },
        "highlights": {
          "it": [
            "grande piscina naturale",
            "area archeologica di Roca",
            "fenomeni carsici"
          ],
          "fr": [
            "grande piscine naturelle",
            "site archéologique de Roca",
            "phénomènes karstiques"
          ],
          "en": [
            "large natural pool",
            "Roca archaeological site",
            "karst features"
          ],
          "es": [
            "gran piscina natural",
            "zona arqueológica de Roca",
            "fenómenos kársticos"
          ]
        }
      },
      "torcito": {
        "poiId": "torcito",
        "territoryIds": [
          "cannole"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "nature",
          "rural-history",
          "walking"
        ],
        "sourceIds": [
          "torcito-official"
        ],
        "summary": {
          "it": "Parco Torcito è un paesaggio naturale, archeologico e rurale di oltre 200 ettari presso Cannole, attraversato da sentieri, muri a secco, cave dismesse e testimonianze della civiltà agricola.",
          "fr": "Le parc Torcito est un paysage naturel, archéologique et rural de plus de 200 hectares près de Cannole, traversé de sentiers, murs en pierre sèche, anciennes carrières et patrimoine agricole.",
          "en": "Parco Torcito is a natural, archaeological and rural landscape of more than 200 hectares near Cannole, crossed by trails, dry-stone walls, former quarries and rural heritage.",
          "es": "Parco Torcito es un paisaje natural, arqueológico y rural de más de 200 hectáreas cerca de Cannole, atravesado por senderos, muros de piedra seca, antiguas canteras y patrimonio agrícola."
        },
        "highlights": {
          "it": [
            "sentieri",
            "masseria fortificata",
            "muri a secco",
            "paesaggio rurale"
          ],
          "fr": [
            "sentiers",
            "masseria fortifiée",
            "murs en pierre sèche",
            "paysage rural"
          ],
          "en": [
            "trails",
            "fortified masseria",
            "dry-stone walls",
            "rural landscape"
          ],
          "es": [
            "senderos",
            "masseria fortificada",
            "muros de piedra seca",
            "paisaje rural"
          ]
        }
      },
      "borgagne": {
        "poiId": "borgagne",
        "territoryIds": [
          "melendugno"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "village",
          "rural-history",
          "food"
        ],
        "sourceIds": [
          "visitmelendugno",
          "visitmelendugno-poi"
        ],
        "summary": {
          "it": "Borgagne è un borgo dell’entroterra di Melendugno che conserva un forte carattere agricolo e un tessuto storico di case a corte, architetture fortificate e tradizioni locali.",
          "fr": "Borgagne est un village de l’intérieur de Melendugno qui conserve un fort caractère agricole, avec maisons à cour, architectures fortifiées et traditions locales.",
          "en": "Borgagne is an inland village of Melendugno with a strong agricultural identity, preserving courtyard houses, fortified architecture and local traditions.",
          "es": "Borgagne es un pueblo del interior de Melendugno con una fuerte identidad agrícola, que conserva casas con patio, arquitectura fortificada y tradiciones locales."
        },
        "history": {
          "it": "Il borgo conserva tracce medievali e rinascimentali; il portale turistico comunale segnala la fortificazione diffusa fra la fine del Quattrocento e la prima metà del Cinquecento.",
          "fr": "Le village conserve des traces médiévales et Renaissance ; le portail touristique communal signale une fortification diffuse entre la fin du XVe et la première moitié du XVIe siècle.",
          "en": "The village preserves medieval and Renaissance traces; the municipal tourism portal records widespread fortification between the late 15th and first half of the 16th century.",
          "es": "El pueblo conserva huellas medievales y renacentistas; el portal turístico municipal señala una fortificación extendida entre finales del siglo XV y la primera mitad del XVI."
        },
        "highlights": {
          "it": [
            "case a corte",
            "Castello Petraroli",
            "tradizioni rurali"
          ],
          "fr": [
            "maisons à cour",
            "château Petraroli",
            "traditions rurales"
          ],
          "en": [
            "courtyard houses",
            "Petraroli Castle",
            "rural traditions"
          ],
          "es": [
            "casas con patio",
            "Castillo Petraroli",
            "tradiciones rurales"
          ]
        }
      },
      "rudiae": {
        "poiId": "rudiae",
        "territoryIds": [
          "lecce"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "archaeology",
          "messapian",
          "roman"
        ],
        "sourceIds": [
          "mic-rudiae"
        ],
        "summary": {
          "it": "Rudiae è uno dei principali siti archeologici del Salento, noto come luogo di nascita del poeta latino Quinto Ennio e per il suo anfiteatro di età imperiale.",
          "fr": "Rudiae est l’un des principaux sites archéologiques du Salento, connu comme lieu de naissance du poète latin Quintus Ennius et pour son amphithéâtre d’époque impériale.",
          "en": "Rudiae is one of Salento’s major archaeological sites, known as the birthplace of Latin poet Quintus Ennius and for its Roman imperial amphitheatre.",
          "es": "Rudiae es uno de los principales yacimientos arqueológicos del Salento, conocido como lugar de nacimiento del poeta latino Quinto Ennio y por su anfiteatro de época imperial."
        },
        "history": {
          "it": "Il sito conserva fortificazioni messapiche, necropoli, strade basolate e edifici pubblici romani. L’anfiteatro fu costruito durante il regno di Traiano, fra il 98 e il 117 d.C.",
          "fr": "Le site conserve fortifications messapiennes, nécropoles, voies dallées et bâtiments publics romains. L’amphithéâtre fut construit sous le règne de Trajan, entre 98 et 117 apr. J.-C.",
          "en": "The site preserves Messapian fortifications, necropolises, paved streets and Roman public buildings. The amphitheatre was built during Trajan’s reign, between AD 98 and 117.",
          "es": "El yacimiento conserva fortificaciones mesapias, necrópolis, calles pavimentadas y edificios públicos romanos. El anfiteatro fue construido durante el reinado de Trajano, entre 98 y 117 d.C."
        },
        "highlights": {
          "it": [
            "anfiteatro romano",
            "fortificazioni messapiche",
            "patria di Quinto Ennio"
          ],
          "fr": [
            "amphithéâtre romain",
            "fortifications messapiennes",
            "patrie de Quintus Ennius"
          ],
          "en": [
            "Roman amphitheatre",
            "Messapian fortifications",
            "birthplace of Quintus Ennius"
          ],
          "es": [
            "anfiteatro romano",
            "fortificaciones mesapias",
            "patria de Quinto Ennio"
          ]
        }
      },
      "castro": {
        "poiId": "castro",
        "territoryIds": [
          "castro"
        ],
        "confidence": "high",
        "verificationStatus": "verified",
        "themes": [
          "archaeology",
          "messapian",
          "minerva",
          "religious-history"
        ],
        "sourceIds": [
          "italia-castro-city"
        ],
        "summary": {
          "it": "Il Tempio di Minerva è il riferimento archeologico che lega Castro all’antica Castrum Minervae. Gli scavi nell’area del borgo alto hanno restituito elementi di un importante santuario dedicato alla dea.",
          "fr": "Le Temple de Minerve est le grand repère archéologique qui relie Castro à l’antique Castrum Minervae. Les fouilles du bourg haut ont révélé des éléments d’un important sanctuaire dédié à la déesse.",
          "en": "The Temple of Minerva is the key archaeological reference linking Castro with ancient Castrum Minervae. Excavations in the upper town have revealed elements of an important sanctuary dedicated to the goddess.",
          "es": "El Templo de Minerva es la principal referencia arqueológica que vincula Castro con la antigua Castrum Minervae. Las excavaciones del núcleo alto han revelado elementos de un importante santuario dedicado a la diosa."
        },
        "history": {
          "it": "Le ricerche archeologiche hanno individuato strutture e reperti riconducibili al santuario, compresi frammenti attribuiti a una grande statua di Minerva. I materiali sono parte essenziale del racconto archeologico di Castro.",
          "fr": "Les recherches archéologiques ont identifié des structures et des vestiges liés au sanctuaire, dont des fragments attribués à une grande statue de Minerve. Ces découvertes sont essentielles au récit archéologique de Castro.",
          "en": "Archaeological research has identified structures and finds connected with the sanctuary, including fragments attributed to a large statue of Minerva. These finds are central to Castro’s archaeological story.",
          "es": "Las investigaciones arqueológicas han identificado estructuras y hallazgos vinculados al santuario, incluidos fragmentos atribuidos a una gran estatua de Minerva. Estos materiales son esenciales para la historia arqueológica de Castro."
        },
        "myth": {
          "it": "Il nome Castrum Minervae e la tradizione letteraria hanno favorito il legame fra Castro, Minerva e il viaggio di Enea. ARACNE distingue questa dimensione letteraria dai dati archeologici documentati.",
          "fr": "Le nom Castrum Minervae et la tradition littéraire ont renforcé le lien entre Castro, Minerve et le voyage d’Énée. ARACNE distingue cette dimension littéraire des données archéologiques documentées.",
          "en": "The name Castrum Minervae and literary tradition have reinforced the link between Castro, Minerva and Aeneas’ journey. ARACNE distinguishes this literary layer from documented archaeological evidence.",
          "es": "El nombre Castrum Minervae y la tradición literaria han reforzado el vínculo entre Castro, Minerva y el viaje de Eneas. ARACNE distingue esta dimensión literaria de la evidencia arqueológica documentada."
        },
        "highlights": {
          "it": [
            "area archeologica del santuario",
            "reperti legati alla grande statua di Minerva",
            "Museo Archeologico nel Castello"
          ],
          "fr": [
            "zone archéologique du sanctuaire",
            "vestiges liés à la grande statue de Minerve",
            "musée archéologique dans le château"
          ],
          "en": [
            "sanctuary archaeological area",
            "finds linked to the large Minerva statue",
            "Archaeological Museum in the castle"
          ],
          "es": [
            "zona arqueológica del santuario",
            "hallazgos ligados a la gran estatua de Minerva",
            "Museo Arqueológico en el castillo"
          ]
        }
      }
    },
    "territories": {
      "lecce": {
        "id": "lecce",
        "type": "city",
        "confidence": "high",
        "aliases": {
          "it": [
            "lecce"
          ],
          "fr": [
            "lecce"
          ],
          "en": [
            "lecce"
          ],
          "es": [
            "lecce"
          ]
        },
        "sourceIds": [
          "italia-lecce-city"
        ],
        "poiIds": [
          "lecce",
          "rudiae",
          "cerrate"
        ],
        "themes": [
          "baroque",
          "roman",
          "architecture",
          "food",
          "city"
        ],
        "summary": {
          "it": "Lecce è il principale centro culturale del Salento, celebre per il barocco leccese scolpito nella pietra locale dal colore caldo e per una storia urbana che conserva anche importanti tracce romane.",
          "fr": "Lecce est le principal centre culturel du Salento, célèbre pour le baroque leccese sculpté dans la pierre locale aux tons chauds et pour une histoire urbaine qui conserve aussi d’importants vestiges romains.",
          "en": "Lecce is Salento’s main cultural centre, celebrated for Lecce Baroque carved in the warm-toned local stone and for an urban history that also preserves important Roman remains.",
          "es": "Lecce es el principal centro cultural del Salento, célebre por el barroco leccese esculpido en la piedra local de tonos cálidos y por una historia urbana que conserva importantes restos romanos."
        },
        "history": {
          "it": "La città conserva testimonianze dell’età romana e conobbe una straordinaria stagione artistica tra Cinquecento e Seicento, quando il barocco leccese divenne il linguaggio dominante di chiese, palazzi e piazze.",
          "fr": "La ville conserve des témoignages de l’époque romaine et connut une remarquable saison artistique entre les XVIe et XVIIe siècles, lorsque le baroque leccese devint le langage dominant des églises, palais et places.",
          "en": "The city preserves evidence from Roman times and experienced an exceptional artistic period between the 16th and 17th centuries, when Lecce Baroque became the dominant language of churches, palaces and squares.",
          "es": "La ciudad conserva testimonios de época romana y vivió una extraordinaria etapa artística entre los siglos XVI y XVII, cuando el barroco leccese se convirtió en el lenguaje dominante de iglesias, palacios y plazas."
        },
        "highlights": {
          "it": [
            "Piazza Duomo e il Duomo",
            "Basilica di Santa Croce",
            "anfiteatro romano",
            "Porta Rudiae",
            "vicoli e palazzi del centro barocco"
          ],
          "fr": [
            "Piazza Duomo et la cathédrale",
            "Basilique Santa Croce",
            "amphithéâtre romain",
            "Porta Rudiae",
            "ruelles et palais du centre baroque"
          ],
          "en": [
            "Piazza Duomo and the cathedral",
            "Basilica of Santa Croce",
            "Roman amphitheatre",
            "Porta Rudiae",
            "lanes and palaces of the Baroque centre"
          ],
          "es": [
            "Piazza Duomo y la catedral",
            "Basílica de Santa Croce",
            "anfiteatro romano",
            "Porta Rudiae",
            "calles y palacios del centro barroco"
          ]
        },
        "name": "Lecce"
      },
      "otranto": {
        "id": "otranto",
        "type": "city",
        "confidence": "high",
        "aliases": {
          "it": [
            "otranto"
          ],
          "fr": [
            "otranto"
          ],
          "en": [
            "otranto"
          ],
          "es": [
            "otranto"
          ]
        },
        "sourceIds": [
          "italia-otranto-city"
        ],
        "poiIds": [
          "otranto",
          "bauxite",
          "palascia",
          "santemiliano",
          "badisco",
          "cervi",
          "turchi",
          "mulino",
          "alimini",
          "enea"
        ],
        "themes": [
          "adriatic",
          "history",
          "martyrs",
          "castle",
          "coast"
        ],
        "summary": {
          "it": "Otranto è una città adriatica costruita su uno sperone roccioso, dove mare, fortificazioni e memoria storica si intrecciano in modo particolarmente forte.",
          "fr": "Otranto est une ville adriatique installée sur un éperon rocheux, où la mer, les fortifications et la mémoire historique sont étroitement liées.",
          "en": "Otranto is an Adriatic town set on a rocky spur, where the sea, fortifications and historical memory are especially closely intertwined.",
          "es": "Otranto es una ciudad adriática situada sobre un espolón rocoso, donde el mar, las fortificaciones y la memoria histórica están estrechamente unidos."
        },
        "history": {
          "it": "L’episodio più traumatico della storia cittadina fu l’assedio ottomano del 1480 e la successiva uccisione degli Ottocento Martiri, la cui memoria è custodita nella Cattedrale. La ricostruzione difensiva successiva segnò profondamente il Castello aragonese.",
          "fr": "L’épisode le plus traumatique de l’histoire de la ville fut le siège ottoman de 1480 et la mort des huit cents Martyrs, dont la mémoire est conservée dans la cathédrale. La reconstruction défensive qui suivit marqua profondément le château aragonais.",
          "en": "The most traumatic episode in the town’s history was the Ottoman siege of 1480 and the killing of the Eight Hundred Martyrs, whose memory is preserved in the cathedral. The defensive rebuilding that followed strongly shaped the Aragonese Castle.",
          "es": "El episodio más traumático de la historia de la ciudad fue el asedio otomano de 1480 y la muerte de los Ochocientos Mártires, cuya memoria se conserva en la catedral. La reconstrucción defensiva posterior marcó profundamente el Castillo Aragonés."
        },
        "nature": {
          "it": "Il territorio di Otranto alterna centro storico, costa rocciosa, baie, laghi costieri e paesaggi mediterranei: tra i luoghi collegati figurano Punta Palascia, Baia dei Turchi, Alimini e Porto Badisco.",
          "fr": "Le territoire d’Otranto alterne centre historique, côte rocheuse, baies, lacs côtiers et paysages méditerranéens : Punta Palascia, Baia dei Turchi, Alimini et Porto Badisco en font partie.",
          "en": "Otranto’s territory combines the historic centre, rocky coastline, bays, coastal lakes and Mediterranean landscapes, including Punta Palascia, Baia dei Turchi, Alimini and Porto Badisco.",
          "es": "El territorio de Otranto combina centro histórico, costa rocosa, bahías, lagos costeros y paisajes mediterráneos, entre ellos Punta Palascia, Baia dei Turchi, Alimini y Porto Badisco."
        },
        "highlights": {
          "it": [
            "Cattedrale e memoria degli Ottocento Martiri",
            "Castello aragonese",
            "centro storico affacciato sull’Adriatico",
            "Punta Palascia",
            "Baia dei Turchi e Alimini"
          ],
          "fr": [
            "cathédrale et mémoire des Huit Cents Martyrs",
            "château aragonais",
            "centre historique sur l’Adriatique",
            "Punta Palascia",
            "Baia dei Turchi et Alimini"
          ],
          "en": [
            "cathedral and memory of the Eight Hundred Martyrs",
            "Aragonese Castle",
            "historic centre overlooking the Adriatic",
            "Punta Palascia",
            "Baia dei Turchi and Alimini"
          ],
          "es": [
            "catedral y memoria de los Ochocientos Mártires",
            "Castillo Aragonés",
            "centro histórico sobre el Adriático",
            "Punta Palascia",
            "Baia dei Turchi y Alimini"
          ]
        },
        "name": "Otranto"
      },
      "gallipoli": {
        "id": "gallipoli",
        "type": "city",
        "confidence": "high",
        "aliases": {
          "it": [
            "gallipoli"
          ],
          "fr": [
            "gallipoli"
          ],
          "en": [
            "gallipoli"
          ],
          "es": [
            "gallipoli"
          ]
        },
        "sourceIds": [
          "italia-gallipoli-city"
        ],
        "poiIds": [
          "santandrea_gallipoli",
          "montagna",
          "suina"
        ],
        "themes": [
          "ionian",
          "old-town",
          "beaches",
          "baroque",
          "nightlife"
        ],
        "summary": {
          "it": "Gallipoli unisce due anime: il centro storico su un’isola collegata alla terraferma da un ponte e una lunga costa ionica famosa per spiagge e vita balneare.",
          "fr": "Gallipoli réunit deux âmes : un centre historique situé sur une île reliée au continent par un pont et une longue côte ionienne célèbre pour ses plages et sa vie balnéaire.",
          "en": "Gallipoli combines two identities: a historic centre on an island linked to the mainland by a bridge, and a long Ionian coastline famous for beaches and seaside life.",
          "es": "Gallipoli combina dos almas: un centro histórico situado en una isla unida al continente por un puente y una larga costa jónica famosa por sus playas y vida balnearia."
        },
        "history": {
          "it": "Il cuore antico è protetto da fortificazioni e dominato dal Castello, mentre il tessuto urbano conserva numerose chiese barocche. Il ponte collega la città vecchia al borgo moderno.",
          "fr": "Le cœur ancien est protégé par des fortifications et dominé par le château, tandis que le tissu urbain conserve de nombreuses églises baroques. Le pont relie la vieille ville au quartier moderne.",
          "en": "The old heart is protected by fortifications and dominated by the castle, while the urban fabric preserves numerous Baroque churches. The bridge links the old town to the modern district.",
          "es": "El corazón antiguo está protegido por fortificaciones y dominado por el castillo, mientras que el tejido urbano conserva numerosas iglesias barrocas. El puente conecta la ciudad vieja con el barrio moderno."
        },
        "highlights": {
          "it": [
            "Castello di Gallipoli",
            "Cattedrale di Sant’Agata",
            "Santa Maria della Purità",
            "borgo antico e porto",
            "Punta della Suina e costa ionica"
          ],
          "fr": [
            "château de Gallipoli",
            "cathédrale Sant’Agata",
            "Santa Maria della Purità",
            "vieille ville et port",
            "Punta della Suina et côte ionienne"
          ],
          "en": [
            "Gallipoli Castle",
            "Cathedral of Sant’Agata",
            "Santa Maria della Purità",
            "old town and harbour",
            "Punta della Suina and the Ionian coast"
          ],
          "es": [
            "Castillo de Gallipoli",
            "Catedral de Sant’Agata",
            "Santa Maria della Purità",
            "casco antiguo y puerto",
            "Punta della Suina y costa jónica"
          ]
        },
        "name": "Gallipoli"
      },
      "nardo": {
        "id": "nardo",
        "type": "city",
        "confidence": "high",
        "aliases": {
          "it": [
            "nardo"
          ],
          "fr": [
            "nardo"
          ],
          "en": [
            "nardo"
          ],
          "es": [
            "nardo"
          ]
        },
        "sourceIds": [
          "italia-nardo-city"
        ],
        "poiIds": [
          "fiume",
          "alto",
          "cavallo",
          "uluzzo",
          "capitano",
          "frascone",
          "santamaria",
          "santacaterina",
          "montagna"
        ],
        "themes": [
          "baroque",
          "ionian",
          "porto-selvaggio",
          "watchtowers",
          "nature"
        ],
        "summary": {
          "it": "Nardò lega un centro storico barocco a un vasto territorio ionico che comprende marine, masserie, torri costiere e il Parco di Porto Selvaggio e Palude del Capitano.",
          "fr": "Nardò relie un centre historique baroque à un vaste territoire ionien comprenant stations balnéaires, masserie, tours côtières et le parc de Porto Selvaggio et Palude del Capitano.",
          "en": "Nardò links a Baroque historic centre with a broad Ionian territory of seaside settlements, masserie, coastal towers and the Porto Selvaggio–Palude del Capitano park.",
          "es": "Nardò une un centro histórico barroco con un amplio territorio jónico de núcleos costeros, masserie, torres litorales y el parque de Porto Selvaggio y Palude del Capitano."
        },
        "nature": {
          "it": "La costa comprende aree protette, pinete, falesie e zone umide carsiche. Porto Selvaggio e Palude del Capitano costituiscono il grande cuore naturale del territorio.",
          "fr": "La côte comprend des espaces protégés, pinèdes, falaises et zones humides karstiques. Porto Selvaggio et Palude del Capitano forment le grand cœur naturel du territoire.",
          "en": "The coast includes protected areas, pine woods, cliffs and karst wetlands. Porto Selvaggio and Palude del Capitano form the territory’s major natural core.",
          "es": "La costa incluye zonas protegidas, pinares, acantilados y humedales kársticos. Porto Selvaggio y Palude del Capitano forman el gran núcleo natural del territorio."
        },
        "highlights": {
          "it": [
            "centro storico barocco",
            "Piazza Salandra",
            "Porto Selvaggio",
            "Torre dell’Alto e Torre Uluzzo",
            "Santa Maria al Bagno e Santa Caterina"
          ],
          "fr": [
            "centre historique baroque",
            "Piazza Salandra",
            "Porto Selvaggio",
            "Torre dell’Alto et Torre Uluzzo",
            "Santa Maria al Bagno et Santa Caterina"
          ],
          "en": [
            "Baroque historic centre",
            "Piazza Salandra",
            "Porto Selvaggio",
            "Torre dell’Alto and Torre Uluzzo",
            "Santa Maria al Bagno and Santa Caterina"
          ],
          "es": [
            "centro histórico barroco",
            "Piazza Salandra",
            "Porto Selvaggio",
            "Torre dell’Alto y Torre Uluzzo",
            "Santa Maria al Bagno y Santa Caterina"
          ]
        },
        "name": "Nardò"
      },
      "castro": {
        "id": "castro",
        "type": "city",
        "confidence": "high",
        "aliases": {
          "it": [
            "castro"
          ],
          "fr": [
            "castro"
          ],
          "en": [
            "castro"
          ],
          "es": [
            "castro"
          ]
        },
        "sourceIds": [
          "italia-castro-city",
          "visit-zinzulusa"
        ],
        "poiIds": [
          "castro",
          "zinzulusa"
        ],
        "themes": [
          "adriatic",
          "archaeology",
          "minerva",
          "castle",
          "caves"
        ],
        "summary": {
          "it": "Castro è un borgo arroccato sulla costa adriatica, erede dell’antica Castrum Minervae e fortemente legato al mare, all’archeologia e al mito di Minerva.",
          "fr": "Castro est un village perché sur la côte adriatique, héritier de l’antique Castrum Minervae et profondément lié à la mer, à l’archéologie et au mythe de Minerve.",
          "en": "Castro is a cliff-top Adriatic village, heir to ancient Castrum Minervae and strongly connected with the sea, archaeology and the myth of Minerva.",
          "es": "Castro es un pueblo encaramado sobre la costa adriática, heredero de la antigua Castrum Minervae y muy ligado al mar, la arqueología y el mito de Minerva."
        },
        "history": {
          "it": "Gli scavi archeologici hanno riportato alla luce elementi del santuario dedicato a Minerva, tra cui reperti collegati a una grande statua della dea. Il Castello ospita il Museo Archeologico Antonio Lazzari.",
          "fr": "Les fouilles archéologiques ont mis au jour des éléments du sanctuaire consacré à Minerve, dont des vestiges associés à une grande statue de la déesse. Le château abrite le musée archéologique Antonio Lazzari.",
          "en": "Archaeological excavations have revealed elements of the sanctuary dedicated to Minerva, including finds linked to a large statue of the goddess. The castle houses the Antonio Lazzari Archaeological Museum.",
          "es": "Las excavaciones arqueológicas han sacado a la luz elementos del santuario dedicado a Minerva, incluidos hallazgos relacionados con una gran estatua de la diosa. El castillo alberga el Museo Arqueológico Antonio Lazzari."
        },
        "myth": {
          "it": "La tradizione collega Castro, l’antica Castrum Minervae, al viaggio di Enea. Il legame è culturale e letterario; ARACNE lo presenta come tradizione, distinguendolo dai dati archeologici.",
          "fr": "La tradition relie Castro, l’ancienne Castrum Minervae, au voyage d’Énée. Ce lien est culturel et littéraire ; ARACNE le présente comme une tradition distincte des données archéologiques.",
          "en": "Tradition links Castro, ancient Castrum Minervae, with Aeneas’ journey. The connection is cultural and literary; ARACNE presents it as tradition, distinct from archaeological evidence.",
          "es": "La tradición relaciona Castro, la antigua Castrum Minervae, con el viaje de Eneas. El vínculo es cultural y literario; ARACNE lo presenta como tradición separada de la evidencia arqueológica."
        },
        "highlights": {
          "it": [
            "Castello aragonese e museo archeologico",
            "area del Tempio di Minerva",
            "borgo alto",
            "Castro Marina",
            "Grotta Zinzulusa"
          ],
          "fr": [
            "château aragonais et musée archéologique",
            "zone du temple de Minerve",
            "village haut",
            "Castro Marina",
            "Grotta Zinzulusa"
          ],
          "en": [
            "Aragonese castle and archaeological museum",
            "Temple of Minerva area",
            "upper village",
            "Castro Marina",
            "Grotta Zinzulusa"
          ],
          "es": [
            "castillo aragonés y museo arqueológico",
            "zona del templo de Minerva",
            "pueblo alto",
            "Castro Marina",
            "Grotta Zinzulusa"
          ]
        },
        "name": "Castro"
      },
      "galatina": {
        "id": "galatina",
        "type": "city",
        "confidence": "high",
        "aliases": {
          "it": [
            "galatina"
          ],
          "fr": [
            "galatina"
          ],
          "en": [
            "galatina"
          ],
          "es": [
            "galatina"
          ]
        },
        "sourceIds": [
          "italia-galatina-city"
        ],
        "poiIds": [
          "galatina"
        ],
        "themes": [
          "medieval",
          "frescoes",
          "baroque",
          "food"
        ],
        "summary": {
          "it": "Galatina è una città d’arte dell’entroterra salentino, nota soprattutto per la Basilica di Santa Caterina d’Alessandria, per il centro storico e per la tradizione del pasticciotto.",
          "fr": "Galatina est une ville d’art de l’intérieur du Salento, connue surtout pour la basilique Santa Caterina d’Alessandria, son centre historique et la tradition du pasticciotto.",
          "en": "Galatina is an inland Salento art town, known above all for the Basilica of Santa Caterina d’Alessandria, its historic centre and the pasticciotto tradition.",
          "es": "Galatina es una ciudad de arte del interior del Salento, conocida sobre todo por la Basílica de Santa Caterina d’Alessandria, su centro histórico y la tradición del pasticciotto."
        },
        "history": {
          "it": "Tra XIV e XV secolo Galatina conobbe una fase di grande sviluppo. La Basilica di Santa Caterina, edificata nel 1384, custodisce uno dei più importanti cicli di affreschi medievali del Mezzogiorno.",
          "fr": "Entre les XIVe et XVe siècles, Galatina connut une période de grand développement. La basilique Santa Caterina, édifiée en 1384, conserve l’un des ensembles de fresques médiévales les plus importants du Mezzogiorno.",
          "en": "Between the 14th and 15th centuries Galatina experienced major development. The Basilica of Santa Caterina, built in 1384, preserves one of southern Italy’s most important medieval fresco cycles.",
          "es": "Entre los siglos XIV y XV Galatina vivió una etapa de gran desarrollo. La Basílica de Santa Caterina, construida en 1384, conserva uno de los ciclos de frescos medievales más importantes del sur de Italia."
        },
        "highlights": {
          "it": [
            "Basilica di Santa Caterina d’Alessandria",
            "ciclo di affreschi quattrocenteschi",
            "Chiesa Madre dei Santi Pietro e Paolo",
            "palazzi e balconi del centro",
            "tradizione del pasticciotto"
          ],
          "fr": [
            "Basilique Santa Caterina d’Alessandria",
            "cycle de fresques du XVe siècle",
            "église mère Saints Pierre et Paul",
            "palais et balcons du centre",
            "tradition du pasticciotto"
          ],
          "en": [
            "Basilica of Santa Caterina d’Alessandria",
            "15th-century fresco cycle",
            "Mother Church of Saints Peter and Paul",
            "historic palaces and balconies",
            "pasticciotto tradition"
          ],
          "es": [
            "Basílica de Santa Caterina d’Alessandria",
            "ciclo de frescos del siglo XV",
            "iglesia madre de San Pedro y San Pablo",
            "palacios y balcones históricos",
            "tradición del pasticciotto"
          ]
        },
        "name": "Galatina"
      },
      "copertino": {
        "id": "copertino",
        "type": "city",
        "confidence": "medium-high",
        "aliases": {
          "it": [
            "copertino"
          ],
          "fr": [
            "copertino"
          ],
          "en": [
            "copertino"
          ],
          "es": [
            "copertino"
          ]
        },
        "sourceIds": [
          "visit-copertino-city",
          "mic-copertino"
        ],
        "poiIds": [
          "copertino",
          "grottella"
        ],
        "themes": [
          "renaissance",
          "saint-joseph",
          "castle",
          "religious"
        ],
        "summary": {
          "it": "Copertino, nell’entroterra salentino a ovest di Lecce, è conosciuta soprattutto per il grande castello rinascimentale e per San Giuseppe da Copertino, nato qui nel 1603.",
          "fr": "Copertino, dans l’intérieur du Salento à l’ouest de Lecce, est surtout connue pour son grand château Renaissance et pour saint Joseph de Copertino, né ici en 1603.",
          "en": "Copertino, in inland Salento west of Lecce, is best known for its major Renaissance castle and for Saint Joseph of Copertino, born here in 1603.",
          "es": "Copertino, en el interior del Salento al oeste de Lecce, es conocida sobre todo por su gran castillo renacentista y por San José de Copertino, nacido aquí en 1603."
        },
        "highlights": {
          "it": [
            "Castello di Copertino",
            "Santuario di San Giuseppe",
            "Basilica di Santa Maria ad Nives",
            "Monastero di Santa Chiara",
            "porte e piazze del centro"
          ],
          "fr": [
            "château de Copertino",
            "sanctuaire Saint-Joseph",
            "basilique Santa Maria ad Nives",
            "monastère Santa Chiara",
            "portes et places du centre"
          ],
          "en": [
            "Copertino Castle",
            "Sanctuary of Saint Joseph",
            "Basilica of Santa Maria ad Nives",
            "Monastery of Santa Chiara",
            "historic gates and squares"
          ],
          "es": [
            "Castillo de Copertino",
            "Santuario de San José",
            "Basílica de Santa Maria ad Nives",
            "Monasterio de Santa Chiara",
            "puertas y plazas históricas"
          ]
        },
        "name": "Copertino"
      },
      "manduria": {
        "id": "manduria",
        "type": "city",
        "confidence": "high",
        "aliases": {
          "it": [
            "manduria"
          ],
          "fr": [
            "manduria"
          ],
          "en": [
            "manduria"
          ],
          "es": [
            "manduria"
          ]
        },
        "sourceIds": [
          "italia-manduria-city"
        ],
        "poiIds": [
          "monaci"
        ],
        "themes": [
          "messapian",
          "archaeology",
          "primitivo",
          "wine",
          "ionian"
        ],
        "summary": {
          "it": "Manduria unisce una fortissima identità messapica alla cultura del vino Primitivo e a un territorio che si estende verso la costa ionica.",
          "fr": "Manduria associe une identité messapienne très forte à la culture du vin Primitivo et à un territoire qui s’étend vers la côte ionienne.",
          "en": "Manduria combines a strong Messapian identity with the culture of Primitivo wine and a territory extending toward the Ionian coast.",
          "es": "Manduria combina una fuerte identidad mesapia con la cultura del vino Primitivo y un territorio que se extiende hacia la costa jónica."
        },
        "history": {
          "it": "Le mura megalitiche, la vasta necropoli e il Fonte Pliniano testimoniano l’importanza dell’antica Manduria messapica. La città fu poi rifondata nel Medioevo con il nome di Casalnuovo e recuperò il nome Manduria nel 1789.",
          "fr": "Les murailles mégalithiques, la vaste nécropole et la Fonte Pliniano témoignent de l’importance de l’ancienne Manduria messapienne. La ville fut ensuite refondée au Moyen Âge sous le nom de Casalnuovo avant de reprendre le nom Manduria en 1789.",
          "en": "The megalithic walls, extensive necropolis and Fonte Pliniano testify to the importance of ancient Messapian Manduria. The town was later refounded in the Middle Ages as Casalnuovo and recovered the name Manduria in 1789.",
          "es": "Las murallas megalíticas, la extensa necrópolis y la Fonte Pliniano testimonian la importancia de la antigua Manduria mesapia. La ciudad fue refundada en la Edad Media como Casalnuovo y recuperó el nombre Manduria en 1789."
        },
        "highlights": {
          "it": [
            "Parco Archeologico delle Mura Messapiche",
            "Fonte Pliniano",
            "necropoli messapica",
            "Museo della Civiltà del Vino Primitivo",
            "Salina dei Monaci e Torre Colimena"
          ],
          "fr": [
            "parc archéologique des murailles messapiennes",
            "Fonte Pliniano",
            "nécropole messapienne",
            "musée de la civilisation du vin Primitivo",
            "Salina dei Monaci et Torre Colimena"
          ],
          "en": [
            "Messapian Walls Archaeological Park",
            "Fonte Pliniano",
            "Messapian necropolis",
            "Museum of Primitivo Wine Culture",
            "Salina dei Monaci and Torre Colimena"
          ],
          "es": [
            "Parque Arqueológico de las Murallas Mesapias",
            "Fonte Pliniano",
            "necrópolis mesapia",
            "Museo de la Civilización del Vino Primitivo",
            "Salina dei Monaci y Torre Colimena"
          ]
        },
        "name": "Manduria"
      },
      "ostuni": {
        "id": "ostuni",
        "type": "city",
        "confidence": "high",
        "aliases": {
          "it": [
            "ostuni",
            "citta bianca"
          ],
          "fr": [
            "ostuni",
            "ville blanche"
          ],
          "en": [
            "ostuni",
            "white city"
          ],
          "es": [
            "ostuni",
            "ciudad blanca"
          ]
        },
        "sourceIds": [
          "italia-ostuni-city"
        ],
        "poiIds": [],
        "themes": [
          "white-city",
          "valle-ditria",
          "olive-groves",
          "cathedral",
          "adriatic"
        ],
        "summary": {
          "it": "Ostuni, la «Città Bianca», domina dall’ultimo gradino delle Murge un paesaggio di uliveti ed è una delle porte meridionali della Valle d’Itria.",
          "fr": "Ostuni, la « Ville Blanche », domine depuis les derniers reliefs des Murge un paysage d’oliveraies et constitue l’une des portes méridionales de la vallée d’Itria.",
          "en": "Ostuni, the “White City”, overlooks a landscape of olive groves from the last foothills of the Murge and forms one of the southern gateways to the Itria Valley.",
          "es": "Ostuni, la «Ciudad Blanca», domina desde las últimas estribaciones de las Murge un paisaje de olivares y constituye una de las puertas meridionales del Valle de Itria."
        },
        "history": {
          "it": "Il centro antico, detto «La Terra», è un labirinto di case imbiancate, vicoli e scalinate. Nella parte alta spicca la Cattedrale tardo-quattrocentesca, caratterizzata da forme gotiche.",
          "fr": "Le centre ancien, appelé « La Terra », est un labyrinthe de maisons blanchies à la chaux, ruelles et escaliers. Dans la partie haute se distingue la cathédrale de la fin du XVe siècle, aux formes gothiques.",
          "en": "The old centre, known as “La Terra”, is a maze of whitewashed houses, lanes and stairways. At the top stands the late-15th-century cathedral, distinguished by Gothic forms.",
          "es": "El centro antiguo, llamado «La Terra», es un laberinto de casas encaladas, callejuelas y escaleras. En la parte alta destaca la catedral de finales del siglo XV, de formas góticas."
        },
        "nature": {
          "it": "Intorno alla città si estende la Piana degli Ulivi; la costa adriatica e le marine di Ostuni si trovano a meno di dieci chilometri dal centro.",
          "fr": "Autour de la ville s’étend la plaine des oliviers ; la côte adriatique et les stations balnéaires d’Ostuni se trouvent à moins de dix kilomètres du centre.",
          "en": "The Plain of Olive Trees extends around the town, while Ostuni’s Adriatic coast and seaside settlements lie less than ten kilometres from the centre.",
          "es": "Alrededor de la ciudad se extiende la llanura de los olivos, mientras que la costa adriática y los núcleos costeros de Ostuni se encuentran a menos de diez kilómetros del centro."
        },
        "highlights": {
          "it": [
            "centro storico bianco «La Terra»",
            "Cattedrale",
            "vicoli, archi e scalinate",
            "Piana degli Ulivi",
            "costa e marine di Ostuni"
          ],
          "fr": [
            "centre historique blanc « La Terra »",
            "cathédrale",
            "ruelles, arches et escaliers",
            "plaine des oliviers",
            "côte et stations balnéaires d’Ostuni"
          ],
          "en": [
            "white historic centre “La Terra”",
            "cathedral",
            "lanes, arches and stairways",
            "Plain of Olive Trees",
            "Ostuni coast and seaside settlements"
          ],
          "es": [
            "centro histórico blanco «La Terra»",
            "catedral",
            "callejuelas, arcos y escaleras",
            "llanura de los olivos",
            "costa y núcleos costeros de Ostuni"
          ]
        },
        "name": "Ostuni"
      },
      "santa_cesarea": {
        "id": "santa_cesarea",
        "name": "Santa Cesarea Terme",
        "type": "territory",
        "confidence": "high",
        "aliases": {
          "it": [
            "santa cesarea terme",
            "santa cesarea"
          ],
          "fr": [
            "santa cesarea terme",
            "santa cesarea"
          ],
          "en": [
            "santa cesarea terme",
            "santa cesarea"
          ],
          "es": [
            "santa cesarea terme",
            "santa cesarea"
          ]
        },
        "sourceIds": [
          "italia-santacesarea"
        ],
        "poiIds": [
          "miggiano",
          "cesarea"
        ],
        "themes": [
          "thermal",
          "adriatic",
          "cliffs"
        ],
        "summary": {
          "it": "Santa Cesarea Terme è un territorio costiero adriatico noto per le sorgenti termali sulfuree, le falesie e le architetture eclettiche.",
          "fr": "Santa Cesarea Terme est un territoire côtier adriatique connu pour ses sources thermales sulfureuses, ses falaises et son architecture éclectique.",
          "en": "Santa Cesarea Terme is an Adriatic coastal territory known for sulphurous thermal springs, cliffs and eclectic architecture.",
          "es": "Santa Cesarea Terme es un territorio costero adriático conocido por sus aguas termales sulfurosas, acantilados y arquitectura ecléctica."
        },
        "highlights": {
          "it": [
            "Santa Cesarea Terme",
            "Porto Miggiano",
            "grotte termali"
          ],
          "fr": [
            "Santa Cesarea Terme",
            "Porto Miggiano",
            "grottes thermales"
          ],
          "en": [
            "Santa Cesarea Terme",
            "Porto Miggiano",
            "thermal caves"
          ],
          "es": [
            "Santa Cesarea Terme",
            "Porto Miggiano",
            "cuevas termales"
          ]
        }
      },
      "tricase": {
        "id": "tricase",
        "name": "Tricase e Serra del Mito",
        "type": "territory",
        "confidence": "medium",
        "aliases": {
          "it": [
            "tricase",
            "caprarica del capo"
          ],
          "fr": [
            "tricase",
            "caprarica del capo"
          ],
          "en": [
            "tricase",
            "caprarica del capo"
          ],
          "es": [
            "tricase",
            "caprarica del capo"
          ]
        },
        "sourceIds": [
          "parco-otranto-leuca-comuni",
          "tricase-caprarica"
        ],
        "poiIds": [
          "scarra",
          "ripe",
          "caprarica"
        ],
        "themes": [
          "rural-history",
          "coast",
          "fortifications"
        ],
        "summary": {
          "it": "Il territorio di Tricase collega borghi storici, paesaggio rurale, Serre salentine e la costa del Parco Otranto–Leuca.",
          "fr": "Le territoire de Tricase relie villages historiques, paysage rural, collines des Serre salentine et côte du parc Otranto–Leuca.",
          "en": "The Tricase area links historic villages, rural landscapes, Salento ridges and the Otranto–Leuca park coast.",
          "es": "El territorio de Tricase une pueblos históricos, paisaje rural, sierras salentinas y la costa del parque Otranto–Leuca."
        },
        "highlights": {
          "it": [
            "Caprarica del Capo",
            "Serra del Mito",
            "paesaggio rurale"
          ],
          "fr": [
            "Caprarica del Capo",
            "Serra del Mito",
            "paysage rural"
          ],
          "en": [
            "Caprarica del Capo",
            "Serra del Mito",
            "rural landscape"
          ],
          "es": [
            "Caprarica del Capo",
            "Serra del Mito",
            "paisaje rural"
          ]
        }
      },
      "diso": {
        "id": "diso",
        "name": "Diso e Marina di Marittima",
        "type": "territory",
        "confidence": "medium",
        "aliases": {
          "it": [
            "diso",
            "marittima"
          ],
          "fr": [
            "diso",
            "marittima"
          ],
          "en": [
            "diso",
            "marittima"
          ],
          "es": [
            "diso",
            "marittima"
          ]
        },
        "sourceIds": [
          "tourpuglia-acquaviva"
        ],
        "poiIds": [
          "acquaviva"
        ],
        "themes": [
          "coast",
          "springs",
          "coves"
        ],
        "summary": {
          "it": "Il territorio di Diso scende verso la costa di Marina di Marittima, caratterizzata da insenature rocciose e sorgenti d’acqua dolce.",
          "fr": "Le territoire de Diso descend vers la côte de Marina di Marittima, caractérisée par criques rocheuses et sources d’eau douce.",
          "en": "The Diso area reaches the Marina di Marittima coast, characterised by rocky inlets and freshwater springs.",
          "es": "El territorio de Diso llega a la costa de Marina di Marittima, caracterizada por calas rocosas y manantiales de agua dulce."
        },
        "highlights": {
          "it": [
            "Cala dell’Acquaviva",
            "Marina di Marittima"
          ],
          "fr": [
            "Cala dell’Acquaviva",
            "Marina di Marittima"
          ],
          "en": [
            "Cala dell’Acquaviva",
            "Marina di Marittima"
          ],
          "es": [
            "Cala dell’Acquaviva",
            "Marina di Marittima"
          ]
        }
      },
      "andrano": {
        "id": "andrano",
        "name": "Andrano",
        "type": "territory",
        "confidence": "medium",
        "aliases": {
          "it": [
            "andrano",
            "marina di andrano"
          ],
          "fr": [
            "andrano",
            "marina di andrano"
          ],
          "en": [
            "andrano",
            "marina di andrano"
          ],
          "es": [
            "andrano",
            "marina di andrano"
          ]
        },
        "sourceIds": [
          "parco-otranto-leuca-itinerari"
        ],
        "poiIds": [
          "verde"
        ],
        "themes": [
          "rocky-coast",
          "sea-caves"
        ],
        "summary": {
          "it": "Andrano comprende un tratto di costa rocciosa del basso Adriatico salentino, con cavità marine e acque trasparenti.",
          "fr": "Andrano comprend un secteur de côte rocheuse du bas Adriatique salentin, avec grottes marines et eaux transparentes.",
          "en": "Andrano includes a rocky stretch of lower Salento’s Adriatic coast, with sea caves and clear water.",
          "es": "Andrano comprende un tramo de costa rocosa del bajo Adriático salentino, con cuevas marinas y aguas transparentes."
        },
        "highlights": {
          "it": [
            "Grotta Verde",
            "Marina di Andrano"
          ],
          "fr": [
            "Grotta Verde",
            "Marina di Andrano"
          ],
          "en": [
            "Grotta Verde",
            "Marina di Andrano"
          ],
          "es": [
            "Grotta Verde",
            "Marina di Andrano"
          ]
        }
      },
      "leuca": {
        "id": "leuca",
        "name": "Santa Maria di Leuca",
        "type": "territory",
        "confidence": "high",
        "aliases": {
          "it": [
            "santa maria di leuca",
            "leuca"
          ],
          "fr": [
            "santa maria di leuca",
            "leuca"
          ],
          "en": [
            "santa maria di leuca",
            "leuca"
          ],
          "es": [
            "santa maria di leuca",
            "leuca"
          ]
        },
        "sourceIds": [
          "visitpuglia-leuca"
        ],
        "poiIds": [
          "treporte"
        ],
        "themes": [
          "cliffs",
          "sea-caves",
          "pilgrimage"
        ],
        "summary": {
          "it": "Santa Maria di Leuca occupa l’estremo meridionale del Salento, con alte falesie, numerose grotte marine, il santuario e il terminale monumentale dell’Acquedotto Pugliese.",
          "fr": "Santa Maria di Leuca occupe l’extrémité méridionale du Salento, avec hautes falaises, nombreuses grottes marines, sanctuaire et terminal monumental de l’aqueduc des Pouilles.",
          "en": "Santa Maria di Leuca occupies Salento’s southern tip, with high cliffs, many sea caves, its sanctuary and the monumental terminal of the Apulian Aqueduct.",
          "es": "Santa Maria di Leuca ocupa el extremo meridional del Salento, con altos acantilados, numerosas cuevas marinas, santuario y terminal monumental del Acueducto de Apulia."
        },
        "highlights": {
          "it": [
            "Grotta delle Tre Porte",
            "falesie",
            "Santuario de Finibus Terrae"
          ],
          "fr": [
            "Grotta delle Tre Porte",
            "falaises",
            "sanctuaire de Finibus Terrae"
          ],
          "en": [
            "Grotta delle Tre Porte",
            "cliffs",
            "De Finibus Terrae sanctuary"
          ],
          "es": [
            "Grotta delle Tre Porte",
            "acantilados",
            "Santuario de Finibus Terrae"
          ]
        }
      },
      "ugento": {
        "id": "ugento",
        "name": "Ugento e il suo litorale",
        "type": "territory",
        "confidence": "high",
        "aliases": {
          "it": [
            "ugento"
          ],
          "fr": [
            "ugento"
          ],
          "en": [
            "ugento"
          ],
          "es": [
            "ugento"
          ]
        },
        "sourceIds": [
          "ugento-park"
        ],
        "poiIds": [
          "ugento",
          "casale",
          "giurupi"
        ],
        "themes": [
          "wetlands",
          "ionian",
          "history"
        ],
        "summary": {
          "it": "Ugento unisce un centro storico dell’entroterra a un vasto litorale ionico protetto, fatto di dune, bacini e macchia mediterranea.",
          "fr": "Ugento relie un centre historique intérieur à un vaste littoral ionien protégé composé de dunes, bassins et maquis méditerranéen.",
          "en": "Ugento links an inland historic centre with a broad protected Ionian coast of dunes, basins and Mediterranean scrub.",
          "es": "Ugento une un centro histórico interior con una amplia costa jónica protegida de dunas, lagunas y matorral mediterráneo."
        },
        "highlights": {
          "it": [
            "Parco Litorale di Ugento",
            "Madonna del Casale"
          ],
          "fr": [
            "Parc du littoral d’Ugento",
            "Madonna del Casale"
          ],
          "en": [
            "Ugento Coastal Park",
            "Madonna del Casale"
          ],
          "es": [
            "Parque Litoral de Ugento",
            "Madonna del Casale"
          ]
        }
      },
      "porto_cesareo": {
        "id": "porto_cesareo",
        "name": "Porto Cesareo",
        "type": "territory",
        "confidence": "high",
        "aliases": {
          "it": [
            "porto cesareo"
          ],
          "fr": [
            "porto cesareo"
          ],
          "en": [
            "porto cesareo"
          ],
          "es": [
            "porto cesareo"
          ]
        },
        "sourceIds": [
          "visitpuglia-portocesareo"
        ],
        "poiIds": [
          "chianca",
          "conigli"
        ],
        "themes": [
          "ionian",
          "dunes",
          "coastal-towers"
        ],
        "summary": {
          "it": "Porto Cesareo è un territorio ionico noto per spiagge sabbiose, bassi fondali, dune, isolotti e torri costiere cinquecentesche.",
          "fr": "Porto Cesareo est un territoire ionien connu pour ses plages sableuses, faibles fonds, dunes, îlots et tours côtières du XVIe siècle.",
          "en": "Porto Cesareo is an Ionian territory known for sandy beaches, shallow water, dunes, islets and 16th-century coastal towers.",
          "es": "Porto Cesareo es un territorio jónico conocido por playas de arena, aguas poco profundas, dunas, islotes y torres costeras del siglo XVI."
        },
        "highlights": {
          "it": [
            "Torre Chianca",
            "Isola dei Conigli",
            "spiagge e dune"
          ],
          "fr": [
            "Torre Chianca",
            "Isola dei Conigli",
            "plages et dunes"
          ],
          "en": [
            "Torre Chianca",
            "Isola dei Conigli",
            "beaches and dunes"
          ],
          "es": [
            "Torre Chianca",
            "Isola dei Conigli",
            "playas y dunas"
          ]
        }
      },
      "melendugno": {
        "id": "melendugno",
        "name": "Melendugno e le sue marine",
        "type": "territory",
        "confidence": "high",
        "aliases": {
          "it": [
            "melendugno",
            "torre dell orso",
            "roca vecchia"
          ],
          "fr": [
            "melendugno",
            "torre dell orso",
            "roca vecchia"
          ],
          "en": [
            "melendugno",
            "torre dell orso",
            "roca vecchia"
          ],
          "es": [
            "melendugno",
            "torre dell orso",
            "roca vecchia"
          ]
        },
        "sourceIds": [
          "visitmelendugno"
        ],
        "poiIds": [
          "santandrea",
          "sorelle",
          "torre_santandrea",
          "poesia",
          "borgagne"
        ],
        "themes": [
          "adriatic",
          "archaeology",
          "sea-stacks",
          "villages"
        ],
        "summary": {
          "it": "Il territorio di Melendugno unisce l’entroterra agricolo e Borgagne a una costa adriatica di spiagge, falesie, faraglioni e siti archeologici come Roca Vecchia.",
          "fr": "Le territoire de Melendugno relie l’arrière-pays agricole et Borgagne à une côte adriatique de plages, falaises, stacks et sites archéologiques comme Roca Vecchia.",
          "en": "Melendugno links its agricultural hinterland and Borgagne with an Adriatic coast of beaches, cliffs, sea stacks and archaeological sites such as Roca Vecchia.",
          "es": "Melendugno une su interior agrícola y Borgagne con una costa adriática de playas, acantilados, farallones y yacimientos arqueológicos como Roca Vecchia."
        },
        "highlights": {
          "it": [
            "Torre dell’Orso",
            "Due Sorelle",
            "Torre Sant’Andrea",
            "Grotta della Poesia",
            "Borgagne"
          ],
          "fr": [
            "Torre dell’Orso",
            "Due Sorelle",
            "Torre Sant’Andrea",
            "Grotta della Poesia",
            "Borgagne"
          ],
          "en": [
            "Torre dell’Orso",
            "Due Sorelle",
            "Torre Sant’Andrea",
            "Grotta della Poesia",
            "Borgagne"
          ],
          "es": [
            "Torre dell’Orso",
            "Due Sorelle",
            "Torre Sant’Andrea",
            "Grotta della Poesia",
            "Borgagne"
          ]
        }
      },
      "vernole": {
        "id": "vernole",
        "name": "Vernole e Le Cesine",
        "type": "territory",
        "confidence": "high",
        "aliases": {
          "it": [
            "vernole",
            "le cesine"
          ],
          "fr": [
            "vernole",
            "le cesine"
          ],
          "en": [
            "vernole",
            "le cesine"
          ],
          "es": [
            "vernole",
            "le cesine"
          ]
        },
        "sourceIds": [
          "wwf-cesine"
        ],
        "poiIds": [
          "cesine"
        ],
        "themes": [
          "wetlands",
          "biodiversity"
        ],
        "summary": {
          "it": "Il territorio di Vernole comprende la Riserva delle Cesine, uno dei più importanti sistemi di zone umide costiere del Salento.",
          "fr": "Le territoire de Vernole comprend la réserve des Cesine, l’un des plus importants systèmes de zones humides côtières du Salento.",
          "en": "The Vernole area includes Le Cesine reserve, one of Salento’s most important coastal wetland systems.",
          "es": "El territorio de Vernole incluye la reserva de Le Cesine, uno de los sistemas de humedales costeros más importantes del Salento."
        },
        "highlights": {
          "it": [
            "Le Cesine",
            "birdwatching",
            "zone umide"
          ],
          "fr": [
            "Le Cesine",
            "observation des oiseaux",
            "zones humides"
          ],
          "en": [
            "Le Cesine",
            "birdwatching",
            "wetlands"
          ],
          "es": [
            "Le Cesine",
            "observación de aves",
            "humedales"
          ]
        }
      },
      "cannole": {
        "id": "cannole",
        "name": "Cannole e Torcito",
        "type": "territory",
        "confidence": "high",
        "aliases": {
          "it": [
            "cannole",
            "torcito"
          ],
          "fr": [
            "cannole",
            "torcito"
          ],
          "en": [
            "cannole",
            "torcito"
          ],
          "es": [
            "cannole",
            "torcito"
          ]
        },
        "sourceIds": [
          "torcito-official"
        ],
        "poiIds": [
          "torcito"
        ],
        "themes": [
          "rural-landscape",
          "walking",
          "heritage"
        ],
        "summary": {
          "it": "Cannole è collegata al paesaggio rurale di Torcito, un grande sistema di sentieri, masserie, cave e muri a secco a pochi chilometri da Otranto.",
          "fr": "Cannole est liée au paysage rural de Torcito, vaste système de sentiers, masserie, carrières et murs en pierre sèche à quelques kilomètres d’Otranto.",
          "en": "Cannole is linked with the rural landscape of Torcito, a large system of trails, masserie, quarries and dry-stone walls a few kilometres from Otranto.",
          "es": "Cannole está vinculada al paisaje rural de Torcito, un amplio sistema de senderos, masserie, canteras y muros de piedra seca a pocos kilómetros de Otranto."
        },
        "highlights": {
          "it": [
            "Parco Torcito",
            "masserie",
            "sentieri rurali"
          ],
          "fr": [
            "Parc Torcito",
            "masserie",
            "sentiers ruraux"
          ],
          "en": [
            "Parco Torcito",
            "masserie",
            "rural trails"
          ],
          "es": [
            "Parco Torcito",
            "masserie",
            "senderos rurales"
          ]
        }
      }
    },
    "coverage": {
      "poiTotal": 50,
      "knowledgeEntries": 50,
      "territories": 19,
      "pendingVerification": [
        "lecce",
        "scarra",
        "enea",
        "ripe",
        "giurupi"
      ]
    }
  };

  const normalize = value => String(value||"")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9\s]/g," ")
    .replace(/\s+/g," ")
    .trim();

  const api = {
    version: DATA.version,
    updated: DATA.updated,
    policy: DATA.policy,
    entries: DATA.entries,
    sources: DATA.sources,

    get(id) {
      return DATA.entries[id] || null;
    },

    getTerritory(id) {
      return DATA.territories?.[id] || null;
    },

    territoryForPoi(poiId) {
      for (const [id,territory] of Object.entries(DATA.territories||{})) {
        if ((territory.poiIds||[]).includes(poiId)) return {id,...territory};
      }
      return null;
    },

    territoriesForPoi(poiId) {
      return Object.entries(DATA.territories||{})
        .filter(([,territory])=>(territory.poiIds||[]).includes(poiId))
        .map(([id,territory])=>({id,...territory}));
    },

    findTerritories(query, language="it") {
      const q=normalize(query);
      if(!q)return [];
      const out=[];
      for(const [id,territory] of Object.entries(DATA.territories||{})) {
        const aliases=[
          id,
          territory.labels?.[language],
          ...(territory.aliases?.[language]||territory.aliases?.it||[])
        ].filter(Boolean).map(normalize);

        let score=0;
        let matchedAlias=null;
        for(const alias of aliases){
          if(!alias)continue;
          if(q===alias){score=Math.max(score,100);matchedAlias=alias;continue;}
          if((" "+q+" ").includes(" "+alias+" ")){
            const s=40+Math.min(alias.length,30);
            if(s>score){score=s;matchedAlias=alias;}
          }
        }
        if(score>0)out.push({id,entry:territory,score,matchedAlias});
      }
      return out.sort((a,b)=>b.score-a.score);
    },

    territorySourcesFor(id) {
      const territory=DATA.territories?.[id];
      if(!territory)return [];
      return (territory.sourceIds||[])
        .map(sourceId=>({id:sourceId,...DATA.sources[sourceId]}))
        .filter(item=>item.url);
    },

    poisForTerritory(id) {
      return [...(DATA.territories?.[id]?.poiIds||[])];
    },

    has(id) {
      return !!DATA.entries[id];
    },

    quality(id) {
      const entry=DATA.entries[id];
      return entry ? {
        confidence:entry.confidence||null,
        verificationStatus:entry.verificationStatus||null,
        territoryIds:[...(entry.territoryIds||[])]
      } : null;
    },

    sourcesFor(id) {
      const entry=DATA.entries[id];
      if(!entry)return [];
      return (entry.sourceIds||[]).map(sourceId=>({id:sourceId,...DATA.sources[sourceId]})).filter(item=>item.url);
    },

    search(query) {
      const q=normalize(query);
      if(!q)return [];
      return Object.entries(DATA.entries)
        .map(([id,entry])=>{
          const haystack=normalize([id,entry.poiId,(entry.themes||[]).join(" "),Object.values(entry.summary||{}).join(" ")].join(" "));
          let score=0;
          for(const token of q.split(" ").filter(Boolean)){
            if(haystack.includes(token))score+=1;
          }
          return {id,entry,score};
        })
        .filter(item=>item.score>0)
        .sort((a,b)=>b.score-a.score);
    },

    stats() {
      return {
        version:DATA.version,
        updated:DATA.updated,
        entries:Object.keys(DATA.entries).length,
        territories:Object.keys(DATA.territories||{}).length,
        sources:Object.keys(DATA.sources).length,
        coverage:DATA.coverage||null
      };
    }
  };

  window.AracneKnowledgeBase = api;
})();
