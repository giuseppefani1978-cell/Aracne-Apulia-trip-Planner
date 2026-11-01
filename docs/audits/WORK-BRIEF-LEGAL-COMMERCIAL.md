# MISSION WORK — Audit juridique, licences, commercialisation et partenariats
**Projet : Master Project Aracne — 1er novembre 2026**
**Périmètre : Il Volo di Aracne / Aracne Apulia Trip Planner + Hirundu**
**Statut : mandat d'audit, aucun avis juridique définitif, aucune modification de production**

## 0. Consigne opérationnelle
Agir dans une boucle Work indépendante de l'audit technique de fusion. Travail en lecture seule sur les trois dépôts et la documentation, avec recherches vérifiables sur les sources officielles actuelles. Ne PAS fusionner du code, ne pas déployer, ne pas créer de comptes externes, ne pas effectuer d'achat, ne pas modifier des bases de données ou DNS, ne pas contacter d'entreprises, ne pas publier de pages ni transmettre de données d'utilisateurs. Ne pas copier de secrets. Si les conditions de service, licences ou documents privés ne sont pas accessibles, marquer « non vérifié » et demander le document manquant.

Dépôts :
1. `giuseppefani1978-cell/Aracne-Apulia-trip-Planner` : socle actuel du planificateur touristique, bêta avec utilisateurs et données Supabase réelles.
2. `giuseppefani1978-cell/ilVolodAracne-` : moteur touristique, corpus territorial, Aracne Intelligence et UI de découverte.
3. `giuseppefani1978-cell/Hirundu1.1-` : jeu indépendant. Comparer les branches `main`, `version-1.0`, `play` lorsqu'elles sont pertinentes. La bêta indépendante actuelle existe sur `play.myapuliatrip.com`, via Vercel et son propre Supabase. Ne pas se fonder uniquement sur la branche par défaut.

Contexte technique : `Audit_fusion_Aracne.md` daté 01/11/2026 (Work, audit statique). Sa recommandation : unifier les deux produits touristiques sur le dépôt Planner ; garder Hirundu indépendant ; créer un staging réellement isolé. Cet audit ne conclut PAS sur la conformité légale, les droits d'exploitation ni le modèle commercial. Ne pas le dupliquer.

## 1. Propriété intellectuelle et droits à commercialiser
- Établir une nomenclature de composants et ressources, avec emplacement concret (chemin, import, URL, fichier) et statut « licence confirmée / attribution requise / usage interdit / document manquant / inconnu ».
- Auditer fichiers JavaScript, dépendances et licences transitives, images, photos, illustrations, vidéos/cinématiques, sons, musiques, polices, icônes, personnages et textes. Les licences de code open source ne couvrent pas automatiquement les médias.
- Vérifier particulièrement les personnages et la cinématique d'Hirundu, les illustrations géographiques, les QR, contenus touristiques et les photos partenaires ; vérifier auteur, chaîne de droits, origine éventuelle de génération IA, restrictions d'usage commercial, crédits nécessaires.
- Vérifier les sources du corpus Aracne Intelligence : droits sur textes, fiches, photos, résumés, liens, citations, extraction/réutilisation, provenance, base de données et obligations d'attribution. Distinguer faits géographiques, éléments protégés et données soumises à conditions contractuelles.
- Auditer les licences et conditions d'utilisation d'OpenStreetMap, fond de carte / serveurs de tuiles, Leaflet, géocodage, navigation, Open-Meteo, Google Maps / Waze, hébergement et tout service/API réellement utilisé.
- Vérifier droits sur les noms et logos « Aracne », « Il Volo di Aracne », « Hirundu », `myapuliatrip.com` : registres pertinents de marques France/UE/Italie, noms de domaine et risque de confusion ; **ne pas présumer la disponibilité ou propriété**.

## 2. Conformité confidentialité, jeu, tourisme, e-commerce
- Cartographier les données personnelles effectivement collectées : accès bêta par code et session navigateur, pseudonymes, feedback, journaux de voyage, notes privées/partagées, invitations, géolocalisation, photos, progression et échanges QR/cartes, éventuels partenaires et paiements futurs.
- Analyse RGPD : finalités, base légale, information, conservation, suppression/accès/export, sous-traitants et DPA, transferts internationaux, sécurité, journalisation, incidents et droits des mineurs. Déterminer si un traitement justifie une AIPD; ne pas affirmer qu'elle est requise sans étude.
- Évaluer conformité cookies/localStorage/ePrivacy, permissions PWA, caméra et localisation ; préciser les finalités strictement nécessaires et les traceurs facultatifs.
- Évaluer pages obligatoires adaptées aux exploitants potentiels (mentions légales, politique de confidentialité, CGU, CGV si payant, contact, politique de retrait, cookies, rétractation pour achats numériques si applicable) et langues FR/IT/EN/ES pertinentes.
- Déterminer les obligations conditionnelles selon la nature réelle de l'activité touristique (simple planificateur d'itinéraires, réservation d'hébergements/activités, mise en relation, forfait touristique, affiliation). **Ne pas présumer que le Planner agit comme agent de voyages**.
- Étudier droits des consommateurs UE/FR/IT pour bien numérique, abonnement, publicité/sponsoring, concours, classement, transparence des partenaires, mineurs et accès aux données; préciser si des règlements UE (DSA, accessibilité EAA, etc.) concernent réellement le scénario et pourquoi.

## 3. Monétisation et hébergement
Évaluer comparativement au minimum :
A. bêta gratuite sur invitation;
B. application touristique gratuite, expériences locales sponsorisées ou affiliées;
C. version premium ou fonctionnalités payantes du planificateur;
D. Hirundu avec paiement unique hypothétique (~0,99 €) ou free-to-play sponsorisé (les hypothèses ne sont PAS des prix approuvés);
E. partenariats territoriaux, hôteliers, prestataires et commerces dans le tableau de bord;
F. éventuelle commercialisation PWA/web puis publication plus tard sur les stores.

Pour chaque modèle : prérequis légaux, risques de licence, RGPD, expérience utilisateur, complexité de facturation, TVA/OSS selon établissement de l'exploitant (à confirmer), coûts récurrents et coûts par utilisateur, marge estimative **avec hypothèses déclarées** et conditions de paiement.
Vérifier le statut et conditions actuelles de GitHub Pages, Vercel Hobby/Pro, Supabase, hébergeur DNS, et toute API utilisée ; distinguer contrat de service, limites techniques et restrictions commerciales. Ne pas inventer de prix ni de droits.

## 4. Cadre des partenaires
Proposer le contrat fonctionnel minimum du futur panel Partenaires : rôle, droits, établissement, preuve d'autorisation d'utiliser logos/images, fiche/POI, étiquetage de l'offre sponsorisée, durée, tarification, facture, statistiques agrégées, consentements, suppression et contrôle éditorial.
Distinguer les partenariats « sponsorisation » des recommandations touristiques éditoriales ; contrôler les conflits d'intérêts et obligations de transparence.

## 5. Résultats attendus, avec sources
Produire un rapport unique `AUDIT-LEGAL-COMMERCIAL-ARACNE-HIRUNDU.md` comprenant :
1. **Synthèse exécutive** : go/no-go différenciés (bêta sur invitation, bêta publique, commercialisation du Planner, commercialisation d'Hirundu, partenaires).
2. **Registre de risques P0/P1/P2**, propriétaire et prochaine mesure, gravité, probabilité, preuve, coût/effort indicatif.
3. **SBOM / inventaire des licences et médias**, avec chemin GitHub, licence précise, origine et lien de preuve; les inconnues doivent être explicites, et pas de conclusion « tout est libre » sans vérification.
4. **Carte des données personnelles / sous-traitants** et manques documentaires; distinguer projets Supabase distincts.
5. **Checklist documentaire** priorisée : crédits, mentions légales, confidentialité, CGU/CGV éventuelles, clauses partenaires.
6. **Comparatif commercial** des scénarios, conditions, tarifs sources et faisabilité, avec hypothèses et métriques économiques nécessaires.
7. **Backlog actionnable** séparé par dépôt, 10–20 tickets maximaux sans doublon avec l'audit technique; une colonne « bloque les bêta-tests / bloque la commercialisation / amélioration ».
8. **Sources vérifiables et datées** : URL officielles, date de consultation, pays ou juridiction, faits confirmés vs interprétations, incertitudes et questions à poser au propriétaire.

## 6. Critères de qualité et sauvegarde
- Respecter au maximum le droit français, italien et européen pertinent, sans donner un avis d'avocat comme définitif. Préconiser revue professionnelle pour les risques critiques.
- Ne PAS déclarer une non-conformité établie sans démonstration. Séparer clairement « obligation probable », « obligation possible sous condition », « à confirmer » et « recommandation produit ».
- Ne PAS bloquer les bêta-tests existants sans cause étayée ; signaler en revanche les risques P0 immédiats (données, médias sans droits, mineurs, accès serveur, hébergement commercial).
- Ne faire aucun changement au code/aux bases/au DNS/aux workflows de production. Ne créer aucune PR de fusion. Le rapport peut être rédigé sur cette branche d'audit, sous `docs/audits/`.
- Le rapport doit servir de base de décision, pas de promesse de conformité ni d'autorisation automatique de monétiser.

**Branche de travail :** `Aracne-Apulia-trip-Planner:audit/legal-commercial-2026-11-01`.
