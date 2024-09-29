export enum PaymentMethod {
    COD = 'cod',
    VNPAY = 'vnpay',
  }
  
  export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded',
  }
  
  export enum ShippingStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPING = 'shipping',
    DELIVERED = 'delivered',
    FAILED = 'failed',
  }
  
  export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    CANCELED = 'canceled',
    CANCELLING = 'cancelling',
    COMPLETED = 'completed',
  }