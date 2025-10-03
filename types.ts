/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type UserRole = 'customer' | 'vendor' | 'super-admin' | 'delivery-staff';

export type User = {
  role: UserRole;
  name: string;
  email: string;
};
