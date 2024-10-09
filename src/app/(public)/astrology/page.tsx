import { getProductsUseCase } from "@/use-cases/products";
import AstrologyForm from "./astrology-form";
import { Breadcrumb } from "@/components/Breadcrumb";

export default async function AstrologyPage() {

    const products = await getProductsUseCase();

    const filteredProducts = products.map((product) => {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            imageUrl: product.imgProducts[0].imageUrl,
            price: product.price,
        }
    })


    return (
        <div className="flex flex-col min-h-full">
            {/* <Breadcrumb
                items={[
                    { label: 'Trang chủ', link: '/' },
                    { label: 'Tử vi', link: '/astrology' },
                ]}
            /> */}
            <AstrologyForm products={filteredProducts} />
        </div>
    )
}
