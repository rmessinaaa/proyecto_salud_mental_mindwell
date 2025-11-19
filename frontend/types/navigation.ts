export type ViewType =
  | "home"
  | "login"
  | "register"
  | "dashboard"
  | "diary"
  | "charts"
  | "game"
  | "missions"
  | "achievements"
  | "calendar"
  | "profile"
  | "settings"
  | "onboarding"
  | "library"     // <-- agregado
  | "community"   // <-- agregado
  | "wellness";   // <-- agregado

export interface NavigationProps {
  onNavigate: (view: ViewType) => void;
}
