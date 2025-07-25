import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface Product {
  id: string
  product_title: string
  sub_title: string
  picture: {
    url: string
  }
  technology: string[]
}

async function getLatestProducts(): Promise<Product[]> {
  try {
    const response = await fetch("https://dokkiitech.microcms.io/api/v1/product?limit=4", {
      headers: {
        "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY || "",
      },
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }

    const data = await response.json()
    return data.contents || []
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export async function LatestProducts() {
  const products = await getLatestProducts()

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Latest Products
          </h2>
          <p className="text-xl text-muted-foreground">最新のプロダクト</p>
        </div>

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg border-2 hover:bg-muted/50 transition-all duration-300"
                asChild
              >
                <Link href="/products">
                  すべての作品を見る
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">プロダクトを準備中です...</p>
          </div>
        )}
      </div>
    </section>
  )
}
