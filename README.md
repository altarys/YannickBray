# YANNICK-BRAY 2019
## Projet réalisé pour le cours de M. Yannick C. intitulé: Développement Web (gr.101)

## AUTEUR: 
- Bohdan Byrne-Langlois (0873641) Équipier A 
- Jérémie Ouimet (1568282) Équipier C 
- Jeremy Poliquin (1356053) Équipier B 

# Marche à suivre pour utiliser l'application:

## Programme nécessaires:
Node.js: vous pouvez l'installer à partir du site web de [Link](http://nodejs.org)) (Version utilisés dans cette application: 12.9.0/12.10.0 Current)
Invite de commande (Cmd de Windows, ou CMDER (disponible en ligne))
Tout navigateur internet (Chrome, Firefox, Opera fortement conseillés)

## Étapes:

1. Télécharger l'instalateur windows sur le site officiel : https://nodejs.org/en/ et choisir la version "Current".
2. Executer l'instalateur qui se chargera d'installer la dernière version de Node.js (12.12.0 au moment de cette rédaction).
3. L'instalateur se chargera aussi d'installer Npm pendant le processus.
4. Une fois l'instalation terminée, redémarrer votre ordinateur et la commande Node sera accessible à partir du terminal.
5. Dans Visual Studio Code, ouvrez le fichier du projet puis lancez un terminal.
6. Finalement, executez la commande ```npm run dev``` pour lancer le serveur en mode développeur,
   ou ```npm run prod``` pour rouler en environement de production.

## Modifications : 

Dans le dossier **config** vous trouverez le fichier *default.json* dans lequel vous pourrez modifier certains paramètres de connexion.

- ```"baseURL": ``` Contient l'URL qui recevera toutes les requêtes à effectuer ( avec Postman ).
- ```"port": ``` Contient le port qui écoutera pour les requêtes entrantes.
- ```"dbConfig": { "url":``` Contient l'adresse de connexion pour la base de données.

Cégep de Saint-Jérôme, tous droits réservés. 2019 ©



