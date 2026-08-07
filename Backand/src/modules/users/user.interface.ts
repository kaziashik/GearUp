export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
