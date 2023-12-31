export interface JiraUser {
  emailAddress: string;
  displayName: string;
  active: boolean;
  key: string;
  name: string;
  avatarUrls: AvatarUrls;
}
export interface AvatarUrls {
  '48x48': string;
  '24x24': string;
  '16x16': boolean;
  '32x32': string;
}
