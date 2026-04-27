const { useEffect, useMemo, useState } = React;

const EMPTY_FORM = {
  name: "",
  category: "",
  description: "",
  era: "",
  origin: "",
  material: "",
  price: "",
  stock: "",
  rating: "",
  image: ""
};

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
  const [form, setForm] = useState(EMPTY_FORM);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [creating, setCreating] = useState(false);

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

  function onFormChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onCreateProduct(event) {
    event.preventDefault();
    setCreateError("");
    setCreateSuccess("");
    setCreating(true);

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      era: form.era.trim(),
      origin: form.origin.trim(),
      material: form.material.trim(),
      price: Number(form.price),
      stock: Number(form.stock)
    };

    if (form.rating.trim() !== "") {
      payload.rating = Number(form.rating);
    }
    if (form.image.trim() !== "") {
      payload.image = form.image.trim();
    }

    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || `HTTP ${res.status}`);
      }

      setProducts((prev) => [...prev, data]);
      setForm(EMPTY_FORM);
      setCreateSuccess("Товар успешно добавлен.");
    } catch (e) {
      setCreateError(`Ошибка добавления: ${e.message}`);
    } finally {
      setCreating(false);
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

        <form className="add-form" onSubmit={onCreateProduct}>
          <p className="add-form__title">Добавить товар</p>
          <div className="add-form__grid">
            <input
              name="name"
              value={form.name}
              onChange={onFormChange}
              placeholder="Название"
              required
            />
            <input
              name="category"
              value={form.category}
              onChange={onFormChange}
              placeholder="Категория"
              required
            />
            <input
              name="era"
              value={form.era}
              onChange={onFormChange}
              placeholder="Эпоха"
              required
            />
            <input
              name="origin"
              value={form.origin}
              onChange={onFormChange}
              placeholder="Регион"
              required
            />
            <input
              name="material"
              value={form.material}
              onChange={onFormChange}
              placeholder="Материал"
              required
            />
            <input
              name="image"
              value={form.image}
              onChange={onFormChange}
              placeholder="Путь к изображению (необязательно)"
            />
            <input
              name="price"
              type="number"
              min="0"
              step="1"
              value={form.price}
              onChange={onFormChange}
              placeholder="Цена"
              required
            />
            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={onFormChange}
              placeholder="Количество на складе"
              required
            />
            <input
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={onFormChange}
              placeholder="Рейтинг (0-5, необязательно)"
            />
            <textarea
              className="add-form__full"
              name="description"
              value={form.description}
              onChange={onFormChange}
              placeholder="Описание товара"
              rows="3"
              required
            />
          </div>
          <div className="add-form__actions">
            <button type="submit" disabled={creating}>
              {creating ? "Сохранение..." : "Добавить товар"}
            </button>
            {createSuccess && <span className="add-form__success">{createSuccess}</span>}
          </div>
          {createError && <p className="error">{createError}</p>}
        </form>
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
