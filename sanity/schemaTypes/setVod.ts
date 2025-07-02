import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'setVod',
  title: 'VOD de Set',
  type: 'document',
  fields: [
    defineField({
      name: 'setName',
      title: 'Nom du Set',
      type: 'string',
      description: 'Ex: "Winners Semi-Final" ou "Losers Round 3"',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'playerName',
      title: 'Nom du Joueur',
      type: 'string',
      description: 'Ex: "Leffen" ou "TSM | Leffen"',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'opponentName',
      title: 'Nom de l\'Adversaire',
      type: 'string',
      description: 'Ex: "Armada" ou "Alliance | Armada"',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'tournamentName',
      title: 'Nom du Tournoi',
      type: 'string',
      description: 'Ex: "EVO 2023" ou "Genesis 9"',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'vodUrl',
      title: 'URL de la VOD',
      type: 'url',
      description: 'Lien YouTube, Twitch, ou autre plateforme',
      validation: Rule => Rule.required().uri({
        scheme: ['http', 'https']
      })
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp (optionnel)',
      type: 'string',
      description: 'YouTube: "1h23m45s" | Twitch: "1h23m45s" | Secondes: "5040"'
    }),
    defineField({
      name: 'startggSetId',
      title: 'ID Start.gg (optionnel)',
      type: 'string',
      description: 'ID du set sur start.gg pour matching automatique'
    }),
    defineField({
      name: 'validationStatus',
      title: 'Statut de Validation',
      type: 'string',
      description: 'Statut de validation de la VOD proposée',
      options: {
        list: [
          { title: 'En cours de validation', value: 'en_cours_validation' },
          { title: 'Validé', value: 'valide' },
          { title: 'Rejeté', value: 'rejete' }
        ],
        layout: 'radio'
      },
      initialValue: 'en_cours_validation',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'submitterTwitter',
      title: 'Twitter du contributeur',
      type: 'string',
      description: 'Nom d\'utilisateur Twitter (@username) de la personne qui a proposé cette VOD',
      placeholder: '@username ou username',
      validation: Rule => Rule.custom(value => {
        if (!value) return true; // Optionnel
        
        // Valider que c'est bien un nom d'utilisateur Twitter (pas une URL)
        const twitterUsernameRegex = /^@?[A-Za-z0-9_]{1,15}$/;
        
        if (!twitterUsernameRegex.test(value)) {
          return 'Veuillez entrer un nom d\'utilisateur Twitter valide (@username ou username). Maximum 15 caractères, lettres, chiffres et _ seulement.';
        }
        
        return true;
      })
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
      description: 'Notes sur le set, highlights, etc.'
    })
  ],
  preview: {
    select: {
      playerName: 'playerName',
      opponentName: 'opponentName',
      setName: 'setName',
      tournamentName: 'tournamentName',
      validationStatus: 'validationStatus'
    },
    prepare({playerName, opponentName, setName, tournamentName, validationStatus}) {
      const statusEmoji = validationStatus === 'valide' ? '✅' : 
                         validationStatus === 'rejete' ? '❌' : '⏳';
      return {
        title: `${statusEmoji} ${playerName} vs ${opponentName}`,
        subtitle: `${setName} - ${tournamentName}`
      }
    }
  },
  orderings: [
    {
      title: 'Par statut de validation',
      name: 'validationStatusDesc',
      by: [
        {field: 'validationStatus', direction: 'asc'},
        {field: '_createdAt', direction: 'desc'}
      ]
    },
    {
      title: 'Par tournoi',
      name: 'tournamentDesc',
      by: [
        {field: 'tournamentName', direction: 'desc'}
      ]
    },
    {
      title: 'Par joueur',
      name: 'playerAsc',
      by: [
        {field: 'playerName', direction: 'asc'}
      ]
    }
  ]
}) 