import { getProductByIdUseCase } from "@/use-cases/products";

export default async function ProductPage({ params }: { params: { productId: string } }) {
    const product = await getProductByIdUseCase(Number(params.productId));
    return <div>{product?.name}</div>;
}
