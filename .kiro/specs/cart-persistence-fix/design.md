# Design Document

## Overview

The cart persistence fix will implement a unified cart management system that uses Shopify's Cart API to maintain session continuity between the headless Next.js app and the main Shopify store. The solution replaces the current form-based cart submissions with proper API calls and implements robust cart token management.

## Architecture

### Current Architecture Issues
- Form submissions with `target="_blank"` create isolated browser contexts
- No cart token persistence between domains
- Mixed cart management approaches (localStorage + form submissions)

### New Architecture
```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   Next.js App       │    │   Cart Manager       │    │   Shopify Store     │
│ (eco-bambo.vercel)  │◄──►│   (Unified API)      │◄──►│   (ecobambo.com)    │
└─────────────────────┘    └──────────────────────┘    └─────────────────────┘
                                      │
                                      ▼
                           ┌──────────────────────┐
                           │   Cart Token Store   │
                           │   (localStorage +    │
                           │    sessionStorage)   │
                           └──────────────────────┘
```

## Components and Interfaces

### 1. Unified Cart Manager (`lib/cartManager.js`)

**Purpose**: Central cart management using Shopify's Cart API

**Key Methods**:
```javascript
class CartManager {
  // Cart token management
  async getOrCreateCart()
  async getCartToken()
  setCartToken(token)
  
  // Cart operations
  async addToCart(variantId, quantity)
  async getCart()
  async updateCartItem(lineId, quantity)
  async removeFromCart(lineId)
  
  // Session management
  async syncWithShopifyCart()
  async ensureCartContinuity()
}
```

### 2. Enhanced Cart Context (`context/CartContext.tsx`)

**Purpose**: React context that integrates with the unified cart manager

**State Management**:
- Remove localStorage-only approach
- Integrate with Shopify Cart API
- Maintain UI state synchronization

### 3. Updated AddToCart Component (`components/AddToCart.jsx`)

**Purpose**: Replace form submissions with API calls

**Key Changes**:
- Remove form-based submissions
- Use CartManager for all operations
- Provide proper loading states and error handling

### 4. Cart Synchronization Service (`lib/cartSync.js`)

**Purpose**: Handle cross-domain cart synchronization

**Features**:
- Detect existing Shopify cart sessions
- Merge local and remote cart states
- Handle cart token expiration

## Data Models

### Cart Token Storage
```javascript
// localStorage structure
{
  "shopify_cart_token": "cart_token_string",
  "cart_expires_at": "2024-01-01T00:00:00Z",
  "last_sync": "2024-01-01T00:00:00Z"
}
```

### Cart State Interface
```typescript
interface CartState {
  id: string;
  token: string;
  lines: CartLine[];
  totalQuantity: number;
  cost: {
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    image?: {
      url: string;
    };
  };
}
```

## Error Handling

### Cart Token Expiration
- **Detection**: API calls return 404 or invalid token errors
- **Recovery**: Create new cart and migrate items if possible
- **User Experience**: Transparent recovery without data loss

### Network Failures
- **Retry Logic**: Exponential backoff for API calls
- **Offline Support**: Queue operations when offline
- **User Feedback**: Clear error messages and retry options

### Cross-Origin Issues
- **CORS Handling**: Use proper headers and credentials
- **Fallback Strategy**: Graceful degradation to form submission if API fails
- **Domain Validation**: Ensure operations target correct Shopify domain

## Testing Strategy

### Unit Tests
- Cart token management functions
- API call error handling
- Cart state synchronization logic

### Integration Tests
- Cross-domain cart persistence
- API integration with Shopify
- Cart operations flow (add, update, remove)

### End-to-End Tests
- User journey across both domains
- Cart persistence across browser sessions
- Checkout flow completion

### Manual Testing Scenarios
1. Add item from Next.js page → Verify on Shopify theme
2. Add item from Shopify theme → Verify on Next.js page
3. Add multiple items from Next.js → Verify accumulation
4. Browser refresh → Verify cart persistence
5. Cross-domain navigation → Verify cart consistency

## Implementation Phases

### Phase 1: Cart API Integration
- Implement unified CartManager
- Replace form submissions with API calls
- Basic cart token persistence

### Phase 2: Cross-Domain Synchronization
- Implement cart synchronization service
- Handle existing cart detection
- Merge cart states properly

### Phase 3: Enhanced Error Handling
- Robust token expiration handling
- Network failure recovery
- User experience improvements

### Phase 4: Testing and Optimization
- Comprehensive testing suite
- Performance optimization
- Documentation and monitoring

## Security Considerations

### Token Management
- Store cart tokens securely in localStorage
- Implement token rotation when possible
- Clear expired tokens automatically

### API Security
- Use HTTPS for all API calls
- Validate response data structure
- Sanitize user inputs before API calls

### Cross-Domain Safety
- Validate domain origins
- Use secure cookie settings where applicable
- Implement CSRF protection for sensitive operations