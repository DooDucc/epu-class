import { authorizedApi } from "../base";

export const updateUserProfile = async (data: any) => {
  try {
    await authorizedApi.put("/auth/profile", data);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
