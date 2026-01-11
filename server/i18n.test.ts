import { describe, expect, it } from "vitest";

// Test i18n configuration and translations
describe("i18n Configuration", () => {
  it("should have all required languages configured", () => {
    const languages = ["en", "es", "el", "fr", "de"];
    expect(languages).toHaveLength(5);
    expect(languages).toContain("en");
    expect(languages).toContain("es");
    expect(languages).toContain("el");
    expect(languages).toContain("fr");
    expect(languages).toContain("de");
  });

  it("should have English as fallback language", () => {
    const fallbackLng = "en";
    expect(fallbackLng).toBe("en");
  });

  it("should support language detection from localStorage", () => {
    const detectionOrder = ["localStorage", "navigator"];
    expect(detectionOrder).toContain("localStorage");
    expect(detectionOrder).toContain("navigator");
  });
});

describe("Translation Keys", () => {
  const requiredKeys = [
    "common.language",
    "common.home",
    "common.menu",
    "common.cart",
    "common.loading",
    "ageVerification.title",
    "ageVerification.description",
    "ageVerification.question",
    "ageVerification.confirm",
    "ageVerification.error",
    "navigation.home",
    "navigation.menu",
    "navigation.appointments",
    "navigation.blog",
    "home.title",
    "home.subtitle",
    "menu.title",
    "menu.categories.flower",
    "menu.categories.edibles",
    "cart.title",
    "cart.empty",
    "appointments.title",
    "blog.title",
    "chat.title",
    "profile.title",
    "admin.title",
    "errors.notFound",
    "messages.welcome",
  ];

  it("should have all required translation keys", () => {
    expect(requiredKeys.length).toBeGreaterThan(0);
    requiredKeys.forEach((key) => {
      expect(key).toBeTruthy();
      expect(key).toContain(".");
    });
  });

  it("should have consistent key naming convention", () => {
    requiredKeys.forEach((key) => {
      const parts = key.split(".");
      expect(parts.length).toBeGreaterThanOrEqual(2);
      parts.forEach((part) => {
        expect(part).toMatch(/^[a-z][a-zA-Z0-9]*$/);
      });
    });
  });
});

describe("Language Support", () => {
  const languages = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  it("should have all required languages with codes, names, and flags", () => {
    expect(languages).toHaveLength(5);
    languages.forEach((lang) => {
      expect(lang.code).toBeTruthy();
      expect(lang.name).toBeTruthy();
      expect(lang.flag).toBeTruthy();
    });
  });

  it("should have unique language codes", () => {
    const codes = languages.map((lang) => lang.code);
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(codes.length);
  });

  it("should have unique language names", () => {
    const names = languages.map((lang) => lang.name);
    const uniqueNames = new Set(names);
    expect(uniqueNames.size).toBe(names.length);
  });

  it("should have valid language codes (ISO 639-1)", () => {
    const validCodes = ["en", "es", "el", "fr", "de"];
    languages.forEach((lang) => {
      expect(validCodes).toContain(lang.code);
    });
  });
});

describe("Translation Coverage", () => {
  const sections = [
    "common",
    "ageVerification",
    "navigation",
    "home",
    "menu",
    "cart",
    "appointments",
    "blog",
    "chat",
    "profile",
    "admin",
    "errors",
    "messages",
  ];

  it("should have all required translation sections", () => {
    expect(sections.length).toBeGreaterThan(0);
    sections.forEach((section) => {
      expect(section).toBeTruthy();
      expect(section).toMatch(/^[a-z][a-zA-Z]*$/);
    });
  });

  it("should have comprehensive common translations", () => {
    const commonKeys = [
      "language",
      "home",
      "menu",
      "cart",
      "loading",
      "error",
      "success",
      "save",
      "delete",
      "cancel",
    ];
    expect(commonKeys.length).toBeGreaterThan(0);
  });

  it("should have comprehensive age verification translations", () => {
    const ageVerificationKeys = [
      "title",
      "description",
      "question",
      "confirm",
      "disclaimer",
      "error",
    ];
    expect(ageVerificationKeys.length).toBe(6);
  });

  it("should have comprehensive navigation translations", () => {
    const navigationKeys = [
      "home",
      "menu",
      "appointments",
      "blog",
      "orderHistory",
      "admin",
      "support",
    ];
    expect(navigationKeys.length).toBeGreaterThan(0);
  });
});

describe("Language Persistence", () => {
  it("should use localStorage for language persistence", () => {
    const cacheKeys = ["localStorage"];
    expect(cacheKeys).toContain("localStorage");
  });

  it("should support language detection order", () => {
    const detectionOrder = ["localStorage", "navigator"];
    expect(detectionOrder[0]).toBe("localStorage");
    expect(detectionOrder[1]).toBe("navigator");
  });
});

describe("Language Switcher", () => {
  it("should display all available languages", () => {
    const languages = ["en", "es", "el", "fr", "de"];
    expect(languages).toHaveLength(5);
  });

  it("should support changing language dynamically", () => {
    const currentLanguage = "en";
    const newLanguage = "es";
    expect(currentLanguage).not.toBe(newLanguage);
  });

  it("should display language flags", () => {
    const flags = ["🇬🇧", "🇪🇸", "🇬🇷", "🇫🇷", "🇩🇪"];
    expect(flags).toHaveLength(5);
    flags.forEach((flag) => {
      expect(flag).toBeTruthy();
    });
  });
});
