export const USERS = {
  standard: {
    username: process.env.USER_NAME ?? 'standard_user',
    password: process.env.USER_PASSWORD ?? 'secret_sauce',
  },
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  error: {
    username: 'error_user',
    password: 'secret_sauce',
  },
} as const;

export const PRODUCTS = {
  backpack:      'Sauce Labs Backpack',
  bikeLight:     'Sauce Labs Bike Light',
  boltTshirt:    'Sauce Labs Bolt T-Shirt',
  fleeceJacket:  'Sauce Labs Fleece Jacket',
  onesie:        'Sauce Labs Onesie',
  redTshirt:     'Test.allTheThings() T-Shirt (Red)',
} as const;

export const CHECKOUT_INFO = {
  firstName:  'Test',
  lastName:   'Automation',
  postalCode: '94102',
} as const;

export const ERROR_MESSAGES = {
  usernameRequired:     'Epic sadface: Username is required',
  passwordRequired:     'Epic sadface: Password is required',
  credentialsMismatch:  'Epic sadface: Username and password do not match any user in this service',
  lockedOut:            'Epic sadface: Sorry, this user has been locked out.',
  firstNameRequired:    'Error: First Name is required',
  lastNameRequired:     'Error: Last Name is required',
  postalCodeRequired:   'Error: Postal Code is required',
} as const;

export const PRODUCT_DETAILS = {
  backpack: {
    name:                'Sauce Labs Backpack',
    descriptionFragment: 'carry.allTheThings()',
    price:               '$29.99',
  },
} as const;
