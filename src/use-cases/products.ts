import { createProduct, deleteProduct, getProductById, getProductImages, getProducts, updateProduct } from "@/data-access/products";
import { deleteFromCloudinary, uploadMultipleToCloudinary } from "@/lib/cloudinary";
import { validateImage } from "@/util/util";

export async function getProductsUseCase() {
    const products = await getProducts();
    return products;
}

export async function getProductByIdUseCase(id: number) {
    const product = await getProductById(id);
    return product;
}

export async function deleteProductUseCase(id: number) {
    return deleteProduct(id);
}

export async function createProductUseCase({
    name,
    price,
    stock,
    description,
    categoryId,
    productImage
}: {
    name: string;
    price: number;
    stock: number;
    description: string;
    categoryId: number;
    productImage: File[];
}) {
    for (const image of productImage) {
        validateImage(image);
    }
    const uploadedImages = await uploadMultipleToCloudinary(productImage, {
        folder: 'products',
    });
    const images = uploadedImages.map(img => ({
        imageUrl: img.secure_url,
        publicId: img.public_id
    }));

    const newProduct = {
        name,
        price,
        currentQuantity: stock,
        description,
        isActivated: false,
        salePrice: price,
        categoryId
    };

    return createProduct({ newProduct, images });

}

export async function updateProductUseCase(
    { id, name, price, stock, description, categoryId, productImages, salePrice }: {
        id: number;
        name: string;
        price: number;
        stock: number;
        categoryId: number;
        description: string;
        productImages?: File[];
        salePrice: number;
    }
) {
    const product = await getProductById(id);

    if (!product) {
        throw new Error("Product not found");
    }

    let images: { imageUrl: string; publicId: string }[] | undefined;

    if (productImages && productImages.length > 0) {
        for (const image of productImages) {
            validateImage(image);
        }
        const oldImages = await getProductImages(id);
        if (oldImages && oldImages.length > 0) {
            const oldImagesPublicIds = oldImages.map(img => img.publicId).filter((id): id is string => id !== null);
            await Promise.all(oldImagesPublicIds.map(publicId => deleteFromCloudinary(publicId)));
        }

        const uploadedImages = await uploadMultipleToCloudinary(productImages, {
            folder: 'products',
        });
        images = uploadedImages.map(img => ({
            imageUrl: img.secure_url,
            publicId: img.public_id
        }));
    }

    const updatedProduct = {
        name,
        price,
        currentQuantity: stock,
        description,
        salePrice,
        categoryId
    };

    return updateProduct(id, updatedProduct, images);
}