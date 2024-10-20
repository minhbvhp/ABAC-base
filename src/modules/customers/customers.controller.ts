import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Req,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomResponseType } from '../../utils/types/definitions';
import {
  CUSTOMER_NOT_FOUND,
  NOT_AUTHORIZED,
} from '../../utils/constants/messageConstants';
import { RequestWithUser } from '../../utils/types/request.type';
import {
  CaslAbilityFactory,
  Actions,
} from '../casl/casl-ability.factory/casl-ability.factory';
import Customer from './entities/customer.entity';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CheckPermissions } from '../../decorators/permissions.decorator';

@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @UseGuards(PermissionsGuard)
  @CheckPermissions([Actions.Read, 'Customer'])
  @UseGuards(JwtAccessTokenGuard)
  @Get(':id')
  async getCustomerById(
    @Param('id') id: string,
    @Req() request: RequestWithUser,
  ): Promise<CustomResponseType> {
    const { user } = request;

    const ability = await this.abilityFactory.createForUser(user);

    const customer = await this.customersService.getCustomerById(Number(id));

    if (!customer) {
      throw new NotFoundException(CUSTOMER_NOT_FOUND);
    }

    if (!ability.can(Actions.Read, customer)) {
      throw new ForbiddenException(NOT_AUTHORIZED);
    }

    const res: CustomResponseType = {
      message: 'Đã tìm thấy khách hàng',
      result: customer,
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
