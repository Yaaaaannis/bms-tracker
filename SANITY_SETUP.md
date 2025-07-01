# Configuration Sanity pour les VODs

## Installation et configuration

### 1. Variables d'environnement

Ajoutez ces variables à votre fichier `.env.local` :

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

### 2. Workflow d'utilisation

1. **Dans votre interface actuelle** :
   - Allez dans les détails d'un set (bouton "Voir sets")
   - Copiez les informations affichées :
     - Nom du joueur (ex: "Leffen")
     - Nom de l'adversaire (ex: "Armada")
     - Nom du tournoi (ex: "EVO 2023")
     - Round (ex: "Winners Semi-Final")

2. **Dans Sanity Studio** :
   - Créez un nouveau document "VOD de Set"
   - Collez les informations copiées dans les champs correspondants
   - Ajoutez l'URL YouTube de la VOD
   - Optionnel : ajoutez un timestamp (ex: "1h23m45s")

3. **Résultat** :
   - Un bouton "VOD" rouge apparaîtra automatiquement à côté du set
   - Le bouton ouvre la VOD (YouTube, Twitch, etc.) au bon timestamp

### 3. Structure du schema Sanity

Créez un fichier `schemas/setVod.js` dans votre projet Sanity :

\`\`\`javascript
export default {
name: 'setVod',
title: 'VOD de Set',
type: 'document',
fields: [
{
name: 'setName',
title: 'Nom du Set',
type: 'string',
description: 'Ex: "Winners Semi-Final"',
validation: Rule => Rule.required()
},
{
name: 'playerName',
title: 'Nom du Joueur',
type: 'string',
description: 'Ex: "Leffen"',
validation: Rule => Rule.required()
},
{
name: 'opponentName',
title: 'Adversaire',
type: 'string',
description: 'Ex: "Armada"',
validation: Rule => Rule.required()
},
{
name: 'tournamentName',
title: 'Tournoi',
type: 'string',
description: 'Nom exact du tournoi',
validation: Rule => Rule.required()
},
{
name: 'vodUrl',
title: 'URL de la VOD',
type: 'url',
description: 'YouTube, Twitch, ou autre plateforme',
validation: Rule => Rule.required()
},
{
name: 'timestamp',
title: 'Timestamp (optionnel)',
type: 'string',
description: 'Ex: "1h23m45s" (YouTube/Twitch) ou "5040" (secondes)'
}
]
}
\`\`\`

### 4. Plateformes et formats supportés

**Plateformes** :

- ✅ **YouTube** : youtube.com, youtu.be
- ✅ **Twitch** : twitch.tv (VODs et clips)
- ✅ **Autres** : N'importe quelle URL (timestamps au format YouTube)

**Formats de timestamp** :

- **Format texte** : "1h23m45s", "5m30s", "45s" (YouTube et Twitch)
- **Format horloge** : "1:23:45", "5:30" (converti automatiquement)
- **Secondes** : "5040" (nombre de secondes)

### 5. Avantages de cette approche

- ✅ **Simple** : Copier-coller depuis l'interface existante
- ✅ **Flexible** : Matching automatique même avec des variations de noms
- ✅ **Intégré** : Bouton VOD apparaît automatiquement dans l'interface
- ✅ **Timestamps** : Support des timestamps YouTube pour démarrer au bon moment
- ✅ **Pas de modification** : Le code existant continue de fonctionner normalement
