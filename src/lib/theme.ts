export const THEME_STORAGE_KEY = "avana-theme"

/** Blocking head script: apply stored/system theme before first paint. */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var d=window.matchMedia("(prefers-color-scheme: dark)").matches;var dark=s==="dark"||(s!=="light"&&d);var r=document.documentElement;r.classList.toggle("dark",dark);}catch(e){}})();`
