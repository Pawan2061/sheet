import { atom, selector } from "recoil";

export const authState = atom({
  key: "authState",
  default: JSON.parse(localStorage.getItem("authState") || "{}") || {
    isAuthenticated: false,
    user: null,
    token: null,
  },
});

export const authStatePersist = selector({
  key: "authStatePersist",
  get: ({ get }) => get(authState),
  set: ({ set }, newValue) => {
    set(authState, newValue);
    localStorage.setItem("authState", JSON.stringify(newValue));
  },
});
