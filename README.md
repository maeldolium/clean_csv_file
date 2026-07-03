# Nettoyeur de fichier CSV

## Contexte et besoin
Un logiciel de gestion exporte un fichier CSV avec un tableau de contact. 

Problème : numéros de téléphone dans des formats différents, noms pas uniformisés, doublons.

But : Créer un outil dans lequel on peut déposer un fichier CSV et récupérer un fichier CVS propre.

## Fonctionnalités attendues
Interface utlisateur:
- Page web simple avec bouton "Déposer mon fichier CSV
- Aperçu du fichier avant/après nettoyage (tableau comparatif)
- Bouton "Télécharger le fichier"
- Message de confirmation : "X doublons supprimés, Y numéros reformatés"

Traitements automatiques:
- Normalisation des numéros de téléphones au format 06 01 02 03 04
- Mise en forme des noms -> Prénom Nom
- Suppression des doublons (basée sur mail)
- Suppression des lignes vides
- Encodage UTF-8 garanti en sortie

Colonnes du fichier CSV:
Colonne A 	Prénom
Colonne B	Nom
Colonne C	Email
Colonne D	Téléphone
Colonne E	Ville
Colonne F	Date de contact

## Stack:
Python (panda)
Flask (serveur web)
HTML/CSS ou React
Hébergement: Render



