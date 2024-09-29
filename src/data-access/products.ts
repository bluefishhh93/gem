import { database } from "@/db";
import { categories, Charm, imgProducts, NewProduct, OrderItem, Product, products, reviews } from "@/db/schema";
import { and, eq, gte, ilike, inArray, like, lte, sql } from "drizzle-orm";

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
    where: eq(products.id, id),
    with: {
      imgProducts: true,
      reviews: {
        with:{
          user: {
            with:{
              profile: true
            }
          },
          imgReviews: true,
        }
      }
    },
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

export async function getShopProducts({
  page = 1,
  pageSize = 12,
  search = '',
  category,
  minPrice = 0,
  maxPrice = Number.MAX_SAFE_INTEGER
}: {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
}) {
  const productsData = await database.query.products.findMany({
    where: and(
      like(products.name, `%${search}%`),
      category ? eq(products.categoryId, category) : undefined,
      gte(products.price, minPrice),
      lte(products.price, maxPrice),
    ),
    with: {
      imgProducts: true
    },
    limit: pageSize,
    offset: (page - 1) * pageSize
  })

  const totalProducts = await database.select({ count: sql<number>`count(*)` })
    .from(products)
    .where(and(
      ilike(products.name, `%${search}%`),
      category ? eq(products.categoryId, category) : undefined,
      gte(products.price, minPrice),
      lte(products.price, maxPrice),
    ));

  // Extract the count value
  const totalCount = totalProducts[0]?.count ?? 0;


  return {
    products: productsData,
    totalProducts: totalCount,
    page,
    pageSize
  }
}


// export async function getShopProducts({
//   page = 1,
//   pageSize = 12,
//   search = '',
//   category,
//   minPrice = 0,
//   maxPrice = Number.MAX_SAFE_INTEGER
// }: {
//   page?: number;
//   pageSize?: number;
//   search?: string;
//   category?: number;
//   minPrice?: number;
//   maxPrice?: number;
// }) {
//   const whereConditions = [
//     like(products.name, `%${search}%`),
//     category ? eq(products.categoryId, category) : undefined,
//     gte(products.price, minPrice),
//     lte(products.price, maxPrice)
//   ].filter(Boolean);

//   const productsResult = await database.select({
//     id: products.id,
//     name: products.name,
//     price: products.price,
//     description: products.description,
//     salePrice: products.salePrice,
//     currentQuantity: products.currentQuantity,
//     categoryId: products.categoryId,
//     images: sql<string>`
//       coalesce(
//         json_agg(
//           json_build_object(
//             'id', ${imgProducts.id},
//             'secure_url', ${imgProducts.imageUrl},
//             'public_id', ${imgProducts.publicId}
//           )
//         ) filter (where ${imgProducts.id} is not null),
//         '[]'::json
//       )::text
//     `,
//   })
//   .from(products)
//   .leftJoin(imgProducts, eq(products.id, imgProducts.productId))
//   .where(and(...whereConditions))
//   .groupBy(products.id)
//   .limit(pageSize)
//   .offset((page - 1) * pageSize);


//   const [{ count }] = await database.select({ 
//     count: sql`count(distinct ${products.id})`.mapWith(Number) 
//   })
//   .from(products)
//   .where(and(...whereConditions));

//   return {
//     products: productsResult.map(product => ({
//       ...product,
//       images: JSON.parse(product.images)
//     })),
//     totalProducts: count,
//     page,
//     pageSize
//   };
// }

export async function getCategories() {
  return database.select().from(categories).execute();
}

export async function checkIneficient(orderItems: {
  productId: number;
  quantity: number;
}[]) {
  const productIds = orderItems.map(item => item.productId).filter((id): id is number => id !== undefined);

  const productsCheck = await database.select().from(products).where(inArray(products.id, productIds));

  const insufficientProductIds = productsCheck
    .filter((product) => {
      const orderItem = orderItems.find(
        (item) => item.productId === product.id
      );
      return !orderItem || product.currentQuantity < orderItem.quantity;
    })
    .map((product) => product.id);

  return insufficientProductIds;
}
