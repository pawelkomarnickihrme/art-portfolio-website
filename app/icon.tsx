import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

// ponytail: the default ImageResponse sans, not Archivo — one lowercase s at
// 32px does not carry enough of the face to be worth fetching the font file.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          color: '#fff',
          fontSize: 26,
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        s
      </div>
    ),
    size,
  )
}
