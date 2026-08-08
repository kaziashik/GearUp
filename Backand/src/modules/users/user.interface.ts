export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  address?: string;
  image?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
