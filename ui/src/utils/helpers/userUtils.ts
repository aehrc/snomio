import { JiraUser } from '../../types/JiraUserResponse.ts';
import { UserDetails } from '../../types/task.ts';

export function mapUserToUserDetail(
  username: string,
  userList: JiraUser[],
): UserDetails | undefined {
  const jiraUser=  userList.find(function (user) {
    return user.name === username;
  });
  if (jiraUser === undefined) {
    return undefined;
  }
  const userDetail: UserDetails = {
    email: jiraUser.emailAddress,
    displayName: jiraUser.displayName,
    username: jiraUser.name,
    avatarUrl: jiraUser.avatarUrls["48x48"],
  };
  return userDetail;
}
export function mapToUserNameArray(userList: UserDetails[]): string[] {
  const userNameList: string[] = userList.map(function (user) {
    return user.username;
  });
  return userNameList;
}

export function mapToUserOptions(userList: JiraUser[]) {
  const emailList = userList.map(function (user) {
    return {value:user.name, label:user.displayName};
  });
  return emailList;
}

export function getGravatarUrl(username:string, userList: JiraUser[]): string {
  const user = findJiraUserFromList(username, userList);
  return user === undefined ? "" : user.avatarUrls["48x48"]+"&d=monsterid" ;
}
export function getDisplayName(username:string, userList: JiraUser[]): string {
  return findJiraUserFromList(username, userList)?.displayName as string;
}
export function findJiraUserFromList(username:string, userList: JiraUser[]){
  const filteredUser=  userList.find(function (user) {
    return user.name === username;
  });
  return filteredUser;
}
export function userExistsInList(
  userList: UserDetails[],
  userName: string,
): boolean {
  if (userList == undefined) {
    return false;
  }
  const user = userList.find(function (u) {
    return u && u.username === userName;
  });
  return user !== undefined;
}
