type TUniqueIndexObject = { constraint: string; message: string };

const usernameMessage = 'Username is already taken';
const emailMessage = 'Email is already taken';

export const attendeeUsernameIndex: TUniqueIndexObject = {
  constraint: 'UQ_attendee_username',
  message: usernameMessage,
};

export const manufacturerUsernameIndex: TUniqueIndexObject = {
  constraint: 'UQ_manufacturer_username',
  message: usernameMessage,
};

export const attendeeEmailIndex: TUniqueIndexObject = {
  constraint: 'UQ_attendee_email',
  message: emailMessage,
};

export const manufacturerEmailIndex: TUniqueIndexObject = {
  constraint: 'UQ_manufacturer_email',
  message: emailMessage,
};

export const CONSUMABLE_BRAND_INDEX: TUniqueIndexObject = {
  constraint: 'UQ_brand',
  message: 'Brand already exists',
};
