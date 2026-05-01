import { useMemo } from "react";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { Seo } from "@/components/Seo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ShopPage() {
  const mysteryBoxes = useMemo(() => products.filter((p) => p.kind === "mystery"), []);
  const prints = useMemo(() => products.filter((p) => p.kind === "print" && !p.customizable && p.category !== "scooter"), []);
  const customizable = useMemo(() => products.filter((p) => p.customizable), []);
  const scooters = useMemo(() => products.filter((p) => p.category === "scooter"), []);

  const renderGrid = (items: typeof products) => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );

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
        <TabsList className="mx-auto mb-8 flex h-auto w-full max-w-2xl flex-wrap justify-center gap-1 p-1">
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
        </TabsList>

        <TabsContent value="all">{renderGrid(products)}</TabsContent>
        <TabsContent value="mystery">{renderGrid(mysteryBoxes)}</TabsContent>
        <TabsContent value="prints">{renderGrid(prints)}</TabsContent>
        <TabsContent value="custom">{renderGrid(customizable)}</TabsContent>
      </Tabs>
    </div>
  );
}
