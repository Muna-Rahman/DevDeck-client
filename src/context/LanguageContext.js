"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const translations = {
  en: {
    dashboard: "Dashboard",
    myCards: "My Cards",
    snippets: "Snippets",
    bookmarks: "Bookmarks",
    addCard: "Add Card",
    searchPlaceholder: "Search snippets & cards...",
    signOut: "Sign Out",
    signIn: "Sign In",
    settings: "Settings",
    accountSettings: "Account Settings",
    saveSettings: "Save Settings",
    saving: "Saving...",
    back: "Back",
    language: "Language",
    fontSize: "Font Size",
    profileCredentials: "Profile & Credentials",
    changeUsername: "Change Username",
    changePassword: "Change Password",
    confirmPassword: "Confirm Password",
    currentPassword: "Current Password",
    dangerZone: "Danger Zone",
    deleteAccount: "Delete Account",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    myCards: "আমার কার্ডসমূহ",
    snippets: "সনিপেটস",
    bookmarks: "বুকমার্কস",
    addCard: "কার্ড যোগ করুন",
    searchPlaceholder: "সনিপেট এবং কার্ড খুঁজুন...",
    signOut: "সাইন আউট",
    signIn: "সাইন ইন",
    settings: "সেটিংস",
    accountSettings: "অ্যাকাউন্ট সেটিংস",
    saveSettings: "সেটিংস সংরক্ষণ করুন",
    saving: "সংরক্ষণ হচ্ছে...",
    back: "ফিরে যান",
    language: "ভাষা",
    fontSize: "ফন্ট সাইজ",
    profileCredentials: "প্রোফাইল এবং ক্রেডেনশিয়াল",
    changeUsername: "ইউজারনেম পরিবর্তন করুন",
    changePassword: "পাসওয়ার্ড পরিবর্তন করুন",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    currentPassword: "বর্তমান পাসওয়ার্ড",
    dangerZone: "ডেঞ্জার জোন",
    deleteAccount: "অ্যাকাউন্ট মুছে ফেলুন",
  },
  es: {
    dashboard: "Panel",
    myCards: "Mis Tarjetas",
    snippets: "Fragmentos",
    bookmarks: "Marcadores",
    addCard: "Añadir Tarjeta",
    searchPlaceholder: "Buscar...",
    signOut: "Cerrar Sesión",
    signIn: "Iniciar Sesión",
    settings: "Ajustes",
    accountSettings: "Configuración de Cuenta",
    saveSettings: "Guardar Ajustes",
    saving: "Guardando...",
    back: "Volver",
    language: "Idioma",
    fontSize: "Tamaño de Fuente",
    profileCredentials: "Perfil y Credenciales",
    changeUsername: "Cambiar Nombre de Usuario",
    changePassword: "Cambiar Contraseña",
    confirmPassword: "Confirmar Contraseña",
    currentPassword: "Contraseña Actual",
    dangerZone: "Zona de Peligro",
    deleteAccount: "Eliminar Cuenta",
  },
  fr: {
    dashboard: "Tableau de Bord",
    myCards: "Mes Cartes",
    snippets: "Extraits",
    bookmarks: "Favoris",
    addCard: "Ajouter une Carte",
    searchPlaceholder: "Rechercher...",
    signOut: "Déconnexion",
    signIn: "Connexion",
    settings: "Paramètres",
    accountSettings: "Paramètres du Compte",
    saveSettings: "Enregistrer les Paramètres",
    saving: "Enregistrement...",
    back: "Retour",
    language: "Langue",
    fontSize: "Taille de Police",
    profileCredentials: "Profil et Identifiants",
    changeUsername: "Changer le Nom d'Utilisateur",
    changePassword: "Changer le Mot de Passe",
    confirmPassword: "Confirmer le Mot de Passe",
    currentPassword: "Mot de Passe Actuel",
    dangerZone: "Zone de Danger",
    deleteAccount: "Supprimer le Compte",
  },
  de: {
    dashboard: "Dashboard",
    myCards: "Meine Karten",
    snippets: "Code-Schnipsel",
    bookmarks: "Lesezeichen",
    addCard: "Karte Hinzufügen",
    searchPlaceholder: "Suchen...",
    signOut: "Abmelden",
    signIn: "Anmelden",
    settings: "Einstellungen",
    accountSettings: "Kontoeinstellungen",
    saveSettings: "Einstellungen Speichern",
    saving: "Speichern...",
    back: "Zurück",
    language: "Sprache",
    fontSize: "Schriftgröße",
    profileCredentials: "Profil & Anmeldedaten",
    changeUsername: "Benutzername Ändern",
    changePassword: "Passwort Ändern",
    confirmPassword: "Passwort Bestätigen",
    currentPassword: "Aktuelles Passwort",
    dangerZone: "Gefahrenzone",
    deleteAccount: "Konto Löschen",
  }
};

const LanguageContext = createContext();

const applyFontSizeToRoot = (size) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  switch (size) {
    case "small":
      root.style.fontSize = "14px";
      break;
    case "large":
      root.style.fontSize = "18px";
      break;
    case "medium":
    default:
      root.style.fontSize = "16px";
      break;
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");
  const [fontSize, setFontSizeState] = useState("medium");
  const { data: session } = authClient.useSession();

  useEffect(() => {
    async function loadBackendSettings() {
      if (session?.user) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/user/settings`, {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include"
          });
          if (res.ok) {
            const data = await res.json();
            const nextLang = data.language || localStorage.getItem("devdeck_lang") || "en";
            const nextFontSize = data.fontSize || localStorage.getItem("devdeck_fontsize") || "medium";

            setLanguageState(nextLang);
            localStorage.setItem("devdeck_lang", nextLang);

            setFontSizeState(nextFontSize);
            localStorage.setItem("devdeck_fontsize", nextFontSize);
            applyFontSizeToRoot(nextFontSize);
            return;
          }
        } catch (err) {
          console.error("Failed to load settings from server:", err);
        }
      }

      // Local fallback (not signed in, or the backend call failed)
      const savedLang = localStorage.getItem("devdeck_lang") || "en";
      const savedFontSize = localStorage.getItem("devdeck_fontsize") || "medium";
      setLanguageState(savedLang);
      setFontSizeState(savedFontSize);
      applyFontSizeToRoot(savedFontSize);
    }

    loadBackendSettings();
  }, [session]);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("devdeck_lang", lang);
  };

  const setFontSize = (size) => {
    setFontSizeState(size);
    localStorage.setItem("devdeck_fontsize", size);
    applyFontSizeToRoot(size);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, fontSize, setFontSize, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}