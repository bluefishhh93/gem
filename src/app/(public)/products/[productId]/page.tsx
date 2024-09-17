import { getProductByIdUseCase } from "@/use-cases/products";
import ProductDetail from "./product-detail";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { productId: string } }) {



    const product = await getProductByIdUseCase(Number(params.productId));

    if (!product) {
        notFound();
    }

    return <ProductDetail product={product} />;
}
