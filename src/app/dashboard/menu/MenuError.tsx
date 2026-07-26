import { AlertTriangle } from "lucide-react";

type Props = {
  title: string;
  message: string;
};

export default function MenuError({
  title,
  message,
}: Props) {
  return (
    <main
      className="
        flex
        min-h-[420px]
        items-center
        justify-center
        p-6
      "
    >
      <div
        className="
          w-full
          max-w-xl
          rounded-3xl
          border
          border-red-200
          bg-red-50
          p-8
          dark:border-red-900/40
          dark:bg-red-950/20
        "
      >
        <div className="flex items-start gap-4">
          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-2xl
              bg-red-100
              dark:bg-red-900/30
            "
          >
            <AlertTriangle
              className="
                size-6
                text-red-600
                dark:text-red-400
              "
            />
          </div>

          <div className="flex-1">
            <h2
              className="
                text-lg
                font-bold
                text-red-700
                dark:text-red-300
              "
            >
              {title}
            </h2>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-red-600
                dark:text-red-400
              "
            >
              {message}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}