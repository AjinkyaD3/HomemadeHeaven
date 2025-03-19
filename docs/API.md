# API Documentation

## Authentication

### Sign Up
```typescript
POST /auth/signup
{
  email: string;
  password: string;
}
```

### Sign In
```typescript
POST /auth/signin
{
  email: string;
  password: string;
}
```

### Reset Password
```typescript
POST /auth/reset-password
{
  email: string;
}
```

## Products

### Get Products
```typescript
GET /products
Query Parameters:
  - category?: string
  - search?: string
  - sort?: string
  - page?: number
  - limit?: number
```

### Get Product
```typescript
GET /products/:id
```

### Create Product
```typescript
POST /products
{
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  customizable: boolean;
  materials: string[];
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
}
```

### Update Product
```typescript
PUT /products/:id
{
  name?: string;
  description?: string;
  price?: number;
  // ... other fields
}
```

## Orders

### Create Order
```typescript
POST /orders
{
  items: Array<{
    productId: string;
    quantity: number;
    customizations?: Record<string, any>;
  }>;
  shippingAddressId: string;
  billingAddressId: string;
  paymentMethod: string;
}
```

### Get Orders
```typescript
GET /orders
Query Parameters:
  - status?: string
  - from?: string
  - to?: string
  - page?: number
  - limit?: number
```

### Get Order
```typescript
GET /orders/:id
```

### Update Order Status
```typescript
PUT /orders/:id/status
{
  status: string;
  note?: string;
}
```

## Categories

### Get Categories
```typescript
GET /categories
```

### Create Category
```typescript
POST /categories
{
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}
```

### Update Category
```typescript
PUT /categories/:id
{
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}
```

## Coupons

### Create Coupon
```typescript
POST /coupons
{
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: string;
  endDate: string;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
}
```

### Validate Coupon
```typescript
POST /coupons/validate
{
  code: string;
  cartTotal: number;
}
```

### Get Coupons
```typescript
GET /coupons
Query Parameters:
  - active?: boolean
  - type?: string
```

## Addresses

### Get Addresses
```typescript
GET /addresses
```

### Create Address
```typescript
POST /addresses
{
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}
```

### Update Address
```typescript
PUT /addresses/:id
{
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}
```

## Reviews

### Create Review
```typescript
POST /reviews
{
  productId: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
}
```

### Get Product Reviews
```typescript
GET /products/:id/reviews
Query Parameters:
  - sort?: string
  - page?: number
  - limit?: number
```

## Favorites

### Add to Favorites
```typescript
POST /favorites
{
  productId: string;
}
```

### Remove from Favorites
```typescript
DELETE /favorites/:productId
```

### Get Favorites
```typescript
GET /favorites
```

## User Profile

### Get Profile
```typescript
GET /profile
```

### Update Profile
```typescript
PUT /profile
{
  firstName?: string;
  lastName?: string;
  phone?: string;
}
```

### Change Password
```typescript
PUT /profile/password
{
  currentPassword: string;
  newPassword: string;
}
```

## Error Responses

All endpoints return errors in the following format:

```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

Common error codes:
- `auth/invalid-credentials`: Invalid email or password
- `auth/email-already-exists`: Email is already registered
- `validation/invalid-input`: Invalid request data
- `not-found`: Requested resource not found
- `forbidden`: User doesn't have permission
- `server-error`: Internal server error

## Rate Limiting

All API endpoints are rate-limited:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Authentication

All endpoints except public ones require authentication via Bearer token:

```
Authorization: Bearer <token>
```

## Pagination

Paginated endpoints return data in the following format:

```typescript
{
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }
}
```