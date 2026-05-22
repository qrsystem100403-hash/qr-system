type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`${
        align === "center" ? "mx-auto text-center" : ""
      } max-w-3xl`}
    >
      {eyebrow && (
        <div
          className={`mb-5 flex items-center gap-4 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-12 bg-[var(--color-gold)]" />
          <p className="text-xs font-bold uppercase tracking-[0.42em] text-[var(--color-gold)]">
            {eyebrow}
          </p>
          {align === "center" && (
            <span className="h-px w-12 bg-[var(--color-gold)]" />
          )}
        </div>
      )}

      <h2 className="font-heading text-4xl font-semibold leading-[0.95] text-[var(--color-text)] md:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)] md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}