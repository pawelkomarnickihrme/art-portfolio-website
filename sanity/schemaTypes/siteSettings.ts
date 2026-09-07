import { CogIcon } from '@sanity/icons/Cog'
import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Tekst na stronie',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Nazwa / podpis',
      description: 'Pojawia się na górze strony i w stopce.',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'O mnie',
      description:
        'Tekst pod nazwą. Żeby zrobić nowy akapit, zostaw między zdaniami jedną pustą linijkę.',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'footerNote',
      title: 'Notka w stopce',
      type: 'string',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Tekst na stronie' }),
  },
})
