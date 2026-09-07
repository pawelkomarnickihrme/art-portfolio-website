import { ThLargeIcon } from '@sanity/icons/ThLarge'
import { defineField, defineType } from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  title: 'Prace',
  type: 'document',
  icon: ThLargeIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Prace w galerii',
      description:
        'Kolejność na liście = kolejność na stronie. Chwyć pracę za uchwyt po lewej i przeciągnij, żeby ją przestawić.',
      type: 'array',
      of: [{ type: 'artwork' }],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Prace' }),
  },
})
