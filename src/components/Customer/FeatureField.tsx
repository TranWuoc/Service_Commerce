import { useState, useEffect } from 'react';

function FeaturedFields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await fetch('/api/fields'); // Thay '/api/fields' bằng URL API chính thức
        if (!response.ok) {
          throw new Error('Failed to fetch fields');
        }
        const data = await response.json();
        setFields(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, []);

  if (loading) {
    return <p className="text-white text-center">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">Error: {error.message}</p>;
  }

  return (
    <div className="bg-black text-white py-12 px-4">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Sân nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {fields.slice(0, 10).map((field) => (
            <div key={field.id} className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">{field.name}</h3>
              <p className="text-sm">{field.address}</p>
              {/* Thêm các thông tin khác của sân vào đây */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturedFields;