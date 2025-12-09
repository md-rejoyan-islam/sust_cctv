"use server";

import { cookies } from "next/headers";
export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  return {
    success: true,
    message: "Logged out successfully",
  };
};

export const getCookie = async (name: string) => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(name);
  return cookie ? cookie.value : null;
};

export const setCookie = async (name: string, value: string) => {
  const cookieStore = await cookies();

  cookieStore.set(name, value, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });
};

export const deleteCookie = async (name: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(name);
};
