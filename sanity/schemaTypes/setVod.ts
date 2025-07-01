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
      tournamentName: 'tournamentName'
    },
    prepare({playerName, opponentName, setName, tournamentName}) {
      return {
        title: `${playerName} vs ${opponentName}`,
        subtitle: `${setName} - ${tournamentName}`
      }
    }
  },
  orderings: [
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