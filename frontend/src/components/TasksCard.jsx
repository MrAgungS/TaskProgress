export default function TaskCard({ Tasks }) {
  return (
    <div className="bg-base-100 shadow rounded-xl p-4 space-y-2">
      <h2 className="font-semibold text-lg">{Tasks.title}</h2>

      <div className="flex justify-between text-sm">
        <span
          className={`badge ${
            Tasks.status === "done"
              ? "badge-success"
              : task.status === "progress"
              ? "badge-warning"
              : "badge-ghost"
          }`}
        >
          {Tasks.status}
        </span>

        <span className="text-xs opacity-70">
          Priority: {Tasks.priority}
        </span>
      </div>
    </div>
  );
}
