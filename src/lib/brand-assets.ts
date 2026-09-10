export const brandAssetPath = (path: string) => encodeURI(path)

export type ThemeBrandAsset = {
  light: string
}

export const brandLogoAssets = {
  fullBlack: {
    light: brandAssetPath("/Full (Horizontal).png"),
  },
  fullCyan: {
    light: brandAssetPath("/Full (Personal).png"),
  },
  icon: {
    light: brandAssetPath("/Logo.png"),
  },
  iconBlack: {
    light: brandAssetPath("/Avana PNG/Avana Icon (Black) PNG.png"),
  },
  iconPersonal: {
    light: brandAssetPath("/Avana PNG/Avana Icon (Personal) PNG.png"),
  },
  fullPersonal: {
    light: brandAssetPath("/Avana PNG/Avana Full (Personal) PNG.png"),
  },
} satisfies Record<string, ThemeBrandAsset>

export const brandPreviewSurfaceClassName =
  "rounded-[20px] border border-[#0F1518]/15 bg-white"

export const brandGuidelineSurfaceClassName =
  "rounded-[20px] border border-[#2F414B]/10 bg-[#F8FAFB]"

export const brandTokenSurfaceClassName =
  "rounded-[20px] border border-border bg-[#eef3f5]"
