import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'GitHub Stats — Dashboard'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0d1117',
          color: '#e6edf3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'ui-monospace, Menlo, monospace',
        }}
      >
        <div
          style={{
            color: '#39d353',
            fontSize: 28,
            letterSpacing: 6,
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          // github analytics
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <div style={{ fontSize: 140, fontWeight: 800, letterSpacing: -2 }}>GitHub</div>
          <div style={{ fontSize: 140, fontWeight: 800, color: '#39d353' }}>_</div>
          <div style={{ fontSize: 140, fontWeight: 800, letterSpacing: -2 }}>Stats</div>
        </div>
        <div style={{ color: '#848d97', fontSize: 32, marginTop: 32 }}>
          Visualise n&apos;importe quel profil GitHub en quelques secondes.
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: 64,
            padding: '20px 24px',
            border: '2px solid #30363d',
            borderRadius: 8,
            width: 520,
          }}
        >
          <div style={{ color: '#39d353', fontSize: 32, marginRight: 16 }}>$</div>
          <div style={{ color: '#848d97', fontSize: 32 }}>torvalds</div>
        </div>
      </div>
    ),
    { ...size }
  )
}
