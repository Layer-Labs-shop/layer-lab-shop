import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { products, allMaterials, type Material, type Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Seo } from "@/components/Seo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TypeFilter = "all" | "mystery" | "print" | "custom" | "scooter";

const PRICE_MIN = 0;
const PRICE_MAX = Math.ceil(Math.max(...products.map((p) => p.price)));

export default function ShopPage() {
  const mysteryBoxes = useMemo(() => products.filter((p) => p.kind === "mystery"), []);
  const prints = useMemo(
    () => products.filter((p) => p.kind === "print" && !p.customizable && p.category !== "scooter"),
    [],
  );
  const customizable = useMemo(() => products.filter((p) => p.customizable), []);
  const scooters = useMemo(() => products.filter((p) => p.category === "scooter"), []);

  // Shared filter state — applied to whichever tab is active.
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [materialFilter, setMaterialFilter] = useState<Material | "all">("all");
  const [minPrice, setMinPrice] = useState<number>(PRICE_MIN);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);

  const applyFilters = (items: Product[]) => {
    const q = search.trim().toLowerCase();
    return items.filter((p) => {
      if (typeFilter !== "all") {
        if (typeFilter === "mystery" && p.kind !== "mystery") return false;
        if (typeFilter === "print" && (p.kind !== "print" || p.customizable || p.category === "scooter"))
          return false;
        if (typeFilter === "custom" && !p.customizable) return false;
        if (typeFilter === "scooter" && p.category !== "scooter") return false;
      }
      if (materialFilter !== "all" && !p.materials.includes(materialFilter)) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      if (q) {
        const haystack = `${p.name} ${p.description} ${p.size} ${p.kind} ${p.category ?? ""}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  };

  const filtersActive =
    search.trim().length > 0 ||
    typeFilter !== "all" ||
    materialFilter !== "all" ||
    minPrice !== PRICE_MIN ||
    maxPrice !== PRICE_MAX;

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setMaterialFilter("all");
    setMinPrice(PRICE_MIN);
    setMaxPrice(PRICE_MAX);
  };

  const renderGrid = (items: Product[]) => {
    const filtered = applyFilters(items);
    if (filtered.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
          <p className="font-display text-lg font-semibold">No products match your filters</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try removing a filter or clearing your search.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-5 py-2 text-xs font-semibold text-primary-foreground transition-bounce hover:scale-105"
          >
            Reset filters
          </button>
        </div>
      );
    }
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    );
  };

  const selectClass =
    "h-10 rounded-full border border-border bg-card px-4 text-xs font-semibold uppercase tracking-wider transition-smooth focus:border-primary focus:outline-none";

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <Seo
        title="Shop — Layer Lab"
        description="Mystery boxes packed with precision-printed goods. Pick your size, unbox your surprise."
      />
      <div className="mb-10 text-center">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gradient">Our collection</div>
        <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
          Pick your <span className="text-gradient">surprise</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Browse mystery boxes, individual prints, and custom-made pieces. Filter by category to find
          exactly what you're after.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mx-auto mb-6 flex h-auto w-full max-w-3xl flex-wrap justify-center gap-1 p-1">
          <TabsTrigger value="all" className="flex-1 min-w-[120px]">
            All Products ({products.length})
          </TabsTrigger>
          <TabsTrigger value="mystery" className="flex-1 min-w-[120px]">
            Mystery Boxes ({mysteryBoxes.length})
          </TabsTrigger>
          <TabsTrigger value="prints" className="flex-1 min-w-[120px]">
            Prints ({prints.length})
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex-1 min-w-[120px]">
            Customizable ({customizable.length})
          </TabsTrigger>
          <TabsTrigger value="scooters" className="flex-1 min-w-[120px]">
            Scooters ({scooters.length})
          </TabsTrigger>
        </TabsList>

        {/* Filter bar */}
        <div className="mb-8 rounded-3xl border border-border bg-card/50 p-4 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name or keyword…"
                className="h-10 w-full rounded-full border border-border bg-background pl-11 pr-10 text-sm transition-smooth focus:border-primary focus:outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              className={selectClass}
              aria-label="Filter by type"
            >
              <option value="all">All Types</option>
              <option value="mystery">Mystery Box</option>
              <option value="print">Print</option>
              <option value="custom">Customizable</option>
              <option value="scooter">Scooter</option>
            </select>

            {/* Material filter */}
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value as Material | "all")}
              className={selectClass}
              aria-label="Filter by material"
            >
              <option value="all">All Materials</option>
              {allMaterials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            {/* Price range */}
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                €
              </label>
              <input
                type="number"
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
                className="h-10 w-20 rounded-full border border-border bg-card px-3 text-xs font-semibold transition-smooth focus:border-primary focus:outline-none"
                aria-label="Minimum price"
              />
              <span className="text-muted-foreground">–</span>
              <input
                type="number"
                min={PRICE_MIN}
                max={PRICE_MAX}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value) || PRICE_MAX)}
                className="h-10 w-20 rounded-full border border-border bg-card px-3 text-xs font-semibold transition-smooth focus:border-primary focus:outline-none"
                aria-label="Maximum price"
              />
            </div>

            {filtersActive && (
              <button
                onClick={resetFilters}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-4 text-xs font-semibold uppercase tracking-wider transition-smooth hover:border-primary/40"
              >
                <X className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>
        </div>

        <TabsContent value="all">{renderGrid(products)}</TabsContent>
        <TabsContent value="mystery">{renderGrid(mysteryBoxes)}</TabsContent>
        <TabsContent value="prints">{renderGrid(prints)}</TabsContent>
        <TabsContent value="custom">{renderGrid(customizable)}</TabsContent>
        <TabsContent value="scooters">{renderGrid(scooters)}</TabsContent>
      </Tabs>
    </div>
  );
}
