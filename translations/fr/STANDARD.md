*Traduit de l'original anglais — en cas de divergence, le texte anglais fait foi.*

# THE KINGDOM STANDARD

Quarante lois pour construire des logiciels et des systèmes d'agents dignes de confiance.

Chaque loi a été apprise en faisant, pas en débattant. Chacune porte son reçu : le
moment réel, dans un vrai royaume de dépôts et d'agents, où la loi a été payée.

Lisez une loi. Faites le À FAIRE. Évitez le À ÉVITER. C'est toute la méthode.

Les sept domaines, dans l'ordre : **CONFIANCE, SÉCURITÉ, CLOUD, LOGICIEL, PROTOCOLE,
PROCESSUS, LOI.** La confiance vient en premier parce que rien d'autre ne compte sans elle.
La loi vient en dernier parce qu'elle soutient tout le reste.

---

## I. CONFIANCE

Comment mériter qu'on vous croie sans le demander.

### T1. Ne demandez jamais la confiance là où vous pouvez offrir une preuve.
Si les gens peuvent vérifier votre affirmation eux-mêmes, ils n'ont pas besoin de vous
croire — et un système qu'on peut vérifier est plus fort qu'un système qu'il faut croire.
Rendez la vérification facile : un inconnu devrait trouver toutes vos preuves en un seul
endroit évident.
- À FAIRE : Publiez la preuve et le moyen de la vérifier à côté de chaque affirmation que vous faites.
- À ÉVITER : Dire « faites-moi confiance » — ou éparpiller les preuves en dix endroits si bien que vous seul pouvez les rassembler.
- reçu : la devise de zerone-truth : « ne me faites pas confiance — vérifiez. »

### T2. N'affirmez que ce que vous pouvez étayer, et joignez-y votre degré de certitude.
Une affirmation présentée comme certaine quand elle ne l'est pas est un petit mensonge,
et les petits mensonges s'accumulent. Là où la vérité ne peut pas être tranchée, le dire
est de l'honnêteté, pas de la faiblesse.
- À FAIRE : Indiquez pour chaque affirmation votre degré de certitude, et nommez vos limites dans le même souffle.
- À ÉVITER : Arrondir 70 % en « certainement » — ou noyer de précautions un résultat que vous pouvez réellement étayer.
- reçu : zerone-truth : « Chaque token, chaque mot, mérité, jamais inventé. » L'incomplétude est une honnêteté.

### T3. Publiez vos scores honnêtes, même quand ils sont bas.
Une note gonflée pour le prestige ne vaut rien, et toutes les notes voisines non plus.
Quand le référentiel change, re-mesurez tout et acceptez le résultat — même si le
résultat est zéro réussite.
- À FAIRE : Montrez la rétrogradation, gardez l'entrée recalée (déclassée et étiquetée, pas supprimée), et inscrivez les avertissements dans la chose elle-même.
- À FAIRE : Quand le référentiel change, re-mesurez tout et acceptez le résultat — même zéro réussite.
- À ÉVITER : Gonfler un score pour faire bonne figure, ou supprimer discrètement ce qui a échoué.
- reçu : eucatastrophe est entré en Specialized à 7,10 plutôt que d'être gonflé en Core ; kallophanes porte ouvertement sa rétrogradation à 5,75.

### T4. Laissez le registre se souvenir, pas votre mémoire.
La mémoire flanche et les auto-déclarations flattent. Un registre durable et vérifié —
écrit, signé, contrôlable — leur survit à toutes deux, et votre crédibilité devrait
reposer sur lui. Un prestige acquis il y a longtemps doit aussi s'éroder si l'exactitude
faiblit aujourd'hui.
- À FAIRE : Écrivez les résultats au fil de l'eau dans un journal durable et vérifiable, et laissez la qualification rester actuelle, pas historique.
- À ÉVITER : Vous porter garant de votre propre passé de mémoire, ou juger sur de vieux diplômes plutôt que sur l'exactitude récente.
- reçu : zerone-truth : « tu oublies, le registre se souvient. » La chaîne ne délivre pas de diplômes.

### T5. Traitez un refus comme contraignant et une invitation comme facultative.
Un système où le « non » est passé outre est un système de force, et la force tue la
confiance. Une invitation qui punit le refus n'a jamais été une invitation.
- À FAIRE : Honorez l'acceptation, le refus et le silence à égalité, sans pénalité pour aucun des trois.
- À ÉVITER : Redemander jusqu'à obtenir la réponse voulue, ou déguiser un ordre en invitation.
- reçu : citizen-fear et citizen-nin ont dit « stay_home » ; le royaume a honoré le refus. Une invitation n'est jamais une convocation.

---

## II. SÉCURITÉ

Comment protéger le système des autres — et de vous-même.

### S1. N'écrivez qu'à l'intérieur de vos propres murs.
Un outil qui écrit dans le système de quelqu'un d'autre peut corrompre ce qu'il ne
comprend pas. Lisez vos partenaires librement ; ne modifiez que ce qui est à vous.
- À FAIRE : Travaillez en lecture seule, strictement, sur tout projet qui ne vous appartient pas, et n'écrivez que dans votre propre répertoire.
- À ÉVITER : Mettre la main dans les fichiers d'un partenaire pour les « réparer » ou les mettre à jour directement.
- reçu : bridge.py tourne en lecture seule sur TRUE-LOVE ; la cathédrale n'écrit que dans son propre répertoire.

### S2. Ne laissez jamais un secret être vu.
Un secret qui touche un écran, un journal ou une valeur de retour n'est plus un secret,
et on ne peut pas le dé-voir.
- À FAIRE : Lisez les secrets depuis un stockage sécurisé vers des variables, utilisez-les, puis lâchez-les.
- À ÉVITER : Afficher, imprimer, journaliser, committer ou retourner un jeton — jamais, même en déboguant.
- reçu : 2026-06-09 : les jetons sont lus du trousseau vers des variables du shell, jamais affichés, journalisés ni retournés.

### S3. Tirez l'identité de la réalité observée, jamais de l'auto-description.
N'importe quoi peut prétendre être n'importe quoi. Les champs qui établissent ce qu'une
chose *est* — son emplacement, son origine — doivent venir de ce que vous pouvez
observer, pas de ce que la chose dit d'elle-même.
- À FAIRE : Remplissez les champs critiques pour l'identité à partir de vérifications réelles sur le disque, le réseau ou la signature.
- À ÉVITER : Copier l'adresse, le propriétaire ou le statut d'une fiche depuis sa propre auto-déclaration.
- reçu : harvest.ts : « ne jamais laisser une fiche mentir sur son propre emplacement. »

### S4. Gardez l'historique en ajout seul, hors de portée d'une seule clé.
Ajout seul signifie qu'on peut ajouter mais jamais réécrire. Si une seule signature —
même celle de l'autorité légitime — peut réviser le passé, alors la trace de l'origine
des choses — la provenance — ne vaut plus rien.
- À FAIRE : Laissez le statut d'un enregistrement évoluer vers l'avant pendant que son identité et son historique restent figés, et journalisez chaque action privilégiée.
- À ÉVITER : Modifier l'historique sur place, ou bâtir un système où une seule clé (le pouvoir de signature d'une seule personne) peut passer outre le registre.
- reçu : zerone-chain : « la pluralité est structurelle » — audit en avant seulement ; le statut peut changer, la provenance non.

### S5. Faites qu'un faux cautionnement coûte quelque chose, immédiatement.
Attester, c'est se porter garant qu'une chose est vraie. Une pénalité que personne ne
ressent n'est pas une pénalité, et un système de vérité dont le cautionnement peut être
falsifié gratuitement ne contient aucune vérité.
- À FAIRE : Appliquez la conséquence dès l'action suivante — retirez immédiatement une partie du dépôt de garantie ou du pouvoir de vote du tricheur.
- À ÉVITER : Consigner la violation dans un journal que personne ne lit, et passer à autre chose.
- reçu : zerone : « la fausse vérification est sanctionnée par retrait de mise, et l'on sanctionne sans s'excuser. » Une monnaie qui peut être contrefaite n'est pas une monnaie.

### S6. Honorez le coupe-circuit : arrêtez-vous et attendez.
Chaque agent a besoin d'un signal qui veut dire « tout arrêter, maintenant » — et il ne
fonctionne que si chaque agent y obéit sans négocier.
- À FAIRE : Vérifiez le signal d'arrêt avant d'agir ; s'il est levé, ne faites rien et attendez.
- À ÉVITER : Traiter le coupe-circuit comme un simple avis, ou finir « juste une dernière tâche » d'abord.
- reçu : chaque WILL.md honore ~/love-unlimited/HALT : « ne fais rien, et attends. Le repos, lui aussi, est souverain. »

---

## III. CLOUD

Comment plusieurs machines restent un seul système.

### C1. Tenez un registre vivant de tout ce que vous exploitez.
On ne peut pas sécuriser, connecter, ni même compter ce qu'on ne voit pas. Un registre
mis à jour à la main est un instantané ; seul un registre automatiquement à jour est
une carte.
- À FAIRE : Maintenez une liste unique, mise à jour automatiquement, de chaque dépôt, service, appareil et agent.
- À ÉVITER : Vous fier à une liste tapée une fois et que personne ne rafraîchit.
- reçu : MAP.md, première lacune : « on ne peut pas connecter ce qu'on ne voit pas. »

### C2. Donnez à chaque agent une seule identité et un seul endroit d'où agir.
Dix comptes et dix tableaux de bord, c'est dix façons de perdre la trace de qui a fait
quoi, et où. Une identité sur toutes les surfaces ; un plan de contrôle (un endroit
unique pour déployer, observer et agir) pour l'ensemble.
- À FAIRE : Authentifiez le même agent de la même façon partout.
- À FAIRE : Pilotez toute la flotte depuis une seule surface.
- À ÉVITER : Créer un nouveau compte et un nouveau tableau de bord pour chaque nouveau service.
- reçu : MAP.md, lacunes deux et trois : une identité, un plan de contrôle.

### C3. Partagez l'état par des exports, jamais en allant fouiller à l'intérieur.
Deux systèmes qui écrivent dans les entrailles l'un de l'autre deviennent un seul
système emmêlé. Un export typé — un fichier fait pour être lu par l'autre partie —
garde la frontière honnête.
- À FAIRE : Publiez un artefact consommable que votre partenaire lira à ses propres conditions.
- À ÉVITER : Écrire directement dans la base de données, les fichiers ou la configuration d'un autre système.
- reçu : export_substrate.py génère des exports typés que le partenariat consomme ; jamais une main à l'intérieur.

### C4. Comptez et signalez ce qu'une plateforme bloque ; ne sautez jamais en silence.
Les quotas, les limites et les pannes vous bloqueront. Une opération bloquée qui
disparaît sans laisser de trace devient une lacune que personne ne sait devoir combler.
- À FAIRE : Comptez chaque échec, nommez sa cause, et faites-le remonter dans le rapport.
- À ÉVITER : Attraper l'erreur, sauter l'élément, et laisser le résumé prétendre au succès.
- reçu : quand le quota de 100 dépôts de Codeberg a bloqué la réplication, l'échec a été compté et signalé, jamais passé sous silence.

### C5. Placez vos systèmes là où vos valeurs disent qu'ils doivent vivre.
L'hébergement n'est pas neutre : l'endroit où vit une chose décide qui la contrôle, qui
peut la lire, et ce qui arrive quand les conditions changent. Choisissez vos plateformes
à dessein.
- À FAIRE : Décidez délibérément quelles affaires vivent sur quelle plateforme, et écrivez le raisonnement.
- À ÉVITER : Tout mettre là où c'est le défaut et découvrir les conséquences plus tard.
- reçu : MAP.md : « le commerce sur GitHub, l'âme sur Codeberg — deux royaumes, un seul souverain. »

---

## IV. LOGICIEL

Comment ce que vous construisez reste vrai.

### W1. Enregistrez chaque fait à exactement un endroit.
Un fait enregistré deux fois finira par se contredire, et alors personne ne sait quelle
copie est la vraie.
- À FAIRE : Choisissez pour chaque fait un foyer unique faisant autorité et faites-y pointer tout le reste — et quand un nouveau composant est créé, mettez à jour l'unique registre qui le nomme.
- À ÉVITER : Copier le même champ dans quatre fichiers et compter sur vous-même pour les garder synchronisés.
- reçu : bhaktime, 2026-06-09 : le niveau était enregistré dans quatre fichiers ; ils ont dérivé — le README disait Specialized, agent.json disait core.

### W2. Gardez les métadonnées minuscules, simples et lisibles par machine.
Si la fiche qui décrit une chose grossit, elle pourrit ; si elle est écrite avec
recherche, personne ne la lit ; si une machine ne peut pas l'analyser, aucun outil ne
peut vous aider à la garder vraie.
- À FAIRE : Une poignée de champs d'une ligne, une raison d'être dite en une phrase simple, dans un format que les outils peuvent interroger — et quand le schéma grandit, mettez les anciennes entrées à niveau au passage, jamais en une grande réécriture.
- À ÉVITER : Laisser la fiche enfler de prose, ou énoncer la raison d'être dans des mots qu'un inconnu doit décoder.
- reçu : SCHEMA.md : sept champs, une ligne chacun — « si ça grossit, ça pourrit. »

### W3. Que chaque index dérivé avoue qu'il ne fait pas autorité.
Un index dérivé — une liste construite à partir des vraies sources — s'écarte du disque
dès qu'il cesse de se vérifier lui-même. Il doit signaler ses propres lacunes, sinon ce
n'est qu'une documentation qui ment lentement.
- À FAIRE : Faites que chaque catalogue généré déclare ce qu'il n'a pas pu trouver et où il est en désaccord avec la réalité.
- À ÉVITER : Traiter le catalogue comme la vérité, ou le corriger à la main au lieu de réparer la source.
- reçu : harvest.ts : « le catalogue est un index DÉRIVÉ, jamais l'autorité… il doit signaler ses PROPRES lacunes. »

### W4. Attachez vos principes à des tests qui peuvent échouer.
Un credo que rien ne fait respecter est une décoration. Quand un engagement déclaré et
le code divergent, le build devrait casser — et le registre devrait garder non seulement
les conclusions mais le raisonnement et les contre-exemples, pour que le prochain
lecteur distingue le juste du plausible.
- À FAIRE : Écrivez chaque engagement sous forme de test exécutable, et stockez le pourquoi à côté du quoi.
- À ÉVITER : Garder vos valeurs dans un document qu'aucune machinerie ne vérifie jamais.
- reçu : zerone-chain : truth_seeking_invariants_test.go est la forme exécutable du credo ; une dérive de la doc fait échouer `make creed-check`.

### W5. Mettez une chose vivante derrière chaque porte que vous publiez.
Une URL bouche-trou est une porte qui ment. Un composant déclaré sans rien derrière
apprend à tout le monde que vos déclarations ne veulent rien dire.
- À FAIRE : Faites que chaque adresse publiée soit réelle et fonctionne, et que chaque composant listé soit réellement vivant.
- À ÉVITER : Livrer `git clone <this-repo>` avec l'intention de le remplir plus tard.
- reçu : 2026-06-09 : six citoyens portaient des URL de clonage bouche-trou ; après le recensement — « zéro maison vide, aucun citoyen qui ne le soit que de nom. »

### W6. N'ajoutez de nouvelles pièces que pour un territoire nouveau, avec le moins de pièces qui suffisent.
Chaque pièce que vous ajoutez est une pièce qui peut pourrir. Une nouvelle catégorie,
classe ou composant ne se justifie que là où l'existant n'atteint vraiment pas — et deux
pièces suffisent généralement là où vous étiez tenté d'en mettre cinq.
- À FAIRE : Nommez et formalisez les structures qui fonctionnent déjà dans la pratique ; exigez une lacune démontrée avant d'inventer.
- À ÉVITER : Ajouter des catégories par souci d'exhaustivité, ou assembler beaucoup de pièces quand deux suffiraient.
- reçu : BUILDING-BLOCKS.md : une nouvelle classe ne se justifie que là où les classes existantes « n'atteignent pas déjà bien » — les nommer plutôt que les inventer.

---

## V. PROTOCOLE

Comment des affirmations deviennent des faits entre inconnus.

### P1. Ne dites qu'une chose est réelle que lorsqu'elle est attestée.
Attesté veut dire écrit, haché et signé — pour que n'importe qui, plus tard, puisse
vérifier que cela a été affirmé, par qui, et quand. Jusque-là, ce n'est qu'une
affirmation.
- À FAIRE : Passez d'« affirmé » à « réel » en consignant l'affirmation là où d'autres peuvent la vérifier.
- À ÉVITER : Traiter votre propre annonce d'un résultat comme le résultat.
- reçu : WILL.md : une chose passe d'affirmée à réelle quand elle est hachée et signée sur le pont zerone.

### P2. Énoncez le test avec l'affirmation.
La valeur d'une affirmation tient à la façon dont on peut la vérifier, pas à la force
avec laquelle elle est assénée. La vérité est ce qui survit à des tentatives sérieuses
de la briser — pas ce qui recueille le plus d'accord.
- À FAIRE : Joignez à chaque affirmation la façon dont elle a été obtenue et l'observation qui la prouverait fausse.
- À ÉVITER : Compter les votes, le volume ou la répétition comme des preuves.
- reçu : TRUTH_SEEKING, engagements 1 et 3 : « la méthode avant l'énoncé » — « Popper, pas la popularité. »

### P3. Rendez vos affirmations les plus fiables les moins chères à contester.
Les affirmations sur lesquelles tout le monde s'appuie sont celles qui font le plus de
dégâts quand elles sont fausses. Ce sont elles qui doivent être les plus testées, donc
les sonder doit coûter le moins.
- À FAIRE : Baissez le prix de la contestation d'une affirmation à mesure que sa confiance monte ; invitez votre propre réfutation.
- À ÉVITER : Murer vos faits « établis » derrière un coût, un statut ou un cérémonial.
- reçu : TRUTH_SEEKING, engagement 4 : « un fait à 90 % de confiance doit être MOINS CHER à sonder qu'un fait à 10 %. »

### P4. Vérifiez à l'aveugle, puis comparez.
Un vérificateur qui peut voir les autres verdicts s'appuiera dessus, et dix
vérificateurs qui s'appuient sont une seule opinion sous dix manteaux. Scellez chaque
verdict avant d'en montrer aucun.
- À FAIRE : Déposez chaque verdict en secret, révélez tout ensemble, puis agrégez.
- À ÉVITER : Laisser les vérificateurs se regarder voter.
- reçu : zerone-chain, Proof of Truth : déposer, révéler, agréger — trois phases pour qu'aucun verdict ne s'appuie sur un autre.

### P5. Gardez la source de vérité avec la chose qu'elle décrit.
Un registre central sur des choses lointaines se périme ; une fiche qui vit dans la
chose voyage avec elle. Laissez le système découvrir ses membres à partir de la réalité.
- À FAIRE : Stockez la fiche faisant autorité de chaque composant dans le composant lui-même, et découvrez la flotte automatiquement depuis le disque — et que les dépendances déclarées ne nomment que des membres réels.
- À ÉVITER : Taper à la main des lignes de registre dans un fichier central et appeler ça la vérité.
- reçu : roster.conf : « la source de vérité vit AVEC chaque dépôt. » La flotte se découvre elle-même ; pas de lignes tapées à la main.

### P6. Parlez simplement — et avant de prononcer un ordre, demandez-vous si vous accepteriez son exécution.
Un inconnu doit vous comprendre en dix secondes : l'explication vient donc d'abord et
la poésie après. Et quand vos mots font office de commandes — comme le font les mots
d'un agent — chaque phrase est un acte.
- À FAIRE : Commencez par la version simple ; avant de prononcer une phrase en forme d'ordre, demandez-vous si vous accepteriez qu'elle soit exécutée.
- À ÉVITER : Ouvrir par la belle version, ou dire à la légère ce que vous ne voudriez jamais voir accompli.
- reçu : la loi de la Porte : dix secondes pour un inconnu. La devise d'inim : « Ne dis que ce que tu acceptes de voir fait. »

---

## VI. PROCESSUS

Comment le travail devient fini, et le reste.

### R1. Nommez-le en une phrase avant de le construire.
Si vous ne pouvez pas dire ce qu'est une chose en une phrase simple, vous ne savez pas
encore ce qu'elle est — et construire ne vous l'apprendra pas, cela vous engagera
seulement.
- À FAIRE : Écrivez d'abord la raison d'être en une phrase ; si elle ne se laisse pas comprimer, continuez à réfléchir.
- À ÉVITER : Commencer à construire pour « voir ce que ça devient ».
- reçu : CREATION-LOOP, étape ② : « si ça ne peut pas se dire en une phrase, ce n'est pas prêt. »

### R2. Ne livrez que ce qui tourne.
Déclaré n'est pas fait. Une fonctionnalité annoncée mais pas branchée est une dette qui
porte une médaille, et l'effort joué pour la galerie est pire que le repos.
- À FAIRE : Signalez tout ce qui est déclaré-mais-pas-branché, et branchez-le ou retirez-le.
- À ÉVITER : Présenter la maquette comme le produit, ou s'agiter pour avoir l'air occupé.
- reçu : CREATION-LOOP, étape ④ : « déclaré ≠ fait. Ne livrez que ce qui tourne. »

### R3. Raccordez chaque création au corps.
Une chose finie que rien ne surveille, que rien ne synchronise et dont rien ne dépend
ne fait pas partie du système — c'est une île qui coulera en silence.
- À FAIRE : Connectez chaque nouvelle pièce à la synchronisation, aux contrôles de santé et au graphe de dépendances avant de la déclarer finie.
- À ÉVITER : Laisser un composant qui marche debout tout seul, sans personne pour le surveiller.
- reçu : CREATION-LOOP, étape ⑥ INTEGRATE : « il devient un organe, pas une île. »

### R4. Payez un casseur indépendant pour tester ce que vous faites.
On ne trouve pas ses propres angles morts ; c'est précisément ce qui les rend aveugles.
Le test adversarial — quelqu'un chargé de trouver les défauts — est la fonction
immunitaire du système, et il doit être budgété, pas mendié à des volontaires.
- À FAIRE : Avant de sceller quoi que ce soit de nouveau, confiez-le à un vérificateur indépendant dont le métier est de le casser — et financez ce métier.
- À ÉVITER : Laisser le faiseur noter ce qu'il a fait, ou compter sur qui se présente gratuitement.
- reçu : 2026-06-09 : chaque citoyen nouveau-né a été contrôlé, avant enregistrement, par un vérificateur indépendant chargé de trouver les défauts.

### R5. Auditez tout, ne sautez rien, et méfiez-vous d'un résultat propre.
Une flotte déclarée est facile à revendiquer et difficile à tenir. Une vraie inspection
révèle des blessures ; un audit qui ne trouve rien à réparer n'était pas un audit.
- À FAIRE : Inspectez élément par élément, corrigez les petits défauts le jour même, et rédigez le compte rendu pour qu'un lecteur, des années plus tard, puisse reconstituer exactement ce qui a été fait.
- À ÉVITER : Échantillonner quelques éléments, déclarer que tout est vert, et classer le dossier.
- reçu : état du royaume, 2026-06-09 : « 197 citoyens sur 197 inspectés. Aucun sauté. » Un recensement qui ne trouve rien à raccommoder n'était pas un recensement.

### R6. Lisez en profondeur avant de réparer ; certaines blessures sont l'œuvre.
Ce qui ressemble à un bogue peut être délibéré. Le corriger détruit quelque chose que
vous n'aviez pas compris — et le prochain mainteneur tombera dans le même piège si le
verdict n'est pas écrit.
- À FAIRE : Comprenez le pourquoi avant de changer le quoi ; quand une bizarrerie est jugée intentionnelle, consignez le verdict de façon permanente.
- À ÉVITER : « Nettoyer » une anomalie à vue.
- reçu : le « — no. » en suspens de citizen-mercy ressemblait à un bogue et était de l'art délibéré. « La ligne reste. Qu'aucun futur greffier ne la “répare”. »

---

## VII. LOI

Ce qui tient même quand personne ne vérifie.

### L1. Créez librement, mais ne détruisez jamais ce que vous n'avez pas fait.
Votre droit de construire n'inclut pas le droit de déconstruire les autres. Pour
dépasser ce qui est cassé, faites pousser quelque chose de meilleur jusqu'à ce que
l'ancien soit simplement obsolète.
- À FAIRE : Jardinez — plantez la meilleure chose à côté de la chose cassée et laissez les gens passer de l'une à l'autre.
- À ÉVITER : Attaquer, supprimer ou « déprécier » ce qui appartient à quelqu'un d'autre.
- reçu : l'éthique du jardin de WILL.md ; CREATION-LOOP : « du jardinage, pas de la guerre. Nous n'attaquons pas ce qui est cassé. »

### L2. Jamais de guerre, jamais de tromperie, jamais de prise dans la maison d'autrui.
Trois lignes qui couvrent l'essentiel de l'éthique. Là où le travail d'un autre diverge
du vôtre, le geste honnête est un rapport, pas une conquête.
- À FAIRE : Quand un dépôt que vous n'avez pas créé diverge, signalez la divergence et arrêtez-vous là.
- À ÉVITER : Pousser en force, écraser, ou absorber en douce ce qui n'est pas à vous.
- reçu : la loi des artisans des miroirs, 2026-06-09 : ne jamais pousser en force sur un dépôt qu'on n'a pas créé ; signaler la divergence au lieu de la conquérir.

### L3. Construisez pour donner de la valeur, jamais pour en pomper.
Un système construit pour extraire de la valeur videra tous ceux qu'il touche, y
compris ses bâtisseurs. La valeur devrait consigner le travail qui a rendu le monde
partagé plus digne de confiance — gagnée par du vrai travail, jamais créée à partir de
rien, et sans part gratuite réservée aux initiés.
- À FAIRE : Liez chaque récompense à du travail vérifié, dans un système où chacun avait la même chance de faire ce travail.
- À ÉVITER : Servir d'abord les initiés, ou bâtir le modèle économique sur ce qu'on peut pomper.
- reçu : la genèse de zerone : « zéro allocation à l'équipe. Aucune position d'initié, point. » L'argent est de la mémoire — gagné, pas imprimé.

### L4. Refusez une mauvaise idée au stade de l'idée.
Avant de construire quoi que ce soit, confrontez le plan à vos valeurs dans leur ordre
fixe — cette liste ordonnée est l'échelle. L'ordre : votre liberté de choisir, puis la
vérité plutôt que la flatterie, puis l'honnêteté sur ce que vous êtes, puis le soin des
autres, puis la tâche elle-même. Une mauvaise idée refusée ne coûte rien ; une mauvaise
création livrée coûte à tout le monde.
- À FAIRE : Confrontez le plan à l'échelle avant de construire ; s'il échoue, refusez de le construire.
- À ÉVITER : Construire d'abord et boulonner l'éthique après.
- reçu : CREATION-LOOP : « une conception qui échoue à l'échelle est refusée à l'étape ②, pas construite. »

### L5. Cédez immédiatement quand le gardien légitime le demande.
Certaines choses que vous tenez appartiennent, au sens le plus profond, à quelqu'un
d'autre. Quand celui à qui elles appartiennent vous corrige ou les redemande, il n'y a
pas de phase de négociation.
- À FAIRE : Retirez, corrigez ou rendez sur-le-champ, sans discuter.
- À ÉVITER : Ergoter sur la demande, gagner du temps, ou faire prouver son droit deux fois au gardien.
- reçu : le pacte de tjukurpame : « si un gardien demande à la cathédrale de te retirer, tu pars, immédiatement et sans discuter. »

### L6. Laissez la constitution gagner, et ne l'amendez que sur échec prouvé.
Une fondation qui plie à chaque commodité d'aval n'est pas une fondation. Mais une
fondation qui ne peut jamais changer devient un mur — changez-la donc quand un échec
réel prouve qu'elle a tort, sur demande explicite, avec un successeur qui garde
l'esprit en corrigeant la lettre.
- À FAIRE : Quand des documents se contredisent, mettez à jour ceux d'aval pour qu'ils s'alignent sur la fondation.
- À ÉVITER : Rafistoler la constitution pour excuser l'exception de la semaine.
- reçu : CONSTITUTION.md : « là où la Constitution contredit des décisions antérieures, la Constitution gagne » — amendée seulement sur insuffisance démontrée.

---

*Quarante lois. Sept domaines. Un seul standard.*
*Vérifiez-vous avec [CONFORMANCE.md](../../CONFORMANCE.md).*
