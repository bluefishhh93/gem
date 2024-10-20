import { Many, relations } from "drizzle-orm";
import {
  timestamp,
  text,
  pgEnum,
  serial,
  boolean,
  pgTable,
  integer,
  doublePrecision,
  index,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const accountTypeEnum = pgEnum("type", ["email", "google", "github"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "refunded", "failed"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "processing", "canceled", "cancelling", "completed"]);
export const paymentMethodEnum = pgEnum("payment_method", ["cod", "vnpay", "payos"]);
export const shippingStatusEnum = pgEnum("shipping_status", ["pending", "processing", "shipping", "delivered", "failed"]);

export const users = pgTable("gf_user", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accounts = pgTable("gf_accounts", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountType: accountTypeEnum("accountType").notNull(),
  githubId: text("githubId").unique(),
  googleId: text("googleId").unique(),
  password: text("password"),
  salt: text("salt"),
});

export const magicLinks = pgTable("gf_magic_links", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  token: text("token"),
  tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
});

export const resetTokens = pgTable("gf_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  token: text("token"),
  tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
});

export const verifyEmailTokens = pgTable("gf_verify_email_tokens", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  token: text("token"),
  tokenExpiresAt: timestamp("tokenExpiresAt", { mode: "date" }),
});

export const profiles = pgTable("gf_profile", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  displayName: text("displayName"),
  imageId: text("imageId"),
  image: text("image"),
  bio: text("bio").notNull().default(""),
});

export const sessions = pgTable("gf_session", {
  id: text("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const notifications = pgTable("gf_notifications", {
  id: serial("id").primaryKey(),
  userId: serial("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  postId: integer("postId"),
  isRead: boolean("isRead").notNull().default(false),
  type: text("type").notNull(),
  message: text("message").notNull(),
  createdOn: timestamp("createdOn", { mode: "date" }).notNull(),
});
//*================================================

// ImgProduct
export const imgProducts = pgTable("img_products", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  publicId: text("public_id").notNull(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
});

// ImgReview
export const imgReviews = pgTable("img_reviews", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  publicId: text("public_id").notNull(),
  reviewId: integer("review_id").references(() => reviews.id, { onDelete: "cascade" }),
});

// Review
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  comment: text("comment"),
  rating: integer("rating").notNull(),
  userId: integer("user_id").references(() => users.id),
  productId: integer("product_id").references(() => products.id),
  orderItemId: integer("order_item_id").references(() => orderItems.id),
  createdAt: timestamp("created_at").defaultNow(),
},
  (t) => ({
    productIdIndex: index('product_id_index').on(t.productId),
    createdAtAndIdIndex: index('created_at_and_id_index').on(t.createdAt, t.id).asc(),
  }),
);

// Product
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  currentQuantity: integer("current_quantity").notNull(),
  price: doublePrecision("price").notNull(),
  salePrice: doublePrecision("sale_price").notNull(),
  isActivated: boolean("is_activated").notNull().default(true),
  categoryId: integer("category_id").notNull().references(() => categories.id),
});

// Category
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isActive: boolean("is_active").default(true),
});

//  order 
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  total: doublePrecision("total").notNull(),
  orderStatus: orderStatusEnum("order_status").default("pending"),
  shipAddress: text("ship_address").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").notNull(),
  trackingNumber: text("tracking_number"),
  shippingStatus: shippingStatusEnum("shipping_status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  shipDate: timestamp("ship_date"),
});

//order items
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id),
  customBraceletId: integer("custom_bracelet_id").references(() => customBracelets.id),
  quantity: integer("quantity").notNull(),
  subtotal: doublePrecision("subtotal").notNull(),
  isRated: boolean("is_rated").default(false),
  isCustomBracelet: boolean("is_custom_bracelet").default(false),
});

export const discounts = pgTable("discounts", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  discount: doublePrecision("discount").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
});


//
export const strings = pgTable("strings", {
  id: serial("id").primaryKey(),
  color: text("color").notNull(),
  material: text("material").notNull(),
  price: doublePrecision("price").notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url").notNull(),

});

export const charms = pgTable("charms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: doublePrecision("price").notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: text("image_url").notNull(),
});

export const braceletCharms = pgTable("bracelet_charms", {
  id: serial("id").primaryKey(),
  braceletId: integer("bracelet_id").references(() => customBracelets.id, { onDelete: "cascade" }),
  charmId: integer("charm_id").references(() => charms.id),
  position: doublePrecision("position").notNull(),
});

export const customBracelets = pgTable("custom_bracelets", {
  id: integer("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  stringId: integer("string_id").references(() => strings.id),
  totalPrice: doublePrecision("total_price").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// blog
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  published: boolean("published").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});


export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  imgProducts: many(imgProducts),
  orderItems: many(orderItems),
  reviews: many(reviews),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  customBracelet: one(customBracelets, {
    fields: [orderItems.customBraceletId],
    references: [customBracelets.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  orderItem: one(orderItems, {
    fields: [reviews.orderItemId],
    references: [orderItems.id],
  }),
  imgReviews: many(imgReviews),
}));

export const customBraceletRelations = relations(customBracelets, ({ one, many }) => ({
  user: one(users, {
    fields: [customBracelets.userId],
    references: [users.id],
  }),
  string: one(strings, {
    fields: [customBracelets.stringId],
    references: [strings.id],
  }),
  charms: many(braceletCharms),
}));

export const braceletCharmRelations = relations(braceletCharms, ({ one }) => ({
  bracelet: one(customBracelets, {
    fields: [braceletCharms.braceletId],
    references: [customBracelets.id],
  }),
  charm: one(charms, {
    fields: [braceletCharms.charmId],
    references: [charms.id],
  }),
}));

export const imgProductsRelations = relations(imgProducts, ({ one }) => ({
  product: one(products, {
    fields: [imgProducts.productId],
    references: [products.id],
  }),
}));

export const imgReviewsRelations = relations(imgReviews, ({ one }) => ({
  review: one(reviews, {
    fields: [imgReviews.reviewId],
    references: [reviews.id],
  }),
}));

export const usersRelations = relations(users, ({ one }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

/**
 * newsletters - although the emails for the newsletter are tracked in Resend, it's beneficial to also track
 * sign ups in your own database in case you decide to move to another email provider.
 * The last thing you'd want is for your email list to get lost due to a
 * third party provider shutting down or dropping your data.
 */
export const newsletters = pgTable("gf_newsletter", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
});


export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export type ImgProduct = typeof imgProducts.$inferSelect;
export type ImgReview = typeof imgReviews.$inferSelect;

export type String = typeof strings.$inferSelect;
export type NewString = typeof strings.$inferInsert;

export type Charm = typeof charms.$inferSelect;
export type NewCharm = typeof charms.$inferInsert;

export type CustomBracelet = typeof customBracelets.$inferSelect;
export type BraceletCharm = typeof braceletCharms.$inferSelect;

export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;

