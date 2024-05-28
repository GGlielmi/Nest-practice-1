type TUniqueIndexObject = { constraint: string; message: string };

export const USERNAME_INDEX: TUniqueIndexObject = {
  constraint: 'UQ_username',
  message: 'Username is already taken',
};

export const USER_EMAIL_INDEX: TUniqueIndexObject = {
  constraint: 'UQ_email',
  message: 'Email is already taken',
};

export const CONSUMABLE_BRAND_INDEX: TUniqueIndexObject = {
  constraint: 'UQ_brand',
  message: 'Brand already exists',
};
