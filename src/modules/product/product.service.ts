import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product';
import { Product, ProductDocument } from './product.entity';
import { BaseService } from 'src/base/base.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class ProductService extends BaseService<ProductDocument> {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    // private readonly productService: ProductService,
  ) {
    super(productModel);
  }

  async checkProduct(name: string) {
    const user = await this.productModel.findOne({
      name,
    });
    return user;
  }
  async create(
    createProduct: CreateProductDto,
    req: Request,
    _product?: ProductDocument,
  ) {
    try {
      const alreadyProduct = await this.checkProduct(createProduct?.name);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          err,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
