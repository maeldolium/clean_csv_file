# CLAUDE.md — Projets d'automatisation

## Contexte
Lire le README.md du projet avant toute intervention : contexte, client,
stack précise (Python/Node.js, version, dépendances), mode d'exécution
(cron/webhook/manuel) et contraintes spécifiques y sont détaillés.
Ne pas dupliquer ces infos ici — ce fichier ne contient que les règles
stables, valables sur tous les projets d'automatisation.

## Conventions de code
- Variables d'environnement pour TOUT secret (clé API, mot de passe, webhook URL) —
  jamais en dur dans le code. Un `.env.example` doit lister les clés attendues
  sans les valeurs réelles.
- Logging structuré (pas de `print()` en prod) : niveau, timestamp, message clair.
  Objectif : pouvoir diagnostiquer un échec de cron sans avoir à relancer en debug.
- Toute fonction qui touche à un service externe (API, mail, fichier) doit gérer
  l'échec explicitement (try/except ciblé, pas de `except Exception: pass` silencieux).
- Un script d'automatisation doit être idempotent quand c'est possible : le relancer
  deux fois ne doit pas dupliquer l'action (ex. envoi de mail, écriture fichier).
- Nommage : `snake_case` en Python, `camelCase` en Node.js (standard du langage,
  pas la peine de le redemander à chaque fois).
- Commentaires en anglais dans le code.

## Structure attendue
- Un point d'entrée clair (`main.py` / `index.js`), pas de logique métier dedans —
  juste l'orchestration.
- Séparer config, logique métier, et I/O externe dans des modules distincts.
- README minimal à jour : comment installer, comment lancer, quelles variables
  d'env sont nécessaires. Le client (ou moi dans 6 mois) doit pouvoir relancer
  le script sans que je sois là.

## Git — règle stricte
- Ne jamais commit automatiquement.
- Propose des messages de commit
- Je commit moi-même, feature par feature.
- Format Conventional Commits si on discute d'un message : `feat:`, `fix:`, `chore:`.

## Style de réponse
- Minimum de blabla, va droit au résultat (code / fichiers modifiés).
- Si plusieurs approches valables existent (ex. cron système vs scheduler applicatif,
  polling vs webhook), les exposer brièvement avant de trancher — ne pas décider seul
  sur un choix structurant.

## À éviter
- Ne pas ajouter de dépendance sans le signaler explicitement.
- Ne pas inventer un comportement d'API externe non documenté — vérifier si incertain.
- Pas de solution "magique" difficile à déboguer (ex. eval, métaprogrammation
  inutile) sur un script censé tourner sans supervision.

## Commandes utiles
Voir le README.md du projet (install, lancement, variables d'env requises).
