import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// ponytail: the default ImageResponse sans, not Archivo — one lowercase s at
// 32px does not carry enough of the face to be worth fetching the font file.
export default function AppleIcon() {
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
          fontSize: 132,
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
