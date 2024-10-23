export type CustomResponseType = {
  message: string;
  result: any;
};

export enum ROLES {
  ADMIN = 'Admin',
  SALES = 'Sales',
  ACCOUNTANT = 'Accountant',
}

export enum SUBJECTS {
  CUSTOMER = 'Customer',
  USER = 'User',
}

export enum ACTIONS {
  MANAGE = 'manage',
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
}
