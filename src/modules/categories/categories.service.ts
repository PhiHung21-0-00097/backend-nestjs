import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-categories';

@Injectable()
export class CategoryService {
  async getCategory() {
    console.log('123');
    return 'a123';
  }

  async create(createCategoryDto: CreateCategoryDto) {
    const data = await this.categoryModel.create({});
    return data;
  }

  async getDetailCategory(id: string) {
    return 'id: ' + id;
  }

  async update() {
    return 'update';
  }

  async deleteCategory() {
    return 'delete';
  }
}
