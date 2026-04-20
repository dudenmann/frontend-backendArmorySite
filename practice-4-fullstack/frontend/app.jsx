const { useEffect, useMemo, useState } = React;

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(value);
}

function ProductImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="card__image-placeholder">
        <span>Изображение не найдено</span>
        <small>Проверь путь к файлу: {src || "/assets/products/example.jpg"}</small>
      </div>
    );
  }
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/products");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      setError(`Не удалось загрузить товары: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const set = new Set(products.map((item) => item.category));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((item) => {
      const text = `${item.name} ${item.category} ${item.description} ${item.era} ${item.origin} ${item.material}`
        .toLowerCase();
      const byQuery = !q || text.includes(q);
      const byCategory = category === "all" || item.category === category;
      return byQuery && byCategory;
    });
  }, [products, query, category]);

  return (
    <main className="page">
      <header className="hero">
        <p className="eyebrow">Единый средневековый каталог</p>
        <h1>Историческая оружейная «Железная Крепость»</h1>
        <p>
          Один набор данных для всех практических работ. В каждой карточке указаны эпоха, регион и материалы.
        </p>
        <div className="hero__meta">
          <span>Всего товаров в каталоге: {products.length}</span>
          <button onClick={loadProducts}>Обновить данные</button>
        </div>
        <div className="controls">
          <input
            className="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию, эпохе, региону, материалу"
          />
          <select
            className="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "Все категории" : item}
              </option>
            ))}
          </select>
        </div>
      </header>

      {loading && <p className="info">Загрузка каталога...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <section className="grid">
          {filteredProducts.map((product) => (
            <article className="card" key={product.id}>
              <ProductImage src={product.image} alt={product.name} />
              <div className="card__body">
                <div className="row">
                  <h2>{product.name}</h2>
                  <span className="badge">{product.category}</span>
                </div>
                <p>{product.description}</p>
                <ul className="meta">
                  <li>
                    <strong>Эпоха:</strong> {product.era}
                  </li>
                  <li>
                    <strong>Регион:</strong> {product.origin}
                  </li>
                  <li>
                    <strong>Материал:</strong> {product.material}
                  </li>
                </ul>
                <div className="row row--bottom">
                  <strong>{formatPrice(product.price)}</strong>
                  <span>На складе: {product.stock}</span>
                </div>
                {product.rating !== null && product.rating !== undefined && (
                  <small>Рейтинг: {product.rating}/5</small>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
