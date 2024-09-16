import { database } from "@/db";
import { categories, Charm, imgProducts, NewProduct, Product, products } from "@/db/schema";
import { eq, gte, like, lte } from "drizzle-orm";

// export async function getProducts() {
//   return (await database.select()
//     .from(products)
//     .leftJoin(imgProducts, eq(products.id, imgProducts.productId)));
// }

export async function getProducts() {
  return await database.query.products.findMany({
    with: {
      category: true,
      imgProducts: true
    },
  });
}

export async function getProductById(id: number) {
  return await database.query.products.findFirst({
    where: eq(products.id, id)
  })
}

export async function createProduct({ newProduct, images }: { newProduct: NewProduct, images: { imageUrl: string, publicId: string }[] }) {
  return await database.transaction(async (tx) => {
    const [product] = await tx.insert(products).values(newProduct).returning();
    if (images.length > 0) {
      const imagesWithProductId = images.map((image) => ({
        imageUrl: image.imageUrl,
        publicId: image.publicId,
        productId: product.id
      }))
      await tx.insert(imgProducts).values(imagesWithProductId)
    }
    return product;
  })
}

export async function updateProduct(
  id: number,
  productData: Partial<Product>,
  newImages?: { imageUrl: string; publicId: string }[]
) {
  return await database.transaction(async (tx) => {
    // Update product
    const [updatedProduct] = await tx
      .update(products)
      .set(productData)
      .where(eq(products.id, id))
      .returning();

    if (!updatedProduct) {
      throw new Error(`Product with id ${id} not found`);
    }

    // Handle images if provided
    if (newImages && newImages.length > 0) {
      // Delete existing images
      await tx
        .delete(imgProducts)
        .where(eq(imgProducts.productId, id));

      // Insert new images
      await tx
        .insert(imgProducts)
        .values(newImages.map(img => ({ ...img, productId: id })));
    }

    // Fetch updated product with images
    const productWithImages = await tx.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        imgProducts: true
      }
    });

    return productWithImages;
  });
}

export async function deleteProduct(id: number) {
  await database.delete(products).where(eq(products.id, id))
}

export async function getProductImages(productId: number) {
  return await database.select().from(imgProducts).where(eq(imgProducts.productId, productId))
}

// export async function getShopProducts(
//   {
//     page,
//     pageSize,
//     search,
//     category,
//     minPrice,
//     maxPrice
//   }: {
//     page: number;
//     pageSize: number;
//     search: string;
//     category: string;
//     minPrice: number;
//     maxPrice: number;
//   }
// ) {
//   let query = database.select().from(products);

//   if (search) {
//     query = query.where(like(products.name, `%${search}%`));
//   }

//   if (category) {
//     query = query.where(eq(products.categoryId, parseInt(category)));
//   }

//   if (minPrice !== undefined) {
//     query = query.where(gte(products.price, minPrice));
//   }

//   if (maxPrice !== undefined) {
//     query = query.where(lte(products.price, maxPrice));
//   }

//   const totalProducts = await query.execute().then((res) => res.length);

//   const productsResult = await query
//     .limit(pageSize)
//     .offset((page - 1) * pageSize)
//     .execute();

//   return { products: productsResult, totalProducts };
// }

// export async function getCategories() {
//   return database.select().from(categories).execute();
// }
