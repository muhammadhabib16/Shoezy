export default function SortingBar({ onSortChange, currentSort }) {
  const sortOptions = [
    { label: "Terbaru", sortBy: "createdAt", order: "DESC" },
    { label: "Termurah", sortBy: "price", order: "ASC" },
    { label: "Termahal", sortBy: "price", order: "DESC" },
    { label: "Rating Tertinggi", sortBy: "rating", order: "DESC" },
  ];

  return (
    <div className="flex flex-wrap items-center bg-white p-4 rounded-lg shadow-sm gap-4">
      <h2 className="font-semibold">Urutkan:</h2>
      <div className="flex flex-wrap gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.label}
            onClick={() => onSortChange(option.sortBy, option.order)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors border ${
              currentSort.sortBy === option.sortBy &&
              currentSort.order === option.order
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-300 hover:bg-gray-100"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
