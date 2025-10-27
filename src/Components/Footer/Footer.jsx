import React from "react";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-16 border-t border-black/5 dark:border-white/10">
      <div className="container mx-auto px-4 py-8 text-sm text-black/60 dark:text-white/60 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="font-semibold">Skillverse</div>
        <div className="">
          {" "}
          &copy; {new Date().getFullYear()} Mostafa M.Ebrahem ❤🔥{" "}
        </div>
        <div>{t("footer.rights")}</div>
      </div>
    </footer>
  );
}
