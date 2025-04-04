

interface FieldCardProps {
  name: string;
  type: string;
  area: number;
  status: string;
  usage: number;
  imageUrl: string;
}

export function FieldCard({
  name,
  type,
  area,
  status,
  usage,
  imageUrl,
}: FieldCardProps) {
  return (
    <article className="p-4 bg-white rounded-xl shadow-lg">
      <div className="overflow-hidden mb-4 rounded-xl">
        <img
          src={imageUrl}
          alt={`Field ${name}`}
          className="w-full h-40 object-cover"
        />
      </div>
      <h3 className="text-lg font-medium leading-7">{name}</h3>
      <div className="flex mb-2">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <i key={index} className="ti ti-star-filled text-amber-500" />
          ))}
      </div>
      <div className="flex gap-2 items-center mb-2 text-sm leading-5 text-gray-500">
        <i className="ti ti-garden" />
        <span>{type}</span>
      </div>
      <div className="flex gap-2 items-center mb-4 text-sm leading-5 text-gray-500">
        <span>{area} Hectares</span>
        <span>|</span>
        <span>{status}</span>
        <span>|</span>
        <span>{usage}% Used</span>
      </div>
      <button className="py-2 w-full font-medium text-white bg-amber-500 rounded-lg">
        View Details
      </button>
    </article>
  );
}
