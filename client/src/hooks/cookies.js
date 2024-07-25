import Cookie from "js-cookie";

export const SetCookie = (cookieName, cookie, remember) => {
  Cookie.set(cookieName, cookie, {
    expires: remember ? 7 : null,
    secure: true,
    sameSite: "strict",
    path: "/",
  });
};

export const GetCookie = (cookieName) => {
  return Cookie.get(cookieName);
};

export const RemoveCookie = (cookieName) => {
  Cookie.remove(cookieName);
};
