import { Body, Controller, Put, Req } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { ProductDocument } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Put('create')
  async createProduct(
    @Body() createProduct: CreateProductDto,
    @Req() request: Request,
    @AuthUser() product: ProductDocument,
  ) {
    return this.productService.create(createProduct, request, product);
  }
}
