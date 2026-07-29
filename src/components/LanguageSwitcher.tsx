import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { supportedLanguages } from "@/i18n";

const LanguageSwitcher = ({ compact = false }: { compact?: boolean }) => {
  const { i18n, t } = useTranslation();

  const change = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("healthride_lang", code);
  };

  return (
    <div className="flex items-center gap-1.5">
      <Globe className="w-4 h-4 text-muted-foreground" aria-hidden />
      <label className="sr-only">{t("lang.label")}</label>
      <select
        value={i18n.language}
        onChange={(e) => change(e.target.value)}
        aria-label={t("lang.label")}
        className={`bg-transparent text-sm text-foreground border border-border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring ${compact ? "" : ""}`}
      >
        {supportedLanguages.map((l) => (
          <option key={l.code} value={l.code} className="bg-background text-foreground">
            {l.native}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;