import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { CategoryService } from './categories.service';
import { CreateCategoryDto } from './dto/create-categories';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  getCategory() {
    console.log('get');
    return this.categoryService.getCategory();
  }

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    console.log('a');
    return this.categoryService.create(createCategoryDto);
  }

  @Get('/:id')
  getDetailCategory(
    @Param('id') id: string,
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request,
  ) {
    return this.categoryService.getDetailCategory(id);
  }

  @Put('/:id')
  update(@Param('id') id: string) {
    return this.categoryService.update();
  }

  @Delete('/:id')
  deleteCategory() {
    return this.categoryService.deleteCategory();
  }
}
