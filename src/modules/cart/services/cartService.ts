import { CartRepository } from "../repositories/cartRepository";

export class CartService {
  constructor(
    private readonly repository: CartRepository,
  ) {}

  async getOrCreateCart(
    restaurantId: string,
    tableId: string,
    sessionId: string | null,
  ) {
    const existing =
      await this.repository.getCartBySession(
        restaurantId,
        tableId,
        sessionId,
      );

    if (existing.error) {
      throw existing.error;
    }

    if (existing.data) {
      return existing.data;
    }

    const created =
      await this.repository.createCart({
        restaurantId,
        tableId,
        sessionId,
      });

    if (created.error) {
      throw created.error;
    }

    return created.data;
  }

  async getCartItems(cartId: string) {
    const result =
      await this.repository.getCartItems(cartId);

    if (result.error) {
      throw result.error;
    }

    return result.data;
  }

  async clearCart(cartId: string) {
    const result =
      await this.repository.clearCartItems(cartId);

    if (result.error) {
      throw result.error;
    }
  }

  async deleteCart(cartId: string) {
    const result =
      await this.repository.deleteCart(cartId);

    if (result.error) {
      throw result.error;
    }
  }
}