(function () {
  try {
    var key = "avana-theme"
    var stored = localStorage.getItem(key)
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    var isDark = stored === "dark" || (stored !== "light" && prefersDark)
    document.documentElement.classList.toggle("dark", isDark)
  } catch {}
})()
