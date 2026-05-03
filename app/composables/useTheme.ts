export const useTheme = () => {
  const isDark = ref(false)

  const toggleDark = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  const initTheme = () => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = stored === 'dark' || (!stored && prefersDark)
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return { isDark, toggleDark, initTheme }
}