type TConstraintObject = { constraint: string; message: string };

const usernameMessage = 'Username is already taken';
const emailMessage = 'Email is already taken';

export const attendeeUsernameIndex: TConstraintObject = {
  constraint: 'UQ_attendee_username',
  message: usernameMessage,
};

export const manufacturerUsernameIndex: TConstraintObject = {
  constraint: 'UQ_manufacturer_username',
  message: usernameMessage,
};

export const attendeeEmailIndex: TConstraintObject = {
  constraint: 'UQ_attendee_email',
  message: emailMessage,
};

export const manufacturerEmailIndex: TConstraintObject = {
  constraint: 'UQ_manufacturer_email',
  message: emailMessage,
};

export const CONSUMABLE_BRAND_INDEX: TConstraintObject = {
  constraint: 'UQ_brand',
  message: 'Brand already exists',
};

export const ATTENDEE_INSSUFICIENT_FUNDS_CONSTRAINT: TConstraintObject = {
  constraint: 'positive_funds',
  message: 'Attendee has insufficient funds',
};
