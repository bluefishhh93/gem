export enum PaymentMethod {
    COD = 'cod',
    VNPAY = 'vnpay',
  }
  
  export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
  }
  
  export enum ShippingStatus {
    PENDING = 'pending',
    SHIPPING = 'shipping',
    SHIPPED = 'shipped',
  }
  
  export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELED = 'canceled',
  }