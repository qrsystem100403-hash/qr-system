type Props = {
  saving: boolean;
  onSave: () => void;
};

export default function SaveBar({
  saving,
  onSave,
}: Props) {
  return (
    <div className="sticky bottom-6 flex justify-end rounded-xl border bg-background p-4">
      <button
        onClick={onSave}
        disabled={saving}
        className="rounded-lg bg-primary px-4 py-2 text-white"
      >
        {saving
          ? "Saving..."
          : "Save Changes"}
      </button>
    </div>
  );
}