import { getProductByIdUseCase } from "@/use-cases/products";
import ProductDetail from "./product-detail";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { productId: string } }) {

    if(!params.productId || isNaN(Number(params.productId))) {
        return notFound();
    }

    const product = await getProductByIdUseCase(Number(params.productId));

    if (!product) {
        return notFound();
    }

    return <ProductDetail product={product} />;
}
