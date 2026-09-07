import { ImageIcon } from '@sanity/icons/Image'
import { defineField, defineType } from 'sanity'

/**
 * One painting in the gallery. Lives as an object inside the `gallery`
 * document so the whole list can be reordered by dragging.
 */
export const artwork = defineType({
  name: 'artwork',
  title: 'Praca',
  type: 'object',
  icon: ImageIcon,
  fieldsets: [
    {
      name: 'layout',
      title: 'Rozmieszczenie na stronie (opcjonalne)',
      description:
        'Te ustawienia tworzą nierówny rytm galerii. Można je zupełnie pominąć — praca po prostu stanie w standardowym odstępie.',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'image',
      title: 'Zdjęcie pracy',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Dodaj zdjęcie pracy.'),
    }),
    defineField({
      name: 'title',
      title: 'Tytuł',
      type: 'string',
      validation: (rule) => rule.required().error('Wpisz tytuł pracy.'),
    }),
    defineField({
      name: 'widthCm',
      title: 'Szerokość (cm)',
      description: 'Prawdziwa szerokość obrazu. Decyduje o tym, jak duży będzie na stronie.',
      type: 'number',
      validation: (rule) => rule.required().positive().error('Podaj szerokość w centymetrach.'),
    }),
    defineField({
      name: 'heightCm',
      title: 'Wysokość (cm)',
      description: 'Prawdziwa wysokość obrazu.',
      type: 'number',
      validation: (rule) => rule.required().positive().error('Podaj wysokość w centymetrach.'),
    }),
    defineField({
      name: 'alt',
      title: 'Opis zdjęcia',
      description:
        'Krótki opis tego, co widać — czytają go osoby niewidome i wyszukiwarki. Np. „Abstrakcyjny obraz z nachodzącymi na siebie kanciastymi kształtami”.',
      type: 'string',
      validation: (rule) => rule.required().warning('Bez opisu praca jest niedostępna dla czytników ekranu.'),
    }),
    defineField({
      name: 'marginTop',
      title: 'Odstęp od góry (px)',
      type: 'number',
      fieldset: 'layout',
      initialValue: 0,
    }),
    defineField({
      name: 'marginBottom',
      title: 'Odstęp od dołu (px)',
      description: 'Puste zostawione = 64 px.',
      type: 'number',
      fieldset: 'layout',
    }),
    defineField({
      name: 'offsetX',
      title: 'Przesunięcie w bok (px)',
      description: 'Wartość dodatnia przesuwa w prawo, ujemna w lewo.',
      type: 'number',
      fieldset: 'layout',
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image', w: 'widthCm', h: 'heightCm' },
    prepare: ({ title, media, w, h }) => ({
      title: title || 'Bez tytułu',
      subtitle: w && h ? `${w} × ${h} cm` : 'Brak wymiarów',
      media,
    }),
  },
})
