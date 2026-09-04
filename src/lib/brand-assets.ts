export const brandAssetPath = (path: string) => encodeURI(path)

export type ThemeBrandAsset = {
  light: string
  dark: string
}

export const brandLogoAssets = {
  fullBlack: {
    light: brandAssetPath("/Full (Horizontal).png"),
    dark: brandAssetPath("/Avana PNG/Avana Full (White) PNG.png"),
  },
  fullCyan: {
    light: brandAssetPath("/Full (Personal).png"),
    dark: brandAssetPath("/Avana PNG/Avana Full (Personal) PNG.png"),
  },
  icon: {
    light: brandAssetPath("/Logo.png"),
    dark: brandAssetPath("/Avana PNG/Avana Icon (White) PNG.png"),
  },
  iconBlack: {
    light: brandAssetPath("/Avana PNG/Avana Icon (Black) PNG.png"),
    dark: brandAssetPath("/Avana PNG/Avana Icon (White) PNG.png"),
  },
  iconPersonal: {
    light: brandAssetPath("/Avana PNG/Avana Icon (Personal) PNG.png"),
    dark: brandAssetPath("/Avana PNG/Avana Icon (Personal) PNG.png"),
  },
  fullPersonal: {
    light: brandAssetPath("/Avana PNG/Avana Full (Personal) PNG.png"),
    dark: brandAssetPath("/Avana PNG/Avana Full (Personal) PNG.png"),
  },
} satisfies Record<string, ThemeBrandAsset>

export const brandPreviewSurfaceClassName =
  "rounded-[20px] border border-[#0F1518]/15 bg-white dark:border-border dark:bg-[var(--surface-muted)]"

export const brandGuidelineSurfaceClassName =
  "rounded-[20px] border border-[#2F414B]/10 bg-[#F8FAFB] dark:border-border dark:bg-[var(--surface-muted)]"

export const brandTokenSurfaceClassName =
  "rounded-[20px] border border-border bg-[#eef3f5] dark:bg-[var(--surface-muted)]"
