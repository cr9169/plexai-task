import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as propertiesData from '../../../data/properties.json';
import { GetPropertiesQueryDto, PropertyFilters } from './dto/get-properties-query.dto';
import { PaginatedResult } from './interfaces/paginated-result.interface';
import { Property } from './interfaces/property.interface';

@Injectable()
export class PropertiesService {
  private readonly properties: Property[] = propertiesData as Property[];

  private matchesFilters(
    property: Property,
    filters: PropertyFilters,
  ): boolean {
    const { city, type, minPrice, maxPrice } = filters;
    // exact case-insensitive match per spec — not substring
    if (city !== undefined && property.address.city.toLowerCase() !== city.toLowerCase()) return false;
    if (type !== undefined && property.type !== type) return false;
    if (minPrice !== undefined && property.purchasePrice < minPrice) return false;
    if (maxPrice !== undefined && property.purchasePrice > maxPrice) return false;
    return true;
  }

  findAll(query: GetPropertiesQueryDto): PaginatedResult<Property> {
    const { city, type, minPrice, maxPrice, page, limit } = query;

    if (minPrice !== undefined && maxPrice !== undefined && maxPrice < minPrice) {
      throw new BadRequestException('maxPrice must be greater than or equal to minPrice');
    }

    const matchingProperties = this.properties.filter((property) =>
      this.matchesFilters(property, { city, type, minPrice, maxPrice }),
    );

    const total = matchingProperties.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const pageResults = matchingProperties.slice(offset, offset + limit);

    return { data: pageResults, meta: { total, page, limit, totalPages } };
  }

  findOne(id: string): Property {
    const property = this.properties.find((property) => property.id === id);

    if (!property) {
      throw new NotFoundException(`Property with id '${id}' not found`);
    }

    return property;
  }
}
