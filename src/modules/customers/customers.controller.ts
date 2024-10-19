import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomResponseType } from '../../utils/types/definitions';
import { CUSTOMER_NOT_FOUND } from '../../utils/constants/messageConstants';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: string): Promise<CustomResponseType> {
    const result = await this.customersService.getCustomerById(Number(id));

    if (!result) {
      throw new NotFoundException(CUSTOMER_NOT_FOUND);
    }

    const res: CustomResponseType = {
      message: 'Đã tìm thấy khách hàng',
      result,
    };

    return res;
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
