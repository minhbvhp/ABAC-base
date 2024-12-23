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
  Query,
  ConflictException,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import {
  ACTIONS,
  CustomResponseType,
  SUBJECTS,
} from '../../utils/types/definitions';
import {
  CUSTOMER_ALREADY_EXISTED,
  CUSTOMER_NOT_FOUND,
  NOT_AUTHORIZED,
} from '../../utils/constants/messageConstants';
import { RequestWithUser } from '../../utils/types/request.type';
import { CaslAbilityFactory } from '../casl/casl-ability.factory/casl-ability.factory';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CheckPermissions } from '../../decorators/permissions.decorator';
import { PaginationDto } from '../pagination/pagination.dto';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAccessTokenGuard)
@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;
    const result = await this.customersService.createCustomer(
      createCustomerDto,
      user.id,
    );

    if (!result) {
      throw new ConflictException(CUSTOMER_ALREADY_EXISTED, {
        cause: new Error('Create customer service return null'),
        description: 'Conflict',
      });
    }

    const res: CustomResponseType = {
      message: 'Đã tạo khách hàng mới',
      result,
    };

    return res;
  }

  @UseGuards(PermissionsGuard)
  @CheckPermissions([ACTIONS.READ, SUBJECTS.CUSTOMER])
  @Get()
  async getAllCustomers(
    @Query() paginationDto: PaginationDto,
    @Req() request: RequestWithUser,
  ): Promise<CustomResponseType> {
    const { user } = request;

    const ability = await this.abilityFactory.createForUser(user);

    const condition = ability.rules.find(
      (r) => r.action === ACTIONS.READ && r.subject === SUBJECTS.CUSTOMER,
    ).conditions;

    const { current, total } = paginationDto;
    const customers = await this.customersService.getAllCustomers(
      current,
      total,
      condition,
    );

    const res: CustomResponseType = {
      message: 'Tìm tất cả khách hàng',
      result: customers,
    };

    return res;
  }

  @UseGuards(PermissionsGuard)
  @CheckPermissions([ACTIONS.READ, SUBJECTS.CUSTOMER])
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

    if (!ability.can(ACTIONS.READ, customer)) {
      throw new ForbiddenException(NOT_AUTHORIZED);
    }

    const res: CustomResponseType = {
      message: 'Đã tìm thấy khách hàng',
      result: customer,
    };

    return res;
  }
}
