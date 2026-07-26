import type { CustomerTheme } from "../types/theme";

type Props = {
    theme: CustomerTheme;
    onChange: (
        updates: Partial<CustomerTheme>,
    ) => void;
};

export default function BrandingSection({
    theme,
    onChange,
}: Props) {
    return (
        <section className="rounded-2xl border bg-card p-6 shadow-sm">

            <div className="mb-6">
                <h2 className="text-xl font-semibold">
                    Branding
                </h2>

                <p className="text-sm text-muted-foreground">
                    Customize your restaurant branding.
                </p>
            </div>

            <div className="space-y-5">

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Logo URL
                    </label>

                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={theme.logoUrl ?? ""}
                        onChange={(e) =>
                            onChange({
                                logoUrl:
                                    e.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Favicon URL
                    </label>

                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={
                            theme.faviconUrl ??
                            ""
                        }
                        onChange={(e) =>
                            onChange({
                                faviconUrl:
                                    e.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Hero Image URL
                    </label>

                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        value={
                            theme.heroImageUrl ??
                            ""
                        }
                        onChange={(e) =>
                            onChange({
                                heroImageUrl:
                                    e.target.value,
                            })
                        }
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium">
                        Welcome Message
                    </label>

                    <textarea
                        rows={4}
                        className="w-full rounded-lg border px-3 py-2"
                        value={
                            theme.welcomeMessage ??
                            ""
                        }
                        onChange={(e) =>
                            onChange({
                                welcomeMessage:
                                    e.target.value,
                            })
                        }
                    />
                </div>

            </div>

        </section>
    );
}