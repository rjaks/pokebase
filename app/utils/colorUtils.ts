export const getDarkColor = (hex: string): string => {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  const r = Math.floor(parseInt(hex.substring(0, 2), 16) * 0.65)
  const g = Math.floor(parseInt(hex.substring(2, 4), 16) * 0.65)
  const b = Math.floor(parseInt(hex.substring(4, 6), 16) * 0.65)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export const getLightColor = (hex: string): string => {
  hex = hex.replace('#', '')
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('')
  const r = Math.floor(parseInt(hex.substring(0, 2), 16) + (255 - parseInt(hex.substring(0, 2), 16)) * 0.4)
  const g = Math.floor(parseInt(hex.substring(2, 4), 16) + (255 - parseInt(hex.substring(2, 4), 16)) * 0.4)
  const b = Math.floor(parseInt(hex.substring(4, 6), 16) + (255 - parseInt(hex.substring(4, 6), 16)) * 0.4)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}