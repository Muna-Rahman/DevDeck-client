"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";

const translations = {
  en: {
    // Navigation / General UI
    dashboard: "Dashboard",
    myCards: "My Cards",
    snippets: "Snippets",
    cards: "Cards",
    bookmarks: "Bookmarks",
    addCard: "Add Card",
    searchPlaceholder: "Search snippets & cards...",
    signOut: "Sign Out",
    signIn: "Sign In",
    settings: "Settings",
    profile: "Profile",
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
    welcome: "Welcome",
    // Settings
    languageSettings: "Language Settings",
    selectLanguage: "Select Language",
    english: "English",
    spanish: "Spanish",
    french: "French",
    german: "German",
    bengali: "Bengali",
    // Auth / Form Labels
    usernameLabel: "username", // Kept in English per rule
    passwordLabel: "password", // Kept in English per rule
    submit: "Submit",
    cancel: "Cancel",
    save: "Save Changes",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    myCards: "আমার কার্ডসমূহ",
    snippets: "সনিপেটস",
    cards: "কার্ডসমূহ",
    bookmarks: "বুকমার্কস",
    addCard: "কার্ড যোগ করুন",
    searchPlaceholder: "সনিপেট এবং কার্ড খুঁজুন...",
    signOut: "সাইন আউট",
    signIn: "সাইন ইন",
    settings: "সেটিংস",
    profile: "প্রোফাইল",
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
    welcome: "স্বাগতম",
    languageSettings: "ভাষা সেটিংস",
    selectLanguage: "ভাষা নির্বাচন করুন",
    english: "ইংরেজি",
    spanish: "স্প্যানিশ",
    french: "ফরাসি",
    german: "জার্মান",
    bengali: "বাংলা",
    usernameLabel: "username",
    passwordLabel: "password",
    submit: "জমা দিন",
    cancel: "বাতিল করুন",
    save: "পরিবর্তন সংরক্ষণ করুন",
  },
  es: {
    dashboard: "Panel",
    myCards: "Mis Tarjetas",
    snippets: "Fragmentos",
    cards: "Tarjetas",
    bookmarks: "Marcadores",
    addCard: "Añadir Tarjeta",
    searchPlaceholder: "Buscar...",
    signOut: "Cerrar Sesión",
    signIn: "Iniciar Sesión",
    settings: "Ajustes",
    profile: "Perfil",
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
    welcome: "Bienvenido",
    languageSettings: "Configuración de idioma",
    selectLanguage: "Seleccionar idioma",
    english: "Inglés",
    spanish: "Español",
    french: "Francés",
    german: "Alemán",
    bengali: "Bengalí",
    usernameLabel: "username",
    passwordLabel: "password",
    submit: "Enviar",
    cancel: "Cancelar",
    save: "Guardar cambios",
  },
  fr: {
    dashboard: "Tableau de Bord",
    myCards: "Mes Cartes",
    snippets: "Extraits",
    cards: "Cartes",
    bookmarks: "Favoris",
    addCard: "Ajouter une Carte",
    searchPlaceholder: "Rechercher...",
    signOut: "Déconnexion",
    signIn: "Connexion",
    settings: "Paramètres",
    profile: "Profil",
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
    welcome: "Bienvenue",
    languageSettings: "Paramètres de langue",
    selectLanguage: "Choisir la langue",
    english: "Anglais",
    spanish: "Espagnol",
    french: "Français",
    german: "Allemand",
    bengali: "Bengali",
    usernameLabel: "username",
    passwordLabel: "password",
    submit: "Soumettre",
    cancel: "Annuler",
    save: "Enregistrer les modifications",
  },
  de: {
    dashboard: "Dashboard",
    myCards: "Meine Karten",
    snippets: "Code-Schnipsel",
    cards: "Karten",
    bookmarks: "Lesezeichen",
    addCard: "Karte Hinzufügen",
    searchPlaceholder: "Suchen...",
    signOut: "Abmelden",
    signIn: "Anmelden",
    settings: "Einstellungen",
    profile: "Profil",
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
    welcome: "Willkommen",
    languageSettings: "Spracheinstellungen",
    selectLanguage: "Sprache auswählen",
    english: "Englisch",
    spanish: "Spanisch",
    french: "Französisch",
    german: "Deutsch",
    bengali: "Bengali",
    usernameLabel: "username",
    passwordLabel: "password",
    submit: "Absenden",
    cancel: "Abbrechen",
    save: "Änderungen speichern",
  },
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
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/user/settings`,
            {
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
          if (res.ok) {
            const data = await res.json();
            const nextLang =
              data.language || localStorage.getItem("devdeck_lang") || "en";
            const nextFontSize =
              data.fontSize || localStorage.getItem("devdeck_fontsize") || "medium";

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

      // Local fallback
      const savedLang = localStorage.getItem("devdeck_lang") || "en";
      const savedFontSize =
        localStorage.getItem("devdeck_fontsize") || "medium";
      setLanguageState(savedLang);
      setFontSizeState(savedFontSize);
      applyFontSizeToRoot(savedFontSize);
    }

    loadBackendSettings();
  }, [session]);

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem("devdeck_lang", lang);
    }
  };

  const changeLanguage = (lang) => setLanguage(lang);

  const setFontSize = (size) => {
    setFontSizeState(size);
    localStorage.setItem("devdeck_fontsize", size);
    applyFontSizeToRoot(size);
  };

  /**
   * Translates UI texts based on key or fallback.
   * Keeps technical values (username, password, repo, api, link, code) in English.
   */
  const t = (key, fallback = "") => {
    if (
      key === "username" ||
      key === "password" ||
      key === "repo" ||
      key === "api" ||
      key === "link" ||
      key === "code"
    ) {
      return key;
    }

    return (
      translations[language]?.[key] ||
      translations["en"]?.[key] ||
      fallback ||
      key
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        changeLanguage,
        fontSize,
        setFontSize,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}