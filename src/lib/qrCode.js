import { toDataURL } from 'qrcode'

export function getEventShareUrl(baseUrl, shareCode) {
  return `${baseUrl}/event/${shareCode}`
}

export async function generateQRCodeDataURL(url) {
  try {
    return await toDataURL(url, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    })
  } catch (err) {
    console.error('QR generation error:', err)
    return ''
  }
}

export function getGiantScreenUrl(shareCode) {
  return `/event/${shareCode}/giant`
}
