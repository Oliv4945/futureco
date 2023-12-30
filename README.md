> Copyright 2023,2024 Maël THOMAS-QUILLÉVÉRÉ. L'ensemble de ce dépot est soumis à la licence AGPL3.

## Futureco


## Futureco voyage

Les développements de 2024 vont se concentrer sur le développement d'une application de cartes généralistes et libres, avec une attention particulière sur les itinéraires pour aider les gens à voyager tout en respectant la planète. 

Le développement se fait dans le dossier app/voyage. 

Découvrez [nos motivations](https://futur.eco/blog/un-beau-voyage) et les dernières nouveautés dans [le blog](https://futur.eco/blog).

## Les calculateurs carbone

> La partie historique du site continue d'être disponible, et servie au grand public via les articles du site bonpote.com. Dans un second temps, elles seront probablement fusionnées dans /voyage.

La catastrophe climatique n'est plus une menace lointaine et incertaine, c'est une actualité. Comment éviter le pire ? Chaque aspect de notre vie moderne a un impact.

Or, aujourd'hui, c'est très difficile de le connaître : les données sont éparpillées, souvent dans des articles de presse sans source. Des simulateurs et modèles d'impact carbone existent, mais aucun ne répond à ces priorités :

-   l'interface doit s'adresser au grand public. Balancer des kgCO2e sans explication n'est pas compréhensible
-   le code doit être ouvert
-   le code doit être lisible, critiquable, modifiable.

Sur ce dépôt, c'est le code du site en Javascript. Tout le contenu et les discussions autour des contribution s sur un autre dépot : [futureco-data](https://github.com/laem/futureco-data).

[Plus d'infos sur le projet](https://futur.eco/à-propos).

> 🇬🇧 Most of the documentation (including issues and the wiki) is written in french, please raise an [issue](https://github.com/betagouv/mon-entreprise/issues/new) if you are interested and do not speak French.

### Et techniquement ?

C'est un _fork_ d'un site de l'État, mon-entreprise.fr, qui permet de coder en français des règles de calculs, dans un langage simple et extensible, [publi.codes](https://publi.codes). De ces règles de calcul, des simulateurs (pour l'utilisateur lambda) et des pages de documentation qui expliquent le calcul (pour l'expert ou le curieux) sont générés automatiquement.

Au-delà de ça, nous sommes sur une appli traditionnelle NextJS / styled-components.


# Développement

1. Installation avec `yarn install`
2. Compilation du projet avec `yarn run build`
3. Lancer le serveur avec `yarn run start`
4. L'interface est disponible à l'adresse [http://localhost:8080](http://localhost:8080)

Optionnel:

* Utilisation de `Voyage`: Générer une clef API [Maptiler](https://cloud.maptiler.com/account/keys/), puis créer un fichier `.env.local` avec `NEXT_PUBLIC_MAPTILER=<MAPTILER_API_KEY>`, puis revenir au point 2.