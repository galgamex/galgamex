import Cookies from 'js-cookie';
import { create } from 'zustand';

interface LocaleState {
  showLanguageAlert: boolean
  setShowLanguageAlert: (show: boolean) => void
  dismissLanguageAlert: () => void
  getLangAlertDismissed: () => boolean
}

export const useLocaleStore = create<LocaleState>((set) => ({
  showLanguageAlert: false,
  setShowLanguageAlert: (show) => set({ showLanguageAlert: show }),
  dismissLanguageAlert: () => {
    // cookie expires 30 days
    Cookies.set("langAlertDismissed", "true", { expires: 30 });
    set({ showLanguageAlert: false });
  },
  getLangAlertDismissed: () => {
    return Cookies.get("langAlertDismissed") === "true";
  },
}))