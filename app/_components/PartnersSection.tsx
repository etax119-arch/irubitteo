export default function PartnersSection() {
  return (
    <section className="py-16 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm mb-8">함께하는 기관 및 기업</p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 opacity-60 grayscale">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
              Partner Logo {i}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
