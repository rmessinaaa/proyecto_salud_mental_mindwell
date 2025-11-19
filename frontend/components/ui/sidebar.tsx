import React, { useState, useCallback, useMemo, useContext } from "react";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";

// Simulamos AsyncStorage con un objeto simple para evitar la dependencia
const AsyncStorage = {
  setItem: async (key: string, value: string) => {
    // Implementación simple para desarrollo
    console.log(`Saving ${key}: ${value}`);
  },
  getItem: async (key: string) => {
    // Implementación simple para desarrollo
    return null;
  }
};

const SIDEBAR_STORAGE_KEY = "sidebar_state";
const SIDEBAR_WIDTH = 260; // 16rem aprox
const SIDEBAR_WIDTH_MOBILE = 288; // 18rem aprox
const SIDEBAR_WIDTH_ICON = 48; // 3rem aprox

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  children,
}: {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const isMobile = Dimensions.get("window").width < 768;
  const [openMobile, setOpenMobile] = useState(false);
  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;

  const setOpen = useCallback(
    async (value: boolean | ((val: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
      // Persistencia en AsyncStorage
      try {
        await AsyncStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(openState));
      } catch (e) {
        console.log("Error saving sidebar state", e);
      }
    },
    [setOpenProp, open]
  );

  const toggleSidebar = useCallback(() => {
    return isMobile ? setOpenMobile((prev) => !prev) : setOpen((prev) => !prev);
  }, [isMobile, setOpen, setOpenMobile]);

  const state: "expanded" | "collapsed" = open ? "expanded" : "collapsed";

  const contextValue = useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <View style={styles.wrapper}>{children}</View>
    </SidebarContext.Provider>
  );
}

// Componentes de Sheet simplificados para evitar dependencias
interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

interface SheetContentProps {
  side?: "left" | "right";
  children?: React.ReactNode;
}

const Sheet: React.FC<SheetProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <View style={styles.sheetOverlay}>
      <TouchableOpacity 
        style={styles.sheetBackdrop}
        onPress={() => onOpenChange?.(false)}
      />
      <View style={styles.sheetContent}>
        {children}
      </View>
    </View>
  );
};

const SheetContent: React.FC<SheetContentProps> = ({ side = "left", children }) => {
  return (
    <View style={[
      styles.sheetContentInner,
      side === "left" ? styles.sheetContentLeft : styles.sheetContentRight
    ]}>
      {children}
    </View>
  );
};

const SheetHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <View style={styles.sheetHeader}>{children}</View>
);

const SheetTitle: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Text style={styles.sheetTitle}>{children}</Text>
);

const SheetDescription: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <Text style={styles.sheetDescription}>{children}</Text>
);

// Separator simplificado
const Separator: React.FC<{ style?: any }> = ({ style }) => (
  <View style={[styles.separator, style]} />
);

// Skeleton simplificado
const Skeleton: React.FC<{ style?: any }> = ({ style }) => (
  <View style={[styles.skeleton, style]} />
);

// Icono simplificado (en lugar de lucide-react-native)
const PanelLeft: React.FC<{ size?: number; color?: string }> = ({ size = 18, color = "#333" }) => (
  <View style={[styles.icon, { width: size, height: size, backgroundColor: color }]} />
);

export function Sidebar({
  side = "left",
  collapsible = "offcanvas",
  children,
}: {
  side?: "left" | "right";
  collapsible?: "offcanvas" | "icon" | "none";
  children: React.ReactNode;
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return <View style={[styles.sidebar]}>{children}</View>;
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side={side}>
          <SheetHeader>
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <View style={styles.sidebar}>{children}</View>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <View style={styles.sidebarDesktop}>
      <View style={styles.sidebarInner}>{children}</View>
    </View>
  );
}

// SidebarTrigger
export function SidebarTrigger({ onPress }: { onPress?: () => void }) {
  const { toggleSidebar } = useSidebar();

  return (
    <TouchableOpacity
      style={[styles.button, styles.buttonIcon]}
      onPress={() => {
        onPress?.();
        toggleSidebar();
      }}
    >
      <PanelLeft size={18} color="#333" />
      <Text style={styles.srOnly}>Toggle Sidebar</Text>
    </TouchableOpacity>
  );
}

// SidebarRail
export function SidebarRail() {
  const { toggleSidebar } = useSidebar();

  return <TouchableOpacity style={styles.rail} onPress={toggleSidebar} />;
}

// SidebarInset
export function SidebarInset({ children }: { children?: React.ReactNode }) {
  return <View style={styles.inset}>{children}</View>;
}

// SidebarInput
export function SidebarInput(props: {
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
}) {
  return <TextInput style={styles.sidebarInput} {...props} />;
}

// SidebarHeader
export function SidebarHeader({ children }: { children?: React.ReactNode }) {
  return <View style={styles.sidebarHeader}>{children}</View>;
}

// SidebarFooter
export function SidebarFooter({ children }: { children?: React.ReactNode }) {
  return <View style={styles.sidebarFooter}>{children}</View>;
}

// SidebarSeparator
export function SidebarSeparator() {
  return <Separator style={styles.sidebarSeparator} />;
}

// SidebarContent
export function SidebarContent({ children }: { children?: React.ReactNode }) {
  return (
    <ScrollView contentContainerStyle={styles.sidebarContentContainer}>
      {children}
    </ScrollView>
  );
}

// SidebarGroup
export function SidebarGroup({ children }: { children?: React.ReactNode }) {
  return <View style={styles.sidebarGroup}>{children}</View>;
}

// SidebarGroupLabel
export function SidebarGroupLabel({ children }: { children?: React.ReactNode }) {
  return <View style={styles.sidebarGroupLabel}>{children}</View>;
}

// SidebarGroupAction
export function SidebarGroupAction({ onPress }: { onPress?: () => void }) {
  return <TouchableOpacity style={styles.sidebarGroupAction} onPress={onPress} />;
}

// SidebarGroupContent
export function SidebarGroupContent({ children }: { children?: React.ReactNode }) {
  return <View style={styles.sidebarGroupContent}>{children}</View>;
}

// SidebarMenu
export function SidebarMenu({ children }: { children?: React.ReactNode }) {
  return <View style={styles.sidebarMenu}>{children}</View>;
}

// SidebarMenuItem
export function SidebarMenuItem({ children }: { children?: React.ReactNode }) {
  return <View style={styles.sidebarMenuItem}>{children}</View>;
}

// SidebarMenuButton
export function SidebarMenuButton({
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  children,
  onPress,
}: {
  isActive?: boolean;
  variant?: "default" | "outline";
  size?: "sm" | "default" | "lg";
  tooltip?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}) {
  const { isMobile, state } = useSidebar();

  const button = (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.menuButton,
        variant === "outline" && styles.menuButtonOutline,
        size === "sm" && styles.menuButtonSm,
        size === "lg" && styles.menuButtonLg,
        isActive && styles.menuButtonActive,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={[
          styles.menuButtonText,
          isActive && styles.menuButtonTextActive
        ]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );

  return button;
}

// SidebarMenuAction
export function SidebarMenuAction({ onPress, children }: { onPress?: () => void; children?: React.ReactNode }) {
  return (
    <TouchableOpacity style={styles.menuAction} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}

// SidebarMenuBadge
export function SidebarMenuBadge({ children }: { children?: React.ReactNode }) {
  return (
    <View style={styles.menuBadge}>
      {typeof children === "string" ? <Text style={styles.menuBadgeText}>{children}</Text> : children}
    </View>
  );
}

// SidebarMenuSkeleton
export function SidebarMenuSkeleton({ showIcon = false }: { showIcon?: boolean }) {
  const width = useMemo(() => `${Math.floor(Math.random() * 40) + 50}%`, []);

  return (
    <View style={styles.menuSkeleton}>
      {showIcon && <Skeleton style={styles.menuSkeletonIcon} />}
      <Skeleton style={[styles.menuSkeletonText, { width }]} />
    </View>
  );
}

// SidebarMenuSub
export function SidebarMenuSub({ children }: { children?: React.ReactNode }) {
  return <View style={styles.menuSub}>{children}</View>;
}

// SidebarMenuSubItem
export function SidebarMenuSubItem({ children }: { children?: React.ReactNode }) {
  return <View style={styles.menuSubItem}>{children}</View>;
}

// SidebarMenuSubButton
export function SidebarMenuSubButton({
  size = "md",
  isActive = false,
  children,
  onPress,
}: {
  size?: "sm" | "md";
  isActive?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.menuSubButton,
        isActive && styles.menuSubButtonActive,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={[
          styles.menuSubButtonText,
          size === "sm" && styles.menuSubButtonSm,
          size === "md" && styles.menuSubButtonMd,
          isActive && styles.menuSubButtonTextActive
        ]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: "row",
    minHeight: "100%",
    width: "100%",
  },
  sidebar: {
    backgroundColor: "#f0f0f0",
    width: SIDEBAR_WIDTH,
    height: "100%",
    flexDirection: "column",
  },
  sidebarDesktop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: "#f0f0f0",
  },
  sidebarInner: {
    flex: 1,
    flexDirection: "column",
  },
  button: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonIcon: {
    width: 28,
    height: 28,
  },
  srOnly: {
    position: "absolute",
    opacity: 0,
  },
  rail: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 16,
    right: -16,
    zIndex: 20,
  },
  inset: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
  },
  sidebarInput: {
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    color: "#333",
  },
  sidebarHeader: {
    padding: 8,
    gap: 8,
    flexDirection: "column",
  },
  sidebarFooter: {
    marginTop: "auto",
    padding: 8,
    gap: 8,
    flexDirection: "column",
  },
  sidebarSeparator: {
    marginHorizontal: 8,
    backgroundColor: "#ddd",
    height: StyleSheet.hairlineWidth,
  },
  sidebarContentContainer: {
    gap: 8,
    paddingBottom: 8,
  },
  sidebarGroup: {
    padding: 8,
    flexDirection: "column",
  },
  sidebarGroupLabel: {
    height: 32,
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  sidebarGroupAction: {
    position: "absolute",
    top: 14,
    right: 12,
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarGroupContent: {
    width: "100%",
  },
  sidebarMenu: {
    flexDirection: "column",
    gap: 6,
  },
  sidebarMenuItem: {
    position: "relative",
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 6,
    padding: 8,
    backgroundColor: "transparent",
  },
  menuButtonOutline: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  menuButtonSm: {
    height: 28,
  },
  menuButtonLg: {
    height: 48,
  },
  menuButtonActive: {
    backgroundColor: "#007AFF",
  },
  menuButtonText: {
    fontSize: 14,
    color: "#333",
  },
  menuButtonTextActive: {
    color: "#fff",
  },
  menuAction: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  menuBadge: {
    position: "absolute",
    right: 4,
    top: 4,
    minWidth: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  menuBadgeText: {
    fontSize: 12,
    color: "#333",
  },
  menuSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 32,
    paddingHorizontal: 8,
  },
  menuSkeletonIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  menuSkeletonText: {
    height: 16,
    borderRadius: 4,
    flex: 1,
  },
  menuSub: {
    marginLeft: 12,
    borderLeftWidth: 1,
    borderColor: "#ddd",
    paddingLeft: 8,
    flexDirection: "column",
    gap: 4,
  },
  menuSubItem: {
    position: "relative",
  },
  menuSubButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 8,
    height: 28,
  },
  menuSubButtonActive: {
    backgroundColor: "#007AFF",
  },
  menuSubButtonText: {
    color: "#333",
  },
  menuSubButtonTextActive: {
    color: "#fff",
  },
  menuSubButtonSm: {
    fontSize: 12,
  },
  menuSubButtonMd: {
    fontSize: 14,
  },
  // Estilos para componentes de Sheet
  sheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  sheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetContentInner: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    maxWidth: '80%',
    maxHeight: '80%',
  },
  sheetContentLeft: {
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  sheetContentRight: {
    alignSelf: 'flex-end',
    marginRight: 16,
  },
  sheetHeader: {
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sheetDescription: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    backgroundColor: '#ddd',
    height: StyleSheet.hairlineWidth,
  },
  skeleton: {
    backgroundColor: '#e1e1e1',
    borderRadius: 4,
  },
  icon: {
    borderRadius: 2,
  },
});