import { BaseService } from "@/modules/core/services/base.service";
import { RestaurantRepository } from "../repositories/restaurant.repository";

export class RestaurantService extends BaseService {
  private readonly repository = new RestaurantRepository();

  async findByDomain(domain: string) {
    return this.repository.findByDomain(domain);
  }

  async resolveByDomain(domain: string) {
    const restaurant = await this.findByDomain(domain);

    if (!restaurant) {
      throw new Error(`Restaurant not found for domain "${domain}".`);
    }

    return restaurant;
  }

  async findById(id: string) {
    return this.repository.findById(id);
  }

  async getById(id: string) {
    const restaurant = await this.findById(id);

    if (!restaurant) {
      throw new Error(`Restaurant "${id}" not found.`);
    }

    return restaurant;
  }
}