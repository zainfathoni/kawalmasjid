import { ButtonIconAnchor, ThemeToggleDropdownMenu } from "~/components";
import { configMeta, configSite } from "~/configs";
import { Github, Twitter } from "~/icons";
import { cn, getCurrentYear } from "~/utils";

interface Props {
  noThemeToggle?: boolean;
}

export function SiteFooter({ noThemeToggle }: Props) {
  return (
    <footer
      className={cn(
        "bg-surface-50 dark:bg-surface-900", // background
        "border-t-2 border-surface-100 dark:border-surface-700", // border
        "mt-60 py-4 sm:py-8"
      )}
    >
      <section className="contain flex flex-wrap items-center justify-center gap-4 sm:justify-between">
        <div className="space-y-4">
          <div className="opacity-80">
            <span>Hak Cipta &copy; </span>
            <span>{getCurrentYear()} </span>
            <span>{configMeta?.author.name}</span>
          </div>
        </div>

        <div className="flex w-full justify-center gap-1 sm:w-min sm:gap-2 sm:justify-end">
          <ButtonIconAnchor
            href={configSite?.links.github}
            variant="ghost"
            accent="dim"
          >
            <Github className="fill-current" />
            <span className="sr-only">GitHub</span>
          </ButtonIconAnchor>

          <ButtonIconAnchor
            href={configSite?.links.twitter}
            variant="ghost"
            accent="dim"
          >
            <Twitter className="fill-current" />
            <span className="sr-only">Twitter</span>
          </ButtonIconAnchor>

          {!noThemeToggle && <ThemeToggleDropdownMenu align="end" />}
        </div>
      </section>
    </footer>
  );
}
